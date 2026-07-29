
# Lesson 6 — JavaScript in the Browser

**Khodz Academy — Frontend Development Foundations**
**Class:** 6 of 8 | **Duration:** ~2.5 hours

---

## 1. Lesson Objectives

By the end of this lesson, students will be able to:

1. Explain what the DOM is and how JavaScript connects to a live webpage.
2. Select HTML elements using JavaScript.
3. Listen for and respond to user events (clicks, input, submit).
4. Update page content and styles dynamically.
5. Persist simple data using `localStorage`.
6. Build common interactive UI patterns: dark mode toggle, modal, sidebar, carousel.
7. Turn Lesson 5's quiz logic into a fully working, on-screen Interactive Dashboard/Quiz UI.

---

## 2. Skills Students Will Learn

- The DOM (Document Object Model) as a live, JS-editable representation of the page
- `document.querySelector()` / `querySelectorAll()`
- `addEventListener()` for click, input, submit, change events
- Changing content: `.textContent`, `.innerHTML`
- Changing styles/classes: `.classList.add/remove/toggle`
- Reading form input values with JavaScript
- `localStorage.setItem()` / `getItem()` for persisting data across page reloads
- Building a dark mode toggle
- Building a modal (open/close)
- Building a sidebar (open/close)
- Building a basic image/content carousel

---

## 3. Detailed Teaching Outline (2.5 hrs)

| Time | Segment |
|---|---|
| 0:00–0:10 | Show and tell: quiz logic from Lesson 5 |
| 0:10–0:25 | What is the DOM? (Slides 1–3) |
| 0:25–0:45 | Selecting elements and events (Slides 4–7) — live coding |
| 0:45–1:05 | Changing content and styles (Slides 8–10) — live coding |
| 1:05–1:15 | **Break** |
| 1:15–1:30 | localStorage + dark mode (Slides 11–13) — live coding |
| 1:30–1:50 | Modals and sidebars (Slides 14–16) — live coding |
| 1:50–2:00 | Carousel basics (Slide 17) — live coding |
| 2:00–2:20 | Wiring up the full Quiz UI (Slides 18–20) — live coding |
| 2:20–2:30 | Assign project, recap, common mistakes |

---

## 4. Slide-by-Slide Presentation Content

### Slide 1 — What Is the DOM?
**Explanation:** The DOM (Document Object Model) is the browser's live, in-memory representation of your HTML page — a tree of objects JavaScript can read and change. Editing the DOM updates what the user sees instantly, without reloading the page.
**Visual suggestion:** Tree diagram: `document` → `html` → `head`/`body` → nested elements.
**Real-world example:** When you like a post and the heart icon fills in instantly — that's JavaScript editing the DOM, not a new page loading.
**Instructor notes:** Clarify the DOM is *not* the HTML file itself — it's a live copy in the browser's memory. Editing it doesn't change your source file.

---

### Slide 2 — HTML File vs. DOM (The Key Distinction)
**Explanation:** Your `.html` file is a static blueprint. When the browser loads it, it builds the DOM from that blueprint. JavaScript only ever touches the DOM (the live version), which is why changes disappear on refresh unless saved somewhere (like `localStorage`, covered later).
**Instructor notes:** This distinction resolves a lot of future confusion ("why did my change disappear when I refreshed?") — worth revisiting explicitly when that question comes up later in the lesson.

---

### Slide 3 — Opening DevTools and Exploring the DOM
**Explanation:** Chrome DevTools → Elements tab shows the live DOM. Try editing an element's text directly in DevTools to prove it's live and separate from the source file.
**Instructor notes:** Do this hands-on with students — edit a heading's text in DevTools, refresh, and show it reverts. Concrete proof beats explanation here.

---

### Slide 4 — Selecting a Single Element: querySelector
**Explanation:** `document.querySelector()` finds the first element matching a CSS-style selector (id, class, tag).
**Code example:**
```js
const heading = document.querySelector("#main-heading");
const firstCard = document.querySelector(".card");
console.log(heading);
```
**Instructor notes:** Point out the selector syntax is identical to CSS selectors students already recognize (`#id`, `.class`) — reduces new-syntax anxiety.

---

### Slide 5 — Selecting Multiple Elements: querySelectorAll
**Explanation:** `document.querySelectorAll()` returns *all* matching elements as a list (NodeList), which can be looped over.
**Code example:**
```js
const cards = document.querySelectorAll(".card");
cards.forEach((card) => {
  console.log(card);
});
```
**Instructor notes:** Connect directly back to Lesson 5's `.forEach()` — same looping tool, new context (DOM elements instead of plain data).

