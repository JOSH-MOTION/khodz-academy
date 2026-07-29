
# Week 8, Day 3 — Deployment (Vercel) & Presentations

**Khodz Academy — React Development Bootcamp**
**Session:** 24 of 24 (Final Session) | **Duration:** ~2 hours (extended for presentations)

---

## 1. Lesson Objectives

By the end of this lesson, students will be able to:

1. Build a production build of a React app and understand what that means.
2. Deploy a React + Vite app to Vercel, including handling client-side routing correctly in production.
3. Write a professional README for the capstone project.
4. Present and demo their finished capstone project to the group.
5. Reflect on the full course journey and plan next steps (Module 3: Backend Development).

---

## 2. Skills Students Will Learn

- Running `npm run build` and understanding the production build output
- Deploying a Vite + React app to Vercel (recap Frontend Foundations Lesson 8's deployment lesson, now for an SPA)
- Configuring routing fallback/rewrites so React Router works correctly on Vercel (avoiding 404s on refresh)
- Writing a strong project README (recap Frontend Foundations Lesson 8)
- Presenting a technical project clearly and confidently
- Giving and receiving constructive peer feedback

---

## 3. Detailed Teaching Outline (~2 hrs)

| Time | Segment |
|---|---|
| 0:00–0:15 | Final build/polish time |
| 0:15–0:25 | Understanding production builds (Slides 1–2) |
| 0:25–0:50 | Deploying to Vercel (Slides 3–6) — hands-on |
| 0:50–1:00 | Writing the capstone README (Slide 7) |
| 1:00–1:50 | Capstone presentations (Slides 8–9) |
| 1:50–2:00 | Course recap, next steps, celebration (Slides 10–11) |

---

## 4. Slide-by-Slide Presentation Content

### Slide 1 — What Is a Production Build?
**Explanation:** During development, `npm run dev` runs an unoptimized version with helpful debugging tools. A production build (`npm run build`) compiles, minifies, and optimizes the app into static files ready for real users.
**Code example:**
```bash
npm run build
```
**Instructor notes:** Run this live and open the generated `dist/` folder — show the minified, optimized output files as concrete proof of what "building for production" actually produces.

---

### Slide 2 — Previewing the Production Build Locally
**Explanation:** Vite provides a preview command to test the production build locally before deploying, catching any build-specific issues early.
**Code example:**
```bash
npm run preview
```
**Instructor notes:** Encourage students to always preview locally before deploying — catches issues (like a missing environment variable) before they become a live, embarrassing bug.

---

### Slide 3 — Recap: Deploying with Vercel
**Explanation:** Recall Frontend Foundations Lesson 8: connect a GitHub repo to Vercel, and it auto-detects the framework and deploys automatically on every push.
**Instructor notes:** Confirm every student's capstone is pushed to GitHub with a reasonably clean commit history (recap Frontend Foundations Lesson 8's Git workflow) before proceeding — this is a hard prerequisite for today's deployment step.

---

### Slide 4 — Deploying a Vite + React App
**Code example:**
```
1. Push final code to GitHub
2. Go to vercel.com → New Project → Import your repository
3. Vercel auto-detects "Vite" as the framework
4. Add environment variables (e.g., VITE_OMDB_API_KEY) in Vercel's project settings
5. Click Deploy
```
**Instructor notes:** Point out step 4 explicitly — a very common deployment bug is forgetting that `.env` files (correctly gitignored, per Week 6, Day 3) don't get deployed automatically; environment variables must be re-added in Vercel's dashboard.

---

### Slide 5 — The React Router + Vercel Refresh Problem
**Explanation:** By default, refreshing a client-side route (e.g., `/dashboard/students`) directly on a deployed SPA can return a 404, because the server doesn't know about routes that only exist in JavaScript — Vercel needs a rewrite rule telling it to always serve `index.html` and let React Router handle routing client-side.
**Code example:**
```json
// vercel.json (place in project root)
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```
**Instructor notes:** This is the single most valuable practical fix of the day — demonstrate the bug first (deploy without this file, refresh a nested route, show the 404), then add the fix and redeploy to show it resolved. A memorable, concrete before/after.

---

### Slide 6 — Verifying the Live Deployment
**Explanation:** Test the live URL thoroughly: navigate between routes, refresh on a nested/dynamic route, test login/logout if applicable, test on mobile width, confirm no console errors.
**Instructor notes:** Treat this as a mini QA checklist — model the habit of never considering a deployment "done" until it's been manually tested end-to-end, live.

---

