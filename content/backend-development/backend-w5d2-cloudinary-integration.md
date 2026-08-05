
# Week 5, Day 2 — Cloudinary Integration

**Khodz Academy — Backend Development Bootcamp**
**Session:** 14 of 24 | **Duration:** ~1.5–2 hours

---

## 1. Lesson Objectives

By the end of this lesson, students will be able to:

1. Explain why local file storage doesn't work for real deployed applications.
2. Set up a free Cloudinary account and get API credentials.
3. Upload files directly to Cloudinary from Express.
4. Store the resulting cloud URL in MongoDB instead of a local file path.
5. Delete files from Cloudinary when no longer needed.

---

## 2. Skills Students Will Learn

- Why persistent local disk storage is unreliable in deployed/cloud environments
- What Cloudinary is and what it provides (storage, transformation, CDN delivery)
- Setting up Cloudinary credentials securely via `.env`
- Uploading files to Cloudinary using `multer-storage-cloudinary` (or direct SDK upload)
- Storing a Cloudinary URL as a field in a Mongoose document
- Deleting a file from Cloudinary

---

## 3. Detailed Teaching Outline (~1.5–2 hrs)

| Time | Segment |
|---|---|
| 0:00–0:10 | Recap Day 1 + show and tell |
| 0:10–0:20 | Why local storage isn't enough (Slides 1–2) |
| 0:20–0:35 | Setting up Cloudinary (Slides 3–5) — hands-on |
| 0:35–1:00 | Uploading to Cloudinary from Express (Slides 6–9) — live coding |
| 1:00–1:15 | Storing URLs and deleting files (Slides 10–11) — live coding |
| 1:15–1:30 | Recap, common mistakes, Q&A (Slide 12) |

---

## 4. Slide-by-Slide Presentation Content

### Slide 1 — Recap: Yesterday's Limitation
**Explanation:** Recall Day 1's honest disclaimer: local file storage (`uploads/` folder) doesn't survive real deployment — most hosting platforms (previewed in Week 8) use ephemeral filesystems, meaning uploaded files can simply vanish on restart or redeploy.
**Instructor notes:** Restate this limitation clearly before the fix — reinforces exactly why today's lesson isn't optional polish, but a genuine requirement for a real, deployed application.

---

### Slide 2 — What Is Cloudinary?
**Explanation:** Cloudinary is a cloud service specifically for storing, managing, and delivering media files (images, videos) — files are uploaded once and served reliably from a fast, global content delivery network (CDN), completely separate from your own server's storage.
**Real-world example:** Recall how images looked when linked via a plain `<img src="profile.jpg">` in Frontend Foundations Lesson 1 — Cloudinary is the professional, scalable version of "having an image somewhere reliable to point to."
**Instructor notes:** This connects a very early, simple lesson (a basic `<img>` tag) to a mature, production-grade solution to the exact same underlying need: reliably hosting an image somewhere.

---

### Slide 3 — Setting Up a Cloudinary Account
**Explanation:** Sign up for a free Cloudinary account and locate the dashboard's API credentials: cloud name, API key, API secret.
**Instructor notes:** Do this live, step by step. Confirm every student has their three credentials visible on their dashboard before moving on — today's critical checkpoint.

---

### Slide 4 — Storing Cloudinary Credentials Securely
**Code example:**
```
# .env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```
**Instructor notes:** Recap the `.env`/`.gitignore` habit for the fourth time this course (Week 2, Week 3, Week 4, now Week 5) — by now this should feel like automatic muscle memory, worth noting explicitly as a sign of real progress.

---

### Slide 5 — Installing Cloudinary Packages
**Code example:**
```bash
npm install cloudinary multer-storage-cloudinary
```
**Instructor notes:** Explain the two packages' roles: `cloudinary` is the official SDK for interacting with the service directly; `multer-storage-cloudinary` is a bridge that lets Multer (Day 1) upload *directly* to Cloudinary instead of local disk, with minimal code changes.

---

### Slide 6 — Configuring the Cloudinary SDK
**Code example:**
```javascript
// config/cloudinary.js
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;
```
**Instructor notes:** Recap Week 4, Day 3's centralized `config/` folder convention directly — Cloudinary configuration earns its own file, following the same established pattern.

---

### Slide 7 — Replacing Local Storage with Cloudinary Storage
**Code example:**
```javascript
// config/multerCloudinary.js
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "khodz-academy-uploads",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

module.exports = storage;
```
**Instructor notes:** Point out `folder: "khodz-academy-uploads"` — Cloudinary organizes uploads into folders, visible in the Cloudinary dashboard, similar to how MongoDB organizes documents into collections (recap Week 2, Day 1).

---

### Slide 8 — Wiring the New Storage into Multer
**Code example:**
```javascript
const multer = require("multer");
const storage = require("../config/multerCloudinary");

const upload = multer({ storage });

router.post("/", upload.single("image"), uploadImage);
```
**Instructor notes:** Point out how little of Day 1's code actually needs to change — only the `storage` configuration passed to `multer()` — the rest of the upload flow (`.single("image")`, `req.file`) stays exactly the same. A satisfying demonstration of good abstraction: Multer's interface stayed stable even though the underlying storage mechanism completely changed.

