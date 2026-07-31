"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import AppSidebar from "@/components/AppSidebar";
import NotificationBell from "@/components/NotificationBell";
import CourseSwitcher from "@/components/CourseSwitcher";
import { createClient } from "@/lib/supabase/client";
import { COURSES, COURSES_MAP } from "@/lib/courses-data";

interface UserProfile {
  role?: string;
  full_name?: string | null;
  avatar_url?: string | null;
  profile_completed?: boolean;
}

interface Enrolment {
  course_id: string;
  tier: string;
  cohort: string | null;
  waterline_week: number;
  payment_deadline: string | null;
  created_at: string;
  courses?: { title: string };
}

const TIER_LABEL: Record<string, string> = {
  admitted: "Admitted",
  deposited: "Deposited",
  paid: "Fully Paid",
};

const TIER_COLOR: Record<string, string> = {
  admitted: "bg-white/10 text-on-surface-variant border-white/10",
  deposited: "bg-tertiary/20 text-tertiary border-tertiary/30",
  paid: "bg-primary/20 text-primary border-primary/30",
};

interface Payment {
  course_id: string | null;
  amount: number;
  payment_type: string;
  paid_at: string;
}

interface Announcement {
  id: string;
  title: string;
  body: string;
  created_at: string;
  courses?: { title: string } | { title: string }[] | null;
}

function announcementCourseTitle(courses: Announcement["courses"]) {
  if (!courses) return null;
  return Array.isArray(courses) ? courses[0]?.title ?? null : courses.title;
}

