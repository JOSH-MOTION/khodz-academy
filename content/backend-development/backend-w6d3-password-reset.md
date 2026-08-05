
# Week 6, Day 3 — Password Reset

**Khodz Academy — Backend Development Bootcamp**
**Session:** 18 of 24 | **Duration:** ~1.5–2 hours

---

## 1. Lesson Objectives

By the end of this lesson, students will be able to:

1. Design a secure password reset flow.
2. Build a "forgot password" endpoint that emails a reset link.
3. Build a "reset password" endpoint that safely updates a password using a valid token.
4. Apply the same security principles from email verification to a higher-stakes feature.
5. Complete a full Authentication System with Email.

---

## 2. Skills Students Will Learn

- Designing a secure "forgot password" flow (without leaking whether an email is registered)
- Reusing the token generation pattern from Day 2 for a new purpose
- Building `POST /forgot-password` and `POST /reset-password/:token` endpoints
- Re-hashing a new password securely
- Invalidating a reset token after use
- Reviewing the complete authentication system built across Weeks 3 and 6

---

## 3. Detailed Teaching Outline (~1.5–2 hrs)

| Time | Segment |
|---|---|
| 0:00–0:10 | Recap Day 2 + show and tell |
| 0:10–0:20 | Designing a secure reset flow (Slides 1–3) |
| 0:20–0:45 | Building forgot-password (Slides 4–7) — live coding |
| 0:45–1:10 | Building reset-password (Slides 8–10) — live coding |
| 1:10–1:25 | Testing the full flow + reviewing the whole auth system (Slides 11–12) |
| 1:25–1:30 | Recap, common mistakes, Q&A (Slide 13) |

---

## 4. Slide-by-Slide Presentation Content

### Slide 1 — Recap: Yesterday's Token Pattern
**Explanation:** Recall Day 2's flow: generate a secure token → email a link → verify the token on click. Today reuses this exact pattern for a new, higher-stakes purpose: safely resetting a forgotten password.
**Instructor notes:** Explicitly point out how much of today's code will look nearly identical to yesterday's — a genuinely efficient, confidence-building lesson because of that reuse.

---

### Slide 2 — Why Password Reset Is Higher-Stakes
**Explanation:** A password reset link, if intercepted or guessed, gives an attacker full account access — even more sensitive than email verification. Every design decision today should be evaluated with that higher stakes level in mind.
**Instructor notes:** Set a slightly more serious tone here than Day 2 — appropriate given the genuinely higher real-world consequences of getting this feature wrong.

---

### Slide 3 — The Full Reset Flow
**Explanation:** User requests reset (submits email) → server generates a token *only if* that email exists, but responds identically either way → server emails a reset link → user submits a new password with the token → server verifies the token and updates the password securely.
**Visual suggestion:** Flow diagram matching the explanation, highlighting the "identical response either way" step specifically.
**Instructor notes:** Flag that highlighted step now — it's explained fully on the next slide, but worth previewing as today's key security nuance.

---

### Slide 4 — Why the Response Must Be Identical Either Way
**Explanation:** If "forgot password" returned different messages for "email exists" vs. "email doesn't exist," an attacker could use that endpoint to discover which emails are registered on the platform — recap Week 3, Day 1's identical login error message principle directly; today applies that same idea to a new endpoint.
**Instructor notes:** This is a genuinely important, easy-to-miss security detail — spend real time on it, since the intuitive (but wrong) instinct is often to tell the user clearly "no account found with that email."

---

### Slide 5 — Adding Reset Fields to the User Model
**Code example:**
```javascript
const userSchema = new mongoose.Schema({
  // ...existing fields
  resetPasswordToken: String,
  resetPasswordExpires: Date,
});
```
**Instructor notes:** Recap Day 2's identical field-adding pattern — students should recognize this as familiar territory by now.

---

### Slide 6 — Building the Forgot-Password Endpoint
**Code example:**
```javascript
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    await sendEmail({
      to: user.email,
      subject: "Reset your Khodz Academy password",
      html: `
        <h1>Password Reset Request</h1>
        <p>Click the link below to reset your password. This link expires in 1 hour.</p>
        <a href="${resetLink}">Reset My Password</a>
        <p>If you didn't request this, you can safely ignore this email.</p>
      `,
    });
  }

  // Always send the same response, whether or not the user was found
  res.json({ message: "If an account exists for this email, a reset link has been sent." });
});
```
**Instructor notes:** Point out the `if (user)` wraps the entire token/email logic, but the response line sits *outside* that block, always running identically — walk through this control flow carefully, since it's the direct code implementation of Slide 4's security principle. Note the shorter, 1-hour expiry compared to Day 2's 24-hour verification link — appropriate given the higher stakes discussed on Slide 2.

---

### Slide 7 — Wiring the Forgot-Password Route
**Code example:**
```javascript
router.post("/forgot-password", forgotPassword);
```
**Instructor notes:** A quick, familiar step by now — no new concept, just applying the established routing pattern.

---

