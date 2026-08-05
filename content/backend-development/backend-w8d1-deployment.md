
# Week 8, Day 1 — Deployment: Environment Variables, MongoDB Atlas, Render/Railway

**Khodz Academy — Backend Development Bootcamp**
**Session:** 22 of 24 | **Duration:** ~1.5–2 hours

---

## 1. Lesson Objectives

By the end of this lesson, students will be able to:

1. Explain the difference between a development and a production environment.
2. Prepare a project's environment variables and configuration for deployment.
3. Confirm a MongoDB Atlas cluster is production-ready (network access, credentials).
4. Deploy a live, working Node.js/Express API to Render or Railway.
5. Test a deployed API using Postman against its live URL.

---

## 2. Skills Students Will Learn

- Development vs. production environments
- Preparing `.env.example` and production environment variables safely
- Confirming MongoDB Atlas network access rules for a hosted server
- Deploying an Express API to Render or Railway
- Setting environment variables in a hosting platform's dashboard
- Testing a live, deployed API endpoint

---

## 3. Detailed Teaching Outline (~1.5–2 hrs)

| Time | Segment |
|---|---|
| 0:00–0:15 | Welcome to Week 8 (final week!), recap Week 7, show and tell |
| 0:15–0:30 | Dev vs. production, pre-deployment checklist (Slides 1–4) |
| 0:30–0:45 | MongoDB Atlas production readiness (Slides 5–6) |
| 0:45–1:20 | Deploying to Render/Railway (Slides 7–11) — live, hands-on |
| 1:20–1:30 | Testing the live API, recap (Slide 12) |

---

## 4. Slide-by-Slide Presentation Content

### Slide 1 — Welcome to Week 8: The Final Week
**Explanation:** Every backend project built across this course has run only on `localhost`. This final week makes it real: deployed live on the internet, debugged and monitored like a production system, and presented as a finished, professional portfolio piece.
**Instructor notes:** Build genuine excitement here — this is the moment 7 weeks of local development becomes something students can share with a real, working link.

---

### Slide 2 — Development vs. Production
**Explanation:** Development is the familiar local setup — `localhost`, `nodemon` auto-restarting on save, verbose error messages, a local or shared MongoDB Atlas cluster. Production is the live, real-world environment — a public URL, a hosting platform running the app continuously, and configuration that must be secure and stable rather than convenient for debugging.
**Instructor notes:** Frame this distinction as the lesson's core theme — nearly everything else today follows from taking "what works on my machine" and making it work reliably on a server students don't directly control.

---

### Slide 3 — Pre-Deployment Checklist
**Explanation:** Before deploying, confirm: all secrets live in `.env` (never hardcoded, recap Week 2, Day 1), a `.gitignore` excludes `.env` from version control, `package.json` has a correct `start` script, and the app reads its port from `process.env.PORT` (hosting platforms assign this dynamically, rather than always using `5000` locally).
**Code example:**
```javascript
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```
**Instructor notes:** That `process.env.PORT` detail is a common, easy-to-miss deployment blocker — call it out explicitly, since a hardcoded port will cause a live deployment to fail silently or refuse connections.

---

### Slide 4 — Creating a .env.example File
**Explanation:** A `.env.example` file lists every required environment variable *name* without real values — useful documentation for teammates (or future-you) about exactly what configuration a project needs, without exposing actual secrets.
**Code example:**
```
# .env.example
PORT=5000
MONGO_URI=
JWT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
MAILTRAP_HOST=
MAILTRAP_PORT=
MAILTRAP_USER=
MAILTRAP_PASS=
CLIENT_URL=
```
**Instructor notes:** Point out this file gets committed to Git (unlike `.env` itself) — a small but genuinely professional convention worth adopting as a habit going forward.

---

### Slide 5 — MongoDB Atlas: Network Access for Production
**Explanation:** Recall Week 2, Day 1's Atlas setup — for a deployed server, the hosting platform's outgoing IP address must be allowed through Atlas's Network Access rules. Since most hosting platforms don't offer a single fixed IP, the practical approach is allowing access from anywhere (`0.0.0.0/0`), relying on the database username/password for security instead.
**Instructor notes:** Address the "allow from anywhere" concern honestly — explain that this is a real, common, and reasonably safe tradeoff for a portfolio-scale project, since Atlas still requires valid credentials for any actual connection; production systems at larger scale use more restrictive approaches like VPC peering, appropriately beyond this course's scope.

---

### Slide 6 — Confirming Atlas Credentials Are Deployment-Ready
**Explanation:** Double-check the Atlas database user's username and password (recall Week 2, Day 1) are correct and don't contain characters needing special URL-encoding — a common, confusing source of connection failures specifically in production that may not surface locally if the `.env` value was copy-pasted correctly once and never retyped.
**Instructor notes:** A brief but genuinely useful troubleshooting tip — worth mentioning explicitly since it's a real, common point of confusion students are likely to hit today.

---

