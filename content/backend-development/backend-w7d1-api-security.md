
# Week 7, Day 1 — API Security: CORS, Rate Limiting, Helmet

**Khodz Academy — Backend Development Bootcamp**
**Session:** 19 of 24 | **Duration:** ~1.5–2 hours

---

## 1. Lesson Objectives

By the end of this lesson, students will be able to:

1. Explain what CORS is and why browsers enforce it.
2. Configure CORS correctly for a real frontend/backend relationship.
3. Implement rate limiting to prevent abuse.
4. Use Helmet to apply security-related HTTP headers.
5. Apply a full security hardening pass to an existing API.

---

## 2. Skills Students Will Learn

- What CORS (Cross-Origin Resource Sharing) is and why it exists
- Configuring the `cors` package for specific allowed origins
- What rate limiting is and why APIs need it
- Using `express-rate-limit`
- What Helmet does and why security headers matter
- Applying a full "hardening pass" to an existing project

---

## 3. Detailed Teaching Outline (~1.5–2 hrs)

| Time | Segment |
|---|---|
| 0:00–0:15 | Welcome to Week 7, recap Week 6, show and tell |
| 0:15–0:35 | What is CORS and why it matters (Slides 1–5) — live coding |
| 0:35–0:55 | Rate limiting (Slides 6–8) — live coding |
| 0:55–1:10 | Helmet (Slides 9–10) — live coding |
| 1:10–1:25 | Full security hardening pass (Slide 11) |
| 1:25–1:30 | Recap, common mistakes, Q&A (Slide 12) |

---

## 4. Slide-by-Slide Presentation Content

### Slide 1 — Welcome to Week 7: Advanced Backend
**Explanation:** With core features complete (Weeks 1–6), Week 7 focuses on hardening: security, performance, and architecture — the qualities that separate a working API from a production-ready one.
**Instructor notes:** Frame this week as "everything works — now let's make sure it works safely, fast, and stays maintainable as it grows."

---

### Slide 2 — The Problem: A Frontend Can't Reach This API Yet
**Explanation:** If students tried connecting a real React frontend (recall the React Bootcamp) to any API built this course so far, running on a different port/origin, the browser would block the request by default — this is CORS, and it's a browser security feature, not a bug.
**Instructor notes:** If possible, demonstrate this live: attempt a `fetch()` from a simple test HTML page (a different origin than the API) and show the browser's CORS error in the console — a concrete, memorable demonstration before any explanation.

---

### Slide 3 — What Is CORS?
**Explanation:** CORS (Cross-Origin Resource Sharing) is a browser security mechanism that blocks a webpage from making requests to a different origin (domain, protocol, or port) than the one it was loaded from, unless the server explicitly allows it.
**Real-world example:** Recall every `fetch()` call from Frontend Foundations Lesson 7 and React Bootcamp — those worked because the public APIs used (REST Countries, OMDb) were already configured to allow requests from any origin. This course's own APIs need the same explicit configuration to work with any frontend.
**Instructor notes:** This is a genuinely satisfying "aha" moment for returning students — it explains *why* those earlier lessons' public APIs "just worked," something that may have gone unexplained at the time.

---

### Slide 4 — Same-Origin vs. Cross-Origin
**Explanation:** Two URLs share an origin only if the protocol, domain, and port all match exactly. `http://localhost:3000` and `http://localhost:5173` (a typical Vite dev server port, recap React Bootcamp Week 1) are considered different origins, despite both being "localhost."
**Instructor notes:** This port-difference nuance often surprises students — call it out explicitly, since it's the exact situation every student will hit when connecting a local frontend to a local backend during development.

---

### Slide 5 — Configuring CORS in Express
**Code example:**
```bash
npm install cors
```
```javascript
const cors = require("cors");

const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
};

app.use(cors(corsOptions));
```
**Instructor notes:** Recap `CLIENT_URL` from Week 6, Day 2's verification link construction — the same environment variable now serves a second, equally important purpose. Point out `credentials: true` allows cookies/auth headers to be sent cross-origin, relevant if a real frontend needs to include the JWT (Week 3) in its requests.

---

