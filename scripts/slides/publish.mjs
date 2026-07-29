import { createClient } from "@supabase/supabase-js";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { parseLessonTitle } from "./parseLesson.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const CONTENT_DIR = path.join(ROOT, "content");
const COURSE_DIR = path.join(ROOT, "course");

function parseArgs(argv) {
  const args = {};
  for (const a of argv) {
    const [k, v] = a.replace(/^--/, "").split("=");
    args[k] = v;
  }
  return args;
}

/** weeks.id / lessons.id are slug-style TEXT primary keys with no
 * database default (same convention as courses.id) — the caller must
 * supply them. These are deterministic so re-running publish is safe. */
async function upsertWeek(supabase, courseId, weekNumber) {
  const id = `${courseId}-week-${weekNumber}`;
  const { error } = await supabase
    .from("weeks")
    .upsert({ id, course_id: courseId, week_number: weekNumber, title: `Week ${weekNumber}` }, { onConflict: "id" });
  if (error) throw error;
  return { id };
}

async function upsertLesson(supabase, weekId, orderInWeek, title) {
  const id = `${weekId}-lesson-${orderInWeek}`;
  const { error } = await supabase
    .from("lessons")
    .upsert({ id, week_id: weekId, title, order_in_week: orderInWeek }, { onConflict: "id" });
  if (error) throw error;
  return { id };
}

async function main() {
  const { courseId, contentSlug } = parseArgs(process.argv.slice(2));
  if (!courseId || !contentSlug) {
    console.error(
      "Usage: node --env-file=.env scripts/slides/publish.mjs --courseId=<supabase courses.id> --contentSlug=<content/ folder name>"
    );
    process.exit(1);
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in the environment (run with --env-file=.env)");
  }
  const supabase = createClient(url, key);

  const { data: course, error: courseErr } = await supabase.from("courses").select("id").eq("id", courseId).maybeSingle();
  if (courseErr) throw courseErr;
  if (!course) throw new Error(`courses.id "${courseId}" does not exist — create it first.`);

  const lessonRoot = path.join(COURSE_DIR, contentSlug);
  const lessonDirs = readdirSync(lessonRoot, { withFileTypes: true })
    .filter((d) => d.isDirectory() && /^lesson-\d+-/.test(d.name))
    .map((d) => d.name)
    .sort();

  if (lessonDirs.length === 0) {
    console.error(`No lesson-NN-* folders found in ${lessonRoot}. Run slides:generate first.`);
    process.exit(1);
  }

  let totalUploaded = 0;

  for (const lessonSlug of lessonDirs) {
    const m = lessonSlug.match(/^lesson-(\d+)-/);
    const lessonNumber = parseInt(m[1], 10);
    const weekNumber = Math.ceil(lessonNumber / 2);
    const orderInWeek = ((lessonNumber - 1) % 2) + 1;

    let lessonTitle = lessonSlug;
    const mdMatch = readdirSync(path.join(CONTENT_DIR, contentSlug)).find((f) =>
      f.startsWith(`${String(lessonNumber).padStart(2, "0")}-lesson-${m[1]}-`)
    );
    if (mdMatch) {
      lessonTitle = parseLessonTitle(readFileSync(path.join(CONTENT_DIR, contentSlug, mdMatch), "utf8"));
    }

    console.log(`\n${lessonSlug} → week ${weekNumber}, slot ${orderInWeek} — "${lessonTitle}"`);

    const week = await upsertWeek(supabase, courseId, weekNumber);
    const lesson = await upsertLesson(supabase, week.id, orderInWeek, lessonTitle);

    const slideDir = path.join(lessonRoot, lessonSlug);
    const slideFiles = readdirSync(slideDir)
      .filter((f) => /^slide-\d+\.webp$/.test(f))
      .sort();

    for (const file of slideFiles) {
      const slideIndex = parseInt(file.match(/^slide-(\d+)\.webp$/)[1], 10);
      const storagePath = `${courseId}/${lessonSlug}/${file}`;
      const buffer = readFileSync(path.join(slideDir, file));

      const { error: uploadErr } = await supabase.storage
        .from("slides")
        .upload(storagePath, buffer, { contentType: "image/webp", upsert: true });
      if (uploadErr) throw uploadErr;

      const { error: rowErr } = await supabase
        .from("lesson_slides")
        .upsert({ lesson_id: lesson.id, slide_index: slideIndex, storage_path: storagePath }, { onConflict: "lesson_id,slide_index" });
      if (rowErr) throw rowErr;

      totalUploaded++;
      process.stdout.write(`  ✓ ${file}\r\n`);
    }
  }

  console.log(`\nDone — published ${totalUploaded} slide image(s) to courseId="${courseId}".`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
