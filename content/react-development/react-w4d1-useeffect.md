
# Week 4, Day 1 — useEffect

**Khodz Academy — React Development Bootcamp**
**Session:** 10 of 24 | **Duration:** ~1.5–2 hours

---

## 1. Lesson Objectives

By the end of this lesson, students will be able to:

1. Explain what a "side effect" is and why React needs a special hook for it.
2. Use `useEffect` to run code after render.
3. Control when an effect runs using the dependency array.
4. Write cleanup functions to avoid memory leaks/bugs.
5. Recognize the most common `useEffect` use cases.

---

## 2. Skills Students Will Learn

- The concept of "side effects" (anything that reaches outside the component: timers, subscriptions, manual DOM access, fetching data)
- `useEffect(callback, dependencies)` syntax
- The three dependency array patterns: no array (every render), `[]` (once, on mount), `[value]` (on mount + when `value` changes)
- Cleanup functions (the `return` inside `useEffect`)
- Common pitfalls: infinite loops, missing dependencies
- Recognizing `useEffect` as the bridge to next lesson's API fetching

---

## 3. Detailed Teaching Outline (~1.5–2 hrs)

| Time | Segment |
|---|---|
| 0:00–0:10 | Recap Week 3 + show and tell (Admin Dashboards) |
| 0:10–0:25 | What is a side effect? (Slides 1–2) |
| 0:25–0:45 | useEffect basics (Slides 3–6) — live coding |
| 0:45–1:05 | The dependency array deep dive (Slides 7–9) — live coding |
| 1:05–1:20 | Cleanup functions (Slides 10–11) — live coding |
| 1:20–1:30 | Recap, common mistakes, Q&A (Slide 12) |

---

## 4. Slide-by-Slide Presentation Content

