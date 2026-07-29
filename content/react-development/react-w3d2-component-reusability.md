
# Week 3, Day 2 — Component Reusability

**Khodz Academy — React Development Bootcamp**
**Session:** 8 of 24 | **Duration:** ~1.5–2 hours

---

## 1. Lesson Objectives

By the end of this lesson, students will be able to:

1. Identify when a piece of UI should become a reusable component.
2. Design flexible components using props effectively (including default values).
3. Build a small shared component library (Button, Card, Input, Badge).
4. Avoid over-abstraction — recognize when NOT to extract a component yet.
5. Organize reusable components separately from page/feature-specific components.

---

## 2. Skills Students Will Learn

- Recognizing repetition as the signal to extract a component ("Rule of Three")
- Designing prop APIs (what props should a component accept, and why)
- Default prop values
- Building a small reusable UI kit: `Button`, `Card`, `Input`, `Badge`
- Folder structure: `components/ui/` (reusable/shared) vs `components/` (feature-specific)
- The tradeoff between reusability and premature abstraction

---

## 3. Detailed Teaching Outline (~1.5–2 hrs)

| Time | Segment |
|---|---|
| 0:00–0:10 | Recap Day 1 + show and tell |
| 0:10–0:25 | When to extract a component (Slides 1–3) |
| 0:25–0:45 | Designing a good prop API (Slides 4–6) — live coding |
| 0:45–1:10 | Building the shared UI kit (Slides 7–10) — live coding |
| 1:10–1:20 | Avoiding over-abstraction (Slide 11) |
| 1:20–1:30 | Recap, common mistakes, Q&A (Slide 12) |

---

## 4. Slide-by-Slide Presentation Content

### Slide 1 — Recap: Composition (Week 1, Day 2)
**Explanation:** Recall composition — building UI from smaller components. Today formalizes *how to decide* what should become its own reusable component, and how to design it well.
**Instructor notes:** Frame today as "leveling up" Week 1's composition skill from "can do it" to "can do it well."

---

### Slide 2 — The Rule of Three
**Explanation:** A practical rule: if you're about to write the same or very similar JSX for the third time, that's a strong signal to extract it into a reusable component. Once or twice, duplication is often fine and simpler.
**Real-world example:** The `Button` component built yesterday emerged after seeing "primary blue button" repeated across the Counter App and To-Do App.
**Instructor notes:** This rule prevents both extremes: too much premature abstraction, and too much copy-paste — a genuinely useful professional heuristic worth repeating.

---

### Slide 3 — Signs a Component Should Be Extracted
**Explanation:** Look for: repeated JSX structure, repeated styling patterns, a self-contained piece of UI with a clear single responsibility (e.g., "this is a card," "this is a badge").
**Visual suggestion:** Before/after: a page with 3 near-identical card blocks → the same page using one `<Card>` component three times.
**Instructor notes:** Use the Admin Dashboard project (this week's target) as the running example throughout today's lesson — dashboards are naturally full of repeated card/stat patterns.

---

### Slide 4 — Designing a Good Prop API
**Explanation:** A well-designed component asks: what varies each time this is used? Those variations become props. What stays the same? That's the component's fixed internal styling/structure.
**Code example:**
```jsx
// What varies: title, value, icon → these become props
function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow flex items-center gap-4">
      <span className="text-3xl">{icon}</span>
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}
```
**Instructor notes:** Walk through the design *thinking process* out loud before writing code — "what would I need to pass in to reuse this for 'Total Users' vs 'Total Sales'?"

---

### Slide 5 — Default Prop Values
**Explanation:** Provide sensible defaults for optional props using default parameter syntax, so the component works reasonably even if a prop is omitted.
**Code example:**
```jsx
function Badge({ label, color = "gray" }) {
  const colors = {
    gray: "bg-gray-100 text-gray-700",
    green: "bg-green-100 text-green-700",
    red: "bg-red-100 text-red-700",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm ${colors[color]}`}>{label}</span>
  );
}

