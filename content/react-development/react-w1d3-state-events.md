
# Week 1, Day 3 — State (useState) & Events

**Khodz Academy — React Development Bootcamp**
**Session:** 3 of 24 | **Duration:** ~1.5–2 hours

---

## 1. Lesson Objectives

By the end of this lesson, students will be able to:

1. Explain what "state" means in React and why it's needed.
2. Use the `useState` hook to create and update state.
3. Handle click and other DOM events the React way.
4. Understand why direct DOM manipulation (Frontend Foundations style) is avoided in React.
5. Complete a fully working, interactive Counter App.

---

## 2. Skills Students Will Learn

- The concept of state as "data that changes over time and affects what's rendered"
- Importing and calling `useState`
- Reading state values and calling setter functions
- Updating state based on previous state (functional updates)
- Handling events: `onClick`, `onChange`, `onSubmit` (preview)
- Why React re-renders components when state changes
- Rules of hooks (called at the top level, not inside conditionals/loops) — introduced at a beginner-appropriate level

---

## 3. Detailed Teaching Outline (~1.5–2 hrs)

| Time | Segment |
|---|---|
| 0:00–0:10 | Recap Day 2 + show and tell |
| 0:10–0:25 | What is state, and why not just variables? (Slides 1–3) |
| 0:25–0:45 | useState basics (Slides 4–7) — live coding |
| 0:45–1:00 | Events in React (Slides 8–10) — live coding |
| 1:00–1:20 | Building the full Counter App (Slides 11–13) — live coding |
| 1:20–1:30 | Recap, common mistakes, Q&A (Slide 14) |

---

## 4. Slide-by-Slide Presentation Content

### Slide 1 — Why Regular Variables Don't Work for UI Data
**Explanation:** If you store a count in a normal JS variable and change it, React has no way of knowing the UI needs to update — the screen simply won't reflect the new value. React needs a special way to track "data that affects what's on screen" — that's **state**.
**Code example:**
```jsx
function Counter() {
  let count = 0; // ❌ changing this won't update the UI

  const increment = () => {
    count = count + 1;
    console.log(count); // updates in the console...
  };

  return <button onClick={increment}>Count: {count}</button>; // ...but never on screen
}
```
**Instructor notes:** Run this broken version live first — let students click the button and see nothing visually change while the console logs correctly increasing numbers. This "broken" demo makes the need for `useState` concrete rather than abstract.

---

### Slide 2 — What Is State?
**Explanation:** State is data that (1) belongs to a component, (2) can change over time, and (3) causes React to automatically re-render the component (and update the real DOM) when it changes.
**Real-world example:** The dark mode boolean from Frontend Foundations Lesson 6 was "state" conceptually — React just gives it official, automated machinery instead of manual `classList.toggle` + `localStorage` bookkeeping.
**Instructor notes:** This explicit callback to Lesson 6 is important — students already understand the *concept*, today gives them the *tool*.

---

### Slide 3 — Introducing the useState Hook
**Explanation:** `useState` is a special React function ("hook") that creates a piece of state. It returns two things: the current value, and a function to update it — conventionally destructured as an array: `[value, setValue]`.
**Code example:**
```jsx
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0); // 0 = initial value
  // count = current value, setCount = function to update it
}
```
**Instructor notes:** Point out the array destructuring syntax explicitly — reminiscent of Frontend Foundations Lesson 5's array basics, just applied to a new context.

---

### Slide 4 — Fixing the Counter with useState
**Explanation:** Replace the broken `let count` with real state — now clicking correctly updates the screen.
**Code example:**
```jsx
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount(count + 1);
  };

  return (
    <div className="text-center">
      <p className="text-4xl font-bold">{count}</p>
      <button onClick={increment} className="bg-blue-600 text-white px-4 py-2 rounded-lg">
        +1
      </button>
    </div>
  );
}
```
**Instructor notes:** Run this side by side with Slide 1's broken version — same visual layout, only the state mechanism differs. Makes the fix land clearly.

---

