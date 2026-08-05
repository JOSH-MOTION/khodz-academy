
# Week 3, Day 3 — Role-Based Access Control, Admin vs. User, Permissions, Refresh Tokens (Introduction)

**Khodz Academy — Backend Development Bootcamp**
**Session:** 9 of 24 | **Duration:** ~1.5–2 hours

---

## 1. Lesson Objectives

By the end of this lesson, students will be able to:

1. Explain the difference between authentication and authorization (revisited from a working, real-code perspective).
2. Add roles to a user model.
3. Build middleware that restricts routes by role.
4. Understand refresh tokens conceptually and why they're needed.
5. Build a School Management API with real role-based permissions.

---

## 2. Skills Students Will Learn

- Adding a `role` field to the `User` model
- Building `authorize(...)` middleware that checks role-based permissions
- Combining `protect` + `authorize` middleware together
- Designing admin-only vs. user-accessible routes
- Refresh tokens: what they are and why access tokens alone aren't enough for a good user experience (conceptual, with a light implementation preview)

---

## 3. Detailed Teaching Outline (~1.5–2 hrs)

| Time | Segment |
|---|---|
| 0:00–0:10 | Recap Day 2 + show and tell |
| 0:10–0:20 | Authentication vs. authorization, revisited (Slides 1–2) |
| 0:20–0:40 | Adding roles to the User model (Slides 3–5) — live coding |
| 0:40–1:05 | Building authorization middleware (Slides 6–9) — live coding |
| 1:05–1:20 | Refresh tokens conceptually (Slides 10–11) |
| 1:20–1:30 | Building the School Management API (Slide 12) |

---

## 4. Slide-by-Slide Presentation Content

### Slide 1 — Recap: Authentication vs. Authorization
**Explanation:** Recall this exact distinction, first introduced conceptually in React Bootcamp Week 7, Day 2: authentication = "who are you?" (solved by yesterday's JWT middleware). Authorization = "what are you allowed to do?" — today builds that missing half with real, working code.
**Instructor notes:** If students took the React Bootcamp, point out this is the third and final callback to that lesson — today fully completes the concept that was only theoretical there.

---

### Slide 2 — Why Authorization Matters
**Explanation:** Being logged in shouldn't mean being allowed to do *everything* — a school management system needs a clear line between what a regular teacher/student can do versus what only an admin can do (e.g., deleting other users' records).
**Real-world example:** A School Management API where any logged-in user could delete other students' grades would be a serious, realistic security failure — today's lesson exists specifically to prevent that.
**Instructor notes:** Ground this in the day's actual capstone project (School Management API) from the very first slide — sets clear stakes.

---

### Slide 3 — Adding a Role Field to the User Model
**Code example:**
```javascript
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
}, { timestamps: true });
```
**Instructor notes:** Recap Week 2, Day 2's `enum` validation directly — restricting `role` to only two valid values prevents typos or invalid roles from ever being stored.

---

### Slide 4 — Including the Role in the JWT Payload
**Code example:**
```javascript
const token = jwt.sign(
  { id: user._id, email: user.email, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: "1h" }
);
```
**Instructor notes:** Recap yesterday's Slide 3 warning about JWT payloads being readable, not secret — role is fine to include (it's not sensitive), but reiterate that something like a password never would be.

---

### Slide 5 — How to Assign the Admin Role (For This Course)
**Explanation:** In a real production system, promoting a user to admin would itself be a protected, carefully controlled action. For this course, manually update a test user's role directly in MongoDB Atlas's Browse Collections view to create an admin account for testing.
**Instructor notes:** Be explicit that this manual-edit approach is a learning-environment shortcut, not a real-world pattern — flag it honestly rather than letting students assume this is how production admin promotion works.

---

### Slide 6 — Building Authorization Middleware
**Code example:**
```javascript
// middleware/authorize.js
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: "You do not have permission to perform this action" });
    }
    next();
  };
};

module.exports = authorize;
```
**Instructor notes:** Introduce status `403 Forbidden` here — distinct from `401 Unauthorized` (recap Day 2): `401` means "we don't know who you are," `403` means "we know who you are, and you're not allowed to do this." This distinction is a genuinely important, commonly confused detail worth stating clearly. Explain the `(...allowedRoles)` rest-parameter pattern — a function that *returns* a middleware function, configured with whichever roles are allowed for that specific route.

---

### Slide 7 — Applying protect and authorize Together
**Code example:**
```javascript
const protect = require("../middleware/auth");
const authorize = require("../middleware/authorize");

router.delete("/students/:id", protect, authorize("admin"), deleteStudent);
```
**Instructor notes:** Walk through the middleware chain explicitly: `protect` runs first (confirms identity, attaches `req.user`), then `authorize("admin")` runs (checks permission using the now-available `req.user.role`) — order matters, since `authorize` depends on data `protect` provides.

---

### Slide 8 — Allowing Multiple Roles
**Code example:**
```javascript
router.get("/students", protect, authorize("admin", "teacher"), getAllStudents);
```
**Instructor notes:** Point out the rest-parameter design from Slide 6 makes this trivially flexible — no changes to the middleware itself needed to support multiple allowed roles per route.

