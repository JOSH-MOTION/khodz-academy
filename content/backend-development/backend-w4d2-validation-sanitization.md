
# Week 4, Day 2 — Validation, Joi/express-validator, Sanitization

**Khodz Academy — Backend Development Bootcamp**
**Session:** 11 of 24 | **Duration:** ~1.5–2 hours

---

## 1. Lesson Objectives

By the end of this lesson, students will be able to:

1. Explain why schema-level validation (Week 2) alone isn't sufficient.
2. Validate incoming request data before it reaches business logic.
3. Use `express-validator` to build declarative validation rules.
4. Sanitize user input to prevent common security issues.
5. Build a Registration Validation project with thorough input checking.

---

## 2. Skills Students Will Learn

- The difference between database-level validation (Mongoose) and request-level validation (before hitting the database at all)
- Installing and using `express-validator`
- Writing validation chains (`body()`, `check()`)
- Handling validation results and returning clean error responses
- Sanitization: trimming, escaping, normalizing input
- Building reusable validation middleware

---

## 3. Detailed Teaching Outline (~1.5–2 hrs)

| Time | Segment |
|---|---|
| 0:00–0:10 | Recap Day 1 + show and tell |
| 0:10–0:20 | Why request-level validation matters (Slides 1–2) |
| 0:20–0:45 | express-validator basics (Slides 3–6) — live coding |
| 0:45–1:05 | Sanitization (Slides 7–9) — live coding |
| 1:05–1:20 | Building reusable validation middleware (Slide 10) |
| 1:20–1:30 | Building Registration Validation (Slides 11–12) |

---

## 4. Slide-by-Slide Presentation Content

### Slide 1 — Recap: Schema Validation Isn't Enough Alone
**Explanation:** Recall Week 2, Day 2's Mongoose validation (`required`, `enum`, `min`/`max`) — it catches bad data at the database layer, but by then, invalid requests have already run through your entire controller logic. Request-level validation catches problems *before* any of that runs.
**Real-world example:** Recall Frontend Foundations Lesson 4's client-side validation lesson — that course explicitly noted native HTML validation "isn't always enough" and real apps need more. This lesson is the server-side completion of that same idea: never trust client-side validation alone, since it can always be bypassed (e.g., by calling the API directly via Postman, exactly as students have been doing all course).
**Instructor notes:** This callback is important — explicitly state that a malicious or careless client could skip any frontend validation and hit the API directly, which is precisely why server-side validation is not optional, no matter how good the frontend is.

---

### Slide 2 — Where This Fits in the Request Pipeline
**Explanation:** Validation belongs as **middleware**, running before the controller — recap Week 1, Day 2's middleware pipeline diagram, with a new named stage inserted: Request → Validation Middleware → Controller.
**Instructor notes:** Redraw the pipeline diagram from Week 1, Day 2 with this addition — reinforces the mental model rather than presenting validation as an unrelated new concept.

---

### Slide 3 — Installing express-validator
**Code example:**
```bash
npm install express-validator
```
**Instructor notes:** Mention Joi as an alternative library serving a similar purpose (the course topics list both) — `express-validator` is chosen here because it integrates directly into the Express middleware pipeline students already understand, minimizing new concepts.

---

### Slide 4 — Writing Your First Validation Chain
**Code example:**
```javascript
const { body } = require("express-validator");

const registerValidation = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("A valid email is required"),
  body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
];
```
**Instructor notes:** Point out how readable this is — "each line almost reads like a sentence describing the rule." Recap Frontend Foundations Lesson 4's "writing good error messages" principle directly — `.withMessage()` is where that same UX-writing skill applies again, server-side.

---

### Slide 5 — Handling Validation Results
**Code example:**
```javascript
const { validationResult } = require("express-validator");

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
```
**Instructor notes:** Explain `validationResult(req)` collects the outcome of all the validation chain rules that ran on this request — a genuinely new mental model worth walking through carefully: the rules themselves don't stop the request; this separate `validate` function does, based on their collected results.

---

### Slide 6 — Wiring It All Together
**Code example:**
```javascript
// routes/auth.js
const { registerValidation, validate } = require("../validators/authValidator");

router.post("/register", registerValidation, validate, register);
```
**Instructor notes:** Recap Week 1, Day 2's "stacked middleware" pattern directly — the validation chain, the `validate` results-checker, and finally the controller, all run in sequence. Test in Postman with intentionally bad data (missing name, invalid email, short password) and confirm the clean 400 response.

---

### Slide 7 — What Is Sanitization?
**Explanation:** Sanitization cleans and normalizes input — separate from validation (which just checks if input is *acceptable*), sanitization actively *transforms* it into a safer or more consistent form.
**Real-world example:** Recall Frontend Foundations Lesson 2's `.strip()`/`.trim()` string method — sanitization automates that exact kind of cleanup at the validation layer, applied consistently across every request.
**Instructor notes:** Draw this distinction clearly: validation asks "is this okay?", sanitization asks "let me clean this up regardless."

---

