
# Lesson 7 — Working With APIs

**Khodz Academy — Frontend Development Foundations**
**Class:** 7 of 8 | **Duration:** ~2.5 hours

---

## 1. Lesson Objectives

By the end of this lesson, students will be able to:

1. Explain what an API is and how client-server communication works over HTTP.
2. Read and understand JSON data.
3. Use the Fetch API to request data from a real, public API.
4. Use `async`/`await` to handle asynchronous code cleanly.
5. Handle loading states and errors gracefully.
6. Render fetched data dynamically onto the page.
7. Build at least one real API-powered project (Weather App, Movie Search, or Country Explorer).

---

## 2. Skills Students Will Learn

- What an API is and why apps use them instead of hardcoded data
- HTTP basics: requests, responses, status codes, methods (focus on `GET`)
- JSON structure and how it maps to JS objects/arrays
- `fetch()` syntax and the Promise it returns
- `async`/`await` syntax for readable asynchronous code
- `try`/`catch` for error handling
- Designing and showing loading states
- Designing and showing error states for failed requests
- Rendering API data into the DOM using patterns from Lesson 6

---

## 3. Detailed Teaching Outline (2.5 hrs)

| Time | Segment |
|---|---|
| 0:00–0:10 | Show and tell: Interactive Dashboards from Lesson 6 |
| 0:10–0:25 | What is an API? HTTP basics (Slides 1–4) |
| 0:25–0:35 | JSON deep dive (Slides 5–6) |
| 0:35–0:55 | Fetch API and Promises (Slides 7–9) — live coding |
| 0:55–1:10 | async/await (Slides 10–11) — live coding |
| 1:10–1:20 | **Break** |
| 1:20–1:35 | Loading and error states (Slides 12–13) — live coding |
| 1:35–2:20 | Building an API project live (Slides 14–19) — live coding |
| 2:20–2:30 | Assign project, recap, common mistakes |

---

## 4. Slide-by-Slide Presentation Content

