
# Week 5, Day 3 — Dynamic Routes

**Khodz Academy — React Development Bootcamp**
**Session:** 15 of 24 | **Duration:** ~1.5–2 hours

---

## 1. Lesson Objectives

By the end of this lesson, students will be able to:

1. Define dynamic route segments using URL parameters.
2. Read URL parameters with `useParams`.
3. Use a single route template to render many different "pages" from data.
4. Handle invalid/missing dynamic route data gracefully.
5. Complete the Multi-page Website project with a dynamic project/blog detail page.

---

## 2. Skills Students Will Learn

- Dynamic segments in route paths (`:id`, `:slug`)
- `useParams()` to read the current URL's dynamic value
- Looking up data based on a URL parameter (from a local array, or an API — recap Week 4)
- Linking to dynamic routes with template literals
- Handling "not found" cases for invalid dynamic IDs
- `useSearchParams` for query strings (brief introduction)

---

## 3. Detailed Teaching Outline (~1.5–2 hrs)

| Time | Segment |
|---|---|
| 0:00–0:10 | Recap Day 2 + show and tell |
| 0:10–0:20 | Why dynamic routes matter (Slides 1–2) |
| 0:20–0:45 | Defining and reading dynamic routes (Slides 3–6) — live coding |
| 0:45–1:05 | Linking to dynamic routes + not-found handling (Slides 7–9) — live coding |
| 1:05–1:20 | Query strings with useSearchParams (Slide 10) — live coding |
| 1:20–1:30 | Recap, common mistakes, Q&A (Slide 11) |

---

## 4. Slide-by-Slide Presentation Content

### Slide 1 — The Problem: One Page Per Item Doesn't Scale
**Explanation:** Writing a separate `<Route>` and component for every single project, blog post, or product would be unmanageable at scale (imagine 500 products needing 500 hardcoded routes). Dynamic routes let *one* route template render different content based on a value in the URL.
**Real-world example:** Amazon doesn't have a hardcoded route for every product — `/product/:id` is one route template serving millions of different pages.
**Instructor notes:** This scaling argument is the day's core motivation — make it concrete with a familiar example before touching code.

---

### Slide 2 — What Is a Dynamic Route Segment?
**Explanation:** A colon-prefixed segment in a route path (`:id`) acts as a variable — React Router matches any value in that position and makes it available to the component.
**Visual suggestion:** URL breakdown: `/projects/3` → static `projects` + dynamic `3` (captured as `id`).
**Instructor notes:** Keep this visual on screen while building the first example — a constant reference point.

---

### Slide 3 — Defining a Dynamic Route
**Code example:**
```jsx
<Route path="/projects/:id" element={<ProjectDetail />} />
```
**Instructor notes:** Point out `:id` is just a name chosen by the developer — could be `:slug`, `:projectId`, anything descriptive; React Router doesn't care what it's called, only that it starts with `:`.

---

### Slide 4 — Reading the Parameter with useParams
**Code example:**
```jsx
import { useParams } from "react-router-dom";

function ProjectDetail() {
  const { id } = useParams();

  return <p>Showing project with ID: {id}</p>;
}
```
**Instructor notes:** Navigate to `/projects/1`, `/projects/2`, `/projects/anything` live and show the value updating — makes the "captured from the URL" concept concrete immediately.

---

### Slide 5 — Looking Up Data from the Parameter
**Explanation:** Combine `useParams` with a local data array (or, in a real app, an API call using the id) to find and display the matching item.
**Code example:**
```jsx
const projects = [
  { id: "1", title: "Portfolio Site", description: "A personal site built with React." },
  { id: "2", title: "SaaS Landing Page", description: "Marketing page for a startup." },
];

function ProjectDetail() {
  const { id } = useParams();
  const project = projects.find((p) => p.id === id);

  if (!project) {
    return <p className="text-gray-500">Project not found.</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold">{project.title}</h2>
      <p className="text-gray-600">{project.description}</p>
    </div>
  );
}
```
**Instructor notes:** Recap `.find()` briefly if not previously covered explicitly — a natural array method extension of `.filter()`/`.map()` already known. Point out the early-return `!project` guard — direct recap of Week 2, Day 1's pattern.

---

