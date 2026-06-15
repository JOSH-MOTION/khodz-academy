"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import AppSidebar from "@/components/AppSidebar";

const weeks = [
  {
    label: "Week 01: Foundations",
    locked: false,
    lessons: [
      { title: "Introduction to High Performance", slides: 12, done: true },
      { title: "Distributed Databases 101", slides: 42, done: false, reading: true },
    ],
  },
  {
    label: "Week 02: Advanced Patterns",
    locked: false,
    lessons: [
      { title: "CAP Theorem Deep Dive", slides: 25, done: false },
      { title: "Eventual Consistency Models", slides: 38, done: false },
    ],
  },
];

const TOTAL_SLIDES = 42;

export default function AdminSlidesPage() {
  const [currentSlide, setCurrentSlide] = useState(14);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const goNext = useCallback(() => {
    setCurrentSlide((s) => Math.min(s + 1, TOTAL_SLIDES));
  }, []);

  const goPrev = useCallback(() => {
    setCurrentSlide((s) => Math.max(s - 1, 1));
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "Escape") setIsFullscreen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [goNext, goPrev]);

  const progressPercent = Math.round((currentSlide / TOTAL_SLIDES) * 100);

  return (
    <div className="bg-background text-on-background font-body-md overflow-hidden min-h-screen flex">
      <AppSidebar role="admin" />

      {/* Main Content Canvas */}
      <main className="flex-1 lg:ml-64 h-screen flex flex-col relative overflow-hidden">
        {/* Top Toolbar */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-white/10 bg-surface/70 backdrop-blur-xl z-40 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button className="lg:hidden text-on-surface cursor-pointer">
              <span className="material-symbols-outlined">menu</span>
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-syne text-sm font-bold text-primary truncate max-w-[300px]">
                  Advanced Systems Architecture
                </h2>
                <span className="bg-primary/20 text-primary border border-primary/30 text-[9px] px-2 py-0.5 rounded font-bold uppercase">
                  Admin Preview
                </span>
              </div>
              <p className="text-[10px] text-on-surface-variant">Module 04: Distributed Databases</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <button className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-xl">notifications</span>
              </button>
              <div className="w-8 h-8 rounded-full bg-secondary-container overflow-hidden border border-primary/20 flex items-center justify-center font-bold text-on-secondary-container text-xs">
                AD
              </div>
            </div>
          </div>
        </header>

        {/* Content Row */}
        <div className="flex-1 flex overflow-hidden">
          {/* Slide Viewer Area */}
          <section className="flex-1 flex flex-col relative bg-surface-container-lowest">
            {/* Slide Canvas */}
            <div className="flex-1 flex items-center justify-center p-6 relative z-10">
              <div
                className="w-full max-w-5xl aspect-video bg-surface-container border border-white/10 rounded-lg overflow-hidden relative shadow-2xl group"
                style={{ boxShadow: "0 0 40px -10px rgba(10, 207, 131, 0.1)" }}
              >
                {/* Slide image */}
                <img
                  alt="Current slide content"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBas-5vZnsJmZArNX4oBWDZPzoqvdFhA_2KaY3pMJAKHOw6Lp68MXTjGb_s2-xq1KcZf4MTPPeMKeS5CqQ8GkuIPLMA9AKOJs25yHgstymok9g4_5c-WTrpHCma4RzzKcEtV6ee5jIA76-_r9dRuRWcaqu8_5ZTvcFvl9u1oB5EvYB6goBkdrg2_4wAkUGviuyYWXoLBKMol_HYjtd_bt33iQJICUanTnpyzAuD43FqNgnwPl6lP2MoUV2G-9UTuYs4UFn6WxUP4CA"
                />

                {/* Navigation Overlay (shows on hover) */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-surface/90 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 transition-opacity group-hover:opacity-100 opacity-60">
                  <button
                    onClick={goPrev}
                    disabled={currentSlide <= 1}
                    className="text-on-surface hover:text-primary transition-colors flex items-center cursor-pointer disabled:opacity-30"
                  >
                    <span className="material-symbols-outlined">chevron_left</span>
                  </button>
                  <span className="font-bold text-xs text-on-surface px-4 border-x border-white/10">
                    {currentSlide} / {TOTAL_SLIDES}
                  </span>
                  <button
                    onClick={goNext}
                    disabled={currentSlide >= TOTAL_SLIDES}
                    className="text-on-surface hover:text-primary transition-colors flex items-center cursor-pointer disabled:opacity-30"
                  >
                    <span className="material-symbols-outlined">chevron_right</span>
                  </button>
                  <button
                    onClick={() => setIsFullscreen((f) => !f)}
                    className="ml-2 text-on-surface hover:text-primary transition-colors flex items-center cursor-pointer"
                  >
                    <span className="material-symbols-outlined">{isFullscreen ? "fullscreen_exit" : "fullscreen"}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Keyboard hints */}
            <div className="absolute bottom-4 left-6 text-[10px] text-on-surface-variant z-10 hidden md:flex items-center gap-2">
              <span className="px-2 py-1 border border-white/10 rounded text-[9px] font-mono">←</span>
              <span className="px-2 py-1 border border-white/10 rounded text-[9px] font-mono">→</span>
              <span>Navigate slides</span>
            </div>

            {/* Progress bar */}
            <div className="h-1 bg-surface-container-high w-full flex-shrink-0">
              <div
                className="h-full bg-primary transition-all duration-700"
                style={{ width: `${progressPercent}%`, boxShadow: "0 0 10px #45ec9d" }}
              />
            </div>
          </section>

          {/* Lesson List Sidebar */}
          <aside className="w-80 border-l border-white/10 bg-surface-container-low flex flex-col z-30 flex-shrink-0">
            <div className="p-4 border-b border-white/10 flex justify-between items-center">
              <h3 className="font-syne text-xs font-bold text-on-surface">Admin Outline View</h3>
              <span className="text-[10px] text-primary font-bold">{progressPercent}% Previewed</span>
            </div>

            <div className="flex-1 overflow-y-auto">
              {weeks.map((week, wIdx) => (
                <div key={wIdx} className="mb-2">
                  {/* Week header */}
                  <div className="px-4 py-3 flex items-center justify-between bg-surface-container-highest/50">
                    <span className="text-[10px] font-bold tracking-wider text-on-surface-variant uppercase">{week.label}</span>
                    <span className="material-symbols-outlined text-[18px] text-primary">
                      expand_more
                    </span>
                  </div>

                  {/* Lessons */}
                  <div className="px-2 py-2 space-y-1 relative">
                    {week.lessons.map((lesson, lIdx) => (
                      <div
                        key={lIdx}
                        className={`flex items-center gap-3 p-4 rounded-lg transition-colors cursor-pointer ${
                          lesson.reading
                            ? "bg-primary/10 border border-primary/20"
                            : "hover:bg-surface-variant"
                        }`}
                      >
                        <span
                          className={`material-symbols-outlined text-[20px] ${
                            lesson.done
                              ? "text-primary"
                              : lesson.reading
                              ? "text-primary"
                              : "text-on-surface-variant"
                          }`}
                          style={lesson.done ? { fontVariationSettings: "'FILL' 1" } : {}}
                        >
                          {lesson.done ? "check_circle" : lesson.reading ? "play_arrow" : "description"}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs truncate ${lesson.reading ? "text-primary font-bold" : "text-on-surface"}`}>
                            {lesson.title}
                          </p>
                          <p className={`text-[10px] mt-0.5 ${lesson.reading ? "text-primary/70" : "text-on-surface-variant"}`}>
                            {lesson.slides} Slides
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Sidebar Footer */}
            <div className="p-4 bg-surface-container border-t border-white/10">
              <div className="flex items-center gap-3 text-on-surface-variant">
                <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
                <p className="text-[10px]">Full management rights</p>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