### Slide 1 — What Is an API?
**Explanation:** API = Application Programming Interface — a way for one piece of software to request data or functionality from another. A **web API** lets your frontend ask a server (often one you don't control) for data over the internet.
**Real-world example:** A weather app doesn't know the weather itself — it asks a weather service's API for current data and displays it.
**Visual suggestion:** Diagram: Your App → Request → Weather API Server → Response (JSON data) → Your App displays it.
**Instructor notes:** Reconnect explicitly to Lesson 1's client-server slide — "this is that exact same request/response model, just your code making the request instead of the browser address bar."

---

### Slide 2 — Public vs Private APIs
**Explanation:** Some APIs are free and public (no login needed, sometimes an API key required), others are private/paid and used internally by companies. This lesson uses free public APIs so students can start immediately.
**Instructor notes:** Mention API keys briefly — some APIs require a free key for identification/rate-limiting, not payment. Show students where to get one for whichever API you choose to demo.

---

### Slide 3 — HTTP Basics: Requests and Responses
**Explanation:** Every API call is an HTTP request with a **method** (`GET` to retrieve data — the focus today; `POST`/`PUT`/`DELETE` exist but aren't used in this course) and a **URL** (the API endpoint). The server sends back a **response**, including a **status code**.
**Code example:**
```
GET https://api.weatherapi.com/v1/current.json?key=API_KEY&q=Lagos
```
**Instructor notes:** Keep this practical — students need enough to read an endpoint URL, not full HTTP protocol theory.

---

### Slide 4 — Status Codes (The Ones That Matter)
**Explanation:** `200` = success. `404` = not found (bad URL/resource). `401`/`403` = authentication/permission issue (often a missing/invalid API key). `500` = server error (not your fault).
**Visual suggestion:** Simple traffic-light-style list: green (200), yellow (4xx — likely your mistake), red (5xx — their problem).
**Instructor notes:** Frame this as a debugging tool — "when a fetch doesn't work, the status code is the first thing to check."

---

### Slide 5 — What Is JSON?
**Explanation:** JSON (JavaScript Object Notation) is the standard data format APIs use to send data — it looks almost identical to JavaScript objects/arrays, which is why it's easy to work with in JS.
**Code example:**
```json
{
  "city": "Lagos",
  "temperature": 31,
  "condition": "Sunny",
  "forecast": [
    { "day": "Monday", "temp": 30 },
    { "day": "Tuesday", "temp": 29 }
  ]
}
```
**Instructor notes:** Point out this is exactly the array-of-objects shape from Lesson 5's quiz data — reinforce that JSON isn't new syntax, it's a format for the data shapes they already know.

---

### Slide 6 — JSON vs JavaScript Objects
**Explanation:** JSON is technically text (a string) when it arrives over the network. JavaScript automatically converts it into a real object/array you can use — this happens via `.json()` in the fetch flow, shown next.
**Instructor notes:** Keep this brief — full mechanics come in the fetch slides; this is just priming the concept.

---

### Slide 7 — The Fetch API: Making a Request
**Explanation:** `fetch(url)` sends a `GET` request and returns a **Promise** — an object representing "a value that will exist eventually," since network requests take time.
**Code example:**
```js
fetch("https://api.weatherapi.com/v1/current.json?key=API_KEY&q=Lagos")
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.log("Something went wrong:", error));
```
**Instructor notes:** Run this live in the console first, before writing any UI — let students just see real data land in `console.log`. That's the "wow" moment for this lesson.

---

### Slide 8 — Understanding Promises (Just Enough)
**Explanation:** A Promise has three states: pending (waiting), fulfilled (success — `.then()` runs), or rejected (failure — `.catch()` runs). Students don't need to build Promises from scratch — just understand and consume them via `fetch`.
**Visual suggestion:** Simple 3-state diagram: pending → fulfilled/rejected.
**Instructor notes:** Avoid going deep into Promise theory/internals — the goal is functional literacy, not mastery of asynchronous JavaScript internals.

---

### Slide 9 — Why response.json() Is a Separate Step
**Explanation:** The raw fetch response isn't usable data yet — `.json()` parses the response body into a real JavaScript object/array. This itself returns another Promise, which is why it's chained with its own `.then()`.
**Instructor notes:** This trips up nearly everyone at first — repeat it clearly: "fetch gives you a response wrapper, `.json()` unwraps the actual data inside it."

---

### Slide 10 — async/await: A Cleaner Syntax
**Explanation:** `async`/`await` does the exact same thing as `.then()` chains but reads top-to-bottom like normal code — the modern, preferred style in real-world projects.
**Code example:**
```js
const getWeather = async () => {
  const response = await fetch("https://api.weatherapi.com/v1/current.json?key=API_KEY&q=Lagos");
  const data = await response.json();
  console.log(data);
};

getWeather();
```
**Instructor notes:** Show the `.then()` version and the `async/await` version side-by-side, same result — reduces "is this a totally different thing?" confusion.

---

### Slide 11 — Handling Errors with try/catch
**Explanation:** Network requests can fail (no internet, wrong URL, server down). Wrap `await` calls in `try`/`catch` so failures don't silently break the page.
**Code example:**
```js
const getWeather = async () => {
  try {
    const response = await fetch("https://api.weatherapi.com/v1/current.json?key=API_KEY&q=Lagos");
    if (!response.ok) throw new Error("City not found");
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.log("Error fetching weather:", error.message);
  }
};
```
**Instructor notes:** Demonstrate a deliberate failure (typo the URL or search a fake city) so students see the `catch` block actually trigger — theory alone doesn't stick as well as watching it happen.

---

### Slide 12 — Designing Loading States
**Explanation:** Network requests take time — show a loading indicator (spinner, "Loading...", skeleton) while waiting, so the UI doesn't look frozen or broken.
**Code example:**
```js
const resultBox = document.querySelector("#result");

const getWeather = async (city) => {
  resultBox.textContent = "Loading...";
  try {
    const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=API_KEY&q=${city}`);
    const data = await response.json();
    resultBox.textContent = `${data.location.name}: ${data.current.temp_c}°C`;
  } catch (error) {
    resultBox.textContent = "Something went wrong. Try again.";
  }
};
```
**Instructor notes:** Emphasize this three-state pattern — loading → success → error — as universal across virtually all real-world API-driven UI.

---

### Slide 13 — Designing Error States (UX)
**Explanation:** Error messages shown to users should be friendly and specific where possible ("City not found — check the spelling" beats "Error: undefined").
**Instructor notes:** Connect back to Lesson 4's "writing good error messages" principle — same UX skill, new technical context.

---

### Slide 14 — Choosing a Project: Weather / Movie / Country Explorer
**Explanation:** Introduce three suggested public APIs students can choose from for their project: a weather API (e.g., WeatherAPI or Open-Meteo), a movie API (e.g., OMDb or TMDB), and the REST Countries API (no key required, good beginner option).
**Instructor notes:** Recommend REST Countries as the safest in-class demo (no API key friction), and let students choose their own project for homework based on interest.

---

### Slide 15 — Planning the App Structure
**Explanation:** Plan before coding: a search input, a search button, a results container, and the three UI states (loading/success/error) mapped to that container.
**Visual suggestion:** Simple wireframe: search bar at top, result card below.
**Instructor notes:** Reinforce the "plan before code" habit one more time — by lesson 7 this should feel automatic to students.

---

### Slide 16 — Building the Search UI
**Code example:**
```html
<div class="max-w-md mx-auto mt-10 p-6">
  <div class="flex gap-2">
    <input id="search-input" type="text" placeholder="Search a country..." class="flex-1 border px-4 py-2 rounded-lg" />
    <button id="search-btn" class="bg-blue-600 text-white px-4 py-2 rounded-lg">Search</button>
  </div>
  <div id="result" class="mt-6"></div>
</div>
```
**Instructor notes:** Build this using Tailwind patterns already established (Lessons 2–4) — no new styling concepts, just applying prior skills.

---

### Slide 17 — Fetching and Rendering Data (Live Coding — Country Explorer Example)
**Code example:**
```js
const resultBox = document.querySelector("#result");
const searchInput = document.querySelector("#search-input");
const searchBtn = document.querySelector("#search-btn");

