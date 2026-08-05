
# Week 6, Day 1 — Sending Emails, Nodemailer

**Khodz Academy — Backend Development Bootcamp**
**Session:** 16 of 24 | **Duration:** ~1.5–2 hours

---

## 1. Lesson Objectives

By the end of this lesson, students will be able to:

1. Explain how backend applications send emails.
2. Set up Nodemailer with a safe testing configuration.
3. Send a basic transactional email from an Express route.
4. Build HTML-formatted emails.
5. Organize email-sending logic cleanly for reuse.

---

## 2. Skills Students Will Learn

- Why applications need to send transactional emails (not marketing email — a distinct category)
- Installing and configuring Nodemailer
- Using a safe testing service (Mailtrap or Gmail with an app password) instead of risking real inboxes during development
- Sending a basic email with a subject, text, and HTML body
- Organizing email logic into a reusable `utils/sendEmail.js` helper

---

## 3. Detailed Teaching Outline (~1.5–2 hrs)

| Time | Segment |
|---|---|
| 0:00–0:15 | Recap Week 5 + show and tell (Profile Management APIs) |
| 0:15–0:25 | Why backend applications send email (Slides 1–2) |
| 0:25–0:45 | Setting up Nodemailer safely (Slides 3–6) — hands-on |
| 0:45–1:05 | Sending a basic email (Slides 7–9) — live coding |
| 1:05–1:20 | HTML emails and reusable helpers (Slides 10–11) — live coding |
| 1:20–1:30 | Recap, common mistakes, Q&A (Slide 12) |

---

## 4. Slide-by-Slide Presentation Content

### Slide 1 — Why Backend Applications Send Email
**Explanation:** Transactional emails — account verification, password resets, order confirmations — are triggered by a specific user action and sent automatically by the backend. This is distinct from marketing email (newsletters, promotions), which uses different tools and isn't this lesson's focus.
**Real-world example:** Every time a student registers on a real platform and receives a "Verify your email" message, a backend server (built the way this course teaches) triggered that email.
**Instructor notes:** Draw the transactional/marketing distinction clearly upfront — prevents scope confusion later, since students may have heard of tools like Mailchimp in a different context.

---

### Slide 2 — How Email Sending Fits the Backend
**Explanation:** Sending an email is, from a code perspective, similar to any other side effect covered this course (like a database write or file upload) — triggered by a controller, using a dedicated tool, ideally not blocking the main response unnecessarily.
**Instructor notes:** Recap the general "side effect" framing from React Bootcamp Week 4, Day 1 conceptually — even though that was frontend-specific, the underlying idea (an operation reaching outside normal request/response flow) transfers directly here.

---

### Slide 3 — What Is Nodemailer?
**Explanation:** Nodemailer is the standard Node.js library for sending emails from an application, supporting many different email providers and transport methods.
**Code example:**
```bash
npm install nodemailer
```
**Instructor notes:** Frame Nodemailer the same way as every other tool this course — well-tested, standard, don't reinvent it.

---

