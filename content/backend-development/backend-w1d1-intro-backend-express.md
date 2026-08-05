
# Week 1, Day 1 — Introduction to Backend Development

**Khodz Academy — Backend Development Bootcamp**
**Session:** 1 of 24 | **Duration:** ~1.5–2 hours

---

## 1. Lesson Objectives

By the end of this lesson, students will be able to:

1. Explain what backend development is and how it differs from frontend.
2. Explain the client-server model and HTTP request/response cycle.
3. Explain what a REST API is at a working level.
4. Install Node.js and understand npm.
5. Create and run their first Express server.
6. Build a working "Hello API" endpoint.

---

## 2. Skills Students Will Learn

- Backend vs. frontend responsibilities
- Client-server architecture (recap conceptually from Frontend Foundations Lesson 1)
- HTTP requests and responses, methods, status codes
- What REST means and why it's the dominant API style
- Installing Node.js and verifying the installation
- npm basics: `npm init`, installing packages, `package.json`
- Creating a minimal Express server
- Defining a simple route and sending a response

---

## 3. Detailed Teaching Outline (~1.5–2 hrs)

| Time | Segment |
|---|---|
| 0:00–0:15 | Welcome, course overview, what students will build (Slides 1–2) |
| 0:15–0:30 | Client-server, HTTP, REST recap and deepening (Slides 3–6) |
| 0:30–0:45 | Installing Node.js + npm basics (Slides 7–9) — hands-on |
| 0:45–1:05 | Setting up Express (Slides 10–12) — live coding |
| 1:05–1:25 | Building the Hello API (Slides 13–14) — live coding |
| 1:25–1:30 | Recap, common mistakes, Q&A (Slide 15) |

---

## 4. Slide-by-Slide Presentation Content

### Slide 1 — Welcome to the Backend Development Bootcamp
**Explanation:** Introduce the course goal: build the server-side systems that power real applications — the part of the stack that Frontend Foundations and the React Bootcamp always talked *to*, but never built.
**Visual suggestion:** 8-week roadmap graphic with all major projects.
**Instructor notes:** If students come from Frontend Foundations/React Bootcamp, explicitly name what becomes "real" here: the mock `AuthContext` from React Bootcamp Week 7, the JSONPlaceholder fake API from Week 7 Day 1 — both get replaced with real systems this course builds from scratch.

---

### Slide 2 — What You'll Build This Course
**Explanation:** Preview the 16 projects across 8 weeks, from a one-line "Hello API" to a deployed, capstone-level production API.
**Instructor notes:** Motivational framing — show a believable path from "first server" to "deployed, secured, documented API."

---

### Slide 3 — Recap: Client and Server
**Explanation:** Recall the client-server model (Frontend Foundations Lesson 1): a client (browser, mobile app, or Postman) sends a request; a server processes it and sends back a response. This course builds the **server** side of that relationship.
**Visual suggestion:** The same request/response arrow diagram from Frontend Foundations Lesson 1, now with "YOU BUILD THIS" labeled on the server side.
**Instructor notes:** This visual callback is deliberate — students already understand this model from the client side; today reframes it from the server's perspective.

---

### Slide 4 — What Is Backend Development?
**Explanation:** Backend development is building the server-side logic that powers an application: handling requests, running business logic, talking to databases, enforcing security — everything users don't see directly, but everything the frontend depends on.
**Real-world example:** When a user logs into an app, the frontend collects the email/password, but the backend verifies credentials, checks the database, and decides whether access is granted.
**Instructor notes:** Recap Frontend Foundations Lesson 1's frontend/backend split explicitly — today, students switch sides of that same picture.

---

