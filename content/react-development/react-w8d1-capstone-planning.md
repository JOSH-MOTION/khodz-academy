
# Week 8, Day 1 — Capstone Planning

**Khodz Academy — React Development Bootcamp**
**Session:** 22 of 24 | **Duration:** ~1.5–2 hours

---

## 1. Lesson Objectives

By the end of this lesson, students will be able to:

1. Choose a scoped, achievable capstone project idea.
2. Plan a component tree and route structure before coding.
3. Plan data needs (what's hardcoded vs. what comes from an API).
4. Break the project into a realistic build schedule across Days 2–3.
5. Set up a clean, organized starting project.

---

## 2. Skills Students Will Learn

- Scoping a project to be ambitious but finishable in ~2 sessions + homework time
- Planning a component tree on paper/whiteboard before writing code (recap Week 3, Day 3; Week 5, Day 1)
- Planning route structure (recap Week 5)
- Deciding what state is local vs. shared via Context (recap Week 6)
- Deciding what data is hardcoded vs. fetched (recap Week 4, Week 7)
- Creating a simple task checklist/build order to follow over the next two sessions

---

## 3. Detailed Teaching Outline (~1.5–2 hrs)

| Time | Segment |
|---|---|
| 0:00–0:15 | Recap Week 7 + show and tell (Student Management Apps) |
| 0:15–0:25 | Capstone brief and expectations (Slides 1–2) |
| 0:25–0:45 | Choosing a scoped idea (Slides 3–5) |
| 0:45–1:10 | Planning the component tree and routes (Slides 6–8) — hands-on |
| 1:10–1:25 | Planning data and build order (Slides 9–10) — hands-on |
| 1:25–1:30 | Project setup, Q&A (Slide 11) |

---

## 4. Slide-by-Slide Presentation Content

### Slide 1 — The Capstone Brief
**Explanation:** Build and deploy a complete, original React application demonstrating everything learned across the course: components, state, styling, effects/API data, routing, Context/custom hooks, and (if the concept fits) CRUD + mock auth.
**Instructor notes:** Frame this explicitly as each student's strongest portfolio piece — the project most likely to be shown to a client or employer.

---

### Slide 2 — What "Done" Looks Like
**Explanation:** A finished capstone: deployed live (Day 3), pushed to GitHub with a clean commit history and README (recap Frontend Foundations Lesson 8), responsive, no console errors, and demonstrably uses at least 5–6 of the course's core skills.
**Visual suggestion:** A simple checklist graphic mirroring the rubric in Section 7.
**Instructor notes:** Share this checklist now, at the start of planning — students should design toward it, not discover it retroactively at the end.

---

### Slide 3 — Choosing a Scoped Idea
**Explanation:** Good capstone ideas are personally interesting, use real or realistic data, and are scoped to roughly the complexity of the Student Management App (Week 7) — not smaller, but also not dramatically bigger.
**Real-world example ideas:** A recipe finder (API-driven), a personal finance tracker (CRUD + local state), a job application tracker (CRUD + auth), an event planner (routing + forms), a habit tracker (Context + localStorage + CRUD-lite).
**Instructor notes:** Encourage students to pick something they'd actually want to use themselves — genuine interest correlates strongly with finishing strong, especially under time pressure.

---

### Slide 4 — Avoiding Common Scoping Mistakes
**Explanation:** Too small: a project that doesn't touch routing, state, or API data meaningfully. Too big: real-time chat, payment processing, or anything requiring a real backend the course hasn't covered yet (that's Module 3).
**Instructor notes:** Be direct and protective of students' time here — gently redirect anyone proposing something unrealistic for a ~2-session build, using the Student Management App's complexity as the calibration reference point.

---

### Slide 5 — The Minimum Viable Capstone Checklist
**Explanation:** At minimum, a capstone should include: multiple routed pages (Week 5), at least one Context or custom hook (Week 6), at least one API-driven feature OR full local CRUD (Week 4/7), and consistent Tailwind styling using the UI kit (Week 3).
**Instructor notes:** This is the "floor," not the ceiling — students exceeding it (e.g., adding mock auth) should be encouraged, but this ensures nobody under-scopes.

---

### Slide 6 — Planning the Component Tree
**Explanation:** Sketch (on paper or a whiteboard tool) the component hierarchy before coding: layout components, page components, feature components, and shared UI components — recap Week 3, Day 3's dashboard planning process.
**Visual suggestion:** Example tree diagram for a sample "Recipe Finder" capstone: `App` → `MainLayout` (`Navbar`) → `Routes` → `Home`, `RecipeDetail`, `Favorites`.
**Instructor notes:** Require every student to produce this sketch before writing any code today — a hard checkpoint, not optional.

---

### Slide 7 — Planning Routes
**Explanation:** List every planned route and whether it's public, protected, static, or dynamic (recap Week 5's full arc: static, nested, dynamic, protected).
**Code example:**
```
/                      → Home (public)
/recipes/:id           → Recipe detail (public, dynamic)
/favorites             → Favorites list (protected, if auth is included)
/login                 → Login (public-only)
```
**Instructor notes:** Have students write this list out explicitly — it becomes their literal `<Routes>` structure later, reducing decision fatigue during the actual build session.

---

### Slide 8 — Planning Context and Custom Hooks
**Explanation:** Decide what state genuinely needs to be shared app-wide (Context candidate, recap Week 6, Day 1's "when to use Context" guidance) vs. what's local to one component.
**Instructor notes:** Push back gently on over-using Context here too — reinforce Week 6, Day 1's guidance one more time, since capstone excitement often tempts over-engineering.

---

### Slide 9 — Planning Data Sources
**Explanation:** For each major feature, decide: hardcoded local array, a public API (recap Week 4/7's APIs), or JSONPlaceholder-style mock CRUD (recap Week 7, Day 1). Write this down explicitly per feature.
**Instructor notes:** This planning step prevents a common Day 2 time-sink: students discovering mid-build that their chosen API doesn't support what they need, with no time left to pivot.

---

### Slide 10 — Building a Realistic Two-Session Build Order
**Explanation:** Break the project into a rough order: Day 2 = core structure, routing, and primary feature logic; Day 3 (+homework between) = polish, remaining features, debugging, deployment.
**Visual suggestion:** Simple two-column checklist: "Day 2 goals" vs. "Day 3 goals."
**Instructor notes:** Have every student write this two-column list for their own project before the session ends — converts an intimidating capstone into a concrete, achievable to-do list.

---

### Slide 11 — Project Setup
**Explanation:** Scaffold the new Vite + React project, install Tailwind (Week 3, Day 1), install React Router (Week 5, Day 1), and set up the standard folder structure (Week 6, Day 3) — all before Day 2's session begins.
**Instructor notes:** Use remaining class time to get every student's project scaffolded and running cleanly — removes setup friction from Day 2, maximizing actual build time next session.

---

## 5. Practical Exercises During Class

1. **Idea pitch:** Each student pitches their capstone idea in 1–2 sentences to a partner or the group; partner/instructor sanity-checks scope.
2. **Component tree sketch:** Every student sketches their planned component tree on paper or a whiteboard tool.
3. **Setup checkpoint:** Every student leaves class with a scaffolded, running project (Vite + Tailwind + React Router + folder structure) ready for Day 2.

---

## 6. Homework Assignment

- Finalize the capstone plan: component tree, route list, Context/hook decisions, and data source plan (all from today's slides), written up as a short project brief (can be informal notes).
- Begin building the layout shell and route structure only — no feature logic yet, saving that for Day 2's guided build session.

---

## 7. Mini Project — Capstone Planning Document

**Brief:** "Produce a clear, realistic plan for your capstone before writing significant code."

**Requirements:**
- One-paragraph project brief (what it is, who it's for, core value)
- Component tree sketch
- Route list (path, page, public/protected, static/dynamic)
- Context/custom hook plan
- Data source plan per feature
- Two-session build order (Day 2 goals vs. Day 3 goals)
- Scaffolded, running project with Tailwind, React Router, and standard folder structure in place

---

## 8. Common Beginner Mistakes

- Choosing a project that's really a Month 1-level idea (too simple to showcase Month 2 skills).
- Choosing a project that secretly requires a real backend to work as imagined (e.g., "users can message each other").
- Skipping the planning step and diving straight into code, leading to messy structure discovered too late.
- Over-planning to the point of analysis paralysis — remind students the plan should take a fraction of the session, not all of it.
- Not setting up the project fully today, losing valuable build time at the start of Day 2.

---

## 9. Extra Resources

- [React — Thinking in React (recap, project planning)](https://react.dev/learn/thinking-in-react)
- [Excalidraw](https://excalidraw.com/) — free tool for sketching component trees/wireframes
