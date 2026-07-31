-- ============================================================
--  MIGRATION 8: full admission profile form.
--  After paying the admission fee, a new student must complete
--  this form before reaching the dashboard/lessons. Existing
--  students (anyone who already has an enrolment) are grandfathered
--  in as "completed" so this only applies going forward.
-- ============================================================

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS full_name              TEXT,
  ADD COLUMN IF NOT EXISTS phone                  TEXT,
  ADD COLUMN IF NOT EXISTS avatar_url              TEXT,
  ADD COLUMN IF NOT EXISTS date_of_birth           DATE,
  ADD COLUMN IF NOT EXISTS gender                  TEXT,
  ADD COLUMN IF NOT EXISTS address                 TEXT,
  ADD COLUMN IF NOT EXISTS education_background    TEXT,
  ADD COLUMN IF NOT EXISTS occupation              TEXT,
  ADD COLUMN IF NOT EXISTS emergency_contact_name  TEXT,
  ADD COLUMN IF NOT EXISTS emergency_contact_phone TEXT,
  ADD COLUMN IF NOT EXISTS referral_source         TEXT,
  ADD COLUMN IF NOT EXISTS motivation              TEXT,
  ADD COLUMN IF NOT EXISTS profile_completed       BOOLEAN NOT NULL DEFAULT false;

-- Grandfather in everyone who already has at least one enrolment —
-- this feature only gates *new* admissions going forward.
UPDATE public.profiles
SET profile_completed = true
WHERE id IN (SELECT DISTINCT student_id FROM public.enrolments);

-- ── Avatar storage ────────────────────────────────────────────
-- Public bucket: profile pictures are low-sensitivity (unlike paid
-- slide content, which stays in the private 'slides' bucket).
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Avatar images are publicly readable" ON storage.objects;
CREATE POLICY "Avatar images are publicly readable"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

-- A user may only upload/replace their own avatar — path convention
-- is '<user_id>/<filename>', enforced by checking the first path segment.
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
CREATE POLICY "Users can upload their own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "Users can replace their own avatar" ON storage.objects;
CREATE POLICY "Users can replace their own avatar"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Sanity check after running:
-- SELECT column_name FROM information_schema.columns WHERE table_name = 'profiles' ORDER BY ordinal_position;
-- SELECT id, profile_completed FROM public.profiles;
-- SELECT * FROM storage.buckets WHERE id = 'avatars';
