
# Week 7, Day 1 — CRUD with APIs

**Khodz Academy — React Development Bootcamp**
**Session:** 19 of 24 | **Duration:** ~1.5–2 hours

---

## 1. Lesson Objectives

By the end of this lesson, students will be able to:

1. Explain the four CRUD operations and their corresponding HTTP methods.
2. Perform GET, POST, PUT/PATCH, and DELETE requests using `fetch`.
3. Use a mock/practice API (e.g., JSONPlaceholder or a similar free CRUD-friendly API) to build full CRUD functionality.
4. Combine CRUD operations with the `useFetch`-style patterns from Week 6.
5. Begin building the Student Management App with full create/read/update/delete functionality.

---

## 2. Skills Students Will Learn

- CRUD: Create, Read, Update, Delete — mapped to HTTP methods (`POST`, `GET`, `PUT`/`PATCH`, `DELETE`)
- Sending a `POST` request with a JSON body
- Sending a `PUT`/`PATCH` request to update existing data
- Sending a `DELETE` request
- Setting request headers (`Content-Type: application/json`)
- Updating local UI state to reflect server changes (optimistic vs. refetch-based updates, at a beginner-appropriate level)
- Using a practice API (JSONPlaceholder) that supports fake CRUD responses safely

---

## 3. Detailed Teaching Outline (~1.5–2 hrs)

| Time | Segment |
|---|---|
| 0:00–0:10 | Recap Week 6 + show and tell (Theme Switchers) |
| 0:10–0:20 | What is CRUD? (Slides 1–2) |
| 0:20–0:35 | GET recap + introducing the practice API (Slides 3–4) |
| 0:35–1:00 | POST: creating data (Slides 5–7) — live coding |
| 1:00–1:20 | PUT/PATCH and DELETE (Slides 8–10) — live coding |
| 1:20–1:30 | Recap, common mistakes, Q&A (Slide 11) |

---

## 4. Slide-by-Slide Presentation Content

### Slide 1 — What Is CRUD?
**Explanation:** CRUD stands for Create, Read, Update, Delete — the four fundamental operations almost every data-driven application performs. Every "real" app (not just a display-only one) needs all four eventually.
**Real-world example:** A student management system: Create a new student record, Read the list of students, Update a student's info, Delete a student record.
**Instructor notes:** Frame CRUD as the connective tissue between everything learned so far (fetching/GET from Week 4) and everything ahead (full applications in Week 8) — today completes the "full circle" of data operations.

---

### Slide 2 — CRUD Maps to HTTP Methods
**Explanation:** Create → `POST`. Read → `GET` (recap Week 4, Frontend Foundations Lesson 7). Update → `PUT` or `PATCH`. Delete → `DELETE`.
**Visual suggestion:** Simple table: CRUD operation → HTTP method → typical use.
**Instructor notes:** Recap Frontend Foundations Lesson 7's brief mention that "GET is the focus, others exist" — today, those "others" finally get proper treatment.

---

### Slide 3 — Recap: GET Requests
**Code example:**
```jsx
const response = await fetch("https://jsonplaceholder.typicode.com/users");
const data = await response.json();
```
**Instructor notes:** A 3-minute refresher only — students already know this well from Week 4; the goal is confirming the group is aligned before introducing new methods.

---

### Slide 4 — Introducing a CRUD-Friendly Practice API
**Explanation:** JSONPlaceholder (or a similar free fake REST API) simulates real CRUD responses without a real backend or database — perfect for practicing full CRUD safely, since nothing is permanently saved.
**Code example:**
```
Base URL: https://jsonplaceholder.typicode.com/users
```
**Instructor notes:** Set expectations clearly: "changes here aren't really saved on their server — but the response format is realistic, so the React code you write today is exactly what you'd write against a real backend" (which students will build in Module 3: Backend Development).

---

### Slide 5 — Creating Data with POST
**Explanation:** `POST` sends new data to the server to create a resource. Requires setting the `method`, `headers` (to declare JSON content), and a `body` (the data itself, stringified).
**Code example:**
```jsx
const createStudent = async (studentData) => {
  const response = await fetch("https://jsonplaceholder.typicode.com/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(studentData),
  });
  const newStudent = await response.json();
  console.log("Created:", newStudent);
};
```
**Instructor notes:** Point out `JSON.stringify` — recap Frontend Foundations Lesson 6's localStorage lesson ("stringify to send/store, parse to read back") — same principle, different destination (a server instead of localStorage).

---

### Slide 6 — Updating State After a Successful POST
**Explanation:** After a successful create, update local React state to immediately reflect the new item — recap the immutable array update pattern from Week 2, Day 3 (spread operator).
**Code example:**
```jsx
const handleAddStudent = async (studentData) => {
  const response = await fetch("https://jsonplaceholder.typicode.com/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(studentData),
  });
  const newStudent = await response.json();
  setStudents((prev) => [...prev, newStudent]);
};
```
**Instructor notes:** Explicitly connect: "this is the exact same `setTasks([...tasks, newTask])` pattern from the To-Do App, just triggered after a server response instead of purely local logic."

