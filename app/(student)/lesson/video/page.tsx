"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import AppSidebar from "@/components/AppSidebar";
import NotificationBell from "@/components/NotificationBell";
import CourseSwitcher from "@/components/CourseSwitcher";

interface DbLesson {
  id: string;
  title: string;
  video_url: string | null;
  slides_url: string | null;
  assignment_title: string | null;
  assignment_description: string | null;
  assignment_due_at: string | null;
  order_in_week: number;
}

type SubmissionStatus = "submitted" | "pass" | "needs_revision";

interface Submission {
  submission_url: string;
  screenshot_url: string | null;
  status: SubmissionStatus;
  feedback: string | null;
  submitted_at: string;
}

interface DbWeek {
  id: string;
  week_number: number;
  title: string;
  lessons: DbLesson[];
}

interface Enrolment {
  course_id: string;
  tier: string;
  waterline_week: number;
  courses?: { title: string };
}

function VideoLessonContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeLessonId = searchParams.get("id");
  const requestedCourseId = searchParams.get("course");

  const [loading, setLoading] = useState(true);
  const [studentEmail, setStudentEmail] = useState("");
  const [studentId, setStudentId] = useState("");

  const [enrolments, setEnrolments] = useState<Enrolment[]>([]);
  const [enrolment, setEnrolment] = useState<Enrolment | null>(null);
  const [weeks, setWeeks] = useState<DbWeek[]>([]);
  const [currentLesson, setCurrentLesson] = useState<DbLesson | null>(null);
  const [currentWeekNum, setCurrentWeekNum] = useState<number>(1);
  const [courseTitle, setCourseTitle] = useState("Course Content");

  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loadingSubmission, setLoadingSubmission] = useState(false);
  const [submissionUrlInput, setSubmissionUrlInput] = useState("");
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          router.push(`/auth/login?next=${encodeURIComponent("/lesson/video")}`);
          return;
        }

        setStudentEmail(user.email || "");
        setStudentId(user.id);

        // 1. Fetch all enrolments — a student can be enrolled in more than one course
        const { data: allEnrolments, error: enrolError } = await supabase
          .from("enrolments")
          .select("*, courses(title)")
          .eq("student_id", user.id);

        if (enrolError || !allEnrolments || allEnrolments.length === 0) {
          // Redirect to courses if not registered
          router.push("/courses");
          return;
        }

        // A student who's actually been admitted (has an enrolment) must
        // complete their profile before reaching lesson content.
        const { data: profileData } = await supabase.from("profiles").select("profile_completed").eq("id", user.id).maybeSingle();
        if (profileData?.profile_completed === false) {
          router.push("/onboarding");
          return;
        }

        setEnrolments(allEnrolments);
        const enrolData = allEnrolments.find((e) => e.course_id === requestedCourseId) || allEnrolments[0];

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
              assignment_title,
              assignment_description,
              assignment_due_at,
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

        // 3. Determine currently playing lesson
        let selected: DbLesson | null = null;
        let selectedWeekNum = 1;

        if (activeLessonId) {
          // Find the selected lesson in our weeks structure
          for (const w of sortedWeeks) {
            const found = w.lessons.find(l => l.id === activeLessonId);
            if (found) {
              selected = found;
              selectedWeekNum = w.week_number;
              break;
            }
          }
        }

        // Fallback: Default to first unlocked lesson
        if (!selected && sortedWeeks.length > 0) {
          for (const w of sortedWeeks) {
            // Check if week is locked for deposited tier
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
        console.error("Failed to load course details:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [router, activeLessonId, requestedCourseId]);

  // Load the student's own submission (if any) for the current lesson's assignment
  useEffect(() => {
    const lessonId = currentLesson?.id;
    const hasAssignment = !!currentLesson?.assignment_title;
    const loadSubmission = async () => {
      if (!lessonId || !hasAssignment) {
        setSubmission(null);
        return;
      }
      setLoadingSubmission(true);
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("assignment_submissions")
          .select("submission_url, screenshot_url, status, feedback, submitted_at")
          .eq("lesson_id", lessonId)
          .maybeSingle();
        setSubmission(data || null);
        setSubmissionUrlInput(data?.submission_url || "");
        setScreenshotFile(null);
        setScreenshotPreview(null);
      } catch (err) {
        console.error("Failed to load submission:", err);
      } finally {
        setLoadingSubmission(false);
      }
    };
    loadSubmission();
  }, [currentLesson]);

  const handleSwitchCourse = (courseId: string) => {
    router.push(`/lesson/video?course=${courseId}`);
  };

  const handleScreenshotSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setScreenshotFile(file);
    setScreenshotPreview(URL.createObjectURL(file));
  };

  const handleSubmitAssignment = async () => {
    if (!currentLesson || !submissionUrlInput.trim()) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      let screenshotUrl = submission?.screenshot_url || null;

      if (screenshotFile) {
        const uploadForm = new FormData();
        uploadForm.append("file", screenshotFile);
        uploadForm.append("lessonId", currentLesson.id);
        const uploadRes = await fetch("/api/upload/screenshot", { method: "POST", body: uploadForm });
        const uploadJson = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadJson.error || "Screenshot upload failed");
        screenshotUrl = uploadJson.url;
      }

      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId: currentLesson.id, submissionUrl: submissionUrlInput.trim(), screenshotUrl }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Submission failed");
      setSubmission({
        submission_url: submissionUrlInput.trim(),
        screenshot_url: screenshotUrl,
        status: "submitted",
        feedback: null,
        submitted_at: new Date().toISOString(),
      });
      setScreenshotFile(null);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  // Convert Google Drive sharing link to embed preview link
  const getEmbedUrl = (url: string | null) => {
    if (!url) return "";
    let clean = url.trim();
    if (clean.includes("drive.google.com")) {
      // Replace view or edit endpoints with preview
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

  const embedUrl = getEmbedUrl(currentLesson?.video_url || null);

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen overflow-x-hidden flex flex-col">
      <AppSidebar role="student" />

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 pt-6 pb-12 px-6">
        {/* Top Bar */}
        <header className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs text-on-surface-variant uppercase tracking-widest font-bold mb-1">
              Week {String(currentWeekNum).padStart(2, "0")} • {courseTitle}
            </p>
            <h1 className="font-syne text-xl font-bold text-on-surface">
              {currentLesson ? currentLesson.title : "Select a Lesson"}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <CourseSwitcher enrolments={enrolments} activeCourseId={enrolment?.course_id || ""} onSwitch={handleSwitchCourse} />
            <NotificationBell />
            <div className="w-9 h-9 rounded-full bg-secondary-container flex items-center justify-center font-bold text-on-secondary-container text-sm uppercase">
              {studentEmail.slice(0, 2)}
            </div>
          </div>
        </header>

        <div className="max-w-[1200px] mx-auto grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Left Column */}
          <div className="xl:col-span-8 space-y-6">

            {/* Video Player Box */}
            <div
              className="relative aspect-video bg-surface-container-lowest rounded-xl overflow-hidden border border-white/10 group"
              style={{ boxShadow: "0 0 40px -10px rgba(10, 207, 131, 0.15)" }}
            >
              {embedUrl ? (
                <iframe
                  src={embedUrl}
                  className="w-full h-full border-none"
                  allow="autoplay; fullscreen"
                  allowFullScreen
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-surface-container-low text-on-surface-variant p-6 text-center">
                  <span className="material-symbols-outlined text-5xl text-outline">smart_display</span>
                  <div>
                    <p className="text-xs font-bold text-white">No Video Content Loaded</p>
                    <p className="text-[10px] mt-1">The instructor hasn&apos;t added the video link for this lesson yet.</p>
                  </div>
                </div>
              )}

              {/* Watermark Overlay to prevent screen recording */}
              {embedUrl && (
                <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-[0.02] select-none">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-center font-bold text-[9px] text-on-surface -rotate-45 whitespace-nowrap">
                      {studentEmail}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions / Navigation */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="flex flex-wrap gap-4 text-on-surface-variant text-xs items-center">
                <span className="flex items-center gap-1 font-bold text-primary">
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                  Instructor: Alex Khod
                </span>
                <span className="bg-surface-variant text-on-surface px-3 py-1 rounded-full text-[10px] font-bold tracking-widest border border-white/5 uppercase">
                  LMS Content
                </span>
              </div>
              <div className="flex gap-3">
                {currentLesson && (
                  <Link
                    href={`/lesson/slides?id=${currentLesson.id}&course=${enrolment?.course_id || ""}`}
                    className="flex items-center gap-2 bg-surface-container border border-white/10 text-on-surface px-4 py-2 rounded text-xs font-bold hover:bg-surface-variant transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">present_to_all</span> View Slides
                  </Link>
                )}
              </div>
            </div>

            {/* Notes Section */}
            <article className="space-y-4 text-on-surface-variant">
              <h3 className="font-syne font-bold text-sm text-on-surface mt-2">Lesson Description</h3>
              <p className="text-xs leading-relaxed">
                Welcome to this session of the course. Follow along with the video lesson and consult the slides in the companion tab to reinforce your understanding. 
              </p>
              <div className="bg-surface-container-low p-4 border-l-4 border-primary rounded-r-lg">
                <h4 className="font-syne text-xs font-bold text-primary mb-1 tracking-widest">STUDY TIP</h4>
                <p className="text-xs italic">&ldquo;Pause, take notes, and build the concepts locally on your computer. Coding is learned by writing code.&rdquo;</p>
              </div>
            </article>

            {/* Assignment */}
            {currentLesson?.assignment_title && (
              <div className="bg-surface-container rounded-xl border border-white/10 p-5 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 text-primary text-[10px] font-bold uppercase tracking-widest mb-1">
                      <span className="material-symbols-outlined text-sm">assignment</span> Assignment
                    </div>
                    <h3 className="font-syne font-bold text-sm text-on-surface">{currentLesson.assignment_title}</h3>
                  </div>
                  {currentLesson.assignment_due_at && (
                    <span className="text-[10px] text-on-surface-variant border border-white/10 px-2 py-1 rounded-full whitespace-nowrap">
                      Due {new Date(currentLesson.assignment_due_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                  )}
                </div>

                {currentLesson.assignment_description && (
                  <p className="text-xs text-on-surface-variant leading-relaxed">{currentLesson.assignment_description}</p>
                )}

                {loadingSubmission ? (
                  <span className="material-symbols-outlined text-primary text-xl animate-spin block">progress_activity</span>
                ) : (
                  <div className="space-y-3">
                    {submission && (
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase border ${
                            submission.status === "pass"
                              ? "bg-primary/20 text-primary border-primary/30"
                              : submission.status === "needs_revision"
                              ? "bg-error/20 text-error border-error/30"
                              : "bg-tertiary/20 text-tertiary border-tertiary/30"
                          }`}
                        >
                          {submission.status === "pass" ? "Pass" : submission.status === "needs_revision" ? "Needs Revision" : "Awaiting Review"}
                        </span>
                        <a href={submission.submission_url} target="_blank" rel="noopener noreferrer" className="text-[11px] text-primary underline hover:no-underline break-all">
                          {submission.submission_url}
                        </a>
                      </div>
                    )}

                    {submission?.feedback && (
                      <div className="bg-surface-container-low p-3 rounded-lg border-l-2 border-primary/40">
                        <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Instructor Feedback</p>
                        <p className="text-xs text-on-surface-variant">{submission.feedback}</p>
                      </div>
                    )}

                    <input
                      type="url"
                      value={submissionUrlInput}
                      onChange={(e) => setSubmissionUrlInput(e.target.value)}
                      placeholder="https://github.com/you/project or your deployed link"
                      className="w-full bg-surface-container-lowest border border-white/10 rounded-lg px-3 py-2 text-xs text-on-surface outline-none focus:border-primary"
                    />

                    <div className="flex items-center gap-3">
                      {(screenshotPreview || submission?.screenshot_url) && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={screenshotPreview || submission?.screenshot_url || ""}
                          alt="Submission screenshot"
                          className="w-12 h-12 rounded-lg object-cover border border-white/10"
                        />
                      )}
                      <label className="flex-1 flex items-center justify-center gap-2 bg-surface-container-lowest border border-dashed border-white/20 hover:border-primary text-on-surface-variant hover:text-primary rounded-lg px-3 py-2 text-xs cursor-pointer transition-colors">
                        <span className="material-symbols-outlined text-base">add_photo_alternate</span>
                        {screenshotFile ? screenshotFile.name : submission?.screenshot_url ? "Change screenshot" : "Add a screenshot (optional)"}
                        <input type="file" accept="image/*" onChange={handleScreenshotSelect} className="hidden" />
                      </label>
                      <button
                        onClick={handleSubmitAssignment}
                        disabled={submitting || !submissionUrlInput.trim()}
                        className="bg-primary text-black font-bold text-xs px-4 py-2 rounded-lg hover:brightness-110 transition-all cursor-pointer disabled:opacity-50 whitespace-nowrap"
                      >
                        {submitting ? "Submitting…" : submission ? "Resubmit" : "Submit"}
                      </button>
                    </div>
                    {submitError && <p className="text-[10px] text-error font-bold">{submitError}</p>}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Course Content Sidebar */}
          <div className="xl:col-span-4">
            <div className="bg-surface-container rounded-xl border border-white/10 sticky top-6 overflow-hidden shadow-xl">
              <div className="p-4 bg-surface-container-highest border-b border-white/10">
                <h3 className="font-syne font-bold text-sm text-on-surface">Course Outline</h3>
                <p className="text-[10px] text-on-surface-variant mt-1">Select a session below to start learning.</p>
              </div>

              <div className="max-h-[500px] overflow-y-auto">
                {weeks.map((week) => {
                  const isLocked = enrolment?.tier === "deposited" && week.week_number > enrolment?.waterline_week;
                  
                  return (
                    <div key={week.id}>
                      <div className="p-3 border-b border-white/5 bg-surface-container-low/30 flex justify-between items-center">
                        <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">
                          Week {week.week_number}: {week.title || "Module"}
                        </span>
                        {isLocked && (
                          <span className="text-[9px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded font-bold uppercase">
                            Locked
                          </span>
                        )}
                      </div>
                      
                      <div className="space-y-px">
                        {week.lessons.map((lesson) => {
                          const isPlaying = currentLesson?.id === lesson.id;
                          
                          if (isLocked) {
                            return (
                              <div key={lesson.id} className="relative group cursor-not-allowed opacity-40 grayscale">
                                <div className="flex items-center gap-4 p-4">
                                  <div className="w-8 h-8 bg-surface-variant rounded flex items-center justify-center border border-white/5">
                                    <span className="material-symbols-outlined text-on-surface-variant text-base" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-xs text-on-surface font-bold">{lesson.title}</p>
                                    <p className="text-[9px] text-on-surface-variant mt-0.5">Deposit waterline lockout</p>
                                  </div>
                                </div>
                              </div>
                            );
                          }

                          return (
                            <Link
                              key={lesson.id}
                              href={`/lesson/video?id=${lesson.id}&course=${enrolment?.course_id || ""}`}
                              className={`flex items-center gap-4 p-4 transition-all border-l-2 ${
                                isPlaying
                                  ? "border-primary bg-background/40"
                                  : "border-transparent hover:bg-surface-variant/40"
                              }`}
                            >
                              <span className={`material-symbols-outlined text-base ${isPlaying ? "text-primary animate-pulse" : "text-on-surface-variant"}`}>
                                play_circle
                              </span>
                              <div className="flex-1">
                                <p className={`text-xs font-bold ${isPlaying ? "text-primary" : "text-on-surface"}`}>
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

              {enrolment?.tier === "deposited" && (
                <div className="p-4 bg-amber-500/5 border-t border-amber-500/10 text-center">
                  <p className="text-[9px] font-bold text-amber-400 mb-2 tracking-[0.2em]">DEPOSIT MEMBER LIMIT</p>
                  <p className="text-[10px] text-on-surface-variant mb-3 leading-relaxed">Please complete your tuition balance payment to unlock weeks beyond Week {enrolment?.waterline_week}.</p>
                  <Link
                    href="/payment/balance"
                    className="w-full inline-block bg-primary text-black py-2.5 rounded font-bold text-xs hover:scale-[1.01] transition-transform cursor-pointer"
                  >
                    PAY TUITION BALANCE
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="lg:ml-64 py-8 px-6 flex flex-col md:flex-row justify-between items-center border-t border-white/10 bg-background gap-4">
        <div>
          <span className="font-syne font-bold text-lg text-primary tracking-tight">KHODZ ACADEMY</span>
          <p className="text-xs text-on-surface-variant mt-1">© 2026 Khodz Academy. All rights reserved.</p>
        </div>
        <div className="flex flex-wrap gap-4 text-xs font-semibold">
          {["Terms of Service", "Privacy Policy", "Refund Policy", "Contact"].map((t) => (
            <Link key={t} href="#" className="text-on-surface-variant hover:text-primary underline transition-colors">{t}</Link>
          ))}
        </div>
      </footer>
    </div>
  );
}

export default function VideoLessonPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <span className="material-symbols-outlined text-primary text-4xl animate-spin">progress_activity</span>
        </div>
      }
    >
      <VideoLessonContent />
    </Suspense>
  );
}