---

### Slide 6 — Listening for Events: addEventListener
**Explanation:** `addEventListener(eventType, callbackFunction)` runs code in response to something happening — click, input, submit, change, and more.
**Code example:**
```js
const button = document.querySelector("#save-btn");

button.addEventListener("click", () => {
  console.log("Button was clicked!");
});
```
**Instructor notes:** Revisit the hamburger menu code from Lesson 3 — tell students "this is the exact pattern you already used, now you understand every part of it."

---

### Slide 7 — Common Event Types
**Explanation:** `click` (buttons, links), `input` (typing in real time), `change` (dropdowns/checkboxes, fires on value change + blur), `submit` (forms — must `preventDefault()` to stop page reload).
**Code example:**
```js
const form = document.querySelector("#registration-form");

form.addEventListener("submit", (event) => {
  event.preventDefault(); // stops the default page reload
  console.log("Form submitted without reloading the page!");
});
```
**Instructor notes:** `preventDefault()` is a common early stumbling block — explain clearly why it's needed (forms reload the page by default) and demo the difference with and without it.

---

### Slide 8 — Changing Text Content
**Explanation:** `.textContent` reads or sets the plain text inside an element.
**Code example:**
```js
const scoreDisplay = document.querySelector("#score");
scoreDisplay.textContent = "Score: 3/5";
```
**Instructor notes:** Reinforce this only affects the live DOM — refresh the page afterward to show the change reverts, tying back to Slide 2.

---

### Slide 9 — Changing HTML Content
**Explanation:** `.innerHTML` reads or sets HTML *markup* inside an element (not just plain text) — powerful, but must be used carefully (never insert untrusted user input directly, to avoid security issues).
**Code example:**
```js
const cardContainer = document.querySelector("#card-container");
cardContainer.innerHTML = `<div class="p-4 bg-white rounded shadow">New Card</div>`;
```
**Instructor notes:** Briefly flag the security note (XSS) at a beginner-appropriate level: "don't dump raw user text into innerHTML in real apps — for this course's projects, it's fine."

---

### Slide 10 — Changing Styles and Classes
**Explanation:** Prefer toggling Tailwind classes over inline styles. `.classList.add()`, `.remove()`, `.toggle()` manage classes dynamically.
**Code example:**
```js
const box = document.querySelector("#box");
box.classList.add("bg-blue-500");
box.classList.remove("bg-gray-200");
box.classList.toggle("hidden"); // exactly what powered the Lesson 3 hamburger menu
```
**Instructor notes:** Explicitly connect back to the mobile menu toggle from Lesson 3 again here — full-circle understanding moment.

---

### Slide 11 — Introduction to localStorage
**Explanation:** `localStorage` lets you save small amounts of data in the browser that persists even after closing the tab or refreshing — unlike regular variables, which reset on reload.
**Code example:**
```js
localStorage.setItem("username", "Amaka");
const savedName = localStorage.getItem("username");
console.log(savedName); // "Amaka"

localStorage.removeItem("username"); // deletes it
```
**Real-world example:** Remembering a user's dark mode preference or an unsaved draft between visits.
**Instructor notes:** Demo saving a value, refreshing the page, and reading it back — makes the "persists across reload" claim concrete rather than theoretical.

---

### Slide 12 — Storing Objects in localStorage
**Explanation:** `localStorage` only stores strings — use `JSON.stringify()` to save objects/arrays and `JSON.parse()` to read them back.
**Code example:**
```js
const quizResult = { score: 4, total: 5 };
localStorage.setItem("lastQuizResult", JSON.stringify(quizResult));

const saved = JSON.parse(localStorage.getItem("lastQuizResult"));
console.log(saved.score); // 4
```
**Instructor notes:** This trips up almost every beginner at least once — spend real time here, and mention "forgot to stringify/parse" as a mistake to watch for (also listed in Section 8).

---

### Slide 13 — Building a Dark Mode Toggle
**Explanation:** Combine `classList.toggle()` + `localStorage` to build a dark mode switch that remembers the user's choice.
**Code example:**
```html
<button id="theme-toggle">🌙 Toggle Dark Mode</button>
```
```js
const toggleBtn = document.querySelector("#theme-toggle");

toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  const isDark = document.body.classList.contains("dark-mode");
  localStorage.setItem("darkMode", isDark);
});

// On page load, apply saved preference:
if (localStorage.getItem("darkMode") === "true") {
  document.body.classList.add("dark-mode");
}
```
**Instructor notes:** Build this fully live — it's a highly satisfying, portfolio-worthy feature that combines three concepts from today (DOM, events, localStorage) in one clean example.