### Slide 7 — Choosing a Hosting Platform: Render or Railway
**Explanation:** Both Render and Railway offer free/low-cost tiers well-suited to a portfolio project, connect directly to a GitHub repository, and automatically redeploy on every push — a modern, convenient deployment workflow.
**Instructor notes:** Present both as equally valid, interchangeable choices for this course — let students pick whichever they prefer, since the underlying concepts and steps are nearly identical between them.

---

### Slide 8 — Pushing the Project to GitHub
**Explanation:** Recall Frontend Foundations Lesson 8's Git/GitHub workflow — before deploying, the project needs to be a GitHub repository the hosting platform can connect to.
**Code example:**
```bash
git init
git add .
git commit -m "Ready for deployment"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```
**Instructor notes:** Confirm `.env` is correctly excluded via `.gitignore` before this push — a genuinely important security check, worth verifying together as a class before anyone pushes.

---

### Slide 9 — Deploying on Render (or Railway)
**Explanation:** Create a new Web Service, connect the GitHub repository, set the build command (`npm install`) and start command (`npm start` or `node server.js`/`node index.js`, recap Slide 10 of Day 3 last week's entry-file convention).
**Instructor notes:** Walk through this live, screen-sharing the actual dashboard — this is genuinely easier to demonstrate visually than to describe, and small dashboard UI differences are common between platforms and over time.

---

### Slide 10 — Setting Environment Variables on the Platform
**Explanation:** Every value from the local `.env` file must be manually re-entered into the hosting platform's environment variables dashboard section — the platform never reads a project's local `.env` file directly.
**Instructor notes:** This is the single most common deployment mistake — an app that fails immediately on the live platform almost always means a missing or mistyped environment variable; make this connection explicit and memorable.

---

### Slide 11 — Watching the Deployment and Reading Logs
**Explanation:** Hosting platforms show live build/deploy logs — watch for the same `"MongoDB connected"` or `"Server running on port..."` console messages used throughout local development (recall Week 2, Day 1), now appearing in a production log stream instead.
**Instructor notes:** Point out that debugging a failed deployment uses the exact same reading-error-messages skill practiced all course long — nothing fundamentally new, just a different, unfamiliar-looking log viewer.

---

### Slide 12 — Testing the Live API, Recap, and What's Next
**Explanation:** Use Postman to hit the new live URL's endpoints exactly as done locally all course — the only difference is the base URL. Recap: dev vs. production, pre-deployment checklist, Atlas production readiness, and a real, live deployment to Render/Railway. Preview: Day 2 covers debugging and monitoring a live application, and Day 3 is the final capstone presentation.
**Instructor notes:** This is a genuinely exciting milestone — encourage students to share their live API URL with a classmate right now and have them test it independently, proving it truly works beyond their own machine.

---

## 5. Practical Exercises During Class

1. **Pre-deployment checklist drill:** Students audit their chosen project against Slide 3's checklist before attempting deployment.
2. **Full deployment build-along:** Every student deploys their most complete project (recommended: the Production API from Week 7) live to Render or Railway.
3. **Peer testing drill:** Students exchange live URLs and test each other's deployed APIs in Postman.

---

## 6. Homework Assignment

- If not finished in class, complete the live deployment of your Production API project.
- Update the project's README (recall Frontend Foundations Lesson 8) with the live API URL and a summary of available endpoints.
- Write a short paragraph describing one deployment issue you encountered (if any) and how you diagnosed and fixed it.

---

## 7. Mini Project — Deployed Production API

**Brief:** "Take the Week 7 Production API live — deployed, working, and testable by anyone with the URL."

**Requirements:**
- Project pushed to GitHub with `.env` correctly excluded
- Successfully deployed to Render or Railway
- All required environment variables correctly set on the hosting platform
- MongoDB Atlas network access configured to allow the deployed server's connections
- Live API tested and confirmed working via Postman, using the deployed URL
- README updated with the live URL and endpoint summary

---

## 8. Common Beginner Mistakes

- Hardcoding `PORT` instead of reading `process.env.PORT`, causing the deployed app to fail to bind correctly.
- Forgetting to set one or more environment variables on the hosting platform, causing confusing runtime errors that don't occur locally.
- Leaving Atlas Network Access restricted to a local IP only, blocking the deployed server from connecting to the database.
- Accidentally committing `.env` to GitHub due to a missing or incorrect `.gitignore` entry, leaking real secrets publicly.
- Not reading the platform's deployment logs when something fails, and guessing at fixes instead of diagnosing the actual error message.

---

## 9. Extra Resources

- [Render — Deploying a Node.js App](https://render.com/docs/deploy-node-express-app)
- [Railway — Node.js Deployment Docs](https://docs.railway.app/guides/express)
- [MongoDB Atlas — Network Access Documentation](https://www.mongodb.com/docs/atlas/security/ip-access-list/)
- [The Twelve-Factor App — Config](https://12factor.net/config)
