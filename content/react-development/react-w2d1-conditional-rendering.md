
# Week 2, Day 1 — Conditional Rendering

**Khodz Academy — React Development Bootcamp**
**Session:** 4 of 24 | **Duration:** ~1.5–2 hours

---

## 1. Lesson Objectives

By the end of this lesson, students will be able to:

1. Render different UI based on conditions using JSX.
2. Use ternary operators for inline conditional rendering.
3. Use `&&` for "render only if true" patterns.
4. Use early returns for larger conditional blocks.
5. Handle empty/falsy states gracefully in the UI.

---

## 2. Skills Students Will Learn

- Ternary operator inside JSX (`condition ? A : B`)
- Logical AND (`&&`) short-circuit rendering
- Early `return` statements for whole-component conditionals
- Rendering `null` to show nothing
- Common patterns: loading state, empty state, toggled visibility
- Avoiding common falsy-value rendering bugs (e.g., rendering a stray `0`)

---

## 3. Detailed Teaching Outline (~1.5–2 hrs)

| Time | Segment |
|---|---|
| 0:00–0:10 | Recap Week 1 + show and tell |
| 0:10–0:25 | Why conditional rendering matters (Slides 1–2) |
| 0:25–0:45 | Ternary operator patterns (Slides 3–5) — live coding |
| 0:45–1:00 | `&&` short-circuit rendering (Slides 6–7) — live coding |
| 1:00–1:15 | Early returns and `null` (Slides 8–9) — live coding |
| 1:15–1:30 | Common pitfalls + practice (Slides 10–11) |

---

## 4. Slide-by-Slide Presentation Content

### Slide 1 — Why Conditional Rendering?
**Explanation:** Real UIs constantly change based on data: logged in vs. logged out, loading vs. loaded, empty list vs. populated list. React handles this with plain JavaScript conditionals inside JSX — no special templating syntax needed.
**Real-world example:** The success/error message states designed statically in Frontend Foundations Lesson 4 now become dynamically shown/hidden based on real conditions.
**Instructor notes:** Connect explicitly to that lesson's static error/success mockups — "today, those states become real and dynamic."

---

### Slide 2 — Recap: Booleans and Conditionals (from Frontend Foundations)
**Explanation:** Quick recap of `if/else` and truthy/falsy values from Frontend Foundations Lesson 5 — today applies that exact logic inside JSX rather than `console.log`.
**Instructor notes:** A 3-minute refresher, not new material — confirm the room remembers `if/else` before building on it.

---

### Slide 3 — The Ternary Operator in JSX
**Explanation:** `condition ? valueIfTrue : valueIfFalse` — the most common way to choose between two pieces of JSX inline.
**Code example:**
```jsx
function StatusBadge({ isOnline }) {
  return (
    <span className={isOnline ? "text-green-600" : "text-gray-400"}>
      {isOnline ? "🟢 Online" : "⚪ Offline"}
    </span>
  );
}
```
**Instructor notes:** Point out the ternary is used *twice* here — once for the class, once for the text — a very common real-world pattern worth normalizing.

---

### Slide 4 — Ternary for Whole Blocks of JSX
**Explanation:** Ternaries can return entire JSX blocks, not just text/classes — useful for swapping bigger sections of UI.
**Code example:**
```jsx
function AuthStatus({ isLoggedIn }) {
  return isLoggedIn ? (
    <p className="text-green-600">Welcome back!</p>
  ) : (
    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">Log In</button>
  );
}
```
**Instructor notes:** Format this clearly with parentheses around each branch — a formatting habit that keeps larger ternaries readable.

---

### Slide 5 — Nested Ternaries (Use Sparingly)
**Explanation:** Ternaries can be nested for 3+ conditions, but readability drops fast — recommend switching to early returns (Slide 8) or a simple `if/else` before rendering, once you have more than two branches.
**Code example:**
```jsx
// Workable but harder to read — avoid nesting more than this
{status === "loading" ? "Loading..." : status === "error" ? "Error!" : "Loaded!"}
```
**Instructor notes:** Show this as a caution, not a recommendation — "this technically works, but we'll use a cleaner pattern (early return) once it gets this complex."

---

### Slide 6 — The && Short-Circuit Pattern
**Explanation:** `condition && <JSX />` renders the JSX only if the condition is true — renders nothing (technically `false`, which React ignores) if false. Ideal for "show this only if..." cases with no alternative to show.
**Code example:**
```jsx
function Notification({ hasNewMessage }) {
  return (
    <div>
      <h2>Inbox</h2>
      {hasNewMessage && <p className="text-red-600">You have a new message!</p>}
    </div>
  );
}
```
**Instructor notes:** Contrast directly with the ternary: "use ternary when you need to show one of two things; use `&&` when you only need to show something or nothing."

