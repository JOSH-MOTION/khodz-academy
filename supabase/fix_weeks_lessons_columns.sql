-- ============================================================
--  MIGRATION 4: close the remaining schema drift on weeks/lessons.
--  Your live weeks/lessons tables were created leaner than every
--  other part of this codebase (setup.sql, the admin courses page,
--  the student lesson pages, migration 2) assumes. This adds
--  whatever is actually missing, safely (IF NOT EXISTS everywhere).
-- ============================================================

ALTER TABLE public.weeks
  ADD COLUMN IF NOT EXISTS title TEXT;

ALTER TABLE public.lessons
  ADD COLUMN IF NOT EXISTS order_in_week      INT DEFAULT 1,
  ADD COLUMN IF NOT EXISTS video_url          TEXT,
  ADD COLUMN IF NOT EXISTS slides_url         TEXT,
  ADD COLUMN IF NOT EXISTS slide_storage_path TEXT;

-- Sanity check after running:
-- SELECT column_name FROM information_schema.columns WHERE table_name IN ('weeks','lessons') ORDER BY table_name, ordinal_position;