---

### Slide 14 — Building a Modal (Popup)
**Explanation:** A modal is a popup panel shown/hidden via a class toggle, usually with a semi-transparent overlay behind it.
**Code example:**
```html
<button id="open-modal">View Details</button>

<div id="modal" class="hidden fixed inset-0 bg-black/50 flex items-center justify-center">
  <div class="bg-white p-6 rounded-xl w-80">
    <h3 class="font-bold text-lg mb-2">Project Details</h3>
    <p class="text-gray-600 text-sm">More information here.</p>
    <button id="close-modal" class="mt-4 text-blue-600">Close</button>
  </div>
</div>
```
```js
document.querySelector("#open-modal").addEventListener("click", () => {
  document.querySelector("#modal").classList.remove("hidden");
});

document.querySelector("#close-modal").addEventListener("click", () => {
  document.querySelector("#modal").classList.add("hidden");
});
```
**Instructor notes:** Point out `fixed inset-0` and `bg-black/50` as new Tailwind utilities for full-screen overlays — small addition worth naming explicitly.

---

### Slide 15 — Building a Sidebar
**Explanation:** Same open/close toggle pattern as the modal and mobile menu, applied to a slide-in sidebar panel — reinforces that most "interactive UI" is the same 3–4 patterns reapplied.
**Code example:**
```html
<button id="open-sidebar">☰</button>
<div id="sidebar" class="hidden fixed top-0 left-0 h-full w-64 bg-gray-900 text-white p-6">
  <button id="close-sidebar">✕</button>
  <nav class="flex flex-col gap-4 mt-8">
    <a href="#">Dashboard</a>
    <a href="#">Settings</a>
    <a href="#">Logout</a>
  </nav>
</div>
```
```js
document.querySelector("#open-sidebar").addEventListener("click", () => {
  document.querySelector("#sidebar").classList.remove("hidden");
});
document.querySelector("#close-sidebar").addEventListener("click", () => {
  document.querySelector("#sidebar").classList.add("hidden");
});
```
**Instructor notes:** Ask students to predict the JS before showing it — by now they should recognize the pattern instantly. Good confidence check.

---

### Slide 16 — Recognizing the Repeating Pattern
**Explanation:** Hamburger menu, dark mode, modal, sidebar — all use the exact same idea: **select an element → listen for a click → toggle a class**. This is one of the most reusable patterns in frontend development.
**Visual suggestion:** Side-by-side comparison table of all four features showing they share the same 3-step structure.
**Instructor notes:** This is a deliberate "zoom out" slide — naming the pattern explicitly helps students generalize instead of memorizing four separate "tricks."

---

### Slide 17 — Basic Carousel/Slider
**Explanation:** A carousel cycles through a set of items (images/testimonials) using an index variable and next/previous buttons.
**Code example:**
```html
<div id="slide-text" class="text-center text-lg font-medium">Slide 1</div>
<button id="prev">Prev</button>
<button id="next">Next</button>
```
```js
const slides = ["Slide 1", "Slide 2", "Slide 3"];
let currentIndex = 0;
const slideText = document.querySelector("#slide-text");

const updateSlide = () => {
  slideText.textContent = slides[currentIndex];
};

document.querySelector("#next").addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % slides.length; // wraps back to 0
  updateSlide();
});

document.querySelector("#prev").addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + slides.length) % slides.length;
  updateSlide();
});
```
**Instructor notes:** Explain the modulo (`%`) wraparound trick carefully with a couple of manual index examples on the whiteboard — it's the trickiest bit of logic in the lesson.

---

### Slide 18 — Connecting Lesson 5's Quiz Logic to the DOM
**Explanation:** Now bring back the `questions` array and `checkAnswer` logic from Lesson 5 and connect it to real buttons and text on the page instead of `console.log`.
**Code example:**
```html
<div id="question-text" class="text-xl font-bold mb-4"></div>
<div id="options" class="flex flex-col gap-2"></div>
<div id="score-display" class="mt-6 font-semibold"></div>
```
**Instructor notes:** Rebuild the `questions` array quickly on screen (or paste from Lesson 5 homework) before wiring it to the DOM — a natural checkpoint linking the two lessons together.

---