### Slide 6 — The Problem: Unlimited Requests
**Explanation:** Without limits, nothing stops a single client (malicious or simply buggy) from sending thousands of requests per second, potentially overwhelming the server or database, or attempting to brute-force a login endpoint (recall Week 3, Day 1's password verification — repeated rapid guesses are a real, common attack).
**Real-world example:** Recall Week 6, Day 3's stretch goal, which flagged rate limiting as a natural protection for the forgot-password endpoint specifically — today generalizes that instinct into a proper, reusable tool.
**Instructor notes:** Ground this in a concrete attack scenario (login brute-forcing) rather than an abstract "too many requests" framing — makes the motivation feel real.

---

### Slide 7 — Installing and Configuring express-rate-limit
**Code example:**
```bash
npm install express-rate-limit
```
```javascript
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,                    // limit each IP to 100 requests per window
  message: { error: "Too many requests, please try again later." },
});

app.use(limiter);
```
**Instructor notes:** Recap Week 4, Day 1's centralized error-handling philosophy — point out the `message` option here follows the same consistent JSON error shape established that week, rather than a plain-text or default HTML response.

---

### Slide 8 — Applying Stricter Limits to Sensitive Routes
**Code example:**
```javascript
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,  // only 5 login/register attempts per 15 minutes
  message: { error: "Too many attempts, please try again later." },
});

router.post("/login", authLimiter, login);
router.post("/register", authLimiter, register);
router.post("/forgot-password", authLimiter, forgotPassword);
```
**Instructor notes:** Recap Week 3, Day 3's "stacked middleware" pattern — a route-specific limiter, applied in addition to the app-wide one from Slide 7, giving especially sensitive routes extra protection. Directly resolves Week 6, Day 3's stretch goal for real this time.

---

### Slide 9 — What Is Helmet?
**Explanation:** Helmet is Express middleware that sets a collection of HTTP response headers known to improve security — protecting against several common, well-documented categories of web vulnerabilities with minimal configuration.
**Code example:**
```bash
npm install helmet
```
```javascript
const helmet = require("helmet");
app.use(helmet());
```
**Instructor notes:** Frame Helmet the same way as every other tool this course — a single line providing meaningful, well-tested protection; don't attempt to hand-configure these headers manually.

---

### Slide 10 — Inspecting the Headers Helmet Adds
**Explanation:** Use Postman or browser DevTools' Network tab to inspect response headers before and after adding Helmet — observe new headers like `X-Content-Type-Options` and `X-Frame-Options` appear automatically.
**Instructor notes:** Recap Frontend Foundations/React Bootcamp's DevTools Network tab usage — same tool, now used to inspect security headers rather than API response bodies.

---

### Slide 11 — Full Security Hardening Pass
**Explanation:** Apply CORS, rate limiting, and Helmet together to an existing project (the School Management API or Profile Management API) — a genuine "hardening pass," the kind of review a professional developer performs before considering an API production-ready.
**Code example:**
```javascript
// server.js
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use(express.json());

// ...routes
```
**Instructor notes:** Point out the order these are applied — security-related middleware generally belongs early in the pipeline, before routes or body parsing, so protections apply to every request uniformly. Build and test incrementally: confirm the API still works correctly for legitimate requests after each addition, not just that the new protection exists.

---

### Slide 12 — Recap and What's Next
**Explanation:** Recap: CORS and why it exists, rate limiting to prevent abuse, Helmet's security headers, and a full hardening pass applied to a real project. Preview: Day 2 covers performance — database indexing and caching concepts — making the API not just secure, but fast at scale.
**Instructor notes:** Frame today's work as "protecting the API from bad actors"; tomorrow shifts to "making the API fast for good actors" — a clean thematic transition.

---

## 5. Practical Exercises During Class

1. **CORS error drill:** Students deliberately misconfigure `origin` and observe the resulting browser CORS error from a test frontend page.
2. **Rate limit drill:** Students hit a rate-limited endpoint repeatedly in Postman (using the "Run" feature or manual rapid clicking) and confirm the 429-style block triggers correctly.
3. **Helmet inspection drill:** Students compare response headers before and after adding Helmet.

---

## 6. Homework Assignment

- Apply CORS, rate limiting, and Helmet to the complete Authentication System with Email project (Week 6).
- Apply a stricter rate limit specifically to the login, register, and forgot-password routes.
- Test that legitimate use (a handful of normal requests) still works correctly after every change.

---

## 7. Mini Project — Security-Hardened API (Part 1)

**Brief:** "Apply a full security hardening pass to an existing project — the first phase of building this week's Production API."

**Requirements:**
- Helmet applied globally
- CORS configured with a specific allowed origin (not wide open to everything)
- App-wide rate limiting applied
- Stricter rate limiting on authentication-related routes specifically
- Confirmed working: legitimate requests still succeed; excessive/rapid requests are correctly blocked

**Stretch goal:** Make the CORS `origin` configurable to support multiple allowed origins (e.g., both a local dev URL and a future deployed frontend URL) using an array or a small allow-list function.

---

## 8. Common Beginner Mistakes

- Setting CORS `origin: "*"` (wide open) out of frustration when debugging, and never tightening it back down — a real security regression worth flagging explicitly.
- Forgetting `credentials: true` when a frontend needs to send authorization headers or cookies cross-origin.
- Setting rate limits so strict that normal, legitimate development testing gets blocked (a common early frustration, worth discussing as a tuning tradeoff, not a bug).
- Applying Helmet or CORS *after* routes are defined instead of before, weakening their effectiveness for early-pipeline concerns.
- Confusing CORS errors (a browser-side block, visible in the browser console) with server-side errors (visible in Postman/server logs) — Postman itself is not subject to CORS, which can cause confusing "it works in Postman but not the browser" situations worth explaining explicitly.

---

## 9. Extra Resources

- [MDN — Cross-Origin Resource Sharing (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [express-rate-limit — npm Package Docs](https://www.npmjs.com/package/express-rate-limit)
- [Helmet.js — Official Docs](https://helmetjs.github.io/)
- [OWASP — REST Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html)
