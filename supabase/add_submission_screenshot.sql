-- ============================================================
--  MIGRATION 9: optional screenshot alongside a submission link.
-- ============================================================

ALTER TABLE public.assignment_submissions
  ADD COLUMN IF NOT EXISTS screenshot_url TEXT;

-- Sanity check after running:
-- SELECT column_name FROM information_schema.columns WHERE table_name = 'assignment_submissions';