### Slide 5 — Calling setCount Never Mutates Directly
**Explanation:** Never write `count = count + 1` directly — always call the setter function (`setCount(...)`). Calling the setter is what tells React "please re-render with this new value."
**Instructor notes:** Reinforce as a hard rule, similar to the "props are read-only" rule from Day 2 — state must always be updated *through its setter function*, never reassigned directly.

---

### Slide 6 — Functional Updates (Using Previous State Safely)
**Explanation:** When the new state depends on the old state, pass a function to the setter instead of a plain value — safer, especially with rapid updates.
**Code example:**
```jsx
const increment = () => {
  setCount((prevCount) => prevCount + 1);
};
```
**Instructor notes:** Keep this practical, not theoretical — just teach it as "the safe way to increment/decrement," full explanation of batching/async state edge cases is beyond this course's scope.

---

### Slide 7 — Multiple State Variables
**Explanation:** A component can have as many independent `useState` calls as needed — each manages one distinct piece of data.
**Code example:**
```jsx
function Profile() {
  const [name, setName] = useState("Amaka");
  const [isOnline, setIsOnline] = useState(true);

  return (
    <div>
      <p>{name}</p>
      <p>{isOnline ? "🟢 Online" : "⚪ Offline"}</p>
    </div>
  );
}
```
**Instructor notes:** Prevent a common misconception early: "you don't need one giant state object — separate concerns into separate `useState` calls unless they're tightly related."

---

### Slide 8 — Handling Events in React
**Explanation:** React uses camelCase event props (`onClick`, `onChange`, `onSubmit`) with a function passed directly — different syntax from `addEventListener` (Frontend Foundations Lesson 6), same underlying idea: "run this function when this happens."
**Code example:**
```jsx
<button onClick={() => console.log("Clicked!")}>Click Me</button>
```
**Instructor notes:** Draw the direct parallel to `addEventListener("click", ...)` from Lesson 6 explicitly — same concept, React-flavored syntax.

---

### Slide 9 — Passing a Function vs. Calling It
**Explanation:** `onClick={handleClick}` passes the function to run later. `onClick={handleClick()}` calls it immediately during render — a very common beginner bug.
**Code example:**
```jsx
// ✅ Correct — passes the function
<button onClick={increment}>+1</button>

// ❌ Wrong — calls it immediately on every render
<button onClick={increment()}>+1</button>
```
**Instructor notes:** Trigger this bug live (infinite loop or immediate execution) — one of the most valuable "gotcha" demos in the whole course; students will hit this repeatedly if not shown now.

---

### Slide 10 — The onChange Event (Preview for Forms)
**Explanation:** `onChange` fires when an input's value changes — the foundation for controlled form inputs, covered fully in Week 2, Day 3.
**Code example:**
```jsx
function NameInput() {
  const [name, setName] = useState("");

  return (
    <input
      value={name}
      onChange={(e) => setName(e.target.value)}
      className="border px-3 py-2 rounded-lg"
    />
  );
}
```
**Instructor notes:** Keep this brief — just enough exposure that Week 2 Day 3 doesn't feel entirely new; full explanation of "controlled components" happens there.

---

### Slide 11 — Planning the Full Counter App
**Explanation:** Combine Day 2's component structure with today's state: `App` holds the `count` state and an increment/decrement function, `CounterDisplay` receives `count` as a prop, `CounterControls` receives the handler functions as props.
**Visual suggestion:** Diagram showing state living in `App`, flowing down as props to `CounterDisplay` and `CounterControls`.
**Instructor notes:** This is the day's key architectural idea — "state lives in one place (the parent) and flows down through props to the components that display or trigger changes to it." Repeat this sentence; it's foundational for the rest of the course.

---