### Slide 5 — HTTP Requests and Responses, in Depth
**Explanation:** Every HTTP request has a method (`GET`, `POST`, `PUT`/`PATCH`, `DELETE` — recap React Bootcamp Week 7's CRUD-to-HTTP mapping), a URL, headers, and sometimes a body. Every response has a status code, headers, and usually a body.
**Code example:**
```
POST /api/students HTTP/1.1
Host: api.khodzacademy.com
Content-Type: application/json

{ "name": "Amaka", "grade": "A" }
```
**Instructor notes:** Point out this is the exact same request shape students sent via `fetch()` in Frontend Foundations Lesson 7 and React Bootcamp Week 7 — "you've been sending these your whole time as a frontend developer; today you learn what receives them."

---

### Slide 6 — What Is a REST API?
**Explanation:** REST (Representational State Transfer) is a set of conventions for designing APIs: resources are represented by URLs (`/students`, `/students/123`), and HTTP methods indicate the action (GET to read, POST to create, PUT/PATCH to update, DELETE to remove).
**Code example:**
```
GET    /api/students        → list all students
GET    /api/students/123    → get one student
POST   /api/students        → create a student
PUT    /api/students/123    → update a student
DELETE /api/students/123    → delete a student
```
**Instructor notes:** Directly recap React Bootcamp Week 7, Day 1's CRUD-to-HTTP-method table — same mapping, now from the server's side of the conversation.

---

### Slide 7 — Installing Node.js
**Explanation:** Node.js lets JavaScript run outside the browser — on a server. Install the LTS (Long Term Support) version.
**Instructor notes:** If students already have Node from the React Bootcamp (needed for Vite), this is a two-minute verification, not a fresh install — check `node --version` live either way.

---

### Slide 8 — What Is npm?
**Explanation:** npm (Node Package Manager) installs and manages third-party code libraries — recap Frontend Foundations Lesson 2's Tailwind CLI install and React Bootcamp Week 1's `npm create vite@latest`, both used npm without full explanation until now.
**Code example:**
```bash
npm init -y
```
**Instructor notes:** Run `npm init -y` live and open the generated `package.json` — walk through its fields (`name`, `version`, `main`, `dependencies`) since students will edit this file constantly going forward.

---

### Slide 9 — Installing Express
**Code example:**
```bash
npm install express
```
**Instructor notes:** Show the `node_modules` folder and `package-lock.json` that appear after install — explain briefly that `node_modules` should never be committed to Git (a `.gitignore` entry, recap Frontend Foundations Lesson 8's `.gitignore` habit).

---

### Slide 10 — What Is Express?
**Explanation:** Express is a minimal, flexible framework for building web servers and APIs in Node.js — it handles the repetitive parts of processing HTTP requests so you can focus on your application's logic.
**Real-world example:** Express powers a huge share of production Node.js backends — from small startups to large-scale companies.
**Instructor notes:** Frame Express the same way Tailwind was framed in Frontend Foundations Lesson 2 — "don't reinvent the wheel; use the well-tested, industry-standard tool."

---

### Slide 11 — Creating Your First Express Server
**Code example:**
```javascript
// server.js
const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Hello, Khodz Academy!");
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```
**Instructor notes:** Type this live, line by line, narrating each part. Run it with `node server.js` and visit `http://localhost:3000` in a browser together — the "first win" moment of the course.

---

### Slide 12 — Understanding req and res
**Explanation:** `req` (request) contains everything about the incoming request; `res` (response) is used to send something back. Every route handler receives both.
**Code example:**
```javascript
app.get("/", (req, res) => {
  console.log(req.method);  // GET
  console.log(req.url);      // /
  res.send("Hello!");
});
```
**Instructor notes:** Log `req.method` and `req.url` live and hit the endpoint from a browser — makes the abstract `req` object concrete by showing real captured data.

---

### Slide 13 — Adding Auto-Restart with Nodemon
**Explanation:** By default, Express requires manually restarting the server after every code change — `nodemon` watches files and restarts automatically, a significant quality-of-life improvement (recap Vite's Hot Module Replacement from React Bootcamp Week 1 as a conceptual cousin — instant feedback loop, though the mechanism differs).
**Code example:**
```bash
npm install -D nodemon
```
```json
// package.json
"scripts": {
  "dev": "nodemon server.js"
}
```
```bash
npm run dev
```
**Instructor notes:** Recap `npm run dev` from React Bootcamp Week 1's Vite setup — same npm script pattern, new tool underneath.

---

### Slide 14 — Building the Hello API
**Explanation:** Extend the single route into a small "Hello API" with two endpoints, returning JSON instead of plain text — the format real APIs actually use.
**Code example:**
```javascript
const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Hello API!" });
});

app.get("/api/greeting/:name", (req, res) => {
  res.json({ message: `Hello, ${req.params.name}!` });
});

app.listen(3000, () => console.log("Server running on port 3000"));
```
**Instructor notes:** Introduce `res.json()` here as the standard way to respond with data — briefly flag `req.params` as a preview (full route parameters coverage is Day 3). Test both routes in the browser, then introduce Postman briefly as a better tool for this (fully covered Day 3).

---

### Slide 15 — Recap and What's Next
**Explanation:** Recap: client-server/HTTP/REST fundamentals, Node.js and npm, Express setup, and a working Hello API. Preview: Day 2 goes deeper into Express — routes, controllers, middleware, and MVC architecture — building a Student API.
**Instructor notes:** End by having every student confirm their Hello API runs and responds correctly in a browser — a clean, universal checkpoint before moving on.

---

## 5. Practical Exercises During Class

1. **Setup checkpoint:** Every student installs Node.js, initializes a project, installs Express, and runs a basic server.
2. **Route drill:** Students add a second route (e.g., `/about`) returning a JSON message.
3. **req/res drill:** Students log `req.method` and `req.url` for every incoming request and observe the output while testing different routes.

---

## 6. Homework Assignment

- Finish and polish the Hello API (Section 7).
- Add 2 more routes of your choice (e.g., `/api/time` returning the current server time, `/api/joke` returning a hardcoded joke), each responding with JSON via `res.json()`.
- Set up `nodemon` and confirm auto-restart works when you edit and save `server.js`.

---

## 7. Mini Project — Hello API

**Brief:** "Build a small API with a few working endpoints, returning JSON responses."

**Requirements:**
- Express server running on a defined port
- At least 3 GET routes, each returning a JSON response via `res.json()`
- At least one route using a route parameter (e.g., `/api/greeting/:name`)
- `nodemon` configured for auto-restart during development
- Tested successfully in a browser or Postman

**Stretch goal:** Add a route that reads a query parameter (e.g., `/api/greeting?name=Amaka`) using `req.query` — a light preview of Day 3's query parameters lesson.

---

## 8. Common Beginner Mistakes

- Forgetting to run `npm init` before installing packages, causing confusing errors.
- Forgetting `require("express")` or misnaming the import.
- Using `res.send()` when `res.json()` is more appropriate for structured data (both work, but `res.json()` is the clearer, more conventional choice for APIs).
- Forgetting to call `app.listen()`, so the server never actually starts.
- Editing `server.js` while running with plain `node` instead of `nodemon`, then being confused why changes don't appear until manually restarting.
- Port conflicts — trying to start a server on a port already in use by another running process.

---

## 9. Extra Resources

- [Node.js — Official Downloads](https://nodejs.org/)
- [Express.js — Official Docs](https://expressjs.com/)
- [MDN — HTTP Overview](https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview)
- [Nodemon — Official Docs](https://www.npmjs.com/package/nodemon)
