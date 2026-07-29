-- ============================================================
--  MIGRATION 3: multi-image slide decks + admin content access.
--
--  1. lesson_slides table — one row per generated slide image,
--     owned by a `lessons` row (one class session -> many slides).
--  2. is_admin() helper + admin bypass on weeks/lessons/lesson_slides
--     SELECT policies, so an admin account (profiles.role = 'admin')
--     can preview all course content without needing a fake
--     enrolments row — previously RLS blocked admins exactly like
--     any other unenrolled user.
--
--  Run this once in the Supabase SQL Editor against your live
--  database, after fix_enrolments_rls.sql and
--  fix_schema_and_lesson_access.sql.
-- ============================================================

-- ── 1. lesson_slides table ──────────────────────────────────
-- lesson_id is TEXT to match lessons.id, which is a slug-style TEXT
-- primary key with no default (same convention as courses.id) — not
-- a UUID.
CREATE TABLE IF NOT EXISTS public.lesson_slides (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id    TEXT NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  slide_index  INT  NOT NULL,
  storage_path TEXT NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (lesson_id, slide_index)
);

ALTER TABLE public.lesson_slides ENABLE ROW LEVEL SECURITY;

-- ── 2. is_admin() helper ────────────────────────────────────
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN LANGUAGE sql STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- ── 3. Admin bypass on weeks SELECT ─────────────────────────
DROP POLICY IF EXISTS "Enrolled students can view weeks" ON public.weeks;
DROP POLICY IF EXISTS "Admins and enrolled students can view weeks" ON public.weeks;

CREATE POLICY "Admins and enrolled students can view weeks"
  ON public.weeks FOR SELECT
  USING (
    public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.enrolments e
      WHERE e.student_id = auth.uid()
        AND e.course_id  = weeks.course_id
    )
  );

-- ── 4. Admin bypass on lessons SELECT ───────────────────────
DROP POLICY IF EXISTS "Enrolled students can view lessons" ON public.lessons;
DROP POLICY IF EXISTS "Enrolled students can view unlocked lessons" ON public.lessons;
DROP POLICY IF EXISTS "Admins and enrolled students can view unlocked lessons" ON public.lessons;

CREATE POLICY "Admins and enrolled students can view unlocked lessons"
  ON public.lessons FOR SELECT
  USING (
    public.is_admin()
    OR EXISTS (
      SELECT 1
        FROM public.weeks w
        JOIN public.enrolments e ON e.course_id = w.course_id
       WHERE w.id = lessons.week_id
         AND e.student_id = auth.uid()
         AND (
           e.tier = 'paid'
           OR (
             e.tier = 'deposited'
             AND NOT (
               e.payment_deadline IS NOT NULL
               AND NOW() > e.payment_deadline
               AND w.week_number > e.waterline_week
             )
           )
         )
    )
  );

-- ── 5. lesson_slides SELECT policy ──────────────────────────
DROP POLICY IF EXISTS "Admins and enrolled students can view unlocked lesson slides" ON public.lesson_slides;

CREATE POLICY "Admins and enrolled students can view unlocked lesson slides"
  ON public.lesson_slides FOR SELECT
  USING (
    public.is_admin()
    OR EXISTS (
      SELECT 1
        FROM public.lessons l
        JOIN public.weeks w ON w.id = l.week_id
        JOIN public.enrolments e ON e.course_id = w.course_id
       WHERE l.id = lesson_slides.lesson_id
         AND e.student_id = auth.uid()
         AND (
           e.tier = 'paid'
           OR (
             e.tier = 'deposited'
             AND NOT (
               e.payment_deadline IS NOT NULL
               AND NOW() > e.payment_deadline
               AND w.week_number > e.waterline_week
             )
           )
         )
    )
  );

-- No INSERT/UPDATE policy on lesson_slides: rows are written
-- exclusively by scripts/slides/publish.mjs using the service-role
-- client, which bypasses RLS — same reasoning as enrolments/payments.

-- ── 6. Storage bucket for slide images ──────────────────────
-- Creates a private 'slides' bucket. Actual per-slide access is
-- granted only through short-lived signed URLs, gated by the
-- storage.objects policy below — the bucket itself is never public.
INSERT INTO storage.buckets (id, name, public)
VALUES ('slides', 'slides', false)
ON CONFLICT (id) DO NOTHING;

-- ── 7. storage.objects SELECT policy for the 'slides' bucket ─
-- Mirrors the lesson_slides table policy exactly (keyed on storage
-- path instead of lesson_id) so Storage itself double-checks
-- entitlement before a signed URL can even be created — not just the
-- lesson_slides row read.
DROP POLICY IF EXISTS "Admins and enrolled students can read slide objects" ON storage.objects;

CREATE POLICY "Admins and enrolled students can read slide objects"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'slides'
    AND (
      public.is_admin()
      OR EXISTS (
        SELECT 1
          FROM public.lesson_slides ls
          JOIN public.lessons l ON l.id = ls.lesson_id
          JOIN public.weeks w ON w.id = l.week_id
          JOIN public.enrolments e ON e.course_id = w.course_id
         WHERE ls.storage_path = storage.objects.name
           AND e.student_id = auth.uid()
           AND (
             e.tier = 'paid'
             OR (
               e.tier = 'deposited'
               AND NOT (
                 e.payment_deadline IS NOT NULL
                 AND NOW() > e.payment_deadline
                 AND w.week_number > e.waterline_week
               )
             )
           )
      )
    )
  );

-- Sanity checks after running:
-- SELECT * FROM pg_policies WHERE tablename IN ('weeks','lessons','lesson_slides');
-- SELECT * FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';
-- SELECT * FROM storage.buckets WHERE id = 'slides';
