import { chromium } from "playwright";
import sharp from "sharp";
import { readFileSync, readdirSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { loadThemeVars, CANVAS_WIDTH, CANVAS_HEIGHT } from "./theme.mjs";
import { parseLessonSlides, parseLessonTitle } from "./parseLesson.mjs";
import { matchDiagram } from "./diagram.mjs";
import { renderSlideHTML } from "./render.mjs";
import { listLessonFiles, courseOverviewFile } from "./lessonFiles.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const CONTENT_DIR = path.join(ROOT, "content");
const OUTPUT_DIR = path.join(ROOT, "course");

function parseArgs(argv) {
  const args = { course: null, session: null };
  for (const a of argv) {
    const [k, v] = a.replace(/^--/, "").split("=");
    if (k === "course") args.course = v;
    if (k === "lesson" || k === "session") args.session = parseInt(v, 10);
  }
  return args;
}

function listCourses(filter) {
  return readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .filter((name) => !filter || name === filter);
}

function courseTitleFor(courseSlug) {
  try {
    const dir = path.join(CONTENT_DIR, courseSlug);
    const overviewFile = courseOverviewFile(CONTENT_DIR, courseSlug);
    if (!overviewFile) throw new Error("no curriculum overview file found");
    const raw = parseLessonTitle(readFileSync(path.join(dir, overviewFile), "utf8")); // e.g. "Khodz Academy — Frontend Development Foundations"
    return raw.replace(/^Khodz Academy\s*[—-]\s*/i, "").trim() || raw;
  } catch {
    return courseSlug
      .split("-")
      .map((w) => w[0].toUpperCase() + w.slice(1))
      .join(" ");
  }
}

async function main() {
  const { course, session } = parseArgs(process.argv.slice(2));
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
      const lessonFiles = listLessonFiles(CONTENT_DIR, courseSlug, session);
      if (lessonFiles.length === 0) {
        console.warn(`  (no matching lesson files in ${courseSlug})`);
        continue;
      }
      const courseTitle = courseTitleFor(courseSlug);

      for (const { filename, meta: fileMeta } of lessonFiles) {
        const filePath = path.join(CONTENT_DIR, courseSlug, filename);
        const markdown = readFileSync(filePath, "utf8");
        const { weekNumber, lessonSlug, sessionNumber } = fileMeta;
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
            meta: { sessionNumber, weekNumber, lessonTitle, courseTitle, total: slides.length },
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
