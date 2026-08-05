
# Week 1, Day 3 — CRUD Operations, Route/Query Parameters, Testing with Postman

**Khodz Academy — Backend Development Bootcamp**
**Session:** 3 of 24 | **Duration:** ~1.5–2 hours

---

## 1. Lesson Objectives

By the end of this lesson, students will be able to:

1. Implement full CRUD operations in an Express API.
2. Use route parameters to target specific resources.
3. Use query parameters for filtering and options.
4. Test APIs thoroughly using Postman.
5. Apply core API design best practices.
6. Build a complete Product API.

---

## 2. Skills Students Will Learn

- Full CRUD: `GET`, `POST`, `PUT`/`PATCH`, `DELETE` in Express
- Route parameters (`req.params`) for identifying specific resources
- Query parameters (`req.query`) for filtering/sorting/options
- Using Postman: collections, requests, saving examples, environment variables
- API design best practices: consistent naming, proper status codes, predictable response shapes

---

## 3. Detailed Teaching Outline (~1.5–2 hrs)

| Time | Segment |
|---|---|
| 0:00–0:10 | Recap Day 2 + show and tell |
| 0:10–0:30 | Full CRUD implementation (Slides 1–5) — live coding |
| 0:30–0:45 | Route parameters in depth (Slides 6–7) — live coding |
| 0:45–1:00 | Query parameters (Slides 8–9) — live coding |
| 1:00–1:20 | Postman deep dive (Slides 10–12) — hands-on |
| 1:20–1:30 | API best practices + building the Product API (Slides 13–14) |

---

## 4. Slide-by-Slide Presentation Content

### Slide 1 — Recap: CRUD from Earlier Courses
**Explanation:** Recall CRUD's meaning (Create, Read, Update, Delete) and its HTTP method mapping from React Bootcamp Week 7, Day 1. Today, build the server side of every operation that Bootcamp's Student Management App consumed.
**Instructor notes:** If students took the React Bootcamp, this is a satisfying full-circle moment — point it out explicitly.

---

### Slide 2 — GET: Reading Data
**Code example:**
```javascript
// GET all
const getAllProducts = (req, res) => {
  res.json(products);
};

// GET one by id
const getProductById = (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ error: "Product not found" });
  res.json(product);
};
```
**Instructor notes:** Point out `res.status(404)` here — the first deliberate use of a "client error" status code; connect to Frontend Foundations Lesson 7's status code lesson, now from the server's authoring side instead of the client's reading side.

---

### Slide 3 — POST: Creating Data
**Code example:**
```javascript
const createProduct = (req, res) => {
  const { name, price } = req.body;
  const newProduct = { id: products.length + 1, name, price };
  products.push(newProduct);
  res.status(201).json(newProduct);
};
```
**Instructor notes:** Recap React Bootcamp Week 7, Day 1's client-side `POST` fetch code — "this is literally what was on the other end of that request the whole time."

---

### Slide 4 — PUT/PATCH: Updating Data
**Explanation:** `PUT` conventionally replaces a whole resource; `PATCH` updates only specified fields — recap this exact distinction from React Bootcamp Week 7, Day 1.
**Code example:**
```javascript
const updateProduct = (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ error: "Product not found" });

  Object.assign(product, req.body);
  res.json(product);
};
```
**Instructor notes:** Introduce `Object.assign()` here as a clean way to merge updated fields into an existing object — a small new JS tool worth naming explicitly.

---

### Slide 5 — DELETE: Removing Data
**Code example:**
```javascript
const deleteProduct = (req, res) => {
  const index = products.findIndex(p => p.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: "Product not found" });

  products.splice(index, 1);
  res.status(204).send();
};
```
**Instructor notes:** Introduce status `204 No Content` — a successful response with deliberately no body, appropriate for deletions. Explain `res.status(204).send()` (no `.json()` needed since there's no content to send).

---

### Slide 6 — Route Parameters in Depth
**Explanation:** `:id` in a route path captures a URL segment into `req.params.id` — recap React Bootcamp Week 5, Day 3's `useParams()`, the client-side mirror of this exact server-side concept.
**Code example:**
```javascript
router.get("/:id", getProductById);
// GET /api/products/5 → req.params.id === "5" (always a string!)
```
**Instructor notes:** Emphasize `req.params` values are always strings, just like React Router's `useParams()` — recap the "string vs. number id" caution from that lesson, now equally relevant server-side (hence `parseInt()` used throughout today's examples).

---

### Slide 7 — Multiple Route Parameters
**Code example:**
```javascript
router.get("/:category/:id", (req, res) => {
  const { category, id } = req.params;
  res.json({ category, id });
});
// GET /api/products/electronics/5
```
**Instructor notes:** Keep this brief — a natural extension once single-parameter routes are understood.

---

