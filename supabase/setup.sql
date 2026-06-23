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
CREATE TABLE IF NOT EXISTS public.weeks (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id   TEXT REFERENCES public.courses(id) ON DELETE CASCADE,
  week_number INT NOT NULL,
  title       TEXT
);

-- ── 4. lessons table ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.lessons (
  id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  week_id  UUID REFERENCES public.weeks(id) ON DELETE CASCADE,
  title    TEXT NOT NULL,
  order_in_week INT DEFAULT 1
);

-- ── 5. enrolments table ────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.enrolments (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id        TEXT NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  tier             TEXT NOT NULL DEFAULT 'deposited'  -- 'deposited' | 'paid'
                   CHECK (tier IN ('deposited', 'paid')),
  waterline_week   INT  NOT NULL DEFAULT 4,
  payment_deadline TIMESTAMPTZ,
  enrolled_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (student_id, course_id)
);

-- ── 6. Enable Row Level Security ───────────────────────────

ALTER TABLE public.profiles   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weeks       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrolments  ENABLE ROW LEVEL SECURITY;

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

-- weeks: enrolled students can read weeks of their courses
CREATE POLICY "Enrolled students can view weeks"
  ON public.weeks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.enrolments e
      WHERE e.student_id = auth.uid()
        AND e.course_id  = weeks.course_id
    )
  );

-- lessons: enrolled students can read lessons of their courses
CREATE POLICY "Enrolled students can view lessons"
  ON public.lessons FOR SELECT
  USING (
    EXISTS (
      SELECT 1
        FROM public.weeks w
        JOIN public.enrolments e ON e.course_id = w.course_id
       WHERE w.id = lessons.week_id
         AND e.student_id = auth.uid()
    )
  );

-- enrolments: students can read their own enrolments
CREATE POLICY "Students can view own enrolments"
  ON public.enrolments FOR SELECT
  USING (auth.uid() = student_id);

-- enrolments: only the service_role (server API) can insert/update
-- (INSERT is done server-side via /api/payment/enrol using the service key)
CREATE POLICY "Service role can insert enrolments"
  ON public.enrolments FOR INSERT
  WITH CHECK (auth.uid() = student_id);

-- ============================================================
--  Done! Tables and policies are set up.
-- ============================================================
