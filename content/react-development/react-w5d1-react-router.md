
# Week 5, Day 1 — React Router

**Khodz Academy — React Development Bootcamp**
**Session:** 13 of 24 | **Duration:** ~1.5–2 hours

---

## 1. Lesson Objectives

By the end of this lesson, students will be able to:

1. Explain what client-side routing is and how it differs from traditional multi-page sites.
2. Install and configure React Router in a Vite project.
3. Define routes and render different pages based on the URL.
4. Navigate between pages using `Link` instead of `<a>`.
5. Build a working multi-page shell with a shared navbar.

---

## 2. Skills Students Will Learn

- Single Page Application (SPA) routing concept
- Installing `react-router-dom`
- `<BrowserRouter>`, `<Routes>`, `<Route>` setup
- Defining page components and mapping them to paths
- `<Link>` vs `<a>` — why `<a>` causes a full page reload in an SPA
- `useNavigate` for programmatic navigation
- A shared layout (navbar) that persists across routes

---

## 3. Detailed Teaching Outline (~1.5–2 hrs)

| Time | Segment |
|---|---|
| 0:00–0:10 | Welcome to Month 2, recap Movie Search App, show and tell |
| 0:10–0:25 | What is client-side routing? (Slides 1–3) |
| 0:25–0:40 | Installing and setting up React Router (Slides 4–5) — hands-on |
| 0:40–1:00 | Defining routes and pages (Slides 6–8) — live coding |
| 1:00–1:20 | Navigation with Link and useNavigate (Slides 9–11) — live coding |
| 1:20–1:30 | Recap, common mistakes, Q&A (Slide 12) |

---

## 4. Slide-by-Slide Presentation Content

### Slide 1 — Welcome to Month 2: Intermediate React
**Explanation:** Recap Month 1's arc (components → state → lists/forms → styling → effects/APIs) and preview Month 2: routing, shared state (Context), custom hooks, CRUD, authentication concepts — moving from "apps" to "real multi-page applications."
**Visual suggestion:** Updated roadmap graphic highlighting Weeks 5–8.
**Instructor notes:** Frame Month 2 as where React apps start to feel like real products students could show a client or employer, not just class exercises.

---

### Slide 2 — Recap: Multi-Page Sites in Frontend Foundations
**Explanation:** Recall Frontend Foundations: multiple `.html` files (`index.html`, `contact.html`) linked via `<a href="">`, each a full page reload from the server. React apps are typically **Single Page Applications (SPAs)** — one HTML file, and JavaScript swaps out content based on the URL without a full reload.
**Visual suggestion:** Side-by-side diagram: traditional multi-page site (full reload each click) vs. SPA (instant content swap, URL still changes).
**Instructor notes:** This contrast is the core concept of the day — spend real time here before touching code.

---

