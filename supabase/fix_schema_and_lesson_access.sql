-- ============================================================
--  MIGRATION 2: close the schema drift between setup.sql and
--  what the app code actually reads/writes, and enforce the
--  waterline/deadline lesson-gating rule at the database level
--  (previously only enforced client-side, in the UI).
--
--  Run this once in the Supabase SQL Editor against your live
--  database, after fix_enrolments_rls.sql.
-- ============================================================

-- ── 1. Missing columns on lessons ──────────────────────────
ALTER TABLE public.lessons
  ADD COLUMN IF NOT EXISTS video_url          TEXT,
  ADD COLUMN IF NOT EXISTS slides_url         TEXT,
  ADD COLUMN IF NOT EXISTS slide_storage_path TEXT;

-- ── 2. Missing columns + tier values on enrolments ─────────
ALTER TABLE public.enrolments DROP CONSTRAINT IF EXISTS enrolments_tier_check;
ALTER TABLE public.enrolments ADD CONSTRAINT enrolments_tier_check
  CHECK (tier IN ('admitted', 'deposited', 'paid'));

ALTER TABLE public.enrolments
  ADD COLUMN IF NOT EXISTS admission_paid_at    TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS deposit_paid_at       TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS full_payment_paid_at  TIMESTAMPTZ;

-- ── 3. role column on profiles ─────────────────────────────
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'student'
    CHECK (role IN ('student', 'admin'));

-- IMPORTANT: every existing profile defaults to 'student'. After
-- running this migration, grant yourself admin access once with:
--   UPDATE public.profiles SET role = 'admin' WHERE id = '<your-user-uuid>';

-- ── 4. payments table ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.payments (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount          NUMERIC(10,2) NOT NULL,
  payment_type    TEXT NOT NULL,
  paystack_ref    TEXT NOT NULL UNIQUE,
  paystack_status TEXT NOT NULL,
  paid_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Students can view own payments" ON public.payments;
CREATE POLICY "Students can view own payments"
  ON public.payments FOR SELECT
  USING (auth.uid() = student_id);
-- No INSERT/UPDATE policy: written exclusively by the service-role
-- client in app/api/payment/verify, which bypasses RLS.

-- ── 5. access_log table ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.access_log (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id  UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id   TEXT NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE, -- lessons.id is TEXT (slug-style), not UUID
  access_type TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.access_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Students can view own access log" ON public.access_log;
CREATE POLICY "Students can view own access log"
  ON public.access_log FOR SELECT
  USING (auth.uid() = student_id);

DROP POLICY IF EXISTS "Students can insert own access log" ON public.access_log;
CREATE POLICY "Students can insert own access log"
  ON public.access_log FOR INSERT
  WITH CHECK (auth.uid() = student_id);

-- ── 6. Enforce waterline/deadline gating on lessons SELECT ──
-- Previously this policy only checked that an enrolment row
-- existed for the course — it did not check tier, waterline_week,
-- or payment_deadline. That meant a 'deposited' student whose
-- payment deadline had passed could still read locked lessons'
-- video_url/slides_url by querying Supabase directly (e.g. from
-- the browser console) with the anon key; the "Locked" state in
-- the UI was cosmetic only. This mirrors the same rule already
-- implemented in lib/access.ts canAccessLesson().
DROP POLICY IF EXISTS "Enrolled students can view lessons" ON public.lessons;
DROP POLICY IF EXISTS "Enrolled students can view unlocked lessons" ON public.lessons;

CREATE POLICY "Enrolled students can view unlocked lessons"
  ON public.lessons FOR SELECT
  USING (
    EXISTS (
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

-- Sanity checks after running:
-- SELECT column_name FROM information_schema.columns WHERE table_name = 'lessons';
-- SELECT conname, pg_get_constraintdef(oid) FROM pg_constraint WHERE conrelid = 'public.enrolments'::regclass;
-- SELECT * FROM pg_policies WHERE tablename IN ('lessons','payments','access_log');
