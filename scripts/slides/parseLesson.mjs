const SLIDE_HEADER_RE = /^### Slide\s+(\d+)\s*[—-]\s*(.+)$/gm;
const NEXT_SECTION_RE = /^## \d+\./m;
const FIELD_LABELS = [
  "Explanation",
  "Real-world example",
  "Code example",
  "Visual suggestion",
  "Instructor notes",
];
const FIELD_RE = new RegExp(`\\*\\*(${FIELD_LABELS.join("|")}):\\*\\*`, "g");

/**
 * Parses the "## 4. Slide-by-Slide Presentation Content" section of a
 * Khodz Academy lesson markdown file into structured slide objects.
 *
 * Expected per-slide shape in the source markdown:
 *   ### Slide N — Title
 *   **Explanation:** ...
 *   **Real-world example:** ...        (optional)
 *   **Code example:**                  (optional)
 *   ```lang
 *   ...
 *   ```
 *   **Visual suggestion:** ...         (optional)
 *   **Instructor notes:** ...          (optional, kept for reference only —
 *                                        never rendered onto the slide image)
 */
export function parseLessonSlides(markdown) {
  const headerMatches = [...markdown.matchAll(SLIDE_HEADER_RE)];
  if (headerMatches.length === 0) return [];

  const slides = [];
  for (let i = 0; i < headerMatches.length; i++) {
    const m = headerMatches[i];
    const bodyStart = m.index + m[0].length;
    const bodyEnd =
      i + 1 < headerMatches.length ? headerMatches[i + 1].index : findEndOfSlidesSection(markdown, bodyStart);
    const body = markdown.slice(bodyStart, bodyEnd);

    slides.push({
      index: parseInt(m[1], 10),
      title: m[2].trim(),
      ...parseSlideBody(body),
    });
  }
  return slides;
}

function findEndOfSlidesSection(markdown, from) {
  const rest = markdown.slice(from);
  const next = rest.match(NEXT_SECTION_RE);
  return next ? from + next.index : markdown.length;
}

function parseSlideBody(body) {
  let code = null;
  let text = body;

  const codeMatch = body.match(/```(\w*)\n([\s\S]*?)```/);
  if (codeMatch) {
    code = {
      lang: codeMatch[1] || "text",
      content: codeMatch[2].replace(/\n+$/, ""),
    };
    text = body.slice(0, codeMatch.index) + body.slice(codeMatch.index + codeMatch[0].length);
  }

  const labelMatches = [...text.matchAll(FIELD_RE)];
  const fields = {};
  for (let i = 0; i < labelMatches.length; i++) {
    const lm = labelMatches[i];
    const key = lm[1];
    const valStart = lm.index + lm[0].length;
    const valEnd = i + 1 < labelMatches.length ? labelMatches[i + 1].index : text.length;
    fields[key] = text
      .slice(valStart, valEnd)
      .replace(/^\s*[-—]?\s*/, "")
      .replace(/\n+$/, "")
      .trim();
  }

  return {
    explanation: fields["Explanation"] || null,
    realWorldExample: fields["Real-world example"] || null,
    visualSuggestion: fields["Visual suggestion"] || null,
    instructorNotes: fields["Instructor notes"] || null,
    code,
  };
}

/** Pulls the H1 lesson title, e.g. "Lesson 1 — Introduction to Web Development + HTML Fundamentals". */
export function parseLessonTitle(markdown) {
  const m = markdown.match(/^#\s+(.+)$/m);
  return m ? m[1].trim() : "Untitled Lesson";
}
