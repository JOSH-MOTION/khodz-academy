
# Week 3, Day 2 — JWT Authentication, Protected Routes, Middleware, Authorization

**Khodz Academy — Backend Development Bootcamp**
**Session:** 8 of 24 | **Duration:** ~1.5–2 hours

---

## 1. Lesson Objectives

By the end of this lesson, students will be able to:

1. Explain what a JWT is and how it enables stateless authentication.
2. Issue a JWT upon successful login.
3. Build middleware to verify a JWT and protect routes.
4. Access the authenticated user's data within a protected route.
5. Build a Secure Dashboard API with real, working protected routes.

---

## 2. Skills Students Will Learn

- What a JWT (JSON Web Token) is and its three parts (header, payload, signature)
- Signing a token with `jsonwebtoken`
- Storing a JWT secret securely in `.env`
- Sending the token to the client after login
- Verifying a token via custom auth middleware
- Attaching the authenticated user to `req` for use in protected routes

---

## 3. Detailed Teaching Outline (~1.5–2 hrs)

| Time | Segment |
|---|---|
| 0:00–0:10 | Recap Day 1 + show and tell |
| 0:10–0:25 | What is a JWT? (Slides 1–3) |
| 0:25–0:45 | Issuing a token on login (Slides 4–6) — live coding |
| 0:45–1:10 | Verifying tokens with middleware (Slides 7–10) — live coding |
| 1:10–1:25 | Building the Secure Dashboard API (Slide 11) |
| 1:25–1:30 | Recap, common mistakes, Q&A (Slide 12) |

---

## 4. Slide-by-Slide Presentation Content

### Slide 1 — The Problem: HTTP Is Stateless
**Explanation:** Every HTTP request is independent — a server has no built-in memory of "who you are" between requests. Yesterday's login proved identity for one moment, but the very next request has no idea it happened. JWTs solve this.
**Real-world example:** Recall React Bootcamp Week 7, Day 2's conceptual login flow diagram (submit credentials → server verifies → token issued → frontend stores token → token sent with future requests) — today builds the *real* server side of that exact diagram.
**Instructor notes:** Pull up that diagram again if available — this lesson is its full, working implementation.

---

