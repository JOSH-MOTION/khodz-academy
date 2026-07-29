
# Lesson 3 — Responsive Websites and Components

**Khodz Academy — Frontend Development Foundations**
**Class:** 3 of 8 | **Duration:** ~2.5 hours

---

## 1. Lesson Objectives

By the end of this lesson, students will be able to:

1. Design layouts that adapt cleanly across mobile, tablet, and desktop.
2. Build a professional, reusable navbar component, including a mobile hamburger menu.
3. Build a reusable footer component.
4. Build card and button components that can be reused across a site.
5. Structure a multi-section landing page using consistent, repeatable patterns.
6. Write a small amount of JavaScript to toggle the mobile menu (their first JS, guided).

---

## 2. Skills Students Will Learn

- Designing "mobile-first, then scale up" layouts
- Using Tailwind breakpoints (`sm:`, `md:`, `lg:`) deliberately across a full page
- Responsive navbar patterns (desktop links vs. mobile hamburger)
- Toggling visibility with a simple JavaScript `onclick` + class toggle (preview of Lesson 6)
- Building and reusing card components
- Button variants (primary, secondary, outline)
- Structuring a page into repeatable, consistent sections
- Basic component thinking (the same card/button "shape" reused with different content) — this mindset transfers directly into React later

---

## 3. Detailed Teaching Outline (2.5 hrs)

| Time | Segment |
|---|---|
| 0:00–0:10 | Show and tell: Business Landing Pages from Lesson 2 |
| 0:10–0:25 | Responsive design deep dive: breakpoints & strategy (Slides 1–4) |
| 0:25–0:50 | Building a responsive navbar (Slides 5–8) — live coding |
| 0:50–1:10 | Mobile hamburger menu with JavaScript (Slides 9–11) — live coding |
| 1:10–1:20 | **Break** |
| 1:20–1:40 | Reusable card components (Slides 12–14) — live coding |
| 1:40–1:55 | Button variants and CTAs (Slides 15–16) — live coding |
| 1:55–2:15 | Footer + assembling a full responsive page (Slides 17–19) |
| 2:15–2:30 | Assign project, recap, common mistakes |

---

## 4. Slide-by-Slide Presentation Content

### Slide 1 — What "Responsive" Really Means
**Explanation:** A responsive website adapts its layout, spacing, and sometimes content to fit any screen size — phone, tablet, laptop, ultra-wide monitor — using one codebase.
**Real-world example:** Open a site like Airbnb or Stripe and resize the browser from full width down to phone width — same content, layout rearranges.
**Visual suggestion:** One webpage shown as three states: phone, tablet, desktop.
**Instructor notes:** Do this live — resize a real production website in class so students see it's not a "student trick," it's the professional standard.

---

### Slide 2 — Designing Mobile-First (Recap + Deepen)
**Explanation:** Recap from Lesson 2: default (unprefixed) Tailwind classes = mobile styles. `md:`/`lg:` prefixes = "starting from this size, override with this style." Today we apply this across an entire page, not just one element.
**Code example:**
```html
<div class="text-center md:text-left">
  <h1 class="text-3xl md:text-5xl">Grow Your Business Online</h1>
</div>
```
**Instructor notes:** Reinforce: "mobile-first" doesn't mean "mobile-only" — it means start simple, layer complexity as screen size grows.

---

### Slide 3 — Common Responsive Patterns
**Explanation:** Three patterns cover 90% of real layouts: (1) **Stack → Row**: `flex-col md:flex-row`. (2) **Grid columns grow**: 1 column on mobile → 2–3 on desktop. (3) **Hide/show**: some elements only appear on certain screen sizes (`hidden md:block`).
**Code example:**
```html
<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
  <div class="bg-white p-6 rounded-xl shadow">Feature 1</div>
  <div class="bg-white p-6 rounded-xl shadow">Feature 2</div>
  <div class="bg-white p-6 rounded-xl shadow">Feature 3</div>
</div>
```
**Instructor notes:** Introduce `grid`/`grid-cols-` briefly here as an alternative to flex for even column layouts — students will use both throughout the course.