### Slide 8 — Building the Reset-Password Endpoint
**Code example:**
```javascript
const bcrypt = require("bcrypt");

const resetPassword = asyncHandler(async (req, res, next) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError("Invalid or expired reset link", 400));
  }

  user.password = newPassword;  // will be re-hashed by the pre-save hook (Week 3, Day 1)
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.json({ message: "Password reset successful. You can now log in with your new password." });
});
```
**Instructor notes:** Point out `user.password = newPassword` triggers Week 3, Day 1's `pre("save")` hook automatically — the new password gets hashed exactly the same way as during registration, with zero extra code needed here. This is a genuinely satisfying moment where an earlier lesson's design decision (the pre-save hook, rather than hashing manually in every controller) pays off directly.

---

### Slide 9 — Adding Password Validation to the Reset Endpoint
**Code example:**
```javascript
const resetPasswordValidation = [
  body("newPassword")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
    .matches(/\d/).withMessage("Password must contain at least one number"),
];
```
**Instructor notes:** Recap Week 4, Day 2's `express-validator` patterns directly — the same password strength rules from registration should apply equally here, a good consistency habit worth calling out.

---

### Slide 10 — Wiring the Reset-Password Route
**Code example:**
```javascript
router.post("/reset-password/:token", resetPasswordValidation, validate, resetPassword);
```
**Instructor notes:** Point out the full middleware chain — route parameter, validation chain, results checker, then the controller — a genuine synthesis of nearly every middleware pattern learned this course, stacked together in one line.

---

### Slide 11 — Testing the Full Reset Flow
**Explanation:** Request a reset for a real registered email, check Mailtrap for the link, copy the token, submit a new password, then confirm login works with the new password (and fails with the old one).
**Instructor notes:** This full flow test, including confirming the *old* password no longer works, is today's essential and most satisfying checkpoint.

---

### Slide 12 — Reviewing the Complete Authentication System
**Explanation:** Step back and review everything built across Week 3 and Week 6: registration with hashed passwords, login with JWTs, role-based authorization, email verification, and password reset — a genuinely complete, real authentication system.
**Visual suggestion:** Full flow diagram of the entire authentication system, all features labeled.
**Instructor notes:** This is a major milestone moment — explicitly connect back to the very first slide of Week 3, Day 1, which promised to replace React Bootcamp's mock `AuthContext`. That promise is now fully, completely delivered.

---

### Slide 13 — Recap and What's Next
**Explanation:** Recap: secure reset flow design, avoiding email enumeration, reusing the token pattern, and re-hashing passwords via the existing pre-save hook. This completes Week 6's Authentication System with Email. Preview: Week 7 shifts to advanced backend concerns — API security (CORS, rate limiting, Helmet), performance, and clean architecture — hardening everything built so far for real production use.
**Instructor notes:** Celebrate the completion of a genuinely comprehensive, professional-grade authentication system — this alone is a strong portfolio piece.

---

## 5. Practical Exercises During Class

1. **Security review drill:** Instructor shows a "forgot password" endpoint that leaks whether an email exists; students identify and fix the issue.
2. **Full build-along:** Every student builds forgot-password and reset-password with the instructor.
3. **End-to-end test drill:** Students perform the complete flow, confirming old password fails and new password succeeds after reset.

---

## 6. Homework Assignment

- Finish and fully test the password reset flow, including validation and expired-token test cases.
- Write a short paragraph summarizing, in your own words, the complete authentication system built across Weeks 3 and 6 — every feature, in the order a real user would encounter them.

---

## 7. Mini Project — Authentication System with Email (Final)

**Brief:** "Complete a full, production-style authentication system: registration, login, verification, and password reset, all working together."

**Requirements:**
- `POST /api/auth/forgot-password` never reveals whether an email is registered
- `POST /api/auth/reset-password/:token` validates the new password and correctly re-hashes it via the existing pre-save hook
- Reset tokens expire appropriately and are cleared after use
- Full flow tested end-to-end: forgot password → email received → reset → old password fails → new password succeeds
- Entire authentication system (registration, login, verification, reset, RBAC from Week 3) reviewed together and confirmed working cohesively

**Stretch goal:** Add rate limiting specifically to the `forgot-password` endpoint (a light preview of Week 7, Day 1) to prevent it from being used to spam a user's inbox repeatedly.

---

## 8. Common Beginner Mistakes

- Returning different messages/status codes for "email found" vs. "email not found" on the forgot-password endpoint, leaking account existence.
- Forgetting the reset token needs its own expiry check, separate from the verification token's fields (using the wrong field name by mistake).
- Setting `user.password` directly without realizing the pre-save hook handles hashing automatically, and manually (incorrectly) hashing it a second time.
- Not clearing reset token fields after a successful reset, allowing the same link to be reused.
- Skipping the "does the old password still fail" half of end-to-end testing, missing a bug where the update didn't actually take effect.

---

## 9. Extra Resources

- [OWASP — Forgot Password Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html)
- [Mongoose — Middleware (pre-save hook recap)](https://mongoosejs.com/docs/middleware.html)
- [Node.js — crypto Module Docs (recap)](https://nodejs.org/api/crypto.html)
