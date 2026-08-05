
# Week 8, Day 2 — Debugging, Monitoring, and Production Readiness

**Khodz Academy — Backend Development Bootcamp**
**Session:** 23 of 24 | **Duration:** ~1.5–2 hours

---

## 1. Lesson Objectives

By the end of this lesson, students will be able to:

1. Systematically debug a live, deployed API when something goes wrong.
2. Read and interpret production logs effectively.
3. Add basic health-check and monitoring endpoints.
4. Explain what "production readiness" means in practical terms.
5. Perform a final production-readiness review of their capstone project.

---

## 2. Skills Students Will Learn

- A systematic approach to debugging deployed (not just local) applications
- Reading platform logs (Render/Railway) to diagnose real issues
- Building a `/health` check endpoint
- Basic uptime monitoring concepts
- A practical, checklist-based definition of "production ready"
- Final review and polish of a capstone project

---

## 3. Detailed Teaching Outline (~1.5–2 hrs)

| Time | Segment |
|---|---|
| 0:00–0:10 | Recap Day 1 + deployment show and tell |
| 0:10–0:30 | Systematic debugging of live apps (Slides 1–4) |
| 0:30–0:50 | Health checks and monitoring (Slides 5–7) — live coding |
| 0:50–1:15 | Production readiness checklist and review (Slides 8–10) |
| 1:15–1:30 | Final polish time + recap (Slides 11–12) |

---

## 4. Slide-by-Slide Presentation Content

### Slide 1 — Debugging Changes When an App Is Live
**Explanation:** Locally, debugging means reading terminal output and `console.log()` directly. Once deployed, students must instead rely on the hosting platform's log viewer, and can't simply add a `console.log()` and instantly see it without redeploying — debugging live apps requires more deliberate, upfront thinking.
**Instructor notes:** Set this expectation clearly — the goal today isn't new tools so much as a more disciplined, systematic mindset applied to familiar debugging skills.

---

### Slide 2 — A Systematic Debugging Approach
**Explanation:** When something breaks in production: (1) reproduce the issue and note the exact request/response, (2) check the platform's logs for the relevant error, (3) check environment variables are correctly set (recall Week 8, Day 1's most common deployment mistake), (4) check Atlas for connection or data issues, (5) test the same request locally to isolate whether it's an environment-specific problem.
**Instructor notes:** Present this as a genuine, repeatable checklist — professional developers don't debug randomly; they follow a process very similar to this one.

---

