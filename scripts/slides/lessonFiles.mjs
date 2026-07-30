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

// Two lesson-file naming conventions supported so far:
//   01-lesson-01-slug.md        (2 sessions/week, e.g. frontend-development)
//   react-w1d1-slug.md          (3 sessions/week, e.g. react-development)
// Each matcher derives { weekNumber, orderInWeek, lessonSlug, sessionNumber }
// straight from the filename — sessionNumber is the course-wide 1..N index,
// and lessonSlug becomes both the output folder name and (via publish.mjs)
// the deterministic weeks/lessons row id suffix.
const LESSON_FILE_PATTERNS = [
  {
    re: /^\d+-lesson-(\d+)-(.+)\.md$/,
    meta: (m) => {
      const lessonNumber = parseInt(m[1], 10);
      return {
        weekNumber: Math.ceil(lessonNumber / 2),
        orderInWeek: ((lessonNumber - 1) % 2) + 1,
        lessonSlug: `lesson-${m[1]}-${m[2]}`,
        sessionNumber: lessonNumber,
      };
    },
  },
  {
    re: /^.+-w(\d+)d(\d+)-(.+)\.md$/,
    meta: (m) => {
      const weekNumber = parseInt(m[1], 10);
      const orderInWeek = parseInt(m[2], 10);
      return {
        weekNumber,
        orderInWeek,
        lessonSlug: `week-${m[1]}-day-${m[2]}-${m[3]}`,
        sessionNumber: (weekNumber - 1) * 3 + orderInWeek,
      };
    },
  },
];

export function matchLessonFile(filename) {
  for (const p of LESSON_FILE_PATTERNS) {
    const m = filename.match(p.re);
    if (m) return m ? p.meta(m) : null;
  }
  return null;
}

/** Lists { filename, meta } for every real lesson markdown file in a course's
 * content folder, sorted course-wide by session number, excluding known strays. */
export function listLessonFiles(contentDir, courseSlug, sessionFilter) {
  const dir = path.join(contentDir, courseSlug);
  const stray = KNOWN_STRAY_FILES[courseSlug] || new Set();

  return readdirSync(dir)
    .filter((f) => !stray.has(f))
    .map((f) => ({ filename: f, meta: matchLessonFile(f) }))
    .filter((entry) => entry.meta !== null)
    .filter((entry) => !sessionFilter || entry.meta.sessionNumber === sessionFilter)
    .sort((a, b) => a.meta.sessionNumber - b.meta.sessionNumber);
}

export function courseOverviewFile(contentDir, courseSlug) {
  const dir = path.join(contentDir, courseSlug);
  const stray = KNOWN_STRAY_FILES[courseSlug] || new Set();
  return readdirSync(dir).find((f) => /curriculum-overview\.md$/.test(f) && !stray.has(f));
}
