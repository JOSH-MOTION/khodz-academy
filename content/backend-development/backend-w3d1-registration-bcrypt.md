
# Week 3, Day 1 — User Registration, Password Hashing, bcrypt, Login

**Khodz Academy — Backend Development Bootcamp**
**Session:** 7 of 24 | **Duration:** ~1.5–2 hours

---

## 1. Lesson Objectives

By the end of this lesson, students will be able to:

1. Explain why passwords must never be stored in plain text.
2. Hash passwords securely using bcrypt.
3. Build a real user registration endpoint.
4. Build a real login endpoint that verifies hashed passwords.
5. Understand, at a conceptual level, why this replaces "mock" authentication used in earlier courses.

---

## 2. Skills Students Will Learn

- Why plain-text password storage is a serious security failure
- Hashing vs. encryption (conceptual distinction)
- Installing and using `bcrypt`
- Hashing a password before saving a user
- Comparing a plain-text login attempt against a stored hash
- Building `User` model, registration, and login endpoints

---

## 3. Detailed Teaching Outline (~1.5–2 hrs)

| Time | Segment |
|---|---|
| 0:00–0:15 | Welcome to Week 3, recap Inventory API + show and tell |
| 0:15–0:30 | Why password security matters (Slides 1–3) |
| 0:30–0:45 | Hashing with bcrypt (Slides 4–6) — live coding |
| 0:45–1:05 | Building the User model and registration (Slides 7–9) — live coding |
| 1:05–1:25 | Building login (Slides 10–12) — live coding |
| 1:25–1:30 | Recap, common mistakes, Q&A (Slide 13) |

---

## 4. Slide-by-Slide Presentation Content

### Slide 1 — Welcome to Week 3: Authentication
**Explanation:** This week replaces every "mock" authentication pattern from earlier Khodz Academy courses with the real thing — recall React Bootcamp Week 7, Day 2's `AuthContext`, which explicitly used a fake `login()` function and stated plainly: "real authentication requires a backend server... covered in Module 3." This is that module.
**Visual suggestion:** Side-by-side: React Bootcamp's mock `login()` function vs. this week's real, database-backed version.
**Instructor notes:** If any students took the React Bootcamp, this framing should feel like a genuinely satisfying payoff — call it out directly and let it land.

---

### Slide 2 — Why Passwords Need Special Handling
**Explanation:** If a database is ever breached (and real breaches happen even at large companies), plain-text passwords would be instantly exposed for every user, and since people commonly reuse passwords, that exposure often cascades to other accounts entirely.
**Real-world example:** Reference (without needing incident-specific detail) the general pattern of major real-world data breaches involving poorly-secured passwords — a well-known and sobering category of incident in the industry.
**Instructor notes:** Keep this appropriately serious — this is the moment in the course where security stops being an abstract "best practice" and becomes a concrete responsibility.

---

### Slide 3 — Hashing vs. Encryption
**Explanation:** Encryption is reversible (with the right key, you can get the original data back). Hashing is one-way — a password is transformed into a fixed-length string that cannot be reversed back into the original password. Passwords should be **hashed**, never merely encrypted or stored plain.
**Instructor notes:** Keep this distinction conceptual and simple — students don't need cryptographic theory, just the correct mental model: "hashing is a one-way transformation, which is exactly what makes it safe for passwords."

---

### Slide 4 — Installing bcrypt
**Explanation:** bcrypt is a well-established, battle-tested library for securely hashing passwords, including built-in protection against certain classes of attacks (via a "salt," explained next).
**Code example:**
```bash
npm install bcrypt
```
**Instructor notes:** Frame bcrypt the same way Express and Mongoose were framed earlier — "a well-tested industry tool; never write your own password hashing from scratch."

---

### Slide 5 — Hashing a Password
**Code example:**
```javascript
const bcrypt = require("bcrypt");

const hashPassword = async (plainPassword) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
  return hashedPassword;
};
```
**Instructor notes:** Run this live and log the resulting hash — students should see a long, unreadable string and understand this is what actually gets stored, never the original password. Briefly explain "salt rounds" as a cost factor controlling how slow/expensive the hash is to compute — higher is more secure but slower; 10 is a reasonable, standard default.

---

### Slide 6 — Comparing Passwords
**Explanation:** Since hashing is one-way, login verification doesn't "decrypt" the stored hash — instead, `bcrypt.compare()` hashes the login attempt the same way and checks if the result matches.
**Code example:**
```javascript
const isMatch = await bcrypt.compare(plainPasswordAttempt, storedHash);
console.log(isMatch); // true or false
```
**Instructor notes:** This is the day's key conceptual unlock — walk through it slowly: "we never reverse the stored hash; we just check whether hashing the new attempt produces the same result."

---

### Slide 7 — Building the User Model
**Code example:**
```javascript
// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
```
**Instructor notes:** Recap Week 2, Day 2's schema/validation lesson directly — same skill, applied to a new, higher-stakes model. Introduce `{ timestamps: true }` as a convenient schema option that automatically adds `createdAt`/`updatedAt` fields — a small addition worth naming explicitly since it's used constantly from here on.

---

