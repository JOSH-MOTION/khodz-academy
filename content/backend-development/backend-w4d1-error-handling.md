
# Week 4, Day 1 — Error Handling, Custom Error Classes, Async Middleware

**Khodz Academy — Backend Development Bootcamp**
**Session:** 10 of 24 | **Duration:** ~1.5–2 hours

---

## 1. Lesson Objectives

By the end of this lesson, students will be able to:

1. Explain why scattered `try`/`catch` blocks don't scale as an API grows.
2. Build a centralized Express error-handling middleware.
3. Create custom error classes for predictable, meaningful errors.
4. Use an async wrapper to eliminate repetitive `try`/`catch` boilerplate.
5. Refactor an existing API (Week 3's School Management API) to use robust, centralized error handling.

---

## 2. Skills Students Will Learn

- Express's special error-handling middleware signature `(err, req, res, next)`
- Centralizing error responses into one consistent format
- Creating a custom `AppError` class extending JavaScript's built-in `Error`
- Distinguishing operational errors (expected, like "not found") from programming errors (bugs)
- Writing an `asyncHandler` wrapper to avoid repetitive `try`/`catch` in every controller
- Handling common Mongoose-specific errors (validation errors, cast errors, duplicate key errors)

---

## 3. Detailed Teaching Outline (~1.5–2 hrs)

| Time | Segment |
|---|---|
| 0:00–0:15 | Welcome to Month 1's final week, recap School Management API |
| 0:15–0:25 | The problem with scattered try/catch (Slides 1–2) |
| 0:25–0:45 | Express error-handling middleware (Slides 3–6) — live coding |
| 0:45–1:05 | Custom error classes (Slides 7–9) — live coding |
| 1:05–1:20 | The asyncHandler wrapper (Slides 10–11) — live coding |
| 1:20–1:30 | Refactoring to a Robust API (Slide 12) |

---

## 4. Slide-by-Slide Presentation Content

### Slide 1 — Recap: try/catch Everywhere
**Explanation:** Every controller written since Week 2 has wrapped its logic in `try`/`catch`, each with a slightly different error response shape (`{ error: err.message }` in some places, different structures elsewhere) — this inconsistency becomes a real problem as an API grows.
**Instructor notes:** Pull up 2–3 real controller functions from Week 3's School Management API and point out the repeated, slightly inconsistent error-handling boilerplate across them — makes the problem concrete rather than hypothetical.

---

### Slide 2 — Why Centralized Error Handling Matters
**Explanation:** A well-designed API returns errors in one predictable, consistent shape, regardless of which route or what went wrong — this makes the API far easier and more pleasant for any frontend (or fellow developer) to consume reliably.
**Real-world example:** Recall Frontend Foundations Lesson 7's advice to always inspect a real API's error shape before writing render code — today's lesson exists to make that shape predictable in the first place, for whatever frontend eventually consumes this API.
**Instructor notes:** This connects the two "sides" of the API relationship directly — good backend error design makes frontend error handling easier, a genuinely important professional insight.

---

### Slide 3 — Express Error-Handling Middleware
**Explanation:** Express recognizes a middleware function as an error handler specifically because it takes **four** parameters: `(err, req, res, next)`. It must be defined *last*, after all other routes and middleware.
**Code example:**
```javascript
// middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong" });
};

module.exports = errorHandler;
```
**Instructor notes:** Recap Frontend Foundations/React's traceback-reading skill directly — `err.stack` is Node's equivalent of a traceback, and logging it server-side (even while returning a generic message to the client) is the professional standard.

---

### Slide 4 — Registering the Error Handler
**Code example:**
```javascript
// server.js
const errorHandler = require("./middleware/errorHandler");

app.use("/api/students", studentRoutes);
app.use("/api/auth", authRoutes);

app.use(errorHandler);  // must be registered LAST
```
**Instructor notes:** Emphasize "must be last" strongly — recap Week 1, Day 2's "middleware order matters" lesson; this is the most consequential instance of that rule in the whole course.

---

### Slide 5 — Passing Errors to the Error Handler with next(err)
**Explanation:** Calling `next(err)` (with an argument) tells Express to skip all remaining regular middleware/routes and jump straight to the error handler.
**Code example:**
```javascript
const getStudentById = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      const error = new Error("Student not found");
      error.statusCode = 404;
      return next(error);
    }
    res.json(student);
  } catch (err) {
    next(err);
  }
};
```
**Instructor notes:** Point out `next()` without an argument (Week 1, Day 2) means "continue normally," while `next(err)` means "something went wrong, jump to error handling" — same function, different meaning based on whether an argument is passed.

---

### Slide 6 — Using the Custom Status Code in the Error Handler
**Code example:**
```javascript
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.stack);
  res.status(statusCode).json({ error: err.message || "Something went wrong" });
};
```
**Instructor notes:** This single change makes every controller's manually-attached `statusCode` actually take effect — a satisfying moment where the centralized handler starts genuinely replacing scattered, inconsistent `res.status(...)` calls.

---

### Slide 7 — The Problem with Manually Building Errors
**Explanation:** Manually creating `new Error(...)` and attaching `.statusCode` every time (Slide 5) is repetitive and easy to do inconsistently. A custom error class formalizes this pattern.
**Instructor notes:** A brief motivation slide — sets up the "Rule of Three"-style justification (recap React Bootcamp Week 3, Day 2) for extracting a reusable class.

---

### Slide 8 — Building a Custom AppError Class
**Code example:**
```javascript
// utils/AppError.js
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;  // marks this as an expected, "safe" error
  }
}

module.exports = AppError;
```
**Instructor notes:** Explain `extends Error` and `super(message)` — a first, light touch of JavaScript class inheritance; keep the explanation practical ("this gives our custom error class all the normal behavior of a real Error, plus our own extra fields") rather than a deep OOP theory digression.

---

### Slide 9 — Using AppError in Controllers
**Code example:**
```javascript
const AppError = require("../utils/AppError");

const getStudentById = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return next(new AppError("Student not found", 404));
    }
    res.json(student);
  } catch (err) {
    next(err);
  }
};
```
**Instructor notes:** Compare directly against Slide 5's manual version — same result, cleaner, more consistent, and self-documenting at the call site (`new AppError("Student not found", 404)` reads almost like plain English).

---

### Slide 10 — The Problem with Repetitive try/catch
**Explanation:** Every async controller still needs its own `try`/`catch` wrapping — genuinely repetitive boilerplate across dozens of functions. An `asyncHandler` wrapper function eliminates this entirely.
**Instructor notes:** Count, live, how many `try`/`catch` blocks exist across the current project's controllers — makes the repetition viscerally obvious before presenting the fix.

---

### Slide 11 — Building and Using asyncHandler
**Code example:**
```javascript
// utils/asyncHandler.js
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
```
```javascript
// controllers/studentController.js
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");

const getStudentById = asyncHandler(async (req, res, next) => {
  const student = await Student.findById(req.params.id);
  if (!student) {
    return next(new AppError("Student not found", 404));
  }
  res.json(student);
});
```
**Instructor notes:** This is the day's most conceptually dense moment — walk through it carefully: `asyncHandler` takes a controller function and returns a *new* function that automatically catches any rejected Promise and forwards it to `next()`, eliminating the need for manual `try`/`catch` entirely. Emphasize the controller function itself is now dramatically cleaner and easier to read.

---

### Slide 12 — Refactoring to a Robust API
**Explanation:** Apply today's full toolkit — centralized error handler, `AppError`, and `asyncHandler` — to refactor Week 3's School Management API into a genuinely production-grade, robust version.
**Code example:**
```javascript
// controllers/studentController.js (fully refactored)
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
const Student = require("../models/Student");

const getAllStudents = asyncHandler(async (req, res) => {
  const students = await Student.find();
  res.json(students);
});

const createStudent = asyncHandler(async (req, res) => {
  const student = await Student.create(req.body);
  res.status(201).json(student);
});

const getStudentById = asyncHandler(async (req, res, next) => {
  const student = await Student.findById(req.params.id);
  if (!student) return next(new AppError("Student not found", 404));
  res.json(student);
});

module.exports = { getAllStudents, createStudent, getStudentById };
```
**Instructor notes:** Refactor incrementally, one controller function at a time, testing in Postman after each to confirm identical behavior with dramatically less boilerplate — the "small steps, test often" habit applied to a refactor rather than new-feature work, an important professional skill in its own right.

---

## 5. Practical Exercises During Class

1. **Error middleware drill:** Students build the centralized `errorHandler` and register it correctly (last) in their own project.
2. **AppError drill:** Students build the `AppError` class and use it to replace one manually-constructed error in an existing controller.
3. **asyncHandler drill:** Students wrap 2 existing controller functions with `asyncHandler` and confirm identical behavior via Postman, with visibly less code.

---

## 6. Homework Assignment

- Fully refactor the School Management API (Week 3's project) to use the centralized error handler, `AppError`, and `asyncHandler` throughout every controller.
- Add handling for at least one Mongoose-specific error type in the centralized handler (e.g., `CastError` for an invalid MongoDB id format, returning a clean 400 instead of a generic 500).

---

## 7. Mini Project — Robust API

**Brief:** "Refactor an existing API to use centralized, consistent, production-style error handling throughout."

**Requirements:**
- Centralized error-handling middleware registered last in `server.js`
- `AppError` custom class used for all expected/operational errors
- `asyncHandler` wrapping every async controller function, eliminating manual `try`/`catch`
- Consistent error response shape across every endpoint
- At least one Mongoose-specific error (e.g., invalid id format) handled gracefully rather than crashing or returning an unhelpful 500

**Stretch goal:** Add a `notFoundHandler` middleware (registered just before the error handler) that catches requests to undefined routes entirely, returning a clean 404 instead of Express's default HTML error page.

---

## 8. Common Beginner Mistakes

- Registering the error-handling middleware anywhere other than last, causing it to never actually catch errors.
- Forgetting the error handler needs exactly 4 parameters `(err, req, res, next)` — Express distinguishes it from regular middleware by this signature alone.
- Calling `next(err)` but continuing to also call `res.json(...)` afterward in the same function, causing a "headers already sent" error.
- Forgetting `asyncHandler` wraps the controller function itself (`asyncHandler(async (req, res) => {...})`), not calling it separately from the route definition.
- Setting `isOperational` but never actually using it anywhere — flagged as a genuine but appropriately deferred refinement: distinguishing operational errors from true bugs becomes more valuable as logging/monitoring (Week 8) is added.

---

## 9. Extra Resources

- [Express.js — Error Handling Guide](https://expressjs.com/en/guide/error-handling.html)
- [MDN — Error Object and Custom Errors](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
- [Node.js — Error Handling Best Practices (general reference)](https://nodejs.org/en/learn/asynchronous-work/dont-block-the-event-loop)
