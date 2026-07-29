
# Week 5, Day 2 — Nested Routes

**Khodz Academy — React Development Bootcamp**
**Session:** 14 of 24 | **Duration:** ~1.5–2 hours

---

## 1. Lesson Objectives

By the end of this lesson, students will be able to:

1. Explain what nested routes are and when to use them.
2. Build a shared layout component using `<Outlet>`.
3. Structure routes with parent/child relationships.
4. Build nested navigation (e.g., a dashboard with sub-sections).
5. Apply nested routing to the Multi-page Website project.

---

## 2. Skills Students Will Learn

- The concept of layout routes (a persistent shell wrapping changing content)
- `<Outlet>` — where child route content renders inside a parent layout
- Defining nested `<Route>` structures
- Relative vs absolute paths in nested routes
- Building a layout with a persistent navbar/sidebar that doesn't re-render on navigation

---

## 3. Detailed Teaching Outline (~1.5–2 hrs)

| Time | Segment |
|---|---|
| 0:00–0:10 | Recap Day 1 + show and tell |
| 0:10–0:25 | The problem with repeating layout per page (Slides 1–2) |
| 0:25–0:45 | Introducing Outlet and layout routes (Slides 3–5) — live coding |
| 0:45–1:05 | Nested route structures (Slides 6–8) — live coding |
| 1:05–1:20 | Building a nested dashboard example (Slides 9–10) — live coding |
| 1:20–1:30 | Recap, common mistakes, Q&A (Slide 11) |

---

## 4. Slide-by-Slide Presentation Content

### Slide 1 — The Problem: Repeating the Navbar Everywhere
**Explanation:** Yesterday's approach rendered `<Navbar />` once above `<Routes>`, which already avoids repetition for a flat site — but for more complex apps (a dashboard with sub-sections, a settings area with tabs), we need *nested* shared layout, not just one global layout.
**Real-world example:** A settings page with tabs (Profile, Security, Notifications) where the tab navigation persists but only the tab content changes — that's a nested route relationship.
**Instructor notes:** If yesterday's single global navbar already technically "solves" simple repetition, clarify today's focus is specifically about *multiple levels* of shared layout, not fixing something broken.

---

### Slide 2 — What Are Nested Routes?
**Explanation:** A nested route is a route rendered *inside* a parent route's layout — the parent defines the persistent shell (e.g., sidebar), and child routes swap out just the inner content.
**Visual suggestion:** Diagram: Parent layout (sidebar + outlet) containing swappable child content in the outlet area.
**Instructor notes:** This diagram is the single most important visual of the day — refer back to it throughout the lesson.

---

### Slide 3 — Introducing Outlet
**Explanation:** `<Outlet />` is a placeholder inside a layout component that tells React Router "render the matched child route here."
**Code example:**
```jsx
// src/layouts/DashboardLayout.jsx
import { Outlet } from "react-router-dom";

function DashboardLayout() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;
```
**Instructor notes:** Recap the `Sidebar` component from Week 3, Day 3's Admin Dashboard project — "this is the exact same sidebar pattern, now made permanent across multiple routed pages instead of one static page."

---

### Slide 4 — Defining a Parent Route with Nested Children
**Code example:**
```jsx
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/dashboard" element={<DashboardLayout />}>
    <Route index element={<DashboardHome />} />
    <Route path="orders" element={<Orders />} />
    <Route path="customers" element={<Customers />} />
  </Route>
</Routes>
```
**Instructor notes:** Explain `index` explicitly — the default child route shown at exactly `/dashboard` with no further path segment, distinct from named child routes like `/dashboard/orders`.

---

### Slide 5 — How the URL Maps to Nested Routes
**Explanation:** `/dashboard` → `DashboardLayout` + `DashboardHome` (index). `/dashboard/orders` → `DashboardLayout` + `Orders`. The layout persists; only the `<Outlet />` content changes.
**Visual suggestion:** URL-to-component mapping table.
**Instructor notes:** Navigate between `/dashboard`, `/dashboard/orders`, `/dashboard/customers` live, pointing out the sidebar never re-renders/flickers — concrete proof of the layout persistence benefit.

---

### Slide 6 — Relative Paths in Nested Routes
**Explanation:** Child route `path` values are relative to their parent (`"orders"` becomes `/dashboard/orders` automatically) — no need to repeat the full path.
**Code example:**
```jsx
// Inside the dashboard's nested routes — no need to write "/dashboard/orders"
<Route path="orders" element={<Orders />} />
```
**Instructor notes:** Contrast with a common early mistake: writing the full absolute path again (`/dashboard/orders`) inside the nested block — show what breaks if done incorrectly.

