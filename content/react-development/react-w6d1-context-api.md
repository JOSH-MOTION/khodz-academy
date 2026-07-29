
# Week 6, Day 1 — Context API

**Khodz Academy — React Development Bootcamp**
**Session:** 16 of 24 | **Duration:** ~1.5–2 hours

---

## 1. Lesson Objectives

By the end of this lesson, students will be able to:

1. Explain "prop drilling" and why it becomes a problem in larger apps.
2. Create a Context to share state across many components.
3. Provide and consume context using `createContext`, `Provider`, and `useContext`.
4. Build a working theme (light/dark) context shared app-wide.
5. Know when Context is (and isn't) the right tool.

---

## 2. Skills Students Will Learn

- The prop drilling problem
- `createContext()`
- `<Context.Provider value={...}>`
- `useContext()` to consume context in any nested component
- Combining Context with `useState` to create shareable, updatable global state
- Persisting context state with `localStorage` (recap Frontend Foundations Lesson 6)
- Recognizing when Context is overkill vs. genuinely useful

---

## 3. Detailed Teaching Outline (~1.5–2 hrs)

| Time | Segment |
|---|---|
| 0:00–0:10 | Recap Week 5 + show and tell (Multi-page Websites) |
| 0:10–0:25 | The prop drilling problem (Slides 1–3) |
| 0:25–0:45 | Creating and providing context (Slides 4–6) — live coding |
| 0:45–1:05 | Consuming context with useContext (Slides 7–8) — live coding |
| 1:05–1:20 | Building the theme toggle + localStorage (Slides 9–10) — live coding |
| 1:20–1:30 | When to use Context, recap, Q&A (Slides 11–12) |

---

## 4. Slide-by-Slide Presentation Content

### Slide 1 — Recap: Passing Data with Props
**Explanation:** Recall Week 1, Day 2: props pass data from parent to child, one level at a time. This works great for shallow component trees — but what happens when deeply nested components need the same data?
**Instructor notes:** Set up today's problem by asking students to imagine a 4–5 level deep component tree where the deepest component needs a value only the top-level `App` has.

---

### Slide 2 — The Prop Drilling Problem
**Explanation:** "Prop drilling" is passing a prop through multiple layers of components that don't actually use it themselves, just to get it to a deeply nested child that does.
**Code example:**
```jsx
function App() {
  const [theme, setTheme] = useState("light");
  return <Layout theme={theme} setTheme={setTheme} />;
}

function Layout({ theme, setTheme }) {
  return <Sidebar theme={theme} setTheme={setTheme} />; // Layout doesn't use theme itself
}

function Sidebar({ theme, setTheme }) {
  return <ThemeToggle theme={theme} setTheme={setTheme} />; // Sidebar doesn't use it either
}

function ThemeToggle({ theme, setTheme }) {
  return <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>Toggle</button>;
}
```
**Instructor notes:** Build this broken-but-working example live — let students feel the tedium of passing `theme`/`setTheme` through components that don't care about it, motivating the need for a better tool.

---

### Slide 3 — What Context Solves
**Explanation:** Context lets you make a value available to *any* component in a subtree, no matter how deeply nested, without passing it through every intermediate component's props.
**Visual suggestion:** Diagram: props (relay race, passed hand to hand) vs. context (broadcast, any component can tune in directly).
**Instructor notes:** This visual metaphor (relay race vs. broadcast) tends to stick well with beginners — use it consistently throughout the lesson.

---

### Slide 4 — Creating a Context
**Code example:**
```jsx
// src/context/ThemeContext.jsx
import { createContext } from "react";

export const ThemeContext = createContext();
```
**Instructor notes:** Keep this slide simple — just introduces the function and the idea of a dedicated `context/` folder, mirroring the organizational conventions from Week 3, Day 2 and Week 5, Day 1.

---

### Slide 5 — Providing Context: The Provider Component
**Explanation:** `<Context.Provider value={...}>` wraps a part of the app (often the whole `App`) and makes `value` available to every component inside it.
**Code example:**
```jsx
// src/context/ThemeContext.jsx
import { createContext, useState } from "react";

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
```
**Instructor notes:** Point out the `children` prop pattern here — direct callback to Week 1, Day 2. "The Provider is a wrapper component, just like the `Panel` component you built in Week 1 — it just happens to also supply context."

---

### Slide 6 — Wrapping the App with the Provider
**Code example:**
```jsx
// src/main.jsx
import { ThemeProvider } from "./context/ThemeContext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </BrowserRouter>
);
```
**Instructor notes:** Point out the similarity to `BrowserRouter` from Week 5, Day 1 — "you're already comfortable with this 'wrap the whole app in a provider' pattern; Context just adds your own custom one."

---

### Slide 7 — Consuming Context with useContext
**Code example:**
```jsx
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext.jsx";

function ThemeToggle() {
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
      {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
    </button>
  );
}
```
**Instructor notes:** Rewrite the Slide 2 example using context instead — place `ThemeToggle` deep inside `Layout` → `Sidebar` again, but this time show it needs *zero* props passed through the intermediate components. A powerful before/after contrast.

---

### Slide 8 — Any Component Can Consume Context, Anywhere
**Explanation:** Unlike props, context isn't limited to direct children — any component anywhere inside the Provider's tree can call `useContext` and get the current value, regardless of nesting depth.
**Instructor notes:** Demonstrate by consuming `ThemeContext` in two unrelated, differently-nested components simultaneously, both correctly reflecting the same shared value.

---

### Slide 9 — Applying the Theme Across the App
**Code example:**
```jsx
function App() {
  const { theme } = useContext(ThemeContext);

  return (
    <div className={theme === "dark" ? "bg-gray-900 text-white min-h-screen" : "bg-white text-gray-900 min-h-screen"}>
      <Navbar />
      <Routes>{/* ... */}</Routes>
    </div>
  );
}
```
**Instructor notes:** Recap the conditional-class pattern from Week 3, Day 1 explicitly — "same technique, now driven by shared context instead of local state."

---

### Slide 10 — Persisting Theme with localStorage
**Explanation:** Combine `useEffect` (Week 4, Day 1) with `localStorage` (recap Frontend Foundations Lesson 6) so the theme choice survives page reloads.
**Code example:**
```jsx
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
```
**Instructor notes:** Point out the lazy initializer pattern (`useState(() => ...)`) — a function passed to `useState` runs only once, on first render, ideal for reading from `localStorage`. Briefly explain why (avoids reading localStorage on every re-render).

---

### Slide 11 — When to Use Context (and When Not To)
**Explanation:** Good fits: theme, authenticated user info (Week 7), language/locale, app-wide settings — data genuinely needed in many unrelated places. Not a good fit: replacing all `useState`, or data only needed by 2–3 nearby components (plain props are simpler there).
**Instructor notes:** Explicitly counter the temptation to "context-ify everything" — reinforce the Week 3, Day 2 "avoid over-abstraction" principle in this new context (pun intended, feel free to use it).

---

### Slide 12 — Recap and What's Next
**Explanation:** Recap: prop drilling, `createContext`, `Provider`, `useContext`, building a persisted theme context, and knowing when Context fits. This forms the foundation of the Theme Switcher project. Preview: Day 2 introduces custom hooks — extracting reusable logic (like today's `useContext(ThemeContext)` pattern) into clean, purpose-named functions.
**Instructor notes:** Foreshadow explicitly: "tomorrow, we'll wrap that `useContext(ThemeContext)` call into a cleaner custom hook called `useTheme()` — a small preview of what's coming."

---

## 5. Practical Exercises During Class

1. **Prop drilling demo:** Students build the broken Slide 2 example themselves, feeling the pain before the fix is introduced.
2. **Context build-along:** Every student builds `ThemeContext`, `ThemeProvider`, and a consuming `ThemeToggle` component with the instructor.
3. **Multi-consumer drill:** Students add a second, differently-nested component that also consumes and displays the current theme.

---

## 6. Homework Assignment

- Build a complete, working **Theme Switcher**: `ThemeContext` + `ThemeProvider` with `localStorage` persistence, applied across at least 3 different pages/components of an existing project (e.g., the Multi-page Website from Week 5).
- Add a toggle button accessible from the shared navbar.
- Verify the theme persists correctly after a full page reload.

---

## 7. Mini Project — Theme Switcher (Part 1: Context Foundation)

**Brief:** "Build a working light/dark theme system shared across your entire application using Context."

**Requirements:**
- `ThemeContext` + `ThemeProvider` wrapping the app
- Theme toggle accessible from the navbar
- Applied consistently across at least 3 pages/components
- Persisted via `localStorage`
- No prop drilling used to pass the theme value

---

## 8. Common Beginner Mistakes

- Forgetting to wrap the app in the Provider, causing `useContext` to return `undefined`.
- Creating a new Context but never actually providing a `value`, leaving consumers with nothing useful.
- Overusing Context for data that would be simpler as local `useState` or regular props.
- Forgetting `[theme]` in the `useEffect` dependency array when syncing to `localStorage`, so changes don't persist correctly.
- Destructuring the wrong shape from `useContext` (e.g., expecting `theme` directly instead of `{ theme, setTheme }`).

---

## 9. Extra Resources

- [React — Passing Data Deeply with Context](https://react.dev/learn/passing-data-deeply-with-context)
- [React — useContext Reference](https://react.dev/reference/react/useContext)
