
# Week 1, Day 2 — Express.js, Routes, Controllers, Middleware, MVC

**Khodz Academy — Backend Development Bootcamp**
**Session:** 2 of 24 | **Duration:** ~1.5–2 hours

---

## 1. Lesson Objectives

By the end of this lesson, students will be able to:

1. Organize Express routes cleanly using the Router.
2. Separate route definitions from business logic using controllers.
3. Explain what middleware is and how the request pipeline works.
4. Build and use custom middleware.
5. Explain and apply MVC architecture to a backend project.
6. Build a properly structured Student API.

---

## 2. Skills Students Will Learn

- `express.Router()` for organizing routes into separate files
- Controllers: separating logic from route definitions
- Middleware: what it is, `next()`, built-in middleware (`express.json()`)
- Writing custom middleware
- MVC (Model-View-Controller) architecture, adapted for APIs (no "View" — APIs return data, not rendered pages)
- Project folder structure for a scalable Express app

---

## 3. Detailed Teaching Outline (~1.5–2 hrs)

| Time | Segment |
|---|---|
| 0:00–0:10 | Recap Day 1 + show and tell |
| 0:10–0:20 | The problem: everything in one file (Slides 1–2) |
| 0:20–0:40 | Routers and route organization (Slides 3–5) — live coding |
| 0:40–1:00 | Middleware deep dive (Slides 6–9) — live coding |
| 1:00–1:15 | Controllers and MVC (Slides 10–12) — live coding |
| 1:15–1:30 | Building the Student API (Slide 13) |

---

## 4. Slide-by-Slide Presentation Content

### Slide 1 — The Problem: One Giant File
**Explanation:** Yesterday's Hello API put everything — routes, logic, server setup — in one file. This doesn't scale: a real API with dozens of endpoints becomes unreadable and unmaintainable in a single file.
**Real-world example:** Recall React Bootcamp Week 6, Day 3's project organization lesson — the same "everything crammed into one place" problem, now on the backend side.
**Instructor notes:** Directly recap that React lesson's motivation — students already internalized this exact argument once; today reapplies it to a new context.

---

### Slide 2 — Why Structure Matters More on the Backend
**Explanation:** Backend code often handles sensitive logic (auth, payments, data) — poor organization doesn't just look messy, it makes bugs and security issues much easier to introduce and harder to catch.
**Instructor notes:** Raise the stakes slightly compared to frontend organization — motivates today's structural discipline as more than just tidiness.

---

### Slide 3 — Introducing express.Router()
**Explanation:** `express.Router()` creates a mini, self-contained router that can be defined in its own file and mounted onto the main app — the foundation of splitting routes across files.
**Code example:**
```javascript
// routes/students.js
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "List of students" });
});

module.exports = router;
```
**Instructor notes:** Point out `module.exports`/`require` here — recap Frontend Foundations Lesson 1's basic file structure concept, now applied to Node's module system rather than browser `<script>` tags.

---

### Slide 4 — Mounting Routers in the Main App
**Code example:**
```javascript
// server.js
const express = require("express");
const studentRoutes = require("./routes/students");

const app = express();
app.use("/api/students", studentRoutes);

app.listen(3000, () => console.log("Server running"));
```
**Instructor notes:** Explain the URL composition explicitly: the router's `"/"` route, mounted at `"/api/students"`, becomes `GET /api/students` — trace this live with a diagram if helpful.

---

### Slide 5 — Organizing Routes by Resource
**Explanation:** Convention: one router file per resource (`routes/students.js`, `routes/products.js`) — mirrors the RESTful resource-based URL structure from Day 1.
**Code example:**
```
routes/
├── students.js
└── products.js
```
**Instructor notes:** Foreshadow tomorrow's Product API — "you'll add a second router file following this exact pattern."

---

### Slide 6 — What Is Middleware?
**Explanation:** Middleware is a function that runs *during* the request-response cycle, before the final route handler — it can inspect/modify the request, end the response early, or pass control forward with `next()`.
**Visual suggestion:** Pipeline diagram: Request → Middleware 1 → Middleware 2 → Route Handler → Response.
**Instructor notes:** This pipeline visual is the single most important mental model of the day — refer back to it throughout the rest of the lesson.

---

### Slide 7 — Built-In Middleware: express.json()
**Explanation:** `express.json()` parses incoming JSON request bodies, making them available as `req.body` — without it, `req.body` is `undefined` for any POST/PUT request with a JSON payload.
**Code example:**
```javascript
const app = express();
app.use(express.json());  // must come before routes that need req.body

app.post("/api/students", (req, res) => {
  console.log(req.body);  // now populated correctly
  res.json({ received: req.body });
});
```
**Instructor notes:** Demonstrate `req.body` as `undefined` first by removing `express.json()`, then add it back — a concrete, memorable demo of what middleware actually does.

---

### Slide 8 — Writing Custom Middleware
**Explanation:** A custom middleware function takes `(req, res, next)` and must call `next()` to pass control onward — otherwise the request hangs forever.
**Code example:**
```javascript
const logger = (req, res, next) => {
  console.log(`${req.method} ${req.url} at ${new Date().toISOString()}`);
  next();  // pass control to the next middleware/route handler
};

app.use(logger);
```
**Instructor notes:** Trigger the "hanging forever" bug live by forgetting `next()` — a genuinely important, memorable lesson about middleware's contract.

---

### Slide 9 — Route-Specific Middleware
**Explanation:** Middleware can be applied globally (`app.use(...)`, runs on every request) or to specific routes only.
**Code example:**
```javascript
const requireJsonBody = (req, res, next) => {
  if (!req.body) {
    return res.status(400).json({ error: "Request body is required" });
  }
  next();
};

router.post("/", requireJsonBody, (req, res) => {
  res.json({ message: "Student created", data: req.body });
});
```
**Instructor notes:** Point out middleware can be "stacked" as multiple arguments before the final handler — a pattern used constantly for validation and auth checks in later weeks.

