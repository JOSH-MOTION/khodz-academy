"use client";

import { useState, useEffect, useRef } from "react";
import AppSidebar from "@/components/AppSidebar";

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
];

export default function AdminVideoPage() {
  const [activeTab, setActiveTab] = useState<"notes" | "resources">("notes");
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(33);
  const progressRef = useRef<HTMLDivElement>(null);

  // Simulate play effect
  useEffect(() => {
    if (!isPlaying) return;
    const id = setInterval(() => {
      setProgress((p) => Math.min(p + 0.1, 100));
    }, 500);
    return () => clearInterval(id);
  }, [isPlaying]);

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen overflow-x-hidden flex flex-col">
      <AppSidebar role="admin" />

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 pt-6 pb-12 px-6">
        {/* Top Bar */}
        <header className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-xs text-on-surface-variant uppercase tracking-widest font-bold">Module 2 • Advanced Design</p>
              <span className="bg-primary/20 text-primary border border-primary/30 text-[9px] px-2 py-0.5 rounded font-bold uppercase">
                Admin Mode
              </span>
            </div>
            <h1 className="font-syne text-xl font-bold text-on-surface mt-1">Advanced System Architecture Patterns</h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <div className="w-9 h-9 rounded-full bg-secondary-container flex items-center justify-center font-bold text-on-secondary-container text-sm">
              AD
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
              <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                <img
                  alt="Video lesson content"
                  className="w-full h-full object-cover opacity-80"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAxzY_8h2LnR8bzlubC3rTPJrmVXw91Hn9_GA-wGlMYEvUbZsr_weEt-D8KbgKc-jiCepj1el0M2E8eKfXLbcys8iO6sl8r10OA8-Wg7pGjPyflpVWloCy8n7iV3flz9lqtpQ6xumFrOnlLahXcJdv86SdDsmE50qM9JPPh3UhVDbYseD64BTptGkDG7AWWIV3G8NQAqTfj3xb1nSpcU3gpLKOTchorNluI2j2lvEaRh3XgMyZQKFsg46AsQR3kPbaB_CRLfTM6IAo"
                />

                {/* Controls bar */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-surface-container/80 backdrop-blur-md border-t border-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-center gap-4">
                  <button
                    onClick={() => setIsPlaying((p) => !p)}
                    className="material-symbols-outlined text-primary text-3xl cursor-pointer"
                  >
                    {isPlaying ? "pause" : "play_arrow"}
                  </button>
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

            {/* Lesson Info */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="flex flex-wrap gap-4 text-on-surface-variant text-xs items-center">
                <span className="flex items-center gap-1 font-bold">
                  <span className="material-symbols-outlined text-sm">schedule</span> 45 mins
                </span>
                <span className="flex items-center gap-1 font-bold text-primary">
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                  Instructor: Alex Khod
                </span>
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
                  Deep-dive into micro-kernel architectures and how to manage global state without compromising
                  on performance.
                </p>
              </article>
            )}
          </div>

          {/* Right Column: Course Sidebar */}
          <div className="xl:col-span-4">
            <div className="bg-surface-container rounded-xl border border-white/10 sticky top-6 overflow-hidden shadow-xl">
              <div className="p-4 bg-surface-container-highest border-b border-white/10">
                <h3 className="font-syne font-bold text-sm text-on-surface">Curriculum Outline</h3>
              </div>

              <div className="max-h-[calc(100vh-280px)] overflow-y-auto">
                {modules.map((mod, mIdx) => (
                  <div key={mIdx}>
                    <div className="p-4 border-b border-white/5 bg-surface-container-low/30">
                      <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">{mod.label}</span>
                    </div>
                    <div className="space-y-px">
                      {mod.lessons.map((lesson, lIdx) => (
                        <div
                          key={lIdx}
                          className={`flex items-center gap-4 p-4 transition-all border-l-2 ${
                            lesson.playing
                              ? "border-primary bg-background/40"
                              : "border-transparent hover:bg-surface-variant/40"
                          }`}
                        >
                          <span className="material-symbols-outlined text-base text-primary">
                            play_circle
                          </span>
                          <div className="flex-1">
                            <p className={`text-xs font-bold ${lesson.playing ? "text-primary" : "text-on-surface"}`}>
                              {lesson.title}
                            </p>
                            <p className="text-[10px] mt-0.5 text-on-surface-variant">
                              {lesson.duration}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
