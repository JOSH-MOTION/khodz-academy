
# Week 6, Day 2 — Email Verification

**Khodz Academy — Backend Development Bootcamp**
**Session:** 17 of 24 | **Duration:** ~1.5–2 hours

---

## 1. Lesson Objectives

By the end of this lesson, students will be able to:

1. Explain why email verification matters for real applications.
2. Generate a secure, unique verification token.
3. Send a verification email containing a clickable link.
4. Build an endpoint that verifies a user's email when the link is visited.
5. Restrict certain actions to verified users only.

---

## 2. Skills Students Will Learn

- Adding `isVerified` and token-related fields to the `User` model
- Generating secure random tokens with Node's built-in `crypto` module
- Building a verification link and sending it via email
- Building a `GET /api/auth/verify/:token` endpoint
- Token expiry handling
- Middleware to restrict actions to verified users

---

## 3. Detailed Teaching Outline (~1.5–2 hrs)

| Time | Segment |
|---|---|
| 0:00–0:10 | Recap Day 1 + show and tell |
| 0:10–0:20 | Why email verification matters (Slides 1–2) |
| 0:20–0:40 | Adding verification fields and generating tokens (Slides 3–6) — live coding |
| 0:40–1:00 | Sending the verification email (Slides 7–8) — live coding |
| 1:00–1:20 | Building the verification endpoint (Slides 9–11) — live coding |
| 1:20–1:30 | Restricting unverified users, recap (Slide 12) |

---

## 4. Slide-by-Slide Presentation Content

### Slide 1 — Why Email Verification Matters
**Explanation:** Verification confirms a user actually owns the email address they registered with — prevents fake accounts, typo'd emails silently failing to receive important messages, and provides a foundation for account recovery (Day 3's password reset depends on this same trust).
**Real-world example:** Nearly every real platform students have ever signed up for required clicking a verification link before full access — today builds that exact, familiar flow.
**Instructor notes:** Ask students to recall their own experience verifying an email somewhere recently — grounds the lesson in lived, familiar experience before any code appears.

---

### Slide 2 — The Verification Flow, End to End
**Explanation:** Register → server generates a unique token → server emails a link containing that token → user clicks it → server verifies the token and marks the account as verified.
**Visual suggestion:** 5-step flow diagram matching the explanation.
**Instructor notes:** Keep this diagram visible throughout the lesson — today's code builds each of these five steps in order.

---

### Slide 3 — Adding Verification Fields to the User Model
**Code example:**
```javascript
const userSchema = new mongoose.Schema({
  // ...existing fields
  isVerified: { type: Boolean, default: false },
  verificationToken: String,
  verificationTokenExpires: Date,
});
```
**Instructor notes:** Recap Week 2, Day 2's schema field patterns directly — no new Mongoose concepts here, just applying established skills to new fields.

---

### Slide 4 — Generating a Secure Token
**Explanation:** Node's built-in `crypto` module can generate cryptographically random values — far more secure and unpredictable than something like `Math.random()` (recap React Bootcamp Week 2, Day 3's `Date.now()`-based id generation, explicitly *not* appropriate here since it's predictable).
**Code example:**
```javascript
const crypto = require("crypto");

const token = crypto.randomBytes(32).toString("hex");
console.log(token); // a long, random hexadecimal string
```
**Instructor notes:** Contrast explicitly with that earlier `Date.now()`-based id pattern — "that was fine for a local to-do app's item ids; it would be a serious security flaw for something like a verification token, which must be unguessable."

---

### Slide 5 — Setting Token Expiry
**Code example:**
```javascript
const tokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now
```
**Instructor notes:** Recap Week 3, Day 2's JWT `expiresIn` concept — "same underlying idea (limited-time validity), implemented manually here since this isn't a JWT, just a stored token with its own expiry field."

---

### Slide 6 — Generating and Saving the Token on Registration
**Code example:**
```javascript
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const verificationToken = crypto.randomBytes(32).toString("hex");
  const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

  const user = await User.create({
    name, email, password, verificationToken, verificationTokenExpires,
  });

  // sending the email happens next (Slide 7-8)

  res.status(201).json({ message: "Registered. Please check your email to verify your account." });
});
```
**Instructor notes:** Point out the response message no longer includes user data directly — a deliberate change reflecting that the account isn't fully "ready" until verified; discuss this UX decision briefly as a real design choice, not an arbitrary one.

---

### Slide 7 — Building the Verification Link
**Code example:**
```javascript
const verificationLink = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;
```
```
# .env
CLIENT_URL=http://localhost:5173
```
**Instructor notes:** Explain `CLIENT_URL` — recall this course's frontend counterparts (Frontend Foundations/React Bootcamp) would run on a URL like this; the backend constructs a link *pointing to the frontend*, which would then call this API's verification endpoint. Note this course doesn't build that frontend page, but the link is designed exactly as if it would.

---

