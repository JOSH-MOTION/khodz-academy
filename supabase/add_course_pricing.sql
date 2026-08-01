-- ============================================================
--  MIGRATION 10: admin-editable course pricing (admission fee,
--  tuition, optional promo price) — previously hardcoded in
--  lib/courses-data.ts with no way to change it without a deploy.
-- ============================================================

ALTER TABLE public.courses
  ADD COLUMN IF NOT EXISTS admission_ghs   NUMERIC(10,2),
  ADD COLUMN IF NOT EXISTS tuition_ghs     NUMERIC(10,2),
  ADD COLUMN IF NOT EXISTS promo_price_ghs NUMERIC(10,2); -- nullable; when set, shown as a discounted total price

-- Sanity check after running:
-- SELECT id, admission_ghs, tuition_ghs, promo_price_ghs FROM public.courses;
