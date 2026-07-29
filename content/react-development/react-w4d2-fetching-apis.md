
# Week 4, Day 2 — Fetching APIs

**Khodz Academy — React Development Bootcamp**
**Session:** 11 of 24 | **Duration:** ~1.5–2 hours

---

## 1. Lesson Objectives

By the end of this lesson, students will be able to:

1. Fetch data from a real API inside a React component using `useEffect`.
2. Store fetched data in state and render it.
3. Understand why `useEffect`'s callback can't be `async` directly, and the correct workaround.
4. Fetch data based on a prop/state value (e.g., re-fetching when a search term changes).
5. Begin building the Movie Search App's data-fetching foundation.

---

## 2. Skills Students Will Learn

- Combining `useState` + `useEffect` + `fetch` — the core "data fetching trio"
- The correct pattern for async logic inside `useEffect` (inner async function)
- Storing API results in state and rendering with `.map()` (recap Week 2, Day 2)
- Re-fetching when a dependency changes
- Avoiding race conditions at a beginner-appropriate level (ignoring stale responses)

---

## 3. Detailed Teaching Outline (~1.5–2 hrs)

| Time | Segment |
|---|---|
| 0:00–0:10 | Recap Day 1 + show and tell |
| 0:10–0:20 | Recap: fetch/async from Frontend Foundations (Slide 1) |
| 0:20–0:45 | Fetching data on mount (Slides 2–5) — live coding |
| 0:45–1:05 | Rendering fetched data (Slides 6–7) — live coding |
| 1:05–1:20 | Re-fetching on dependency change (Slides 8–9) — live coding |
| 1:20–1:30 | Recap, common mistakes, Q&A (Slide 10) |

---

## 4. Slide-by-Slide Presentation Content

### Slide 1 — Recap: fetch and async/await
**Explanation:** Recall Frontend Foundations Lesson 7: `fetch()`, `.json()`, `async/await`, `try/catch`. All of that knowledge transfers directly — today's only new piece is *where* that code lives inside a React component: inside `useEffect`.
**Instructor notes:** Keep this brief — a checkpoint, not new teaching. Ask a student to explain `async/await` in their own words as a quick recall check.

---

### Slide 2 — Why fetch() Belongs Inside useEffect
**Explanation:** Fetching data is a side effect (recall Day 1) — it reaches outside the component to a server. It shouldn't run directly in the component body (would re-fetch every render), so it belongs inside `useEffect`, typically with an empty dependency array to fetch once when the component mounts.
**Instructor notes:** Directly connect Day 1's "why not just run code in the component body" argument (Slide 2 of that lesson) to this specific, practical case.

---

### Slide 3 — Why useEffect's Callback Can't Be async Directly
**Explanation:** `useEffect`'s callback function must return either nothing or a cleanup function — an `async` function always returns a Promise, which conflicts with that rule. Workaround: define an inner async function and call it immediately.
**Code example:**
```jsx
// ❌ Don't do this — useEffect callback can't be async
useEffect(async () => {
  const response = await fetch(url);
}, []);

// ✅ Correct pattern — inner async function
useEffect(() => {
  const fetchData = async () => {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
  };

  fetchData();
}, []);
```
**Instructor notes:** Show the broken version's console warning live — makes the workaround memorable rather than an arbitrary rule to accept blindly.

---

### Slide 4 — Storing Fetched Data in State
**Explanation:** Combine `useState` (to hold the result) with `useEffect` (to trigger the fetch) — the data starts as an empty/default value and updates once the fetch resolves, triggering a re-render.
**Code example:**
```jsx
import { useState, useEffect } from "react";

function CountryList() {
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    const fetchCountries = async () => {
      const response = await fetch("https://restcountries.com/v3.1/region/africa");
      const data = await response.json();
      setCountries(data);
    };

    fetchCountries();
  }, []);

  return (
    <ul>
      {countries.map((c) => (
        <li key={c.cca3}>{c.name.common}</li>
      ))}
    </ul>
  );
}
```
**Instructor notes:** Build this fully live, using `console.log(data)` first to inspect the real API shape before writing the render logic — recap Frontend Foundations Lesson 7's advice to always inspect real data first.

---

### Slide 5 — Recap: REST Countries API (from Frontend Foundations)
**Explanation:** Reuse the REST Countries API from Frontend Foundations Lesson 7 as a familiar, no-API-key-required example before moving to the Movie API (which requires a key) for the main project.
**Instructor notes:** This continuity is deliberate — reduces new-tool friction while focusing entirely on the new React pattern.

---