### Slide 3 — Common Production-Only Issues
**Explanation:** Issues that appear only in production and not locally: missing environment variables (Day 1), CORS misconfiguration for the real deployed frontend URL (recall Week 7, Day 1), Atlas network access blocking the server, and forgetting to update `CLIENT_URL` from a local value to a real deployed frontend URL.
**Instructor notes:** Walk through each with a concrete "symptom → likely cause" pairing — e.g., "requests work in Postman but fail from a browser" strongly suggests CORS, since Postman is not subject to CORS (recap Week 7, Day 1's common mistake).

---

### Slide 4 — Reading Platform Logs Effectively
**Explanation:** Both Render and Railway show real-time logs — filter or scroll for `Error`, stack traces, or the specific custom error messages built throughout this course (recall Week 4, Day 1's `AppError` class), which should appear in production logs exactly as they did locally.
**Instructor notes:** Point out this is another place Week 4's investment in clear, consistent custom error messages directly pays off — a vague generic error would be far harder to diagnose from a scrolling production log.

---

### Slide 5 — Why Health Checks Matter
**Explanation:** A health check is a simple endpoint confirming the API (and its database connection) is alive and responding correctly — useful for hosting platforms, monitoring tools, or simply a quick manual sanity check without needing full authentication or business logic.
**Instructor notes:** Frame this as a small addition with outsized practical value — a single endpoint that instantly answers "is my API actually working right now?"

---

### Slide 6 — Building a Health Check Endpoint
**Code example:**
```javascript
app.get("/health", (req, res) => {
  const dbState = mongoose.connection.readyState; // 1 = connected
  res.status(200).json({
    status: "ok",
    database: dbState === 1 ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  });
});
```
**Instructor notes:** Recap Week 2, Day 1's `mongoose.connect()` — explain `mongoose.connection.readyState` as a simple, built-in way to check the current database connection status without a real query.

---

### Slide 7 — Basic Uptime Monitoring (Conceptual)
**Explanation:** Free external tools (e.g., UptimeRobot) can periodically ping a deployed `/health` endpoint and alert if it stops responding — a lightweight, real-world monitoring practice, introduced conceptually here rather than set up hands-on.
**Instructor notes:** Mention this as an optional, easy next step students can set up entirely on their own after the course — a genuinely practical, low-effort addition to any deployed portfolio project.

---

### Slide 8 — What Does "Production Ready" Actually Mean?
**Explanation:** A practical, non-exhaustive checklist synthesizing this entire course: environment variables correctly configured, no secrets committed to Git, input validated (Week 4), errors handled centrally and consistently (Week 4), authentication and authorization working correctly (Weeks 3, 6), security headers and rate limiting applied (Week 7), reasonable performance for expected scale (Week 7), API documented (Week 4), and now — deployed, health-checked, and monitorable (Week 8).
**Instructor notes:** This slide is intentionally a full-course synthesis — walk through it slide by slide, explicitly naming which week each item came from, mirroring last week's Slide 7 architecture review but now at the level of the entire course.

---

### Slide 9 — Auditing the Capstone Against the Checklist
**Explanation:** Students spend focused time auditing their own capstone project against Slide 8's full checklist, fixing any real gaps found before tomorrow's final presentation.
**Instructor notes:** Circulate actively during this segment — this is genuinely valuable, individualized instructor time, more useful than any additional new material at this late stage of the course.

---

### Slide 10 — Preparing to Present
**Explanation:** Tomorrow's final session is a capstone presentation — students should prepare to briefly demo their project's key features live (via the deployed URL and Postman or a simple test page), explain key technical decisions, and discuss one challenge they overcame.
**Instructor notes:** Give clear, concrete expectations now so students can prepare deliberately overnight rather than scrambling tomorrow morning.

---

### Slide 11 — Final Polish Time
**Explanation:** Remaining class time dedicated to final fixes, documentation cleanup, and rehearsing the capstone demo — genuinely important, unstructured but purposeful time before the final session.
**Instructor notes:** Stay available for individual troubleshooting help during this segment — for many students this is the most valuable part of today's session.

---

### Slide 12 — Recap and What's Next
**Explanation:** Recap: systematic debugging for live apps, health checks, monitoring concepts, and a full production-readiness review synthesizing the entire course. Preview: Day 3 is the final capstone presentation, code review, and career guidance — the conclusion of the Backend Development Bootcamp.
**Instructor notes:** Acknowledge explicitly how far students have come — from a single `res.send("Hello")` in Week 1, Day 1 to a fully deployed, secured, documented, production-ready API today.

---

## 5. Practical Exercises During Class

1. **Debugging drill:** Instructor deliberately introduces a production-only bug (e.g., a missing environment variable on the platform) and has students diagnose it using Slide 2's systematic approach.
2. **Health check build-along:** Every student adds a `/health` endpoint to their capstone project and confirms it via the live deployed URL.
3. **Checklist audit drill:** Students work through Slide 8's full checklist against their own capstone project individually, with instructor support.

---

## 6. Homework Assignment

- Complete any remaining items from the Slide 8 production-readiness checklist on your capstone project.
- Prepare a brief (5–7 minute) demo of your capstone project for tomorrow's final presentation.
- Write down one specific technical challenge you overcame during this course and how you solved it, to share during your presentation.

---

## 7. Mini Project — Production-Ready Capstone (Final Review)

**Brief:** "Complete a full production-readiness review of your capstone project ahead of tomorrow's final presentation."

**Requirements:**
- `/health` endpoint added and confirmed working on the live deployed URL
- Full audit completed against the Slide 8 production-readiness checklist, with any real gaps fixed
- Project README fully updated with live URL, endpoint summary, and setup instructions
- A brief demo plan prepared for tomorrow's presentation

---

## 8. Common Beginner Mistakes

- Confusing a local bug with a production-only bug, wasting time debugging the wrong environment.
- Building a `/health` endpoint that only confirms the server process is running, without actually checking the database connection — giving a false sense of confidence.
- Leaving the production-readiness audit until the very last minute instead of using today's dedicated class time for it.
- Preparing a demo that only shows the "happy path," without being ready to briefly explain how errors or edge cases are handled.
- Not testing the deployed `/health` endpoint itself before assuming it works correctly.

---

## 9. Extra Resources

- [Render — Debugging Deploys](https://render.com/docs/troubleshooting-deploys)
- [Mongoose — Connection ReadyState Documentation](https://mongoosejs.com/docs/api/connection.html#Connection.prototype.readyState)
- [UptimeRobot — Free Uptime Monitoring (external reference)](https://uptimerobot.com/)
- [The Twelve-Factor App — Full Methodology (course-wide synthesis reference)](https://12factor.net/)
