
# Week 2, Day 3 — Reading, Updating, Deleting, Pagination, Searching

**Khodz Academy — Backend Development Bootcamp**
**Session:** 6 of 24 | **Duration:** ~1.5–2 hours

---

## 1. Lesson Objectives

By the end of this lesson, students will be able to:

1. Read documents from MongoDB using Mongoose query methods.
2. Update documents with real database operations.
3. Delete documents with real database operations.
4. Implement pagination for large result sets.
5. Implement basic search/filtering against a database.
6. Build a complete Inventory API with full, real CRUD.

---

## 2. Skills Students Will Learn

- `Model.find()`, `Model.findById()`
- `Model.findByIdAndUpdate()`, `Model.findByIdAndDelete()`
- Mongoose query filtering (matching field values)
- Pagination using `.skip()` and `.limit()`
- Basic text search using regex or MongoDB's `$regex` operator
- Combining query parameters (recap Week 1, Day 3) with real database queries

---

## 3. Detailed Teaching Outline (~1.5–2 hrs)

| Time | Segment |
|---|---|
| 0:00–0:10 | Recap Day 2 + show and tell |
| 0:10–0:30 | Reading data: find methods (Slides 1–4) — live coding |
| 0:30–0:50 | Updating and deleting data (Slides 5–7) — live coding |
| 0:50–1:10 | Pagination (Slides 8–10) — live coding |
| 1:10–1:25 | Searching (Slide 11) — live coding |
| 1:25–1:30 | Building the Inventory API, recap (Slide 12) |

---

## 4. Slide-by-Slide Presentation Content

### Slide 1 — Recap: From In-Memory to Real Queries
**Explanation:** Recall Week 1, Day 3's `products.find()` (plain JS array method) — today, `Model.find()` (Mongoose's database query method) does the conceptually same job, but against real, persisted data.
**Instructor notes:** Point out the naming similarity is intentional — Mongoose deliberately mirrors familiar JS array method names to ease this exact transition.

---

### Slide 2 — Reading All Documents
**Code example:**
```javascript
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
```
**Instructor notes:** Point out the `try`/`catch` + `500` status here — recap Frontend Foundations Lesson 7's status code discussion: a `500` means something went wrong on the server's side (e.g., a database connection issue), distinct from a `400`/`404` which indicates a client mistake.

---

### Slide 3 — Reading One Document by ID
**Code example:**
```javascript
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ error: "Student not found" });
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
```
**Instructor notes:** Recap Week 1, Day 3's `.find(p => p.id === ...)` pattern — `findById()` does the same job, but is a real, indexed database lookup rather than a manual array scan, and scales far better as data grows.

---

### Slide 4 — Filtering with find()
**Explanation:** `Model.find({ field: value })` returns only documents matching the given criteria — Mongoose translates this object into a real MongoDB query.
**Code example:**
```javascript
const students = await Student.find({ grade: "A" });
```
**Instructor notes:** Show this returning a filtered subset live — a direct, satisfying evolution of Week 1, Day 3's `.filter()`-based query parameter example.

---

### Slide 5 — Updating a Document
**Code example:**
```javascript
const updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!student) return res.status(404).json({ error: "Student not found" });
    res.json(student);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
```
**Instructor notes:** Explain the options object carefully: `new: true` returns the *updated* document (without it, Mongoose returns the *original*, pre-update version by default — a common surprise). `runValidators: true` ensures schema validation rules (Day 2) still apply on updates, not just on creation — flag this explicitly, since it's easy to forget and a real source of bugs.

---

### Slide 6 — Deleting a Document
**Code example:**
```javascript
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ error: "Student not found" });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
```
**Instructor notes:** Recap Week 1, Day 3's `204 No Content` usage directly — same convention, now against real, permanent deletion (worth a brief moment of "this is now actually permanent, unlike the in-memory version" gravity).

---

### Slide 7 — Testing Full CRUD Against a Real Database
**Explanation:** Test all four operations in Postman, and cross-check results in MongoDB Atlas's Browse Collections view after each — confirming the API and the actual stored data stay in sync.
**Instructor notes:** Make this cross-checking habit explicit and required during today's exercises — it's the single best way for beginners to build real confidence that their API is doing what they think it's doing.

---

### Slide 8 — The Problem: Returning Too Much Data
**Explanation:** `Model.find()` with no limits returns *every* matching document — fine for 10 students, a serious performance problem for 10,000. Real APIs paginate: return results in smaller, manageable pages.
**Real-world example:** Any app with a long list (a social feed, a product catalog) loads content in pages/batches rather than all at once — pagination is why.
**Instructor notes:** Frame this as a genuine production concern, not an academic exercise — most real-world API bugs/performance issues trace back to unbounded queries like this.

---

### Slide 9 — Implementing Pagination with skip() and limit()
**Code example:**
```javascript
const getAllStudents = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const students = await Student.find().skip(skip).limit(limit);
  const total = await Student.countDocuments();

  res.json({
    data: students,
    page,
    totalPages: Math.ceil(total / limit),
    totalResults: total,
  });
};
```
**Instructor notes:** Walk through the `skip`/`page`/`limit` math slowly on the whiteboard with concrete numbers (e.g., page 2, limit 10 → skip 10) — this arithmetic is the trickiest part of the lesson. Recap Week 1, Day 3's query parameters directly — `page`/`limit` are read exactly the same way as any other query parameter.

