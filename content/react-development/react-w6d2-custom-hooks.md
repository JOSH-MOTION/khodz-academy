
# Week 6, Day 2 — Custom Hooks

**Khodz Academy — React Development Bootcamp**
**Session:** 17 of 24 | **Duration:** ~1.5–2 hours

---

## 1. Lesson Objectives

By the end of this lesson, students will be able to:

1. Explain what a custom hook is and why it's useful.
2. Extract repeated stateful logic into a reusable custom hook.
3. Follow the naming convention and rules for custom hooks.
4. Build several practical custom hooks: `useTheme`, `useLocalStorage`, `useFetch`.
5. Refactor existing project code to use custom hooks.

---

## 2. Skills Students Will Learn

- What qualifies as a "hook" (any function starting with `use` that can call other hooks)
- Extracting logic into a custom hook function
- Returning values/functions from a custom hook for components to use
- Building `useTheme()` as a clean wrapper around `useContext(ThemeContext)`
- Building `useLocalStorage()` as a generalized, reusable version of Week 6 Day 1's persistence logic
- Building `useFetch()` as a generalized version of Week 4's data-fetching pattern
- The Rules of Hooks, revisited with more context

---

## 3. Detailed Teaching Outline (~1.5–2 hrs)

| Time | Segment |
|---|---|
| 0:00–0:10 | Recap Day 1 + show and tell |
| 0:10–0:20 | What is a custom hook? (Slides 1–2) |
| 0:20–0:35 | Building useTheme (Slides 3–4) — live coding |
| 0:35–0:55 | Building useLocalStorage (Slides 5–7) — live coding |
| 0:55–1:20 | Building useFetch (Slides 8–10) — live coding |
| 1:20–1:30 | Rules of hooks recap, Q&A (Slides 11–12) |

---

## 4. Slide-by-Slide Presentation Content

### Slide 1 — Recap: Hooks Used So Far
**Explanation:** Recall `useState`, `useEffect`, `useContext`, `useParams`, `useNavigate` — all "hooks" provided by React or React Router. Today, students learn to write their *own*.
**Instructor notes:** List these explicitly on screen — reinforces that today isn't introducing an unfamiliar concept, just a new capability (writing hooks, not just using them).

---