### Slide 12 — Building the Full Counter App (Live Coding)
**Code example:**
```jsx
// src/App.jsx
import { useState } from "react";
import CounterDisplay from "./components/CounterDisplay.jsx";
import CounterControls from "./components/CounterControls.jsx";

function App() {
  const [count, setCount] = useState(0);

  const increment = () => setCount((prev) => prev + 1);
  const decrement = () => setCount((prev) => prev - 1);
  const reset = () => setCount(0);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6">
      <h1 className="text-2xl font-bold">My Counter App</h1>
      <CounterDisplay count={count} />
      <CounterControls onIncrement={increment} onDecrement={decrement} onReset={reset} />
    </div>
  );
}

export default App;
```
```jsx
// src/components/CounterDisplay.jsx
function CounterDisplay({ count }) {
  return <p className="text-6xl font-bold">{count}</p>;
}

export default CounterDisplay;
```
```jsx
// src/components/CounterControls.jsx
function CounterControls({ onIncrement, onDecrement, onReset }) {
  return (
    <div className="flex gap-4">
      <button onClick={onDecrement} className="bg-gray-200 px-4 py-2 rounded-lg">-1</button>
      <button onClick={onReset} className="bg-gray-200 px-4 py-2 rounded-lg">Reset</button>
      <button onClick={onIncrement} className="bg-blue-600 text-white px-4 py-2 rounded-lg">+1</button>
    </div>
  );
}

export default CounterControls;
```
**Instructor notes:** Build this incrementally — state in `App` first (test with a plain button inside `App`), then extract into `CounterDisplay`/`CounterControls`, testing after each step. This mirrors the "small steps, test often" habit from Frontend Foundations Lesson 5.

---

### Slide 13 — Testing and Verifying
**Explanation:** Test all three buttons, confirm the display updates correctly, and check the React DevTools Components panel to watch `count` change live.
**Instructor notes:** Introduce React DevTools browser extension here if not already installed — watching state update in real time in the inspector is a great confidence-building moment.

---

### Slide 14 — Recap and What's Next
**Explanation:** Recap: state vs. regular variables, `useState`, functional updates, event handling, passing state/handlers as props, and a fully working Counter App. Preview: Week 2 covers conditional rendering, rendering lists with `.map()`, and controlled forms — building toward the To-Do App.
**Instructor notes:** Celebrate this as the first fully interactive React app of the course — genuinely comparable to a small real product feature.

---

## 5. Practical Exercises During Class

1. **Broken counter fix:** Students are given Slide 1's broken version and must fix it using `useState` independently before the instructor reveals the solution.
2. **onClick vs onClick() drill:** Instructor shows both versions; students predict behavior before running.
3. **Full build-along:** Every student builds the complete Counter App from Slide 12 with the instructor.

---

## 6. Homework Assignment

- Complete and polish the Counter App (Section 7).
- Add a step-size feature: an input field (using `onChange`, from Slide 10) that lets the user choose how much each click adds/subtracts (e.g., step of 5 instead of 1).
- Style the app fully with Tailwind (buttons, spacing, centered layout).

---

## 7. Mini Project — Counter App (Final)

**Brief:** "Complete the fully interactive Counter App, styled and polished."

**Requirements:**
- `useState` managing the count
- Increment, decrement, and reset buttons, all functional
- State lives in `App`, passed down as props to display/control components (matching Slide 11's architecture)
- Fully styled with Tailwind
- No console errors or warnings

**Stretch goal:** Add the adjustable step-size input from the homework section.

---

## 8. Common Beginner Mistakes

- Directly mutating state (`count = count + 1`) instead of calling the setter.
- Calling the handler function immediately (`onClick={increment()}`) instead of passing a reference (`onClick={increment}`).
- Forgetting to import `useState` from `"react"`.
- Creating one giant state object when several independent `useState` calls would be clearer.
- Expecting `setCount` to update the value immediately within the same function call (state updates are scheduled, not instant — reassure students this nuance is fine to not fully master yet).
- Calling hooks conditionally (e.g., inside an `if` block) — briefly mention the Rules of Hooks: always call hooks at the top level of the component.

---

## 9. Extra Resources

- [React — State: A Component's Memory](https://react.dev/learn/state-a-components-memory)
- [React — Responding to Events](https://react.dev/learn/responding-to-events)
- [React — Rules of Hooks](https://react.dev/warnings/invalid-hook-call-warning)
