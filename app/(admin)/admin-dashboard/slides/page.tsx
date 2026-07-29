"use client";

import { useState, useEffect, useCallback } from "react";
import AppSidebar from "@/components/AppSidebar";
import AdminPinGuard from "@/components/AdminPinGuard";
import { createClient } from "@/lib/supabase/client";

interface Course {
  id: string;
  title: string;
}

interface Lesson {
  id: string;
  title: string;
  order_in_week: number;
  slideCount: number;
}

interface WeekWithLessons {
  id: string;
  week_number: number;
  title: string;
  lessons: Lesson[];
}

interface SignedSlide {
  index: number;
  url: string;
}

interface RawLesson {
  id: string;
  title: string;
  order_in_week: number;
}

interface RawWeek {
  id: string;
  week_number: number;
  title: string;
  lessons: RawLesson[] | null;
}

export default function AdminSlidesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [weeks, setWeeks] = useState<WeekWithLessons[]>([]);
  const [loadingOutline, setLoadingOutline] = useState(true);

  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [selectedLessonTitle, setSelectedLessonTitle] = useState<string>("");
  const [slides, setSlides] = useState<SignedSlide[]>([]);
  const [loadingSlides, setLoadingSlides] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Load the course list once
  useEffect(() => {
    const loadCourses = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.from("courses").select("id, title").order("title");
      if (error) {
        console.error("Failed to load courses:", error);
        return;
      }
      setCourses(data || []);
      if (data && data.length > 0) setSelectedCourseId(data[0].id);
    };
    loadCourses();
  }, []);

  // Load the weeks/lessons outline (+ slide counts) whenever the course changes
  useEffect(() => {
    if (!selectedCourseId) return;

    const loadOutline = async () => {
      setLoadingOutline(true);
      setWeeks([]);
      setSelectedLessonId(null);
      setSlides([]);

      const supabase = createClient();
      const { data: weeksData, error: weeksError } = await supabase
        .from("weeks")
        .select("id, week_number, title, lessons (id, title, order_in_week)")
        .eq("course_id", selectedCourseId)
        .order("week_number", { ascending: true });

      if (weeksError) {
        console.error("Failed to load weeks:", weeksError);
        setLoadingOutline(false);
        return;
      }

      const rawWeeks = (weeksData || []) as unknown as RawWeek[];
      const allLessonIds = rawWeeks.flatMap((w) => (w.lessons || []).map((l) => l.id));
      const slideCounts: Record<string, number> = {};

      if (allLessonIds.length > 0) {
        const { data: slideRows, error: slideErr } = await supabase
          .from("lesson_slides")
          .select("lesson_id")
          .in("lesson_id", allLessonIds);
        if (slideErr) console.error("Failed to load slide counts:", slideErr);
        (slideRows || []).forEach((row: { lesson_id: string }) => {
          slideCounts[row.lesson_id] = (slideCounts[row.lesson_id] || 0) + 1;
        });
      }

      const typedWeeks: WeekWithLessons[] = rawWeeks.map((w) => ({
        id: w.id,
        week_number: w.week_number,
        title: w.title,
        lessons: (w.lessons || [])
          .slice()
          .sort((a, b) => a.order_in_week - b.order_in_week)
          .map((l) => ({ ...l, slideCount: slideCounts[l.id] || 0 })),
      }));

      setWeeks(typedWeeks);
      setLoadingOutline(false);

      // Auto-select the first lesson that actually has slides
      const firstWithSlides = typedWeeks.flatMap((w) => w.lessons).find((l) => l.slideCount > 0);
      if (firstWithSlides) {
        setSelectedLessonId(firstWithSlides.id);
        setSelectedLessonTitle(firstWithSlides.title);
      }
    };

    loadOutline();
  }, [selectedCourseId]);

  // Load signed slide URLs whenever the selected lesson changes
  useEffect(() => {
    if (!selectedLessonId) return;

    const loadSlides = async () => {
      setLoadingSlides(true);
      setCurrentSlide(1);
      try {
        const res = await fetch(`/api/lessons/${selectedLessonId}/slides`);
        const json = await res.json();
        setSlides(json.slides || []);
      } catch (err) {
        console.error("Failed to load signed slide URLs:", err);
        setSlides([]);
      } finally {
        setLoadingSlides(false);
      }
    };

    loadSlides();
  }, [selectedLessonId]);

  const goNext = useCallback(() => {
    setCurrentSlide((s) => Math.min(s + 1, slides.length || 1));
  }, [slides.length]);

  const goPrev = useCallback(() => {
    setCurrentSlide((s) => Math.max(s - 1, 1));
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "Escape") setIsFullscreen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [goNext, goPrev]);

  const totalSlides = slides.length;
  const progressPercent = totalSlides > 0 ? Math.round((currentSlide / totalSlides) * 100) : 0;
  const currentImageUrl = slides.find((s) => s.index === currentSlide)?.url;

  return (
    <AdminPinGuard>
      <div className="bg-background text-on-background font-body-md overflow-hidden min-h-screen flex">
        <AppSidebar role="admin" />

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
                    {selectedLessonTitle || "Select a lesson"}
                  </h2>
                  <span className="bg-primary/20 text-primary border border-primary/30 text-[9px] px-2 py-0.5 rounded font-bold uppercase">
                    Admin Preview
                  </span>
                </div>
                <p className="text-[10px] text-on-surface-variant">
                  {courses.find((c) => c.id === selectedCourseId)?.title || ""}
                </p>
              </div>
            </div>

            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="bg-surface-container-low border border-white/10 rounded-lg px-3 py-2 text-xs text-on-surface outline-none focus:border-primary cursor-pointer"
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </header>

          {/* Content Row */}
          <div className="flex-1 flex overflow-hidden">
            {/* Slide Viewer Area */}
            <section className="flex-1 flex flex-col relative bg-surface-container-lowest">
              <div className="flex-1 flex items-center justify-center p-6 relative z-10">
                <div
                  className="w-full max-w-5xl aspect-video bg-surface-container border border-white/10 rounded-lg overflow-hidden relative shadow-2xl group"
                  style={{ boxShadow: "0 0 40px -10px rgba(10, 207, 131, 0.1)" }}
                >
                  {loadingSlides ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary text-4xl animate-spin">progress_activity</span>
                    </div>
                  ) : currentImageUrl ? (
                    <img alt="Current slide content" className="w-full h-full object-contain" src={currentImageUrl} />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-on-surface-variant text-center p-6">
                      <span className="material-symbols-outlined text-5xl text-outline">present_to_all</span>
                      <p className="text-xs font-bold text-white">
                        {selectedLessonId ? "No slides published for this lesson yet" : "Select a lesson from the outline"}
                      </p>
                      <p className="text-[10px]">Run npm run slides:generate + slides:publish to populate this deck.</p>
                    </div>
                  )}

                  {totalSlides > 0 && (
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-surface/90 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 transition-opacity group-hover:opacity-100 opacity-60">
                      <button
                        onClick={goPrev}
                        disabled={currentSlide <= 1}
                        className="text-on-surface hover:text-primary transition-colors flex items-center cursor-pointer disabled:opacity-30"
                      >
                        <span className="material-symbols-outlined">chevron_left</span>
                      </button>
                      <span className="font-bold text-xs text-on-surface px-4 border-x border-white/10">
                        {currentSlide} / {totalSlides}
                      </span>
                      <button
                        onClick={goNext}
                        disabled={currentSlide >= totalSlides}
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
                  )}
                </div>
              </div>

              {totalSlides > 0 && (
                <div className="absolute bottom-4 left-6 text-[10px] text-on-surface-variant z-10 hidden md:flex items-center gap-2">
                  <span className="px-2 py-1 border border-white/10 rounded text-[9px] font-mono">←</span>
                  <span className="px-2 py-1 border border-white/10 rounded text-[9px] font-mono">→</span>
                  <span>Navigate slides</span>
                </div>
              )}

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
                {totalSlides > 0 && <span className="text-[10px] text-primary font-bold">{progressPercent}% Previewed</span>}
              </div>

              <div className="flex-1 overflow-y-auto">
                {loadingOutline ? (
                  <div className="p-6 flex justify-center">
                    <span className="material-symbols-outlined text-primary text-2xl animate-spin">progress_activity</span>
                  </div>
                ) : weeks.length === 0 ? (
                  <p className="p-4 text-[10px] text-on-surface-variant">No weeks/lessons found for this course yet.</p>
                ) : (
                  weeks.map((week) => (
                    <div key={week.id} className="mb-2">
                      <div className="px-4 py-3 flex items-center justify-between bg-surface-container-highest/50">
                        <span className="text-[10px] font-bold tracking-wider text-on-surface-variant uppercase">
                          Week {week.week_number}: {week.title || "Module"}
                        </span>
                        <span className="material-symbols-outlined text-[18px] text-primary">expand_more</span>
                      </div>

                      <div className="px-2 py-2 space-y-1 relative">
                        {week.lessons.map((lesson) => {
                          const isActive = selectedLessonId === lesson.id;
                          const hasSlides = lesson.slideCount > 0;
                          return (
                            <button
                              key={lesson.id}
                              onClick={() => {
                                setSelectedLessonId(lesson.id);
                                setSelectedLessonTitle(lesson.title);
                              }}
                              disabled={!hasSlides}
                              className={`w-full text-left flex items-center gap-3 p-4 rounded-lg transition-colors cursor-pointer ${
                                isActive ? "bg-primary/10 border border-primary/20" : "hover:bg-surface-variant"
                              } ${!hasSlides ? "opacity-40 cursor-not-allowed" : ""}`}
                            >
                              <span
                                className={`material-symbols-outlined text-[20px] ${isActive ? "text-primary" : "text-on-surface-variant"}`}
                              >
                                {hasSlides ? "description" : "block"}
                              </span>
                              <div className="flex-1 min-w-0">
                                <p className={`text-xs truncate ${isActive ? "text-primary font-bold" : "text-on-surface"}`}>
                                  {lesson.title}
                                </p>
                                <p className={`text-[10px] mt-0.5 ${isActive ? "text-primary/70" : "text-on-surface-variant"}`}>
                                  {lesson.slideCount} Slide{lesson.slideCount === 1 ? "" : "s"}
                                </p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))
                )}
              </div>

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
    </AdminPinGuard>
  );
}