### Slide 2 — What Is a Custom Hook?
**Explanation:** A custom hook is simply a regular JavaScript function whose name starts with `use`, that can call other hooks inside it (which regular functions can't do). It exists purely to extract and reuse stateful logic across multiple components.
**Real-world example:** Yesterday's `useContext(ThemeContext)` call could be repeated in every component that needs theme — or wrapped once into a clean, purpose-named `useTheme()` hook.
**Instructor notes:** The naming convention (`use` prefix) isn't just a style choice — React's linter uses it to enforce the Rules of Hooks correctly, so it's a functional requirement, not just convention.

---

### Slide 3 — Building useTheme
**Code example:**
```jsx
// src/hooks/useTheme.js
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext.jsx";

export function useTheme() {
  return useContext(ThemeContext);
}
```
**Instructor notes:** Point out this is almost trivially short — custom hooks don't need to be complex to be valuable; even a one-line wrapper improves readability and hides implementation details.

---

### Slide 4 — Using useTheme in Components
**Code example:**
```jsx
import { useTheme } from "../hooks/useTheme.js";

function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  );
}
```
**Instructor notes:** Compare directly against yesterday's `useContext(ThemeContext)` call — same result, cleaner, more descriptive code. Also mention: if `ThemeContext`'s internal structure ever changes, only `useTheme` needs updating, not every consuming component — a real maintainability win.

---

### Slide 5 — Building useLocalStorage: The Problem
**Explanation:** Yesterday's theme persistence logic (`useState` + `useEffect` + `localStorage`) is a pattern likely to be needed again for other data (recent searches, saved preferences, form drafts) — instead of rewriting it each time, generalize it into a reusable hook.
**Instructor notes:** Connect explicitly to Frontend Foundations Lesson 6's `localStorage` usage and Week 6, Day 1's theme persistence — "we've now written this exact pattern twice; Rule of Three (Week 3, Day 2) says: extract it."

---

### Slide 6 — Building useLocalStorage
**Code example:**
```jsx
// src/hooks/useLocalStorage.js
import { useState, useEffect } from "react";

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
```
**Instructor notes:** Point out the return shape `[value, setValue]` deliberately mirrors `useState`'s own API — a common, recognizable convention for custom hooks that "extend" a built-in hook's behavior.

---

### Slide 7 — Using useLocalStorage
**Code example:**
```jsx
function ThemeProvider({ children }) {
  const [theme, setTheme] = useLocalStorage("theme", "light");

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
```
**Instructor notes:** Refactor yesterday's `ThemeProvider` live to use this new hook — a satisfying simplification showing the custom hook immediately paying off in real code.

---

### Slide 8 — Building useFetch: The Problem
**Explanation:** Recall Week 4's Movie Search App: `useState` for data, `useState` for loading, `useState` for error, all wired around a `fetch` call inside `useEffect`. This exact shape will be needed again for nearly any API-driven feature — a strong candidate for a custom hook.
**Instructor notes:** Explicitly name this as "the biggest payoff of today's lesson" — most real React apps have a `useFetch` (or similarly-named) hook exactly because this pattern repeats so often.

---

### Slide 9 — Building useFetch
**Code example:**
```jsx
// src/hooks/useFetch.js
import { useState, useEffect } from "react";

export function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!url) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Something went wrong");
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
}
```
**Instructor notes:** Build this slowly, comparing each piece directly to Week 4, Day 3's Movie Search App code — students should recognize every line as something they already wrote, just generalized and parameterized by `url`.

---

### Slide 10 — Using useFetch
**Code example:**
```jsx
function CountryList() {
  const { data: countries, loading, error } = useFetch("https://restcountries.com/v3.1/region/africa");

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <ul>
      {countries.map((c) => (
        <li key={c.cca3}>{c.name.common}</li>
      ))}
    </ul>
  );
}
```
**Instructor notes:** Point out the renamed destructuring (`data: countries`) — a small but useful JS pattern for giving a generic hook's return value a meaningful local name. Refactor the Movie Search App live if time allows, to prove the hook works identically to the original hand-written version.

---

### Slide 11 — The Rules of Hooks, Revisited
**Explanation:** Two hard rules: (1) only call hooks at the top level of a component or custom hook — never inside loops, conditions, or nested functions. (2) only call hooks from React function components or other custom hooks — never from regular JS functions.
**Instructor notes:** Recap the brief mention from Week 1, Day 3 — now with real custom hooks in front of students, the rule has concrete meaning: "your custom hook itself must also follow these rules internally."

---

### Slide 12 — Recap and What's Next
**Explanation:** Recap: what qualifies as a custom hook, `useTheme`, `useLocalStorage`, `useFetch`, and the Rules of Hooks revisited. Preview: Day 3 focuses on project organization — establishing clean folder structure and conventions (building on `hooks/`, `context/`, `pages/`, `components/ui/` introduced across the last several weeks) to keep growing projects maintainable.
**Instructor notes:** Point out the `src/hooks/` folder created today joins `pages/`, `context/`, `components/ui/` from previous weeks — tomorrow formalizes this into one coherent structure.

---

## 5. Practical Exercises During Class

1. **useTheme build-along:** Every student extracts `useTheme` from their existing `useContext(ThemeContext)` calls.
2. **useLocalStorage drill:** Students use the new hook to persist a simple counter value across reloads.
3. **useFetch refactor:** Students refactor their Movie Search App (or Country List) to use `useFetch` instead of hand-written fetch logic.

---

## 6. Homework Assignment

- Build and integrate `useTheme`, `useLocalStorage`, and `useFetch` into existing projects (Theme Switcher and Movie Search App).
- Write one additional custom hook of your own design (e.g., `useWindowWidth`, based on Week 4, Day 1's `WindowWidthTracker` exercise) and use it in at least one component.

---

## 7. Mini Project — Theme Switcher (Part 2: Custom Hooks Refactor)

**Brief:** "Refactor your Theme Switcher to use clean, reusable custom hooks instead of raw `useContext`/`useEffect` calls."

**Requirements:**
- `useTheme` hook wrapping `ThemeContext` consumption
- `useLocalStorage` hook powering the theme's persistence
- Both hooks organized under `src/hooks/`
- At least one other project (e.g., Movie Search App) refactored to use `useFetch`

---

## 8. Common Beginner Mistakes

- Naming a custom hook without the `use` prefix, breaking React's linting/rules enforcement.
- Calling a custom hook conditionally (inside an `if` block) instead of unconditionally at the top level.
- Writing a custom hook that doesn't actually use any other hooks internally — often a sign it should just be a regular utility function instead.
- Forgetting to return the values/functions a custom hook is meant to expose.
- Over-generalizing too early — building a highly configurable hook for a pattern only used once so far (recap the Rule of Three, Week 3 Day 2, applied here to hooks instead of components).

---

## 9. Extra Resources

- [React — Reusing Logic with Custom Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks)
- [React — Rules of Hooks](https://react.dev/warnings/invalid-hook-call-warning)
- [useHooks.com — Community Custom Hook Examples](https://usehooks.com/)
