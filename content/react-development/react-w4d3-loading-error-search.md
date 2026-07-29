
# Week 4, Day 3 — Loading, Error Handling & Search

**Khodz Academy — React Development Bootcamp**
**Session:** 12 of 24 | **Duration:** ~1.5–2 hours

---

## 1. Lesson Objectives

By the end of this lesson, students will be able to:

1. Implement loading state using `useState` alongside data fetching.
2. Implement error state and display friendly error messages.
3. Trigger search on form submit / button click instead of every keystroke.
4. Handle empty/no-results states gracefully.
5. Complete a polished, production-quality Movie Search App.

---

## 2. Skills Students Will Learn

- Managing three-state UI: `loading`, `error`, `data` (recap Frontend Foundations Lesson 7's loading/error concept, now in React)
- Setting loading/error state correctly around an async fetch
- Button/form-triggered search instead of fetch-on-every-keystroke
- Handling "no results found" as distinct from "error"
- Building a complete, realistic search experience

---

## 3. Detailed Teaching Outline (~1.5–2 hrs)

| Time | Segment |
|---|---|
| 0:00–0:10 | Recap Day 2 + show and tell |
| 0:10–0:20 | The three-state UI pattern (Slides 1–2) |
| 0:20–0:45 | Implementing loading state (Slides 3–5) — live coding |
| 0:45–1:05 | Implementing error handling (Slides 6–8) — live coding |
| 1:05–1:20 | Button-triggered search + empty results (Slides 9–11) — live coding |
| 1:20–1:30 | Recap, common mistakes, Q&A (Slide 12) |

---

## 4. Slide-by-Slide Presentation Content

### Slide 1 — Recap: The Three-State UI Pattern
**Explanation:** Recall Frontend Foundations Lesson 7: every API-driven UI has three states — loading (waiting), error (something went wrong), success (data ready). Today formalizes this pattern properly in React using state.
**Instructor notes:** Draw the same 3-state diagram used in Frontend Foundations Lesson 7 (Slide 8-ish) again here — visual continuity reinforces the concept is not new, just newly implemented.

---

### Slide 2 — Why This Matters for Real Apps
**Explanation:** Without loading/error handling, users see either a frozen blank screen (no loading indicator) or a broken app with no explanation when something fails (no error handling) — both are considered unacceptable in professional products.
**Instructor notes:** Frame this as the difference between "a demo" and "a real product" — a favorite framing throughout the course, worth repeating here.

---

### Slide 3 — Adding a Loading State Variable
**Code example:**
```jsx
const [loading, setLoading] = useState(false);
```
**Instructor notes:** Simple slide — just introduces the new piece of state before wiring it up in the next slide.

---

### Slide 4 — Wiring Loading State Around the Fetch
**Code example:**
```jsx
const fetchMovie = async (title) => {
  setLoading(true);
  const response = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&t=${title}`);
  const data = await response.json();
  setMovie(data);
  setLoading(false);
};
```
**Instructor notes:** Emphasize the pattern: `setLoading(true)` right before the fetch starts, `setLoading(false)` right after it completes — regardless of success (fully handled properly with try/finally next).

---

### Slide 5 — Rendering the Loading State
**Code example:**
```jsx
{loading && <p className="text-gray-500">Searching...</p>}
```
**Instructor notes:** Recap the `&&` short-circuit pattern from Week 2, Day 1 explicitly — "this is that exact pattern, now driven by real network timing instead of a hardcoded boolean."

---

### Slide 6 — Adding an Error State Variable
**Code example:**
```jsx
const [error, setError] = useState(null);
```
**Instructor notes:** Explain `null` as the "no error currently" default — recap `null` from Frontend Foundations Lesson 5.

---

### Slide 7 — try/catch/finally Around the Fetch
**Explanation:** Wrap the fetch in `try/catch` (recap Frontend Foundations Lesson 7), and use `finally` to guarantee `setLoading(false)` runs whether the request succeeds or fails.
**Code example:**
```jsx
const fetchMovie = async (title) => {
  setLoading(true);
  setError(null);

  try {
    const response = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&t=${title}`);
    const data = await response.json();

    if (data.Response === "False") {
      throw new Error(data.Error || "Movie not found");
    }

    setMovie(data);
  } catch (err) {
    setError(err.message);
    setMovie(null);
  } finally {
    setLoading(false);
  }
};
```
**Instructor notes:** Point out OMDb's quirk: it returns HTTP 200 even for "not found" results, with `Response: "False"` in the body — a great real-world lesson that not all APIs signal errors via status codes alone (recap Frontend Foundations Lesson 7's status code discussion, now nuanced).

---

### Slide 8 — Rendering the Error State
**Code example:**
```jsx
{error && (
  <p className="text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>
)}
```
**Instructor notes:** Trigger a deliberate error (search a nonsense title) live to show this render in action — concrete demo over abstract explanation, consistent with the course's teaching style throughout.

---

### Slide 9 — Switching to Button/Form-Triggered Search
**Explanation:** Instead of fetching on every keystroke (Day 2's rough version), trigger the search only on form submission — better UX, fewer wasted API calls, recap controlled forms from Week 2, Day 3.
**Code example:**
```jsx
function MovieSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&t=${searchTerm}`);
      const data = await response.json();
      if (data.Response === "False") throw new Error(data.Error || "Movie not found");
      setMovie(data);
    } catch (err) {
      setError(err.message);
      setMovie(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex gap-2 mb-6">
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search a movie..."
        className="flex-1 border px-4 py-2 rounded-lg"
      />
      <Button type="submit" variant="primary">Search</Button>
    </form>
  );
}
```
**Instructor notes:** Point out this no longer needs `useEffect` at all, since the fetch is triggered directly by the form's `onSubmit` handler rather than a dependency change — an important realization: not every fetch needs `useEffect`, only fetches tied to render/mount/dependency changes do.

---

### Slide 10 — Rendering the Result
**Code example:**
```jsx
{movie && (
  <Card className="flex gap-4">
    <img src={movie.Poster} alt={movie.Title} className="w-24 rounded" />
    <div>
      <h3 className="font-bold text-lg">{movie.Title} ({movie.Year})</h3>
      <p className="text-gray-600 text-sm">{movie.Plot}</p>
    </div>
  </Card>
)}
```
**Instructor notes:** Reuse the `Card` component from Week 3 here — another explicit callback proving the UI kit investment pays dividends across projects.

---

### Slide 11 — Full Three-State Render Logic
**Code example:**
```jsx
{loading && <p className="text-gray-500">Searching...</p>}
{error && <p className="text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}
{!loading && !error && movie && (
  <Card className="flex gap-4">
    <img src={movie.Poster} alt={movie.Title} className="w-24 rounded" />
    <div>
      <h3 className="font-bold text-lg">{movie.Title} ({movie.Year})</h3>
      <p className="text-gray-600 text-sm">{movie.Plot}</p>
    </div>
  </Card>
)}
```
**Instructor notes:** Walk through why `!loading && !error` guards the result render — prevents briefly showing stale movie data underneath a loading or error message. This is the day's key "putting it all together" moment.

---

### Slide 12 — Recap and What's Next
**Explanation:** Recap: loading state, error state with `try/catch/finally`, button-triggered search, and the complete three-state render pattern — resulting in a polished, professional Movie Search App. Preview: Week 5 introduces React Router, turning single-page apps into proper multi-page experiences with URLs, heading toward the Multi-page Website project.
**Instructor notes:** Celebrate this as the completion of "Month 1: React Fundamentals" — a genuine milestone. Recap the whole month's arc briefly: components → state → lists/forms → styling/reusability → effects/APIs.

---

## 5. Practical Exercises During Class

1. **Loading state drill:** Students add a loading indicator to a fetch they built in Day 2's homework.
2. **Error trigger drill:** Students deliberately search an invalid movie title and confirm the error message renders correctly.
3. **Full build-along:** Every student wires up the complete `handleSearch` function (Slide 9) with the instructor.

---

## 6. Homework Assignment

Complete and polish the **Movie Search App** (Section 7) fully, including all three states, button-triggered search, and empty-state handling for the case where no search has been made yet (e.g., "Search for a movie to get started").

---

## 7. Mini Project — Movie Search App (Final)

**Brief:** "Complete a polished, production-quality movie search application."

**Requirements:**
- Controlled search input + form (button-triggered, not per-keystroke)
- Loading state shown during the fetch
- Error state shown for invalid/not-found searches, with a friendly message
- Success state rendering the movie's poster, title, year, and plot using the `Card` component
- Initial empty state before any search has been made
- Clean, correctly ordered conditional rendering (loading → error → result → initial empty state)

**Stretch goal:** Add a "recent searches" list using `localStorage` (recap Frontend Foundations Lesson 6), stored as an array and re-searchable with one click.

---

## 8. Common Beginner Mistakes

- Forgetting `setLoading(false)` in the `catch` block (fixed by using `finally`, but worth understanding why `finally` is the right tool here).
- Not resetting `error` to `null` at the start of a new search, causing an old error message to linger alongside a new successful result.
- Rendering the result before checking `!loading && !error`, causing a flash of stale data.
- Not distinguishing "no results found" (a valid, expected outcome) from a true error (network failure) — recap the OMDb-specific quirk from Slide 7.
- Forgetting the empty-input guard, allowing a fetch with a blank search term.

---

## 9. Extra Resources

- [React — You Might Not Need an Effect (fetch-on-event vs fetch-on-mount)](https://react.dev/learn/you-might-not-need-an-effect)
- [MDN — try...catch...finally](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch)
- [OMDb API Documentation](https://www.omdbapi.com/)