### Slide 6 — Combining with useEffect for API-Driven Detail Pages
**Explanation:** In real apps, the id is often used to fetch specific data from an API rather than searching a local array — combine `useParams` with `useEffect` + `fetch` (recap Week 4).
**Code example:**
```jsx
function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    const fetchMovie = async () => {
      const response = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}`);
      const data = await response.json();
      setMovie(data);
    };
    fetchMovie();
  }, [id]); // re-fetch whenever the id in the URL changes

  if (!movie) return <p>Loading...</p>;

  return <h2>{movie.Title}</h2>;
}
```
**Instructor notes:** Point out `[id]` in the dependency array — recap Week 4, Day 1's dependency array lesson directly: "this effect re-runs whenever the URL's id changes, fetching the correct new movie each time."

---

### Slide 7 — Linking to Dynamic Routes
**Explanation:** Build the `to` value using a template literal that includes the actual data's id.
**Code example:**
```jsx
function ProjectList() {
  return (
    <ul className="flex flex-col gap-2">
      {projects.map((project) => (
        <li key={project.id}>
          <Link to={`/projects/${project.id}`} className="text-blue-600 hover:underline">
            {project.title}
          </Link>
        </li>
      ))}
    </ul>
  );
}
```
**Instructor notes:** Recap template literals (Frontend Foundations Lesson 5) and `.map()`/`key` (Week 2, Day 2) — this slide is a direct synthesis of several earlier lessons, worth naming explicitly.

---

### Slide 8 — Handling Invalid or Missing IDs
**Explanation:** Always account for the case where the URL contains an id that doesn't match any real data (a mistyped URL, deleted item, or someone directly editing the address bar).
**Instructor notes:** Recap Slide 5's `if (!project) return ...` — reiterate that this guard is not optional polish, but a necessary part of any dynamic route.

---

### Slide 9 — Combining Dynamic Routes with Nested Routes
**Explanation:** Dynamic segments can appear inside nested route structures too — e.g., `/dashboard/orders/:id` for an order detail page within the Week 5, Day 2 dashboard layout.
**Code example:**
```jsx
<Route path="dashboard" element={<DashboardLayout />}>
  <Route index element={<DashboardHome />} />
  <Route path="orders" element={<Orders />} />
  <Route path="orders/:id" element={<OrderDetail />} />
</Route>
```
**Instructor notes:** Show this briefly as a natural combination of yesterday's and today's concepts — no new mechanics, just composition of already-known pieces.

---

### Slide 10 — Query Strings with useSearchParams
**Explanation:** For optional, non-identity data in the URL (like filters or sort order), query strings (`?sort=price`) are more appropriate than dynamic segments. `useSearchParams` reads and updates them.
**Code example:**
```jsx
import { useSearchParams } from "react-router-dom";

function ProjectList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category") || "all";

  return (
    <div>
      <button onClick={() => setSearchParams({ category: "web" })}>Web Projects</button>
      <p>Showing: {category}</p>
    </div>
  );
}
```
**Instructor notes:** Keep this as a brief, practical introduction — full filter/sort UI building isn't the focus today; the goal is recognition of the tool for future use.

---

### Slide 11 — Recap and What's Next
**Explanation:** Recap: dynamic route segments, `useParams`, data lookup by id (local array and API-driven), linking to dynamic routes, not-found handling, and a brief look at `useSearchParams`. This completes the Multi-page Website project and Week 5's routing arc. Preview: Week 6 introduces the Context API and custom hooks — sharing state across components without prop drilling, heading toward the Theme Switcher project.
**Instructor notes:** Celebrate the completion of full client-side routing mastery — students can now build genuinely complex, realistic multi-page applications.

---

## 5. Practical Exercises During Class

1. **useParams drill:** Students build a simple `/users/:username` route displaying the username back on screen.
2. **Data lookup drill:** Given a local `products` array, students build a `/products/:id` detail page with not-found handling.
3. **Link generation drill:** Students build a list page linking to each item's dynamic detail route.

---

## 6. Homework Assignment

Complete the **Multi-page Website** (Section 7) with a dynamic detail page:

- A list page (e.g., "Projects" or "Blog") rendering items via `.map()`, each linking to its own dynamic route
- A detail page using `useParams` to look up and display the correct item
- Not-found handling for invalid ids
- Consistent styling using the Week 3 UI kit

---

## 7. Mini Project — Multi-page Website (Final)

**Brief:** "Complete a polished multi-page personal or business website with full routing: static pages, nested layout, and a dynamic detail page."

**Requirements:**
- At least 4 static routes (from Day 1)
- At least one nested layout section (from Day 2)
- At least one dynamic route with `useParams`-based data lookup (from today)
- Not-found handling for both invalid top-level URLs (404) and invalid dynamic ids
- Fully responsive, styled consistently with the Week 3 UI kit
- Deployed is optional at this stage (formal deployment covered in Week 8) but encouraged if time allows

**Stretch goal:** Add `useSearchParams`-based filtering to the list page (e.g., filter projects by category).

---

## 8. Common Beginner Mistakes

- Forgetting the colon in the route definition (`path="projects/id"` instead of `path="projects/:id"`).
- Mismatching the parameter name between the route definition and `useParams()` destructuring (`:id` in the route but destructuring `{ projectId }` in the component).
- Comparing `id` (always a string from `useParams`) to a number in the data without type coercion, causing `.find()` to fail silently.
- Not handling the "not found" case, resulting in a blank or broken page for invalid URLs.
- Forgetting `[id]` in the `useEffect` dependency array when fetching by id, so the detail page doesn't update when navigating between different dynamic URLs of the same route.

---

## 9. Extra Resources

- [React Router — Dynamic Segments](https://reactrouter.com/en/main/start/tutorial#nested-routes)
- [React Router — useParams](https://reactrouter.com/en/main/hooks/use-params)
- [React Router — useSearchParams](https://reactrouter.com/en/main/hooks/use-search-params)