### Slide 8 — Sending the Verification Email
**Code example:**
```javascript
const sendEmail = require("../utils/sendEmail");

await sendEmail({
  to: user.email,
  subject: "Verify your Khodz Academy account",
  html: `
    <h1>Welcome, ${user.name}!</h1>
    <p>Please verify your email by clicking the link below:</p>
    <a href="${verificationLink}">Verify My Email</a>
    <p>This link expires in 24 hours.</p>
  `,
});
```
**Instructor notes:** Direct reuse of Day 1's `sendEmail` helper — point out explicitly this is exactly why that reusable helper was built yesterday, rather than writing one-off email code again today.

---

### Slide 9 — Building the Verification Endpoint
**Code example:**
```javascript
// controllers/authController.js
const verifyEmail = asyncHandler(async (req, res, next) => {
  const { token } = req.params;

  const user = await User.findOne({
    verificationToken: token,
    verificationTokenExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError("Invalid or expired verification link", 400));
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpires = undefined;
  await user.save();

  res.json({ message: "Email verified successfully!" });
});
```
**Instructor notes:** Explain `$gt: Date.now()` (MongoDB's "greater than" query operator) — recap Week 2, Day 3's query-building skills, applied to date comparison for the first time; this single query elegantly handles both "token doesn't exist" and "token expired" cases at once. Point out clearing the token fields after successful verification — a good hygiene practice, preventing token reuse.

---

### Slide 10 — Wiring the Route
**Code example:**
```javascript
router.get("/verify/:token", verifyEmail);
```
**Instructor notes:** Recap Week 1, Day 3's route parameters directly — no new routing concept, just applying it to this specific feature.

---

### Slide 11 — Testing the Full Verification Flow
**Explanation:** Register a new user in Postman, check Mailtrap for the verification email, copy the token from the link, and hit the verification endpoint manually to confirm the account becomes verified in Atlas.
**Instructor notes:** This full, manual end-to-end test (since there's no frontend to click through) is today's essential checkpoint — walk through it together as a class before releasing students to test independently.

---

### Slide 12 — Restricting Unverified Users, Recap, and What's Next
**Explanation:** Optionally, build middleware requiring `isVerified` before allowing certain actions (e.g., posting content, making purchases) — a light extension of Week 3, Day 3's `authorize` pattern, now checking a boolean field instead of a role.
**Code example:**
```javascript
const requireVerified = (req, res, next) => {
  if (!req.user.isVerified) {
    return res.status(403).json({ error: "Please verify your email first" });
  }
  next();
};
```
**Explanation (recap):** Recap: why verification matters, secure token generation, the full verification email flow, and a working verification endpoint. Preview: Day 3 applies this exact same token pattern to password reset — completing Week 6's Authentication System with Email.
**Instructor notes:** Point out explicitly: "tomorrow's password reset uses almost the identical pattern you just built today — generate a token, email a link, verify the token on a click. You're about to see how much of today's work pays off immediately."

---

## 5. Practical Exercises During Class

1. **Token generation drill:** Students generate several tokens with `crypto.randomBytes()` and confirm each is unique.
2. **Full build-along:** Every student builds the verification token fields, email sending, and verification endpoint with the instructor.
3. **End-to-end test drill:** Students perform the full register → check Mailtrap → verify flow independently.

---

## 6. Homework Assignment

- Finish and fully test email verification, including both a valid token and a deliberately expired/invalid token test case.
- Add the `requireVerified` middleware to at least one existing protected route (your choice) and confirm it correctly blocks unverified users.

---

## 7. Mini Project — Email Verification System

**Brief:** "Add real, secure email verification to your registration flow."

**Requirements:**
- `isVerified`, `verificationToken`, `verificationTokenExpires` fields added to the `User` model
- Registration generates a secure token and sends a verification email using the Day 1 `sendEmail` helper
- `GET /api/auth/verify/:token` correctly verifies valid tokens and rejects invalid/expired ones
- Token fields cleared after successful verification
- At least one route protected by a `requireVerified` middleware
- Fully tested end-to-end via Mailtrap and Postman

**Stretch goal:** Add a `POST /api/auth/resend-verification` endpoint that generates and sends a fresh token/email for users who didn't verify in time.

---

## 8. Common Beginner Mistakes

- Using `Math.random()` or `Date.now()`-based tokens instead of `crypto.randomBytes()`, producing guessable, insecure tokens.
- Forgetting to check token expiry, allowing old, potentially leaked tokens to remain valid indefinitely.
- Not clearing the token fields after successful verification, allowing the same link to be "used" again (harmless in this case, but a good hygiene habit regardless).
- Forgetting to build the verification link using `CLIENT_URL` and instead hardcoding a placeholder that doesn't match any real intended destination.
- Testing only the "happy path" (valid token) and never testing an expired or tampered token.

---

## 9. Extra Resources

- [Node.js — crypto Module Docs](https://nodejs.org/api/crypto.html)
- [MongoDB — Comparison Query Operators ($gt, etc.)](https://www.mongodb.com/docs/manual/reference/operator/query-comparison/)
- [OWASP — Forgot Password Cheat Sheet (token design principles apply here too)](https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html)