---

### Slide 10 — Designing a Good Paginated Response Shape
**Explanation:** A well-designed paginated response includes the data itself plus metadata (current page, total pages, total results) — so a frontend consuming this API can build proper pagination controls without extra requests.
**Instructor notes:** Connect forward to a hypothetical React frontend consuming this exact response shape — "this metadata is exactly what a 'Next Page' button in a real app would need."

---

### Slide 11 — Basic Search with Regex
**Explanation:** MongoDB supports regex-based matching for flexible, partial text search — useful for "search as you type" style features.
**Code example:**
```javascript
const searchStudents = async (req, res) => {
  const { name } = req.query;
  const students = await Student.find({
    name: { $regex: name, $options: "i" },  // "i" = case-insensitive
  });
  res.json(students);
};
// GET /api/students/search?name=ama
```
**Instructor notes:** Keep regex syntax light — the goal is functional search, not regex mastery (recap Frontend Foundations Lesson 4's advice to treat regex as "a pattern to copy, not master" at this stage). Point out `$options: "i"` for case-insensitivity — a small detail that meaningfully improves real search UX.

---

### Slide 12 — Building the Inventory API
**Explanation:** Combine today's full toolkit — real reads, updates, deletes, pagination, and search — into a complete Inventory API, replacing Week 1's in-memory Product API entirely with real, persisted data.
**Code example:**
```javascript
// controllers/inventoryController.js
const Product = require("../models/Product");

const getAllProducts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.query.category) filter.category = req.query.category;

  const products = await Product.find(filter).skip(skip).limit(limit);
  const total = await Product.countDocuments(filter);

  res.json({ data: products, page, totalPages: Math.ceil(total / limit), totalResults: total });
};

const searchProducts = async (req, res) => {
  const { q } = req.query;
  const products = await Product.find({ name: { $regex: q, $options: "i" } });
  res.json(products);
};

module.exports = { getAllProducts, searchProducts /* ...plus full CRUD from earlier slides */ };
```
**Instructor notes:** Build incrementally, testing each piece in Postman as it's added — pagination first (verify with a small `limit` against several test documents), then search, then confirm the full CRUD set (create/update/delete) still works correctly against the real database.

---

## 5. Practical Exercises During Class

1. **Read/update/delete build-along:** Every student builds real `findById`, `findByIdAndUpdate`, and `findByIdAndDelete` controller functions with the instructor.
2. **Pagination math drill:** Given a dataset of 25 items and `limit=10`, students calculate `skip` for pages 1, 2, and 3 by hand before writing code.
3. **Search drill:** Students add a search endpoint to their own Student Database from Day 2, filtering by partial name match.

---

## 6. Homework Assignment

- Add pagination to the Student Database's `GET /api/students` route (recap Day 2's project).
- Add a search endpoint filtering students by partial name match.
- Test both features thoroughly in Postman, saving example requests to your collection (recap Week 1, Day 3's Postman habit).

---

## 7. Mini Project — Inventory API

**Brief:** "Build a complete, real, database-backed Inventory API with pagination and search — replacing Week 1's in-memory Product API entirely."

**Requirements:**
- `Product` model with appropriate fields and validation (recap Day 2)
- Full CRUD using real Mongoose queries (`find`, `findById`, `findByIdAndUpdate`, `findByIdAndDelete`)
- Pagination on the list endpoint (`page`/`limit` query parameters, proper response metadata)
- Search endpoint using regex-based partial matching
- At least one filter query parameter (e.g., `category`) combined correctly with pagination
- All tested and verified in Postman, cross-checked against MongoDB Atlas

**Stretch goal:** Add a `sort` query parameter allowing results to be sorted by price (ascending or descending) using Mongoose's `.sort()` method.

---

## 8. Common Beginner Mistakes

- Forgetting `new: true` on `findByIdAndUpdate`, and being confused why the response shows old, pre-update data.
- Forgetting `runValidators: true`, allowing invalid data through on updates despite Day 2's validation rules.
- Miscalculating `skip` (off-by-one style errors, e.g., forgetting the `(page - 1)` part of the formula).
- Building a regex directly from unescaped user input in more security-sensitive contexts (acceptable for this course's learning purposes; flagged as a hardening consideration for real production search features).
- Forgetting `countDocuments()` uses the same filter as the main query, causing incorrect `totalPages` when filters are applied.
- Not handling the case where `findById` receives a malformed id string (not a valid MongoDB ObjectId), causing an unexpected error rather than a clean 404 — worth a brief mention as a preview of Week 4's error-handling lesson.

---

## 9. Extra Resources

- [Mongoose — Queries](https://mongoosejs.com/docs/queries.html)
- [MongoDB — Pagination Patterns](https://www.mongodb.com/docs/manual/reference/method/cursor.skip/)
- [MongoDB — $regex Operator](https://www.mongodb.com/docs/manual/reference/operator/query/regex/)
