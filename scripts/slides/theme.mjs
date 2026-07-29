import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const GLOBALS_CSS_PATH = path.resolve(__dirname, "../../app/globals.css");

/**
 * Pulls the `@theme { ... }` block straight out of app/globals.css so
 * slide images always use the live brand tokens instead of a hand-copied
 * snapshot that can silently drift out of sync.
 */
export function loadThemeVars() {
  const css = readFileSync(GLOBALS_CSS_PATH, "utf8");
  const match = css.match(/@theme\s*\{([\s\S]*?)\n\}/);
  if (!match) {
    throw new Error(`Could not find @theme block in ${GLOBALS_CSS_PATH}`);
  }
  return match[1].trim();
}

export const CANVAS_WIDTH = 1920;
export const CANVAS_HEIGHT = 1080;
