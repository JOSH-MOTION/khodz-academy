
# Week 1, Day 2 — Components, Props, and Component Composition

**Khodz Academy — React Development Bootcamp**
**Session:** 2 of 24 | **Duration:** ~1.5–2 hours

---

## 1. Lesson Objectives

By the end of this lesson, students will be able to:

1. Create multiple function components and organize them into files.
2. Import and use components inside other components.
3. Pass data into components using props.
4. Understand props as read-only, one-directional data flow.
5. Compose small components into larger UI structures (composition).
6. Use the `children` prop to build wrapper/layout components.

---

## 2. Skills Students Will Learn

- Defining a function component
- Splitting UI into multiple components/files
- Importing/exporting components (`export default`, named exports)
- Passing props (attributes) into a component
- Destructuring props in the function signature
- Default prop values
- The `children` prop pattern
- Component composition (components made of other components)

---

## 3. Detailed Teaching Outline (~1.5–2 hrs)

| Time | Segment |
|---|---|
| 0:00–0:10 | Recap Day 1 + show and tell |
| 0:10–0:25 | What is a component, really? (Slides 1–3) |
| 0:25–0:45 | Creating and importing components (Slides 4–6) — live coding |
| 0:45–1:05 | Props basics (Slides 7–10) — live coding |
| 1:05–1:20 | Composition and `children` (Slides 11–13) — live coding |
| 1:20–1:30 | Recap, common mistakes, Q&A (Slide 14) |

---

## 4. Slide-by-Slide Presentation Content

### Slide 1 — Recap: What Is a Component?
**Explanation:** A component is a reusable, self-contained piece of UI defined as a JavaScript function that returns JSX. Yesterday, `App` was the only component — today, we build many, each responsible for one clear piece of the interface.
**Instructor notes:** Recap the "navbar/card/footer" boxes diagram from Day 1 (Slide 4) — today those boxes become real code.

---

### Slide 2 — Why Split UI Into Components?
**Explanation:** Benefits: reusability (write once, use many times), readability (small, focused files), easier debugging (isolate problems), and team collaboration (different people can work on different components).
**Real-world example:** A card component built once (like students did by hand in Frontend Foundations Lesson 3) can now be reused across a whole app with just one line of code each time.
**Instructor notes:** Directly reference the "same shape, different content" card pattern from Frontend Foundations Lesson 3 — today formalizes exactly that idea.

---

### Slide 3 — Naming and File Conventions
**Explanation:** Component names must start with a capital letter (React uses this to distinguish components from regular HTML tags). Convention: one component per file, filename matches component name (`Card.jsx`).
**Code example:**
```jsx
// ✅ Correct
function Card() { ... }

// ❌ Wrong — React treats lowercase as an HTML tag, not a component
function card() { ... }
```
**Instructor notes:** Trigger this mistake live to show the resulting error/odd behavior — makes the capitalization rule memorable.

---

### Slide 4 — Creating Your First Custom Component
**Explanation:** Build a simple `Greeting` component and use it inside `App`.
**Code example:**
```jsx
// src/Greeting.jsx
function Greeting() {
  return <h1>Welcome to Khodz Academy!</h1>;
}

export default Greeting;
```
```jsx
// src/App.jsx
import Greeting from "./Greeting.jsx";

function App() {
  return (
    <div>
      <Greeting />
    </div>
  );
}

export default App;
```
**Instructor notes:** Build this fully live, then use the component twice (`<Greeting /><Greeting />`) to immediately demonstrate reusability in action.

---

### Slide 5 — Organizing Components in Folders
**Explanation:** As apps grow, organize components into a `src/components/` folder to keep the project navigable.
**Code example:**
```
src/
├── components/
│   ├── Greeting.jsx
│   ├── Navbar.jsx
│   └── Card.jsx
├── App.jsx
└── main.jsx
```
**Instructor notes:** Introduce this structure now so it becomes habit early — much easier than retrofitting organization onto a messy project later (foreshadow Week 6, Day 3: Project Organization).

---

### Slide 6 — Building a Small Component Tree
**Explanation:** Compose a `Header`, `Main`, and `Footer` component, each used once inside `App` — mirroring the semantic HTML structure from Frontend Foundations Lesson 1.
**Code example:**
```jsx
function App() {
  return (
    <div>
      <Header />
      <Main />
      <Footer />
    </div>
  );
}
```
**Instructor notes:** Explicitly connect: "this is the exact same `<header><main><footer>` structure from Lesson 1 of Frontend Foundations — just each piece is now its own reusable component."

---

### Slide 7 — What Are Props?
**Explanation:** Props ("properties") are how data is passed from a parent component into a child component — similar to passing arguments into a function (which students already know from Frontend Foundations Lesson 5).
**Code example:**
```jsx
function Greeting(props) {
  return <h1>Welcome, {props.name}!</h1>;
}

// Usage:
<Greeting name="Amaka" />
<Greeting name="Tunde" />
```
**Instructor notes:** Draw the direct parallel to Lesson 5's `greetStudent(name)` function — "props are just function arguments for components."

---

### Slide 8 — Destructuring Props (Cleaner Syntax)
**Explanation:** Instead of writing `props.name` repeatedly, destructure props directly in the function signature — the standard, preferred style in real-world React code.
**Code example:**
```jsx
function Greeting({ name }) {
  return <h1>Welcome, {name}!</h1>;
}
```
**Instructor notes:** Show both versions side by side, same result — reduces "is this different syntax entirely?" confusion, same technique as async/await vs .then() comparison in Frontend Foundations Lesson 7.

---