---

### Slide 4 — Hidden and Block: Showing/Hiding by Screen Size
**Explanation:** `hidden` removes an element; `md:block` (or `md:flex`) shows it again from that breakpoint up. This is exactly how desktop nav links vs. mobile hamburger icons are handled.
**Code example:**
```html
<span class="md:hidden">☰ Menu Icon (mobile only)</span>
<div class="hidden md:flex gap-6">Desktop Nav Links</div>
```
**Instructor notes:** Flag this as the exact technique used in the navbar build coming up next — creates a "wait, I already know this" moment.

---

### Slide 5 — Anatomy of a Professional Navbar
**Explanation:** A navbar typically has: brand/logo (left), nav links (right, desktop only), and a hamburger icon (right, mobile only) that reveals a dropdown menu when tapped.
**Visual suggestion:** Annotated navbar diagram, desktop version and mobile version side by side.
**Instructor notes:** Reference 2–3 real sites' navbars students will recognize (e.g., any SaaS homepage) to ground the pattern in reality.

---

### Slide 6 — Building the Desktop Navbar
**Explanation:** Use `flex items-center justify-between` (from Lesson 2) as the container; desktop links hidden below `md`.
**Code example:**
```html
<nav class="flex items-center justify-between px-6 py-4 bg-white shadow-md">
  <span class="font-bold text-xl text-blue-600">BrightBakery</span>
  <div class="hidden md:flex gap-8 text-gray-700">
    <a href="#home" class="hover:text-blue-600">Home</a>
    <a href="#menu" class="hover:text-blue-600">Menu</a>
    <a href="#about" class="hover:text-blue-600">About</a>
    <a href="#contact" class="hover:text-blue-600">Contact</a>
  </div>
</nav>
```
**Instructor notes:** Introduce `hover:` utility here naturally — small addition, big polish payoff. Build this fully live.

---

### Slide 7 — Adding the Mobile Menu Icon
**Explanation:** Add a hamburger icon button, visible only on mobile (`md:hidden`), that will later toggle the menu open/closed.
**Code example:**
```html
<button id="menu-btn" class="md:hidden text-2xl">☰</button>
```
**Instructor notes:** Keep the icon simple (☰ character or a basic SVG) — don't get distracted by icon libraries today, that's a nice-to-have, not the lesson focus.

---

### Slide 8 — The Mobile Dropdown Panel
**Explanation:** Build a hidden panel below the navbar containing the same links, stacked vertically, that will be shown/hidden via JavaScript.
**Code example:**
```html
<div id="mobile-menu" class="hidden md:hidden flex-col gap-4 px-6 py-4 bg-white">
  <a href="#home">Home</a>
  <a href="#menu">Menu</a>
  <a href="#about">About</a>
  <a href="#contact">Contact</a>
</div>
```
**Instructor notes:** Note the panel starts `hidden` — students should predict "so how does it appear?" before you reveal the JS in the next slide.

---

### Slide 9 — Your First JavaScript: Toggling the Menu
**Explanation:** A tiny bit of JavaScript can select an element and toggle a class on click. Full JS teaching starts in Lesson 5 — for now, treat this as a "magic recipe" students can explain conceptually, not master syntactically yet.
**Code example:**
```html
<script>
  const menuBtn = document.getElementById("menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");

  menuBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
    mobileMenu.classList.toggle("flex");
  });
</script>
```
**Instructor notes:** Explain in plain English: "find the button, listen for a click, and when it happens, flip the menu's hidden class on and off." Don't dive into `addEventListener` mechanics deeply — reassure students this becomes crystal clear in Lesson 5–6.

---

### Slide 10 — Testing the Hamburger Menu
**Explanation:** Resize the browser to mobile width, click the hamburger icon, confirm the menu opens and closes.
**Instructor notes:** Live demo + have every student replicate and test on their own file. This is often the first "wow, I made something interactive" moment of the course — let it land.

---

