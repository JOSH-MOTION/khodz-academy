
# Week 8, Day 2 — Build & Debug

**Khodz Academy — React Development Bootcamp**
**Session:** 23 of 24 | **Duration:** ~1.5–2 hours (extended build/lab session)

---

## 1. Lesson Objectives

By the end of this lesson, students will be able to:

1. Execute their capstone plan, building core structure and primary features.
2. Debug React-specific issues efficiently using React DevTools and browser DevTools.
3. Diagnose and fix the most common bug categories seen throughout the course.
4. Ask targeted, well-formed questions when stuck (a professional/freelance skill in itself).
5. Reach a working, demoable state by the end of the session.

---

## 2. Skills Students Will Learn

- Systematic debugging workflow: reproduce → isolate → read the error → fix → verify
- Using React DevTools' Components panel to inspect props/state live
- Reading React error messages and stack traces
- Common React bug categories, revisited as a consolidated reference
- Using `console.log` strategically (recap Frontend Foundations Lesson 5–6) as a debugging tool, not just an output tool
- Asking for help effectively (specific, reproducible, minimal-example questions)

---

## 3. Detailed Teaching Outline (~1.5–2 hrs, lab-style)

| Time | Segment |
|---|---|
| 0:00–0:10 | Quick standup: each student states their Day 2 goal (recap yesterday's build order) |
| 0:10–0:25 | The debugging workflow (Slides 1–3) |
| 0:25–0:40 | Common bug categories review (Slides 4–8) |
| 0:40–1:20 | Guided build/lab time — instructor circulates (Slides 9–10) |
| 1:20–1:30 | End-of-session check-in, blockers logged for homework (Slide 11) |

---

## 4. Slide-by-Slide Presentation Content

### Slide 1 — Today Is a Build Session
**Explanation:** Unlike previous sessions, today is primarily hands-on lab time — the instructor's role shifts to circulating, debugging alongside students, and answering targeted questions, rather than lecturing new material.
**Instructor notes:** Set this expectation clearly at the start so students self-direct confidently rather than waiting for more slides.

---

### Slide 2 — The Debugging Workflow
**Explanation:** A systematic approach beats random guessing: (1) reproduce the bug reliably, (2) isolate where it's happening (which component/function), (3) read the actual error message carefully, (4) form a hypothesis and test a fix, (5) verify the fix and check nothing else broke.
**Visual suggestion:** Simple 5-step flow diagram.
**Instructor notes:** Model this explicitly on a live bug (either a planted one or a real one from a volunteering student) before releasing students to work independently.

---

### Slide 3 — Reading React Error Messages
**Explanation:** React error messages/warnings typically name the component and describe the specific issue (e.g., "Warning: Each child in a list should have a unique key prop") — read them fully rather than skimming past to search externally first.
**Instructor notes:** Pull up a real error from an earlier project and read it aloud, showing how much information is already there before ever needing to search or ask for help.

---

### Slide 4 — Bug Category: Rendering Issues
**Explanation:** Symptoms: blank screen, "nothing shows up." Common causes: missing `export default`, component not imported, JSX returning `null`/`undefined` unexpectedly, typo in a component name (lowercase first letter, recap Week 1, Day 2).
**Instructor notes:** Keep this as a quick-reference recap slide, not new teaching — the goal is a fast mental checklist students can run through independently.

---

### Slide 5 — Bug Category: State Not Updating
**Explanation:** Symptoms: clicking a button does nothing visually. Common causes: mutating state directly instead of using the setter (Week 1, Day 3), calling the handler immediately instead of passing a reference (`onClick={fn()}` vs `onClick={fn}`), forgetting `useState` import.
**Instructor notes:** Recap Week 1, Day 3's broken counter demo as the mental reference point for this whole bug category.

---

### Slide 6 — Bug Category: List/Key Warnings
**Explanation:** Symptoms: console warning about keys, or items behaving strangely on reorder/delete. Common causes: missing `key`, using array index as key on a reorderable list (Week 2, Day 2).
**Instructor notes:** Quick recap only — this category tends to resolve fast once flagged, since students already deeply understand the underlying cause from Week 2.

---

### Slide 7 — Bug Category: Effect/Fetch Issues
**Explanation:** Symptoms: infinite loops, data never appears, stale data. Common causes: missing/incorrect dependency array (Week 4, Day 1), `async` passed directly to `useEffect` (Week 4, Day 2), missing loading/error handling masking the real issue (Week 4, Day 3).
**Instructor notes:** This category is often the most time-consuming to debug — encourage students to add temporary `console.log`s inside the effect to trace exactly when/how often it's firing.

---

### Slide 8 — Bug Category: Routing Issues
**Explanation:** Symptoms: blank page at a route, `<Outlet>` content missing, redirect loops. Common causes: missing `<Outlet />` in a layout (Week 5, Day 2), incorrect relative vs. absolute paths (Week 5, Day 2), `ProtectedRoute` logic inverted or misapplied (Week 7, Day 3).
**Instructor notes:** Routing bugs can look scary (full blank page) but are almost always one of these three known causes — reassure students of this before they spiral into unrelated troubleshooting.

---

### Slide 9 — Using React DevTools Effectively
**Explanation:** The Components panel shows the live component tree, current props, and current state for any selected component — often faster than scattering `console.log`s everywhere.
**Instructor notes:** Do a live walkthrough on a real, complex capstone project (with a volunteering student) — inspecting state directly in DevTools to locate a real bug together, in front of the class.

---

### Slide 10 — Asking for Help Effectively
**Explanation:** A well-formed question includes: what you expected to happen, what actually happened, the relevant code (not the whole file), and what you've already tried. This is a professional and freelance skill — clients and teammates respond far better to specific questions.
**Instructor notes:** Frame this explicitly as a career skill, not just a classroom courtesy — connects to Frontend Foundations Lesson 8's "using AI tools responsibly" lesson on explaining problems clearly.

---

### Slide 11 — End-of-Session Check-In
**Explanation:** Each student briefly reports: what's working, what's blocked, and what homework time will focus on before Day 3's deployment session.
**Instructor notes:** Log blockers explicitly (a shared doc or simply verbally) so the instructor can follow up individually before Day 3 if a student is significantly behind — better to catch this now than at the deployment deadline.

---

## 5. Practical Exercises During Class

1. **Bug triage drill:** Instructor presents 3 mystery bugs (rendering, state, routing categories); students diagnose the likely category before even opening the code.
2. **Guided build time:** The majority of the session — students build their capstone with the instructor circulating for 1:1 debugging help.
3. **Peer debugging:** Students pair up for 10 minutes mid-session to debug each other's current blocker with fresh eyes.

---

## 6. Homework Assignment

- Continue building toward the Day 3 goals identified in Day 1's build order.
- Resolve any blockers logged at the end of today's session, using the debugging workflow (Slide 2) before asking for help.
- Ensure the app is in a genuinely demoable state (even if incomplete) by the start of Day 3 — partial but working beats broken and ambitious.

---

## 7. Mini Project — Capstone (Build Progress Checkpoint)

**Brief:** "Reach a working, demoable state on your capstone by the end of this session and homework period."

**Requirements:**
- Core routing and layout structure functioning
- Primary feature (the app's main value, per the Day 1 plan) working end-to-end, even if unstyled/rough
- No unresolved console errors (warnings are acceptable at this stage)
- A running list of remaining polish/features for Day 3

---

## 8. Common Beginner Mistakes

- Trying to build every planned feature at once instead of one at a time, verified working before moving to the next (recap the "small steps, test often" habit from Frontend Foundations Lesson 5).
- Getting stuck on a single bug for too long without stepping back to use the systematic workflow (Slide 2).
- Skipping React DevTools in favor of only `console.log`, missing a much faster diagnostic path.
- Not asking for help until significantly behind, rather than raising a blocker early per Slide 11's check-in.
- Scope creep — adding new feature ideas mid-build instead of sticking to the Day 1 plan (a real, common professional/freelance pitfall worth naming explicitly).

---

## 9. Extra Resources

- [React DevTools Browser Extension](https://react.dev/learn/react-developer-tools)
- [React — Common Error Messages Reference](https://react.dev/reference/react/Component#error-boundaries)
- Recap: all prior lesson documents (Weeks 1–7) as a personal reference library during debugging