const searchCountry = async () => {
  const country = searchInput.value.trim();
  if (!country) return;

  resultBox.innerHTML = `<p class="text-gray-500">Loading...</p>`;

  try {
    const response = await fetch(`https://restcountries.com/v3.1/name/${country}`);
    if (!response.ok) throw new Error("Country not found");
    const data = await response.json();
    const c = data[0];

    resultBox.innerHTML = `
      <div class="bg-white p-6 rounded-xl shadow-md">
        <img src="${c.flags.png}" alt="${c.name.common} flag" class="w-20 mb-4 rounded" />
        <h2 class="text-xl font-bold">${c.name.common}</h2>
        <p class="text-gray-600">Capital: ${c.capital?.[0] ?? "N/A"}</p>
        <p class="text-gray-600">Population: ${c.population.toLocaleString()}</p>
        <p class="text-gray-600">Region: ${c.region}</p>
      </div>
    `;
  } catch (error) {
    resultBox.innerHTML = `<p class="text-red-600">Country not found. Try another name.</p>`;
  }
};

searchBtn.addEventListener("click", searchCountry);
```
**Instructor notes:** Build incrementally: fetch + `console.log` first, then wire up loading state, then the success render, then the error case — same "small steps, test often" habit from Lesson 5–6.

---

### Slide 18 — Reusing the Pattern for Weather or Movies
**Explanation:** The exact same structure (input → fetch → loading → render → error) applies to a weather app or movie search — only the API endpoint and the rendered fields change.
**Code example:**
```js
// Same shape, different API/fields — Movie search (OMDb) example
const response = await fetch(`https://www.omdbapi.com/?apikey=API_KEY&t=${movieTitle}`);
const data = await response.json();
// data.Title, data.Year, data.Poster, data.Plot ...
```
**Instructor notes:** This is a key generalization slide — make explicit that students now have a reusable "API project template" they can apply to almost any public API.

---

### Slide 19 — Recap and What's Next
**Explanation:** Recap: what APIs are, HTTP/JSON basics, fetch, async/await, error handling, loading states, and a full working API-driven project. Preview: Lesson 8 is the final class — Git/GitHub, deployment, DevTools debugging, and using AI tools responsibly — capped off with the Final Project: a complete, deployed business website.
**Instructor notes:** Point out students can now build almost any "search this, show that" app — a genuinely marketable, freelance-ready skill. Good motivational note heading into the final lesson.

---

## 5. Practical Exercises During Class

1. **Console fetch drill:** Students fetch the REST Countries API for their own country and log the result.
2. **Error trigger drill:** Students deliberately search a fake country name and confirm their `catch` block handles it gracefully.
3. **Render drill:** In pairs, students add one additional field (e.g., currency or languages) to the rendered country card.

---

## 6. Homework Assignment

Complete **one** of the three API projects (Section 7) fully:

- Working search input + button
- Loading state shown during the fetch
- Success state rendering real data with proper styling (reusing Tailwind card patterns)
- Error state shown for invalid input/not-found results
- Clean, readable async/await code with try/catch

---

## 7. Mini Project — Choose One: Weather App / Movie Search App / Country Explorer

**Brief (Weather App):** "Build a simple app where a user types a city name and sees the current weather."
**Brief (Movie Search App):** "Build a simple app where a user searches a movie title and sees its poster, year, and plot summary."
**Brief (Country Explorer):** "Build a simple app where a user searches a country and sees its flag, capital, population, and region."

**Requirements (all three):**
- Search input + button
- Fetch from a real public API using async/await
- Loading, success, and error states, all visually styled with Tailwind
- Results rendered dynamically into the DOM (no hardcoded results)

**Stretch goal:** Add a "recent searches" list stored in `localStorage`, combining today's lesson with Lesson 6.

---

## 8. Common Beginner Mistakes

- Forgetting `await` before `fetch()` or `.json()`, resulting in a Promise object instead of usable data.
- Not checking `response.ok` before parsing, so failed requests still try to render (often producing "undefined" in the UI).
- Hardcoding an API key directly in publicly shared code (fine for this course's practice projects, but flag as bad practice for real production apps).
- Forgetting loading states, making the app feel frozen or broken during the request.
- Not handling the empty/invalid search case (searching with a blank input).
- Off API response shapes — assuming a field exists without checking the actual JSON structure returned (encourage `console.log(data)` before writing render code).
- CORS errors when trying random APIs not designed for public browser use — reinforce sticking to documented, CORS-friendly public APIs for this course.

---

## 9. Extra Resources

- [MDN — Using Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)
- [MDN — Async/Await Guide](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Async_await)
- [REST Countries API Docs](https://restcountries.com/)
- [OMDb API Docs](https://www.omdbapi.com/)
- [Open-Meteo Weather API (no key required)](https://open-meteo.com/)
- [JSON.org — JSON Format Reference](https://www.json.org/json-en.html)