### Slide 11 — Why This Matters (Real-World Connection)
**Explanation:** Every professional website with a navbar uses this exact pattern (hide/show + JS toggle) — whether hand-coded or via a framework component library.
**Instructor notes:** Reinforce that this "small trick" is literally production-grade — no shortcuts were taken.

---

### Slide 12 — Designing a Reusable Card Component
**Explanation:** A card is a repeatable content block: image/icon, title, description, optional action. Once designed once, the same structure is reused with different content across a page (services, testimonials, pricing, blog previews).
**Code example:**
```html
<div class="bg-white rounded-xl shadow-md p-6 flex flex-col gap-3">
  <div class="text-3xl">🍞</div>
  <h3 class="font-bold text-lg">Fresh Bread Daily</h3>
  <p class="text-gray-600 text-sm">Baked fresh every morning using local ingredients.</p>
</div>
```
**Instructor notes:** Emphasize "component thinking" here explicitly — this is the same mental model React will formalize later. Planting this seed now makes the transition to React much smoother.

---

### Slide 13 — Repeating the Card in a Responsive Grid
**Explanation:** Combine the card with `grid grid-cols-1 md:grid-cols-3 gap-6` to build a full responsive features section.
**Code example:**
```html
<section class="px-6 py-16">
  <h2 class="text-3xl font-bold text-center mb-10">Why Choose Us</h2>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <!-- 3 cards here, same structure, different content -->
  </div>
</section>
```
**Instructor notes:** Have students copy-paste the card 3 times and only change text/emoji — reinforces "same shape, different content."

---

### Slide 14 — Card Variants: Testimonials
**Explanation:** The same card structure adapts to a testimonial: quote text, customer name, small avatar.
**Code example:**
```html
<div class="bg-white rounded-xl shadow-md p-6">
  <p class="text-gray-600 italic">"Best bakery in town, hands down!"</p>
  <div class="flex items-center gap-3 mt-4">
    <div class="w-10 h-10 rounded-full bg-blue-200"></div>
    <span class="font-semibold text-sm">— Amaka O.</span>
  </div>
</div>
```
**Instructor notes:** Point out this is the exact same box-shadow-padding-rounded recipe as the feature card — just different content. Reinforces the reusability concept from Slide 12.

---

### Slide 15 — Button Variants
**Explanation:** Define 2–3 consistent button styles used throughout a site: primary (solid, high-contrast, for main actions), secondary (outline or lighter, for less important actions).
**Code example:**
```html
<button class="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700">
  Order Now
</button>
<button class="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50">
  Learn More
</button>
```
**Real-world example:** Nearly every SaaS landing page pairs one primary CTA button with one secondary/ghost button in the hero section.
**Instructor notes:** Discuss button hierarchy briefly — only one primary action per section, to avoid confusing the user about what to click.

---

### Slide 16 — Call-to-Action (CTA) Sections
**Explanation:** A CTA section is a focused block designed to drive one action (sign up, order, book a call) — usually a heading, one line of supporting text, and a prominent button.
**Code example:**
```html
<section class="bg-blue-600 text-white text-center py-16 px-6">
  <h2 class="text-3xl font-bold mb-4">Ready to Taste the Difference?</h2>
  <p class="mb-6">Order online and get 10% off your first purchase.</p>
  <button class="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold">Order Now</button>
</section>
```
**Instructor notes:** Point out contrast: swapping to a solid background section (instead of white) is a simple, high-impact design move worth reusing constantly.

---

### Slide 17 — Building a Reusable Footer
**Explanation:** A footer typically includes: brand/copyright, quick links, and contact/social info — laid out in columns on desktop that stack on mobile.
**Code example:**
```html
<footer class="bg-gray-900 text-gray-300 px-6 py-10">
  <div class="flex flex-col md:flex-row justify-between gap-8">
    <div>
      <h3 class="text-white font-bold text-lg">BrightBakery</h3>
      <p class="text-sm mt-2">Freshly baked, every single day.</p>
    </div>
    <div class="flex flex-col gap-2 text-sm">
      <a href="#home">Home</a>
      <a href="#menu">Menu</a>
      <a href="#contact">Contact</a>
    </div>
  </div>
  <p class="text-xs text-center mt-8 text-gray-500">&copy; 2026 BrightBakery. All rights reserved.</p>
</footer>
```
**Instructor notes:** Note the `flex-col md:flex-row` pattern reappears — by now students should recognize it without prompting; ask them what it does before revealing.

