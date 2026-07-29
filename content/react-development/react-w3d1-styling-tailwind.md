
# Week 3, Day 1 — Styling React with Tailwind CSS

**Khodz Academy — React Development Bootcamp**
**Session:** 7 of 24 | **Duration:** ~1.5–2 hours

---

## 1. Lesson Objectives

By the end of this lesson, students will be able to:

1. Properly install and configure Tailwind CSS in a Vite + React project (CLI method, not CDN).
2. Apply Tailwind utility classes inside JSX using `className`.
3. Build conditional/dynamic class strings based on props or state.
4. Use a helper pattern for cleanly combining conditional classes.
5. Restyle the To-Do App and Counter App with production-quality Tailwind styling.

---

## 2. Skills Students Will Learn

- Installing Tailwind CSS properly in a Vite project (`npm install`, config files, `@tailwind` directives)
- Using `className` (recap from Week 1, Day 1) consistently across components
- Building dynamic class strings with template literals
- Conditional classes based on props/state (`isActive ? "bg-blue-600" : "bg-gray-200"`)
- Introducing a `clsx`-style helper pattern for readability (optional package or manual template literal function)
- Styling entire component trees consistently (design system thinking)

---

## 3. Detailed Teaching Outline (~1.5–2 hrs)

| Time | Segment |
|---|---|
| 0:00–0:10 | Recap Week 2 + show and tell (completed To-Do Apps) |
| 0:10–0:25 | Why Tailwind + React is a natural pairing (Slides 1–2) |
| 0:25–0:45 | Proper Tailwind CLI installation in Vite (Slides 3–5) — hands-on |
| 0:45–1:05 | Dynamic and conditional classes (Slides 6–9) — live coding |
| 1:05–1:20 | Restyling the To-Do App (Slides 10–11) — live coding |
| 1:20–1:30 | Recap, common mistakes, Q&A (Slide 12) |

---

## 4. Slide-by-Slide Presentation Content

### Slide 1 — Recap: Tailwind from Frontend Foundations
**Explanation:** Students already know Tailwind's utility classes (colors, spacing, flex, typography) from Frontend Foundations Lessons 2–4, applied via the CDN `<script>` tag. Today: (1) install it "for real" using the CLI/Vite integration used in production apps, and (2) learn to make classes dynamic based on component state/props — something static HTML couldn't do.
**Instructor notes:** Reassure students the *classes themselves* aren't new — only the setup method and the "dynamic class" technique are new today.

---

### Slide 2 — Why Tailwind Pairs Well with Components
**Explanation:** Since each React component is already a self-contained unit, keeping its styles inline via Tailwind classes (rather than a separate CSS file) keeps everything about that component in one place — matching React's component-first philosophy.
**Instructor notes:** Reinforce the "component thinking" theme running through the whole course — styling co-located with markup and logic.

---

### Slide 3 — Installing Tailwind CSS in Vite (CLI Method)
**Explanation:** Unlike the CDN method used for quick prototyping in Frontend Foundations, real projects install Tailwind as a build dependency so unused styles are automatically stripped out and IDE tooling (autocomplete) works properly.
**Code example:**
```bash
npm install tailwindcss @tailwindcss/vite
```
```js
// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```
**Instructor notes:** Do this live, step by step, on a fresh or existing project. Confirm every student's dev server restarts cleanly before continuing — installation friction here can derail the whole session if not checked early.

---

### Slide 4 — Importing Tailwind into the App
**Code example:**
```css
/* src/index.css */
@import "tailwindcss";
```
```jsx
// src/main.jsx
import "./index.css";
```
**Instructor notes:** Emphasize this single import line is the *only* CSS file needed for the entire project — everything else is utility classes in JSX.

---

### Slide 5 — Verifying the Setup
**Code example:**
```jsx
function App() {
  return <h1 className="text-3xl font-bold text-blue-600">Tailwind is working!</h1>;
}
```
**Instructor notes:** Have every student confirm this renders with the correct blue, bold, large text before moving on — a clear go/no-go checkpoint.

---

### Slide 6 — className Is Just a Prop
**Explanation:** In React, `className` is simply a string — which means it can be built dynamically using any JavaScript, not just typed as static text.
**Code example:**
```jsx
function Badge({ label }) {
  const classes = "px-3 py-1 rounded-full text-sm font-medium";
  return <span className={classes}>{label}</span>;
}
```
**Instructor notes:** This reframing — "className is just a string, and strings can be built with logic" — is the conceptual key that unlocks everything else today.

---