### Slide 8 — Common Sanitization Methods
**Code example:**
```javascript
const registerValidation = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").trim().normalizeEmail().isEmail().withMessage("A valid email is required"),
  body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
];
```
**Instructor notes:** Explain `.normalizeEmail()` — standardizes email formatting (e.g., lowercasing), preventing subtle duplicate-account bugs where `Amaka@Email.com` and `amaka@email.com` might otherwise be treated as different users.

---

### Slide 9 — Escaping to Prevent Injection-Style Issues
**Explanation:** `.escape()` converts potentially dangerous characters (like `<`, `>`) into safe equivalents — a light, beginner-appropriate introduction to preventing injection-style attacks where user input could otherwise be interpreted as code or markup.
**Code example:**
```javascript
body("name").trim().escape(),
```
**Instructor notes:** Keep this conceptual and light — full security hardening (parameterized queries, output encoding strategy, CSP headers, etc.) is beyond this course's scope; the goal is awareness that user input should never be trusted or used raw, a theme that continues into Week 7's security lesson.

---

### Slide 10 — Building Reusable Validation Middleware Files
**Explanation:** Organize validation chains into their own files (`validators/`), following the same organizational discipline established since Week 1, Day 2's MVC structure.
**Code example:**
```
project/
├── validators/
│   ├── authValidator.js
│   └── studentValidator.js
├── controllers/
├── routes/
├── models/
├── middleware/
```
**Instructor notes:** Point out this is the same "one concern, one folder" discipline from Week 1 — validation earns its own dedicated place in the project structure, just like routes, controllers, and models did.

---

### Slide 11 — Planning the Registration Validation Project
**Explanation:** Apply today's full toolkit to Week 3's registration endpoint specifically — the highest-stakes endpoint in the whole project so far, since it's the entry point for every new user.
**Instructor notes:** Frame this as "closing the loop" on Week 3's Authentication API — that endpoint worked, but had no real input validation until today.

---

### Slide 12 — Building the Registration Validation Project
**Code example:**
```javascript
// validators/authValidator.js
const { body, validationResult } = require("express-validator");

const registerValidation = [
  body("name").trim().notEmpty().escape().withMessage("Name is required"),
  body("email").trim().normalizeEmail().isEmail().withMessage("A valid email is required"),
  body("password")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
    .matches(/\d/).withMessage("Password must contain at least one number"),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = { registerValidation, validate };
```
```javascript
// routes/auth.js
const { registerValidation, validate } = require("../validators/authValidator");
router.post("/register", registerValidation, validate, register);
```
**Instructor notes:** Build and test incrementally: one validation rule at a time, confirming each triggers correctly in Postman before adding the next. By the end, students should have a registration endpoint that rejects bad data cleanly, with specific, helpful error messages — a genuinely production-appropriate result.

---

## 5. Practical Exercises During Class

1. **Validation chain drill:** Students write validation rules for a `Product` creation endpoint (name required, price must be a positive number).
2. **Bad data drill:** Students test their registration validation with 5 different kinds of bad input and confirm each produces a clear, specific error.
3. **Sanitization drill:** Students add `.trim()` and `.normalizeEmail()` to an existing validator and confirm messy input (extra whitespace, mixed-case email) is cleaned before reaching the controller.

---

## 6. Homework Assignment

- Add validation and sanitization to the login endpoint (recap Week 3, Day 1) — email format, password presence.
- Add validation to at least one other existing endpoint (e.g., Student or Product creation) from an earlier week's project.
- Test every validated endpoint with deliberately bad data, confirming clean 400 responses with helpful messages.

---

## 7. Mini Project — Registration Validation

**Brief:** "Add thorough, production-style input validation and sanitization to your registration endpoint."

**Requirements:**
- `express-validator` chains covering name, email, and password fields
- At least one custom rule beyond basic presence/format checking (e.g., password complexity via `.matches()`)
- Sanitization applied (`.trim()`, `.normalizeEmail()`, `.escape()` where appropriate)
- A shared `validate` middleware handling and formatting all validation errors consistently
- Fully tested in Postman with both valid and multiple kinds of invalid input

**Stretch goal:** Add a custom validator confirming a `confirmPassword` field matches the `password` field, using `express-validator`'s `.custom()` method.

---

## 8. Common Beginner Mistakes

- Forgetting to include the `validate` results-checking middleware after the validation chain, so rules run but never actually block bad requests.
- Confusing validation (checking) with sanitization (transforming) and expecting one to do the other's job.
- Writing validation rules that are too strict or too loose relative to the actual business need (e.g., rejecting legitimate international phone number formats).
- Forgetting order matters: sanitizers like `.trim()` should generally run before format checks like `.isEmail()` for best results.
- Not testing validation with genuinely malformed data during development, only realizing gaps once real users submit unexpected input.

---

## 9. Extra Resources

- [express-validator — Official Docs](https://express-validator.github.io/docs/)
- [OWASP — Input Validation Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)
- [Joi — Official Docs (alternative validation library)](https://joi.dev/api/)
