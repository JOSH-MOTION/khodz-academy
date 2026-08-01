-- ============================================================
--  MIGRATION 9: admin-configurable course scheduling/deposit
--  settings, a real notifications table, and reminder tracking.
-- ============================================================

-- ── 1. Admin-configurable per-course settings ────────────────
ALTER TABLE public.courses
  ADD COLUMN IF NOT EXISTS end_date            DATE,
  ADD COLUMN IF NOT EXISTS deposit_percent     NUMERIC(5,2) NOT NULL DEFAULT 50,
  ADD COLUMN IF NOT EXISTS reminder_lead_days  INT NOT NULL DEFAULT 21;

-- ── 2. Track whether a payment reminder has already gone out,
--       so the cron job never emails the same deadline twice ───
ALTER TABLE public.enrolments
  ADD COLUMN IF NOT EXISTS reminder_sent_at TIMESTAMPTZ;

-- ── 3. notifications table (real in-app notifications, not the
--       static "you're all caught up" placeholder) ─────────────
CREATE TABLE IF NOT EXISTS public.notifications (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title      TEXT NOT NULL,
  body       TEXT NOT NULL,
  read_at    TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Students can view own notifications" ON public.notifications;
CREATE POLICY "Students can view own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = student_id);

-- Students may mark their own notifications read, but nothing else —
-- creation is exclusively server-side (service role: the payment
-- webhook and the reminder cron job).
DROP POLICY IF EXISTS "Students can mark own notifications read" ON public.notifications;
CREATE POLICY "Students can mark own notifications read"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = student_id)
  WITH CHECK (auth.uid() = student_id);

-- Sanity check after running:
-- SELECT column_name FROM information_schema.columns WHERE table_name = 'courses' AND column_name IN ('end_date','deposit_percent','reminder_lead_days');
-- SELECT * FROM pg_policies WHERE tablename = 'notifications';
