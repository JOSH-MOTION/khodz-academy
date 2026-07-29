
# Week 2, Day 2 — Lists & .map()

**Khodz Academy — React Development Bootcamp**
**Session:** 5 of 24 | **Duration:** ~1.5–2 hours

---

## 1. Lesson Objectives

By the end of this lesson, students will be able to:

1. Render a list of data as JSX using `.map()`.
2. Understand and correctly use the `key` prop.
3. Render lists of components, not just plain elements.
4. Filter and transform arrays before rendering.
5. Handle empty-list states gracefully.

---

## 2. Skills Students Will Learn

- Using `.map()` to transform an array of data into an array of JSX elements
- The `key` prop: what it is, why React needs it, how to choose a good key
- Rendering a list of custom components (e.g., `TaskItem`) from an array of data
- Combining `.filter()` with `.map()` for filtered lists
- Rendering an empty state when a list has no items

---

## 3. Detailed Teaching Outline (~1.5–2 hrs)

| Time | Segment |
|---|---|
| 0:00–0:10 | Recap Day 1 + show and tell |
| 0:10–0:25 | Why lists need special handling in React (Slides 1–2) |
| 0:25–0:45 | .map() in JSX (Slides 3–5) — live coding |
| 0:45–1:05 | The key prop (Slides 6–8) — live coding |
| 1:05–1:20 | Rendering component lists + filtering (Slides 9–11) — live coding |
| 1:20–1:30 | Empty states, recap, Q&A (Slides 12–13) |

---

## 4. Slide-by-Slide Presentation Content

### Slide 1 — Recap: Arrays and .forEach() (from Frontend Foundations)
**Explanation:** Recall Frontend Foundations Lesson 5–6: `.forEach()` was used to loop through arrays and log or manually build DOM elements. React uses `.map()` instead, because `.map()` *returns* a new array — exactly what JSX needs to render a list.
**Instructor notes:** This distinction (`.forEach()` returns nothing, `.map()` returns a new array) is the single most important concept of the day — anchor everything else to it.

---

### Slide 2 — Why Lists Are Everywhere in Real Apps
**Explanation:** To-do items, product listings, comments, search results, navigation menus — nearly every real app renders a list of data at some point. Today's skill is one of the most frequently used in professional React development.
**Instructor notes:** Relevance framing — this lesson pays off constantly for the rest of the student's career.

---

### Slide 3 — Basic .map() in JSX
**Explanation:** `.map()` transforms each item in an array into a piece of JSX, producing an array of elements that React renders directly.
**Code example:**
```jsx
const skills = ["React", "Tailwind CSS", "JavaScript"];

function SkillsList() {
  return (
    <ul>
      {skills.map((skill) => (
        <li>{skill}</li>
      ))}
    </ul>
  );
}
```
**Instructor notes:** Run this first without a `key` prop to show the console warning React produces — sets up the next section naturally rather than pre-empting it.

---

### Slide 4 — Arrow Function Body: Implicit vs Explicit Return
**Explanation:** `.map((item) => (<li>{item}</li>))` uses an implicit return (parentheses, no `return` keyword) — very common for simple JSX. For multi-line logic, use curly braces and an explicit `return`.
**Code example:**
```jsx
skills.map((skill) => {
  const upper = skill.toUpperCase();
  return <li key={skill}>{upper}</li>;
});
```
**Instructor notes:** Recap arrow function syntax briefly from Frontend Foundations Lesson 5 (Slide 13) — same rule, applied inside `.map()`.

---

