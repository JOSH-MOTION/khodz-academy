
# Week 1, Day 1 — Introduction to React, Vite, JSX, Project Structure

**Khodz Academy — React Development Bootcamp**
**Session:** 1 of 24 | **Duration:** ~1.5–2 hours

---

## 1. Lesson Objectives

By the end of this lesson, students will be able to:

1. Explain what React is and the problem it solves.
2. Explain why React is used instead of plain JavaScript for larger apps.
3. Scaffold a new React project using Vite.
4. Understand the default project structure.
5. Read and write basic JSX.
6. Run and view a React app locally.

---

## 2. Skills Students Will Learn

- What a JavaScript library/framework is, and where React fits
- Component-based thinking (recap/formalize from Frontend Foundations)
- Installing and using Vite to scaffold a React project
- The dev server workflow (`npm run dev`)
- Reading a Vite + React project structure (`src/`, `main.jsx`, `App.jsx`, `index.html`)
- JSX syntax basics: embedding expressions, single root element, `className` instead of `class`
- The Virtual DOM concept (just enough to build intuition)

---

## 3. Detailed Teaching Outline (~1.5–2 hrs)

| Time | Segment |
|---|---|
| 0:00–0:10 | Welcome to Month 2, course roadmap, what students will build (Slides 1–2) |
| 0:10–0:25 | What is React and why use it? (Slides 3–5) |
| 0:25–0:40 | Setting up Vite + React (Slides 6–7) — hands-on |
| 0:40–0:55 | Project structure walkthrough (Slides 8–9) |
| 0:55–1:15 | JSX fundamentals (Slides 10–13) — live coding |
| 1:15–1:30 | The Virtual DOM, recap, Q&A (Slides 14–15) |

---

## 4. Slide-by-Slide Presentation Content

### Slide 1 — Welcome to the React Development Bootcamp
**Explanation:** Introduce Month 2's goal: turn Frontend Foundations skills into the ability to build real, modern web applications the way companies actually do it.
**Visual suggestion:** 8-week roadmap graphic with the 8 projects.
**Instructor notes:** Remind students this course assumes their Frontend Foundations skills (HTML, Tailwind, JS, DOM, APIs, Git) — today builds directly on top of that foundation, nothing is thrown away.

---

### Slide 2 — What You'll Build This Course
**Explanation:** Preview thumbnails of all 8 projects: Counter → To-Do → Dashboard → Movie Search → Multi-page site → Theme Switcher → Student Management App → Capstone.
**Instructor notes:** Motivational framing slide — "by the end, you'll have built a real login-protected, multi-page, API-driven application."

---

### Slide 3 — The Problem React Solves
**Explanation:** In vanilla JS (Frontend Foundations), updating the UI meant manually selecting elements and changing them (`textContent`, `classList.toggle`) every time data changed — this gets messy fast in bigger apps. React lets you describe *what the UI should look like for a given state*, and it handles updating the actual page for you.
**Real-world example:** Recall the Lesson 6 quiz app — every question change required manually calling `renderQuestion()` and re-writing DOM elements by hand. React automates and formalizes that exact pattern.
**Instructor notes:** This connection to their own prior project is the most important framing of the day — say it explicitly, don't leave it implicit.

---

### Slide 4 — What Is React?
**Explanation:** React is a JavaScript library for building user interfaces out of reusable **components** — self-contained pieces of UI (like the cards, navbars, and buttons students built by hand in Frontend Foundations, now formalized as real, reusable code units).
**Visual suggestion:** A webpage broken into labeled boxes: Navbar component, Card component, Footer component.
**Instructor notes:** Show a real site's component breakdown (e.g., sketch boxes over a screenshot of a familiar site) to make "component thinking" concrete immediately.

---

### Slide 5 — Why Companies Use React
**Explanation:** React is currently one of the most in-demand frontend skills — used by Meta (creator), Netflix, Airbnb, Uber, and countless startups/freelance projects. Learning it is directly tied to employability and higher-paying freelance work.
**Instructor notes:** Relevance/motivation slide — connect explicitly to Khodz Academy's promise of job-readiness.

---

### Slide 6 — Setting Up a React Project with Vite
**Explanation:** Vite is a fast, modern build tool that scaffolds and runs React projects with minimal setup — the current industry-standard starting point for new React apps (replacing older tools like Create React App).
**Code example:**
```bash
npm create vite@latest counter-app -- --template react
cd counter-app
npm install
npm run dev
```
**Instructor notes:** Do this live, step by step, on screen. Confirm every student sees the "Local: http://localhost:5173" message and can open it in the browser before moving on — this is today's most critical checkpoint.

---

### Slide 7 — Running and Editing the App Live
**Explanation:** Vite's dev server supports Hot Module Replacement (HMR) — saving a file updates the browser instantly without a full refresh.
**Instructor notes:** Make a trivial text change in `App.jsx`, save, and let students watch the browser update instantly without pressing refresh — a strong "wow" moment for anyone coming from Live Server's manual refresh workflow.

---

### Slide 8 — Understanding the Project Structure
**Explanation:** Key files/folders: `index.html` (the single real HTML file), `src/main.jsx` (entry point, mounts React into the page), `src/App.jsx` (root component), `src/assets/` (images etc.), `package.json` (project config/dependencies).
**Visual suggestion:** Annotated folder tree diagram.
**Code example:**
```
counter-app/
├── index.html
├── package.json
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   └── assets/
```
**Instructor notes:** Emphasize `index.html` now contains almost nothing — just a `<div id="root">` — because React builds everything else dynamically. This is a conceptual shift worth pausing on.

---