---

### Slide 7 — Wiring POST to a Form
**Explanation:** Combine today's `createStudent` logic with a controlled form (recap Week 2, Day 3) to let users add new students through the UI.
**Code example:**
```jsx
function AddStudentForm({ onAdd }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onAdd({ name, email });
    setName("");
    setEmail("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
      <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" />
      <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <Button type="submit">Add Student</Button>
    </form>
  );
}
```
**Instructor notes:** Build this fully live — a satisfying synthesis of Week 2's forms, Week 3's UI kit, and today's `POST` logic.

---

### Slide 8 — Updating Data with PUT/PATCH
**Explanation:** `PUT` typically replaces an entire resource; `PATCH` updates only specific fields. Either requires the resource's id in the URL.
**Code example:**
```jsx
const updateStudent = async (id, updates) => {
  const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  const updatedStudent = await response.json();
  setStudents((prev) =>
    prev.map((s) => (s.id === id ? updatedStudent : s))
  );
};
```
**Instructor notes:** Recap Week 2, Day 3's `.map()`-based immutable update pattern (the toggle-complete logic) directly — "identical shape, now syncing with a server response instead of just flipping a boolean locally."

---

### Slide 9 — Deleting Data with DELETE
**Code example:**
```jsx
const deleteStudent = async (id) => {
  await fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
    method: "DELETE",
  });
  setStudents((prev) => prev.filter((s) => s.id !== id));
};
```
**Instructor notes:** Recap Week 2, Day 3's `.filter()`-based delete pattern directly — same local logic, now paired with an actual server request.

---

### Slide 10 — Handling Loading/Error States for CRUD Actions
**Explanation:** CRUD actions (not just initial page loads) also benefit from loading/error handling — e.g., disabling the "Add" button while a request is in flight, showing an error if a delete fails.
**Code example:**
```jsx
const [isSaving, setIsSaving] = useState(false);

const handleAddStudent = async (studentData) => {
  setIsSaving(true);
  try {
    const response = await fetch(/* ... */);
    const newStudent = await response.json();
    setStudents((prev) => [...prev, newStudent]);
  } catch (err) {
    alert("Failed to add student. Please try again.");
  } finally {
    setIsSaving(false);
  }
};
```
**Instructor notes:** Recap Week 4, Day 3's three-state UI pattern explicitly — "loading/error handling isn't just for the initial fetch; every CRUD action deserves the same care."

---

### Slide 11 — Recap and What's Next
**Explanation:** Recap: CRUD operations mapped to HTTP methods, `POST`/`PATCH`/`DELETE` with `fetch`, syncing local state with server responses, and loading/error handling for CRUD actions. This begins the Student Management App. Preview: Day 2 introduces authentication concepts — login, tokens, and how apps know who's logged in, setting up protected routes for Day 3.
**Instructor notes:** Point out today's app has no real login yet — anyone can add/edit/delete anything, which is unrealistic for a real student management system. This gap motivates tomorrow's lesson naturally.

---

## 5. Practical Exercises During Class

1. **POST drill:** Students build a simple form that creates a new "user" against JSONPlaceholder and logs the response.
2. **PATCH drill:** Students update an existing item's field and confirm the local state reflects the change.
3. **DELETE drill:** Students wire up a delete button and confirm the item disappears from the local list.

---

## 6. Homework Assignment

Build the initial version of the **Student Management App**:

- A list of students (fetched via `GET`, recap Week 4)
- A form to add a new student (`POST`)
- Edit functionality for at least one field per student (`PATCH`)
- Delete functionality per student (`DELETE`)
- Basic loading/error handling on each action

---

## 7. Mini Project — Student Management App (Part 1: Full CRUD)

**Brief:** "Build the core functionality of a student management system — this week's most ambitious project."

**Requirements:**
- Fetch and display a list of students
- Add new students via a controlled form + `POST`
- Edit existing students (at least one editable field) via `PATCH`
- Delete students via `DELETE`
- All state updates handled immutably, synced with server responses
- Loading/error handling on all CRUD actions
- Styled using the Week 3 UI kit, organized per Week 6's folder structure

*(Authentication and protected routes added in Days 2–3.)*

---

## 8. Common Beginner Mistakes

- Forgetting `headers: { "Content-Type": "application/json" }` on POST/PATCH requests, causing the server to misinterpret the body.
- Forgetting `JSON.stringify()` on the request body.
- Not updating local state after a successful CRUD action, leaving the UI out of sync with the "server" (even against JSONPlaceholder, where the change isn't truly persisted).
- Using the wrong HTTP method (e.g., `POST` for an update instead of `PATCH`/`PUT`).
- Not handling failed CRUD requests, leaving users with no feedback when something goes wrong.
- Mismatched id types when finding/updating/deleting items (recap the string-vs-number id caution from Week 5, Day 3).

---

## 9. Extra Resources

- [JSONPlaceholder — Free Fake REST API](https://jsonplaceholder.typicode.com/)
- [MDN — HTTP Request Methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods)
- [MDN — Using Fetch: Sending Data](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)