### Slide 8 — Query Parameters
**Explanation:** Query parameters (`?key=value`) appear after a `?` in the URL and are used for optional filtering, sorting, or pagination — captured via `req.query`.
**Code example:**
```javascript
router.get("/", (req, res) => {
  const { category, minPrice } = req.query;
  let result = products;

  if (category) {
    result = result.filter(p => p.category === category);
  }
  if (minPrice) {
    result = result.filter(p => p.price >= Number(minPrice));
  }

  res.json(result);
});
// GET /api/products?category=electronics&minPrice=100
```
**Instructor notes:** Recap React Bootcamp Week 5, Day 3's `useSearchParams` — same URL concept, read from the server side here instead of the client.

---

### Slide 9 — Route Params vs. Query Params: When to Use Which
**Explanation:** Route parameters identify a *specific resource* (`/products/5` — this product, and only this one). Query parameters modify a *collection request* (`/products?category=electronics` — filter this list).
**Instructor notes:** This distinction is a common early confusion — the decision guide is worth stating explicitly and having students copy into notes, mirroring the "choosing the right pattern" habit from earlier Khodz Academy courses.

---

### Slide 10 — Introducing Postman
**Explanation:** Postman is a dedicated tool for testing APIs — sending requests with any method, headers, and body, without needing a frontend or browser address bar (which only easily sends GET requests).
**Instructor notes:** Install/open Postman together and send a first `GET` request to the Product API live — this is the first time students test an API without a browser, worth pausing on.

---

### Slide 11 — Testing All CRUD Operations in Postman
**Explanation:** Walk through sending a `GET`, `POST` (with a JSON body), `PUT`, and `DELETE` request, inspecting the response status code and body for each.
**Instructor notes:** For the `POST` request, show exactly where to set the body type to "raw" + "JSON" in Postman's UI — a common point of confusion for first-time Postman users.

---

### Slide 12 — Organizing Requests into a Postman Collection
**Explanation:** A Postman Collection groups related requests together (e.g., all Product API endpoints) and can be saved, shared, and reused — the professional way to keep API tests organized as a project grows.
**Instructor notes:** Have every student create a collection named "Product API" and save each CRUD request into it — this collection will keep growing throughout the rest of the course.

---

### Slide 13 — API Design Best Practices
**Explanation:** Consistent naming (plural nouns: `/products`, not `/product` or `/getProducts`), proper status codes (200/201/204/400/404/500), predictable response shapes, and versioning awareness (briefly preview Week 7, Day 3's API versioning lesson).
**Instructor notes:** Frame these as conventions that make an API "feel professional" to any developer consuming it — directly relevant since students' own future React frontends (or others') will consume APIs built following these exact conventions.

---

### Slide 14 — Building the Product API
**Explanation:** Combine today's full toolkit into a complete Product API: full CRUD, route parameters, query parameter filtering, tested thoroughly in a saved Postman collection.
**Code example:**
```javascript
// routes/products.js
const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;
```
**Instructor notes:** Build and test each route incrementally in Postman as it's added — by the end, every student should have a full, saved Postman collection covering all 5 endpoints with both success and error (404) cases tested.

---

## 5. Practical Exercises During Class

1. **CRUD build-along:** Every student builds all 5 CRUD endpoints for the Product API with the instructor.
2. **Postman drill:** Students send a request for a nonexistent product ID and confirm the 404 response.
3. **Query parameter drill:** Students add a `sortBy=price` query parameter option to the `GET /products` route.

---

## 6. Homework Assignment

- Finish and fully test the Product API in Postman, saving all requests (including at least one deliberate error case per endpoint) into the collection.
- Add a `PATCH /api/products/:id` route that updates only the `price` field, distinct from the full-replace `PUT` route.

---

## 7. Mini Project — Product API

**Brief:** "Build a complete, well-tested Product API with full CRUD, filtering, and a saved Postman test collection."

**Requirements:**
- Full CRUD: `GET` (all + by id), `POST`, `PUT`, `DELETE`, all via controllers (recap Day 2's MVC structure)
- Route parameters used correctly for single-resource operations
- At least one query-parameter-based filter on the list endpoint
- Proper status codes throughout (200, 201, 204, 404)
- A saved Postman collection covering every endpoint, including at least one error case each

**Stretch goal:** Add a `?sortBy=` query parameter supporting sorting by price or name.

---

## 8. Common Beginner Mistakes

- Forgetting `parseInt()`/`Number()` when comparing `req.params.id` (a string) against numeric ids in stored data.
- Confusing route parameters and query parameters, or using the wrong one for a given situation.
- Forgetting to return a 404 when a resource isn't found, causing `undefined` to be sent back as if it were a valid response.
- Sending a `204` response with a body (technically invalid — 204 means no content).
- Testing only the "happy path" in Postman and never checking error cases (invalid id, missing fields).
- Forgetting `return` before `res.status(404).json(...)`, causing the function to continue executing and attempt to send a second response (causing a "headers already sent" error).

---

## 9. Extra Resources

- [Postman — Official Learning Center](https://learning.postman.com/)
- [Express.js — Routing Guide (recap)](https://expressjs.com/en/guide/routing.html)
- [MDN — HTTP Response Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
- [REST API Design Best Practices (general reference)](https://restfulapi.net/)