---

### Slide 7 — The Falsy-Zero Bug
**Explanation:** `{count && <p>Items: {count}</p>}` renders a stray `0` on screen when `count` is `0`, because `0` is falsy but still gets rendered as text by React (unlike `false`, which renders nothing). Fix: use a proper boolean condition.
**Code example:**
```jsx
// ❌ Bug — renders "0" on screen when count is 0
{count && <p>Items: {count}</p>}

// ✅ Fixed
{count > 0 && <p>Items: {count}</p>}
```
**Instructor notes:** Trigger this bug live with `count = 0` — one of the most common real React bugs; students will hit it constantly without this warning.

---

### Slide 8 — Early Returns for Whole-Component Conditionals
**Explanation:** When an entire component's output depends on a condition, return early instead of wrapping the whole JSX in a ternary — much more readable for complex cases.
**Code example:**
```jsx
function UserProfile({ user }) {
  if (!user) {
    return <p className="text-gray-500">No user data available.</p>;
  }

  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
}
```
**Instructor notes:** Emphasize this pattern is used constantly for loading/error states in real apps — directly foreshadows Week 4's API loading/error handling.

---

### Slide 9 — Rendering Nothing with null
**Explanation:** Returning `null` from a component (or an expression) tells React to render nothing at all — valid and common, e.g., for a banner that only appears under certain conditions.
**Code example:**
```jsx
function PromoBanner({ show }) {
  if (!show) return null;
  return <div className="bg-yellow-100 p-4">🎉 Limited time offer!</div>;
}
```
**Instructor notes:** Reassure students `null` is not an error — it's a deliberate, valid "render nothing" signal in React.

---

### Slide 10 — Choosing the Right Pattern
**Explanation:** Decision guide: two JSX options → ternary. One JSX option, else nothing → `&&`. Whole-component logic, multiple conditions → early return. Nothing to render under a condition → `null`.
**Visual suggestion:** Simple decision flowchart matching the four patterns to their use cases.
**Instructor notes:** This is the day's key takeaway slide — have students copy this decision guide into their own notes.

---

### Slide 11 — Recap and What's Next
**Explanation:** Recap: ternaries, `&&` short-circuiting, the falsy-zero bug, early returns, and `null`. Preview: Day 2 covers rendering lists with `.map()` — combining today's conditional skills with dynamic, data-driven lists, heading toward the To-Do App.
**Instructor notes:** Tie together: "today you controlled *what* renders; tomorrow you control *how many* things render."

---

## 5. Practical Exercises During Class

1. **Ternary drill:** Build a `PriceTag` component that shows "Free" in green or a price in black, based on a `price` prop.
2. **&& drill:** Build a `Cart` component that shows an item count badge only when `itemCount > 0`.
3. **Bug hunt:** Instructor shows the falsy-zero bug live; students fix it in pairs.

---

## 6. Homework Assignment

- Build a small `TaskStatus` component (standalone practice, not yet the full To-Do App) that accepts a `status` prop (`"pending" | "done"`) and conditionally renders different text/styling for each state, using an early return.
- Build a `Greeting` component that renders "Good morning," "Good afternoon," or "Good evening" based on the current hour (`new Date().getHours()`), using either a nested ternary or early returns — student's choice, but must justify which pattern they chose and why in a comment.

---

## 7. Mini Project — Conditional Rendering Practice Set

**Brief:** "Build a small set of standalone components that demonstrate every conditional rendering pattern from today, in preparation for the To-Do App this week."

**Requirements:**
- One component using a ternary
- One component using `&&`
- One component using an early return
- One component correctly avoiding the falsy-zero bug
- All styled with Tailwind, assembled together on one practice page

---

## 8. Common Beginner Mistakes

- The falsy-zero bug (`{count && ...}` rendering a stray `0`).
- Overusing nested ternaries until code becomes unreadable.
- Forgetting that `&&` needs a truthy boolean-like condition, not any value.
- Returning `undefined` instead of `null` from a component (usually accidental — happens when a function has no explicit return path for some condition).
- Writing complex conditional logic directly inline in JSX instead of extracting it into a clearly named variable or function above the `return`.

---

## 9. Extra Resources

- [React — Conditional Rendering](https://react.dev/learn/conditional-rendering)
- [MDN — Conditional (Ternary) Operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator)