---

### Slide 10 — Introducing MVC Architecture
**Explanation:** MVC (Model-View-Controller) separates concerns: **Model** (data structure/database logic, covered in depth Week 2), **View** (traditionally rendered UI — for APIs, this is replaced by the JSON response itself), **Controller** (the logic connecting a request to a response).
**Visual suggestion:** Three-box diagram: Model ↔ Controller ↔ Route, with "View = JSON response" noted for APIs specifically.
**Instructor notes:** Clarify explicitly that "View" doesn't mean HTML here — some students may have heard MVC in a web-page-rendering context; for a REST API, the "view" is simply the JSON structure returned.

---

### Slide 11 — Building a Controller
**Explanation:** A controller function contains the actual logic for handling a request — routers stay thin, just wiring URLs to controller functions.
**Code example:**
```javascript
// controllers/studentController.js
const getAllStudents = (req, res) => {
  res.json({ message: "List of all students" });
};

const createStudent = (req, res) => {
  res.status(201).json({ message: "Student created", data: req.body });
};

module.exports = { getAllStudents, createStudent };
```
```javascript
// routes/students.js
const express = require("express");
const router = express.Router();
const { getAllStudents, createStudent } = require("../controllers/studentController");

router.get("/", getAllStudents);
router.post("/", createStudent);

module.exports = router;
```
**Instructor notes:** Point out `res.status(201)` here — introduce status codes beyond 200 briefly (201 = Created), full status code coverage continues through the course as different scenarios arise.

---

### Slide 12 — The Full MVC Folder Structure
**Code example:**
```
project/
├── controllers/
│   └── studentController.js
├── routes/
│   └── students.js
├── models/           (introduced Week 2)
├── middleware/
│   └── logger.js
└── server.js
```
**Instructor notes:** Present this as the standard structure students will use and extend for the rest of the course — establish it as a habit now, similar to how React Bootcamp Week 6 Day 3 established a standard frontend folder structure.

---

### Slide 13 — Building the Student API
**Explanation:** Combine today's full toolkit — Router, middleware, controllers, MVC structure — into a properly organized Student API with in-memory data (no database yet — that's Week 2).
**Code example:**
```javascript
// controllers/studentController.js
let students = [
  { id: 1, name: "Amaka", grade: "A" },
  { id: 2, name: "Tunde", grade: "B" },
];

const getAllStudents = (req, res) => {
  res.json(students);
};

const createStudent = (req, res) => {
  const newStudent = { id: students.length + 1, ...req.body };
  students.push(newStudent);
  res.status(201).json(newStudent);
};

module.exports = { getAllStudents, createStudent };
```
```javascript
// server.js
const express = require("express");
const studentRoutes = require("./routes/students");

const app = express();
app.use(express.json());
app.use("/api/students", studentRoutes);

app.listen(3000, () => console.log("Server running on port 3000"));
```
**Instructor notes:** Build incrementally: get `GET /api/students` working and tested first, then add `POST`, testing each in Postman/browser as it's built — the "small steps, test often" habit carried over from every prior Khodz Academy course. Explicitly flag that `students` living in a plain array is temporary — "this data disappears when the server restarts; Week 2 fixes that permanently with a real database," directly recalling the same lesson from Frontend Foundations/React about data persistence.

---

## 5. Practical Exercises During Class

1. **Router drill:** Students create a second router file (`routes/teachers.js`) and mount it at `/api/teachers`.
2. **Middleware drill:** Students write a custom middleware that rejects any request without a `name` field in `req.body`, returning a 400 error.
3. **Controller refactor drill:** Instructor shows route logic written directly inline; students refactor it into a separate controller function.
4. **Full build-along:** Every student builds the Student API with the instructor.

---

## 6. Homework Assignment

- Extend the Student API with a `PUT /api/students/:id` route (a light preview of Day 3's route parameters, needed here) that updates a student's grade.
- Add a custom logging middleware that records every request's method, URL, and timestamp to the console.
- Organize the project fully into the `controllers/`, `routes/`, `middleware/` structure from Slide 12.

---

## 7. Mini Project — Student API

**Brief:** "Build a properly structured Student API using routers, controllers, and custom middleware."

**Requirements:**
- `express.Router()` used for all routes, mounted in `server.js`
- Logic separated into controller functions, not written inline in route definitions
- At least one custom middleware (logging or validation) applied
- `GET` and `POST` routes both working, tested in Postman
- Data stored in an in-memory array (acceptable for now — database comes Week 2)
- Follows the standard MVC folder structure

**Stretch goal:** Add a middleware that measures and logs how long each request took to process (using `Date.now()` before and after `next()`).

---

## 8. Common Beginner Mistakes

- Forgetting `next()` inside custom middleware, causing requests to hang indefinitely.
- Forgetting `express.json()`, leaving `req.body` `undefined` on POST/PUT requests.
- Mounting a router at the wrong path, or forgetting `app.use()` entirely.
- Putting middleware registration *after* the routes that need it (order matters — Express processes middleware top-to-bottom).
- Writing logic directly in route definitions instead of controllers, undermining the whole point of today's organization lesson.
- Forgetting `module.exports` in a router/controller file, causing `require()` to return an empty object elsewhere.

---

## 9. Extra Resources

- [Express.js — Routing Guide](https://expressjs.com/en/guide/routing.html)
- [Express.js — Using Middleware](https://expressjs.com/en/guide/using-middleware.html)
- [Express.js — Writing Middleware](https://expressjs.com/en/guide/writing-middleware.html)
