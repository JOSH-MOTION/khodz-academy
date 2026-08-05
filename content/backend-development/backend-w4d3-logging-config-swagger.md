
# Week 4, Day 3 — Logging, Environment Variables, Configuration, API Documentation with Swagger

**Khodz Academy — Backend Development Bootcamp**
**Session:** 12 of 24 | **Duration:** ~1.5–2 hours

---

## 1. Lesson Objectives

By the end of this lesson, students will be able to:

1. Implement structured logging beyond basic `console.log`.
2. Organize environment variables and configuration cleanly.
3. Explain what API documentation is for and why it matters professionally.
4. Set up Swagger/OpenAPI to document an Express API.
5. Build a fully documented API that any other developer could pick up and use.

---

## 2. Skills Students Will Learn

- Why `console.log` alone isn't sufficient for production logging
- Using a logging library (`morgan` for HTTP request logging)
- Organizing configuration into a dedicated `config/` file
- What Swagger/OpenAPI is and how it describes an API
- Installing and configuring `swagger-jsdoc` and `swagger-ui-express`
- Documenting routes with JSDoc-style comments
- Viewing and testing an API through its own generated documentation UI

---

## 3. Detailed Teaching Outline (~1.5–2 hrs)

| Time | Segment |
|---|---|
| 0:00–0:15 | Recap Day 2 + show and tell, celebrate end of Month 1 |
| 0:15–0:30 | Logging beyond console.log (Slides 1–4) — live coding |
| 0:30–0:45 | Organizing environment variables and config (Slides 5–7) — live coding |
| 0:45–1:00 | What is API documentation, and why it matters (Slides 8–9) |
| 1:00–1:25 | Setting up Swagger (Slides 10–13) — live coding |
| 1:25–1:30 | Recap, common mistakes, Q&A (Slide 14) |

---

## 4. Slide-by-Slide Presentation Content

### Slide 1 — Recap: console.log Throughout the Course
**Explanation:** `console.log` has been the default debugging tool since Day 1 — genuinely useful during development, but insufficient for a real, running production application, which needs structured, persistent, filterable logs.
**Instructor notes:** Recap React Bootcamp Week 8, Day 2's "debug print" naming convention lightly — same instinct (logging to understand behavior), now formalized for a server context that runs continuously, unlike a browser tab a developer is actively watching.

---

### Slide 2 — Why Production Logging Is Different
**Explanation:** A running server has no one watching its console in real time — logs need to be structured and often saved somewhere reviewable later, especially for diagnosing issues that happened when no one was looking.
**Real-world example:** If an API goes down at 3 AM, structured logs are often the only way to reconstruct what happened.
**Instructor notes:** Keep this appropriately grounded — full production log aggregation/monitoring tooling is Week 8's topic; today's `morgan` is a meaningful first step, not the whole picture.

---

### Slide 3 — Installing and Using Morgan
**Explanation:** Morgan is HTTP request-logging middleware for Express — recap Week 1, Day 2's custom logging middleware exercise; Morgan is the professional, well-tested version of that same idea.
**Code example:**
```bash
npm install morgan
```
```javascript
const morgan = require("morgan");
app.use(morgan("dev"));
```
**Instructor notes:** Run the server and make a few requests, showing Morgan's automatic, color-coded, per-request log lines — a satisfying upgrade from the manual `console.log` middleware built back in Week 1.

---

### Slide 4 — Morgan Log Formats
**Code example:**
```javascript
app.use(morgan("dev"));      // concise, colored — good for development
app.use(morgan("combined")); // detailed, standard format — closer to production use
```
**Instructor notes:** Keep this brief — the goal is awareness that logging detail level is configurable for different situations (development vs. production), not memorizing every format option.

---

### Slide 5 — Recap: Environment Variables So Far
**Explanation:** Recall `.env` usage since Week 2, Day 1 (`MONGO_URI`) and Week 3, Day 2 (`JWT_SECRET`) — today formalizes managing multiple environment variables cleanly as a project grows.
**Instructor notes:** A brief consolidation slide — nothing new conceptually, just organizing what's already been learned.

---

### Slide 6 — Organizing Config into a Dedicated File
**Code example:**
```javascript
// config/index.js
require("dotenv").config();

module.exports = {
  port: process.env.PORT || 3000,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1h",
};
```
```javascript
// server.js
const config = require("./config");
app.listen(config.port, () => console.log(`Server running on port ${config.port}`));
```
**Instructor notes:** Recap React Bootcamp Week 6, Day 3's `constants.js` file directly — same organizational instinct (centralize scattered values into one clear place), applied here to environment-driven configuration specifically.

---

### Slide 7 — Different Environments: Development vs. Production
**Explanation:** Real applications often behave slightly differently in development vs. production (e.g., more verbose logging locally, stricter security in production) — `process.env.NODE_ENV` is the conventional way to distinguish them.
**Code example:**
```javascript
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
```
**Instructor notes:** Keep this as a light introduction — full environment-specific deployment configuration is expanded in Week 8's deployment lesson.

---

### Slide 8 — What Is API Documentation, and Why Does It Matter?
**Explanation:** API documentation describes every endpoint — what it does, what data it expects, what it returns, what errors are possible — so anyone (a frontend developer, a teammate, a future you) can use the API correctly without reading its source code.
**Real-world example:** Recall Frontend Foundations Lesson 7's use of REST Countries and OMDb's own public documentation — every professional API students have consumed throughout their Khodz Academy journey had documentation exactly like what's being built today.
**Instructor notes:** This callback reframes documentation from "extra work" to "the thing that made every earlier course's API-consuming lessons possible" — a genuinely motivating reframe.

