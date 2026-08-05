
# Week 5, Day 3 — User Profile Images

**Khodz Academy — Backend Development Bootcamp**
**Session:** 15 of 24 | **Duration:** ~1.5–2 hours

---

## 1. Lesson Objectives

By the end of this lesson, students will be able to:

1. Design a complete profile management feature combining auth, uploads, and CRUD.
2. Build endpoints to view, update, and remove a user's profile (including their image).
3. Protect profile routes so users can only manage their own data.
4. Combine validation, file handling, and authentication into one cohesive feature.
5. Complete and polish the Profile Management API.

---

## 2. Skills Students Will Learn

- Planning a multi-part feature that spans several earlier lessons' skills
- Building a `GET /me`, `PUT /me`, and image-upload route set
- Ensuring users can only ever modify their own profile (not just any user's)
- Combining `protect` middleware, validation middleware, and upload middleware in one route
- Returning a clean, complete user profile response

---

## 3. Detailed Teaching Outline (~1.5–2 hrs)

| Time | Segment |
|---|---|
| 0:00–0:10 | Recap Day 2 + show and tell |
| 0:10–0:20 | Planning the Profile Management API (Slides 1–2) |
| 0:20–0:40 | Building profile read/update routes (Slides 3–6) — live coding |
| 0:40–1:00 | Combining upload with profile update (Slides 7–8) — live coding |
| 1:00–1:20 | Ensuring users only edit their own data (Slides 9–10) — live coding |
| 1:20–1:30 | Final polish and testing (Slides 11–12) |

---

## 4. Slide-by-Slide Presentation Content

### Slide 1 — What We're Building Today
**Explanation:** A complete Profile Management feature: view your own profile, update your basic info, upload/change/remove your profile image — all protected so only the logged-in user can manage their own data.
**Visual suggestion:** Simple wireframe of a "My Profile" page (name, email, profile picture, edit button) — even though this course doesn't build the frontend, visualizing the eventual UI grounds today's API design decisions.
**Instructor notes:** Recap the "plan before code" habit established since Frontend Foundations — sketch the exact routes needed before writing any code today.

---

### Slide 2 — Planning the Routes
**Code example:**
```
GET    /api/users/me           → get my own profile
PUT    /api/users/me           → update my own basic info
POST   /api/users/me/photo     → upload/replace my profile image
DELETE /api/users/me/photo     → remove my profile image
```
**Instructor notes:** Point out every single route uses `/me` rather than `/users/:id` — a deliberate design decision discussed on the next slide.

---

### Slide 3 — Why /me Instead of /users/:id
**Explanation:** Using `/me` (relying on the authenticated user's own id from `req.user`, recap Week 3, Day 2) rather than a route parameter prevents an entire category of bugs and security issues where a user could potentially pass someone *else's* id and access or modify their data.
**Instructor notes:** This is a genuinely important API design lesson — frame it as "designing the route so the mistake is impossible, not just forbidden," a more robust security posture than relying solely on Week 3, Day 3's authorization checks.

---

### Slide 4 — Building GET /me
**Code example:**
```javascript
const getMyProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
});
```
**Instructor notes:** Recap Week 3, Day 2's identical pattern directly — no new concept here, just applying it as the foundation for today's feature.

---

### Slide 5 — Building PUT /me
**Code example:**
```javascript
const updateMyProfile = asyncHandler(async (req, res) => {
  const allowedUpdates = ["name", "bio"];
  const updates = {};

  allowedUpdates.forEach((field) => {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  });

  const user = await User.findByIdAndUpdate(req.user.id, updates, {
    new: true,
    runValidators: true,
  }).select("-password");

  res.json(user);
});
```
**Instructor notes:** Point out the `allowedUpdates` whitelist pattern — a genuinely important security habit: without it, a user could potentially include `role: "admin"` in their update request body and attempt to self-promote (recap Week 3, Day 3's role field) — explicitly connect this to that earlier lesson as a real, concrete consequence of not whitelisting fields.

---

### Slide 6 — Adding Validation to Profile Updates
**Code example:**
```javascript
const profileUpdateValidation = [
  body("name").optional().trim().notEmpty().withMessage("Name cannot be empty"),
  body("bio").optional().trim().isLength({ max: 300 }).withMessage("Bio must be under 300 characters"),
];
```
**Instructor notes:** Recap Week 4, Day 2's `express-validator` directly — point out `.optional()` here, a new modifier meaning "only validate this field if it's actually present," appropriate since profile updates may only change one field at a time.

---

### Slide 7 — Building the Photo Upload Route
**Code example:**
```javascript
// routes/users.js
const multer = require("multer");
const storage = require("../config/multerCloudinary");
const upload = multer({ storage });
const protect = require("../middleware/auth");

router.post("/me/photo", protect, upload.single("photo"), uploadProfilePhoto);
router.delete("/me/photo", protect, deleteProfilePhoto);
```
**Instructor notes:** Point out the middleware stacking order: `protect` first (confirms identity), then `upload.single("photo")` (handles the file) — recap Week 3, Day 3's "order matters" lesson, now applied to a three-part middleware chain (auth + upload + controller).

---

### Slide 8 — Building the Upload and Delete Controllers
**Code example:**
```javascript
const cloudinary = require("../config/cloudinary");

const uploadProfilePhoto = asyncHandler(async (req, res, next) => {
  if (!req.file) return next(new AppError("No file uploaded", 400));

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { profileImage: req.file.path },
    { new: true }
  ).select("-password");

  res.json(user);
});

const deleteProfilePhoto = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (user.profileImage) {
    const publicId = user.profileImage.split("/").slice(-2).join("/").split(".")[0];
    await cloudinary.uploader.destroy(publicId);
  }
  user.profileImage = "";
  await user.save();
  res.json({ message: "Profile photo removed" });
});
```
**Instructor notes:** Direct, near-verbatim reuse of Day 2's Cloudinary patterns — point this out explicitly: "you built these exact functions yesterday in isolation; today they become a real, integrated feature."

---

### Slide 9 — Confirming Users Can Only Access Their Own Profile
**Explanation:** Because every route relies on `req.user.id` (from the verified JWT, recap Week 3, Day 2) rather than a client-supplied id, there is no way for a user to view or modify another user's profile through these endpoints — verify this claim doesn't just sound true, but actually holds up under testing.
**Instructor notes:** Have students attempt to "trick" the API by modifying request data to reference a different user's id somewhere — since these routes never read such a value from the client, demonstrate live that the attempt has no effect. A valuable, confidence-building security testing exercise.

---

### Slide 10 — Testing the Full Profile Flow
**Explanation:** Test the complete arc in Postman: register → login → get profile → update name/bio → upload photo → view updated profile with new image URL → delete photo → view profile with empty image field again.
**Instructor notes:** This end-to-end test is today's essential checkpoint — every piece must work together, not just in isolation.

---

### Slide 11 — Final Polish: Consistent Response Shapes
**Explanation:** Review every profile-related endpoint's response shape for consistency (recap Week 4, Day 1's centralized error handling motivation, applied here to success responses too) — same field names and structure whether returned from GET, PUT, or the photo endpoints.
**Instructor notes:** A genuinely valuable "professional polish" pass — model reviewing your own API's consistency as a normal part of finishing a feature, not an optional afterthought.

---

### Slide 12 — Recap and What's Next
**Explanation:** Recap: planning `/me`-based routes, combining auth + validation + uploads into one cohesive feature, field whitelisting for security, and a complete, tested Profile Management API. This completes Week 5. Preview: Week 6 adds email capabilities — sending real emails for verification and password reset, building toward a complete Authentication System with Email.
**Instructor notes:** Celebrate this as a genuinely complete, realistic feature — the kind of thing that exists in nearly every real application with user accounts.

---

## 5. Practical Exercises During Class

1. **Route planning drill:** Students write out their own `/me`-based route plan before coding, matching Slide 2's format.
2. **Whitelist drill:** Instructor shows an update endpoint without field whitelisting; students identify the security risk and add the fix.
3. **Full build-along:** Every student builds the complete Profile Management API with the instructor, testing the full end-to-end flow.

---

## 6. Homework Assignment

- Finish and fully polish the Profile Management API (Section 7).
- Add a `bio` field validation edge case test (exactly 300 characters, 301 characters) to confirm the boundary behaves correctly.
- Write a short paragraph explaining, in your own words, why `/me` routes are more secure than `/users/:id` routes for a user managing their own data.

---

## 7. Mini Project — Profile Management API (Final)

**Brief:** "Complete a full, secure profile management feature: view, update, and manage a profile image, entirely scoped to the logged-in user."

**Requirements:**
- `GET /api/users/me` returns the logged-in user's profile, password excluded
- `PUT /api/users/me` updates only whitelisted fields, with validation applied
- `POST /api/users/me/photo` uploads and links a Cloudinary-hosted profile image
- `DELETE /api/users/me/photo` removes the image from both Cloudinary and the database
- All routes protected via `protect` middleware, scoped entirely to `req.user.id`
- Fully tested end-to-end in Postman

**Stretch goal:** Add a `PATCH /api/users/me/password` route allowing a logged-in user to change their password, requiring their current password for confirmation (recap Week 3, Day 1's `bcrypt.compare()`).

---

## 8. Common Beginner Mistakes

- Accepting a `role` or other sensitive field in the update body without whitelisting, allowing unintended self-privilege-escalation.
- Using `/users/:id` instead of `/me`, accidentally allowing a user to reference another user's id.
- Forgetting `.select("-password")` on any of today's routes, leaking password hashes in responses.
- Not testing the full end-to-end flow, only individual pieces in isolation — missing integration bugs between auth, validation, and upload middleware.
- Forgetting middleware order (`protect` before `upload`), causing `req.user` to be unavailable when the upload controller runs.

---

## 9. Extra Resources

- [OWASP — Mass Assignment / Object Property Injection (whitelisting rationale)](https://cheatsheetseries.owasp.org/cheatsheets/Mass_Assignment_Cheat_Sheet.html)
- [Express.js — Combining Multiple Middleware (recap)](https://expressjs.com/en/guide/using-middleware.html)
- [Postman — Testing Full User Flows](https://learning.postman.com/docs/sending-requests/create-requests/)
