
# Week 3, Day 3 — Mini Dashboard UI

**Khodz Academy — React Development Bootcamp**
**Session:** 9 of 24 | **Duration:** ~1.5–2 hours

---

## 1. Lesson Objectives

By the end of this lesson, students will be able to:

1. Plan a multi-section dashboard layout using component composition.
2. Combine the UI kit (Button, Card, Input, Badge) into a realistic application interface.
3. Build a responsive sidebar + main content layout.
4. Assemble stat cards, a data table, and a recent activity feed.
5. Complete and polish the Admin Dashboard project.

---

## 2. Skills Students Will Learn

- Planning a dashboard layout (sidebar + topbar + content grid)
- Building a responsive sidebar layout in React (recap Frontend Foundations Lesson 6's sidebar pattern + Tailwind grid/flex)
- Composing `StatCard` components in a responsive grid
- Rendering a simple data table from an array (recap `.map()` from Week 2, Day 2)
- Assembling a full-page layout from many smaller components
- Final polish pass: spacing consistency, responsive check, empty states

---

## 3. Detailed Teaching Outline (~1.5–2 hrs)

| Time | Segment |
|---|---|
| 0:00–0:10 | Recap Day 2 + show and tell (UI kits) |
| 0:10–0:20 | Planning the dashboard layout (Slides 1–2) |
| 0:20–0:40 | Building the sidebar + layout shell (Slides 3–5) — live coding |
| 0:40–1:00 | Stat cards grid (Slides 6–7) — live coding |
| 1:00–1:20 | Data table + activity feed (Slides 8–10) — live coding |
| 1:20–1:30 | Polish pass, recap, Q&A (Slides 11–12) |

---

## 4. Slide-by-Slide Presentation Content

### Slide 1 — What We're Building Today
**Explanation:** A realistic Admin Dashboard: sidebar navigation, top stat cards, a data table of recent items, and an activity feed — assembled entirely from components built in Days 1–2, plus a few new layout components.
**Visual suggestion:** Full dashboard wireframe with labeled regions (Sidebar, Topbar, Stats Grid, Table, Activity Feed).
**Instructor notes:** Show a real SaaS admin dashboard (e.g., a screenshot of any analytics tool) as reference — grounds today's build in something recognizable and professional.

---

### Slide 2 — Planning the Component Tree
**Explanation:** Before coding, sketch the component hierarchy: `App` → `Sidebar` + `MainContent` (→ `StatsGrid` (→ `StatCard` × n) + `RecentTable` + `ActivityFeed`).
**Visual suggestion:** Tree diagram matching the wireframe from Slide 1.
**Instructor notes:** Reinforce the "plan before code" habit consistent since Frontend Foundations — this is React's version of the wireframing exercise from that course.

---

### Slide 3 — Building the Layout Shell
**Code example:**
```jsx
function App() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-6">
        <Topbar />
        {/* content goes here */}
      </main>
    </div>
  );
}
```
**Instructor notes:** Point out `flex min-h-screen` on the outer container and `flex-1` on `main` — recap flexbox from Frontend Foundations Lesson 2, now structuring an app-level layout instead of a landing page section.

---

### Slide 4 — Building the Sidebar
**Code example:**
```jsx
function Sidebar() {
  const links = ["Dashboard", "Orders", "Customers", "Settings"];

  return (
    <aside className="w-64 bg-gray-900 text-white p-6 hidden md:block">
      <h2 className="text-xl font-bold mb-8">Khodz Admin</h2>
      <nav className="flex flex-col gap-3">
        {links.map((link) => (
          <a key={link} href="#" className="hover:text-blue-400">{link}</a>
        ))}
      </nav>
    </aside>
  );
}
```
**Instructor notes:** Point out `.map()` used here for the nav links — recap Week 2, Day 2, applied in a new layout context. `hidden md:block` recaps Frontend Foundations Lesson 3's responsive show/hide pattern.

---

### Slide 5 — Building the Topbar
**Code example:**
```jsx
function Topbar() {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Dashboard Overview</h1>
      <Button variant="primary">+ New Order</Button>
    </div>
  );
}
```
**Instructor notes:** First reuse of the `Button` component from Day 1/2 inside a new context — call it out explicitly as proof the UI kit investment is paying off.

---

### Slide 6 — Building the Stats Grid
**Code example:**
```jsx
const stats = [
  { title: "Total Sales", value: "$12,400", icon: "💰" },
  { title: "New Orders", value: "38", icon: "📦" },
  { title: "Active Users", value: "214", icon: "👥" },
];

function StatsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}
```
**Instructor notes:** Introduce the `{...stat}` spread-as-props shortcut here — spreads all object fields as individual props at once, since they already match `StatCard`'s prop names. Explain it as a small time-saving convenience, not a new concept.

---

### Slide 7 — Responsive Grid Recap
**Explanation:** `grid-cols-1 md:grid-cols-3` recaps Frontend Foundations Lesson 3's responsive grid pattern — mobile stacks stat cards vertically, desktop shows them in a row.
**Instructor notes:** Resize the browser live to confirm the responsive behavior — same verification habit from Frontend Foundations.

---

### Slide 8 — Building a Simple Data Table
**Code example:**
```jsx
const orders = [
  { id: 1042, customer: "Amaka O.", amount: "$120", status: "Pending" },
  { id: 1041, customer: "Tunde A.", amount: "$85", status: "Shipped" },
];

function RecentTable() {
  return (
    <Card className="mb-8">
      <h3 className="font-bold mb-4">Recent Orders</h3>
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="text-gray-500 border-b">
            <th className="pb-2">Order</th>
            <th className="pb-2">Customer</th>
            <th className="pb-2">Amount</th>
            <th className="pb-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-b last:border-0">
              <td className="py-2">#{order.id}</td>
              <td className="py-2">{order.customer}</td>
              <td className="py-2">{order.amount}</td>
              <td className="py-2"><Badge label={order.status} color={order.status === "Shipped" ? "green" : "gray"} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
```
**Instructor notes:** This is the first `<table>` element in the course — introduce briefly (`<thead>`, `<tbody>`, `<tr>`, `<th>`, `<td>`) since it wasn't covered in Frontend Foundations; keep it light, focus on the `.map()` + `Badge` reuse pattern rather than table semantics.

---

### Slide 9 — Building the Activity Feed
**Code example:**
```jsx
const activity = [
  "Amaka placed a new order.",
  "Tunde's order was shipped.",
  "New customer signed up: Chidi E.",
];

function ActivityFeed() {
  if (activity.length === 0) {
    return <p className="text-gray-500">No recent activity.</p>;
  }

  return (
    <Card>
      <h3 className="font-bold mb-4">Recent Activity</h3>
      <ul className="flex flex-col gap-2 text-sm text-gray-600">
        {activity.map((item, index) => (
          <li key={index}>• {item}</li>
        ))}
      </ul>
    </Card>
  );
}
```
**Instructor notes:** Note the index-as-key usage here — call back to Week 2, Day 2, Slide 7's guidance: acceptable here since this is a static, never-reordered list. A good moment to check understanding by asking students "why is index okay here specifically?"

---

### Slide 10 — Assembling the Full Dashboard
**Code example:**
```jsx
function App() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-6">
        <Topbar />
        <StatsGrid />
        <RecentTable />
        <ActivityFeed />
      </main>
    </div>
  );
}
```
**Instructor notes:** Zoom out here and show the full file tree of components used — a satisfying "look how much we built from small pieces" moment.

---

### Slide 11 — Final Polish Pass
**Explanation:** Walk through a polish checklist: consistent spacing (`mb-6`/`mb-8` rhythm), responsive check at mobile width, empty states verified (temporarily set `orders`/`activity` to `[]`), hover states on interactive elements.
**Instructor notes:** Model this as the exact final step a professional/freelancer takes before calling a project "done" — connects to the "client-ready" framing used throughout Frontend Foundations.

---

### Slide 12 — Recap and What's Next
**Explanation:** Recap: dashboard planning, sidebar layout, stat cards grid, data table, activity feed, and full assembly using the Week 3 UI kit. Preview: Week 4 introduces `useEffect` and real API data — this static dashboard's hardcoded arrays will soon be replaced with live data from a server.
**Instructor notes:** Explicitly flag: "everything today is hardcoded data — next week, we make it real." Sets up Week 4 naturally.

---

## 5. Practical Exercises During Class

1. **Layout build-along:** Every student builds the sidebar + topbar shell with the instructor.
2. **Stats grid drill:** Students add a 4th stat card with their own icon/title/value.
3. **Empty-state check:** Students temporarily empty their `orders` and `activity` arrays and confirm graceful empty states render (adding one to `RecentTable` if missing).

---

## 6. Homework Assignment

Complete and polish the **Admin Dashboard** (Section 7):

- Full layout: sidebar, topbar, stats grid, data table, activity feed
- All built from the Week 3 UI kit (`Button`, `Card`, `Badge`) plus new layout components
- Responsive at mobile and desktop widths (sidebar may hide on mobile, per Slide 4's pattern — optionally add a hamburger toggle as a stretch goal, recapping Frontend Foundations Lesson 3's JS toggle)
- Empty states handled for both the table and activity feed
- Clean, organized component structure

---

## 7. Mini Project — Admin Dashboard (Final)

**Brief:** "Build a realistic admin dashboard interface — the kind of project that becomes a strong portfolio piece."

**Requirements:**
- Sidebar navigation (responsive, hidden or toggleable on mobile)
- Topbar with page title and a primary action button
- Responsive stats grid (3+ stat cards)
- Data table with at least 3 rows and a status badge column
- Activity feed with empty-state handling
- Fully composed from reusable components (`Button`, `Card`, `Badge`, `StatCard`)

**Stretch goal:** Add a mobile hamburger toggle for the sidebar, using `useState` + conditional classes (recap Week 1, Day 3 + Week 3, Day 1).

---

## 8. Common Beginner Mistakes

- Hardcoding dashboard data directly inside JSX instead of a separate array mapped over — makes future API integration (Week 4) harder to retrofit.
- Forgetting `key` on table rows or activity list items.
- Inconsistent spacing between dashboard sections, undermining the "polished" feel despite correct individual components.
- Not testing the sidebar/layout at mobile width until the very end, discovering major layout breakage late.
- Overcomplicating the table with unnecessary custom styling instead of reusing the existing `Badge`/`Card` components consistently.

---

## 9. Extra Resources

- [Tailwind CSS — Grid Docs](https://tailwindcss.com/docs/grid-template-columns)
- [MDN — HTML Table Basics](https://developer.mozilla.org/en-US/docs/Learn/HTML/Tables/Basics)
- [React — Thinking in React (component tree planning)](https://react.dev/learn/thinking-in-react)
