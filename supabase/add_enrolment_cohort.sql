-- ============================================================
--  MIGRATION 5: per-student cohort assignment.
--  courses.cohort (if it even existed) would only tag the course
--  itself — this lets admin assign each *student's enrolment* to a
--  specific cohort independently, e.g. when the same course runs
--  multiple times.
-- ============================================================

ALTER TABLE public.enrolments
  ADD COLUMN IF NOT EXISTS cohort TEXT;
