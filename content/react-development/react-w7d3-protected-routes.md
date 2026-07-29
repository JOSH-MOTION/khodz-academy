
# Week 7, Day 3 — Protected Routes

**Khodz Academy — React Development Bootcamp**
**Session:** 21 of 24 | **Duration:** ~1.5–2 hours

---

## 1. Lesson Objectives

By the end of this lesson, students will be able to:

1. Build a `ProtectedRoute` wrapper component that restricts access based on auth state.
2. Redirect unauthenticated users to the login page.
3. Redirect already-authenticated users away from the login page.
4. Preserve the originally requested page and redirect back after login.
5. Complete the Student Management App with full access control.

---

## 2. Skills Students Will Learn

- Building a reusable `ProtectedRoute` component using `useAuth` (Week 7, Day 2) and `<Outlet>`/`<Navigate>` (Week 5)
- The `<Navigate>` component for declarative redirects
- Combining protected routes with nested routes (recap Week 5, Day 2)
- Redirecting logged-in users away from `/login`
- Preserving and returning to the originally intended destination after login (`location.state`)

---

## 3. Detailed Teaching Outline (~1.5–2 hrs)

| Time | Segment |
|---|---|
| 0:00–0:10 | Recap Day 2 + show and tell |
| 0:10–0:20 | Why route protection matters (Slides 1–2) |
| 0:20–0:45 | Building ProtectedRoute (Slides 3–6) — live coding |
| 0:45–1:05 | Redirecting logged-in users from /login (Slides 7–8) — live coding |
| 1:05–1:20 | Returning to the intended page after login (Slides 9–10) — live coding |
| 1:20–1:30 | Recap, common mistakes, Q&A (Slide 11) |

---

## 4. Slide-by-Slide Presentation Content

### Slide 1 — Recap: The Gap from Yesterday
**Explanation:** Yesterday built login/logout and auth state — but any URL (like `/dashboard`) is still reachable by typing it directly, logged in or not. Today closes that gap.
**Instructor notes:** Demonstrate the gap live: log out, then manually navigate to `/dashboard` via the URL bar — show it still renders, which shouldn't be allowed.

---

### Slide 2 — What Is a Protected Route?
**Explanation:** A protected route checks authentication state before rendering its content — if the user isn't logged in, it redirects them elsewhere (typically to `/login`) instead of showing the protected page.
**Real-world example:** Directly connects to the paywall access-control discussion from earlier in this course's planning conversation — "if the app sees the student hasn't paid/logged in, they can't reach the protected class content." Same underlying pattern, generalized.
**Instructor notes:** This is a great moment to reference that this exact mechanism (auth check → conditional access) is the backbone of how Khodz Academy's own paywalled content will eventually work.

---

### Slide 3 — Introducing the Navigate Component
**Explanation:** `<Navigate to="/login" />` is React Router's declarative way to redirect — rendering it causes an immediate redirect, similar to calling `useNavigate()` but usable directly inside JSX/conditional rendering.
**Code example:**
```jsx
import { Navigate } from "react-router-dom";

if (!user) {
  return <Navigate to="/login" />;
}
```
**Instructor notes:** Contrast with Week 5's `useNavigate()` (imperative, called in response to an event) vs. `<Navigate>` (declarative, rendered as part of JSX output) — both achieve redirection, different contexts.

---

### Slide 4 — Building the ProtectedRoute Component
**Code example:**
```jsx
// src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

function ProtectedRoute() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
```
**Instructor notes:** Point out this combines Week 5's `<Outlet>` (layout routes) with Week 7's `useAuth` and today's `<Navigate>` — a genuine synthesis of two full weeks of material into one small, powerful component.

---

### Slide 5 — Using ProtectedRoute in the Route Tree
**Code example:**
```jsx
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/login" element={<Login />} />

  <Route element={<ProtectedRoute />}>
    <Route path="/dashboard" element={<DashboardLayout />}>
      <Route index element={<DashboardHome />} />
      <Route path="students" element={<StudentList />} />
    </Route>
  </Route>
</Routes>
```
**Instructor notes:** Point out `ProtectedRoute` itself has no `path` — it's a wrapping layout route (recap Week 5, Day 2's nested route pattern), gating everything nested inside it, not just one page.

---

### Slide 6 — Testing the Protection
**Explanation:** Log out, attempt to visit `/dashboard` directly via URL — confirm it now redirects to `/login`. Log back in, confirm access is restored.
**Instructor notes:** This live test is the emotional payoff of the whole week — let it land, and have every student verify it independently on their own project.

---

