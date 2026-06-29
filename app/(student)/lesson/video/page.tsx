"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import AppSidebar from "@/components/AppSidebar";

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: "dashboard", href: "/student-dashboard" },
  { id: "courses", label: "My Courses", icon: "school", href: "/courses" },
  { id: "slides", label: "Slides", icon: "present_to_all", href: "/lesson/slides" },
  { id: "videos", label: "Videos", icon: "play_circle", href: "/lesson/video" },
  { id: "progress", label: "Progress", icon: "insights", href: "#" },
  { id: "settings", label: "Settings", icon: "settings", href: "#" },
];

interface Lesson {
  title: string;
  duration: string;
  done: boolean;
  playing: boolean;
  locked?: boolean;
}

interface Module {
  label: string;
  lessons: Lesson[];
}

const modules: Module[] = [
  {
    label: "Module 1: Foundations",
    lessons: [
      { title: "1.1 Introduction to Scalability", duration: "12:04", done: true, playing: false },
      { title: "1.2 Latency vs Throughput", duration: "18:45", done: true, playing: false },
    ],
  },
  {
    label: "Module 2: Advanced Design",
    lessons: [
      { title: "2.1 System Architecture Patterns", duration: "45:00 • Now Playing", done: false, playing: true },
      { title: "2.2 Database Partitioning", duration: "32:15", done: false, playing: false },
    ],
  },
  {
    label: "Module 3: Security Masterclass",
    lessons: [
      { title: "3.1 Zero Trust Architectures", duration: "54:00", done: false, playing: false, locked: true },
      { title: "3.2 OAuth2 Deep Dive", duration: "1:05:00", done: false, playing: false, locked: true },
    ],
  },
];

