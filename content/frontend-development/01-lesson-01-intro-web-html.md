
# Lesson 1 — Introduction to Web Development + HTML Fundamentals

**Khodz Academy — Frontend Development Foundations**
**Class:** 1 of 8 | **Duration:** ~2.5 hours

---

## 1. Lesson Objectives

By the end of this lesson, students will be able to:

1. Explain, in plain language, how the internet and the web work.
2. Distinguish frontend from backend development.
3. Set up a professional coding environment using VS Code.
4. Write a complete, valid HTML5 document from scratch.
5. Use semantic HTML tags correctly instead of generic `<div>` soup.
6. Add text, images, links, lists, and a basic form to a page.
7. Publish their first page and view it locally in a browser.

---

## 2. Skills Students Will Learn

- Client-server model, DNS, HTTP basics
- HTML document structure (`<!DOCTYPE>`, `<html>`, `<head>`, `<body>`)
- Semantic elements: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`
- Text tags: headings, paragraphs, `<strong>`, `<em>`, `<br>`
- `<img>` with `alt` text and why it matters
- `<a>` links (internal, external, email)
- Ordered/unordered lists
- Basic form elements: `<form>`, `<input>`, `<label>`, `<textarea>`, `<button>`
- VS Code navigation, Live Server usage
- Reading HTML like a professional (indentation, nesting, closing tags)

---

## 3. Detailed Teaching Outline (2.5 hrs)

| Time | Segment |
|---|---|
| 0:00–0:15 | Welcome, course overview, how Khodz Academy works, what students will build in Month 1 |
| 0:15–0:35 | How the internet/web works (Slides 1–6) |
| 0:35–0:50 | Frontend vs Backend, how websites are actually built at companies (Slides 7–9) |
| 0:50–1:05 | VS Code setup + Live Server (Slides 10–11) — hands-on |
| 1:05–1:15 | **Break** |
| 1:15–1:35 | HTML document structure + first page (Slides 12–15) — live coding |
| 1:35–2:00 | Semantic HTML, text, images, links, lists (Slides 16–21) — live coding |
| 2:00–2:20 | Forms basics (Slides 22–23) — live coding |
| 2:20–2:30 | Assign mini project, Q&A, common mistakes recap |

---

## 4. Slide-by-Slide Presentation Content

### Slide 1 — Welcome to Khodz Academy
**Explanation:** Introduce the course, the instructor, and the promise: in 4 weeks, students will go from zero to building and deploying real websites, ready to learn React next.
**Visual suggestion:** Khodz Academy logo, course title, 8-lesson roadmap graphic.
**Instructor notes:** Set energy and expectations early — this is hands-on, not a lecture course. Mention the "show and tell" ritual at the start of every future class.

---

### Slide 2 — What You'll Build This Month
**Explanation:** Show thumbnails/previews of the 8 mini projects (profile site → landing pages → forms → quiz → dashboard → weather app → final business site).
**Visual suggestion:** A grid of 8 project preview cards.
**Instructor notes:** This slide is motivational — students should see a believable path from "nothing" to "final deployed business website."

---

### Slide 3 — What Is the Internet?
**Explanation:** The internet is a massive network of connected computers that can send data to each other. The Web (WWW) is one thing that runs on top of the internet — a system of linked documents (websites) accessed via browsers.
**Real-world example:** Compare to a postal system — computers have addresses (IP addresses), and data travels between them like letters.
**Visual suggestion:** Simple diagram: your laptop → router → ISP → the wider internet → a server somewhere in the world.
**Instructor notes:** Keep this light — a 3-minute mental model, not a networking course.

---

### Slide 4 — Client and Server
**Explanation:** A **client** requests something (usually a browser). A **server** is a computer that stores the website's files and sends them back when requested. When you type a URL and hit enter, your browser (client) asks a server for that page.
**Real-world example:** Ordering food — you (client) ask a restaurant (server) for a meal; the restaurant prepares and sends it back.
**Visual suggestion:** Arrow diagram: Browser → Request → Server → Response → Browser.
**Instructor notes:** Emphasize this model comes up again in Lesson 7 (APIs) — plant the seed now.

---

### Slide 5 — What Happens When You Visit a Website
**Explanation:** Step by step: (1) You type a URL. (2) DNS translates the domain name into an IP address. (3) Browser sends an HTTP request to that server. (4) Server sends back HTML, CSS, JS files. (5) Browser renders the page.
**Code example:**
```
1. You type: khoodzacademy.com
2. DNS finds: 76.76.21.21
3. Browser requests: GET /index.html
4. Server responds: <html>...</html>
5. Browser paints the page on screen
```
**Visual suggestion:** 5-step numbered flow diagram.
**Instructor notes:** Don't over-explain DNS internals — the goal is just "a name gets converted to an address."

---

### Slide 6 — HTML, CSS, and JavaScript: The Three Pillars
**Explanation:** HTML = structure/content (the skeleton). CSS = style/appearance (the skin and clothes). JavaScript = behavior/interactivity (the muscles/nervous system).
**Real-world example:** A house: HTML is the frame and rooms, CSS is the paint and furniture, JS is the electricity and plumbing that makes things function.
**Visual suggestion:** Three labeled icons/columns (skeleton, paint, lightning bolt).
**Instructor notes:** Reassure students: this month is mostly HTML + Tailwind (CSS). JavaScript starts in week 3. No need to worry about JS syntax yet.

---

### Slide 7 — Frontend vs Backend
**Explanation:** **Frontend** = everything the user sees and interacts with in the browser (HTML/CSS/JS). **Backend** = the server-side logic, databases, and APIs that power the app behind the scenes (not covered in this course).
**Real-world example:** In an app like Instagram: the feed layout, buttons, and animations are frontend; the code that stores your photos and decides what shows in your feed is backend.
**Visual suggestion:** Split-screen diagram — browser UI on the left labeled "Frontend," server/database icons on the right labeled "Backend."
**Instructor notes:** Mention "full-stack" briefly as someone who does both — this is the long-term direction after React, but not this course's focus.

---

### Slide 8 — How Websites Are Actually Built (Industry Reality)
**Explanation:** Real teams use: a code editor, version control (Git/GitHub), component-based frameworks (React, etc. — covered after this course), utility CSS frameworks (Tailwind), and deploy via services like Vercel/Netlify. This course mirrors that real workflow from day one instead of teaching "toy" habits.
**Visual suggestion:** Logos: VS Code, Git, GitHub, Tailwind, Vercel.
**Instructor notes:** This is a credibility-building slide — tell students "you are learning the same tools used at real companies and by freelancers, not a simplified fake version."

---

### Slide 9 — Meet Your Toolkit
**Explanation:** Introduce the tools used throughout the course: VS Code (editor), Live Server (preview), Chrome DevTools (inspect/debug), GitHub (save/share code), Vercel (publish site).
**Visual suggestion:** Toolbox icon with labeled tool icons inside.
**Instructor notes:** Just a preview — deep dives on Git/DevTools happen in Lesson 8.

---

### Slide 10 — Setting Up VS Code
**Explanation:** Install VS Code, walk through the interface: Explorer, Editor, Terminal, Extensions panel. Install extensions: **Live Server**, **Prettier**, **Tailwind CSS IntelliSense** (used from Lesson 2).
**Instructor notes:** Do this live, screen-shared, step by step. Confirm every student has it installed before moving on — this is the single most common place beginners get stuck and disengage.

---

### Slide 11 — Creating Your First Project Folder
**Explanation:** Create a folder called `profile-website`. Open it in VS Code. Create `index.html`. Explain why `index.html` is the default file a server looks for.
**Code example:**
```
profile-website/
└── index.html
```
**Instructor notes:** Emphasize clean folder naming (lowercase, hyphens, no spaces) — this matters later for Git and deployment URLs.

---

### Slide 12 — The Anatomy of an HTML Document
**Explanation:** Every HTML page needs this skeleton. `<!DOCTYPE html>` tells the browser this is HTML5. `<html>` wraps everything. `<head>` holds metadata (not visible content). `<body>` holds everything visible.
**Code example:**
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>My Profile</title>
</head>
<body>

</body>
</html>
```
**Visual suggestion:** Color-coded blocks: head (metadata, not shown) vs body (shown to users).
**Instructor notes:** Type this from scratch live rather than pasting — muscle memory matters for absolute beginners. Explain `<meta viewport>` briefly: "this line is why sites look right on phones," full responsive story comes in Lesson 3.

