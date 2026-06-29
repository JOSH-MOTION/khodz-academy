export interface SyllabusModule {
  num: string;
  title: string;
  details: string;
  sessions: { title: string; preview: boolean; type: "video" | "lock" }[];
}

export interface Course {
  id: string;
  title: string;
  category: "Beginner" | "Design" | "AI" | "Full Stack";
  duration: string;
  tuitionGhs: number;
  admissionGhs: number;
  totalGhs: number;
  modes: string[];
  outcomes: string[];
  projects: string[];
  prerequisites: string[];
  syllabus: SyllabusModule[];
  img: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  sessionsCount: string;
  tagline: string;
  rating: string;
  enrolledCount: number;
  startDate?: string;
}

export const COURSES: Course[] = [
  {
    id: "beginner-web-design",
    title: "Web Development Foundation Bootcamp (Free Trial)",
    category: "Beginner",
    duration: "2 Weeks",
    tuitionGhs: 0,
    admissionGhs: 100,
    totalGhs: 100,
    modes: ["Physical Classes", "Online Live Classes"],
    outcomes: [
      "Introduction to Web Development",
      "HTML Fundamentals",
      "CSS Basics",
      "Tailwind CSS Introduction",
      "Basic JavaScript",
      "Responsive Websites"
    ],
    projects: [
      "Personal Portfolio Website",
      "Small Business Website",
      "Restaurant Landing Page"
    ],
    prerequisites: [
      "Basic computer literacy",
      "No programming experience required"
    ],
    syllabus: [
      {
        num: "01",
        title: "Introduction to HTML & CSS",
        details: "4 Sessions • 120 Mins each",
        sessions: [
          { title: "Internet & Web basics", preview: true, type: "video" },
          { title: "HTML structure & tags", preview: true, type: "video" },
          { title: "CSS styling & color systems", preview: false, type: "lock" },
          { title: "Building layout grids", preview: false, type: "lock" }
        ]
      },
      {
        num: "02",
        title: "Modern Web Design & JavaScript",
        details: "4 Sessions • 120 Mins each",
        sessions: [
          { title: "Intro to Tailwind CSS Utility Classes", preview: false, type: "lock" },
          { title: "Responsive Web design rules", preview: false, type: "lock" },
          { title: "Basic JavaScript logic & operations", preview: false, type: "lock" },
          { title: "Publishing your site on GitHub Pages", preview: false, type: "lock" }
        ]
      }
    ],
    img: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80",
    level: "Beginner",
    sessionsCount: "8 Sessions",
    tagline: "🔥 Phase 1: Free Intro Bootcamp (2 Weeks). Learn HTML, CSS, Tailwind CSS, and basic JavaScript. Build and deploy your first portfolio project.",
    rating: "4.8 (1.1k Students)",
    enrolledCount: 1150
  },
  {
    id: "python-fundamentals",
    title: "Python Fundamentals for Beginners",
    category: "Beginner",
    duration: "2–4 Weeks",
    tuitionGhs: 1500,
    admissionGhs: 500,
    totalGhs: 2000,
    modes: ["Physical Classes", "Online Live Classes"],
    outcomes: [
      "Python Basics",
      "Variables & Data Types",
      "Loops & Conditions",
      "Functions",
      "Lists & Dictionaries",
      "File Handling",
      "APIs Basics"
    ],
    projects: [
      "Calculator App",
      "Expense Tracker",
      "File Organizer",
      "Mini Chatbot"
    ],
    prerequisites: [
      "Basic computer literacy",
      "Logical mindset"
    ],
    syllabus: [
      {
        num: "01",
        title: "Python Setup & Logic Foundations",
        details: "6 Sessions • 120 Mins each",
        sessions: [
          { title: "Environment setup & variables", preview: true, type: "video" },
          { title: "Conditionals (if, else, elif)", preview: false, type: "lock" },
          { title: "Loops (while, for)", preview: false, type: "lock" },
          { title: "Function definitions & arguments", preview: false, type: "lock" }
        ]
      },
      {
        num: "02",
        title: "Data Structures, Files & APIs",
        details: "6 Sessions • 120 Mins each",
        sessions: [
          { title: "Working with Lists & Dictionaries", preview: false, type: "lock" },
          { title: "Reading & writing external files", preview: false, type: "lock" },
          { title: "Fetching external data via APIs", preview: false, type: "lock" },
          { title: "Building the Expense Tracker Project", preview: false, type: "lock" }
        ]
      }
    ],
    img: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80",
    level: "Beginner",
    sessionsCount: "12 Sessions",
    tagline: "Start your coding journey with Python. Learn core programming concepts and build interactive desktop apps.",
    rating: "4.7 (950 Students)",
    enrolledCount: 950
  },
  {
    id: "vacation-bootcamp",
    title: "Vacation Coding Bootcamp",
    category: "Full Stack",
    duration: "1 Month",
    tuitionGhs: 1500,
    admissionGhs: 500,
    totalGhs: 2000,
    modes: ["Physical Classes", "Online Live Classes"],
    outcomes: [
      "HTML & CSS",
      "Tailwind CSS",
      "JavaScript Basics",
      "DOM Manipulation",
      "APIs",
      "Git & GitHub"
    ],
    projects: [
      "Portfolio Website",
      "Weather App",
      "Quiz App",
      "Business Website"
    ],
    prerequisites: [
      "No experience required",
      "Highly recommended for students on vacation"
    ],
    syllabus: [
      {
        num: "01",
        title: "Frontend Foundations",
        details: "8 Sessions • 120 Mins each",
        sessions: [
          { title: "Modern HTML structure & Semantic Elements", preview: true, type: "video" },
          { title: "Tailwind CSS layouts & grids", preview: false, type: "lock" },
          { title: "Responsive designs for mobile and desktop", preview: false, type: "lock" },
          { title: "Git initialization & GitHub pages deploy", preview: false, type: "lock" }
        ]
      },
      {
        num: "02",
        title: "Interactive Web & API Integrations",
        details: "8 Sessions • 120 Mins each",
        sessions: [
          { title: "JavaScript Variables & Functions", preview: false, type: "lock" },
          { title: "Selecting & modifying DOM elements", preview: false, type: "lock" },
          { title: "HTTP Requests & Fetch API", preview: false, type: "lock" },
          { title: "Building the Weather App project", preview: false, type: "lock" }
        ]
      }
    ],
    img: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80",
    level: "Beginner",
    sessionsCount: "16 Sessions",
    tagline: "Make your vacation productive. Dive deep into frontend engineering and build interactive web applications.",
    rating: "4.9 (1.4k Students)",
    enrolledCount: 1420
  },
  {
    id: "ui-ux-design",
    title: "UI/UX & Website Design Course",
    category: "Design",
    duration: "1 Month",
    tuitionGhs: 1500,
    admissionGhs: 500,
    totalGhs: 2000,
    modes: ["Physical Classes", "Online Live Classes"],
    outcomes: [
      "Design Principles",
      "Color Systems",
      "Typography",
      "Layout Design",
      "Responsive Design",
      "Figma Basics"
    ],
    projects: [
      "Mobile App UI",
      "Website Landing Page",
      "Dashboard Design"
    ],
    prerequisites: [
      "Basic computer usage",
      "Interest in visuals, layout, and software design"
    ],
    syllabus: [
      {
        num: "01",
        title: "Visual Design Foundations",
        details: "8 Sessions • 120 Mins each",
        sessions: [
          { title: "Principles of Balance, Contrast & Hierarchy", preview: true, type: "video" },
          { title: "Color Theory & HSL Palettes", preview: true, type: "video" },
          { title: "Typography scales & readability", preview: false, type: "lock" },
          { title: "Introduction to Figma tools", preview: false, type: "lock" }
        ]
      },
      {
        num: "02",
        title: "Prototyping & UX Methods",
        details: "8 Sessions • 120 Mins each",
        sessions: [
          { title: "Grid systems for desktop vs mobile", preview: false, type: "lock" },
          { title: "Component architectures & variants", preview: false, type: "lock" },
          { title: "Interactive prototypes & transitions", preview: false, type: "lock" },
          { title: "Client presentation and portfolio setup", preview: false, type: "lock" }
        ]
      }
    ],
    img: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&w=600&q=80",
    level: "Intermediate",
    sessionsCount: "16 Sessions",
    tagline: "Learn the visual design theory and advanced Figma techniques to craft stunning mobile and web interfaces.",
    rating: "4.8 (820 Students)",
    enrolledCount: 820
  },
  {
    id: "ai-for-developers",
    title: "AI for Developers Course",
    category: "AI",
    duration: "2–4 Weeks",
    tuitionGhs: 1500,
    admissionGhs: 500,
    totalGhs: 2000,
    modes: ["Physical Classes", "Online Live Classes"],
    outcomes: [
      "Prompt Engineering",
      "AI Coding Tools",
      "Cursor",
      "Claude",
      "GitHub Copilot",
      "Building Apps with AI"
    ],
    projects: [
      "AI Chatbot",
      "Smart Assistant App"
    ],
    prerequisites: [
      "Basic HTML/CSS/JS or Python coding experience recommended"
    ],
    syllabus: [
      {
        num: "01",
        title: "Prompt Engineering & Code Assistants",
        details: "6 Sessions • 120 Mins each",
        sessions: [
          { title: "LLM basics & effective system prompts", preview: true, type: "video" },
          { title: "Cursor setup & keyboard commands", preview: true, type: "video" },
          { title: "GitHub Copilot for autocomplete logic", preview: false, type: "lock" },
          { title: "Debugging and refactoring using Claude APIs", preview: false, type: "lock" }
        ]
      },
      {
        num: "02",
        title: "Building & Deploying AI Apps",
        details: "6 Sessions • 120 Mins each",
        sessions: [
          { title: "Connecting apps to OpenAI/Anthropic APIs", preview: false, type: "lock" },
          { title: "State management in chatbot inputs", preview: false, type: "lock" },
          { title: "Streaming responses & loading states", preview: false, type: "lock" },
          { title: "Deploying AI apps to production", preview: false, type: "lock" }
        ]
      }
    ],
    img: "https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=600&q=80",
    level: "Intermediate",
    sessionsCount: "12 Sessions",
    tagline: "Supercharge your coding speed. Learn prompt engineering, Cursor, Copilot, and integrate APIs to build AI products.",
    rating: "4.9 (650 Students)",
    enrolledCount: 650
  },
  {
    id: "wordpress-development",
    title: "WordPress Website Development",
    category: "Design",
    duration: "1 Month",
    tuitionGhs: 1500,
    admissionGhs: 500,
    totalGhs: 2000,
    modes: ["Physical Classes", "Online Live Classes"],
    outcomes: [
      "WordPress Setup",
      "Elementor",
      "Hosting & Domains",
      "Business Websites",
      "SEO Basics"
    ],
    projects: [
      "Company Website",
      "Church Website",
      "E-commerce Website"
    ],
    prerequisites: [
      "Basic computer literacy",
      "No coding experience necessary"
    ],
    syllabus: [
      {
        num: "01",
        title: "WordPress Setup & Elementor Page Builder",
        details: "8 Sessions • 120 Mins each",
        sessions: [
          { title: "Local environment & setup", preview: true, type: "video" },
          { title: "Introduction to WordPress Dashboard", preview: true, type: "video" },
          { title: "Elementor structure & layouts", preview: false, type: "lock" },
          { title: "Plugins & templates integration", preview: false, type: "lock" }
        ]
      },
      {
        num: "02",
        title: "E-Commerce, Domains & SEO",
        details: "8 Sessions • 120 Mins each",
        sessions: [
          { title: "WooCommerce setup & payment gateways", preview: false, type: "lock" },
          { title: "Hosting parameters & database connection", preview: false, type: "lock" },
          { title: "SEO optimization with RankMath/Yoast", preview: false, type: "lock" },
          { title: "Go-live checks & performance audit", preview: false, type: "lock" }
        ]
      }
    ],
    img: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?auto=format&fit=crop&w=600&q=80",
    level: "Beginner",
    sessionsCount: "16 Sessions",
    tagline: "Build custom company, agency, and e-commerce websites without code using Elementor and WordPress.",
    rating: "4.6 (540 Students)",
    enrolledCount: 540
  },
  {
    id: "frontend-program",
    title: "Frontend Development Program",
    category: "Full Stack",
    duration: "3 Months",
    tuitionGhs: 3500,
    admissionGhs: 500,
    totalGhs: 4000,
    modes: ["Physical Classes", "Online Live Classes", "Weekend Classes Available"],
    outcomes: [
      "HTML & CSS layout mechanics",
      "Tailwind CSS utility frameworks",
      "Git repositories & version control",
      "JavaScript DOM, closures, scopes",
      "Asynchronous APIs & data fetching",
      "React.js component architectures",
      "State Management & validation"
    ],
    projects: [
      "E-Commerce Frontend",
      "Expense Tracker",
      "Portfolio Website"
    ],
    prerequisites: [
      "No coding experience needed",
      "Commitment of 8-10 hours of self-study per week"
    ],
    syllabus: [
      {
        num: "01",
        title: "Month 1: Layouts & Static Webs",
        details: "12 Sessions • 120 Mins each",
        sessions: [
          { title: "Semantic HTML & Accessibility basics", preview: true, type: "video" },
          { title: "CSS Flexbox & CSS Grid in practice", preview: true, type: "video" },
          { title: "Tailwind CSS styling configurations", preview: false, type: "lock" },
          { title: "Git workflows, branch controls, GitHub merges", preview: false, type: "lock" }
        ]
      },
      {
        num: "02",
        title: "Month 2: JavaScript Logic & DOM Systems",
        details: "12 Sessions • 120 Mins each",
        sessions: [
          { title: "Variables, Scope, Loops & Arrays", preview: false, type: "lock" },
          { title: "DOM selection & event handlers", preview: false, type: "lock" },
          { title: "Async/Await, Promises & Fetching APIs", preview: false, type: "lock" },
          { title: "Building responsive dynamic landing pages", preview: false, type: "lock" }
        ]
      },
      {
        num: "03",
        title: "Month 3: Modern React Architectures",
        details: "12 Sessions • 120 Mins each",
        sessions: [
          { title: "Components, Props, and State hook values", preview: false, type: "lock" },
          { title: "React router & layouts system", preview: false, type: "lock" },
          { title: "Form submissions, state managers & validation", preview: false, type: "lock" },
          { title: "Final E-commerce UI Capstone deploy", preview: false, type: "lock" }
        ]
      }
    ],
    img: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=600&q=80",
    level: "Intermediate",
    sessionsCount: "36 Sessions",
    tagline: "Accelerate your frontend career. Zero to React.js developer in three months of intensive live classes.",
    rating: "4.8 (1.8k Students)",
    enrolledCount: 1840
  },
  {
    id: "mern-engineering",
    title: "Full Stack Software Engineering Program (Paid Continuation)",
    category: "Full Stack",
    duration: "6 Months",
    tuitionGhs: 6500,
    admissionGhs: 500,
    totalGhs: 7000,
    modes: ["Physical Classes", "Online Live Classes", "Weekend Classes Available"],
    outcomes: [
      "VS Code, terminal commands, basic Unix shell usage",
      "HTML, CSS, Tailwind CSS styling systems",
      "Advanced React.js frameworks and hooks",
      "Node.js, Express.js backend API architecture",
      "MongoDB database connections and queries",
      "JWT tokens and secure registration flows",
      "Vercel and Render cloud production deploy"
    ],
    projects: [
      "Startup-level Capstone application",
      "10+ Real World Projects"
    ],
    prerequisites: [
      "Strong computer literacy",
      "Readiness for a highly demanding curriculum"
    ],
    syllabus: [
      {
        num: "01",
        title: "Phase 1 & 2: Terminal, Git & Frontend Foundations",
        details: "24 Sessions • 120 Mins each",
        sessions: [
          { title: "VS Code & Terminal operations", preview: true, type: "video" },
          { title: "Semantic layouts with Tailwind CSS", preview: true, type: "video" },
          { title: "Modern React.js component architectures", preview: false, type: "lock" }
        ]
      },
      {
        num: "02",
        title: "Phase 3 & 4: Express API & MongoDB Databases",
        details: "24 Sessions • 120 Mins each",
        sessions: [
          { title: "Node.js environment & Express servers", preview: false, type: "lock" },
          { title: "MongoDB Atlas setup & Mongoose queries", preview: false, type: "lock" },
          { title: "JSON Web Token (JWT) auth integrations", preview: false, type: "lock" }
        ]
      },
      {
        num: "03",
        title: "Phase 5 & 6: Full Integration & Hosting",
        details: "24 Sessions • 120 Mins each",
        sessions: [
          { title: "React frontend + Node.js backend integrations", preview: false, type: "lock" },
          { title: "CORS configurations & error middleware", preview: false, type: "lock" },
          { title: "Deploying database layers & APIs to Render", preview: false, type: "lock" }
        ]
      }
    ],
    img: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80",
    level: "Advanced",
    sessionsCount: "72 Sessions",
    tagline: "💳 Phase 2: Full Stack Program (6 Months). Master React.js, Node.js, Express, MongoDB, secure authentication, and cloud deployment.",
    rating: "4.9 (2.2k Students)",
    enrolledCount: 2210
  },
  {
    id: "weekend-engineering",
    title: "Weekend Software Engineering Program",
    category: "Full Stack",
    duration: "6–8 Months",
    tuitionGhs: 4500,
    admissionGhs: 500,
    totalGhs: 5000,
    modes: ["Physical Classes", "Online Live Classes"],
    outcomes: [
      "High-Performance Full Stack Engineering",
      "Frontend & Backend Web Frameworks",
      "System Architecture & Databases",
      "DevOps & Cloud Deployment"
    ],
    projects: [
      "Enterprise E-Commerce Site",
      "Custom CRM Platform",
      "Live Chat & Collaboration App"
    ],
    prerequisites: [
      "Basic programming conceptual knowledge is helpful but not mandatory",
      "Ideal for workers & busy students"
    ],
    syllabus: [
      {
        num: "01",
        title: "Module 1: Web Fundamentals & Git",
        details: "20 Sessions • Saturday & Sunday",
        sessions: [
          { title: "Git repositories & developer setups", preview: true, type: "video" },
          { title: "Tailwind CSS Layout setups", preview: false, type: "lock" },
          { title: "JS closures, callbacks, objects", preview: false, type: "lock" }
        ]
      },
      {
        num: "02",
        title: "Module 2: React & Express Frameworks",
        details: "24 Sessions • Saturday & Sunday",
        sessions: [
          { title: "React component logic & props", preview: false, type: "lock" },
          { title: "Building API routes in Express", preview: false, type: "lock" },
          { title: "MongoDB databases and relationships", preview: false, type: "lock" }
        ]
      },
      {
        num: "03",
        title: "Module 3: Cloud & Capstone Integration",
        details: "20 Sessions • Saturday & Sunday",
        sessions: [
          { title: "JWT token validation & cookies", preview: false, type: "lock" },
          { title: "Vercel + Render pipelines", preview: false, type: "lock" },
          { title: "Building the custom CRM app", preview: false, type: "lock" }
        ]
      }
    ],
    img: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80",
    level: "Advanced",
    sessionsCount: "64 Sessions",
    tagline: "Master full-stack engineering on weekends. Built for working professionals who want to transition to tech.",
    rating: "4.8 (1.2k Students)",
    enrolledCount: 1250
  },
  {
    id: "kids-coding-camp",
    title: "Kids & Teens Coding Camp",
    category: "Beginner",
    duration: "2–4 Weeks",
    tuitionGhs: 1000,
    admissionGhs: 250,
    totalGhs: 1250,
    modes: ["Physical Classes", "Online Classes"],
    outcomes: [
      "Basic HTML",
      "CSS",
      "Fun JavaScript",
      "Creativity Through Coding"
    ],
    projects: [
      "Cartoon Website",
      "Football Fan Website",
      "Fun Mini Games"
    ],
    prerequisites: [
      "Ages 8 to 16",
      "No coding background required"
    ],
    syllabus: [
      {
        num: "01",
        title: "Web Adventures with HTML & CSS",
        details: "5 Sessions • 120 Mins each",
        sessions: [
          { title: "What is code? Introduction to browsers", preview: true, type: "video" },
          { title: "Creating text, links & images on screen", preview: true, type: "video" },
          { title: "Adding colors, shapes & cartoon styles", preview: false, type: "lock" }
        ]
      },
      {
        num: "02",
        title: "Fun JavaScript Games",
        details: "5 Sessions • 120 Mins each",
        sessions: [
          { title: "Click events & changes with JS", preview: false, type: "lock" },
          { title: "Creating the Cartoon Website project", preview: false, type: "lock" },
          { title: "Building the Mini Games block", preview: false, type: "lock" }
        ]
      }
    ],
    img: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&q=80",
    level: "Beginner",
    sessionsCount: "10 Sessions",
    tagline: "Spark creativity in kids and teenagers. Learn coding by building games, animations, and cartoon webs.",
    rating: "4.9 (420 Students)",
    enrolledCount: 420
  },
  {
    id: "vacation-web-foundations",
    title: "Web Foundations (Vacation Coding Program)",
    category: "Beginner",
    duration: "2 Months",
    tuitionGhs: 1200,
    admissionGhs: 200,
    totalGhs: 1400,
    startDate: "2026-08-01",
    modes: ["Online Live Classes (Google Meet)"],
    outcomes: [
      "HTML Structure & Semantic Tags",
      "CSS Styling & Responsive Design",
      "Git & GitHub basics",
      "JavaScript Fundamentals",
      "DOM Manipulation & Event Listeners",
      "Hosting & publishing websites"
    ],
    projects: [
      "Personal Portfolio Website",
      "Responsive Business Landing Page",
      "Interactive Web Game / Mini Project"
    ],
    prerequisites: [
      "No programming experience required",
      "A laptop and stable internet connection"
    ],
    syllabus: [
      {
        num: "01",
        title: "Month 1: HTML, CSS & Responsive Design",
        details: "12 Sessions • 3 days/week • 1.5–2 hours/session",
        sessions: [
          { title: "HTML structure, elements, and semantic tags", preview: true, type: "video" },
          { title: "Forms, links, and media elements", preview: true, type: "video" },
          { title: "CSS selectors, box model & Flexbox layouts", preview: false, type: "lock" },
          { title: "Responsive design & simple page cloning", preview: false, type: "lock" },
          { title: "Git basics & deploying with GitHub Pages", preview: false, type: "lock" }
        ]
      },
      {
        num: "02",
        title: "Month 2: JavaScript & Interactive Web Apps",
        details: "12 Sessions • 3 days/week • 1.5–2 hours/session",
        sessions: [
          { title: "Variables, conditionals, loops, functions, and arrays", preview: false, type: "lock" },
          { title: "DOM manipulation and Event Listeners", preview: false, type: "lock" },
          { title: "Form validation & debugging with Chrome DevTools", preview: false, type: "lock" },
          { title: "Capstone: To-Do App / Quiz App / Simple Dashboard", preview: false, type: "lock" }
        ]
      }
    ],
    img: "https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=600&q=80",
    level: "Beginner",
    sessionsCount: "24 Sessions",
    tagline: "A perfect program for complete beginners. Learn HTML, CSS, Responsive Design, Git, and Javascript fundamentals through live interactive sessions on Google Meet.",
    rating: "4.8 (80 Students)",
    enrolledCount: 80
  },
  {
    id: "vacation-advanced-web-apps",
    title: "Advanced Web Apps (Vacation Coding Program)",
    category: "Full Stack",
    duration: "2 Months",
    tuitionGhs: 2000,
    admissionGhs: 200,
    totalGhs: 2200,
    modes: ["Online Live Classes (Google Meet)"],
    outcomes: [
      "React component hierarchies",
      "State and Props synchronization",
      "Asynchronous HTTP and API fetching",
      "Dynamic user experience & flows",
      "Vercel / cloud deployment pipelines",
      "Professional GitHub portfolio construction"
    ],
    projects: [
      "Interactive Single Page React Dashboard",
      "Dynamic API-Powered Web Application",
      "Production-grade Capstone Portfolio"
    ],
    prerequisites: [
      "Completion of Web Foundations (Program 1) or equivalent Javascript & HTML/CSS knowledge"
    ],
    syllabus: [
      {
        num: "01",
        title: "Month 1: React.js & Component Architectures",
        details: "12 Sessions • 3 days/week • 1.5–2 hours/session",
        sessions: [
          { title: "React paradigm shift, Vite, and JSX basics", preview: true, type: "video" },
          { title: "Building reusable UI components", preview: true, type: "video" },
          { title: "Managing local state and interactive inputs", preview: false, type: "lock" },
          { title: "Synchronizing data flow via props and hooks", preview: false, type: "lock" }
        ]
      },
      {
        num: "02",
        title: "Month 2: APIs, Production Projects & Deployment",
        details: "12 Sessions • 3 days/week • 1.5–2 hours/session",
        sessions: [
          { title: "Asynchronous API integration and fetching", preview: false, type: "lock" },
          { title: "Routing and Multi-page layouts in React", preview: false, type: "lock" },
          { title: "Deploying high-performance web apps to Vercel", preview: false, type: "lock" },
          { title: "Reviewing, optimizing, and polishing GitHub portfolio", preview: false, type: "lock" }
        ]
      }
    ],
    img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80",
    level: "Advanced",
    sessionsCount: "24 Sessions",
    tagline: "Built for students with HTML/CSS/JS experience. Level up by mastering React components, state, props, API data streams, cloud deployment, and a stunning GitHub portfolio.",
    rating: "4.9 (60 Students)",
    enrolledCount: 60
  }
];

export const COURSES_MAP = COURSES.reduce<Record<string, Course>>((acc, course) => {
  acc[course.id] = course;
  return acc;
}, {});
