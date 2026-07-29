const ICON_KEYWORDS = [
  [/vs\s*code|vscode/i, "code"],
  [/live server/i, "wifi_tethering"],
  [/git(?!hub)/i, "call_split"],
  [/github/i, "hub"],
  [/vercel|netlify|deploy/i, "rocket_launch"],
  [/tailwind|css|style/i, "palette"],
  [/devtools|debug/i, "bug_report"],
  [/node/i, "dns"],
  [/api|json|fetch/i, "cloud"],
  [/database|server/i, "dns"],
  [/browser/i, "language"],
  [/javascript|js\b/i, "javascript"],
  [/html/i, "code_blocks"],
  [/prettier|format/i, "format_align_left"],
];

function iconFor(word) {
  for (const [re, icon] of ICON_KEYWORDS) {
    if (re.test(word)) return icon;
  }
  return "widgets";
}

/** Strips a leading "Arrow diagram:" / "Simple diagram:" style label from the first
 * segment of a split arrow chain, and trailing sentence punctuation from every segment. */
function cleanArrowSegment(segment, isFirst) {
  let out = segment.replace(/^[\d.):\s]+/, "").trim();
  if (isFirst) {
    const leadIn = out.match(/^(?:.*?(?:diagram|flow|chart))\s*:\s*(.+)$/i);
    if (leadIn) out = leadIn[1].trim();
  }
  return out.replace(/[.:;]+$/, "").trim();
}

/**
 * Heuristically decides which reusable SVG/HTML diagram pattern best
 * represents a slide's "Visual suggestion" (and falls back to scanning
 * the explanation/code) — no image generation, just structured hints
 * pulled out of the prose that's already in the lesson markdown.
 */
export function matchDiagram(slide) {
  const hay = [slide.visualSuggestion, slide.explanation].filter(Boolean).join(" \n ");
  const vs = slide.visualSuggestion || "";

  // 1. Arrow-flow: "Browser → Request → Server → Response → Browser"
  const arrowSource = [hay, slide.code?.content].filter(Boolean).find((s) => (s.match(/→/g) || []).length >= 2);
  if (arrowSource) {
    const line = arrowSource.split("\n").find((l) => (l.match(/→/g) || []).length >= 2) || arrowSource;
    const steps = line
      .split("→")
      .map((s, i) => cleanArrowSegment(s, i === 0))
      .filter(Boolean)
      .slice(0, 6);
    if (steps.length >= 2) return { type: "arrow-flow", steps };
  }

  // 2. Numbered steps: "(1) ... (2) ... (3) ..." or a plain numbered code block
  const numberedSource = slide.code && slide.code.lang === "" ? slide.code.content : hay;
  const stepMatches = [...numberedSource.matchAll(/(?:^|\s)\(?(\d)\)?[.):]\s*([^(\n]+)/g)]
    .filter((m) => Number(m[1]) <= 9)
    .map((m) => m[2].trim())
    .filter(Boolean);
  if (stepMatches.length >= 3) {
    return { type: "numbered-steps", steps: stepMatches.slice(0, 6) };
  }

  // 3. Icon grid: "grid of icons", "toolbox", "logos: X, Y, Z"
  if (/grid|logos?|toolbox|toolkit|icons?/i.test(vs)) {
    let words = vs
      .replace(/^.*?:\s*/, "")
      .split(/,|\band\b/i)
      .map((w) => w.trim())
      .filter((w) => w && w.length < 30)
      .slice(0, 6);

    // The caption is often generic ("Toolbox icon with labeled tool icons
    // inside") while the actual named items live in the explanation as a
    // "Name (detail), Name (detail), ..." list — pull from there instead.
    if (words.length < 2 && slide.explanation) {
      const parenItems = [...slide.explanation.matchAll(/([A-Z][A-Za-z0-9+.#/ ]{1,24}?)\s*\(/g)].map((m) =>
        m[1].trim()
      );
      const unique = [...new Set(parenItems)];
      if (unique.length >= 2) words = unique.slice(0, 6);
    }

    if (words.length >= 2) {
      return { type: "icon-grid", items: words.map((w) => ({ label: w, icon: iconFor(w) })) };
    }
  }

  // 4. Split comparison: "split-screen", "before/after", "X vs Y"
  const splitMatch = vs.match(/split-screen.*?labeled\s+"([^"]+)".*?labeled\s+"([^"]+)"/i);
  if (splitMatch) {
    return { type: "comparison", left: splitMatch[1], right: splitMatch[2] };
  }
  const beforeAfter = vs.match(/before\/after|before and after/i);
  if (beforeAfter) {
    return { type: "comparison", left: "Before", right: "After" };
  }
  const vsMatch = slide.title.match(/^(.+?)\s+vs\.?\s+(.+)$/i);
  if (vsMatch) {
    return { type: "comparison", left: vsMatch[1].trim(), right: vsMatch[2].trim() };
  }

  // 5. Fallback: a single accent icon + caption pulled from the visual suggestion
  if (vs) {
    return { type: "accent", icon: iconFor(vs), caption: vs };
  }

  return { type: "none" };
}