---

### Slide 13 — Tags, Elements, and Attributes
**Explanation:** A **tag** is `<p>`. An **element** is the tag plus its content: `<p>Hello</p>`. An **attribute** adds extra info inside the opening tag: `<img src="photo.jpg" alt="My photo">`.
**Code example:**
```html
<a href="https://github.com" target="_blank">Visit GitHub</a>
```
**Instructor notes:** Draw the parts on screen with arrows: tag, attribute name, attribute value, closing tag. This vocabulary is used for the rest of the course — get it locked in now.

---

### Slide 14 — Headings and Paragraphs
**Explanation:** `<h1>` through `<h6>` for headings (only one `<h1>` per page, used for the most important title). `<p>` for paragraphs.
**Code example:**
```html
<h1>Joshua Adebayo</h1>
<h2>Frontend Developer</h2>
<p>I build clean, responsive websites for small businesses and startups.</p>
```
**Real-world example:** Compare to a resume — name is biggest (h1), job title smaller (h2), description as body text (p).
**Instructor notes:** Warn against using headings just to make text bigger — that's a CSS job, not HTML's. Headings are for structure/SEO/accessibility.

---

### Slide 15 — Text Formatting Tags
**Explanation:** `<strong>` = important/bold, `<em>` = emphasized/italic, `<br>` = line break (use sparingly), `<hr>` = horizontal divider.
**Code example:**
```html
<p>I am <strong>available for freelance work</strong> starting <em>immediately</em>.</p>
```
**Instructor notes:** Mention `<strong>`/`<em>` are semantic (mean something) vs old `<b>`/`<i>` which are purely visual — semantic tags are best practice and help screen readers.

