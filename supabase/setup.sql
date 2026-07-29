-- ============================================================
--  KHODZ ACADEMY — Supabase Database Setup
--  Run this entire script in the Supabase SQL Editor
-- ============================================================

-- ── 1. profiles table ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name  TEXT,
  phone      TEXT,
  avatar_url TEXT,
  role       TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin')),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Automatically create a profile row when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.raw_user_meta_data ->> 'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ── 2. courses table ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.courses (
  id          TEXT PRIMARY KEY,           -- e.g. 'react-architecture'
  title       TEXT NOT NULL,
  description TEXT,
  price_ghs   NUMERIC(10,2),
  cohort      TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Insert the 10 real courses used in the app
INSERT INTO public.courses (id, title, description, price_ghs, cohort)
VALUES 
  ('beginner-web-design', 'Beginner Web Design Course', 'Build responsive, modern websites using HTML, CSS, Tailwind, and basic JavaScript in just two weeks.', 600.00, 'Cohort 04'),
  ('python-fundamentals', 'Python Fundamentals for Beginners', 'Start your coding journey with Python. Learn core programming concepts and build interactive desktop apps.', 1500.00, 'Cohort 04'),
  ('vacation-bootcamp', 'Vacation Coding Bootcamp', 'Make your vacation productive. Dive deep into frontend engineering and build interactive web applications.', 1500.00, 'Cohort 04'),
  ('ui-ux-design', 'UI/UX & Website Design Course', 'Learn the visual design theory and advanced Figma techniques to craft stunning mobile and web interfaces.', 1500.00, 'Cohort 04'),
  ('ai-for-developers', 'AI for Developers Course', 'Supercharge your coding speed. Learn prompt engineering, Cursor, Copilot, and integrate APIs to build AI products.', 1500.00, 'Cohort 04'),
  ('wordpress-development', 'WordPress Website Development', 'Build custom company, agency, and e-commerce websites without code using Elementor and WordPress.', 1500.00, 'Cohort 04'),
  ('frontend-program', 'Frontend Development Program', 'Accelerate your frontend career. Zero to React.js developer in three months of intensive live classes.', 3500.00, 'Cohort 04'),
  ('mern-engineering', 'Full Stack MERN Engineering Program', 'The ultimate developer accelerator. Design, build, secure, and deploy full stack web apps on the MERN stack.', 6500.00, 'Cohort 04'),
  ('weekend-engineering', 'Weekend Software Engineering Program', 'Master full-stack engineering on weekends. Built for working professionals who want to transition to tech.', 4500.00, 'Cohort 04'),
  ('kids-coding-camp', 'Kids & Teens Coding Camp', 'Spark creativity in kids and teenagers. Learn coding by building games, animations, and cartoon webs.', 1000.00, 'Cohort 04'),
  ('vacation-web-foundations', 'Web Foundations (Vacation Coding Program)', 'For complete beginners. Learn HTML, CSS, Git, and Javascript fundamentals through live interactive sessions on Google Meet.', 1400.00, 'Cohort 01'),
  ('vacation-advanced-web-apps', 'Advanced Web Apps (Vacation Coding Program)', 'Master React components, state, props, API data streams, cloud deployment, and portfolio building.', 2200.00, 'Cohort 01')
ON CONFLICT (id) DO NOTHING;

-- ── 3. weeks table ─────────────────────────────────────────
-- id is a slug-style TEXT primary key with no default (same
-- convention as courses.id) — the inserting code must supply it,
-- e.g. '<course_id>-week-<n>'. Not a UUID.
CREATE TABLE IF NOT EXISTS public.weeks (
  id          TEXT PRIMARY KEY,
  course_id   TEXT REFERENCES public.courses(id) ON DELETE CASCADE,
  week_number INT NOT NULL,
  title       TEXT
);

-- ── 4. lessons table ───────────────────────────────────────
-- id is a slug-style TEXT primary key with no default, same as
-- weeks.id above — not a UUID.
CREATE TABLE IF NOT EXISTS public.lessons (
  id                 TEXT PRIMARY KEY,
  week_id            TEXT REFERENCES public.weeks(id) ON DELETE CASCADE,
  title              TEXT NOT NULL,
  order_in_week      INT DEFAULT 1,
  video_url          TEXT,  -- e.g. Google Drive share link, converted to /preview on render
  slides_url         TEXT,  -- e.g. Google Drive share link, converted to /preview on render
  slide_storage_path TEXT   -- optional: path in the 'slides' Storage bucket for signed-URL delivery
);

-- ── 5. enrolments table ────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.enrolments (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id            UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id             TEXT NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  tier                  TEXT NOT NULL DEFAULT 'admitted'  -- 'admitted' | 'deposited' | 'paid'
                        CHECK (tier IN ('admitted', 'deposited', 'paid')),
  waterline_week        INT  NOT NULL DEFAULT 4,
  payment_deadline      TIMESTAMPTZ,
  admission_paid_at     TIMESTAMPTZ,
  deposit_paid_at       TIMESTAMPTZ,
  full_payment_paid_at  TIMESTAMPTZ,
  enrolled_at           TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (student_id, course_id)
);

-- ── 5b. payments table ─────────────────────────────────────
-- Written exclusively by the service-role client in
-- app/api/payment/verify (bypasses RLS) after verifying the
-- Paystack webhook signature.
CREATE TABLE IF NOT EXISTS public.payments (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount          NUMERIC(10,2) NOT NULL,
  payment_type    TEXT NOT NULL,
  paystack_ref    TEXT NOT NULL UNIQUE,
  paystack_status TEXT NOT NULL,
  paid_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 5c. access_log table ───────────────────────────────────
-- Written by the student's own session from
-- app/api/slides/signed-url when a signed slide URL is issued.
CREATE TABLE IF NOT EXISTS public.access_log (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id  UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id   TEXT NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  access_type TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 5d. lesson_slides table ─────────────────────────────────
-- One row per generated slide image (scripts/slides/generate.mjs +
-- scripts/slides/publish.mjs). A single `lessons` row (one class
-- session) owns many ordered lesson_slides rows.
CREATE TABLE IF NOT EXISTS public.lesson_slides (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id    TEXT NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  slide_index  INT  NOT NULL,
  storage_path TEXT NOT NULL, -- path inside the 'slides' Storage bucket
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (lesson_id, slide_index)
);

-- ── 6. Enable Row Level Security ───────────────────────────

ALTER TABLE public.profiles      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weeks         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrolments    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.access_log    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_slides ENABLE ROW LEVEL SECURITY;

-- is_admin(): used by the content-preview policies below so an admin
-- account can browse all course content without needing a fake
-- enrolments row. Reads only the caller's own profiles row, so it
-- stays within what "Users can view own profile" already allows.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN LANGUAGE sql STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- ── 7. RLS Policies ────────────────────────────────────────

-- profiles: each user can only read/update their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- courses: anyone can read courses (public catalogue)
CREATE POLICY "Courses are publicly readable"
  ON public.courses FOR SELECT
  USING (true);

-- weeks: admins can view all weeks; enrolled students can read weeks
-- of their own courses
CREATE POLICY "Admins and enrolled students can view weeks"
  ON public.weeks FOR SELECT
  USING (
    public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.enrolments e
      WHERE e.student_id = auth.uid()
        AND e.course_id  = weeks.course_id
    )
  );

-- lessons: admins can view all lessons (content preview, no waterline
-- restriction). Enrolled students can read lessons of their courses,
-- but only lessons whose week is actually unlocked for their tier.
-- This mirrors lib/access.ts canAccessLesson() so the same rule is
-- enforced at the database level, not just in the UI: a 'deposited'
-- student querying lessons directly (e.g. via the browser console)
-- cannot read weeks beyond their waterline once the payment deadline
-- has passed.
CREATE POLICY "Admins and enrolled students can view unlocked lessons"
  ON public.lessons FOR SELECT
  USING (
    public.is_admin()
    OR EXISTS (
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

-- lesson_slides: same admin-or-unlocked-enrolment rule as lessons above.
CREATE POLICY "Admins and enrolled students can view unlocked lesson slides"
  ON public.lesson_slides FOR SELECT
  USING (
    public.is_admin()
    OR EXISTS (
      SELECT 1
        FROM public.lessons l
        JOIN public.weeks w ON w.id = l.week_id
        JOIN public.enrolments e ON e.course_id = w.course_id
       WHERE l.id = lesson_slides.lesson_id
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

-- enrolments: students can read their own enrolments
CREATE POLICY "Students can view own enrolments"
  ON public.enrolments FOR SELECT
  USING (auth.uid() = student_id);

-- enrolments: NO insert/update policy for anon/authenticated roles.
-- Enrolment rows are written exclusively server-side via
-- app/api/payment/verify using the service-role client, which bypasses
-- RLS entirely. Do not add an authenticated-role INSERT policy here —
-- that would let any logged-in student grant themselves paid access to
-- any course by inserting their own enrolments row.

-- payments: students can read their own payment history.
-- NO insert/update policy for anon/authenticated — written exclusively
-- by the service-role client in app/api/payment/verify, same reasoning
-- as enrolments above.
CREATE POLICY "Students can view own payments"
  ON public.payments FOR SELECT
  USING (auth.uid() = student_id);

-- access_log: written by the student's own session (not service role)
-- from app/api/slides/signed-url, so it needs an authenticated INSERT
-- policy — but scoped so a student can only log access under their own
-- student_id.
CREATE POLICY "Students can view own access log"
  ON public.access_log FOR SELECT
  USING (auth.uid() = student_id);

CREATE POLICY "Students can insert own access log"
  ON public.access_log FOR INSERT
  WITH CHECK (auth.uid() = student_id);

-- storage.objects: the 'slides' bucket is private. Signed URLs are only
-- issued after this policy passes, mirroring the lesson_slides table
-- policy exactly (keyed on storage path instead of lesson_id) so Storage
-- itself double-checks entitlement — not just the lesson_slides row read.
CREATE POLICY "Admins and enrolled students can read slide objects"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'slides'
    AND (
      public.is_admin()
      OR EXISTS (
        SELECT 1
          FROM public.lesson_slides ls
          JOIN public.lessons l ON l.id = ls.lesson_id
          JOIN public.weeks w ON w.id = l.week_id
          JOIN public.enrolments e ON e.course_id = w.course_id
         WHERE ls.storage_path = storage.objects.name
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
    )
  );

-- ============================================================
--  Done! Tables and policies are set up.
-- ============================================================
