-- ============================================================
--  FIX: remove the enrolments INSERT policy that let any
--  authenticated student self-grant paid access to any course.
--
--  Run this once in the Supabase SQL Editor against your live
--  database. Enrolments are written exclusively server-side via
--  app/api/payment/verify using the service-role client, which
--  bypasses RLS entirely — so no authenticated-role INSERT policy
--  should exist on this table.
-- ============================================================

DROP POLICY IF EXISTS "Service role can insert enrolments" ON public.enrolments;

-- Sanity check: this should now return zero rows (no INSERT/UPDATE
-- policy left on enrolments for anon/authenticated roles).
-- SELECT * FROM pg_policies WHERE tablename = 'enrolments';