function StudentDashboardContent() {
  const searchParams = useSearchParams();
  const requestedCourseId = searchParams.get("course");

  const [searchQuery, setSearchQuery] = useState("");
  const [enrolments, setEnrolments] = useState<Enrolment[]>([]);
  const [enrolment, setEnrolment] = useState<Enrolment | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [currentTime, setCurrentTime] = useState<string>("");

  // Live ticking clock
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          year: "numeric",
        }) +
          " · " +
          now.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>("https://lh3.googleusercontent.com/aida-public/AB6AXuCXcZ0Y-k35tsaUPewSwh8RfmTddpo7nlyD1GZOHEi8WUuXSF5HqmklT4tkJieXXVFTmHt9AIizG5_biJQzl0MZ1kR693G50tC_qXtsLwd8bvnIHodQ32ccNCgtYIuGAjJbUapSEC3oLybUKIyXYey_SEcXm159Wl-2xEs5NUoDd1cZgdxNozNwmM-DPLNTwqwOqLCp3Msok09iItHHxPIa6V5JHhOwtAR0EZ3a182zZGP-yMNwWfbCbXyL6Zk4vzW_i4OgY_oDl7s");
  const [displayName, setDisplayName] = useState<string>("Student");

  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setDisplayName(user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "Student");
        if (user.user_metadata?.avatar_url) {
          setAvatarUrl(user.user_metadata.avatar_url);
        }
        
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        if (profileData) {
          setProfile(profileData as UserProfile);
          if (profileData.full_name) setDisplayName(profileData.full_name);
          if (profileData.avatar_url) setAvatarUrl(profileData.avatar_url);
        }

        // Fetch all enrolments — a student can be enrolled in more than one course
        const { data: allEnrolments } = await supabase
          .from("enrolments")
          .select("*, courses(title)")
          .eq("student_id", user.id);
        if (allEnrolments && allEnrolments.length > 0) {
          setEnrolments(allEnrolments);
          setEnrolment(allEnrolments.find((e) => e.course_id === requestedCourseId) || allEnrolments[0]);

          // A student who's actually been admitted (has an enrolment) must
          // complete their profile before reaching the dashboard. Someone
          // who signed up but hasn't paid yet is never gated here.
          if (profileData?.profile_completed === false) {
            router.push("/onboarding");
            return;
          }
        }

        // Fetch this student's own payment history (RLS scopes this to their own rows)
        const { data: paymentsData } = await supabase
          .from("payments")
          .select("course_id, amount, payment_type, paid_at")
          .eq("student_id", user.id);
        setPayments(paymentsData || []);

        // Fetch announcements relevant to this student (RLS scopes to
        // global announcements + ones for courses they're enrolled in)
        const { data: announcementsData } = await supabase
          .from("announcements")
          .select("id, title, body, created_at, courses(title)")
          .order("created_at", { ascending: false })
          .limit(5);
        setAnnouncements(announcementsData || []);
      } else {
        router.push(`/auth/login?next=${encodeURIComponent("/student-dashboard")}`);
      }
    };
    loadUser();
  }, [router, requestedCourseId]);

  const handleSwitchCourse = (courseId: string) => {
    router.push(`/student-dashboard?course=${courseId}`);
  };

  const enrolledCourseIds = new Set(enrolments.map((e) => e.course_id));
  const exploreCourses = COURSES.filter((c) => c.active && !enrolledCourseIds.has(c.id));

  const query = searchQuery.trim().toLowerCase();
  const visibleEnrolments = enrolments.filter((e) => !query || (e.courses?.title || e.course_id).toLowerCase().includes(query));
  const visibleExploreCourses = exploreCourses.filter((c) => !query || c.title.toLowerCase().includes(query));

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen overflow-x-hidden flex flex-col">
      {/* Dynamic Payment Due Scrolling Marquee */}
      {enrolment && enrolment.tier !== 'paid' && enrolment.payment_deadline && (
        <div className="bg-red-950/40 border-b border-red-500/20 py-2.5 overflow-hidden text-xs text-red-400 font-bold z-[100] relative flex">
          <div className="animate-marquee whitespace-nowrap flex gap-8">
            <span>⚠️ ATTENTION REMINDER: Your remaining tuition balance is due by {new Date(enrolment.payment_deadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}. Please proceed to the payment tab to complete your enrolment.</span>
            <span>⚠️ ATTENTION REMINDER: Your remaining tuition balance is due by {new Date(enrolment.payment_deadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}. Please proceed to the payment tab to complete your enrolment.</span>
            <span>⚠️ ATTENTION REMINDER: Your remaining tuition balance is due by {new Date(enrolment.payment_deadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}. Please proceed to the payment tab to complete your enrolment.</span>
          </div>
        </div>
      )}

      <div className="flex flex-1">
        <AppSidebar role="student" />

        {/* Main Content Area */}
        <main className="flex-1 lg:ml-64 relative bg-background min-h-screen">
          {/* TopNavBar */}
          <header className="sticky top-0 w-full z-40 bg-surface/70 backdrop-blur-xl border-b border-white/10 px-gutter py-stack-md flex justify-between items-center px-6 py-4">
            <div className="flex flex-col">
              <h2 className="font-syne text-headline-md text-on-surface leading-none text-xl font-bold">
                Welcome back, {displayName.split(" ")[0]}
              </h2>
              <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-on-surface-variant">
                <span>Let&apos;s continue your mastery journey.</span>
                {currentTime && (
                  <>
                    <span className="text-white/10">•</span>
                    <span className="font-mono text-primary font-semibold">{currentTime}</span>
                  </>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-stack-md gap-4">
              <div className="relative hidden md:block">
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-surface-container-low border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm focus:ring-1 focus:ring-primary focus:border-primary transition-all w-64 outline-none"
                  placeholder="Search courses..."
                  type="text"
                />
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
                  search
                </span>
              </div>
              
              <CourseSwitcher enrolments={enrolments} activeCourseId={enrolment?.course_id || ""} onSwitch={handleSwitchCourse} />

              <NotificationBell />

              <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                <div className="text-right hidden sm:block">
                  <p className="font-label-md text-sm text-on-surface font-semibold">{displayName}</p>
                  <p className="font-label-sm text-[10px] text-primary uppercase tracking-widest">
                    {profile?.role === "admin" ? "Admin Panel" : "Student Portal"}
                  </p>
                </div>
                <img
                  alt="User avatar"
                  className="w-10 h-10 rounded-full border-2 border-primary-container object-cover bg-surface"
                  src={avatarUrl}
                />
              </div>
            </div>
          </header>

          <div className="p-gutter max-w-container-max mx-auto space-y-stack-lg p-6 space-y-6 max-w-[1280px]">
            {/* Announcements */}
            {announcements.length > 0 && (
              <section className="space-y-3">
                {announcements.map((a) => (
                  <div key={a.id} className="glass-card rounded-xl p-4 border border-primary/20 flex gap-3 items-start">
                    <span className="material-symbols-outlined text-primary text-xl shrink-0">campaign</span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-syne text-xs font-bold text-on-surface">{a.title}</h4>
                        <span className="text-[9px] text-on-surface-variant border border-white/10 px-1.5 py-0.5 rounded-full">
                          {announcementCourseTitle(a.courses) || "All Courses"}
                        </span>
                        <span className="text-[9px] text-on-surface-variant">
                          {new Date(a.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </span>
                      </div>
                      <p className="text-xs text-on-surface-variant mt-1 whitespace-pre-wrap">{a.body}</p>
                    </div>
                  </div>
                ))}
              </section>
            )}

            {/* Your Courses */}
            <section>
              <h3 className="font-syne text-headline-md text-on-surface mb-stack-md mb-4 text-lg font-semibold">
                Your Courses
              </h3>

              {enrolments.length === 0 ? (
                <div className="glass-card rounded-xl p-stack-lg p-10 inner-glow text-center">
                  <span className="material-symbols-outlined text-4xl text-on-surface-variant opacity-40 mb-3 block">school</span>
                  <p className="text-sm font-bold text-on-surface mb-1">You&apos;re not enrolled in any course yet</p>
                  <p className="text-xs text-on-surface-variant mb-4">Browse our programmes and start your journey today.</p>
                  <Link href="/courses" className="inline-block bg-primary text-black font-bold py-2.5 px-6 rounded-lg text-xs hover:brightness-110 transition-all">
                    Browse Courses
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md gap-4">
                  {visibleEnrolments.map((e) => {
                    const totalPriceGhs = COURSES_MAP[e.course_id]?.totalGhs ?? null;
                    const amountPaid = payments.filter((p) => p.course_id === e.course_id).reduce((sum, p) => sum + Number(p.amount), 0);
                    const remainingGhs = totalPriceGhs !== null ? Math.max(0, totalPriceGhs - amountPaid) : null;
                    return (
                    <div key={e.course_id} className="glass-card rounded-xl p-stack-lg p-6 inner-glow flex flex-col gap-3">
                      <div className="flex items-start justify-between gap-3">
                        <h4 className="font-syne text-headline-md text-on-surface text-base font-bold leading-tight">
                          {e.courses?.title || e.course_id}
                        </h4>
                        <span className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase border shrink-0 ${TIER_COLOR[e.tier] || TIER_COLOR.admitted}`}>
                          {TIER_LABEL[e.tier] || e.tier}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2 text-[10px] text-on-surface-variant">
                        {e.cohort && (
                          <span className="border border-white/10 px-2 py-0.5 rounded-full">{e.cohort}</span>
                        )}
                        <span className="border border-white/10 px-2 py-0.5 rounded-full">
                          Enrolled {new Date(e.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                        {e.tier !== "paid" && e.payment_deadline && (
                          <span className="border border-amber-500/30 text-amber-400 px-2 py-0.5 rounded-full">
                            Balance due {new Date(e.payment_deadline).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </span>
                        )}
                      </div>

                      {totalPriceGhs !== null && (
                        <div className="bg-surface-container-low rounded-lg p-3 space-y-1.5">
                          <div className="flex justify-between text-[10px]">
                            <span className="text-on-surface-variant">Amount Paid</span>
                            <span className="text-on-surface font-bold">GHS {amountPaid.toLocaleString()} / {totalPriceGhs.toLocaleString()}</span>
                          </div>
                          <div className="h-1.5 bg-surface-variant rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full transition-all"
                              style={{ width: `${totalPriceGhs > 0 ? Math.min(100, (amountPaid / totalPriceGhs) * 100) : 0}%` }}
                            />
                          </div>
                          {remainingGhs !== null && remainingGhs > 0 && (
                            <p className="text-[9px] text-amber-400 font-bold">GHS {remainingGhs.toLocaleString()} remaining</p>
                          )}
                        </div>
                      )}

                      <div className="flex gap-3 mt-2">
                        <Link
                          href={`/lesson/video?course=${e.course_id}`}
                          className="flex-1 flex items-center justify-center gap-2 bg-primary text-black font-bold py-2.5 rounded-lg text-xs hover:brightness-110 transition-all"
                        >
                          <span className="material-symbols-outlined text-base">play_circle</span> Watch Videos
                        </Link>
                        <Link
                          href={`/lesson/slides?course=${e.course_id}`}
                          className="flex-1 flex items-center justify-center gap-2 bg-surface-container-high border border-white/10 text-on-surface font-bold py-2.5 rounded-lg text-xs hover:bg-surface-variant transition-all"
                        >
                          <span className="material-symbols-outlined text-base">present_to_all</span> View Slides
                        </Link>
                      </div>
                    </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Explore More Programs */}
            {visibleExploreCourses.length > 0 && (
              <section className="mt-stack-lg mt-8">
                <h3 className="font-syne text-headline-md text-on-surface mb-stack-md mb-4 text-lg font-semibold">
                  Explore More Programs
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-stack-md gap-4">
                  {visibleExploreCourses.map((c) => (
                    <Link
                      key={c.id}
                      href={`/courses/${c.id}`}
                      className="glass-card p-stack-md p-6 rounded-xl glow-hover transition-all cursor-pointer text-center group"
                    >
                      <span className="material-symbols-outlined text-primary text-[32px] mb-2 group-hover:scale-110 transition-transform">
                        school
                      </span>
                      <p className="font-label-md text-sm text-on-surface font-semibold">{c.title}</p>
                      <p className="text-[10px] text-on-surface-variant uppercase tracking-widest mt-1">GHS {c.totalGhs.toLocaleString()}</p>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Footer */}
          <footer className="w-full py-stack-lg py-8 px-gutter px-6 flex flex-col md:flex-row justify-between items-center border-t border-white/10 mt-stack-lg max-w-[1280px] mx-auto gap-4">
            <div className="flex flex-col items-center md:items-start mb-stack-md md:mb-0">
              <h4 className="font-syne text-headline-md text-primary font-bold text-lg">KHODZ ACADEMY</h4>
              <p className="font-body-sm text-xs text-on-surface-variant mt-1">
                © 2024 Khodz Academy. All rights reserved.
              </p>
            </div>
            <div className="flex gap-stack-lg gap-6 text-xs">
              <a className="text-on-surface-variant hover:text-primary transition-colors underline" href="#">
                Terms of Service
              </a>
              <a className="text-on-surface-variant hover:text-primary transition-colors underline" href="#">
                Privacy Policy
              </a>
              <a className="text-on-surface-variant hover:text-primary transition-colors underline" href="#">
                Contact
              </a>
            </div>
          </footer>
        </main>
      </div>


      {/* Contact support */}
      <a
        href="mailto:sales@khodz.academy"
        title="Contact support"
        className="fixed bottom-gutter right-gutter bottom-8 right-8 w-14 h-14 bg-primary-container text-on-primary-container rounded-full shadow-lg shadow-primary/20 flex items-center justify-center z-[55] hover:scale-105 active:scale-95 transition-transform cursor-pointer text-white bg-brand"
      >
        <span className="material-symbols-outlined text-[32px]">question_answer</span>
      </a>
    </div>
  );
}

export default function StudentDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <span className="material-symbols-outlined text-primary text-4xl animate-spin">progress_activity</span>
        </div>
      }
    >
      <StudentDashboardContent />
    </Suspense>
  );
}