### Slide 9 — Passing Multiple Props
**Explanation:** Components can receive any number of props, of any data type — strings, numbers, booleans, even functions (covered Day 3).
**Code example:**
```jsx
function ProjectCard({ title, description, isCompleted }) {
  return (
    <div className="p-4 bg-white rounded-xl shadow">
      <h3 className="font-bold">{title}</h3>
      <p className="text-gray-600">{description}</p>
      <p>{isCompleted ? "✅ Completed" : "🕒 In Progress"}</p>
    </div>
  );
}

// Usage:
<ProjectCard title="Portfolio Site" description="A personal site." isCompleted={true} />
```
**Instructor notes:** Note the ternary (`isCompleted ? ... : ...`) — recap from Frontend Foundations Lesson 5's conditional logic, now used inline in JSX. Full conditional rendering patterns are tomorrow's (Day 3... actually Week 2 Day 1) focus — keep this brief.

---

### Slide 10 — Props Are Read-Only
**Explanation:** A component must never modify the props it receives — props flow one-directional, parent → child. If a child needs to change something, the parent must own that logic (previewed properly with state on Day 3).
**Code example:**
```jsx
// ❌ Never do this
function Greeting({ name }) {
  name = "Changed!"; // props are read-only — don't mutate
  return <h1>{name}</h1>;
}
```
**Instructor notes:** State this rule firmly — it's foundational to how React data flow works and prevents confusing bugs later. Frame it as "props are like a delivered package — you can look at it, but you don't get to repack it."

---

### Slide 11 — Component Composition
**Explanation:** Composition means building complex UI by combining small, simple components — much like Lego blocks. A `Page` might be composed of `Navbar` + `Hero` + `FeatureList` (made of many `FeatureCard`s) + `Footer`.
**Visual suggestion:** Nested box diagram showing a page built from smaller component blocks.
**Instructor notes:** Reconnect to the SaaS Landing Page project from Frontend Foundations Week 3 — "you built exactly this structure by hand with divs; now each section becomes its own component."

---

### Slide 12 — The `children` Prop
**Explanation:** `children` is a special prop that lets a component wrap and render whatever is placed *between* its opening and closing tags — powerful for building reusable layout/wrapper components.
**Code example:**
```jsx
function Card({ children }) {
  return <div className="p-6 bg-white rounded-xl shadow">{children}</div>;
}

// Usage:
<Card>
  <h3 className="font-bold">Project Title</h3>
  <p className="text-gray-600">Description here.</p>
</Card>
```
**Instructor notes:** This is often the trickiest new idea today — build it slowly, showing what happens if `{children}` is removed (nothing renders) to make its purpose concrete.

---

### Slide 13 — Combining Props and Children
**Explanation:** A component can accept both regular props *and* `children` at the same time — very common in real component libraries (e.g., a `Modal` component with a `title` prop and `children` for the body content).
**Code example:**
```jsx
function Panel({ title, children }) {
  return (
    <div className="p-6 bg-white rounded-xl shadow">
      <h3 className="font-bold mb-2">{title}</h3>
      {children}
    </div>
  );
}

// Usage:
<Panel title="Skills">
  <ul>
    <li>React</li>
    <li>Tailwind CSS</li>
  </ul>
</Panel>
```
**Instructor notes:** Build this live as the day's capstone example — it combines everything taught today into one realistic, reusable pattern.

---

### Slide 14 — Recap and What's Next
**Explanation:** Recap: components, props, destructuring, read-only data flow, composition, and `children`. Preview: Day 3 introduces `useState` and events — making components actually interactive and stateful, completing the Counter App.
**Instructor notes:** Tell students explicitly: "everything is still static today — tomorrow, things finally respond to clicks." Sets clear anticipation.

---

## 5. Practical Exercises During Class

1. **Component extraction drill:** Instructor gives a single large JSX block; students split it into 3 separate components.
2. **Props drill:** Students build a `Badge` component accepting a `label` prop and use it 3 times with different labels.
3. **Children drill:** Students build a `Section` wrapper component using `children` and use it to wrap two different pieces of content.

---

## 6. Homework Assignment

- Refactor yesterday's Counter App structure into at least 3 components: `Header`, `CounterDisplay`, `CounterControls` (buttons), composed together inside `App`.
- Pass a `title` prop into `Header` (e.g., "My Counter App") and render it.
- Add a `ProjectCard` component (from Slide 9) and render it 3 times in `App` with different `title`/`description` props, to practice reusability outside the counter context.

---

## 7. Mini Project — Counter App (Part 2: Component Structure)

**Brief:** "Refactor your Counter App's structure into clean, reusable components before adding interactivity tomorrow."

**Requirements:**
- At least 3 components: a header/title component, a display component, a controls component
- Components composed together inside `App.jsx`
- At least one prop passed into a component
- Clean file organization (`src/components/`)

*(Interactivity added in Day 3.)*

---

## 8. Common Beginner Mistakes

- Naming a component with a lowercase first letter, causing React to misinterpret it as an HTML tag.
- Forgetting to `export default` a component, causing import errors.
- Forgetting to `import` a component before using it.
- Trying to reassign/mutate a prop inside a child component.
- Forgetting curly braces around `{children}`.
- Passing props but forgetting to destructure or reference them correctly (`{name}` vs `name` vs `props.name` mismatches).
- Over-nesting components prematurely — splitting too aggressively before there's a real reuse need (encourage: split when you notice repetition or a section is doing too much).

---

## 9. Extra Resources

- [React — Your First Component](https://react.dev/learn/your-first-component)
- [React — Passing Props to a Component](https://react.dev/learn/passing-props-to-a-component)
- [React — Passing JSX as Children](https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children)
