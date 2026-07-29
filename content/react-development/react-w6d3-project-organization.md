
# Week 6, Day 3 — Project Organization

**Khodz Academy — React Development Bootcamp**
**Session:** 18 of 24 | **Duration:** ~1.5–2 hours

---

## 1. Lesson Objectives

By the end of this lesson, students will be able to:

1. Structure a mid-to-large React project cleanly and consistently.
2. Apply a standard folder convention: `pages/`, `components/ui/`, `components/`, `context/`, `hooks/`, `utils/`, `assets/`.
3. Use consistent import conventions and path organization.
4. Extract shared constants/utility functions appropriately.
5. Fully refactor and complete the Theme Switcher project with clean organization.

---

## 2. Skills Students Will Learn

- A standard, scalable React project folder structure
- Separating pages, feature components, shared UI components, context, hooks, and utilities
- Naming conventions (PascalCase components, camelCase functions/hooks, consistent file naming)
- Extracting shared constants (API URLs, config values) into a `constants.js` or `.env` file
- Using `.env` files for environment variables (e.g., API keys) instead of hardcoding
- Writing clean import statements (recap of organizational hygiene from earlier weeks, now formalized)

---

## 3. Detailed Teaching Outline (~1.5–2 hrs)

| Time | Segment |
|---|---|
| 0:00–0:10 | Recap Day 2 + show and tell |
| 0:10–0:25 | Why organization matters at scale (Slides 1–2) |
| 0:25–0:45 | The standard folder structure (Slides 3–6) — live coding/refactor |
| 0:45–1:05 | Environment variables and constants (Slides 7–9) — live coding |
| 1:05–1:20 | Full project refactor exercise (Slides 10–11) |
| 1:20–1:30 | Recap, common mistakes, Q&A (Slide 12) |

---

## 4. Slide-by-Slide Presentation Content

### Slide 1 — Why This Matters Now
**Explanation:** Over five weeks, students have organically introduced `pages/` (Week 5), `components/ui/` (Week 3), `context/` and `hooks/` (Week 6) — today formalizes all of it into one coherent, intentional structure, rather than an accidental one.
**Instructor notes:** Frame this as "cleaning the workshop," not new tools — a housekeeping lesson that pays off heavily for the CRUD/auth work coming in Week 7.

---

### Slide 2 — What Bad Organization Looks Like
**Explanation:** A project with every component dumped flat into `src/` becomes hard to navigate, hard to know what's reusable vs. page-specific, and hard for a new developer (or freelance collaborator) to onboard onto quickly.
**Visual suggestion:** Side-by-side: a messy flat file list vs. a clean folder tree.
**Instructor notes:** If possible, show a real messy student project from earlier in the course (with permission) as the "before" — grounds the lesson in something authentic rather than a hypothetical.

---

### Slide 3 — The Standard Folder Structure
**Code example:**
```
src/
├── assets/          # images, icons, fonts
├── components/
│   ├── ui/          # generic, reusable (Button, Card, Input, Badge)
│   └── [Feature].jsx # feature-specific (TaskItem, StatCard)
├── context/          # React Context providers
├── hooks/            # custom hooks
├── layouts/           # layout/wrapper route components
├── pages/            # route-level page components
├── utils/            # helper functions (formatting, validation, etc.)
├── constants.js       # shared constant values
├── App.jsx
└── main.jsx
```
**Instructor notes:** Present this as the day's key reference — have students recreate this structure in a real project as the very next step, before diving into any explanation of individual pieces.

---

### Slide 4 — Feature Components vs. UI Components
**Explanation:** `components/ui/` holds fully generic components with no knowledge of the app's specific data (recap Week 3, Day 2). `components/` (top-level) holds components tied to specific features/data shapes (`TaskItem`, `StatCard`, `ProjectCard`).
**Instructor notes:** Use the To-Do App and Admin Dashboard as running examples: `Button`/`Card` are UI; `TaskItem`/`StatCard` are feature components built *from* UI components.

---

### Slide 5 — The utils/ Folder
**Explanation:** Pure helper functions that don't use hooks or JSX belong in `utils/` — e.g., date formatting, string truncation, validation helpers.
**Code example:**
```js
// src/utils/formatDate.js
export function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
```
**Instructor notes:** Clarify the distinction from `hooks/`: if a function doesn't call `useState`/`useEffect`/other hooks and doesn't return JSX, it's a plain utility, not a hook — even if it starts to feel hook-adjacent.

---

### Slide 6 — Refactoring an Existing Project
**Explanation:** Live-refactor the Theme Switcher (or Multi-page Website) into the standard structure: move files into the correct folders, update all import paths accordingly.
**Instructor notes:** This is intentionally tedious, real work — let students feel that a little pain now (fixing import paths) is far cheaper than doing it later on a much bigger project. Use VS Code's "Find and Replace" or auto-import features to speed this up and demonstrate efficient tooling use.

---