### Slide 19 — Rendering Questions Dynamically
**Explanation:** Use a function to display the current question and its options as clickable buttons, generated from the array using `.forEach()` and `.innerHTML`.
**Code example:**
```js
let currentQuestion = 0;
let score = 0;

const renderQuestion = () => {
  const q = questions[currentQuestion];
  document.querySelector("#question-text").textContent = q.question;

  const optionsContainer = document.querySelector("#options");
  optionsContainer.innerHTML = "";

  q.options.forEach((option) => {
    const btn = document.createElement("button");
    btn.textContent = option;
    btn.className = "border px-4 py-2 rounded-lg hover:bg-blue-50";
    btn.addEventListener("click", () => selectAnswer(option));
    optionsContainer.appendChild(btn);
  });
};
```
**Instructor notes:** Introduce `document.createElement()` + `appendChild()` here as a new but logical extension of everything already covered — build incrementally, testing after each piece.

---

### Slide 20 — Wiring Up Answer Checking and Recap
**Explanation:** Complete the loop: clicking an option checks it against the answer, updates score, and advances to the next question (or shows a final result).
**Code example:**
```js
const selectAnswer = (selected) => {
  if (selected === questions[currentQuestion].answer) {
    score++;
  }
  currentQuestion++;

  if (currentQuestion < questions.length) {
    renderQuestion();
  } else {
    document.querySelector("#question-text").textContent = "Quiz Complete!";
    document.querySelector("#options").innerHTML = "";
    document.querySelector("#score-display").textContent = `Final Score: ${score}/${questions.length}`;
  }
};

renderQuestion(); // start the quiz
```
**Explanation (recap):** Recap: DOM basics, selecting elements, events, changing content/styles, localStorage, dark mode, modal, sidebar, carousel, and a fully working on-screen quiz. Preview: Lesson 7 connects to the outside world — fetching real data from APIs (weather, movies, countries) instead of hardcoded arrays.
**Instructor notes:** Let students play their own working quiz end to end — this is a major milestone moment, celebrate it before moving to homework/wrap-up.

---

## 5. Practical Exercises During Class

1. **Selector practice:** Students select 3 different elements on their page using `querySelector` and log each to the console.
2. **Toggle drill:** Build a simple "like button" that toggles a class between `text-gray-400` and `text-red-500` on click.
3. **Dark mode build-along:** Every student implements the dark mode toggle from Slide 13 on their own page.
4. **Quiz wiring build-along:** Students connect their Lesson 5 quiz logic to the DOM following Slides 18–20.

---

## 6. Homework Assignment

Complete the **Interactive Dashboard** project (Section 7), incorporating at least 4 of the following interactive features:

- Dark mode toggle with localStorage persistence
- A modal that opens/closes
- A sidebar that opens/closes
- A basic carousel/slider
- A fully working, on-screen version of the Lesson 5 quiz (question rendering + answer checking + final score)

All features must use the "select → listen → toggle/update" pattern taught today, written in clean, readable JavaScript.

---

## 7. Mini Project — Interactive Dashboard

**Brief:** "Build a small interactive dashboard/app page — like a simplified admin panel or student dashboard — that demonstrates real DOM interactivity, not just static styling."

**Requirements:**
- Sidebar navigation (open/close on mobile)
- Dark mode toggle (persisted via localStorage)
- At least one modal (e.g., "View Profile" or "Edit Details")
- The fully working Quiz UI from Slides 18–20, embedded as one "widget" on the dashboard
- Clean, responsive Tailwind styling throughout (reusing patterns from Lessons 2–3)

**Stretch goal:** Add a simple carousel widget showing rotating tips or announcements.

---

## 8. Common Beginner Mistakes

- Calling `querySelector` before the element exists in the DOM (script runs too early) — solved by placing `<script>` at the end of `<body>`, or wrapping code appropriately.
- Forgetting `event.preventDefault()` on form submissions, causing unwanted page reloads.
- Confusing `.textContent` and `.innerHTML`, or using `.innerHTML` when plain text would be safer/simpler.
- Forgetting `JSON.stringify()`/`JSON.parse()` when saving/reading objects in `localStorage`.
- Adding an event listener inside a loop incorrectly, causing all buttons to respond only to the last item (classic closure/scope bug — explain simply: "each loop iteration needs its own function reference").
- Typos in selector strings (`#score` vs `.score` vs `score`) causing silent `null` errors.
- Forgetting to call the initial render function (e.g., `renderQuestion()`), so nothing appears until an event fires.

---

## 9. Extra Resources

- [MDN — Introduction to the DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction)
- [MDN — EventTarget.addEventListener()](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener)
- [MDN — Window.localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [JavaScript.info — Document, DOM section](https://javascript.info/document)
