
# Week 2, Day 3 — Forms & Controlled Components

**Khodz Academy — React Development Bootcamp**
**Session:** 6 of 24 | **Duration:** ~1.5–2 hours

---

## 1. Lesson Objectives

By the end of this lesson, students will be able to:

1. Explain what a "controlled component" is and why React favors this pattern.
2. Bind input values to state using `value` and `onChange`.
3. Handle form submission in React (`onSubmit`, `preventDefault`).
4. Add new items to a list based on form input (completing the To-Do App).
5. Implement toggle-complete and delete functionality for list items.

---

## 2. Skills Students Will Learn

- Controlled vs. uncontrolled inputs (controlled is the focus/standard for this course)
- Binding `value={state}` and `onChange={handler}` on inputs
- Handling `<form onSubmit>` in React, including `event.preventDefault()`
- Adding items to state arrays immutably (spread operator, not `.push()`)
- Removing items from state arrays immutably (`.filter()`)
- Updating one item within an array of objects immutably (`.map()`)
- Completing a full CRUD-lite (Create, Read, Update via toggle, Delete) flow in local state

---

## 3. Detailed Teaching Outline (~1.5–2 hrs)

| Time | Segment |
|---|---|
| 0:00–0:10 | Recap Day 2 + show and tell |
| 0:10–0:25 | Controlled components concept (Slides 1–3) |
| 0:25–0:45 | Building a controlled input + form (Slides 4–6) — live coding |
| 0:45–1:05 | Adding items immutably (Slides 7–9) — live coding |
| 1:05–1:20 | Toggle and delete (Slides 10–12) — live coding |
| 1:20–1:30 | Recap, common mistakes, Q&A (Slide 13) |

---

## 4. Slide-by-Slide Presentation Content

### Slide 1 — Recap: Forms in Frontend Foundations
**Explanation:** Recall Frontend Foundations Lesson 4 (form structure/validation) and Lesson 6 (reading input values with vanilla JS via `document.querySelector`). Today, React takes over that "reading input values" job using state instead of manual DOM queries.
**Instructor notes:** This recap primes the key shift: "instead of *asking* the DOM for the input's value when needed, React *always knows* it, because state and the input are kept in sync."

---

### Slide 2 — What Is a Controlled Component?
**Explanation:** A controlled component is a form input whose value is driven by React state — the input's `value` comes from state, and every keystroke updates that state via `onChange`. React becomes the "single source of truth" for the input's value.
**Visual suggestion:** Loop diagram: state → input's `value` → user types → `onChange` fires → state updates → loop repeats.
**Instructor notes:** This loop diagram is the single most important visual of the day — refer back to it whenever confusion arises.

---