### Slide 7 — The Problem with Hardcoded API Keys
**Explanation:** Recall Week 4's OMDb API key, likely hardcoded directly in a component so far — this is fine for local practice, but a bad habit for real projects, especially ones pushed to public GitHub repos (recall Frontend Foundations Lesson 8's Git/GitHub workflow).
**Instructor notes:** Connect explicitly to Frontend Foundations Lesson 8's common-mistakes note about not exposing keys carelessly — today finally gives students the proper tool to fix it.

---

### Slide 8 — Using Environment Variables with Vite
**Explanation:** Vite supports `.env` files for storing configuration values (like API keys) outside your source code, accessed via `import.meta.env`.
**Code example:**
```
# .env
VITE_OMDB_API_KEY=your_key_here
```
```jsx
const API_KEY = import.meta.env.VITE_OMDB_API_KEY;

fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&t=inception`);
```
**Instructor notes:** Point out the required `VITE_` prefix — Vite only exposes env variables to the frontend code if they start with this prefix, a deliberate security measure worth explaining briefly.

---

### Slide 9 — Ignoring .env in Git
**Explanation:** Add `.env` to `.gitignore` so API keys are never accidentally committed and pushed to a public GitHub repository — connects directly to Frontend Foundations Lesson 8's Git workflow.
**Code example:**
```
# .gitignore
node_modules/
dist/
.env
```
**Instructor notes:** Check every student's `.gitignore` live — a genuinely important security habit, not just a style preference, worth verifying rather than assuming.

---

### Slide 10 — Extracting Shared Constants
**Explanation:** Non-secret, reused values (route paths, category lists, config numbers) belong in a `constants.js` file rather than being magic values scattered across components.
**Code example:**
```js
// src/constants.js
export const ROUTES = {
  HOME: "/",
  ABOUT: "/about",
  DASHBOARD: "/dashboard",
};

export const THEME_STORAGE_KEY = "theme";
```
**Instructor notes:** Show one before/after: a hardcoded string route path in a `Link` component, replaced with `ROUTES.DASHBOARD` — a small but real professional polish habit.

---

### Slide 11 — Full Refactor Exercise
**Explanation:** Guided, hands-on time: every student reorganizes their Theme Switcher (and ideally Movie Search App) into the standard structure, extracts the API key into `.env`, and adds a `.gitignore`.
**Instructor notes:** Circulate and help debug broken import paths individually — this is expected to be the messiest, most support-intensive part of the session; budget time accordingly.

---

### Slide 12 — Recap and What's Next
**Explanation:** Recap: the standard folder structure, feature vs. UI components, `utils/`, environment variables, `.gitignore`, and shared constants. This completes Week 6 and the Theme Switcher project. Preview: Week 7 begins full CRUD operations against a real API, authentication concepts, and protected routes — building the Student Management App, the most ambitious project so far.
**Instructor notes:** Frame Week 6's organizational discipline as direct preparation for Week 7's complexity — "the bigger the project gets, the more this structure saves you."

---

## 5. Practical Exercises During Class

1. **Structure recreation drill:** Students create the full standard folder structure (even empty folders) in a fresh or existing project.
2. **Env variable drill:** Students move their OMDb API key into `.env` and confirm the Movie Search App still works.
3. **Refactor pairing:** In pairs, students help each other fix broken import paths after reorganizing files.

---

## 6. Homework Assignment

- Fully reorganize both the Theme Switcher and Movie Search App into the standard folder structure from Slide 3.
- Move all API keys into `.env` files, confirm `.gitignore` excludes them, and verify (by checking GitHub after pushing) that the key is not visible in the public repo.
- Extract at least 3 shared constants (routes, storage keys, or similar) into a `constants.js` file.

---

## 7. Mini Project — Theme Switcher (Final, Reorganized)

**Brief:** "Deliver your completed Theme Switcher project, now properly organized following professional conventions."

**Requirements:**
- Full standard folder structure applied (`pages/`, `components/ui/`, `context/`, `hooks/`, `utils/`, `constants.js`)
- `useTheme`, `useLocalStorage` custom hooks (from Day 2) in place
- No hardcoded API keys anywhere in source files (if applicable to the project)
- `.gitignore` correctly excluding `.env`
- Clean, working imports throughout — app runs with no errors after reorganization

---

## 8. Common Beginner Mistakes

- Forgetting to restart the Vite dev server after adding/changing `.env` variables.
- Forgetting the required `VITE_` prefix on environment variable names, resulting in `undefined`.
- Committing a `.env` file before adding it to `.gitignore` (already-tracked files aren't ignored retroactively without extra steps — mention `git rm --cached .env` as the fix if this happens).
- Over-engineering the folder structure for a genuinely small project — reiterate that judgment (Week 3, Day 2's over-abstraction lesson) applies to file organization too.
- Breaking imports during reorganization and not systematically checking the terminal/console for the resulting errors.

---

## 9. Extra Resources

- [Vite — Env Variables and Modes](https://vitejs.dev/guide/env-and-mode.html)
- [React — File Structure (community guide)](https://react.dev/learn/thinking-in-react)
- [GitHub Docs — Removing Sensitive Data from a Repository](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)