---

### Slide 9 — Designing Role-Based Routes for the School Management API
**Explanation:** Plan the API's permission structure before coding: which routes are open to any logged-in user, and which require admin specifically.
**Code example:**
```
GET    /api/students        → any logged-in user (protect only)
GET    /api/students/:id    → any logged-in user (protect only)
POST   /api/students        → admin only (protect + authorize("admin"))
PUT    /api/students/:id    → admin only
DELETE /api/students/:id    → admin only
```
**Instructor notes:** Recap the "plan before code" habit established since Frontend Foundations — have students write out a permission table like this for their own project before writing any route code today.

---

### Slide 10 — The Problem with Short-Lived Access Tokens
**Explanation:** Recall Day 2's `expiresIn: "1h"` — a short expiry is good for security, but bad for user experience if it means logging in again every hour. Real applications solve this with a second, longer-lived **refresh token**.
**Instructor notes:** Frame this as "yesterday's security choice creates today's UX problem" — a genuine, realistic tradeoff worth naming honestly.

---

### Slide 11 — How Refresh Tokens Work (Conceptual Overview)
**Explanation:** On login, the server issues two tokens: a short-lived **access token** (used for regular requests, like yesterday's JWT) and a longer-lived **refresh token** (stored more carefully, used only to request a *new* access token when the old one expires — without requiring the user to log in again).
**Visual suggestion:** Flow diagram: access token expires → client sends refresh token to a `/refresh` endpoint → server verifies it and issues a new access token.
**Instructor notes:** Keep this conceptual only, as the lesson topics specify — full refresh token *implementation* (secure storage, rotation, revocation) is genuinely complex and appropriately deferred to a more advanced course; today's goal is informed awareness, not a working build.

---

### Slide 12 — Building the School Management API
**Explanation:** Combine today's full toolkit — roles, `authorize` middleware, and the Week 2 Inventory API's real CRUD patterns — into a School Management API with proper admin/user permission boundaries.
**Code example:**
```javascript
// routes/students.js
const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const authorize = require("../middleware/authorize");
const {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
} = require("../controllers/studentController");

router.get("/", protect, getAllStudents);
router.get("/:id", protect, getStudentById);
router.post("/", protect, authorize("admin"), createStudent);
router.put("/:id", protect, authorize("admin"), updateStudent);
router.delete("/:id", protect, authorize("admin"), deleteStudent);

module.exports = router;
```
**Instructor notes:** Build and test incrementally: confirm a regular user can read but gets a 403 attempting to create/update/delete, then confirm an admin user can perform every action — this permission-boundary testing is today's essential, non-optional verification step.

---

## 5. Practical Exercises During Class

1. **Role assignment drill:** Students manually promote a test user to `admin` in Atlas and confirm the change via a fresh login (new token reflecting the new role).
2. **403 drill:** Students attempt an admin-only action as a regular user and confirm the 403 response.
3. **Full build-along:** Every student builds the `authorize` middleware and applies it to the School Management API's routes with the instructor.

---

## 6. Homework Assignment

- Finish and fully test the School Management API's permission boundaries in Postman: every route tested as both a regular user and an admin.
- Add a `teacher` role to the schema's `enum`, and design (in comments or a short written plan) which routes a teacher should be allowed to access — implement at least one such route.
- Write a short paragraph explaining, in your own words, why access tokens are usually short-lived and what problem refresh tokens solve.

---

## 7. Mini Project — School Management API

**Brief:** "Build a role-protected School Management API distinguishing what regular users and admins can each do."

**Requirements:**
- `User` model with a `role` field (`user`/`admin`, extendable to `teacher`)
- `authorize(...)` middleware correctly restricting routes by role
- Read routes accessible to any authenticated user
- Create/update/delete routes restricted to admin only
- Fully tested in Postman as both a regular user and an admin, confirming correct 403s where expected

**Stretch goal:** Add a `teacher` role with intermediate permissions (e.g., can update grades, but not delete student records) — practice designing a more nuanced permission structure.

---

## 8. Common Beginner Mistakes

- Applying `authorize` before `protect` in the middleware chain, causing it to fail since `req.user` doesn't exist yet.
- Using `401` instead of `403` for permission failures (or vice versa) — recap the distinction from Slide 6.
- Forgetting the JWT must be refreshed (re-login) after manually changing a user's role in the database, since the old token still carries the old role.
- Hardcoding role checks directly in controllers instead of using reusable `authorize` middleware, leading to inconsistent enforcement across routes.
- Assuming refresh tokens were fully implemented today — recap that this lesson was intentionally conceptual, not a working build, per the course's stated scope.

---

## 9. Extra Resources

- [OWASP — Access Control Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Access_Control_Cheat_Sheet.html)
- [Auth0 — Refresh Tokens: What Are They and When to Use Them](https://auth0.com/learn/refresh-tokens/)
- [MDN — HTTP 403 Forbidden](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/403)