### Slide 6 — Rendering Fetched Data as Components
**Explanation:** Combine fetched data with the reusable `Card` component from Week 3 to render results properly, not just plain text.
**Code example:**
```jsx
function CountryCard({ country }) {
  return (
    <Card>
      <img src={country.flags.png} alt={country.name.common} className="w-16 mb-2 rounded" />
      <h3 className="font-bold">{country.name.common}</h3>
      <p className="text-gray-500 text-sm">{country.region}</p>
    </Card>
  );
}

function CountryList() {
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    const fetchCountries = async () => {
      const response = await fetch("https://restcountries.com/v3.1/region/africa");
      const data = await response.json();
      setCountries(data);
    };
    fetchCountries();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {countries.map((c) => (
        <CountryCard key={c.cca3} country={c} />
      ))}
    </div>
  );
}
```
**Instructor notes:** Point out this combines nearly every skill from the course so far: components, props, `.map()`, `key`, Tailwind grid, `useState`, `useEffect`, and `fetch` — a genuine synthesis moment worth naming explicitly.

---

### Slide 7 — Setting Up the Movie API for the Project
**Explanation:** Introduce OMDb (or a similar free movie API) and how to get a free API key — the API used for this week's Movie Search App project.
**Code example:**
```jsx
const API_KEY = "your_key_here";

const fetchMovie = async (title) => {
  const response = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&t=${title}`);
  const data = await response.json();
  console.log(data);
};
```
**Instructor notes:** Help every student obtain their own free API key during class — a common friction point worth resolving live rather than as unsupervised homework.

---

### Slide 8 — Fetching Based on a Search Term (Dependency-Driven Fetching)
**Explanation:** Instead of fetching once on mount, fetch whenever a `searchTerm` state value changes — combine a controlled input (recap Week 2, Day 3) with `useEffect`'s dependency array.
**Code example:**
```jsx
function MovieSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    if (!searchTerm) return;

    const fetchMovie = async () => {
      const response = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&t=${searchTerm}`);
      const data = await response.json();
      setMovie(data);
    };

    fetchMovie();
  }, [searchTerm]);

  return (
    <div>
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search a movie..."
        className="border px-4 py-2 rounded-lg w-full"
      />
      {movie && <p>{movie.Title}</p>}
    </div>
  );
}
```
**Instructor notes:** Point out the `if (!searchTerm) return;` guard inside the effect — prevents an unnecessary fetch on initial empty state, recap the early-return pattern from Week 2, Day 1.

---

### Slide 9 — A Note on Fetching on Every Keystroke
**Explanation:** The pattern above re-fetches on *every* keystroke, which is wasteful and can cause flickering/race conditions with fast typing — a debounced or button-triggered search is the better real-world approach, covered properly tomorrow (Day 3) alongside loading/error states.
**Instructor notes:** Flag this honestly as "good enough to understand the mechanism today, but not the final version" — prevents students from thinking today's code is production-ready.

---

### Slide 10 — Recap and What's Next
**Explanation:** Recap: fetching inside `useEffect`, the async-function workaround, storing results in state, rendering fetched data as components, and dependency-driven fetching. Preview: Day 3 adds proper loading states, error handling, and a button-triggered search — completing the Movie Search App.
**Instructor notes:** Reassure students the "rough edges" flagged today (Slide 9) get resolved tomorrow — keeps expectations calibrated and curiosity intact.

---

## 5. Practical Exercises During Class

1. **Fetch-on-mount drill:** Students build a component that fetches and displays 3 countries from REST Countries on mount.
2. **API key setup:** Every student registers for and tests their OMDb (or chosen movie API) key with a single manual fetch, logging the result.
3. **Dependency-fetch drill:** Students wire up the `searchTerm`-driven fetch from Slide 8 with their own component.

---

## 6. Homework Assignment

- Build the initial version of the **Movie Search App**: a controlled search input wired to `useEffect`-driven fetching (Slide 8's pattern), rendering the movie's title, year, and poster when found.
- Add a guard against empty search terms (no fetch attempted when the input is empty).
- Note (in a comment) at least one rough edge you noticed (e.g., fetching too often, no loading indicator) — this primes tomorrow's lesson.

---

## 7. Mini Project — Movie Search App (Part 1: Basic Fetching)

**Brief:** "Build the data-fetching foundation of a movie search app — polish (loading/error states) comes next session."

**Requirements:**
- Controlled search input
- `useEffect` + `fetch` fetching movie data based on the search term
- Rendered result: movie title, year, poster image
- Guard against empty search input

*(Loading states, error handling, and debounced/button search completed in Day 3.)*

---

## 8. Common Beginner Mistakes

- Passing an `async` function directly to `useEffect` instead of using the inner-function workaround.
- Forgetting the dependency array, causing infinite re-fetching loops (especially dangerous when combined with `setState` inside the effect).
- Not guarding against empty/invalid search terms, causing unnecessary or broken API calls.
- Forgetting `key` when rendering fetched lists (recap Week 2, Day 2).
- Not inspecting the real API response shape with `console.log` before writing render code, leading to `undefined` errors when field names don't match assumptions.
- Exposing a real, paid, or rate-limited API key carelessly in shared/public code — flag as a general awareness point, not a today-blocking issue for this course's free-tier practice keys.

---

## 9. Extra Resources

- [React — Fetching Data with Effects (and its limitations)](https://react.dev/learn/synchronizing-with-effects#fetching-data)
- [OMDb API Documentation](https://www.omdbapi.com/)
- [MDN — Using Fetch (recap)](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)
