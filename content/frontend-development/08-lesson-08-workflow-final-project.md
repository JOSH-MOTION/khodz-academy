
# Lesson 8 — Professional Workflow + Final Project

**Khodz Academy — Frontend Development Foundations**
**Class:** 8 of 8 | **Duration:** ~2.5 hours (plus final presentation day if scheduled separately)

---

## 1. Lesson Objectives

By the end of this lesson, students will be able to:

1. Use Git to track changes to their code.
2. Push code to GitHub and manage a basic repository.
3. Write a clear, professional README file.
4. Deploy a live website using Vercel or GitHub Pages.
5. Use Chrome DevTools to debug layout and JavaScript issues.
6. Use AI coding tools (like Claude) responsibly as a learning aid.
7. Read technical documentation independently.
8. Plan, build, and deploy a complete Final Business Website — a portfolio-ready capstone.

---

## 2. Skills Students Will Learn

- Git basics: `init`, `add`, `commit`, `status`, `log`
- GitHub basics: creating a repo, `push`, `pull`, cloning, the general team workflow
- Writing a professional README (what it is, why it matters, structure)
- Deployment via Vercel (recommended, fastest) and GitHub Pages (alternative, free)
- Chrome DevTools: Elements, Console, Network tabs for debugging
- Responsible AI-assisted coding: using AI to learn/unblock vs. copy-pasting blindly
- Reading official documentation instead of relying only on tutorials
- Assembling a complete, deployed capstone project

---

## 3. Detailed Teaching Outline (2.5 hrs)

| Time | Segment |
|---|---|
| 0:00–0:10 | Show and tell: API projects from Lesson 7 |
| 0:10–0:35 | Git basics (Slides 1–5) — hands-on |
| 0:35–0:55 | GitHub + pushing code (Slides 6–9) — hands-on |
| 0:55–1:05 | Writing a great README (Slide 10) |
| 1:05–1:15 | **Break** |
| 1:15–1:35 | Deployment with Vercel/GitHub Pages (Slides 11–13) — hands-on |
| 1:35–1:50 | DevTools debugging (Slides 14–15) |
| 1:50–2:00 | Using AI tools responsibly + reading docs (Slides 16–17) |
| 2:00–2:30 | Final Project briefing, planning time, Q&A (Slides 18–20) |

*(Final Project build happens primarily as an extended homework/project week; consider scheduling a separate "Demo Day" session.)*

---

## 4. Slide-by-Slide Presentation Content

### Slide 1 — Why Version Control Matters
**Explanation:** Version control tracks every change to your code over time, lets you undo mistakes, and lets multiple people work on the same project without overwriting each other. Git is the industry-standard tool for this.
**Real-world example:** Every company and freelance team uses Git — it's as fundamental as knowing how to use a text editor.
**Instructor notes:** Frame this as non-negotiable professional infrastructure, not an optional extra — every project from here on should be tracked in Git.

---

### Slide 2 — Git vs GitHub
**Explanation:** **Git** is the tool that tracks changes on your computer (works offline). **GitHub** is a website that hosts your Git repositories online, so you can back up code, share it, and showcase a portfolio.
**Visual suggestion:** Two-box diagram: Git (local, on your laptop) → push → GitHub (remote, online).
**Instructor notes:** This distinction is commonly muddled by beginners — repeat it a couple of times in different words.

---

### Slide 3 — Initializing a Repository
**Explanation:** `git init` turns a folder into a Git repository, starting change tracking.
**Code example:**
```bash
cd business-website
git init
```
**Instructor notes:** Do this live in the terminal with a project folder from earlier in the course — grounds it in something students already recognize.

---

### Slide 4 — The Core Git Workflow: add, commit, status
**Explanation:** `git status` shows what's changed. `git add` stages changes (marks them ready to save). `git commit -m "message"` saves a snapshot with a description.
**Code example:**
```bash
git status
git add .
git commit -m "Add hero section and navbar"
```
**Instructor notes:** Emphasize writing clear, specific commit messages ("Add hero section" not "update") — a habit that matters a lot in real team environments.

---

### Slide 5 — Viewing History
**Explanation:** `git log` shows the history of commits — a timeline of every saved change.
**Code example:**
```bash
git log --oneline
```
**Instructor notes:** Show a project with several commits already made (prepared in advance) so students see a realistic history, not just one lonely commit.

---

### Slide 6 — Creating a GitHub Account and Repository
**Explanation:** Sign up at github.com (free), create a new repository (a project space), matching the local folder name.
**Instructor notes:** Do this live, step by step — account creation and repo creation are common early friction points worth walking through carefully together.

---

### Slide 7 — Connecting Local Git to GitHub
**Explanation:** Link a local repo to a GitHub repo, then push code up.
**Code example:**
```bash
git remote add origin https://github.com/username/business-website.git
git branch -M main
git push -u origin main
```
**Instructor notes:** Warn students this is the step most likely to hit an authentication prompt (browser login or token) — walk through whichever auth method GitHub currently uses for new users.

