-- ============================================================
--  MIGRATION 6: assignments (one per lesson) + submissions.
--  Students submit a link (GitHub repo, deployed site, etc.);
--  admin marks each submission Pass / Needs Revision with feedback.
-- ============================================================

-- ── 1. Assignment fields on lessons (one assignment per lesson) ─
ALTER TABLE public.lessons
  ADD COLUMN IF NOT EXISTS assignment_title       TEXT,
  ADD COLUMN IF NOT EXISTS assignment_description TEXT,
  ADD COLUMN IF NOT EXISTS assignment_due_at       TIMESTAMPTZ;

-- ── 2. assignment_submissions table ──────────────────────────
-- lesson_id is TEXT to match lessons.id (slug-style TEXT primary
-- key, no default — same convention as courses.id).
CREATE TABLE IF NOT EXISTS public.assignment_submissions (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id      TEXT NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  student_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  submission_url TEXT NOT NULL,
  status         TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'pass', 'needs_revision')),
  feedback       TEXT,
  submitted_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  graded_at      TIMESTAMPTZ,
  UNIQUE (lesson_id, student_id)
);

ALTER TABLE public.assignment_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Students can view own submissions" ON public.assignment_submissions;
CREATE POLICY "Students can view own submissions"
  ON public.assignment_submissions FOR SELECT
  USING (auth.uid() = student_id);

-- No INSERT/UPDATE policy for students: submissions are written
-- exclusively via app/api/submissions using the service-role client
-- (after verifying the caller's own session — student_id is taken
-- from the session, never trusted from the request body). This also
-- means a student can never set their own status/feedback directly.
-- Grading is written exclusively via app/api/admin/submissions,
-- gated by requireAdmin().

-- Sanity check after running:
-- SELECT column_name FROM information_schema.columns WHERE table_name = 'lessons' AND column_name LIKE 'assignment%';
-- SELECT * FROM pg_policies WHERE tablename = 'assignment_submissions';
