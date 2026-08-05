
# Week 5, Day 1 — Multer, Uploading Images

**Khodz Academy — Backend Development Bootcamp**
**Session:** 13 of 24 | **Duration:** ~1.5–2 hours

---

## 1. Lesson Objectives

By the end of this lesson, students will be able to:

1. Explain why file uploads require different handling than regular JSON requests.
2. Set up Multer to handle file uploads in Express.
3. Build an endpoint that accepts an image upload.
4. Validate uploaded file type and size.
5. Store uploaded files locally as a first step (before Day 2's cloud storage upgrade).

---

## 2. Skills Students Will Learn

- Why file uploads use `multipart/form-data`, not JSON
- Installing and configuring Multer
- Single vs. multiple file uploads
- Accessing uploaded file info via `req.file`/`req.files`
- Restricting file type and size
- Storing files temporarily on local disk

---

## 3. Detailed Teaching Outline (~1.5–2 hrs)

| Time | Segment |
|---|---|
| 0:00–0:15 | Welcome to Month 2, recap Documented API, show and tell |
| 0:15–0:25 | Why file uploads are different (Slides 1–2) |
| 0:25–0:45 | Setting up Multer (Slides 3–6) — live coding |
| 0:45–1:05 | Validating uploads (Slides 7–9) — live coding |
| 1:05–1:25 | Building an upload endpoint (Slides 10–11) — live coding |
| 1:25–1:30 | Recap, common mistakes, Q&A (Slide 12) |

---

## 4. Slide-by-Slide Presentation Content

### Slide 1 — Welcome to Month 2: Real-World Backend Development
**Explanation:** Month 1 built the core of a real backend: routing, database, auth, error handling, docs. Month 2 adds the features that make a backend feel like a genuinely complete, real-world product: file uploads, email, security hardening, and deployment.
**Instructor notes:** Frame Month 2 as "the features that separate a class project from something you'd actually ship" — sets ambition appropriately for the final stretch.

---

### Slide 2 — Why File Uploads Are Different
**Explanation:** Every request handled so far has used JSON (`express.json()`, recap Week 1, Day 2) — but files are binary data, not JSON-serializable text. Uploading a file requires a different content type: `multipart/form-data`.
**Real-world example:** Recall Frontend Foundations Lesson 4's `<input type="file">` — that HTML element was always designed for exactly this different request format; today builds the server side that receives it.
**Instructor notes:** This callback grounds an otherwise abstract HTTP detail in something students have already seen on the frontend, even if they never fully understood why file inputs felt "special" at the time.

---

### Slide 3 — What Is Multer?
**Explanation:** Multer is Express middleware specifically designed to parse `multipart/form-data` requests, making uploaded file data available on `req.file` (single) or `req.files` (multiple).
**Code example:**
```bash
npm install multer
```
**Instructor notes:** Frame Multer the same way as every other tool introduced this course — a well-tested, standard solution to a specific, common problem, not something to build from scratch.

---

### Slide 4 — Basic Multer Setup
**Code example:**
```javascript
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
```
**Instructor notes:** Point out `dest: "uploads/"` creates a local folder where uploaded files are temporarily stored — explain this is a starting point only; Day 2 replaces local storage with proper cloud storage, since local files don't survive real deployment environments (a forward-reference worth stating honestly now).

---

### Slide 5 — Handling a Single File Upload
**Code example:**
```javascript
app.post("/api/upload", upload.single("image"), (req, res) => {
  console.log(req.file);
  res.json({ message: "File uploaded", file: req.file });
});
```
**Instructor notes:** Explain `.single("image")` — `"image"` must match the form field name the client uses to send the file; mismatches here are a very common source of confusion, worth emphasizing clearly.

---

### Slide 6 — Testing File Upload in Postman
**Explanation:** In Postman, set the request body type to "form-data" (not "raw"/JSON, recap Week 1, Day 3's Postman setup) and add a file field matching the name used in `.single("image")`.
**Instructor notes:** Walk through Postman's UI for this explicitly, step by step — selecting "form-data," setting a field's type to "File" rather than "Text," and choosing an actual image from disk. This UI is genuinely different from every prior Postman request in the course and deserves careful, hands-on guidance.

---

### Slide 7 — Understanding req.file
**Code example:**
```javascript
console.log(req.file);
// {
//   fieldname: 'image',
//   originalname: 'profile.jpg',
//   mimetype: 'image/jpeg',
//   destination: 'uploads/',
//   filename: '1699999999-profile.jpg',
//   path: 'uploads/1699999999-profile.jpg',
//   size: 204800
// }
```
**Instructor notes:** Walk through each field — `mimetype` and `size` become important on the very next slide for validation.

---

### Slide 8 — Restricting File Type
**Code example:**
```javascript
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, PNG, and WebP images are allowed"), false);
  }
};

const upload = multer({ dest: "uploads/", fileFilter });
```
**Instructor notes:** Recap Week 4, Day 2's validation lesson conceptually — "this is input validation, applied to files instead of text fields." Test by attempting to upload a non-image file and confirming rejection.

---

### Slide 9 — Restricting File Size
**Code example:**
```javascript
const upload = multer({
  dest: "uploads/",
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },  // 5MB
});
```
**Instructor notes:** Explain the practical importance of size limits — without one, a user (malicious or accidental) could upload an enormous file, consuming server resources or storage unexpectedly; a genuine production concern, not just a technical detail.

---

### Slide 10 — Handling Multer Errors Gracefully
**Code example:**
```javascript
app.post("/api/upload", (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json({ message: "File uploaded", file: req.file });
  });
});
```
**Instructor notes:** Point out this manual error-catching pattern is necessary because Multer's errors don't automatically flow into Express's standard error-handling middleware (Week 4, Day 1) the same way regular thrown errors do — a genuine, documented Multer quirk worth explaining honestly rather than glossing over.

---

### Slide 11 — Building the Upload Endpoint
**Code example:**
```javascript
// controllers/uploadController.js
const uploadImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  res.status(201).json({
    message: "Image uploaded successfully",
    filename: req.file.filename,
    path: req.file.path,
  });
};

module.exports = { uploadImage };
```
```javascript
// routes/upload.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const { uploadImage } = require("../controllers/uploadController");

const upload = multer({ dest: "uploads/", limits: { fileSize: 5 * 1024 * 1024 } });

router.post("/", upload.single("image"), uploadImage);

module.exports = router;
```
**Instructor notes:** Build and test incrementally: confirm a valid image uploads successfully and appears in the local `uploads/` folder, then test the error cases (wrong type, too large, no file at all) — by the end, students should have a genuinely robust upload endpoint, even though local storage is still temporary (Day 2 fixes this permanently).

---

### Slide 12 — Recap and What's Next
**Explanation:** Recap: why file uploads differ from JSON requests, Multer setup, file type/size validation, and a working (locally-storing) upload endpoint. Preview: Day 2 replaces local storage with Cloudinary — permanent, cloud-hosted file storage suitable for real deployment.
**Instructor notes:** Be explicit about today's limitation: "local storage works on your laptop, but disappears the moment this API is deployed to a real server — tomorrow fixes that permanently."

---

## 5. Practical Exercises During Class

1. **Setup checkpoint:** Every student installs Multer and builds a basic single-file upload endpoint.
2. **Postman form-data drill:** Students practice sending a file via Postman's form-data body type.
3. **Validation drill:** Students add file type and size restrictions and confirm both rejection cases work correctly.

---

## 6. Homework Assignment

- Build an upload endpoint accepting a "document" field name instead of "image," restricted to PDF files only, up to 10MB.
- Add proper error handling (recap Slide 10's pattern) so invalid uploads return clean 400 responses rather than crashing.
- Test all cases (valid file, wrong type, too large, missing file) in Postman, saved to your collection.

---

## 7. Mini Project — Image Upload Endpoint

**Brief:** "Build a working, validated image upload endpoint as the foundation for this week's Profile Management API."

**Requirements:**
- Multer configured with a file type filter (images only) and a reasonable size limit
- `POST /api/upload` endpoint accepting a single image
- Clean error responses for invalid type, oversized files, and missing files
- Successful uploads confirmed both in the API response and by checking the local `uploads/` folder
- Fully tested in Postman using form-data

**Stretch goal:** Extend the endpoint to accept multiple images at once using `upload.array("images", 5)` (max 5 files).

---

## 8. Common Beginner Mistakes

- Sending the request as JSON/raw instead of form-data in Postman, causing `req.file` to be `undefined`.
- Mismatching the field name between the Postman form-data key and `.single("fieldName")` in code.
- Forgetting to add `uploads/` to `.gitignore` — uploaded files shouldn't be committed to Git.
- Not handling Multer's error-passing quirk (Slide 10), causing oversized or invalid files to crash the server instead of returning a clean error.
- Forgetting file size limits are specified in bytes, leading to accidentally huge or tiny limits (e.g., writing `5` instead of `5 * 1024 * 1024`).

---

## 9. Extra Resources

- [Multer — Official Docs](https://github.com/expressjs/multer)
- [MDN — Using FormData Objects (client-side context)](https://developer.mozilla.org/en-US/docs/Web/API/FormData/Using_FormData_Objects)
- [MDN — multipart/form-data](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types#multipartform-data)
