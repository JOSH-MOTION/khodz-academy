import { CANVAS_WIDTH, CANVAS_HEIGHT } from "./theme.mjs";

function esc(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Renders the small subset of inline markdown that shows up in lesson prose
 * (**bold** and `inline code`) instead of dumping the raw asterisks/backticks
 * onto the slide image. */
function formatInline(str) {
  if (!str) return "";
  let out = esc(str);
  out = out.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');
  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  return out;
}

function truncate(str, max) {
  if (!str) return "";
  if (str.length <= max) return str;
  return str.slice(0, max - 1).trimEnd() + "…";
}

function splitSentences(str, max = 5) {
  if (!str) return [];
  return str
    .split(/(?<=[.!?])\s+(?=[A-Z(`])/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, max);
}

const FILENAME_BY_LANG = {
  html: "index.html",
  css: "styles.css",
  js: "script.js",
  javascript: "script.js",
  jsx: "App.jsx",
  json: "data.json",
  bash: "terminal",
  sh: "terminal",
  python: "main.py",
  py: "main.py",
};

function filenameFor(lang) {
  return FILENAME_BY_LANG[lang] || "";
}

const HASH_COMMENT_LANGS = ["bash", "sh", "python", "py"];
const PYTHON_KEYWORDS =
  "def|return|if|elif|else|for|while|import|from|as|class|try|except|finally|with|in|not|and|or|is|None|True|False|print|pass|break|continue|lambda|yield";
const JS_KEYWORDS = "const|let|var|function|return|async|await|if|else|for|import|from|export|default|new";

/** Very small, presentation-only single-pass tokenizer — not a real parser,
 * just enough to read well on a slide. Single-pass (one combined regex,
 * each character matched at most once) rather than chained .replace() calls
 * deliberately: a later pass re-scanning already-substituted HTML (e.g. a
 * keyword regex matching the literal word "class" inside a `class="tok-..."`
 * attribute a comment/string pass had already inserted) would corrupt the
 * markup. */
function highlightCode(code, lang) {
  const groups = [];
  if (["html", "jsx"].includes(lang)) groups.push("(?<htmlComment><!--[\\s\\S]*?-->)");
  groups.push(HASH_COMMENT_LANGS.includes(lang) ? "(?<comment>#[^\\n]*)" : "(?<comment>//[^\\n]*)");
  groups.push('(?<string>"[^"\\n]*"|\'[^\'\\n]*\')');
  if (["html", "jsx"].includes(lang)) groups.push("(?<tag><\\/?[a-zA-Z][\\w-]*)");
  if (["python", "py"].includes(lang)) groups.push(`(?<keyword>\\b(?:${PYTHON_KEYWORDS})\\b)`);
  else if (["js", "javascript", "jsx"].includes(lang)) groups.push(`(?<keyword>\\b(?:${JS_KEYWORDS})\\b)`);
  groups.push("(?<plain>[\\s\\S])");

  const re = new RegExp(groups.join("|"), "g");

  return code.replace(re, (match, ...rest) => {
    const named = rest[rest.length - 1];
    if (named.htmlComment || named.comment) return `<span class="tok-comment">${esc(match)}</span>`;
    if (named.string) return `<span class="tok-string">${esc(match)}</span>`;
    if (named.tag) return `<span class="tok-tag">${esc(match)}</span>`;
    if (named.keyword) return `<span class="tok-keyword">${esc(match)}</span>`;
    return esc(match);
  });
}

function diagramHTML(diagram) {
  switch (diagram.type) {
    case "arrow-flow": {
      const stacked = diagram.steps.length > 4;
      return `<div class="diagram arrow-flow ${stacked ? "stacked" : ""}">
        ${diagram.steps
          .map(
            (s, i) => `
          <div class="flow-step">${esc(s)}</div>
          ${i < diagram.steps.length - 1 ? `<div class="flow-arrow">${stacked ? "↓" : "→"}</div>` : ""}`
          )
          .join("")}
      </div>`;
    }
    case "numbered-steps":
      return `<div class="diagram numbered-steps">
        ${diagram.steps
          .map(
            (s, i) => `<div class="step-row"><span class="step-num">${i + 1}</span><span class="step-text">${esc(
              truncate(s, 90)
            )}</span></div>`
          )
          .join("")}
      </div>`;
    case "icon-grid":
      return `<div class="diagram icon-grid">
        ${diagram.items
          .map(
            (it) => `<div class="icon-card">
              <span class="material-symbols-outlined">${it.icon}</span>
              <span>${esc(truncate(it.label, 22))}</span>
            </div>`
          )
          .join("")}
      </div>`;
    case "comparison":
      return `<div class="diagram comparison">
        <div class="compare-panel"><span class="compare-label">${esc(diagram.left)}</span></div>
        <div class="compare-vs">VS</div>
        <div class="compare-panel"><span class="compare-label">${esc(diagram.right)}</span></div>
      </div>`;
    case "accent":
      return `<div class="diagram accent">
        <span class="material-symbols-outlined accent-icon">${diagram.icon}</span>
        <p class="accent-caption">${formatInline(truncate(diagram.caption, 140))}</p>
      </div>`;
    default:
      return `<div class="diagram none">
        <span class="material-symbols-outlined accent-icon dim">auto_awesome</span>
      </div>`;
  }
}

function calloutHTML(realWorldExample) {
  if (!realWorldExample) return "";
  return `<div class="callout">
    <span class="material-symbols-outlined">lightbulb</span>
    <p>${formatInline(truncate(realWorldExample, 200))}</p>
  </div>`;
}

function pickLayout(slide) {
  const t = slide.title.toLowerCase();
  if (slide.index === 1) return "title";
  if (/recap|what.?s next/.test(t)) return "recap";
  if (slide.code) return "code";
  return "concept";
}

function renderTitleLayout(slide, meta) {
  return `<div class="layout layout-title">
    <div class="kicker">SESSION ${meta.sessionNumber} · ${esc(meta.courseTitle)}</div>
    <h1 class="title-hero">${esc(slide.title)}</h1>
    ${slide.explanation ? `<p class="title-sub">${formatInline(truncate(slide.explanation, 240))}</p>` : ""}
  </div>`;
}

function renderRecapLayout(slide, diagram) {
  const bullets = splitSentences(slide.explanation, 5);
  return `<div class="layout layout-split">
    <div class="col-left">
      <div class="eyebrow">RECAP</div>
      <h2 class="heading">${esc(slide.title)}</h2>
      <ul class="bullet-list">
        ${bullets.map((b) => `<li>${formatInline(b)}</li>`).join("")}
      </ul>
    </div>
    <div class="col-right">${diagramHTML(diagram)}</div>
  </div>`;
}

function renderConceptLayout(slide, diagram) {
  return `<div class="layout layout-split">
    <div class="col-left">
      <div class="eyebrow">CONCEPT</div>
      <h2 class="heading">${esc(slide.title)}</h2>
      ${slide.explanation ? `<p class="body-text">${formatInline(truncate(slide.explanation, 320))}</p>` : ""}
      ${calloutHTML(slide.realWorldExample)}
    </div>
    <div class="col-right">${diagramHTML(diagram)}</div>
  </div>`;
}

function renderCodeLayout(slide) {
  const lang = slide.code.lang || "";
  const fname = filenameFor(lang);
  return `<div class="layout layout-split">
    <div class="col-left">
      <div class="eyebrow">CODE</div>
      <h2 class="heading">${esc(slide.title)}</h2>
      ${slide.explanation ? `<p class="body-text">${formatInline(truncate(slide.explanation, 260))}</p>` : ""}
      ${calloutHTML(slide.realWorldExample)}
    </div>
    <div class="col-right">
      <div class="code-window">
        <div class="code-titlebar">
          <span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span>
          ${fname ? `<span class="code-filename">${esc(fname)}</span>` : ""}
        </div>
        <pre class="code-body">${highlightCode(slide.code.content, lang)}</pre>
      </div>
    </div>
  </div>`;
}

function renderContent(slide, diagram, meta) {
  const layout = pickLayout(slide);
  if (layout === "title") return renderTitleLayout(slide, meta);
  if (layout === "recap") return renderRecapLayout(slide, diagram);
  if (layout === "code") return renderCodeLayout(slide);
  return renderConceptLayout(slide, diagram);
}

export function renderSlideHTML({ themeVars, slide, diagram, meta }) {
  const pct = meta.total > 1 ? Math.round((slide.index / meta.total) * 100) : 100;

  return `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=DM+Mono:wght@400;500&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
<style>
:root {
${themeVars}
}
* { margin: 0; padding: 0; box-sizing: border-box; }
html, body {
  width: ${CANVAS_WIDTH}px;
  height: ${CANVAS_HEIGHT}px;
  overflow: hidden;
  background: var(--color-background);
  color: var(--color-on-background);
  font-family: "Space Grotesk", sans-serif;
}
.material-symbols-outlined {
  font-family: "Material Symbols Outlined";
  font-variation-settings: "FILL" 1, "wght" 500, "GRAD" 0, "opsz" 48;
  font-style: normal;
  line-height: 1;
  display: inline-block;
}
.slide { position: relative; width: 100%; height: 100%; }
.bg-glow {
  position: absolute; inset: 0;
  background: radial-gradient(circle at 20% -10%, rgba(54,236,223,0.14) 0%, rgba(1,13,26,0) 45%),
              radial-gradient(circle at 100% 100%, rgba(54,236,223,0.08) 0%, rgba(1,13,26,0) 40%);
}
.chrome-header {
  position: absolute; top: 0; left: 0; right: 0; height: 120px;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 88px;
}
.wordmark {
  display: flex; align-items: center; gap: 12px;
  font-weight: 700; font-size: 22px; letter-spacing: 0.08em;
  color: var(--color-on-surface);
}
.wordmark-dot {
  width: 14px; height: 14px; border-radius: 4px;
  background: var(--color-primary);
  box-shadow: 0 0 16px rgba(54,236,223,0.6);
}
.badge {
  font-size: 15px; font-weight: 600; letter-spacing: 0.12em;
  color: var(--color-primary);
  background: rgba(1,32,63,0.7);
  border: 1px solid rgba(54,236,223,0.25);
  padding: 8px 20px; border-radius: 999px;
}
.content {
  position: absolute; top: 120px; bottom: 90px; left: 0; right: 0;
  padding: 24px 88px 0;
  display: flex; flex-direction: column; justify-content: center;
}
.chrome-footer {
  position: absolute; bottom: 28px; left: 0; right: 0; height: 40px;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 88px;
  color: var(--color-on-surface-variant);
  font-size: 16px; font-weight: 500;
}
.footer-page { font-family: "DM Mono", monospace; letter-spacing: 0.05em; }
.progress-track {
  position: absolute; bottom: 0; left: 0; right: 0; height: 6px;
  background: rgba(255,255,255,0.06);
}
.progress-fill {
  height: 100%;
  background: var(--color-primary);
  box-shadow: 0 0 12px rgba(54,236,223,0.6);
}

/* ── Title layout ── */
.layout-title { text-align: left; max-width: 1400px; }
.kicker {
  font-size: 18px; font-weight: 700; letter-spacing: 0.18em;
  color: var(--color-primary); margin-bottom: 28px; text-transform: uppercase;
}
.title-hero {
  font-size: 104px; line-height: 1.05; font-weight: 700;
  color: var(--color-on-surface); margin-bottom: 32px;
  letter-spacing: -0.01em;
}
.title-sub {
  font-size: 32px; line-height: 1.5; font-weight: 400;
  color: var(--color-on-surface-variant); max-width: 1100px;
}

/* ── Split (concept / recap / code) layout ── */
.layout-split { display: flex; gap: 72px; align-items: stretch; height: 100%; }
.col-left { flex: 0 0 46%; display: flex; flex-direction: column; justify-content: center; }
.col-right { flex: 1; display: flex; align-items: center; justify-content: center; }
.eyebrow {
  font-size: 17px; font-weight: 700; letter-spacing: 0.16em;
  color: var(--color-primary); margin-bottom: 20px; text-transform: uppercase;
}
.heading {
  font-size: 58px; line-height: 1.1; font-weight: 700;
  color: var(--color-on-surface); margin-bottom: 28px;
}
.body-text {
  font-size: 29px; line-height: 1.55; font-weight: 400;
  color: var(--color-on-surface-variant);
}
.body-text strong, .title-sub strong, .callout strong, .bullet-list strong {
  color: var(--color-on-surface); font-weight: 700;
}
.inline-code {
  font-family: "DM Mono", monospace; font-size: 0.85em;
  color: var(--color-primary); background: rgba(54,236,223,0.1);
  padding: 2px 8px; border-radius: 6px;
}
.bullet-list { list-style: none; display: flex; flex-direction: column; gap: 18px; }
.bullet-list li {
  font-size: 27px; line-height: 1.4; color: var(--color-on-surface);
  padding-left: 34px; position: relative;
}
.bullet-list li::before {
  content: ""; position: absolute; left: 0; top: 12px;
  width: 12px; height: 12px; border-radius: 3px; background: var(--color-primary);
}
.callout {
  margin-top: 32px; display: flex; gap: 18px; align-items: flex-start;
  background: rgba(1,32,63,0.7); backdrop-filter: blur(12px);
  border: 1px solid rgba(54,236,223,0.15); border-radius: 16px; padding: 24px 28px;
}
.callout .material-symbols-outlined { color: var(--color-tertiary); font-size: 32px; flex-shrink: 0; }
.callout p { font-size: 23px; line-height: 1.5; color: var(--color-on-surface); }

/* ── Diagrams ── */
.diagram { width: 100%; display: flex; align-items: center; justify-content: center; }
.diagram.arrow-flow { flex-wrap: wrap; gap: 18px; }
.diagram.arrow-flow.stacked { flex-direction: column; }
.flow-step {
  background: rgba(1,32,63,0.7); backdrop-filter: blur(12px);
  border: 1px solid rgba(54,236,223,0.25); border-radius: 14px;
  padding: 20px 28px; font-size: 24px; font-weight: 600; color: var(--color-on-surface);
  text-align: center;
}
.flow-arrow { color: var(--color-primary); font-size: 32px; font-weight: 700; }

.numbered-steps { flex-direction: column; gap: 22px; width: 100%; }
.step-row { display: flex; align-items: center; gap: 22px; width: 100%; }
.step-num {
  flex-shrink: 0; width: 52px; height: 52px; border-radius: 50%;
  background: rgba(54,236,223,0.12); border: 1px solid rgba(54,236,223,0.4);
  color: var(--color-primary); font-weight: 700; font-size: 22px;
  display: flex; align-items: center; justify-content: center;
}
.step-text { font-size: 24px; color: var(--color-on-surface); line-height: 1.35; }

.icon-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; width: 100%; }
.icon-card {
  background: rgba(1,32,63,0.7); backdrop-filter: blur(12px);
  border: 1px solid rgba(54,236,223,0.15); border-radius: 16px;
  padding: 26px 16px; display: flex; flex-direction: column; align-items: center; gap: 12px;
  text-align: center;
}
.icon-card .material-symbols-outlined { font-size: 40px; color: var(--color-primary); }
.icon-card span:last-child { font-size: 18px; font-weight: 600; color: var(--color-on-surface); }

.comparison { display: flex; align-items: center; gap: 24px; width: 100%; }
.compare-panel {
  flex: 1; height: 280px; border-radius: 20px;
  background: rgba(1,32,63,0.7); backdrop-filter: blur(12px);
  border: 1px solid rgba(54,236,223,0.2);
  display: flex; align-items: center; justify-content: center;
}
.compare-label { font-size: 30px; font-weight: 700; color: var(--color-on-surface); text-align: center; padding: 0 20px; }
.compare-vs { font-size: 20px; font-weight: 700; color: var(--color-primary); letter-spacing: 0.1em; }

.diagram.accent { flex-direction: column; gap: 24px; text-align: center; }
.accent-icon { font-size: 120px; color: var(--color-primary); }
.accent-icon.dim { color: var(--color-outline); opacity: 0.5; }
.accent-caption { font-size: 24px; color: var(--color-on-surface-variant); max-width: 520px; line-height: 1.5; }

/* ── Code window ── */
.code-window {
  width: 100%; border-radius: 18px; overflow: hidden;
  background: var(--color-surface-container-lowest);
  border: 1px solid rgba(54,236,223,0.15);
  box-shadow: 0 20px 60px rgba(0,0,0,0.4);
}
.code-titlebar {
  display: flex; align-items: center; gap: 10px;
  padding: 16px 22px; background: var(--color-surface-container);
  border-bottom: 1px solid rgba(255,255,255,0.06);
}
.dot { width: 13px; height: 13px; border-radius: 50%; }
.dot.red { background: #ff5f57; }
.dot.yellow { background: #febc2e; }
.dot.green { background: #28c840; }
.code-filename {
  margin-left: 12px; font-family: "DM Mono", monospace; font-size: 16px;
  color: var(--color-on-surface-variant);
}
.code-body {
  font-family: "DM Mono", monospace; font-size: 22px; line-height: 1.6;
  color: var(--color-on-surface); padding: 30px 32px; white-space: pre-wrap; word-break: break-word;
}
.tok-comment { color: var(--color-on-surface-variant); font-style: italic; }
.tok-string { color: var(--color-tertiary); }
.tok-tag { color: var(--color-primary); }
.tok-keyword { color: var(--color-secondary); font-weight: 600; }
</style>
</head>
<body>
<div class="slide">
  <div class="bg-glow"></div>
  <header class="chrome-header">
    <div class="wordmark"><span class="wordmark-dot"></span>KHODZ ACADEMY</div>
    <div class="badge">WEEK ${meta.weekNumber} · SESSION ${meta.sessionNumber}</div>
  </header>
  <main class="content">
    ${renderContent(slide, diagram, meta)}
  </main>
  <footer class="chrome-footer">
    <span class="footer-title">${esc(meta.lessonTitle)}</span>
    <span class="footer-page">${String(slide.index).padStart(2, "0")} / ${String(meta.total).padStart(2, "0")}</span>
  </footer>
  <div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>
</div>
</body>
</html>`;
}
