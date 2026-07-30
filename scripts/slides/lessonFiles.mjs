import { readdirSync } from "node:fs";
import path from "node:path";

// Known accidental duplicate files sitting in a course's content folder
// that must never be treated as that course's own lessons (e.g. a
// frontend-development lesson file copy-pasted into another course dir).
export const KNOWN_STRAY_FILES = {
  "react-development": new Set([
    "00-curriculum-overview.md",
    "01-lesson-01-intro-web-html.md",
    "02-lesson-02-tailwind-css.md",
    "03-lesson-03-responsive-components.md",
    "04-lesson-04-forms-ui.md",
    "05-lesson-05-javascript-fundamentals.md",
    "06-lesson-06-javascript-browser.md",
    "07-lesson-07-apis.md",
    "08-lesson-08-workflow-final-project.md",
  ]),
};

// How many live class sessions each course runs per week — used to derive
// weekNumber/orderInWeek from a plain course-wide session number. Only
// needed for naming conventions that don't already encode week/day
// directly in the filename (see LESSON_FILE_PATTERNS below).
const SESSIONS_PER_WEEK = {
  "frontend-development": 2,
  "react-development": 3,
  "python-fundamentals": 3,
};
const DEFAULT_SESSIONS_PER_WEEK = 2;

// Lesson-file naming conventions supported so far:
//   01-lesson-01-slug.md        (frontend-development, 2/week)
//   python-lesson-01-slug.md    (python-fundamentals, 3/week)
//   react-w1d1-slug.md          (react-development, 3/week — week/day already in the name)
// Each matcher derives { sessionNumber, lessonSlug } straight from the
// filename — sessionNumber is the course-wide 1..N index that weekNumber/
// orderInWeek get derived from afterwards, in listLessonFiles(), using the
// course's SESSIONS_PER_WEEK. lessonSlug becomes both the output folder
// name and (via publish.mjs) the deterministic weeks/lessons row id suffix.
const LESSON_FILE_PATTERNS = [
  {
    re: /^.+-lesson-(\d+)-(.+)\.md$/,
    meta: (m) => ({
      sessionNumber: parseInt(m[1], 10),
      lessonSlug: `lesson-${m[1]}-${m[2]}`,
    }),
  },
  {
    re: /^.+-w(\d+)d(\d+)-(.+)\.md$/,
    meta: (m) => {
      const weekNumber = parseInt(m[1], 10);
      const orderInWeek = parseInt(m[2], 10);
      return {
        sessionNumber: (weekNumber - 1) * 3 + orderInWeek,
        lessonSlug: `week-${m[1]}-day-${m[2]}-${m[3]}`,
      };
    },
  },
];

export function matchLessonFile(filename) {
  for (const p of LESSON_FILE_PATTERNS) {
    const m = filename.match(p.re);
    if (m) return p.meta(m);
  }
  return null;
}

/** Lists { filename, meta } for every real lesson markdown file in a course's
 * content folder, sorted course-wide by session number, excluding known
 * strays. meta is { sessionNumber, weekNumber, orderInWeek, lessonSlug }. */
export function listLessonFiles(contentDir, courseSlug, sessionFilter) {
  const dir = path.join(contentDir, courseSlug);
  const stray = KNOWN_STRAY_FILES[courseSlug] || new Set();
  const perWeek = SESSIONS_PER_WEEK[courseSlug] || DEFAULT_SESSIONS_PER_WEEK;

  return readdirSync(dir)
    .filter((f) => !stray.has(f))
    .map((f) => {
      const raw = matchLessonFile(f);
      if (!raw) return { filename: f, meta: null };
      const { sessionNumber, lessonSlug } = raw;
      return {
        filename: f,
        meta: {
          sessionNumber,
          lessonSlug,
          weekNumber: Math.ceil(sessionNumber / perWeek),
          orderInWeek: ((sessionNumber - 1) % perWeek) + 1,
        },
      };
    })
    .filter((entry) => entry.meta !== null)
    .filter((entry) => !sessionFilter || entry.meta.sessionNumber === sessionFilter)
    .sort((a, b) => a.meta.sessionNumber - b.meta.sessionNumber);
}

export function courseOverviewFile(contentDir, courseSlug) {
  const dir = path.join(contentDir, courseSlug);
  const stray = KNOWN_STRAY_FILES[courseSlug] || new Set();
  return readdirSync(dir).find((f) => /curriculum-overview\.md$/.test(f) && !stray.has(f));
}