### Slide 7 — Conditional Classes with Template Literals
**Explanation:** Combine static and conditional classes using template literals and ternaries, exactly like building any other dynamic string (recap Frontend Foundations Lesson 5's template literals).
**Code example:**
```jsx
function StatusBadge({ isActive }) {
  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
      isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
    }`}>
      {isActive ? "Active" : "Inactive"}
    </span>
  );
}
```
**Instructor notes:** This is the day's centerpiece pattern — build it slowly, testing both states by toggling the prop manually in `App`.

---

### Slide 8 — Conditional Classes Based on State
**Explanation:** The same pattern applies directly to state, not just props — e.g., a button's appearance while loading, or a tab's active/inactive appearance.
**Code example:**
```jsx
function TabButton({ label, isSelected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg ${
        isSelected ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
    >
      {label}
    </button>
  );
}
```
**Instructor notes:** Connect directly to Frontend Foundations Lesson 6's manual `classList.toggle()` pattern — "React handles this automatically now; you just describe what the class *should* be for each state."

---

### Slide 9 — A Cleaner Pattern for Complex Class Logic
**Explanation:** When a component has many conditional classes, extract the logic into a variable above the `return` for readability, rather than one long inline template literal.
**Code example:**
```jsx
function TaskItem({ task }) {
  const itemClasses = task.done
    ? "bg-green-50 line-through text-gray-400"
    : "bg-white text-gray-800";

  return (
    <li className={`flex justify-between p-3 rounded-lg shadow ${itemClasses}`}>
      {task.title}
    </li>
  );
}
```
**Instructor notes:** Frame this as a readability upgrade, not a new concept — same conditional logic from Day 1 of Week 2 (ternaries), just applied to build a class string instead of JSX.

---

### Slide 10 — Restyling the To-Do App
**Explanation:** Apply today's dynamic-class techniques to elevate the To-Do App's visual polish: hover states on delete buttons, smooth transitions, consistent spacing rhythm (recap Frontend Foundations Lesson 2's spacing scale).
**Code example:**
```jsx
<button
  onClick={() => onDelete(task.id)}
  className="text-red-500 text-sm hover:text-red-700 transition-colors"
>
  Delete
</button>
```
**Instructor notes:** Introduce `transition-colors`/`transition` here as a small but high-impact polish utility — quick payoff for minimal new syntax.

---

### Slide 11 — Building a Reusable Button Component
**Explanation:** Extract a `Button` component with a `variant` prop (`"primary" | "secondary" | "danger"`) that internally decides its own classes — previews Day 2's deeper reusability focus.
**Code example:**
```jsx
function Button({ variant = "primary", children, ...props }) {
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200",
    danger: "text-red-500 hover:text-red-700",
  };

  return (
    <button className={`px-4 py-2 rounded-lg transition-colors ${variants[variant]}`} {...props}>
      {children}
    </button>
  );
}

// Usage:
<Button variant="danger" onClick={() => onDelete(task.id)}>Delete</Button>
```
**Instructor notes:** Introduce the `...props` spread briefly ("passes through any other props, like `onClick`, automatically") — full depth on this pattern isn't required today, just functional recognition.

---

### Slide 12 — Recap and What's Next
**Explanation:** Recap: proper Tailwind + Vite installation, dynamic class strings, conditional styling based on props/state, and building a reusable `Button` component. Preview: Day 2 goes deeper on component reusability patterns — building a small library of shared UI components used throughout the rest of the course.
**Instructor notes:** Point out explicitly that the `Button` component from Slide 11 will be reused starting tomorrow — connects today directly to tomorrow's work.

---

## 5. Practical Exercises During Class

1. **Setup checkpoint:** Every student installs Tailwind via CLI/Vite plugin and confirms Slide 5's test heading renders correctly.
2. **Conditional class drill:** Build a `PriorityTag` component that colors itself red/yellow/green based on a `priority` prop (`"high" | "medium" | "low"`).
3. **Restyle drill:** Students apply hover states and transitions to at least 2 elements in their existing To-Do App.

---

## 6. Homework Assignment

- Fully restyle both the Counter App and To-Do App using proper Tailwind CLI setup (migrate off the CDN if used earlier).
- Build the reusable `Button` component (Slide 11) and use it everywhere a button appears across both apps.
- Add at least one conditional-class component (e.g., a status badge or priority tag) to either app.

---

## 7. Mini Project — Restyled Apps + Reusable Button Component

**Brief:** "Upgrade your existing apps to a properly installed Tailwind setup, and introduce your first shared, reusable styled component."

**Requirements:**
- Tailwind installed via CLI/Vite plugin (not CDN) in at least one project
- A `Button` component with at least 2 variants, used consistently
- At least one component using dynamic/conditional classes based on props or state
- Visual polish: hover states, transitions, consistent spacing

---

## 8. Common Beginner Mistakes

- Forgetting to import the CSS file (`index.css`) into `main.jsx`, so no styles apply despite correct configuration.
- Typos inside template literals breaking the class string silently (e.g., missing a space between static and dynamic classes, merging two class names into one).
- Writing overly long inline ternaries directly in `className`, hurting readability — prefer extracting to a variable (Slide 9).
- Forgetting to restart the dev server after changing `vite.config.js`.
- Mixing CDN and CLI Tailwind setups in the same project, causing conflicts or confusion.

---

## 9. Extra Resources

- [Tailwind CSS — Installing with Vite](https://tailwindcss.com/docs/installation/using-vite)
- [Tailwind CSS Docs (recap from Frontend Foundations)](https://tailwindcss.com/docs)
- [React — Passing Props (children, spread props recap)](https://react.dev/learn/passing-props-to-a-component)