### Slide 8 — Hashing the Password Before Saving
**Explanation:** The password must be hashed *before* it's saved — never store the plain-text version, even temporarily. Use a Mongoose "pre-save hook" to hash automatically every time a user document is about to be saved.
**Code example:**
```javascript
const bcrypt = require("bcrypt");

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
```
**Instructor notes:** Recap Week 1, Day 2's middleware/`next()` concept explicitly — "this is the same `next()` pattern, applied inside a schema instead of an Express route." Explain `this.isModified("password")` as an important guard: without it, the password would be re-hashed (and broken) every time the document is saved for *any* reason, not just when the password itself changes.

---

### Slide 9 — Building the Registration Endpoint
**Code example:**
```javascript
// controllers/authController.js
const User = require("../models/User");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.create({ name, email, password });
    res.status(201).json({ id: user._id, name: user.name, email: user.email });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { register };
```
**Instructor notes:** Point out the response deliberately excludes `password` (even the hashed version) — flag this as a real security habit: never send password data back to the client, hashed or not. Test in Postman, then check Atlas's Browse Collections view to confirm the stored password is a bcrypt hash, not the plain text submitted.

---

### Slide 10 — Building the Login Endpoint
**Code example:**
```javascript
const bcrypt = require("bcrypt");
const User = require("../models/User");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    res.json({ id: user._id, name: user.name, email: user.email });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { register, login };
```
**Instructor notes:** Introduce `User.findOne({ email })` — a new Mongoose query method, alongside the already-familiar `find()`/`findById()` from Week 2. Point out the deliberately identical error message for "user not found" and "wrong password" — a real security best practice: don't reveal *which* part was wrong, since that helps attackers narrow down valid emails.

---

### Slide 11 — Wiring Up the Auth Routes
**Code example:**
```javascript
// routes/auth.js
const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);

module.exports = router;
```
```javascript
// server.js
app.use("/api/auth", authRoutes);
```
**Instructor notes:** Recap Week 1, Day 2's router-mounting pattern directly — no new concept here, just applying the established habit to a new resource.

---

### Slide 12 — Testing the Full Flow in Postman
**Explanation:** Test registration with a new user, confirm the hashed password in Atlas, then test login with correct and incorrect passwords, confirming the appropriate success/failure responses.
**Instructor notes:** Have every student complete this full flow themselves — registration → verify hash → successful login → failed login — before moving on. This is today's ultimate checkpoint.

---

### Slide 13 — Recap and What's Next
**Explanation:** Recap: why password security matters, bcrypt hashing, the pre-save hook pattern, and real registration/login endpoints. Preview: Day 2 introduces JWT — issuing a token on successful login and using it to protect routes, completing real authentication.
**Instructor notes:** Be explicit about what's still missing: "right now, logging in just confirms who you are — it doesn't yet give you a way to *stay* logged in across requests. That's tomorrow's JWT lesson."

---

## 5. Practical Exercises During Class

1. **Hash drill:** Students hash 3 different passwords and observe that the same password produces a *different* hash each time (due to salting) — an important, sometimes surprising observation.
2. **Compare drill:** Students verify `bcrypt.compare()` correctly returns `true` for a matching password and `false` for a wrong one.
3. **Full build-along:** Every student builds the User model, registration, and login endpoints with the instructor.

---

## 6. Homework Assignment

- Finish and fully test the Authentication API (Section 7) in Postman.
- Add a check in the registration endpoint that returns a clear 400 error if the email is already registered (using `User.findOne()` before attempting to create).
- Add basic input validation (recap Week 4's upcoming lesson lightly, or simple manual checks for now) ensuring `name`, `email`, and `password` are all present before attempting registration.

---

## 7. Mini Project — Authentication API

**Brief:** "Build real, secure user registration and login endpoints — the foundation every remaining authentication feature this course builds on."

**Requirements:**
- `User` model with hashed password storage via a pre-save hook
- `POST /api/auth/register` creates a new user, never returning the password in the response
- `POST /api/auth/login` verifies credentials using `bcrypt.compare()`
- Duplicate email registration attempts return a clear error
- Wrong password and nonexistent email both return the same generic "Invalid credentials" message
- Fully tested in Postman: successful registration, duplicate registration, successful login, failed login

**Stretch goal:** Add a `role` field to the `User` model (default `"user"`), foreshadowing Day 3's role-based access control.

---

## 8. Common Beginner Mistakes

- Storing the plain-text password anywhere, even temporarily, before hashing.
- Forgetting the `isModified("password")` guard in the pre-save hook, causing passwords to be re-hashed (and broken) on every save.
- Comparing passwords manually (`password === user.password`) instead of using `bcrypt.compare()` — this will always fail since the stored value is a hash, not plain text.
- Returning the hashed password in API responses — a real information-leakage risk, even though it's hashed.
- Giving different error messages for "user not found" vs. "wrong password," leaking information to potential attackers about which emails are registered.
- Forgetting `await` before `bcrypt.hash()`/`bcrypt.compare()`, since both are asynchronous.

---

## 9. Extra Resources

- [bcrypt — npm Package Docs](https://www.npmjs.com/package/bcrypt)
- [Mongoose — Middleware (pre/post hooks)](https://mongoosejs.com/docs/middleware.html)
- [OWASP — Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