---

### Slide 16 — Semantic HTML: Why It Matters
**Explanation:** Semantic tags describe *meaning*, not just appearance: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>` vs generic `<div>`. Benefits: better SEO, better accessibility (screen readers), easier for other developers to read your code.
**Code example:**
```html
<header>
  <h1>Joshua Adebayo</h1>
  <nav>
    <a href="#about">About</a>
    <a href="#projects">Projects</a>
    <a href="#contact">Contact</a>
  </nav>
</header>
<main>
  <section id="about">...</section>
</main>
<footer>
  <p>&copy; 2026 Joshua Adebayo</p>
</footer>
```
**Real-world example:** Every professional company site (Apple, Stripe, Airbnb) uses semantic structure — "View Page Source" on any of them shows `<header>`, `<nav>`, `<main>`, `<footer>`.
**Visual suggestion:** A wireframe of a page with each region labeled with its semantic tag.
**Instructor notes:** This is the single highest-leverage habit to instill early — students who learn `<div>`-only HTML build bad habits that are hard to unlearn later.

---

### Slide 17 — Images
**Explanation:** `<img>` is self-closing, needs `src` (path or URL) and `alt` (description for accessibility/SEO/broken images).
**Code example:**
```html
<img src="profile.jpg" alt="Portrait of Joshua Adebayo" width="200" />
```
**Instructor notes:** Show what happens with a broken `src` — the `alt` text is what displays. This makes the "why alt matters" concrete instead of abstract.

---

### Slide 18 — Links
**Explanation:** `<a href="...">` creates links. `href` can point to another page, a section on the same page (`#id`), an external site, or an email (`mailto:`).
**Code example:**
```html
<a href="https://linkedin.com/in/joshua" target="_blank">LinkedIn</a>
<a href="#projects">Jump to Projects</a>
<a href="mailto:joshua@email.com">Email Me</a>
```
**Instructor notes:** Explain `target="_blank"` opens in a new tab — common client request. Mention security note: professionals also add `rel="noopener noreferrer"` with `target="_blank"`.

---

### Slide 19 — Lists
**Explanation:** `<ul>` (unordered/bullets) and `<ol>` (ordered/numbers), both contain `<li>` items.
**Code example:**
```html
<h3>Skills</h3>
<ul>
  <li>HTML &amp; Tailwind CSS</li>
  <li>JavaScript</li>
  <li>Git &amp; GitHub</li>
</ul>
```
**Real-world example:** Skills sections, navigation menus, and FAQ pages almost always use lists under the hood.
**Instructor notes:** Show that `<nav>` links are often wrapped in a `<ul>` — connects back to Slide 16.

---

### Slide 20 — Divs and Spans (Generic Containers)
**Explanation:** `<div>` = generic block-level container, `<span>` = generic inline container. Used when no semantic tag fits — e.g., a wrapper purely for styling.
**Code example:**
```html
<div class="card">
  <span>New</span>
  <p>Project description here.</p>
</div>
```
**Instructor notes:** Frame this correctly: "use semantic tags first, fall back to div/span only when nothing else fits." Prevents div-soup habits.

---