---

### Slide 18 — Assembling the Full Page
**Explanation:** Combine everything into one page structure: navbar → hero → features (cards) → testimonials → CTA → footer.
**Code example:**
```
<body>
  <nav>...</nav>
  <section id="hero">...</section>
  <section id="features">...(cards)...</section>
  <section id="testimonials">...(cards)...</section>
  <section id="cta">...</section>
  <footer>...</footer>
</body>
```
**Instructor notes:** Zoom out here — show the whole page structure as an outline before diving back into code, so students see how sections compose into a full site.

---

### Slide 19 — Recap and What's Next
**Explanation:** Recap: responsive strategy, navbar with mobile hamburger menu, reusable cards, button variants, CTA sections, footer, full page assembly. Preview: Lesson 4 focuses entirely on forms and UX — inputs, validation, error messages — building a real registration page.
**Visual suggestion:** Full-page screenshot of the completed SaaS landing page, desktop and mobile side by side.
**Instructor notes:** Celebrate this milestone — by lesson 3, students have a genuinely presentable, responsive, multi-section site with their first working JavaScript.

---

## 5. Practical Exercises During Class

1. **Navbar build-along:** Every student builds the responsive navbar + hamburger menu step by step with the instructor, testing at both screen widths.
2. **Card cloning drill:** Students duplicate a card component 3 times and customize content within a 5-minute timer, without instructor help.
3. **Resize audit:** In pairs, students resize each other's in-progress page from desktop to mobile width and call out anything that looks broken.

---

## 6. Homework Assignment

Complete the **SaaS Landing Page** project (Section 7), ensuring it is fully responsive and includes:

- A navbar with a working mobile hamburger menu
- A hero section with heading, subtext, and primary + secondary buttons
- A features section using at least 3 reusable cards in a responsive grid
- A CTA section with a solid background color
- A footer with brand info and links
- Verified to look good at mobile (375px), tablet (768px), and desktop (1280px) widths

---

## 7. Mini Project — SaaS Landing Page

**Brief:** "A startup (choose a concept: task management app, budgeting app, fitness app, note-taking app) needs a landing page to convert visitors into sign-ups."

**Requirements:**
- Responsive navbar with mobile hamburger menu (functional)
- Hero section with a strong headline, subtext, and two CTA buttons
- Features section: 3 cards explaining key benefits
- Optional testimonials section
- CTA section before the footer
- Footer with links and copyright
- Fully responsive across breakpoints

**Stretch goal:** Add a subtle `hover:scale-105 transition` effect on cards for a polish touch.

---

## 8. Common Beginner Mistakes

- Building only at their current window size and never testing other breakpoints.
- Forgetting `md:hidden` on the desktop links (so both desktop links and mobile menu show at once).
- Forgetting to give the hamburger button and mobile menu `id`s that match the JavaScript exactly (case-sensitive typos are common).
- Toggling only one class (`hidden`) without also toggling `flex`, leaving the menu open but not properly laid out.
- Copy-pasting cards but forgetting to update the actual text content inside each one.
- Inconsistent spacing/padding between sections, making the page feel unpolished even if each section looks fine alone.
- Using more than one strong primary-colored CTA button per screen, confusing the visual hierarchy.

---

## 9. Extra Resources

- [Tailwind CSS — Responsive Design Docs](https://tailwindcss.com/docs/responsive-design)
- [MDN — JavaScript addEventListener](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener)
- [Tailwind UI free component examples](https://tailwindcss.com/plus/ui-blocks)
- [Google's Responsive Web Design Basics](https://web.dev/responsive-web-design-basics/)
