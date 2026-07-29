import { chromium } from "playwright";
import sharp from "sharp";
import { readFileSync, readdirSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { loadThemeVars, CANVAS_WIDTH, CANVAS_HEIGHT } from "./theme.mjs";
import { parseLessonSlides, parseLessonTitle } from "./parseLesson.mjs";
import { matchDiagram } from "./diagram.mjs";
import { renderSlideHTML } from "./render.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const CONTENT_DIR = path.join(ROOT, "content");
const OUTPUT_DIR = path.join(ROOT, "course");

function parseArgs(argv) {
  const args = { course: null, lesson: null };
  for (const a of argv) {
    const [k, v] = a.replace(/^--/, "").split("=");
    if (k === "course") args.course = v;
    if (k === "lesson") args.lesson = v.padStart(2, "0");
  }
  return args;
}

function listCourses(filter) {
  return readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .filter((name) => !filter || name === filter);
}

function listLessonFiles(courseSlug, lessonFilter) {
  const dir = path.join(CONTENT_DIR, courseSlug);
  return readdirSync(dir)
    .filter((f) => /^\d+-lesson-\d+-.+\.md$/.test(f))
    .filter((f) => {
      if (!lessonFilter) return true;
      const m = f.match(/^\d+-lesson-(\d+)-/);
      return m && m[1] === lessonFilter;
    })
    .sort();
}

function courseTitleFor(courseSlug) {
  try {
    const overviewFile = path.join(CONTENT_DIR, courseSlug, "00-curriculum-overview.md");
    const markdown = readFileSync(overviewFile, "utf8");
    const raw = parseLessonTitle(markdown); // e.g. "Khodz Academy — Frontend Development Foundations"
    return raw.replace(/^Khodz Academy\s*[—-]\s*/i, "").trim() || raw;
  } catch {
    return courseSlug
      .split("-")
      .map((w) => w[0].toUpperCase() + w.slice(1))
      .join(" ");
  }
}

function lessonMetaFromFilename(filename) {
  const m = filename.match(/^\d+-lesson-(\d+)-(.+)\.md$/);
  if (!m) throw new Error(`Unexpected lesson filename: ${filename}`);
  const lessonNumber = parseInt(m[1], 10);
  return {
    lessonNumber,
    weekNumber: Math.ceil(lessonNumber / 2),
    lessonSlug: `lesson-${m[1]}-${m[2]}`,
  };
}

async function main() {
  const { course, lesson } = parseArgs(process.argv.slice(2));
  const themeVars = loadThemeVars();
  const courses = listCourses(course);

  if (courses.length === 0) {
    console.error(`No course content found${course ? ` for "${course}"` : ""} in ${CONTENT_DIR}`);
    process.exit(1);
  }

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: CANVAS_WIDTH, height: CANVAS_HEIGHT } });

  let totalGenerated = 0;

  try {
    for (const courseSlug of courses) {
      const lessonFiles = listLessonFiles(courseSlug, lesson);
      if (lessonFiles.length === 0) {
        console.warn(`  (no matching lesson files in ${courseSlug})`);
        continue;
      }
      const courseTitle = courseTitleFor(courseSlug);

      for (const filename of lessonFiles) {
        const filePath = path.join(CONTENT_DIR, courseSlug, filename);
        const markdown = readFileSync(filePath, "utf8");
        const { lessonNumber, weekNumber, lessonSlug } = lessonMetaFromFilename(filename);
        const lessonTitle = parseLessonTitle(markdown);
        const slides = parseLessonSlides(markdown);

        if (slides.length === 0) {
          console.warn(`  ! ${filename}: no "### Slide N — Title" sections found, skipping`);
          continue;
        }

        const outDir = path.join(OUTPUT_DIR, courseSlug, lessonSlug);
        mkdirSync(outDir, { recursive: true });

        console.log(`\n${courseSlug}/${lessonSlug} — ${slides.length} slides`);

        for (const slide of slides) {
          const diagram = matchDiagram(slide);
          const html = renderSlideHTML({
            themeVars,
            slide,
            diagram,
            meta: { lessonNumber, weekNumber, lessonTitle, courseTitle, total: slides.length },
          });

          await page.setContent(html, { waitUntil: "networkidle" });
          const pngBuffer = await page.screenshot({ type: "png" });

          const outFile = path.join(outDir, `slide-${String(slide.index).padStart(2, "0")}.webp`);
          await sharp(pngBuffer).webp({ quality: 88 }).toFile(outFile);

          totalGenerated++;
          process.stdout.write(`  ✓ slide-${String(slide.index).padStart(2, "0")}.webp\r\n`);
        }
      }
    }
  } finally {
    await browser.close();
  }

  console.log(`\nDone — generated ${totalGenerated} slide image(s) in ${path.relative(ROOT, OUTPUT_DIR)}/`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