### Slide 3 — Why Controlled Components?
**Explanation:** Benefits: you can validate, transform, or react to input as the user types (recall Frontend Foundations Lesson 4's live validation UX ideas), easily reset forms, and keep all form data in one predictable place instead of querying the DOM manually.
**Instructor notes:** Connect to Lesson 4's error-state design mockups — "those static error UIs can now become fully dynamic and real."

---

### Slide 4 — Building Your First Controlled Input
**Code example:**
```jsx
import { useState } from "react";

function TaskInput() {
  const [text, setText] = useState("");

  return (
    <input
      type="text"
      value={text}
      onChange={(e) => setText(e.target.value)}
      placeholder="Add a new task..."
      className="border px-4 py-2 rounded-lg w-full"
    />
  );
}
```
**Instructor notes:** Build this live, then deliberately remove `value={text}` to show the input becomes "uncontrolled" (React warns in console) — makes the concept concrete via contrast.

---

### Slide 5 — Reading e.target.value
**Explanation:** `e` (the event object) contains `e.target`, the actual DOM input element, and `.value` gives its current text — same DOM concept from Frontend Foundations Lesson 6, now used inside a React event handler.
**Instructor notes:** Reconnect explicitly to Lesson 6's event object usage — reinforces this isn't brand-new knowledge, just a new context.

---

### Slide 6 — Handling Form Submission
**Explanation:** Wrap the input in a `<form>` with `onSubmit`, and call `event.preventDefault()` to stop the default page reload — exact same concept as Frontend Foundations Lesson 6's `preventDefault()`, applied in JSX syntax.
**Code example:**
```jsx
function TaskInput() {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted:", text);
    setText(""); // clear the input after submit
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="flex-1 border px-4 py-2 rounded-lg"
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg">Add</button>
    </form>
  );
}
```
**Instructor notes:** Demonstrate without `preventDefault()` first to show the jarring page reload/flash — same demo technique used in Frontend Foundations Lesson 6.

---

### Slide 7 — Why We Don't Mutate State Arrays Directly
**Explanation:** Using `.push()` on a state array mutates it in place — React won't detect the change and won't re-render. Always create a *new* array instead.
**Code example:**
```jsx
// ❌ Mutates the existing array — React may not re-render
tasks.push(newTask);
setTasks(tasks);

// ✅ Creates a new array — React detects the change
setTasks([...tasks, newTask]);
```
**Instructor notes:** Trigger the broken `.push()` version live if possible — the UI silently failing to update despite the data technically changing is a memorable lesson.

---

### Slide 8 — The Spread Operator for Immutable Updates
**Explanation:** `...tasks` "spreads" all existing items into a new array, onto which you can add more — a core technique used constantly in React state management.
**Code example:**
```jsx
const addTask = (title) => {
  const newTask = { id: Date.now(), title, done: false };
  setTasks([...tasks, newTask]);
};
```
**Instructor notes:** Explain `Date.now()` briefly as a simple, good-enough unique ID generator for a local, no-backend project like this one.

---

### Slide 9 — Wiring the Form to Add Tasks
**Code example:**
```jsx
function App() {
  const [tasks, setTasks] = useState([
    { id: 1, title: "Learn React", done: false },
  ]);
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return; // don't add empty tasks
    setTasks([...tasks, { id: Date.now(), title: text, done: false }]);
    setText("");
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a task..."
          className="flex-1 border px-4 py-2 rounded-lg"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg">Add</button>
      </form>
      <TaskList tasks={tasks} />
    </div>
  );
}
```
**Instructor notes:** Point out the `if (!text.trim()) return;` guard — a direct callback to Frontend Foundations' "required field" validation concept, now enforced in JS/React rather than via the `required` HTML attribute alone.

---

### Slide 10 — Toggling an Item's Completed State (Immutably)
**Explanation:** To update one item inside an array of objects, use `.map()` to create a new array, changing only the matching item.
**Code example:**
```jsx
const toggleTask = (id) => {
  setTasks(
    tasks.map((task) =>
      task.id === id ? { ...task, done: !task.done } : task
    )
  );
};
```
**Instructor notes:** Walk through this line by line slowly — it's the densest single line of the day: "for every task, if its id matches, return a new object with done flipped; otherwise, return it unchanged."

---

### Slide 11 — Deleting an Item (Immutably)
**Explanation:** Use `.filter()` to create a new array excluding the item to delete.
**Code example:**
```jsx
const deleteTask = (id) => {
  setTasks(tasks.filter((task) => task.id !== id));
};
```
**Instructor notes:** Contrast with Day 2's `.filter()` for viewing (Slide 10 of that lesson) — same method, different purpose (removing vs. displaying a subset).

---

### Slide 12 — Wiring Toggle and Delete into TaskItem
**Code example:**
```jsx
function TaskItem({ task, onToggle, onDelete }) {
  return (
    <li className={`flex justify-between items-center p-3 rounded-lg shadow ${task.done ? "bg-green-50" : "bg-white"}`}>
      <span
        onClick={() => onToggle(task.id)}
        className={`cursor-pointer ${task.done ? "line-through text-gray-400" : ""}`}
      >
        {task.title}
      </span>
      <button onClick={() => onDelete(task.id)} className="text-red-500 text-sm">Delete</button>
    </li>
  );
}
```
```jsx
function TaskList({ tasks, onToggle, onDelete }) {
  return (
    <ul className="flex flex-col gap-2">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} />
      ))}
    </ul>
  );
}
```
**Instructor notes:** This is the day's capstone build — assemble it live, testing add/toggle/delete after each piece is wired up. This completes the full To-Do App CRUD-lite cycle.

---

### Slide 13 — Recap and What's Next
**Explanation:** Recap: controlled components, form submission, immutable array updates (spread, `.map()`, `.filter()`), and a fully functional To-Do App with add/toggle/delete. Preview: Week 3 shifts focus to styling React apps thoroughly with Tailwind and building reusable, professional components — heading toward the Admin Dashboard project.
**Instructor notes:** Celebrate this milestone explicitly — students have now built a genuinely complete small CRUD application, entirely in React state, in just two weeks.

---

## 5. Practical Exercises During Class

1. **Controlled input drill:** Build a simple `NameInput` component with live character count displayed below it.
2. **Immutable update drill:** Given a `favorites` array of strings in state, write functions to add and remove an item without mutation.
3. **Full build-along:** Every student wires up add, toggle, and delete on their own To-Do App with the instructor.

---

## 6. Homework Assignment

Complete the **To-Do App** (Section 7) fully:

- Controlled input + form for adding new tasks (with empty-input guard)
- Toggle-complete functionality (click task text)
- Delete functionality (delete button per task)
- Empty-state message when no tasks remain (recap from Day 2)
- Fully styled with Tailwind, clear visual distinction for completed tasks

---

## 7. Mini Project — To-Do App (Final)

**Brief:** "Complete a fully functional To-Do application — add, complete, and delete tasks, all backed by React state."

**Requirements:**
- Controlled text input bound to state
- Form submission adds a new task (with validation guard against empty input)
- Click-to-toggle completed state
- Delete button per task
- Immutable state updates throughout (no `.push()`, no direct mutation)
- Empty-state handling
- Clean component structure: `App`, `TaskInput` (or inline form in `App`), `TaskList`, `TaskItem`

**Stretch goal:** Add a task counter ("3 of 5 tasks completed") using `.filter()` on the tasks array.

---

## 8. Common Beginner Mistakes

- Forgetting `value={state}` on the input, making it uncontrolled (React warning in console).
- Forgetting `onChange`, making the input impossible to type into (value never updates).
- Using `.push()` or direct array mutation instead of spread/`.filter()`/`.map()`.
- Forgetting `event.preventDefault()`, causing the page to reload on submit.
- Not trimming/validating input before adding, allowing empty or whitespace-only tasks.
- Forgetting to reset the input (`setText("")`) after successful submission.
- Mismatched `id` types when comparing (`task.id === id` failing due to string vs. number mismatch) — encourage consistent ID types throughout.

---

## 9. Extra Resources

- [React — Reacting to Input with State](https://react.dev/learn/reacting-to-input-with-state)
- [React — Updating Arrays in State](https://react.dev/learn/updating-arrays-in-state)
- [MDN — Spread Syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)