---

### Slide 7 — Linking to Nested Routes
**Code example:**
```jsx
function Sidebar() {
  return (
    <aside className="w-64 bg-gray-900 text-white p-6">
      <nav className="flex flex-col gap-3">
        <NavLink to="/dashboard">Overview</NavLink>
        <NavLink to="/dashboard/orders">Orders</NavLink>
        <NavLink to="/dashboard/customers">Customers</NavLink>
      </nav>
    </aside>
  );
}
```
**Instructor notes:** Note `Link`/`NavLink` `to` values here use full paths, unlike the `Route path` values in Slide 6 — a subtle but important distinction worth calling out explicitly to avoid confusion.

---

### Slide 8 — Multiple Levels of Nesting
**Explanation:** Nesting can go deeper than two levels if needed (e.g., `/dashboard/orders/:id` for a specific order's detail page) — dynamic segments like `:id` are covered fully tomorrow (Day 3).
**Instructor notes:** Keep this brief — a forward pointer to tomorrow, not new material to teach in depth today.

---

### Slide 9 — Applying Nesting to the Multi-page Website
**Explanation:** Apply today's pattern to this week's project: a persistent top-level `Navbar` (Day 1's global layout) plus, optionally, a nested "Projects" section with its own sub-navigation (e.g., `/projects`, `/projects/featured`).
**Instructor notes:** Keep the example achievable — not every student's site needs deep nesting; this slide shows *how* to add it if their site concept benefits from it (e.g., a blog with categories, a portfolio with project types).

---

### Slide 10 — Building the Nested Example Together
**Code example:**
```jsx
// Full example: top-level layout + nested dashboard layout combined
<Routes>
  <Route path="/" element={<MainLayout />}>
    <Route index element={<Home />} />
    <Route path="about" element={<About />} />
    <Route path="dashboard" element={<DashboardLayout />}>
      <Route index element={<DashboardHome />} />
      <Route path="orders" element={<Orders />} />
    </Route>
  </Route>
</Routes>
```
**Instructor notes:** This slide shows nesting *two* levels deep (a global `MainLayout` wrapping everything, with `DashboardLayout` nested further inside it) — build it live as the day's capstone, testing each route as it's added.

---

### Slide 11 — Recap and What's Next
**Explanation:** Recap: the problem nested routes solve, `<Outlet>`, parent/child route structures, relative paths, and linking to nested routes. Preview: Day 3 covers dynamic routes — URL segments like `/projects/:id` that render different content based on a variable in the URL, completing the Multi-page Website project.
**Instructor notes:** Tease directly: "today's routes are all fixed, known paths — tomorrow, one route template can represent hundreds of different pages."

---

## 5. Practical Exercises During Class

1. **Outlet drill:** Students build a simple two-route nested layout (parent shell + two child routes) independently before the instructor reveals the solution.
2. **Relative path bug hunt:** Instructor shows a nested route with an incorrectly absolute path; students identify and fix it.
3. **Sidebar nav drill:** Students build nested navigation links using `NavLink` for a 3-tab settings-style layout.

---

## 6. Homework Assignment

- Add at least one nested route section to the Multi-page Website from Day 1 (e.g., a "Projects" layout with an index page and 1–2 sub-pages, or a simple dashboard-style section).
- Ensure the shared layout (navbar/sidebar) does not re-render/flicker when navigating between nested child routes (verify by adding a `console.log` inside the layout component and confirming it only logs once).

---

## 7. Mini Project — Multi-page Website (Part 2: Nested Layout)

**Brief:** "Extend your multi-page site with at least one nested route section, applying shared layout properly."

**Requirements:**
- At least one parent route with 2+ nested child routes
- A shared layout component using `<Outlet>`
- Correct relative path usage for child routes
- Working navigation between nested routes via `NavLink`

*(Dynamic routes completed in Day 3.)*

---

## 8. Common Beginner Mistakes

- Forgetting `<Outlet />` in the layout component, so nested child routes never render anything.
- Writing absolute paths for nested child routes instead of relative ones.
- Forgetting the `index` route, leaving no default content at the parent path.
- Confusing `Route path` values (relative, no leading slash for nested children) with `Link to` values (full path, from root).
- Nesting routes unnecessarily for a simple, flat site — recap the "avoid over-abstraction" mindset from Week 3, Day 2, now applied to route structure.

---

## 9. Extra Resources

- [React Router — Nested Routes](https://reactrouter.com/en/main/start/tutorial#nested-routes)
- [React Router — Outlet Component](https://reactrouter.com/en/main/components/outlet)