### Slide 4 — Why Testing Email Sending Safely Matters
**Explanation:** Sending real emails during development risks spamming real inboxes (including students' own) with test messages, and can also get a real email account flagged or rate-limited. A dedicated email-testing service avoids both problems.
**Instructor notes:** Set this expectation clearly before setup — prevents students from feeling like today's "test" setup is a lesser, throwaway version of the real thing; it's a genuine, common professional practice.

---

### Slide 5 — Setting Up a Safe Testing Service (Mailtrap)
**Explanation:** Mailtrap (or a similar service) provides a fake SMTP inbox — emails sent to it are captured and viewable in a dashboard, never actually delivered to real recipients, perfect for safe development and testing.
**Instructor notes:** Do this live: sign up for a free Mailtrap account, create a test inbox, and copy the provided SMTP credentials. Confirm every student has these credentials before continuing.

---

### Slide 6 — Configuring Nodemailer's Transporter
**Code example:**
```javascript
// config/mailer.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

module.exports = transporter;
```
```
# .env
SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your_mailtrap_user
SMTP_PASS=your_mailtrap_pass
```
**Instructor notes:** Recap Week 4, Day 3's centralized `config/` folder convention, and the now-familiar `.env`/`.gitignore` habit (fifth callback this course) — by this point, students should recognize and apply this pattern with minimal prompting.

---

### Slide 7 — Sending Your First Email
**Code example:**
```javascript
const transporter = require("../config/mailer");

const sendTestEmail = async (req, res) => {
  await transporter.sendMail({
    from: '"Khodz Academy" <no-reply@khodzacademy.com>',
    to: "student@example.com",
    subject: "Welcome to Khodz Academy!",
    text: "Thanks for joining. We're excited to have you.",
  });
  res.json({ message: "Email sent" });
};
```
**Instructor notes:** Run this live and check the Mailtrap dashboard together — seeing the captured email appear is today's first genuine "win" moment.

---

### Slide 8 — Understanding sendMail's Options
**Explanation:** `from`, `to`, `subject`, and `text`/`html` are the core fields — `from` is often a fixed, branded address; `to` comes from application data (e.g., the registering user's email).
**Instructor notes:** Point out `from` addresses in real production systems are usually verified/authenticated domains — a brief awareness note, full domain/DNS setup is beyond this course's scope.

---

### Slide 9 — Handling Email-Sending Errors
**Code example:**
```javascript
const sendTestEmail = asyncHandler(async (req, res, next) => {
  try {
    await transporter.sendMail({ /* ... */ });
    res.json({ message: "Email sent" });
  } catch (err) {
    next(new AppError("Failed to send email", 500));
  }
});
```
**Instructor notes:** Recap Week 4, Day 1's `asyncHandler`/`AppError` pattern directly — email sending is just another async operation that can fail and needs the same disciplined error handling as database calls or file uploads.

---

### Slide 10 — Sending HTML Emails
**Code example:**
```javascript
await transporter.sendMail({
  from: '"Khodz Academy" <no-reply@khodzacademy.com>',
  to: user.email,
  subject: "Welcome to Khodz Academy!",
  html: `
    <div style="font-family: sans-serif;">
      <h1>Welcome, ${user.name}!</h1>
      <p>We're excited to have you in the Khodz Academy community.</p>
    </div>
  `,
});
```
**Instructor notes:** Recap HTML fundamentals from Frontend Foundations Lesson 1 directly — "you're writing real HTML again, just as an email body instead of a webpage." Note that email HTML/CSS support is notoriously inconsistent across email clients — a brief, honest caveat, with full email-template best practices left as a topic for further independent exploration.

---

### Slide 11 — Building a Reusable sendEmail Helper
**Code example:**
```javascript
// utils/sendEmail.js
const transporter = require("../config/mailer");

const sendEmail = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: '"Khodz Academy" <no-reply@khodzacademy.com>',
    to,
    subject,
    html,
  });
};

module.exports = sendEmail;
```
```javascript
// Usage in a controller:
const sendEmail = require("../utils/sendEmail");

await sendEmail({
  to: user.email,
  subject: "Welcome!",
  html: `<h1>Welcome, ${user.name}!</h1>`,
});
```
**Instructor notes:** Recap the `utils/` folder convention from Week 4, Day 1 (`AppError`, `asyncHandler`) directly — `sendEmail` joins that same collection of small, reusable, well-tested helper functions used throughout the rest of the project.

---

### Slide 12 — Recap and What's Next
**Explanation:** Recap: transactional vs. marketing email, safe testing with Mailtrap, sending both plain-text and HTML emails, and a reusable `sendEmail` helper. Preview: Day 2 uses this exact helper to build real email verification — sending a confirmation link after registration.
**Instructor notes:** Point out explicitly: "the `sendEmail` function you built today is the exact tool tomorrow's verification feature — and Day 3's password reset — will both be built on top of."

---

## 5. Practical Exercises During Class

1. **Setup checkpoint:** Every student configures Nodemailer with Mailtrap credentials and sends a test email successfully.
2. **HTML email drill:** Students build a styled welcome email including the recipient's name dynamically.
3. **Helper refactor drill:** Students extract their working email-sending code into the `utils/sendEmail.js` pattern from Slide 11.

---

## 6. Homework Assignment

- Build a `sendEmail` helper (if not completed in class) and use it to send a styled "Welcome" email automatically upon successful registration (recap Week 3, Day 1's `register` controller — add the email call there).
- Test that registration still works correctly even if you temporarily provide invalid SMTP credentials (confirm the error is handled gracefully via `asyncHandler`/`AppError`, not a server crash).

---

## 7. Mini Project — Welcome Email on Registration

**Brief:** "Send a real, styled welcome email automatically whenever a new user registers."

**Requirements:**
- Nodemailer configured with a safe testing service (Mailtrap or equivalent)
- Reusable `sendEmail` helper function in `utils/`
- Registration endpoint (Week 3, Day 1) updated to send a welcome email upon successful signup
- HTML email including the user's name dynamically
- Errors in email sending handled gracefully, without crashing registration itself

**Stretch goal:** Design a slightly more polished HTML template (a header, a light background color, a call-to-action-style line) rather than a single unstyled paragraph.

---

## 8. Common Beginner Mistakes

- Using real personal email credentials directly in `.env` without an app-specific password (most providers require this for programmatic access — a good moment to briefly mention Gmail's "App Passwords" feature as an alternative to Mailtrap if students prefer it).
- Forgetting `await` before `transporter.sendMail()`, causing the response to be sent before confirming the email actually succeeded.
- Letting a failed email-send crash the entire registration flow, rather than handling it gracefully (a real design decision: should registration fail if the welcome email fails? Discuss briefly — usually not, but flag inconsistently as a common bug).
- Forgetting to add SMTP credentials to `.env`/`.gitignore`.
- Writing overly complex inline HTML directly in a controller instead of extracting it for readability (a light preview of more scalable templating approaches, beyond this course's scope).

---

## 9. Extra Resources

- [Nodemailer — Official Docs](https://nodemailer.com/about/)
- [Mailtrap — Getting Started](https://mailtrap.io/blog/nodemailer-gmail/)
- [MDN — HTML for Emails (general caveats)](https://developer.mozilla.org/en-US/docs/Web/HTML)
