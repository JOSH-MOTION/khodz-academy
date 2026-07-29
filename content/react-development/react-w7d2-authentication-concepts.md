
# Week 7, Day 2 — Authentication Concepts

**Khodz Academy — React Development Bootcamp**
**Session:** 20 of 24 | **Duration:** ~1.5–2 hours

---

## 1. Lesson Objectives

By the end of this lesson, students will be able to:

1. Explain what authentication is and how it differs from authorization.
2. Explain the general concept of tokens (e.g., JWTs) at a conceptual level.
3. Build a mock login flow using local state/Context (no real backend yet — that's Module 3).
4. Store and check authentication state across the app using Context (recap Week 6).
5. Prepare the app's authentication foundation for Day 3's protected routes.

---

## 2. Skills Students Will Learn

- Authentication vs. authorization (who you are vs. what you're allowed to do)
- The general login flow: submit credentials → server verifies → token issued → token stored → token sent with future requests
- Building an `AuthContext` with `login`/`logout`/`user` state
- Persisting a mock login session with `localStorage` (recap Week 6, Day 1–2)
- Why real authentication requires a backend (honest scoping note — this course builds the frontend pattern only)

---

## 3. Detailed Teaching Outline (~1.5–2 hrs)

| Time | Segment |
|---|---|
| 0:00–0:10 | Recap Day 1 + show and tell |
| 0:10–0:25 | What is authentication? (Slides 1–3) |
| 0:25–0:40 | How tokens work, conceptually (Slides 4–5) |
| 0:40–1:05 | Building AuthContext (Slides 6–8) — live coding |
| 1:05–1:20 | Building a mock login page (Slides 9–10) — live coding |
| 1:20–1:30 | Recap, common mistakes, Q&A (Slide 11) |

---

## 4. Slide-by-Slide Presentation Content

### Slide 1 — What Is Authentication?
**Explanation:** Authentication answers "who are you?" — the process of verifying a user's identity, typically via a username/password (or similar credential) at login.
**Real-world example:** Logging into any app with an email and password — the app is authenticating you.
**Instructor notes:** Keep definitions crisp and simple — this lesson is conceptual scaffolding for Day 3's hands-on protected routes, not a security engineering deep dive.

---

### Slide 2 — Authentication vs. Authorization
**Explanation:** Authentication = "who are you?" Authorization = "what are you allowed to do?" A logged-in user (authenticated) might still be blocked from an admin-only page (not authorized).
**Real-world example:** A student management app: any logged-in teacher is authenticated, but only an "admin" role might be authorized to delete student records.
**Instructor notes:** This distinction is commonly confused even by working developers — worth a clear, explicit callout with the concrete example repeated.

---

### Slide 3 — Why This Course Builds the Frontend Pattern Only
**Explanation:** Real authentication requires a backend server to securely verify credentials and issue tokens — building a true secure auth system needs Node.js/Express and a database, covered in Module 3: Backend Development. This week teaches the **React-side pattern** (how a frontend tracks and reacts to login state) using a realistic but simplified mock flow.
**Instructor notes:** Be transparent about this scoping — it prevents students from thinking today's mock login is production-secure, while still making today's lesson feel purposeful and forward-looking.

---

### Slide 4 — How Real Login Flows Work (Conceptually)
**Explanation:** Typical flow: (1) user submits email/password, (2) server verifies credentials against a database, (3) server issues a **token** (a signed piece of data proving identity) — commonly a JWT (JSON Web Token), (4) frontend stores the token, (5) frontend sends the token with future requests to prove who's asking.
**Visual suggestion:** Numbered flow diagram matching the five steps.
**Instructor notes:** Reference Week 7 Day 1's `fetch` header pattern — "step 5 is why you'll later see `Authorization: Bearer <token>` headers on real API requests, once a real backend exists."

---

### Slide 5 — Where Tokens Are Stored (Brief Overview)
**Explanation:** Common options: `localStorage` (simple, used in this course's mock flow, has tradeoffs), cookies (often more secure for real production apps), or in-memory state. A full security comparison is beyond this course's scope — the goal is awareness that this choice matters in real apps.
**Instructor notes:** Keep this brief and honest: "we use localStorage today because it's simple and matches tools you already know — just be aware production apps often make more careful choices here."

---

### Slide 6 — Building AuthContext: The Shape
**Explanation:** Design the context's shape before coding: `user` (null if logged out, an object if logged in), `login(credentials)` function, `logout()` function — mirrors the `ThemeContext` design process from Week 6, Day 1.
**Instructor notes:** Explicitly recap Week 6, Day 1's context-building steps (`createContext`, `Provider`, `useContext`) — today applies the exact same recipe to a new domain.

---

### Slide 7 — Building AuthContext
**Code example:**
```jsx
// src/context/AuthContext.jsx
import { createContext, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const login = (credentials) => {
    // Mock: in a real app, this would call a backend and verify credentials
    const mockUser = { name: "Amaka Okoye", email: credentials.email };
    setUser(mockUser);
    localStorage.setItem("user", JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
```
**Instructor notes:** Point out the comment flagging this as a mock — repeat the honesty from Slide 3 directly in the code itself, a good habit for any simplified/placeholder logic.

---

### Slide 8 — Building the useAuth Custom Hook
**Code example:**
```jsx
// src/hooks/useAuth.js
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";

export function useAuth() {
  return useContext(AuthContext);
}
```
**Instructor notes:** Directly recap Week 6, Day 2's `useTheme` — same pattern, immediately reapplied, reinforcing that custom hooks are now a comfortable, repeatable tool rather than a one-off lesson.

---

### Slide 9 — Building the Login Page
**Code example:**
```jsx
// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    login({ email, password });
    navigate("/dashboard");
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-20 flex flex-col gap-4">
      <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <Button type="submit">Log In</Button>
    </form>
  );
}
```
**Instructor notes:** Point out `useNavigate` here — direct recap of Week 5, Day 1's programmatic navigation, now used for its most common real-world purpose: redirecting after login.

---

### Slide 10 — Displaying the Logged-In User
**Code example:**
```jsx
function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="flex justify-between p-4 bg-white shadow">
      <Link to="/">Home</Link>
      {user ? (
        <div className="flex items-center gap-4">
          <span>Welcome, {user.name}</span>
          <Button variant="secondary" onClick={logout}>Log Out</Button>
        </div>
      ) : (
        <Link to="/login">Log In</Link>
      )}
    </nav>
  );
}
```
**Instructor notes:** Recap Week 2, Day 1's ternary pattern for whole-block conditional rendering — a satisfying full-circle callback used in a genuinely realistic, high-value context.

---

### Slide 11 — Recap and What's Next
**Explanation:** Recap: authentication vs. authorization, the conceptual token-based login flow, `AuthContext`, `useAuth`, and a working mock login/logout system reflected in the navbar. Preview: Day 3 uses this authentication state to build protected routes — pages that redirect unauthenticated users away, completing the Student Management App's access control.
**Instructor notes:** Tease directly: "right now, anyone can visit `/dashboard` by typing the URL, logged in or not — tomorrow, we lock that down."

---

## 5. Practical Exercises During Class

1. **AuthContext build-along:** Every student builds `AuthContext`, `AuthProvider`, and `useAuth` with the instructor.
2. **Login page drill:** Students build the mock login form and confirm `user` updates correctly in React DevTools after submission.
3. **Navbar drill:** Students wire up conditional navbar rendering (logged in vs. logged out) using the ternary pattern.

---

## 6. Homework Assignment

- Build a complete mock authentication flow: `AuthContext`, `useAuth`, a login page, and a navbar reflecting login state, integrated into the Student Management App.
- Add a logout button that correctly clears both state and `localStorage`.
- Verify login state persists correctly after a full page reload.

---

## 7. Mini Project — Student Management App (Part 2: Auth Foundation)

**Brief:** "Add a mock authentication layer to your Student Management App, in preparation for protecting sensitive pages tomorrow."

**Requirements:**
- `AuthContext` + `AuthProvider` + `useAuth` hook
- Login page with a controlled form
- Logout functionality
- Navbar reflecting current login state
- Login state persisted via `localStorage`

*(Protected routes added in Day 3.)*

---

## 8. Common Beginner Mistakes

- Believing this mock login flow is secure enough for a real production app (it explicitly is not — reinforce the Slide 3 scoping note).
- Forgetting to persist `user` to `localStorage`, causing login state to reset on every page reload.
- Forgetting to clear `localStorage` on logout, leaving stale user data behind.
- Confusing "the user is logged in" (authentication) with "the user can access this specific page" (authorization) — a mistake that becomes very relevant tomorrow.
- Storing sensitive data (in a real app, ever) directly and insecurely in `localStorage` without understanding the tradeoffs — flag as an awareness point for their future real-auth work in Module 3.

---

## 9. Extra Resources

- [MDN — Authentication vs Authorization](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication)
- [JWT.io — Introduction to JSON Web Tokens](https://jwt.io/introduction)
- [React — Context recap](https://react.dev/learn/passing-data-deeply-with-context)
