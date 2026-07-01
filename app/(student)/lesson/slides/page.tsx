"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import AppSidebar from "@/components/AppSidebar";

interface DbLesson {
  id: string;
  title: string;
  video_url: string | null;
  slides_url: string | null;
  order_in_week: number;
}

interface DbWeek {
  id: string;
  week_number: number;
  title: string;
  lessons: DbLesson[];
}

export default function LessonSlidesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeLessonId = searchParams.get("id");

  const [loading, setLoading] = useState(true);
  const [studentName, setStudentName] = useState("Student");
  const [studentEmail, setStudentEmail] = useState("");
  
  const [enrolment, setEnrolment] = useState<any>(null);
  const [weeks, setWeeks] = useState<DbWeek[]>([]);
  const [currentLesson, setCurrentLesson] = useState<DbLesson | null>(null);
  const [currentWeekNum, setCurrentWeekNum] = useState<number>(1);
  const [courseTitle, setCourseTitle] = useState("Course Content");

  useEffect(() => {
    const loadData = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push(`/auth/login?next=${encodeURIComponent("/lesson/slides")}`);
          return;
        }

        setStudentName(user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "Student");
        setStudentEmail(user.email || "");

        // 1. Fetch active enrolment
        const { data: enrolData, error: enrolError } = await supabase
          .from("enrolments")
          .select("*, courses(title)")
          .eq("student_id", user.id)
          .limit(1)
          .maybeSingle();

        if (enrolError || !enrolData) {
          router.push("/courses");
          return;
        }

        setEnrolment(enrolData);
        setCourseTitle(enrolData.courses?.title || "My Course");
        const courseId = enrolData.course_id;

        // 2. Fetch weeks & lessons
        const { data: weeksData, error: weeksError } = await supabase
          .from("weeks")
          .select(`
            id,
            week_number,
            title,
            lessons (
              id,
              title,
              video_url,
              slides_url,
              order_in_week
            )
          `)
          .eq("course_id", courseId)
          .order("week_number", { ascending: true });

        if (weeksError) throw weeksError;

        // Sort lessons inside weeks
        const sortedWeeks = (weeksData || []).map((w: any) => ({
          id: w.id,
          week_number: w.week_number,
          title: w.title,
          lessons: (w.lessons || []).sort((a: any, b: any) => a.order_in_week - b.order_in_week)
        })) as DbWeek[];

        setWeeks(sortedWeeks);

        // 3. Determine selected lesson
        let selected: DbLesson | null = null;
        let selectedWeekNum = 1;

        if (activeLessonId) {
          for (const w of sortedWeeks) {
            const found = w.lessons.find(l => l.id === activeLessonId);
            if (found) {
              selected = found;
              selectedWeekNum = w.week_number;
              break;
            }
          }
        }

        if (!selected && sortedWeeks.length > 0) {
          for (const w of sortedWeeks) {
            const isLocked = enrolData.tier === "deposited" && w.week_number > enrolData.waterline_week;
            if (!isLocked && w.lessons.length > 0) {
              selected = w.lessons[0];
              selectedWeekNum = w.week_number;
              break;
            }
          }
        }

        setCurrentLesson(selected);
        setCurrentWeekNum(selectedWeekNum);

      } catch (err) {
        console.error("Failed to load slides details:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [router, activeLessonId]);

  // Convert Google Drive sharing link to embed preview link
  const getEmbedUrl = (url: string | null) => {
    if (!url) return "";
    let clean = url.trim();
    if (clean.includes("drive.google.com")) {
      return clean
        .replace(/\/view\??.*/, "/preview")
        .replace(/\/edit\??.*/, "/preview")
        .replace(/\/usp=sharing\??.*/, "");
    }
    return clean;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <span className="material-symbols-outlined text-primary text-4xl animate-spin">progress_activity</span>
      </div>
    );
  }

  const embedUrl = getEmbedUrl(currentLesson?.slides_url || null);

  return (
    <div className="bg-background text-on-background font-body-md overflow-hidden min-h-screen flex">
      <AppSidebar role="student" />

      {/* Main Content Canvas */}
      <main className="flex-1 lg:ml-64 h-screen flex flex-col relative overflow-hidden">
        {/* Top Toolbar */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-white/10 bg-surface/70 backdrop-blur-xl z-40 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button className="lg:hidden text-on-surface cursor-pointer">
              <span className="material-symbols-outlined">menu</span>
            </button>
            <div>
              <h2 className="font-syne text-sm font-bold text-primary truncate max-w-[300px]">
                {currentLesson ? currentLesson.title : "Slides"}
              </h2>
              <p className="text-[10px] text-on-surface-variant">Week {currentWeekNum} • {courseTitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 bg-surface-container-high px-4 py-1.5 rounded-full border border-white/5">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span className="text-[10px] font-bold text-on-surface uppercase tracking-widest">LIVE SESSION</span>
            </div>

            <div className="flex items-center gap-3">
              <button className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-xl">notifications</span>
              </button>
              <div className="w-8 h-8 rounded-full bg-secondary-container overflow-hidden border border-primary/20 flex items-center justify-center font-bold text-on-secondary-container text-xs uppercase">
                {studentEmail.slice(0, 2)}
              </div>
            </div>
          </div>
        </header>

        {/* Content Row */}
        <div className="flex-1 flex overflow-hidden">
          {/* Slide Viewer Area */}
          <section className="flex-1 flex flex-col relative bg-surface-container-lowest">

            {/* Watermark Layer */}
            <div
              className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(-45deg, transparent, transparent 150px, rgba(255,255,255,0.015) 150px, rgba(255,255,255,0.015) 300px)",
              }}
            >
              <div className="grid grid-cols-3 gap-32 rotate-12 transform scale-150 select-none">
                {Array.from({ length: 6 }).map((_, i) => (
                  <span key={i} className="text-on-surface-variant font-bold text-[9px] whitespace-nowrap opacity-25">
                    {studentName} - {studentEmail}
                  </span>
                ))}
              </div>
            </div>

            {/* Slide Canvas */}
            <div className="flex-1 flex items-center justify-center p-6 relative z-10">
              <div
                className="w-full h-full max-w-5xl bg-surface-container border border-white/10 rounded-lg overflow-hidden relative shadow-2xl"
                style={{ boxShadow: "0 0 40px -10px rgba(10, 207, 131, 0.1)" }}
              >
                {embedUrl ? (
                  <iframe
                    src={embedUrl}
                    className="w-full h-full border-none"
                    allow="autoplay"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-surface-container-low text-on-surface-variant p-6 text-center">
                    <span className="material-symbols-outlined text-5xl text-outline">present_to_all</span>
                    <div>
                      <p className="text-xs font-bold text-white">No Slides Loaded</p>
                      <p className="text-[10px] mt-1">The instructor hasn&apos;t added slide/PDF links for this lesson yet.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Lesson List Sidebar */}
          <aside className="w-80 border-l border-white/10 bg-surface-container-low flex flex-col z-30 flex-shrink-0">
            <div className="p-4 border-b border-white/10 flex justify-between items-center">
              <h3 className="font-syne text-xs font-bold text-on-surface">Curriculum</h3>
            </div>

            <div className="flex-1 overflow-y-auto">
              {weeks.map((week) => {
                const isLocked = enrolment?.tier === "deposited" && week.week_number > enrolment?.waterline_week;
                
                return (
                  <div key={week.id} className="mb-2">
                    {/* Week header */}
                    <div className={`px-4 py-3 flex items-center justify-between ${isLocked ? "opacity-50" : "bg-surface-container-highest/50"}`}>
                      <span className="text-[10px] font-bold tracking-wider text-on-surface-variant uppercase">
                        Week {week.week_number}: {week.title || "Module"}
                      </span>
                      <span className="material-symbols-outlined text-[18px] text-primary">
                        {isLocked ? "lock" : "expand_more"}
                      </span>
                    </div>

                    {/* Lessons */}
                    <div className="px-2 py-2 space-y-1 relative">
                      {isLocked && (
                        <div className="absolute inset-0 z-10 bg-background/40 backdrop-blur-[2px] flex flex-col items-center justify-center p-4 text-center">
                          <span className="material-symbols-outlined text-amber-400 mb-2 text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
                          <p className="text-[10px] font-bold text-on-surface mb-1">Tuition balance required</p>
                          <Link href="/payment/balance" className="text-primary text-[9px] underline hover:no-underline cursor-pointer">Pay Balance</Link>
                        </div>
                      )}
                      
                      {week.lessons.map((lesson) => {
                        const isSelected = currentLesson?.id === lesson.id;
                        
                        return (
                          <Link
                            key={lesson.id}
                            href={isLocked ? "#" : `/lesson/slides?id=${lesson.id}`}
                            className={`flex items-center gap-3 p-4 rounded-lg transition-colors cursor-pointer ${
                              isSelected
                                ? "bg-primary/10 border border-primary/20"
                                : "hover:bg-surface-variant"
                            } ${isLocked ? "opacity-35 cursor-not-allowed" : ""}`}
                          >
                            <span className={`material-symbols-outlined text-[20px] ${isSelected ? "text-primary" : "text-on-surface-variant"}`}>
                              present_to_all
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className={`text-xs truncate ${isSelected ? "text-primary font-bold" : "text-on-surface"}`}>
                                {lesson.title}
                              </p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Sidebar Footer */}
            <div className="p-4 bg-surface-container border-t border-white/10">
              <div className="flex items-center gap-3 text-on-surface-variant">
                <span className="material-symbols-outlined text-[18px]">info</span>
                <p className="text-[10px]">Secure Presentation Mode</p>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