### Slide 5 — Mapping Over Arrays of Objects
**Explanation:** Real data is usually an array of objects (recall Frontend Foundations Lesson 5's quiz data shape) — `.map()` destructures each object to access its fields.
**Code example:**
```jsx
const tasks = [
  { id: 1, title: "Learn React", done: false },
  { id: 2, title: "Build a To-Do App", done: false },
];

function TaskList() {
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>{task.title}</li>
      ))}
    </ul>
  );
}
```
**Instructor notes:** Point out `task.id` used as the key here — sets up the key discussion next with a concrete, sensible example already on screen.

---

### Slide 6 — Why React Needs the key Prop
**Explanation:** `key` gives React a stable, unique identity for each item in a list so it can efficiently figure out which items changed, were added, or were removed — without it, React may re-render or mismatch list items incorrectly.
**Visual suggestion:** Diagram: list re-order without keys (React confused, wrong items update) vs. with keys (React correctly tracks each item).
**Instructor notes:** Keep this conceptual and visual — full reconciliation internals are out of scope, the goal is "always add a key, and understand roughly why."

---

### Slide 7 — Choosing a Good Key
**Explanation:** Best: a stable, unique ID from your data (`task.id`). Acceptable fallback only when data has no natural ID and the list never reorders: array index. Never use random values (`Math.random()`) as keys — breaks React's tracking entirely.
**Code example:**
```jsx
// ✅ Best — stable unique ID
{tasks.map((task) => <li key={task.id}>{task.title}</li>)}

// ⚠️ Acceptable only for static, never-reordered lists
{tasks.map((task, index) => <li key={index}>{task.title}</li>)}

// ❌ Never do this
{tasks.map((task) => <li key={Math.random()}>{task.title}</li>)}
```
**Instructor notes:** Explain briefly *why* index keys break on reordering/deleting (React matches by position, not identity) — a quick live demo (delete an item from an index-keyed list, watch the wrong item's state shift) is very convincing if time allows.

---

### Slide 8 — Where the key Prop Goes
**Explanation:** `key` must go on the outermost element returned inside `.map()` — not on children inside it, and it's not accessible via `props.key` inside the component (React reserves it internally).
**Code example:**
```jsx
// ✅ Correct — key on the outer element
{tasks.map((task) => (
  <li key={task.id}>
    <span>{task.title}</span>
  </li>
))}
```
**Instructor notes:** Trigger the console warning live by deliberately misplacing the key, so students recognize the warning message on their own later.

---

### Slide 9 — Rendering a List of Custom Components
**Explanation:** Instead of plain `<li>` elements, map over data and render a custom component per item — this is the real-world pattern (recall the reusable Card component from Day 2 and Frontend Foundations Lesson 3).
**Code example:**
```jsx
function TaskItem({ task }) {
  return (
    <li className="flex justify-between p-3 bg-white rounded-lg shadow">
      <span>{task.title}</span>
      <span>{task.done ? "✅" : "🕒"}</span>
    </li>
  );
}

function TaskList({ tasks }) {
  return (
    <ul className="flex flex-col gap-2">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </ul>
  );
}
```
**Instructor notes:** Note the `key` goes on `<TaskItem>` itself (the component call), not inside `TaskItem`'s own returned JSX — a subtle but important distinction worth repeating.

---

### Slide 10 — Filtering Before Mapping
**Explanation:** Combine `.filter()` (recap from general JS array methods) with `.map()` to render only a subset of data — e.g., only completed tasks.
**Code example:**
```jsx
const completedTasks = tasks.filter((task) => task.done);

<ul>
  {completedTasks.map((task) => (
    <TaskItem key={task.id} task={task} />
  ))}
</ul>
```
**Instructor notes:** Foreshadow this exact pattern will power the To-Do App's "show completed / show all" toggle later this week.

---

### Slide 11 — Combining Conditional Rendering with Lists
**Explanation:** Combine yesterday's conditional rendering with today's list rendering — e.g., conditionally styling each item based on its own data.
**Code example:**
```jsx
function TaskItem({ task }) {
  return (
    <li className={`p-3 rounded-lg shadow ${task.done ? "bg-green-50 line-through text-gray-400" : "bg-white"}`}>
      {task.title}
    </li>
  );
}
```
**Instructor notes:** This is a natural synthesis moment — call out explicitly that Day 1 and Day 2's skills are now combining, which is how real components typically look.

---

### Slide 12 — Handling the Empty State
**Explanation:** Always handle the case where a list has zero items — an empty `<ul>` with nothing inside looks broken to users; show a friendly message instead.
**Code example:**
```jsx
function TaskList({ tasks }) {
  if (tasks.length === 0) {
    return <p className="text-gray-500 text-center">No tasks yet. Add one above!</p>;
  }

  return (
    <ul className="flex flex-col gap-2">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </ul>
  );
}
```
**Instructor notes:** Connect back to Day 1's early-return pattern (Slide 8) — this is a direct, practical application of it.

---

### Slide 13 — Recap and What's Next
**Explanation:** Recap: `.map()` for rendering lists, the `key` prop and why it matters, rendering component lists, filtering, and empty states. Preview: Day 3 covers forms and controlled components — adding the ability to *create* new list items (tasks), completing the full To-Do App.
**Instructor notes:** Tease directly: "right now your lists are hardcoded — tomorrow, users can actually add their own."

---

## 5. Practical Exercises During Class

1. **Basic map drill:** Render a hardcoded array of favorite foods as a styled list.
2. **Key bug demo:** Instructor removes keys, shows the console warning; students add correct keys back.
3. **Filter + map drill:** Given a `products` array with a `price` field, render only products under $50.

---

## 6. Homework Assignment

- Build a static (hardcoded data, no add functionality yet) **To-Do List display**: a `tasks` array of objects (`id`, `title`, `done`), rendered via a `TaskList` component made of `TaskItem` components.
- Implement the empty-state pattern (test it by temporarily setting `tasks` to `[]`).
- Add a filter toggle (can be a simple hardcoded boolean for now, real interactivity comes Day 3) showing all tasks vs. only completed tasks.

---

## 7. Mini Project — To-Do App (Part 1: Static List)

**Brief:** "Build the display layer of a To-Do app — data comes from a hardcoded array for now; users will be able to add their own tasks starting tomorrow."

**Requirements:**
- `tasks` array of objects with `id`, `title`, `done`
- `TaskList` component mapping over `tasks`, rendering `TaskItem` components
- Correct, stable `key` usage
- Empty-state message when there are no tasks
- Styled with Tailwind, visually distinguishing completed vs. pending tasks

*(Add/complete/delete functionality is added in Day 3 and beyond.)*

---

## 8. Common Beginner Mistakes

- Forgetting the `key` prop entirely (console warning, and potential bugs on reorder/delete).
- Using array index as a key on a list that can be reordered or filtered.
- Placing `key` on the wrong element (a child inside the mapped item, instead of the outer element).
- Using `.forEach()` instead of `.map()` inside JSX (returns `undefined`, renders nothing).
- Forgetting to `return` JSX inside a `.map()` callback when using curly-brace syntax.
- Not handling the empty-list case, leaving a blank, confusing UI.

---

## 9. Extra Resources

- [React — Rendering Lists](https://react.dev/learn/rendering-lists)
- [MDN — Array.prototype.map()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)
- [MDN — Array.prototype.filter()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)