// Usage — color omitted, defaults to gray:
<Badge label="Draft" />
<Badge label="Active" color="green" />
```
**Instructor notes:** Recap default parameters from Frontend Foundations Lesson 5's function basics — same JS feature, applied to props.

---

### Slide 6 — Not Every Prop Needs to Be a String
**Explanation:** Props can be numbers, booleans, functions, objects, or even other components (recap `children` from Week 1, Day 2) — design the prop's type around what naturally fits.
**Code example:**
```jsx
function ProgressBar({ percent }) {
  return (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${percent}%` }} />
    </div>
  );
}
```
**Instructor notes:** Note the rare, deliberate use of the `style` prop here (inline percentage width can't be a Tailwind utility class since it's dynamic/arbitrary) — flag this as one of the few valid cases for inline styles instead of Tailwind classes.

---

### Slide 7 — Building the Shared UI Kit: Input
**Code example:**
```jsx
function Input({ label, ...props }) {
  return (
    <div className="mb-4">
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <input
        {...props}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

// Usage:
<Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
```
**Instructor notes:** Recap the Frontend Foundations Lesson 4 "field group" pattern explicitly — "this is that exact pattern, now reusable in one line instead of copy-pasted every time."

---

### Slide 8 — Building the Shared UI Kit: Card
**Code example:**
```jsx
function Card({ children, className = "" }) {
  return (
    <div className={`bg-white p-6 rounded-xl shadow ${className}`}>
      {children}
    </div>
  );
}

// Usage:
<Card className="flex flex-col gap-2">
  <h3 className="font-bold">Recent Activity</h3>
  <p className="text-gray-500 text-sm">3 new signups today.</p>
</Card>
```
**Instructor notes:** Point out the `className` prop pattern here — allowing consumers of the component to *extend* its styling for specific use cases without editing the component itself. A genuinely important, widely-used real-world pattern.

---

### Slide 9 — Organizing the UI Kit
**Explanation:** Separate general-purpose, reusable components (`Button`, `Card`, `Input`, `Badge`) from feature-specific ones (`TaskItem`, `StatCard`) using a `components/ui/` subfolder.
**Code example:**
```
src/
├── components/
│   ├── ui/
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── Input.jsx
│   │   └── Badge.jsx
│   ├── TaskItem.jsx
│   └── StatCard.jsx
```
**Instructor notes:** Foreshadow Week 6, Day 3 (Project Organization) — today plants the first real organizational convention, deepened later.

---

### Slide 10 — Composing the UI Kit Together
**Explanation:** Combine `Card`, `Badge`, and `Button` together to build a realistic dashboard-style panel — demonstrating how a small set of well-designed components combine into complex UI.
**Code example:**
```jsx
<Card className="flex justify-between items-center">
  <div>
    <h3 className="font-bold">New Order #1042</h3>
    <Badge label="Pending" color="gray" />
  </div>
  <Button variant="primary">View Details</Button>
</Card>
```
**Instructor notes:** This is the day's "aha" moment — a complex-looking, polished UI block built from just three small, previously-built components.

---

### Slide 11 — Avoiding Over-Abstraction
**Explanation:** Not everything needs to be a component. Over-abstracting too early creates unnecessary complexity and indirection — prefer simple, inline JSX until real repetition (Rule of Three) justifies extraction.
**Real-world example:** A one-off hero section used only once on a landing page doesn't need to be its own component — that's premature.
**Instructor notes:** Balance today's "extract things" message with this counter-message — professional judgment is knowing when *not* to abstract, not just knowing how.

---

### Slide 12 — Recap and What's Next
**Explanation:** Recap: the Rule of Three, designing prop APIs, default props, building a shared UI kit (`Button`, `Card`, `Input`, `Badge`), organizing components, and avoiding over-abstraction. Preview: Day 3 applies this entire UI kit to build a realistic Mini Dashboard UI, completing this week's Admin Dashboard project.
**Instructor notes:** Tell students explicitly: "tomorrow, no new concepts — just applying everything from the last 8 sessions into one polished, realistic project."

---

## 5. Practical Exercises During Class

1. **Extraction drill:** Instructor shows a page with 3 repeated JSX blocks; students identify what should be extracted and design its props.
2. **UI kit build-along:** Students build `Button`, `Card`, `Input`, and `Badge` together with the instructor.
3. **Composition drill:** In pairs, students combine 2–3 UI kit components into a new composed block not shown in class (e.g., a user profile summary card).

---

## 6. Homework Assignment

- Finish building the full shared UI kit: `Button`, `Card`, `Input`, `Badge` (and optionally `ProgressBar`), organized under `components/ui/`.
- Refactor the existing To-Do App to use `Button` and `Card` from the UI kit instead of one-off styled elements.
- Write a short comment above each UI kit component explaining its prop API (what each prop does) — practicing the "designing a good prop API" thinking from today.

---

## 7. Mini Project — Shared UI Kit

**Brief:** "Build a small, reusable component library that will power this week's Admin Dashboard project."

**Requirements:**
- `Button` component with at least 2 variants (from Day 1, refined if needed)
- `Card` component supporting `children` and an extendable `className`
- `Input` component with optional `label`
- `Badge` component with at least 2 color variants
- All organized under `components/ui/`
- Applied to refactor at least one existing project (To-Do App or Counter App)

---

## 8. Common Beginner Mistakes

- Extracting a component after seeing something only once (premature abstraction).
- Designing props that are too specific to one use case, limiting reusability (e.g., a `Card` component hardcoded with dashboard-specific text instead of accepting `children`).
- Forgetting default values for props that are commonly omitted, causing `undefined` to render.
- Not allowing style extension (`className` passthrough) on reusable components, forcing awkward workarounds later.
- Mixing feature-specific and generic components in the same folder without any organization.

---

## 9. Extra Resources

- [React — Thinking in React](https://react.dev/learn/thinking-in-react)
- [React — Passing Props to a Component](https://react.dev/learn/passing-props-to-a-component)
