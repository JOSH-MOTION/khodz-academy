-- ============================================================
--  MIGRATION 7: payments.course_id (so a payment can be attributed
--  to the right course once a student has more than one) +
--  announcements (admin broadcasts, global or per-course).
-- ============================================================

-- ── 1. payments.course_id ────────────────────────────────────
ALTER TABLE public.payments
  ADD COLUMN IF NOT EXISTS course_id TEXT REFERENCES public.courses(id);

-- ── 2. announcements table ───────────────────────────────────
-- course_id = NULL means "visible to every enrolled student across
-- every course" (a global announcement).
CREATE TABLE IF NOT EXISTS public.announcements (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id  TEXT REFERENCES public.courses(id) ON DELETE CASCADE,
  title      TEXT NOT NULL,
  body       TEXT NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- Any enrolled student can read a global announcement or one scoped
-- to a course they're enrolled in. Admins bypass via is_admin(),
-- already defined in a prior migration.
DROP POLICY IF EXISTS "Students can view relevant announcements" ON public.announcements;
CREATE POLICY "Students can view relevant announcements"
  ON public.announcements FOR SELECT
  USING (
    public.is_admin()
    OR course_id IS NULL
    OR EXISTS (
      SELECT 1 FROM public.enrolments e
      WHERE e.student_id = auth.uid() AND e.course_id = announcements.course_id
    )
  );

-- No INSERT/UPDATE/DELETE policy for students: announcements are
-- written exclusively via app/api/admin/announcements, gated by
-- requireAdmin(), using the service-role client.

-- Sanity check after running:
-- SELECT column_name FROM information_schema.columns WHERE table_name = 'payments' AND column_name = 'course_id';
-- SELECT * FROM pg_policies WHERE tablename = 'announcements';
