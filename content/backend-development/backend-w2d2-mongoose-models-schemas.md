
# Week 2, Day 2 — Mongoose Models, Schemas, Validation, Creating Data

**Khodz Academy — Backend Development Bootcamp**
**Session:** 5 of 24 | **Duration:** ~1.5–2 hours

---

## 1. Lesson Objectives

By the end of this lesson, students will be able to:

1. Define a Mongoose schema describing a data shape.
2. Create a Mongoose model from a schema.
3. Apply schema-level validation rules.
4. Create and save real documents to MongoDB.
5. Connect a controller to a real Mongoose model instead of an in-memory array.
6. Build a working Student Database with real persistence.

---

## 2. Skills Students Will Learn

- Defining a schema with `mongoose.Schema()`
- Field types: `String`, `Number`, `Boolean`, `Date`, `Array`
- Schema validation: `required`, `unique`, `min`/`max`, `enum`, default values
- Creating a model with `mongoose.model()`
- Creating and saving documents: `.save()` and `Model.create()`
- Replacing in-memory arrays with real database operations in a controller

---

## 3. Detailed Teaching Outline (~1.5–2 hrs)

| Time | Segment |
|---|---|
| 0:00–0:10 | Recap Day 1 + show and tell |
| 0:10–0:20 | Why schemas matter (Slides 1–2) |
| 0:20–0:45 | Building a schema and model (Slides 3–6) — live coding |
| 0:45–1:05 | Validation rules (Slides 7–9) — live coding |
| 1:05–1:20 | Creating documents (Slides 10–11) — live coding |
| 1:20–1:30 | Building the Student Database (Slide 12) |

---

## 4. Slide-by-Slide Presentation Content

### Slide 1 — Recap: MongoDB's Flexibility
**Explanation:** Recall Day 1: MongoDB documents can technically have any shape. In practice, most applications *want* consistent structure — Mongoose schemas provide that structure as an intentional choice, not a limitation forced on you.
**Instructor notes:** Frame today's lesson as "adding guardrails to flexibility, on purpose" — sets the right mental model before diving into syntax.

---

### Slide 2 — Why Schemas Matter
**Explanation:** Without validation, nothing stops bad data from entering your database — a student record missing a name, a negative age, a typo'd field name creating an entirely new, inconsistent field. Schemas catch these problems before they ever reach the database.
**Real-world example:** Recall Frontend Foundations Lesson 4's form validation (required fields, valid email format) — schemas apply that same protective principle on the server/database side, which matters even more since it's the last line of defense against bad data.
**Instructor notes:** This connection to Frontend Foundations Lesson 4 is worth stating explicitly — validation isn't a new idea, just a new, more critical layer where it's applied.

---

### Slide 3 — Defining Your First Schema
**Code example:**
```javascript
// models/Student.js
const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: String,
  age: Number,
  grade: String,
});

module.exports = mongoose.model("Student", studentSchema);
```
**Instructor notes:** Point out the capitalized model name (`"Student"`) and `Student.js` filename convention — recap Frontend Foundations Lesson 1's PascalCase-for-things-that-represent-a-single-entity convention, echoed again here (and in React component naming from the React Bootcamp).

---

### Slide 4 — Field Types
**Explanation:** Common Mongoose types: `String`, `Number`, `Boolean`, `Date`, `Array`, and nested objects for more complex structures.
**Code example:**
```javascript
const studentSchema = new mongoose.Schema({
  name: String,
  age: Number,
  isEnrolled: Boolean,
  enrolledAt: Date,
  courses: [String],
});
```
**Instructor notes:** Point out `[String]` for an array of strings — a small but important syntax detail worth calling out explicitly.

---

### Slide 5 — What Is a Model?
**Explanation:** A model is a constructor built from a schema — it's the tool used to actually create, read, update, and delete documents matching that schema's shape in the database.
**Real-world example:** Recall React Bootcamp's component definitions vs. component instances — a schema is like a component's definition, a document is like a rendered instance of it, and the model is the tool that connects the two.
**Instructor notes:** This analogy may land differently depending on students' backgrounds — offer it as one option, and the "blueprint vs. actual building" analogy as an alternative for students who didn't take the React Bootcamp.

---

### Slide 6 — Where Models Live in the Project Structure
**Code example:**
```
project/
├── models/
│   └── Student.js
├── controllers/
├── routes/
├── middleware/
└── server.js
```
**Instructor notes:** Recap Week 1, Day 2's MVC structure — `models/` is the folder that was previously empty/placeholder; today it becomes real.

---

### Slide 7 — Required Fields
**Code example:**
```javascript
const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
});
```
**Instructor notes:** Show the longer object syntax (`{ type: String, required: true }`) as the way to add validation rules beyond just the plain type shorthand from Slide 3 — a natural upgrade path.

---

### Slide 8 — More Validation Options
**Code example:**
```javascript
const studentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  age: { type: Number, required: true, min: 5, max: 100 },
  grade: { type: String, enum: ["A", "B", "C", "D", "F"] },
  email: { type: String, required: true, unique: true },
});
```
**Instructor notes:** Point out `trim: true` — recap Frontend Foundations Lesson 2's `.strip()`-equivalent JS string method, now applied automatically at the schema level. Explain `enum` as restricting a field to a specific list of allowed values — directly recalls Week 2, Day 2 of React Bootcamp's `<select>` dropdown concept, now enforced server-side. Flag `unique: true` as preventing duplicate values (e.g., two students with the same email).