### Slide 7 — The Reverse Problem: Blocking Login When Already Logged In
**Explanation:** A logged-in user visiting `/login` again is a confusing, unnecessary experience — redirect them to `/dashboard` instead.
**Code example:**
```jsx
function Login() {
  const { user, login } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" />;
  }

  // ... rest of the login form
}
```
**Instructor notes:** Point out the structural symmetry with `ProtectedRoute` — same tool (`<Navigate>`), opposite condition, applied directly inside a page component this time instead of a wrapping route.

---

### Slide 8 — Building a PublicOnlyRoute (Optional Generalization)
**Explanation:** For consistency, the Slide 7 pattern can also be extracted into a reusable `PublicOnlyRoute` wrapper, mirroring `ProtectedRoute`'s structure.
**Code example:**
```jsx
function PublicOnlyRoute() {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" />;
  }

  return <Outlet />;
}
```
**Instructor notes:** Present as optional polish — either approach (inline in `Login`, or a reusable wrapper) is valid; the choice depends on how many "public only" pages the app has.

---

### Slide 9 — Preserving the Intended Destination
**Explanation:** A better experience: if a user tries to visit `/dashboard/students` while logged out, redirect to login, then send them back to `/dashboard/students` specifically after logging in — not just a generic `/dashboard`.
**Code example:**
```jsx
import { useLocation } from "react-router-dom";

function ProtectedRoute() {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return <Outlet />;
}
```
**Instructor notes:** Introduce `useLocation` here briefly — a hook that returns info about the current URL, used here to remember where the user was headed.

---

### Slide 10 — Redirecting Back After Login
**Code example:**
```jsx
function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = (e) => {
    e.preventDefault();
    login({ email, password });
    navigate(from, { replace: true });
  };

  // ... rest of the form
}
```
**Instructor notes:** Explain `location.state?.from?.pathname || "/dashboard"` slowly — optional chaining (`?.`) recap, combined with a sensible fallback default. Point out `{ replace: true }` — prevents the login page from lingering in browser history after a successful redirect.

---

### Slide 11 — Recap and What's Next
**Explanation:** Recap: `ProtectedRoute`, `<Navigate>`, redirecting logged-in users away from `/login`, and preserving/returning to the intended destination. This completes the Student Management App and Week 7's full CRUD + auth arc. Preview: Week 8 is entirely dedicated to the Final Capstone project — planning, building, debugging, and deploying a complete application that showcases everything learned across the entire course.
**Instructor notes:** Take a moment to recap the full Week 7 arc (CRUD → auth concepts → protected routes) as a complete, realistic application pattern — genuinely comparable to real internal admin tools built at companies.

---

## 5. Practical Exercises During Class

1. **ProtectedRoute build-along:** Every student builds `ProtectedRoute` and applies it to their dashboard routes with the instructor.
2. **Redirect test drill:** Students log out, attempt direct URL access to a protected page, and confirm the redirect works.
3. **Preserve-destination drill:** Students implement the Slide 9–10 pattern and verify they land back on the originally requested page after logging in.

---

## 6. Homework Assignment

Complete the **Student Management App** (Section 7) fully:

- All CRUD functionality from Day 1
- Mock authentication (login/logout) from Day 2
- `ProtectedRoute` restricting dashboard/student-management pages to logged-in users
- Logged-in users redirected away from `/login`
- Intended destination preserved and restored after login

---

## 7. Mini Project — Student Management App (Final)

**Brief:** "Complete a full-featured student management application: authenticated access, full CRUD, and clean, professional organization."

**Requirements:**
- Full CRUD on student records (Create, Read, Update, Delete)
- Mock login/logout flow with persisted session
- Protected dashboard/management routes (redirect to `/login` if not authenticated)
- Logged-in users redirected away from `/login`
- Preserved intended destination after login
- Fully organized per Week 6's standard folder structure
- Styled with the Week 3 UI kit throughout

**Stretch goal:** Add a simple role field (`"admin" | "teacher"`) to the mock user and conditionally hide the Delete button for non-admin roles — a light introduction to authorization on top of authentication.

---

## 8. Common Beginner Mistakes

- Forgetting `<Outlet />` inside `ProtectedRoute`, so protected child routes never render even when authenticated.
- Checking auth state incorrectly (e.g., checking `user !== undefined` instead of `!user`, given `user` starts as `null`).
- Not testing the logged-out state directly (only ever testing while already logged in during development, missing the redirect bug entirely).
- Forgetting `{ replace: true }` on the post-login navigate, cluttering browser history with the login page.
- Applying `ProtectedRoute` inconsistently — protecting the dashboard's index route but forgetting to protect its nested child routes.

---

## 9. Extra Resources

- [React Router — Navigate Component](https://reactrouter.com/en/main/components/navigate)
- [React Router — Authentication Example (protected routes pattern)](https://reactrouter.com/en/main/start/examples)
- [React Router — useLocation](https://reactrouter.com/en/main/hooks/use-location)