### Slide 1 — What Is a Side Effect?
**Explanation:** A side effect is anything a component does beyond simply returning JSX — fetching data, setting a timer, manually accessing the DOM, subscribing to something external. These need special handling because they shouldn't run during the render calculation itself.
**Real-world example:** Fetching weather data (foreshadowing Frontend Foundations Lesson 7's weather app, now rebuilt in React) is a side effect — it reaches outside the component to talk to a server.
**Instructor notes:** Keep this conceptual — the goal is recognizing *what counts* as a side effect, not memorizing a formal definition.

---

### Slide 2 — Why Not Just Run Code Directly in the Component?
**Explanation:** Code written directly in the component body runs on *every single render* — for something like a `fetch()` call, that would mean re-fetching on every re-render, causing infinite loops or wasted requests. `useEffect` lets you say "run this only after render, and only when I choose."
**Code example:**
```jsx
// ❌ Runs on every render — dangerous
function Example() {
  console.log("This runs every time the component renders!");
  return <div>Hello</div>;
}
```
**Instructor notes:** Run this live with a state update elsewhere to show the log firing repeatedly — motivates the need for control over *when* code runs.

---

### Slide 3 — Introducing useEffect
**Explanation:** `useEffect` takes a function to run, executed *after* the component renders.
**Code example:**
```jsx
import { useEffect } from "react";

function Example() {
  useEffect(() => {
    console.log("Component rendered!");
  });

  return <div>Hello</div>;
}
```
**Instructor notes:** Run this and point out the log still fires on every render by default (no dependency array yet) — sets up the next slide's fix naturally.

---

### Slide 4 — The Dependency Array: Run Once
**Explanation:** Passing an empty array `[]` as the second argument tells React "run this effect only once, right after the first render" (often called "on mount").
**Code example:**
```jsx
useEffect(() => {
  console.log("This runs only once, when the component first appears.");
}, []);
```
**Instructor notes:** Trigger a re-render (e.g., via an unrelated `useState` update elsewhere) to prove the effect does NOT re-run — concrete demonstration beats explanation.

---

### Slide 5 — The Dependency Array: Run on Specific Changes
**Explanation:** Including a value in the array tells React "re-run this effect whenever this specific value changes" — not on every render, only when that dependency's value is different from last time.
**Code example:**
```jsx
function SearchLogger({ query }) {
  useEffect(() => {
    console.log("Query changed to:", query);
  }, [query]);

  return <p>Searching for: {query}</p>;
}
```
**Instructor notes:** Change `query` via a parent's state update live, and show the effect firing exactly when (and only when) that prop changes — not on unrelated re-renders.

---

### Slide 6 — A Practical Example: Updating the Document Title
**Explanation:** A classic simple side effect: updating the browser tab title based on state.
**Code example:**
```jsx
function TaskCounter({ count }) {
  useEffect(() => {
    document.title = `${count} tasks remaining`;
  }, [count]);

  return <p>{count} tasks remaining</p>;
}
```
**Instructor notes:** This directly touches `document` — recap Frontend Foundations Lesson 6's DOM concept ("this is direct DOM access, exactly the kind of thing `useEffect` exists to safely contain").

---

### Slide 7 — The Three Dependency Array Patterns (Summary)
**Explanation:** No array = every render (rarely what you want). `[]` = once on mount. `[value1, value2]` = on mount, and whenever any listed value changes.
**Visual suggestion:** Simple table: pattern → when it runs → typical use case.
**Instructor notes:** This summary table is the day's key reference — have students copy it into their notes verbatim.

---

### Slide 8 — Why the Dependency Array Matters (Correctness)
**Explanation:** Omitting a value that the effect actually uses can cause bugs — the effect keeps using an old/stale version of that value ("stale closure"). React's linter typically warns about this.
**Code example:**
```jsx
// ⚠️ Bug: effect uses `count` but doesn't list it — may use a stale value
useEffect(() => {
  console.log(count);
}, []); // should be [count]
```
**Instructor notes:** Keep this beginner-appropriate — the goal is "if your effect uses a value from outside itself, that value almost always belongs in the array," not a deep dive into JS closures.

---

### Slide 9 — Multiple useEffect Calls in One Component
**Explanation:** A component can have multiple, independent `useEffect` calls, each handling a separate concern — better than cramming unrelated logic into one effect.
**Code example:**
```jsx
useEffect(() => {
  document.title = `${count} tasks remaining`;
}, [count]);

useEffect(() => {
  console.log("Component mounted");
}, []);
```
**Instructor notes:** Connect to the "small functions, single responsibility" clean-code principle from Frontend Foundations Lesson 5 — same idea applied to effects.

---

### Slide 10 — Cleanup Functions
**Explanation:** An effect can `return` a cleanup function, which React runs before the effect re-runs and when the component unmounts — essential for timers, subscriptions, and event listeners to avoid memory leaks.
**Code example:**
```jsx
useEffect(() => {
  const timer = setInterval(() => {
    console.log("Tick");
  }, 1000);

  return () => {
    clearInterval(timer); // cleanup: stop the timer
  };
}, []);
```
**Instructor notes:** Build a small live-ticking clock/timer component to demonstrate — then remove the cleanup function deliberately and show multiple timers stacking up (visible via rapidly increasing console logs) if the component re-mounts, proving why cleanup matters.

---

### Slide 11 — Cleanup for Event Listeners
**Explanation:** The same cleanup pattern applies to browser event listeners added inside `useEffect` — recap Frontend Foundations Lesson 6's `addEventListener`, now properly paired with `removeEventListener` in React.
**Code example:**
```jsx
useEffect(() => {
  const handleResize = () => console.log(window.innerWidth);
  window.addEventListener("resize", handleResize);

  return () => window.removeEventListener("resize", handleResize);
}, []);
```
**Instructor notes:** Explicitly connect: "in Frontend Foundations, you never had to remove listeners because the whole page reloaded between views — in React, components come and go without a page reload, so cleanup becomes essential."

---

### Slide 12 — Recap and What's Next
**Explanation:** Recap: side effects, `useEffect` basics, the three dependency array patterns, and cleanup functions. Preview: Day 2 uses `useEffect` for its most common real-world purpose — fetching data from an API when a component mounts, building toward the Movie Search App.
**Instructor notes:** Tell students plainly: "everything today was setup — tomorrow, `useEffect` finally does its most common job: loading real data."

---

## 5. Practical Exercises During Class

1. **Dependency array drill:** Given three `useEffect` examples (no array, `[]`, `[value]`), students predict when each fires before running them.
2. **Document title drill:** Students build a small counter that updates the tab title (Slide 6) independently.
3. **Cleanup drill:** Students add a `setInterval`-based effect and correctly clean it up, verified by checking console log behavior.

---

## 6. Homework Assignment

- Build a small `LiveClock` component that displays the current time, updating every second via `setInterval` inside `useEffect`, with proper cleanup.
- Build a `WindowWidthTracker` component that displays the current window width, updating on resize via an event listener inside `useEffect`, with proper cleanup.
- Write a short comment on each explaining which dependency array pattern you used and why.

---

## 7. Mini Project — Effect Practice Set

**Brief:** "Build two small components that demonstrate correct, safe use of useEffect with cleanup — practice before real API fetching starts tomorrow."

**Requirements:**
- `LiveClock` component (timer-based effect, proper cleanup)
- `WindowWidthTracker` component (event-listener-based effect, proper cleanup)
- Both styled simply with Tailwind
- No console warnings about missing dependencies

---

## 8. Common Beginner Mistakes

- Omitting the dependency array entirely, causing effects to run on every render unintentionally.
- Using `[]` when the effect actually depends on a prop/state value, causing stale data bugs.
- Forgetting cleanup functions for timers/listeners, causing duplicated timers or listeners to pile up.
- Calling `setState` inside an effect without a dependency array, creating an infinite render loop.
- Confusing `useEffect` with a regular function call — forgetting it runs *after* render, not during.

---

## 9. Extra Resources

- [React — Synchronizing with Effects](https://react.dev/learn/synchronizing-with-effects)
- [React — You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)
- [React — Lifecycle of Reactive Effects](https://react.dev/learn/lifecycle-of-reactive-effects)