---

### Slide 9 — Default Values
**Code example:**
```javascript
const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  isEnrolled: { type: Boolean, default: true },
  enrolledAt: { type: Date, default: Date.now },
});
```
**Instructor notes:** Recap default parameter values from earlier JS/React lessons — same underlying idea, applied at the schema level this time.

---

### Slide 10 — Creating Documents: The .save() Method
**Code example:**
```javascript
const Student = require("../models/Student");

const student = new Student({ name: "Amaka", age: 24, grade: "A" });
student.save()
  .then((savedStudent) => console.log("Saved:", savedStudent))
  .catch((err) => console.error("Error:", err));
```
**Instructor notes:** Run this in a temporary test script (or directly in a route) and check MongoDB Atlas's "Browse Collections" view afterward — seeing the real, saved document appear is today's key payoff moment.

---

### Slide 11 — Creating Documents: The .create() Shortcut
**Code example:**
```javascript
const student = await Student.create({ name: "Tunde", age: 22, grade: "B" });
console.log(student);
```
**Instructor notes:** Introduce `async`/`await` usage here — recap Frontend Foundations Lesson 7 and React Bootcamp Week 4's async/await syntax directly; Mongoose methods return Promises, so this is the exact same pattern applied to database calls instead of `fetch`.

---

### Slide 12 — Building the Student Database
**Explanation:** Replace the in-memory `students` array from Week 1's Student API with real Mongoose model calls — the controller's *shape* stays the same, but its internals now talk to a real, persistent database.
**Code example:**
```javascript
// models/Student.js
const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  age: { type: Number, required: true, min: 5 },
  grade: { type: String, enum: ["A", "B", "C", "D", "F"], default: "C" },
});

module.exports = mongoose.model("Student", studentSchema);
```
```javascript
// controllers/studentController.js
const Student = require("../models/Student");

const createStudent = async (req, res) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json(student);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { createStudent };
```
**Instructor notes:** Point out the `try`/`catch` wrapping the database call — recap Frontend Foundations Lesson 9's error handling directly; a validation failure (missing required field) throws an error that must be caught, not left to crash the server. Test in Postman: successfully create a valid student, then deliberately submit an invalid one (missing `name`) and confirm the 400 response with Mongoose's validation error message.

---

## 5. Practical Exercises During Class

1. **Schema drill:** Students design a schema for a `Book` (title, author, publishedYear, inStock) with at least 3 validation rules.
2. **Save drill:** Students create and save 2 documents using their `Book` model, verifying them in Atlas's Browse Collections view.
3. **Validation bug hunt:** Instructor attempts to save a document violating a validation rule; students predict and confirm the resulting error.
4. **Full build-along:** Every student builds the Student model and connects it to the `createStudent` controller with the instructor.

---

## 6. Homework Assignment

- Build a complete `Student` model with at least 5 fields and appropriate validation (required, min/max, enum, unique where sensible).
- Rewrite the full Student API's `POST` route from Week 1 to use the real Mongoose model instead of the in-memory array.
- Test both valid and invalid student creation in Postman, saving both cases to your Postman collection.

---

## 7. Mini Project — Student Database

**Brief:** "Rebuild your Student API's create functionality on top of a real, validated MongoDB model."

**Requirements:**
- `Student` model with at least 5 fields, using appropriate types
- At least 3 validation rules applied (`required`, `min`/`max`, `enum`, or `unique`)
- `POST /api/students` route creates a real, persisted document using `Student.create()`
- Errors from failed validation return a 400 status with a clear error message, not a server crash
- Verified in MongoDB Atlas: documents appear in the Browse Collections view after creation

**Stretch goal:** Add a `default` value for at least one field, and confirm in Postman that omitting that field in the request still produces a correctly defaulted document.

---

## 8. Common Beginner Mistakes

- Forgetting `await` before Mongoose calls, resulting in a Promise object instead of the actual data.
- Forgetting `try`/`catch` around database calls, causing unhandled validation errors to crash the server.
- Defining a schema but forgetting to export the compiled model (`mongoose.model(...)`) — exporting the schema itself by mistake instead.
- Mismatching field types (e.g., sending a string where a `Number` is expected) and being confused by Mongoose's automatic type coercion behavior in some cases vs. rejection in others.
- Forgetting `enum` values are case-sensitive — submitting `"a"` when the schema expects `"A"`.
- Not checking Atlas's Browse Collections view to confirm data actually persisted, relying only on the API response.

---

## 9. Extra Resources

- [Mongoose — Schemas](https://mongoosejs.com/docs/guide.html)
- [Mongoose — SchemaTypes](https://mongoosejs.com/docs/schematypes.html)
- [Mongoose — Validation](https://mongoosejs.com/docs/validation.html)
- [Mongoose — Models](https://mongoosejs.com/docs/models.html)
