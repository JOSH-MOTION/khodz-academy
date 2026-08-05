
# Week 7, Day 3 — API Versioning, Folder Structure, Clean Architecture

**Khodz Academy — Backend Development Bootcamp**
**Session:** 21 of 24 | **Duration:** ~1.5–2 hours

---

## 1. Lesson Objectives

By the end of this lesson, students will be able to:

1. Explain what API versioning is and why it matters.
2. Implement basic URL-based API versioning.
3. Apply a final, scalable folder structure to a complete project.
4. Understand and apply the principle of separation of concerns across a whole backend project.
5. Complete a fully hardened, well-organized Production API.

---

## 2. Skills Students Will Learn

- Why breaking changes to a live API are a real problem
- URL-based versioning (`/api/v1/...`)
- Reviewing and finalizing the MVC folder structure used since Week 1
- Separation of concerns: routes, controllers, models, middleware, validators, utils, config — each with one clear job
- Preparing a project's overall structure for deployment (Week 8)

---

## 3. Detailed Teaching Outline (~1.5–2 hrs)

| Time | Segment |
|---|---|
| 0:00–0:10 | Recap Day 2 + show and tell |
| 0:10–0:25 | Why API versioning matters (Slides 1–3) |
| 0:25–0:40 | Implementing versioning (Slides 4–6) — live coding |
| 0:40–1:05 | Clean architecture review (Slides 7–10) |
| 1:05–1:25 | Assembling the Production API (Slide 11) |
| 1:25–1:30 | Recap, common mistakes, Q&A (Slide 12) |

---

## 4. Slide-by-Slide Presentation Content

### Slide 1 — The Problem: APIs Change Over Time
**Explanation:** As an API evolves, its shape sometimes needs to change — a field gets renamed, a response format improves. But other applications (a live React frontend, a mobile app, another team) may already depend on the *old* shape. Changing it without warning breaks them.
**Real-world example:** Recall every public API used throughout this course (REST Countries, OMDb, JSONPlaceholder) — each had a stable, versioned structure specifically so consuming applications like the ones built in Frontend Foundations and the React Bootcamp wouldn't unexpectedly break.
**Instructor notes:** This callback reframes versioning from an abstract concern into something students already benefited from, without realizing it, throughout the entire course series.

---

### Slide 2 — What Is API Versioning?
**Explanation:** Versioning lets an API support multiple "shapes" simultaneously — old consumers keep using `v1` unchanged while new features/changes are introduced under `v2`, giving everyone time to migrate on their own schedule.
**Instructor notes:** Keep this conceptual explanation crisp — the implementation (Slide 4) is intentionally simple for this course's scope.

---

