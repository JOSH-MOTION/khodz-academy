
# Khodz Academy — Backend Development Bootcamp
### Curriculum Overview

**Duration:** 2 Months (8 weeks)
**Classes:** 3 per week, 24 sessions total
**Prerequisite:** JavaScript fundamentals (from Frontend Development Foundations or equivalent). Prior completion of the React Development Bootcamp is recommended but not required — this course is self-contained on the backend side.
**Format:** Instructor-led live class + independent practice between sessions
**Outcome:** Students go from zero backend experience to building, securing, documenting, and deploying real, production-style REST APIs — the server-side counterpart to everything built in Frontend Foundations and the React Bootcamp.

---

## 1. Course Philosophy

This course completes the loop Frontend Foundations and the React Bootcamp deliberately left open. Both of those courses built real UI against **mock** data and **mock** authentication (recall the React Bootcamp's Week 7 `AuthContext`, explicitly flagged at the time as "not real security — that's Module 3"). This course is that promised Module 3: everything mocked before becomes real here — real databases, real password hashing, real tokens, real persisted data.

Like every Khodz Academy course, this one is **project-based**: every lesson pairs new concepts with a working, testable API endpoint, not just isolated syntax. Students test everything they build with Postman, the same way professional backend developers verify their work before ever connecting a frontend.

---

## 2. Learning Outcomes

By the end of this course, students will be able to:

1. Understand how backend systems work and how they fit into the client-server model.
2. Build RESTful APIs using Node.js and Express.
3. Design and interact with MongoDB databases using Mongoose.
4. Implement secure authentication and authorization (real, not mocked).
5. Build complete CRUD applications.
6. Upload and manage files with Multer and Cloudinary.
7. Send emails for account verification and password resets.
8. Validate and sanitize user input.
9. Secure APIs using industry best practices (CORS, rate limiting, Helmet).
10. Document APIs professionally with Swagger/OpenAPI.
11. Deploy backend applications to production (Render/Railway).
12. Structure scalable backend projects using MVC and clean architecture.
13. Connect a real frontend application (React or otherwise) to a real backend API.

---

## 3. Technology Stack

| Layer | Tools Taught |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB (via MongoDB Atlas) |
| ODM | Mongoose |
| Auth | JWT, bcrypt |
| File Uploads | Multer, Cloudinary |
| Email | Nodemailer |
| Testing/Debugging | Postman |
| Validation | Joi / express-validator |
| Documentation | Swagger / OpenAPI |
| Security | CORS, Helmet, rate limiting |
| Config | dotenv |
| Deployment | Render / Railway |

**Explicitly out of scope for this course:** GraphQL, microservices architecture, Docker/containerization, SQL databases, automated testing frameworks (Jest/Mocha). These belong to more advanced tracks later in Khodz Academy's roadmap.

---

## 4. Course Map

### Month 1 — Backend Foundations

| Week | Day 1 | Day 2 | Day 3 |
|---|---|---|---|
| 1 — Introduction to Backend Development | What is backend dev, client-server, HTTP, REST, Node.js/npm setup, first Express server → **Hello API** | Express routes, controllers, middleware, MVC → **Student API** | CRUD, route/query params, Postman, API best practices → **Product API** |
| 2 — MongoDB & Mongoose | What is MongoDB, collections, documents, Atlas, connecting Express → **Connect Database** | Mongoose models, schemas, validation, creating data → **Student Database** | Reading, updating, deleting, pagination, searching → **Inventory API** |
| 3 — Authentication | Registration, password hashing, bcrypt, login → **Authentication API** | JWT, protected routes, middleware, authorization → **Secure Dashboard API** | RBAC, admin vs. user, permissions, refresh tokens intro → **School Management API** |
| 4 — Production Backend | Error handling, custom error classes, async middleware → **Robust API** | Validation (Joi/express-validator), sanitization → **Registration Validation** | Logging, env variables, config, Swagger docs → **Documented API** |

### Month 2 — Real-World Backend Development

| Week | Day 1 | Day 2 | Day 3 | Week Project |
|---|---|---|---|---|
| 5 — File Uploads | Multer, uploading images | Cloudinary integration | User profile images | **Profile Management API** |
| 6 — Email & Notifications | Sending emails, Nodemailer | Email verification | Password reset | **Authentication System with Email** |
| 7 — Advanced Backend | API security: CORS, rate limiting, Helmet | Performance: indexing, caching concepts | API versioning, folder structure, clean architecture | **Production API** |
| 8 — Deployment & Capstone | Deployment, env vars, Atlas, Render/Railway | Debugging, monitoring, production readiness | Final capstone presentation, code review, career guidance | **Final Capstone** |

---

## 5. Weekly Cadence (example)

Classes on **Mon / Wed / Fri**, roughly 1.5–2 hours per session. Homework between sessions: 2–3 hours, scaling up in Month 2 as projects grow more complex.

---

## 6. Assessment Approach

- Daily mini-project completion, demoed at the start of the following session via Postman.
- Continuous code review during in-class exercises.
- Final Capstone (Week 8): a complete, deployed, production-style API chosen from Blog API, E-commerce API, or a fully custom Final Production API — assessed on architecture, security, documentation, and deployment.

---

## 7. Required Tools (Student Setup)

- Everything from Frontend Foundations (VS Code, Node.js, GitHub)
- A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account
- [Postman](https://www.postman.com/) for API testing
- A free [Cloudinary](https://cloudinary.com/) account (Week 5)
- A free email-sending service account for Nodemailer testing (e.g., Gmail with an app password, or a service like Mailtrap for safe testing) (Week 6)
- A free [Render](https://render.com/) or [Railway](https://railway.app/) account (Week 8)

---

## 8. Full Project List

1. Hello API
2. Student API
3. Product API
4. Connect Database
5. Student Database
6. Inventory API
7. Authentication API
8. Secure Dashboard API
9. School Management API
10. Robust API
11. Registration Validation
12. Documented API
13. Profile Management API
14. Authentication System with Email
15. Production API
16. Final Capstone (choose one): Blog API, E-commerce API, or a custom Final Production API

---

## 9. How This Course Connects to the Rest of Khodz Academy

This course is explicitly the missing half of two earlier courses:

- **Frontend Foundations' Lesson 7** taught consuming public APIs (`fetch`, async/await) — this course teaches *building* the APIs being consumed.
- **React Bootcamp Week 7** built a mock `AuthContext` with a hardcoded, insecure login flow, explicitly flagged at the time as a placeholder — this course's Week 3 replaces that mock with real bcrypt password hashing and JWT-based authentication.
- **React Bootcamp Week 7, Day 1** used JSONPlaceholder as a fake CRUD API — this course's Week 2 has students build and connect to a **real** database instead.

Students who complete Frontend Foundations → React Bootcamp → this Backend Bootcamp will have a complete, real, full-stack skill set, directly preparing them for Khodz Academy's Full-Stack Development capstone module.

---

## 10. Document Index

- `backend-00-curriculum-overview.md` — this file
- `backend-w1d1-intro-backend-express.md`
- `backend-w1d2-express-mvc-middleware.md`
- `backend-w1d3-crud-postman.md`
- `backend-w2d1-mongodb-intro.md`
- `backend-w2d2-mongoose-models-schemas.md`
- `backend-w2d3-crud-pagination-search.md`
- `backend-w3d1-registration-bcrypt.md`
- `backend-w3d2-jwt-authentication.md`
- `backend-w3d3-rbac-permissions.md`
- `backend-w4d1-error-handling.md`
- `backend-w4d2-validation-sanitization.md`
- `backend-w4d3-logging-config-swagger.md`
- `backend-w5d1-multer-uploads.md`
- `backend-w5d2-cloudinary-integration.md`
- `backend-w5d3-profile-images.md`
- `backend-w6d1-nodemailer.md`
- `backend-w6d2-email-verification.md`
- `backend-w6d3-password-reset.md`
- `backend-w7d1-api-security.md`
- `backend-w7d2-performance-caching.md`
- `backend-w7d3-architecture-versioning.md`
- `backend-w8d1-deployment.md`
- `backend-w8d2-debugging-monitoring.md`
- `backend-w8d3-capstone-presentation.md`

Each lesson file follows the same 11-part structure used across Khodz Academy's curricula: objectives, skills, teaching outline, slide-by-slide content (slide number, title, explanation, code, real-world example, visual suggestion), instructor notes, in-class exercises, homework, mini project/challenge, common mistakes, and extra resources.