### Slide 3 — Why Client-Side Routing?
**Explanation:** Benefits: faster navigation (no full page reload), smoother transitions, shared state persists across "pages" (e.g., a shopping cart doesn't reset), while still keeping shareable, bookmarkable URLs.
**Real-world example:** Navigating a Gmail or Twitter/X — the page never fully reloads when you click between views, but the URL still changes and back/forward buttons still work.
**Instructor notes:** Have students open DevTools Network tab on a real SPA and click around, showing no full document reloads — concrete proof.

---

### Slide 4 — Installing React Router
**Code example:**
```bash
npm install react-router-dom
```
**Instructor notes:** Quick, low-friction install — confirm it completes for every student before moving on.

---

### Slide 5 — Setting Up the Router
**Code example:**
```jsx
// src/main.jsx
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
```
**Instructor notes:** Explain `BrowserRouter` as the "provider" that makes routing capabilities available to every component inside it — students will recognize this "wrap the whole app" pattern again in Week 6 with Context.

---

### Slide 6 — Defining Routes
**Code example:**
```jsx
// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
  );
}
```
**Instructor notes:** Build this live: create three simple page components first (just a heading each), then wire up the routes — test each URL manually by typing it into the address bar.

---

### Slide 7 — Organizing Pages vs Components
**Explanation:** Introduce a `src/pages/` folder for route-level components, separate from `src/components/` for reusable pieces — a convention that scales well as apps grow.
**Code example:**
```
src/
├── pages/
│   ├── Home.jsx
│   ├── About.jsx
│   └── Contact.jsx
├── components/
│   └── ui/
├── App.jsx
```
**Instructor notes:** Connect to Week 3, Day 2's `components/ui/` convention — "pages" is simply another organizational category, following the same logic.

---

### Slide 8 — The 404 / Catch-All Route
**Explanation:** A `path="*"` route catches any URL that doesn't match a defined route — used to show a friendly "Page Not Found" message.
**Code example:**
```jsx
<Route path="*" element={<NotFound />} />
```
```jsx
function NotFound() {
  return <p className="text-center mt-10">404 — Page not found.</p>;
}
```
**Instructor notes:** Test this live by navigating to a nonsense URL — a small addition with a disproportionately professional payoff.

---

### Slide 9 — Navigating with Link
**Explanation:** Use `<Link to="/path">` instead of `<a href="/path">` for internal navigation — `Link` prevents the default full-page reload and uses React Router's client-side navigation instead.
**Code example:**
```jsx
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="flex gap-6 p-4 bg-white shadow">
      <Link to="/" className="hover:text-blue-600">Home</Link>
      <Link to="/about" className="hover:text-blue-600">About</Link>
      <Link to="/contact" className="hover:text-blue-600">Contact</Link>
    </nav>
  );
}
```
**Instructor notes:** Deliberately use a plain `<a href="/about">` first to show the full white-flash reload, then swap to `<Link>` to show the instant, flash-free transition — a very convincing side-by-side demo.

---

### Slide 10 — Highlighting the Active Link
**Explanation:** `<NavLink>` (a variant of `Link`) automatically applies an `active` class or lets you style based on active state — useful for showing which page the user is currently on.
**Code example:**
```jsx
import { NavLink } from "react-router-dom";

<NavLink
  to="/about"
  className={({ isActive }) => (isActive ? "text-blue-600 font-bold" : "text-gray-600")}
>
  About
</NavLink>
```
**Instructor notes:** Point out the function-as-prop pattern here (`className={({isActive}) => ...}`) — a slightly advanced but common React Router pattern; keep the explanation practical rather than theoretical.

---

### Slide 11 — Programmatic Navigation with useNavigate
**Explanation:** Sometimes navigation needs to happen in response to code, not a click — e.g., redirecting after a form submits successfully. `useNavigate` returns a function to navigate programmatically.
**Code example:**
```jsx
import { useNavigate } from "react-router-dom";

function ContactForm() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // ... submit logic here
    navigate("/thank-you");
  };

  return <form onSubmit={handleSubmit}>{/* fields */}</form>;
}
```
**Instructor notes:** Connect to Frontend Foundations' registration success-state idea (Lesson 4) — "this is how a real app would redirect after successful signup, instead of just showing a static success message on the same page."

---

### Slide 12 — Recap and What's Next
**Explanation:** Recap: SPA routing concept, `BrowserRouter`/`Routes`/`Route` setup, page organization, 404 handling, `Link`/`NavLink`, and `useNavigate`. Preview: Day 2 covers nested routes — building shared layouts (like a persistent navbar/sidebar) that wrap multiple child routes, heading toward this week's Multi-page Website project.
**Instructor notes:** Tell students explicitly: "today, every page is separate — tomorrow, we share layout *between* pages without repeating code."

---

## 5. Practical Exercises During Class

1. **Setup checkpoint:** Every student installs React Router and gets a 3-page app (Home/About/Contact) running with working navigation.
2. **Link vs anchor drill:** Students deliberately swap `Link` for `<a>` and observe/explain the difference.
3. **404 drill:** Students add a catch-all route and confirm it renders for an invalid URL.

---

## 6. Homework Assignment

- Build a 4-page site (Home, About, Projects, Contact) using React Router, each a simple styled page with a heading and short paragraph (Tailwind-styled).
- Add a shared `Navbar` component using `NavLink` with active-state styling, rendered above the `<Routes>`.
- Add a 404 catch-all route with a friendly message and a `Link` back to Home.

---

## 7. Mini Project — Multi-page Website (Part 1: Basic Routing)

**Brief:** "Start building a multi-page personal or business website using real client-side routing — no more single-file apps."

**Requirements:**
- At least 4 distinct routes/pages
- Shared navbar with active-link styling (`NavLink`)
- 404 page for unmatched routes
- Pages organized under `src/pages/`
- Styled consistently with Tailwind (reuse the Week 3 UI kit where relevant)

*(Shared layouts and nested/dynamic routes are added in Days 2–3.)*

---

## 8. Common Beginner Mistakes

- Using `<a href="">` instead of `<Link to="">`, causing full page reloads and losing SPA benefits.
- Forgetting to wrap the app in `<BrowserRouter>` in `main.jsx`, causing routing errors.
- Typos in `path`/`to` values that don't match (`/about` vs `/About` — paths are case-sensitive by default).
- Forgetting the catch-all `*` route, leaving no fallback for invalid URLs.
- Confusing `Link`'s `to` prop with `<a>`'s `href` prop (easy muscle-memory slip coming from Frontend Foundations).

---

## 9. Extra Resources

- [React Router — Official Docs](https://reactrouter.com/en/main)
- [React Router — Tutorial](https://reactrouter.com/en/main/start/tutorial)