### Slide 3 — Common Versioning Approaches
**Explanation:** URL-based (`/api/v1/students`, this course's chosen approach — simple and highly visible), header-based (a custom request header specifies the version, less visible but keeps URLs clean), and others. This course uses URL-based versioning for its simplicity and clarity.
**Instructor notes:** Briefly acknowledge alternatives exist without deep-diving into tradeoffs — URL-based versioning is the most beginner-friendly and widely recognizable starting point.

---

### Slide 4 — Restructuring Routes for Versioning
**Code example:**
```javascript
// server.js
app.use("/api/v1/students", studentRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
```
**Instructor notes:** Point out this is a small, almost trivial code change — the real value is the *discipline* it represents (thinking ahead about future compatibility), not complexity of implementation.

---

### Slide 5 — Organizing Versioned Routes in Folders (for Larger Projects)
**Code example:**
```
routes/
├── v1/
│   ├── students.js
│   ├── auth.js
│   └── users.js
```
**Instructor notes:** Present this as an option for genuinely large, multi-version projects — for this course's scope, a flat `routes/` folder with versioned mount paths (Slide 4) is entirely sufficient; don't over-engineer beyond what's needed.

---

### Slide 6 — Updating Swagger Documentation for Versioning
**Code example:**
```javascript
const options = {
  definition: {
    openapi: "3.0.0",
    info: { title: "Khodz Academy API", version: "1.0.0" },
    servers: [{ url: "/api/v1" }],
  },
  apis: ["./routes/*.js"],
};
```
**Instructor notes:** Recap Week 4, Day 3's Swagger setup directly — a small but important update ensuring documentation accurately reflects the now-versioned URL structure.

---

### Slide 7 — Reviewing the Full MVC Structure
**Explanation:** Recall Week 1, Day 2's introduction of MVC and Week 2, Day 2's models — today reviews the *complete* structure as it now stands, after 7 weeks of additions.
**Code example:**
```
project/
├── config/          (Week 4, 5, 6 — db, jwt, cloudinary, mailer, swagger)
├── controllers/      (since Week 1)
├── middleware/       (since Week 1 — auth, authorize, errorHandler, rate limiters)
├── models/           (since Week 2)
├── routes/           (since Week 1)
├── utils/            (since Week 4 — AppError, asyncHandler, sendEmail)
├── validators/        (since Week 4)
├── .env
├── .env.example
├── .gitignore
└── server.js
```
**Instructor notes:** This is a genuinely satisfying "zoom out" moment — walk through each folder and name specifically which week introduced it, showing students the structure wasn't handed to them all at once, but earned incrementally across the entire course.

---

### Slide 8 — Separation of Concerns, Revisited
**Explanation:** Recall Week 1, Day 2's original motivation — recap it now with the benefit of 7 weeks of hindsight: routes wire URLs to controllers; controllers contain request-handling logic; models define data shape and validation; middleware handles cross-cutting concerns (auth, errors, rate limiting); validators check input; utils hold small, reusable helpers; config centralizes environment-dependent setup.
**Instructor notes:** This slide is worth treating as a genuine review/consolidation moment, not just a repeated definition — ask students to explain, in their own words, what would go wrong if (for example) database logic were written directly inside route files.

---

### Slide 9 — server.js as the Entry Point, Not the Logic
**Explanation:** By this point, `server.js` itself should be relatively short — mostly imports, middleware registration, and route mounting — with almost no actual business logic living there directly.
**Code example:**
```javascript
// server.js (final, clean version)
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

const app = express();
connectDB();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/v1/auth", require("./routes/auth"));
app.use("/api/v1/students", require("./routes/students"));
app.use("/api/v1/users", require("./routes/users"));

app.use(errorHandler);

module.exports = app;
```
**Instructor notes:** Point out `module.exports = app` at the bottom, and `app.listen()` moved to a separate small file — a common, professional convention that separates "building the app" from "running the app," useful for testing purposes in more advanced contexts beyond this course.

---

### Slide 10 — A Separate Entry File
**Code example:**
```javascript
// index.js (or bin/server.js)
const app = require("./server");
const config = require("./config");

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
```
**Instructor notes:** Keep this brief — a light, optional refinement worth mentioning as a professional convention, not a hard requirement for the course's remaining work.

---

### Slide 11 — Assembling the Production API
**Explanation:** Bring together every skill from Weeks 1–7 into one, final, cohesive project: versioned routes, complete MVC structure, full authentication system, validated input, robust error handling, secured with Helmet/CORS/rate limiting, optimized with indexing/caching, and fully documented with Swagger.
**Instructor notes:** This is intentionally a review-and-consolidate session, not new feature-building — have students spend remaining class time auditing an existing project (School Management API, Authentication System, or Profile Management API) against this complete checklist, fixing any gaps found.

---

### Slide 12 — Recap and What's Next
**Explanation:** Recap: why versioning matters, URL-based versioning implementation, and a full review of the clean, layered architecture built across the entire course. This completes Week 7 and the Production API. Preview: Week 8 is the final week — real deployment to Render/Railway, debugging and monitoring in production, and the final capstone presentation.
**Instructor notes:** Take a genuine moment here — students now have a complete mental model of a real, production-grade backend architecture, built up deliberately over 7 weeks rather than handed to them all at once. Point out this is exactly the kind of project structure they'll recognize in real companies' codebases.

---

## 5. Practical Exercises During Class

1. **Versioning drill:** Students add `/api/v1/` prefixing to an existing project's routes.
2. **Architecture audit drill:** In pairs, students review each other's project structure against the Slide 7 checklist, identifying any misplaced logic (e.g., a database query written directly in a route file).
3. **server.js cleanup drill:** Students refactor their `server.js` to match Slide 9's clean, logic-light structure.

---

## 6. Homework Assignment

- Apply `/api/v1/` versioning to every route across your most complete project.
- Perform a full architecture audit of that project against Slide 7's checklist, fixing any organizational gaps found.
- Ensure `server.js` contains no direct business logic — only setup, middleware, and route mounting.

---

## 7. Mini Project — Production API (Final, Part 3)

**Brief:** "Complete the fully hardened, well-organized Production API — the synthesis of everything built across Weeks 1–7."

**Requirements:**
- All routes versioned under `/api/v1/`
- Complete, correctly organized folder structure (config, controllers, middleware, models, routes, utils, validators)
- Full authentication system (Weeks 3 and 6) present and working
- Input validation and centralized error handling (Week 4) applied throughout
- Security hardening (Week 7, Day 1) and at least basic performance optimization (Week 7, Day 2) applied
- Swagger documentation reflecting the versioned URL structure
- `server.js` free of direct business logic

---

## 8. Common Beginner Mistakes

- Adding versioning to some routes but not others, creating an inconsistent, confusing API surface.
- Treating today's architecture review as optional since "everything already works" — missing the real value of consolidation and consistency before deployment.
- Leaving leftover business logic or database queries directly inside `server.js` from earlier, less disciplined stages of the project.
- Forgetting to update Swagger's `servers` URL after adding versioning, causing the documentation UI's "Try it out" feature to hit the wrong (unversioned) path.
- Over-engineering the versioned folder structure (Slide 5) for a project that doesn't actually need multiple simultaneous versions yet.

---

## 9. Extra Resources

- [REST API Versioning Strategies (general reference)](https://restfulapi.net/versioning/)
- [Express.js — Application Structure Best Practices (community reference)](https://expressjs.com/en/advanced/best-practice-performance.html)
- [12-Factor App — Config Principles (relevant to this course's config/ and .env conventions)](https://12factor.net/config)