### Slide 9 — How React Mounts Into the Page
**Explanation:** `main.jsx` uses `ReactDOM.createRoot()` to find the `#root` div in `index.html` and render the `<App />` component into it — this is the bridge between plain HTML and the React app.
**Code example:**
```jsx
// src/main.jsx
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(<App />);
```
**Instructor notes:** Trace it visually: `index.html`'s `<div id="root">` → `main.jsx` finds it → renders `<App />` inside. Draw arrows on screen if helpful.

---

### Slide 10 — What Is JSX?
**Explanation:** JSX lets you write HTML-like syntax directly inside JavaScript. It's not real HTML — it compiles into JavaScript function calls that build the UI, but it looks and feels like HTML, which is why it's approachable coming from Frontend Foundations.
**Code example:**
```jsx
function App() {
  return (
    <div>
      <h1>Hello, Khodz Academy!</h1>
    </div>
  );
}
```
**Instructor notes:** Reassure students this looks almost exactly like the HTML they already know — the differences are small and specific, covered next.

---

### Slide 11 — JSX Rule: One Root Element
**Explanation:** A component must return a single parent element wrapping everything else. Use a `<div>` or a **Fragment** (`<>...</>`) if you don't want an extra wrapping element in the actual DOM.
**Code example:**
```jsx
// ❌ Invalid — two root elements
return (
  <h1>Title</h1>
  <p>Text</p>
);

// ✅ Valid — wrapped in a Fragment
return (
  <>
    <h1>Title</h1>
    <p>Text</p>
  </>
);
```
**Instructor notes:** Trigger this error live (return two elements without wrapping) so students see the actual compiler error message and recognize it later on their own.

---

### Slide 12 — Embedding JavaScript in JSX
**Explanation:** Curly braces `{}` embed any JavaScript expression directly inside JSX — variables, function calls, calculations.
**Code example:**
```jsx
function App() {
  const studentName = "Amaka";
  const year = 2026;

  return (
    <div>
      <h1>Welcome, {studentName}!</h1>
      <p>Course year: {year}</p>
    </div>
  );
}
```
**Instructor notes:** Connect to Lesson 5 of Frontend Foundations' template literals (`` `${variable}` ``) — same idea, different syntax context.

---

### Slide 13 — JSX Differences from HTML
**Explanation:** Key differences: `className` instead of `class` (since `class` is a reserved JS word), attributes are camelCase (`onClick`, not `onclick`), self-closing tags require the slash (`<img />`, not `<img>`).
**Code example:**
```jsx
<img src="profile.jpg" alt="Profile" className="w-32 h-32 rounded-full" />
```
**Instructor notes:** Frame these as "small syntax rules to memorize through repetition," not deep concepts — students will absorb them naturally through the rest of the course.

---

### Slide 14 — The Virtual DOM (Just Enough)
**Explanation:** React keeps a lightweight in-memory copy of the UI (the Virtual DOM). When state changes, React compares the new Virtual DOM to the previous one and updates only the parts of the real DOM that actually changed — faster and less error-prone than manual DOM manipulation.
**Visual suggestion:** Before/after diagram: Virtual DOM comparison → only the changed node updates in the real DOM.
**Instructor notes:** Keep this conceptual and brief — the goal is "React figures out efficient updates for you," not a deep dive into reconciliation algorithms.

---

### Slide 15 — Recap and What's Next
**Explanation:** Recap: what React is and why it's used, Vite setup, project structure, JSX basics, the Virtual DOM concept. Preview: tomorrow (Day 2) covers components, props, and composition — turning today's single `App.jsx` into multiple reusable, connected pieces.
**Instructor notes:** End by having students explore their own `App.jsx` and make one small change (add a paragraph, change text) to build initial comfort before homework.

---

## 5. Practical Exercises During Class

1. **Setup checkpoint:** Every student scaffolds a fresh Vite + React project and confirms the dev server runs.
2. **HMR drill:** Students make 3 small text/JSX changes to `App.jsx` and observe hot-reload each time.
3. **JSX fix-it:** Instructor shows broken JSX (two root elements, `class` instead of `className`); students identify and fix the errors.

---

## 6. Homework Assignment

- Scaffold a new Vite + React project named `counter-app`.
- In `App.jsx`, build a static (non-interactive yet) layout for a counter: a heading, a large number display (hardcoded for now), and two buttons ("+" and "-") — no functionality required yet, just JSX structure and basic Tailwind styling (Tailwind setup covered fully in Week 3, but students may add the CDN script now if comfortable).
- Write 3 sentences (as a code comment) explaining in your own words: what is JSX, and what is the Virtual DOM.

---

## 7. Mini Project — Counter App (Part 1: Structure)

**Brief:** "Build the visual foundation of a counter app — the interactivity comes in Day 3, once state and events are covered."

**Requirements:**
- Vite + React project set up and running
- `App.jsx` returns a single root element containing: a heading, a number display, and two buttons
- Clean JSX (no console errors, proper `className` usage)

*(This project continues and completes in Day 3.)*

---

## 8. Common Beginner Mistakes

- Forgetting to run `npm install` before `npm run dev`, causing missing module errors.
- Returning multiple root elements from a component without wrapping them.
- Using `class` instead of `className`, which silently does nothing (no error, just no styling).
- Forgetting curly braces when embedding a JavaScript variable inside JSX.
- Editing `index.html` expecting to see content changes, instead of editing `App.jsx`.
- Confusing the terms "React" (the library) and "Vite" (the build tool) — clarify they are separate tools working together.

---

## 9. Extra Resources

- [React — Official Docs: Quick Start](https://react.dev/learn)
- [Vite — Official Guide](https://vitejs.dev/guide/)
- [React — Writing Markup with JSX](https://react.dev/learn/writing-markup-with-jsx)