---

### Slide 9 — Documentation as a Professional/Freelance Skill
**Explanation:** For a freelancer (recall Khodz's own freelance/gig-work identity from earlier course planning), well-documented APIs are the difference between a client's development team adopting your work smoothly versus struggling and losing confidence in the delivery.
**Instructor notes:** A direct, personal relevance callback — connects today's lesson to Khodz Academy's own stated freelance/professional framing established across the whole course series.

---

### Slide 10 — What Is Swagger/OpenAPI?
**Explanation:** OpenAPI is a standard specification format for describing REST APIs; Swagger is a set of tools (including an interactive UI) built around that standard — together, they let you document *and* interactively test an API from a single, auto-generated web page.
**Instructor notes:** Show a well-known public API's Swagger UI (many companies publish these) as a preview of today's end result — sets a concrete visual target.

---

### Slide 11 — Installing Swagger Tools
**Code example:**
```bash
npm install swagger-jsdoc swagger-ui-express
```
**Instructor notes:** Explain the division of labor: `swagger-jsdoc` reads specially formatted comments in your code and generates the OpenAPI spec; `swagger-ui-express` serves an interactive documentation page from that spec.

---

### Slide 12 — Setting Up Swagger
**Code example:**
```javascript
// config/swagger.js
const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Khodz Academy Student API",
      version: "1.0.0",
      description: "API documentation for the Student Management system",
    },
  },
  apis: ["./routes/*.js"],  // files containing documentation comments
};

module.exports = swaggerJsdoc(options);
```
```javascript
// server.js
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
```
**Instructor notes:** Run the server and visit `/api-docs` together — even with zero documented routes yet, seeing the Swagger UI shell load successfully is a good checkpoint before adding real content.

---

### Slide 13 — Documenting a Route
**Code example:**
```javascript
/**
 * @swagger
 * /api/students:
 *   get:
 *     summary: Get all students
 *     responses:
 *       200:
 *         description: A list of students
 */
router.get("/", protect, getAllStudents);
```
**Instructor notes:** Build this incrementally — document one route fully, refresh `/api-docs`, and confirm it appears correctly before documenting the rest. Point out this comment-based approach means documentation lives right next to the code it describes, making it far more likely to stay up to date than a separate document.

---

### Slide 14 — Recap and What's Next
**Explanation:** Recap: production-appropriate logging with Morgan, organized environment configuration, and a fully documented, interactively testable API via Swagger. This completes Month 1: Backend Foundations. Preview: Month 2 begins with real-world features — file uploads (Week 5), email (Week 6), advanced security/performance (Week 7), and deployment/capstone (Week 8).
**Instructor notes:** Take a genuine moment to celebrate completing Month 1 — recap the full arc: Express basics → MongoDB/Mongoose → real authentication → production-grade error handling, validation, and documentation. This is already a legitimate, portfolio-worthy backend skill set.

---

## 5. Practical Exercises During Class

1. **Morgan drill:** Students add Morgan to an existing project and observe request logs while testing endpoints in Postman.
2. **Config drill:** Students refactor scattered `process.env` references into a centralized `config/index.js` file.
3. **Swagger drill:** Students document 2 routes from an earlier project and confirm they render and are testable in the `/api-docs` UI.

---

## 6. Homework Assignment

- Add Morgan logging to the School Management API (or any prior project).
- Fully document at least 5 routes from that project using Swagger/JSDoc comments, covering different HTTP methods.
- Test at least one documented route directly from the Swagger UI's "Try it out" feature, confirming it behaves identically to testing in Postman.

---

## 7. Mini Project — Documented API

**Brief:** "Add production-appropriate logging and complete, interactive documentation to an existing API."

**Requirements:**
- Morgan logging enabled and visibly working
- Configuration centralized into a `config/` file, no scattered raw `process.env` calls throughout the codebase
- Swagger set up and serving an interactive documentation UI at `/api-docs`
- At least 8 routes fully documented (covering GET, POST, PUT, DELETE)
- Documentation accurately reflects real request/response shapes, verified by testing directly from the Swagger UI

**Stretch goal:** Document authentication requirements in Swagger (marking which routes require a Bearer token), using OpenAPI's `security` definitions.

---

## 8. Common Beginner Mistakes

- Forgetting to restart the server after adding new Swagger JSDoc comments, then being confused why `/api-docs` doesn't reflect changes (this can require a full restart, not just nodemon's auto-reload, depending on setup).
- Malformed YAML-style indentation inside Swagger JSDoc comments, causing silent documentation generation failures.
- Documentation that describes what a route *should* do rather than what it *actually* does — letting docs drift out of sync with real behavior.
- Logging sensitive data (passwords, tokens) via Morgan or `console.log` — a real security concern worth flagging explicitly, connecting back to Week 3's password-handling lessons.
- Scattering `process.env.SOMETHING` calls throughout the codebase instead of consistently importing from the centralized `config/` file.

---

## 9. Extra Resources

- [Morgan — npm Package Docs](https://www.npmjs.com/package/morgan)
- [Swagger/OpenAPI — Official Docs](https://swagger.io/docs/)
- [swagger-jsdoc — npm Package Docs](https://www.npmjs.com/package/swagger-jsdoc)
- [swagger-ui-express — npm Package Docs](https://www.npmjs.com/package/swagger-ui-express)