---

### Slide 9 — Understanding the New req.file Shape
**Code example:**
```javascript
console.log(req.file);
// {
//   ...
//   path: 'https://res.cloudinary.com/your-cloud/image/upload/v1234/khodz-academy-uploads/abc123.jpg',
//   filename: 'khodz-academy-uploads/abc123'
// }
```
**Instructor notes:** Point out `req.file.path` is now a real, public, permanent URL instead of a local file path — this is the field that gets saved to the database going forward.

---

### Slide 10 — Storing the Cloudinary URL in MongoDB
**Code example:**
```javascript
// models/User.js (adding a field)
const userSchema = new mongoose.Schema({
  // ...existing fields
  profileImage: { type: String, default: "" },
});
```
```javascript
const uploadProfileImage = asyncHandler(async (req, res, next) => {
  if (!req.file) return next(new AppError("No file uploaded", 400));

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { profileImage: req.file.path },
    { new: true }
  ).select("-password");

  res.json(user);
});
```
**Instructor notes:** Recap Week 2, Day 3's `findByIdAndUpdate` and Week 3, Day 2's `req.user` (from `protect` middleware) — today's lesson is a genuine synthesis of file uploads, database updates, and authentication all working together.

---

### Slide 11 — Deleting a File from Cloudinary
**Code example:**
```javascript
const cloudinary = require("../config/cloudinary");

const deleteProfileImage = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (user.profileImage) {
    const publicId = user.profileImage.split("/").slice(-2).join("/").split(".")[0];
    await cloudinary.uploader.destroy(publicId);
  }
  user.profileImage = "";
  await user.save();
  res.json({ message: "Profile image removed" });
});
```
**Instructor notes:** The `publicId` extraction logic is genuinely fiddly — walk through it slowly with a real example URL on screen, showing exactly which part of the URL becomes the `publicId` Cloudinary needs for deletion. Acknowledge this string manipulation isn't intuitive and is a common source of bugs even for experienced developers — patience here is well spent.

---

### Slide 12 — Recap and What's Next
**Explanation:** Recap: why cloud storage matters for real deployment, Cloudinary setup, direct-to-cloud uploads via Multer, storing URLs in MongoDB, and deleting cloud files. Preview: Day 3 applies all of this specifically to user profile images, completing this week's Profile Management API.
**Instructor notes:** Point out explicitly: "your uploaded files now live somewhere that survives your server restarting, redeploying, or even being deleted entirely — a genuine production-readiness milestone."

---

## 5. Practical Exercises During Class

1. **Cloudinary setup checkpoint:** Every student creates a Cloudinary account and configures credentials in `.env`.
2. **Upload drill:** Students upload an image through their API and confirm it appears in the Cloudinary dashboard.
3. **URL storage drill:** Students save an uploaded image's URL to a test document in MongoDB and verify it in Atlas.

---

## 6. Homework Assignment

- Fully migrate the Day 1 upload endpoint to use Cloudinary storage instead of local disk.
- Add a delete-image endpoint following Slide 11's pattern, tested against a real uploaded file.
- Confirm in the Cloudinary dashboard that deleted files are actually removed, not just unlinked from the database.

---

## 7. Mini Project — Cloud-Backed Upload System

**Brief:** "Migrate your image upload system to real, permanent cloud storage."

**Requirements:**
- Cloudinary account configured with credentials safely stored in `.env`
- Multer configured to upload directly to Cloudinary via `multer-storage-cloudinary`
- Uploaded image URLs stored correctly in a MongoDB document
- A working delete endpoint that removes the file from both Cloudinary and the database
- Fully tested: upload → verify in Cloudinary dashboard and Atlas → delete → verify removal in both places

**Stretch goal:** Add basic Cloudinary image transformation (e.g., automatic resizing to a max width) using the `transformation` option in the storage config.

---

## 8. Common Beginner Mistakes

- Mixing up the Cloudinary API key and API secret, or leaving one blank.
- Forgetting Cloudinary's free tier has storage/bandwidth limits — worth a brief awareness note for real projects, though not a concern for this course's practice usage.
- Incorrectly extracting the `publicId` for deletion, causing `cloudinary.uploader.destroy()` to silently fail (it often doesn't throw an error for a "not found" public id, so verify success directly in the dashboard, not just by absence of an error).
- Forgetting `allowed_formats` in the storage config, allowing unintended file types through despite Day 1's Multer-level filtering being bypassed by the new storage engine.
- Not testing the full URL actually loads a real image (e.g., pasting it into a browser) before assuming the upload worked correctly.

---

## 9. Extra Resources

- [Cloudinary — Official Docs](https://cloudinary.com/documentation)
- [multer-storage-cloudinary — npm Package Docs](https://www.npmjs.com/package/multer-storage-cloudinary)
- [Cloudinary — Node.js SDK Reference](https://cloudinary.com/documentation/node_integration)