---

### Slide 8 — Making Further Changes and Pushing Updates
**Explanation:** After the first push, the day-to-day loop is: edit code → `add` → `commit` → `push`.
**Code example:**
```bash
git add .
git commit -m "Fix mobile navbar spacing"
git push
```
**Instructor notes:** Reinforce this as a habit to build immediately, not just for today's project — recommend committing after every meaningful chunk of work, not just at the end of a session.

---

### Slide 9 — Cloning a Repository
**Explanation:** `git clone <url>` downloads a copy of any GitHub repository — useful for working on another computer or contributing to someone else's project.
**Code example:**
```bash
git clone https://github.com/username/business-website.git
```
**Instructor notes:** Mention this briefly — full collaboration workflows (branches, pull requests) are beyond this course's scope, but students should recognize `clone` when they see it.

---

### Slide 10 — Writing a Professional README
**Explanation:** A README is the first thing anyone sees on a GitHub repo — it should explain what the project is, the tech used, how to run it, and include a screenshot/live link.
**Code example:**
```markdown
# Business Website

A responsive landing page built for [Business Name], showcasing services and driving customer sign-ups.

## Tech Stack
- HTML5
- Tailwind CSS
- JavaScript

## Live Demo
https://business-website.vercel.app

## Features
- Fully responsive design
- Interactive navigation with mobile menu
- Contact form with validation

## Screenshots
![Homepage screenshot](screenshot.png)
```
**Instructor notes:** Have students write their README for a past project (e.g., the SaaS landing page) as practice before doing it for the final project — treat this as a portfolio-presentation skill, not busywork.

---

### Slide 11 — What Is Deployment?
**Explanation:** Deployment publishes your website to a public URL anyone can visit, instead of it only existing on your own computer.
**Real-world example:** The difference between a website only you can see in VS Code's Live Server vs. one a client or employer can open from anywhere.
**Instructor notes:** Connect back to Lesson 1's client-server model — "now your own computer becomes irrelevant; the site lives on a real server."

---

### Slide 12 — Deploying with Vercel
**Explanation:** Vercel connects directly to a GitHub repo and auto-deploys on every push — the fastest, most modern option, and free for personal projects.
**Code example:**
```
1. Sign up at vercel.com with GitHub
2. Click "New Project"
3. Select your repository
4. Click "Deploy"
5. Get a live URL: your-project.vercel.app
```
**Instructor notes:** Do a full live deploy together, end to end, using one student's actual project if time allows — nothing beats watching a real URL go live in real time.

---

### Slide 13 — Deploying with GitHub Pages (Alternative)
**Explanation:** GitHub Pages hosts static sites directly from a repository, free — a good simple alternative, especially for single HTML/CSS/JS projects without a build step.
**Code example:**
```
1. Go to your repo's Settings > Pages
2. Select branch: main, folder: / (root)
3. Save — site publishes at:
   https://username.github.io/repo-name/
```
**Instructor notes:** Mention it's slightly less beginner-friendly for projects that later add build tools (like Tailwind CLI) — Vercel scales better as students' projects grow in complexity, which is why it's the primary recommendation.

---

### Slide 14 — Chrome DevTools: Elements and Styles
**Explanation:** The Elements panel shows the live DOM and lets you inspect/edit HTML and CSS in real time — the fastest way to debug layout and styling issues.
**Instructor notes:** Revisit Lesson 6's DevTools intro, now going deeper: show how to click an element on the page and jump straight to its DOM node and applied Tailwind classes.

---

### Slide 15 — Chrome DevTools: Console and Network
**Explanation:** The Console tab shows JavaScript errors and `console.log` output — the first place to check when something "isn't working." The Network tab shows API requests/responses — useful for debugging fetch calls from Lesson 7.
**Instructor notes:** Deliberately introduce a bug (typo a selector, break a fetch URL) and debug it live using Console + Network — teaches the actual debugging *process*, not just the tool names.

---

### Slide 16 — Using AI Tools Responsibly
**Explanation:** AI tools (like Claude, ChatGPT) are excellent for explaining errors, suggesting approaches, and speeding up repetitive work — but should be used to *learn*, not to copy-paste code you don't understand. A good habit: ask AI to explain *why*, not just *what*, and always test/understand the result.
**Instructor notes:** Be balanced and honest here — don't ban AI tools, but set the expectation clearly: "if you can't explain what a line of code does in an interview or to a client, you haven't actually learned it yet."

---