### Slide 7 — Writing the Capstone README
**Explanation:** Recap Frontend Foundations Lesson 8's README template, now for a React project: project description, tech stack (React, Tailwind, React Router, etc.), live demo link, features list, and screenshots.
**Code example:**
```markdown
# Recipe Finder

A React application for discovering and saving recipes, built as the capstone project for Khodz Academy's React Development Bootcamp.

## Tech Stack
- React + Vite
- Tailwind CSS
- React Router
- Context API
- [Recipe API name]

## Live Demo
https://recipe-finder.vercel.app

## Features
- Browse and search recipes via a live API
- View detailed recipe pages (dynamic routing)
- Save favorites (Context + localStorage)
- Fully responsive design

## Screenshots
![Homepage](screenshot-home.png)
![Recipe Detail](screenshot-detail.png)
```
**Instructor notes:** Have students write this now, while the project and deployment are fresh — much easier than reconstructing it later.

---

### Slide 8 — Presentation Format
**Explanation:** Each student gets ~3–4 minutes: what the app does and who it's for, a live demo of 2–3 key features, one technical highlight (something they're proud of or found challenging), and their live URL.
**Instructor notes:** Keep this tight and timed — with a full class, presentations can run long; a clear format keeps energy high and everyone gets a turn.

---

### Slide 9 — Giving Constructive Peer Feedback
**Explanation:** After each presentation, 1–2 quick peer comments: one specific thing that impressed them, one specific, kind suggestion. Keeps the session collaborative and reinforces a professional code-review mindset.
**Instructor notes:** Model the first round of feedback yourself to set the tone — specific and generous, not vague ("nice job") or harshly critical.

---

### Slide 10 — Full Course Recap
**Explanation:** Walk back through the entire 8-week arc: React fundamentals (components, state, lists, forms) → styling and reusability → effects and APIs → routing → Context and custom hooks → project organization → CRUD and auth concepts → capstone. Every student built 8 real, working projects.
**Visual suggestion:** The full 8-project roadmap graphic from Session 1, now shown fully completed, alongside a screenshot grid of every student's actual capstone.
**Instructor notes:** This is a genuinely earned "look how far you've come" moment — don't rush it.

---

### Slide 11 — What's Next: Module 3
**Explanation:** Preview Module 3: Backend Development (Node.js, Express, MongoDB, authentication, REST APIs) — this is where the "mock" login flow from Week 7 becomes a real, secure authentication system with a real database, and CRUD operations connect to data that's genuinely, permanently saved.
**Instructor notes:** Close on forward momentum — name specifically what becomes "real" next (auth, data persistence) since those were explicitly flagged as simplified/mocked throughout this course. Ends the course with a clear, motivating next step rather than a vague "good luck."

---

## 5. Practical Exercises During Class

1. **Deployment checkpoint:** Every student deploys their capstone live to Vercel, including the `vercel.json` rewrite fix.
2. **QA pass:** Students run the Slide 6 verification checklist against their own live deployment.
3. **Presentation:** Every student presents and demos their capstone to the group.

---

## 6. Homework Assignment

*(This is the final session — homework is optional continued polish.)*

- Address any peer feedback received during presentations.
- Continue refining the capstone as an ongoing portfolio piece — it doesn't need to "stop" being improved after the course ends.
- Consider enrolling in Module 3: Backend Development to continue the Khodz Academy learning path.

---

## 7. Final Project — Capstone Presentation & Deployment

**Brief:** "Deploy your capstone live and present it to the group — the culminating deliverable of the React Development Bootcamp."

**Requirements:**
- Live, working deployment on Vercel with correct SPA routing fallback (`vercel.json`)
- Environment variables correctly configured in Vercel (if applicable)
- Professional README with live demo link, tech stack, and features
- Clean GitHub commit history
- A clear 3–4 minute presentation/demo covering purpose, key features, and one technical highlight

**Grading rubric (informal, consistent with Frontend Foundations' final project rubric):**
- Structure & component organization
- Responsiveness & styling consistency
- State management (local, Context, or both, used appropriately)
- Routing implementation
- API/data handling (fetched or CRUD)
- Code cleanliness
- Deployment success
- README quality
- Presentation clarity

---

## 8. Common Beginner Mistakes

- Forgetting the `vercel.json` rewrite, causing 404s on any refreshed nested route in production.
- Forgetting to add environment variables to Vercel's dashboard, causing API calls to silently fail in production despite working locally.
- Deploying without previewing the production build locally first, missing build-specific issues.
- Under-preparing the presentation, leading to a disorganized or overly long demo.
- Treating the capstone as "finished forever" rather than an evolving portfolio piece worth continuing to polish.

---

## 9. Extra Resources

- [Vercel Documentation — Deploying Vite Projects](https://vercel.com/docs/frameworks/vite)
- [Vercel — Rewrites Configuration](https://vercel.com/docs/projects/project-configuration#rewrites)
- [Vite — Building for Production](https://vitejs.dev/guide/build.html)
- [Make a README](https://www.makeareadme.com/) (recap from Frontend Foundations)