### Slide 21 — Building the Page Skeleton (Live Coding)
**Explanation:** Live-build the profile page skeleton combining everything so far: header with name + nav, main with about/projects/skills sections, footer.
**Code example:**
```html
<body>
  <header>
    <h1>Joshua Adebayo</h1>
    <nav>
      <a href="#about">About</a>
      <a href="#skills">Skills</a>
      <a href="#contact">Contact</a>
    </nav>
  </header>

  <main>
    <section id="about">
      <h2>About Me</h2>
      <img src="profile.jpg" alt="Portrait of Joshua" />
      <p>I'm a beginner frontend developer learning to build for the web.</p>
    </section>

    <section id="skills">
      <h2>Skills</h2>
      <ul>
        <li>HTML</li>
        <li>Tailwind CSS</li>
      </ul>
    </section>
  </main>

  <footer>
    <p>&copy; 2026 Joshua Adebayo. All rights reserved.</p>
  </footer>
</body>
```
**Instructor notes:** Build this together, line by line, narrating decisions out loud ("why section here, why h2 not h1"). Save and refresh in Live Server after each block so students see immediate visual feedback.

---

### Slide 22 — Forms: The Basics
**Explanation:** `<form>` wraps input fields. `<label>` describes an `<input>` (and should use `for`/`id` to link them — accessibility). `<input type="...">` varies by data type (text, email, password). `<textarea>` for multi-line text. `<button>` submits.
**Code example:**
```html
<form>
  <label for="name">Name</label>
  <input type="text" id="name" name="name" placeholder="Your name" />

  <label for="email">Email</label>
  <input type="email" id="email" name="email" placeholder="you@email.com" />

  <label for="message">Message</label>
  <textarea id="message" name="message" rows="4"></textarea>

  <button type="submit">Send</button>
</form>
```
**Instructor notes:** Keep this light — full forms/validation is Lesson 4's entire focus. Today's goal is just: students recognize and can write a basic contact form.

---

### Slide 23 — Recap and What's Next
**Explanation:** Recap: web fundamentals, HTML skeleton, semantic tags, text, images, links, lists, basic forms. Preview: next class turns this plain HTML into a styled, professional-looking page using Tailwind CSS.
**Visual suggestion:** Before/after screenshot — today's unstyled HTML page vs. a styled preview of what it will look like after Lesson 2.
**Instructor notes:** End on the "after" image — creates anticipation for next class.

---

## 5. Practical Exercises During Class

1. **Guided build-along:** Students code the profile page skeleton live with the instructor (Slide 21), pausing at checkpoints to compare their file to the instructor's screen share.
2. **Speed drill:** In pairs, students have 5 minutes to add one new semantic section (e.g., a "Contact" section with a form) without instructor help, then share screens.
3. **Bug hunt:** Instructor shows a broken HTML snippet (unclosed tag, missing `alt`, wrong nesting) on screen; students call out the fix.

---

## 6. Homework Assignment

Finish and polish the **Personal Profile Website**:

- Valid HTML5 structure (`<!DOCTYPE>`, `<head>`, `<body>`)
- Semantic sections: header/nav, about, skills, projects (can be placeholder text), contact, footer
- At least one image with proper `alt` text
- At least 3 links (one internal anchor link, one external, one `mailto:`)
- A skills list (`<ul>`)
- A basic contact form (name, email, message, submit button)
- No styling required yet — plain HTML is expected and fine

Submit by sharing the folder/zip or a GitHub repo link (optional this early — full Git workflow taught in Lesson 8).

---

## 7. Mini Project — Personal Profile Website

**Brief (framed like a real client request):** "I need a simple one-page website about myself that I can send to potential clients and employers. It should introduce me, list my skills, and give people a way to contact me."

**Requirements:**
- Header with name and navigation
- About section with a photo
- Skills list
- Projects/placeholder section
- Contact section with a form
- Footer with copyright

**Stretch goal (optional):** Add a second page (`contact.html`) linked from the nav, to practice multi-page linking.

---

## 8. Common Beginner Mistakes

- Forgetting to close tags (`<p>` without `</p>`), especially with nested elements.
- Using `<h1>`–`<h6>` purely to make text bigger instead of for structure.
- Missing `alt` attributes on images.
- Wrapping everything in `<div>` instead of using semantic tags.
- Forgetting the `<meta viewport>` tag (page will look wrong later once CSS is added).
- Not linking `<label for="">` to the input's `id`, breaking accessibility.
- Saving the file without the `.html` extension, or naming it something other than `index.html` and being confused why Live Server doesn't show it.
- Editing the file but forgetting to save before refreshing the browser.

---

## 9. Extra Resources

- [MDN — HTML Basics](https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/HTML_basics)
- [MDN — HTML Element Reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Element)
- [web.dev — Learn HTML](https://web.dev/learn/html/)
- [freeCodeCamp — Responsive Web Design (HTML section)](https://www.freecodecamp.org/)
- VS Code Live Server extension docs