### Slide 17 — Reading Documentation
**Explanation:** Official docs (MDN, Tailwind docs, API docs) are the most reliable source of truth — more accurate than random blog posts or outdated tutorials. Practice: search a concept directly on the Tailwind or MDN docs site instead of only searching generic web results.
**Instructor notes:** Live-demo looking something up on Tailwind's docs and MDN together — model the actual behavior of an independent, self-sufficient developer.

---

### Slide 18 — Final Project Briefing
**Explanation:** The Final Project is a complete, deployed **Business Website** — synthesizing everything from the course: semantic HTML, Tailwind styling, full responsiveness, a working form, at least one JavaScript-powered interactive feature, and (optionally) one API-driven feature.
**Visual suggestion:** Checklist graphic summarizing the requirements (see Section 7 below).
**Instructor notes:** Present this as the capstone that becomes the centerpiece of each student's portfolio when applying for jobs or freelance clients.

---

### Slide 19 — Final Project Requirements Walkthrough
**Explanation:** Walk through the full requirements list line by line (see Section 7), answering questions and clarifying scope before students go off to build independently.
**Instructor notes:** Encourage students to pick a business type they personally find interesting — motivation matters more for a capstone than for earlier smaller drills.

---

### Slide 20 — Course Recap and Next Steps
**Explanation:** Recap the full journey: HTML → Tailwind → responsive components → forms → JavaScript fundamentals → DOM → APIs → Git/deployment. Preview: this course prepares students directly for **React**, the next step in the Khodz Academy track, where the "component thinking" seeded throughout this course (cards, reusable buttons, sections) becomes formalized.
**Visual suggestion:** Full 8-lesson roadmap graphic (from Lesson 1, Slide 2) shown again, now fully checked off.
**Instructor notes:** End on a genuinely celebratory note — review the very first "what you'll build" slide from Lesson 1 side-by-side with what they actually built. This full-circle moment matters for motivation and course completion sentiment.

---

## 5. Practical Exercises During Class

1. **Git drill:** Every student runs `init`, makes a small change, `add`, `commit`, and views `git log` on a past project.
2. **GitHub push drill:** Every student creates a repo and pushes one existing project (e.g., the SaaS landing page) live.
3. **Deploy drill:** Every student deploys that same project to Vercel and shares their live URL in the class chat/channel.
4. **Debugging relay:** Instructor plants 3 different bugs (HTML, CSS/Tailwind, JS) across a sample project; students take turns diagnosing each using DevTools.

---

## 6. Homework Assignment

Plan and begin building the **Final Business Website** (Section 7). By the next scheduled check-in or Demo Day:

- Repository created and pushed to GitHub with regular, meaningful commits (not one giant commit)
- README written following the Slide 10 template
- Site deployed live via Vercel or GitHub Pages
- All core requirements from Section 7 met

---

## 7. Final Project — Complete Business Website

**Brief:** "You've been hired (as Khodz, freelancing) to design and build a complete website for a real or fictional small business of your choice."

**Requirements:**
- Multi-section homepage: navbar, hero, about/services, features (cards), testimonials or gallery, contact form, footer
- Fully responsive across mobile, tablet, and desktop (mobile-first Tailwind throughout)
- Working mobile hamburger menu
- A properly validated contact or booking form (from Lesson 4 patterns)
- At least one meaningful JavaScript interactive feature (dark mode, modal, carousel, or similar from Lesson 6)
- Optional but encouraged: one API-powered feature (e.g., embedded weather widget, or a "quote of the day" from a public API)
- Clean, semantic HTML and organized, readable code throughout
- Pushed to GitHub with a clear commit history and a professional README
- Deployed live with a shareable URL

**Grading rubric (informal):**
- Structure & semantics
- Responsiveness
- Visual polish/consistency
- Interactivity
- Code cleanliness
- Git/GitHub usage
- Deployment success
- README quality

---

## 8. Common Beginner Mistakes

- Committing everything in one giant commit at the very end instead of incremental, descriptive commits.
- Forgetting to push after committing (`commit` only saves locally; `push` sends it to GitHub).
- Deploying once and never redeploying after further changes (forgetting Vercel auto-redeploys on push, or forgetting to re-push to GitHub Pages).
- Skipping the README, or writing one with no real content ("This is my project").
- Not testing the deployed live site — assuming "it worked locally" is the same as "it works live" (broken image paths are a common gap).
- Treating AI-generated code as final without reading/understanding it — leads to being unable to explain their own project.
- Underestimating final project scope and starting too late — encourage starting immediately, not the night before Demo Day.

---

## 9. Extra Resources

- [Git — Official Documentation](https://git-scm.com/doc)
- [GitHub Docs — Getting Started](https://docs.github.com/en/get-started)
- [Vercel Documentation](https://vercel.com/docs)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Chrome DevTools Documentation](https://developer.chrome.com/docs/devtools/)
- [MDN Web Docs](https://developer.mozilla.org/) (general reference, all lessons)
- [Make a README](https://www.makeareadme.com/)