### Slide 2 — What Is a JWT?
**Explanation:** A JSON Web Token is a compact, self-contained token containing encoded information (like a user's id) and a cryptographic signature proving it hasn't been tampered with. The server issues it; the client stores and resends it with future requests.
**Visual suggestion:** A JWT string broken into its three dot-separated parts: header, payload, signature.
**Instructor notes:** Paste a real JWT into [jwt.io](https://jwt.io) live and show the decoded header/payload — makes the "encoded but not encrypted" nature of JWTs concrete (important nuance covered next).

---

### Slide 3 — JWTs Are Encoded, Not Encrypted
**Explanation:** Anyone can decode a JWT's payload and read it — the signature only proves it hasn't been *tampered with*, not that its contents are secret. Never put sensitive data (like a password) inside a JWT payload.
**Instructor notes:** This is a genuinely important, commonly misunderstood security nuance — spend real time here rather than rushing past it.

---

### Slide 4 — Installing jsonwebtoken
**Code example:**
```bash
npm install jsonwebtoken
```
**Instructor notes:** Frame this the same way as bcrypt yesterday — a well-tested, standard tool; never hand-roll your own token signing.

---

### Slide 5 — Storing the JWT Secret
**Code example:**
```
# .env
JWT_SECRET=a_long_random_string_that_only_the_server_knows
```
**Instructor notes:** Recap Week 2, Day 1's `.env`/`.gitignore` habit directly — this secret is what makes the token's signature verifiable and trustworthy; if it leaks, anyone can forge valid tokens. Suggest generating a genuinely random string rather than something guessable.

---

### Slide 6 — Issuing a Token on Login
**Code example:**
```javascript
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
```
**Instructor notes:** Point out `expiresIn: "1h"` — tokens shouldn't last forever; explain briefly that a shorter expiry limits the damage if a token is ever stolen (full refresh token handling, for keeping users logged in longer without re-entering credentials, is previewed conceptually on Day 3). Test in Postman and copy the returned token into jwt.io to decode it together, connecting directly back to Slide 2.

---

### Slide 7 — How the Client Sends the Token Back
**Explanation:** After login, the client stores the token (recap React Bootcamp Week 7, Day 2's `localStorage`-based mock storage — now storing a real token) and sends it on every subsequent request, conventionally in an `Authorization` header.
**Code example:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
**Instructor notes:** Show how to manually add this header in Postman for testing — students will do this constantly for the rest of the course when testing protected routes.

---

### Slide 8 — Building Authentication Middleware
**Explanation:** Recap Week 1, Day 2's middleware concept — build custom middleware that extracts and verifies the token before allowing a protected route's handler to run.
**Code example:**
```javascript
// middleware/auth.js
const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // attach the decoded payload to req
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

module.exports = protect;
```
**Instructor notes:** Walk through this line by line — extracting the header, splitting off the actual token string, verifying it, and attaching `req.user` for downstream handlers to use. Trigger both failure cases live: missing header, and a deliberately tampered/invalid token.

---

### Slide 9 — Applying the Middleware to a Route
**Code example:**
```javascript
const protect = require("../middleware/auth");

router.get("/dashboard", protect, (req, res) => {
  res.json({ message: `Welcome, ${req.user.email}!` });
});
```
**Instructor notes:** Recap Week 1, Day 2's "stacked middleware" pattern directly — `protect` runs first; only if it calls `next()` does the actual route handler run. Test with and without a valid token in Postman to see both outcomes.

---

### Slide 10 — Using req.user in Controllers
**Explanation:** Once `protect` middleware has run, `req.user` is available in any downstream controller — commonly used to fetch or filter data specific to the logged-in user.
**Code example:**
```javascript
const getMyProfile = async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
};
```
**Instructor notes:** Introduce `.select("-password")` here — a Mongoose shorthand for excluding a field from the returned result, a cleaner alternative to manually reconstructing a response object every time, directly reinforcing yesterday's "never send the password back" principle.

---

### Slide 11 — Building the Secure Dashboard API
**Explanation:** Combine today's full toolkit into a Secure Dashboard API: login issues a token, and a protected `/dashboard` route only responds to requests carrying a valid one.
**Code example:**
```javascript
// routes/dashboard.js
const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");

router.get("/", protect, (req, res) => {
  res.json({
    message: `Welcome to your dashboard, ${req.user.email}!`,
    userId: req.user.id,
  });
});

module.exports = router;
```
**Instructor notes:** Build and test the full flow end to end: register → login (get token) → request `/dashboard` without a token (401) → request again with the token (200, personalized response) — this end-to-end test is today's ultimate checkpoint.

---

### Slide 12 — Recap and What's Next
**Explanation:** Recap: what JWTs are, issuing tokens on login, building and applying authentication middleware, and a working Secure Dashboard API. Preview: Day 3 builds on this with role-based access control — distinguishing admins from regular users — and introduces refresh tokens conceptually, completing Week 3's authentication arc with a School Management API.
**Instructor notes:** Point out explicitly: "you now have real, working authentication — this is the exact system that will eventually replace the mock `AuthContext` in any React frontend you connect to this API."

---

## 5. Practical Exercises During Class

1. **jwt.io drill:** Students decode a real token they generated and identify its header, payload, and signature.
2. **Middleware build-along:** Every student builds the `protect` middleware with the instructor.
3. **End-to-end test drill:** Students perform the full register → login → protected route flow in Postman independently.

---

## 6. Homework Assignment

- Finish and fully test the Secure Dashboard API in Postman, including both success and failure cases for the protected route.
- Add a second protected route (e.g., `GET /api/auth/me`) that returns the logged-in user's own profile using `req.user` and `.select("-password")`.
- Save all test cases (valid token, missing token, invalid token, expired token if time allows) to your Postman collection.

---

## 7. Mini Project — Secure Dashboard API

**Brief:** "Build a real, token-protected API — the first genuinely secure system in the course."

**Requirements:**
- Login issues a JWT with a reasonable expiry time
- `protect` middleware correctly verifies tokens and attaches `req.user`
- At least one protected route that fails without a valid token (401) and succeeds with one
- A `/me`-style route returning the logged-in user's own data, password excluded
- Fully tested in Postman with both valid and invalid/missing token cases

**Stretch goal:** Add a `GET /api/auth/verify` route that simply confirms whether a submitted token is currently valid — useful for a frontend to check login status without hitting a data-heavy endpoint.

---

## 8. Common Beginner Mistakes

- Forgetting the `"Bearer "` prefix when sending the `Authorization` header in Postman, causing the middleware's `startsWith` check to fail.
- Forgetting `next()` in the `protect` middleware after successful verification, causing requests to hang (recap Week 1, Day 2's middleware contract).
- Storing sensitive data (like a password or full user object) inside the JWT payload instead of just an id/email.
- Using a weak, guessable, or hardcoded (non-`.env`) JWT secret.
- Not handling `jwt.verify()`'s thrown error with `try`/`catch`, causing the server to crash on an invalid token instead of returning a clean 401.
- Confusing "the user is authenticated" (has a valid token) with "the user is authorized" for a specific action — a distinction fully addressed in Day 3's RBAC lesson.

---

## 9. Extra Resources

- [jsonwebtoken — npm Package Docs](https://www.npmjs.com/package/jsonwebtoken)
- [jwt.io — Token Debugger](https://jwt.io/)
- [OWASP — JWT Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html)