export default function VideoLessonPage() {
  const [activeTab, setActiveTab] = useState<"notes" | "resources">("notes");
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(33);
  const progressRef = useRef<HTMLDivElement>(null);
  const [studentEmail, setStudentEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setStudentEmail(user.email || "");
        setLoading(false);
      } else {
        router.push(`/auth/login?next=${encodeURIComponent("/lesson/video")}`);
      }
    };
    loadUser();
  }, [router]);

  // Simulate play effect
  useEffect(() => {
    if (!isPlaying) return;
    const id = setInterval(() => {
      setProgress((p) => Math.min(p + 0.1, 100));
    }, 500);
    return () => clearInterval(id);
  }, [isPlaying]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <span className="material-symbols-outlined text-primary text-4xl animate-spin">progress_activity</span>
      </div>
    );
  }

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen overflow-x-hidden flex flex-col">
      <AppSidebar role="student" />

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 pt-6 pb-12 px-6">
        {/* Top Bar */}
        <header className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs text-on-surface-variant uppercase tracking-widest font-bold mb-1">Module 2 • Advanced Design</p>
            <h1 className="font-syne text-xl font-bold text-on-surface">Advanced System Architecture Patterns</h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <div className="w-9 h-9 rounded-full bg-secondary-container flex items-center justify-center font-bold text-on-secondary-container text-sm">
              AK
            </div>
          </div>
        </header>

        <div className="max-w-[1200px] mx-auto grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Left Column */}
          <div className="xl:col-span-8 space-y-6">

            {/* Video Player */}
            <div
              className="relative aspect-video bg-surface-container-lowest rounded-xl overflow-hidden border border-white/10 group"
              style={{ boxShadow: "0 0 40px -10px rgba(10, 207, 131, 0.15)" }}
            >
              {/* Thumbnail background */}
              <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                <img
                  alt="Video lesson content"
                  className="w-full h-full object-cover opacity-80"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAxzY_8h2LnR8bzlubC3rTPJrmVXw91Hn9_GA-wGlMYEvUbZsr_weEt-D8KbgKc-jiCepj1el0M2E8eKfXLbcys8iO6sl8r10OA8-Wg7pGjPyflpVWloCy8n7iV3flz9lqtpQ6xumFrOnlLahXcJdv86SdDsmE50qM9JPPh3UhVDbYseD64BTptGkDG7AWWIV3G8NQAqTfj3xb1nSpcU3gpLKOTchorNluI2j2lvEaRh3XgMyZQKFsg46AsQR3kPbaB_CRLfTM6IAo"
                />

                {/* Watermark Overlay */}
                <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 pointer-events-none opacity-[0.03] select-none">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-center font-bold text-sm text-on-surface -rotate-45 whitespace-nowrap">
                      {studentEmail}
                    </div>
                  ))}
                </div>

                {/* Controls bar (slides up on hover) */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-surface-container/80 backdrop-blur-md border-t border-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-center gap-4">
                  <button
                    onClick={() => setIsPlaying((p) => !p)}
                    className="material-symbols-outlined text-primary text-3xl cursor-pointer"
                  >
                    {isPlaying ? "pause" : "play_arrow"}
                  </button>
                  {/* Progress bar */}
                  <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden relative cursor-pointer" ref={progressRef}>
                    <div
                      className="absolute top-0 left-0 h-full bg-primary transition-all"
                      style={{ width: `${progress}%`, boxShadow: "0 0 10px #0acf83" }}
                    />
                  </div>
                  <span className="text-xs font-mono text-on-surface-variant font-bold">
                    {Math.floor((progress / 100) * 45)}:
                    {String(Math.floor(((progress / 100) * 45 * 60) % 60)).padStart(2, "0")} / 45:00
                  </span>
                  <button className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors text-xl cursor-pointer">
                    volume_up
                  </button>
                  <button className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors text-xl cursor-pointer">
                    settings
                  </button>
                  <button className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors text-xl cursor-pointer">
                    fullscreen
                  </button>
                </div>

                {/* Play Overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setIsPlaying((p) => !p)}
                    className="w-20 h-20 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/40 flex items-center justify-center pointer-events-auto cursor-pointer hover:scale-110 hover:bg-primary/30 transition-all"
                    style={{ boxShadow: "0 0 30px rgba(69,236,157,0.3)" }}
                  >
                    <span className="material-symbols-outlined text-primary text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                      {isPlaying ? "pause" : "play_arrow"}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Lesson Header */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap gap-4 text-on-surface-variant text-xs items-center">
                  <span className="flex items-center gap-1 font-bold">
                    <span className="material-symbols-outlined text-sm">schedule</span> 45 mins
                  </span>
                  <span className="flex items-center gap-1 font-bold text-primary">
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                    Instructor: Alex Khod
                  </span>
                  <span className="bg-surface-variant text-on-surface px-3 py-1 rounded-full text-[10px] font-bold tracking-widest border border-white/5">
                    ARCHITECTURE
                  </span>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="flex items-center gap-2 bg-surface-container border border-white/10 text-on-surface px-4 py-2 rounded text-xs font-bold hover:bg-surface-variant transition-colors cursor-pointer">
                  <span className="material-symbols-outlined text-base">bookmark</span> Save
                </button>
                <button className="flex items-center gap-2 bg-primary text-black px-4 py-2 rounded text-xs font-bold hover:brightness-110 transition-all cursor-pointer"
                  style={{ boxShadow: "0 0 15px rgba(69,236,157,0.3)" }}>
                  Complete Lesson
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-white/10">
              <div className="flex gap-6">
                {(["notes", "resources"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 border-b-2 font-bold text-xs transition-colors capitalize cursor-pointer ${
                      activeTab === tab
                        ? "border-primary text-primary"
                        : "border-transparent text-on-surface-variant hover:text-on-surface"
                    }`}
                  >
                    {tab === "notes" ? "Lesson Notes" : "Resources"}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab content */}
            {activeTab === "notes" && (
              <article className="space-y-4 text-on-surface-variant">
                <p className="text-sm leading-relaxed">
                  In this session, we deep-dive into micro-kernel architectures and how to manage global state without compromising
                  on performance. We&apos;ll explore why standard Redux-like patterns fail at scale and what &ldquo;High Performance&rdquo; actually
                  means in a distributed environment.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-surface-container-low p-4 border-l-4 border-primary rounded-r-lg">
                    <h4 className="font-syne text-xs font-bold text-primary mb-1 tracking-widest">KEY TAKEAWAY</h4>
                    <p className="text-xs italic">&ldquo;Complexity is the enemy of performance. Always optimize for the hot path before generalizing the abstraction.&rdquo;</p>
                  </div>
                  <div className="bg-surface-container-low p-4 border-l-4 border-secondary rounded-r-lg">
                    <h4 className="font-syne text-xs font-bold text-secondary mb-1 tracking-widest">PRO TIP</h4>
                    <p className="text-xs">Use 1px tonal layering for depth to maintain accessibility while achieving a premium aesthetic.</p>
                  </div>
                </div>
                <h3 className="font-syne font-bold text-sm text-on-surface mt-2">System Design Constraints</h3>
                <ul className="space-y-3 list-none p-0">
                  {[
                    "Low-latency communication using gRPC and Protobuf.",
                    "Horizontal scaling with stateless edge nodes.",
                    "Eventual consistency vs strong consistency trade-offs in distributed DBs.",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-4 bg-surface-container/30 p-4 rounded-lg border border-white/5 hover:border-primary/20 transition-colors">
                      <span className="material-symbols-outlined text-primary mt-0.5 text-base" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                      <span className="text-xs text-on-surface">{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            )}

            {activeTab === "resources" && (
              <div className="bg-surface-container-high rounded-xl p-6 border border-white/10">
                <h3 className="font-syne font-bold text-sm text-on-surface mb-4">Lesson Resources</h3>
                <div className="space-y-4">
                  {[
                    { name: "Architecture Diagram.svg", sub: "Read-only preview available", icon: "description", cta: "VIEW PREVIEW", ctaIcon: "open_in_new" },
                    { name: "Performance Benchmarks.json", sub: "Live code explorer", icon: "code", cta: "EXPLORE CODE", ctaIcon: "code" },
                  ].map((r, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-background rounded-lg border border-white/5 hover:border-primary/40 transition-colors group cursor-pointer">
                      <div className="flex items-center gap-4">
                        <span className="material-symbols-outlined text-tertiary-container text-xl">{r.icon}</span>
                        <div>
                          <p className="text-xs font-bold text-on-surface">{r.name}</p>
                          <p className="text-[10px] text-on-surface-variant">{r.sub}</p>
                        </div>
                      </div>
                      <button className="text-primary text-[10px] font-bold flex items-center gap-1 group-hover:underline tracking-wider cursor-pointer">
                        {r.cta} <span className="material-symbols-outlined text-xs">{r.ctaIcon}</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Course Sidebar */}
          <div className="xl:col-span-4">
            <div className="bg-surface-container rounded-xl border border-white/10 sticky top-6 overflow-hidden shadow-xl">
              <div className="p-4 bg-surface-container-highest border-b border-white/10">
                <h3 className="font-syne font-bold text-sm text-on-surface">Course Content</h3>
                <div className="mt-3 flex items-center gap-4">
                  <div className="flex-1 h-1.5 bg-background rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: "42%", boxShadow: "0 0 8px #0acf83" }} />
                  </div>
                  <span className="text-xs font-bold text-primary">42% Done</span>
                </div>
              </div>

              <div className="max-h-[calc(100vh-280px)] overflow-y-auto">
                {modules.map((mod, mIdx) => (
                  <div key={mIdx}>
                    <div className="p-4 border-b border-white/5 bg-surface-container-low/30">
                      <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">{mod.label}</span>
                    </div>
                    <div className="space-y-px">
                      {mod.lessons.map((lesson, lIdx) => (
                        lesson.locked ? (
                          <div key={lIdx} className="relative group cursor-not-allowed">
                            <div className="flex items-center gap-4 p-4 opacity-40 grayscale">
                              <div className="w-10 h-10 bg-surface-variant rounded flex items-center justify-center border border-white/5">
                                <span className="material-symbols-outlined text-on-surface-variant text-base" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
                              </div>
                              <div className="flex-1">
                                <p className="text-xs text-on-surface font-bold">{lesson.title}</p>
                                <p className="text-[10px] text-on-surface-variant mt-0.5">{lesson.duration}</p>
                              </div>
                            </div>
                            <div className="absolute inset-0 bg-surface-container/30 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center p-4 rounded-lg">
                              <div className="text-center">
                                <span className="material-symbols-outlined text-primary mb-1 text-base" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
                                <p className="text-[10px] font-bold text-on-surface tracking-widest">PREMIUM ONLY</p>
                                <button className="mt-2 text-primary text-[10px] font-bold underline hover:text-white transition-colors cursor-pointer">Unlock Module</button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <Link
                            key={lIdx}
                            href="#"
                            className={`flex items-center gap-4 p-4 transition-all border-l-2 ${
                              lesson.playing
                                ? "border-primary bg-background/40"
                                : "border-transparent hover:bg-surface-variant/40"
                            }`}
                          >
                            <span
                              className={`material-symbols-outlined text-base ${lesson.playing ? "text-primary" : lesson.done ? "text-primary" : "text-on-surface-variant"}`}
                              style={{ fontVariationSettings: lesson.playing ? "'FILL' 0" : "'FILL' 0" }}
                            >
                              play_circle
                            </span>
                            <div className="flex-1">
                              <p className={`text-xs font-bold ${lesson.playing ? "text-primary" : "text-on-surface"}`}>
                                {lesson.title}
                              </p>
                              <p className={`text-[10px] mt-0.5 ${lesson.playing ? "text-primary/80 font-bold" : "text-on-surface-variant"}`}>
                                {lesson.duration}
                              </p>
                            </div>
                            {lesson.done && (
                              <span className="material-symbols-outlined text-primary text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                            )}
                          </Link>
                        )
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-secondary-container/20 border-t border-white/5 text-center">
                <p className="text-[10px] font-bold text-secondary-fixed-dim mb-3 tracking-[0.2em]">READY TO GO DEEPER?</p>
                <button className="w-full bg-primary text-black py-3 rounded font-bold text-xs hover:scale-[1.01] transition-transform cursor-pointer"
                  style={{ boxShadow: "0 0 15px rgba(69,236,157,0.2)" }}>
                  UPGRADE TO PREMIUM
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="lg:ml-64 py-8 px-6 flex flex-col md:flex-row justify-between items-center border-t border-white/10 bg-background gap-4">
        <div>
          <span className="font-syne font-bold text-lg text-primary tracking-tight">KHODZ ACADEMY</span>
          <p className="text-xs text-on-surface-variant mt-1">© 2024 Khodz Academy. All rights reserved.</p>
        </div>
        <div className="flex flex-wrap gap-4 text-xs">
          {["Terms of Service", "Privacy Policy", "Refund Policy", "Contact"].map((t) => (
            <Link key={t} href="#" className="text-on-surface-variant hover:text-primary underline transition-colors">{t}</Link>
          ))}
        </div>
      </footer>
    </div>
  );
}
