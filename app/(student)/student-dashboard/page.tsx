"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AppSidebar from "@/components/AppSidebar";
import { createClient } from "@/lib/supabase/client";

interface UserProfile {
  role?: string;
}

export default function StudentDashboardPage() {
  const [warningDismissed, setWarningDismissed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [enrolment, setEnrolment] = useState<any>(null);
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

  // Chart bar load animation helper
  const [animateChart, setAnimateChart] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setAnimateChart(true), 100);
    return () => clearTimeout(timer);
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
        }

        // Fetch enrolment details
        const { data: enrolmentData } = await supabase
          .from("enrolments")
          .select("*, courses(title)")
          .eq("student_id", user.id)
          .single();
        if (enrolmentData) {
          setEnrolment(enrolmentData);
        }
      } else {
        router.push(`/auth/login?next=${encodeURIComponent("/student-dashboard")}`);
      }
    };
    loadUser();
  }, [router]);

  const chartData = [
    { day: 1, height: "20%", active: false, tooltip: "" },
    { day: 2, height: "35%", active: false, tooltip: "" },
    { day: 3, height: "25%", active: false, tooltip: "" },
    { day: 4, height: "45%", active: false, tooltip: "" },
    { day: 5, height: "70%", active: true, tooltip: "4.2 hrs Today" },
    { day: 6, height: "40%", active: false, tooltip: "" },
    { day: 7, height: "15%", active: false, tooltip: "" },
    { day: 8, height: "60%", active: false, tooltip: "" },
    { day: 9, height: "30%", active: false, tooltip: "" },
    { day: 10, height: "50%", active: false, tooltip: "" },
  ];

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

      {/* Network water warning */}
      {!warningDismissed && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-gutter py-2 flex items-center justify-between text-xs text-amber-400 font-bold z-[100] px-6">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">warning</span>
            <span>SIMULATED SANDBOX ACCESS — REALTIME SYNC DISABLED</span>
          </div>
          <button onClick={() => setWarningDismissed(true)} className="material-symbols-outlined text-sm opacity-60 hover:opacity-100 cursor-pointer">
            close
          </button>
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
                  placeholder="Search lessons..."
                  type="text"
                />
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
                  search
                </span>
              </div>
              
              <button className="relative p-2 text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full"></span>
              </button>
              
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
            {/* Dashboard Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-stack-lg gap-6">
              
              {/* Progress Chart Section */}
              <div className="md:col-span-8 glass-card rounded-xl p-stack-lg p-6 inner-glow">
                <div className="flex justify-between items-end mb-stack-lg mb-6">
                  <div>
                    <h3 className="font-syne text-headline-md text-on-surface text-lg font-semibold">
                      Learning Performance
                    </h3>
                    <p className="font-body-sm text-xs text-on-surface-variant">Your activity over the last 14 days</p>
                  </div>
                  <div>
                    <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-[10px] font-bold">
                      +12% vs last week
                    </span>
                  </div>
                </div>
                
                {/* Chart Visualization */}
                <div className="h-64 flex items-end justify-between gap-2 px-4">
                  {chartData.map((bar, i) => (
                    <div
                      key={i}
                      style={{ height: animateChart ? bar.height : "0%" }}
                      className={`w-full rounded-t-sm transition-all duration-1000 ${
                        bar.active ? "bg-primary" : "bg-surface-container-high hover:bg-primary"
                      } relative group cursor-pointer`}
                    >
                      {bar.tooltip && (
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-on-surface text-surface py-1 px-2 rounded text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-white text-black">
                          {bar.tooltip}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats Quick Look */}
              <div className="md:col-span-4 flex flex-col gap-stack-md gap-4">
                <div className="glass-card rounded-xl p-stack-md p-6 inner-glow flex items-center gap-stack-md gap-4 grow">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary text-2xl font-bold">
                    <span className="material-symbols-outlined">verified</span>
                  </div>
                  <div>
                    <p className="text-xs text-on-surface-variant uppercase tracking-widest font-bold">
                      Total Progress
                    </p>
                    <p className="text-3xl font-syne text-primary font-bold leading-tight">68%</p>
                  </div>
                </div>
                
                <div className="glass-card rounded-xl p-stack-md p-6 inner-glow flex items-center gap-stack-md gap-4 grow">
                  <div className="w-12 h-12 bg-tertiary/10 rounded-lg flex items-center justify-center text-tertiary text-2xl font-bold">
                    <span className="material-symbols-outlined">timer</span>
                  </div>
                  <div>
                    <p className="text-xs text-on-surface-variant uppercase tracking-widest font-bold">
                      Study Time
                    </p>
                    <p className="text-3xl font-syne text-tertiary font-bold leading-tight">124h</p>
                  </div>
                </div>
              </div>

              {/* Next Lesson Card */}
              <div className="md:col-span-12 lg:col-span-7 relative group overflow-hidden rounded-xl h-72">
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent z-10"></div>
                <img
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  alt="Lesson background"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCqhzFpRkJuWMy7h-t_Hox6JidH0mizsCFz-iLyM67G2gaULTaTFOY3jmbetsqYlfDeVMLRHH64l9yCQCspRnnpfaz1Toc_trQE_Yp-v4tBJBg5-gDgBm1W923NiJYVPZilfXMFASOflvCMZ7qAXsnlDZafULRe2TBPu1eT3gbwCbiIXp6ukxgioNhrNQ8Cc8bAFTTWyynGw3PpxR-Eobn8A7zDDCWX_r7mNX1RboE0et01Livyceq0rVwPV_FjLSA77CtEDvzs88I"
                />
                <div className="absolute inset-0 z-20 p-stack-lg p-6 flex flex-col justify-end">
                  <span className="bg-primary text-on-primary px-3 py-1 rounded-full text-xs font-bold w-fit mb-stack-sm text-black">
                    CONTINUE LEARNING
                  </span>
                  <h3 className="font-syne text-display-md text-on-surface mb-stack-sm text-2xl font-bold">
                    Advanced System Architecture
                  </h3>
                  <div className="flex items-center gap-stack-lg gap-6">
                    <p className="font-body-sm text-xs text-on-surface-variant flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm mr-1">play_circle</span> Module 4: Microservices
                    </p>
                    <div className="flex-1 bg-white/10 h-1 rounded-full overflow-hidden max-w-[120px]">
                      <div className="bg-primary h-full w-[45%]"></div>
                    </div>
                  </div>
                  <Link href="/lesson/video" className="mt-stack-md mt-4 bg-white text-background font-bold py-3 px-stack-lg rounded-lg w-fit hover:bg-primary hover:text-black transition-colors flex items-center gap-2 text-sm text-black cursor-pointer decoration-none">
                    Start Session <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </Link>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="md:col-span-12 lg:col-span-5 glass-card rounded-xl p-stack-lg p-6 inner-glow flex flex-col">
                <div className="flex justify-between items-center mb-stack-lg mb-6">
                  <h3 className="font-syne text-headline-md text-on-surface text-lg font-semibold">
                    Recent Activity
                  </h3>
                  <button className="text-primary font-label-md text-xs hover:underline cursor-pointer">
                    View All
                  </button>
                </div>
                
                <div className="space-y-stack-md overflow-y-auto max-h-[220px] pr-2 space-y-4">
                  {/* Activity Item */}
                  <div className="flex gap-stack-md gap-3 items-start p-stack-sm rounded-lg hover:bg-white/5 transition-colors p-2">
                    <div className="mt-1 w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
                      <span className="material-symbols-outlined text-[18px]">quiz</span>
                    </div>
                    <div className="flex-1 text-sm">
                      <p className="font-body-sm text-on-surface">
                        Passed Quiz: <span className="text-primary">Database Indexing</span>
                      </p>
                      <p className="text-xs text-on-surface-variant">Score: 94% • 2 hours ago</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-stack-md gap-3 items-start p-stack-sm rounded-lg hover:bg-white/5 transition-colors p-2">
                    <div className="mt-1 w-8 h-8 rounded-full bg-tertiary-container flex items-center justify-center text-on-tertiary-container">
                      <span className="material-symbols-outlined text-[18px]">cloud_download</span>
                    </div>
                    <div className="flex-1 text-sm">
                      <p className="font-body-sm text-on-surface">
                        Downloaded: <span className="text-tertiary">Cloud Native PDF</span>
                      </p>
                      <p className="text-xs text-on-surface-variant">Resources Section • 5 hours ago</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-stack-md gap-3 items-start p-stack-sm rounded-lg hover:bg-white/5 transition-colors p-2">
                    <div className="mt-1 w-8 h-8 rounded-full bg-primary-container/20 flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined text-[18px]">comment</span>
                    </div>
                    <div className="flex-1 text-sm">
                      <p className="font-body-sm text-on-surface">
                        Reply from: <span className="text-primary">Instructor Sarah</span>
                      </p>
                      <p className="text-xs text-on-surface-variant">Thread: API Gateways • Yesterday</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Specialized Tracks Section */}
            <section className="mt-stack-lg mt-8">
              <h3 className="font-syne text-headline-md text-on-surface mb-stack-md mb-4 text-lg font-semibold">
                Specialized Tracks
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-stack-md gap-4">
                <div className="glass-card p-stack-md p-6 rounded-xl glow-hover transition-all cursor-pointer text-center group">
                  <span className="material-symbols-outlined text-primary text-[32px] mb-2 group-hover:scale-110 transition-transform">
                    code
                  </span>
                  <p className="font-label-md text-sm text-on-surface font-semibold">Development</p>
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-widest mt-1">12 Modules</p>
                </div>
                
                <div className="glass-card p-stack-md p-6 rounded-xl glow-hover transition-all cursor-pointer text-center group">
                  <span className="material-symbols-outlined text-tertiary text-[32px] mb-2 group-hover:scale-110 transition-transform">
                    palette
                  </span>
                  <p className="font-label-md text-sm text-on-surface font-semibold">Design</p>
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-widest mt-1">8 Modules</p>
                </div>
                
                <div className="glass-card p-stack-md p-6 rounded-xl glow-hover transition-all cursor-pointer text-center group opacity-50 relative">
                  <div className="absolute inset-0 flex items-center justify-center z-10 backdrop-blur-[2px] bg-black/45 rounded-xl">
                    <span className="material-symbols-outlined text-primary text-xl">lock</span>
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant text-[32px] mb-2">
                    analytics
                  </span>
                  <p className="font-label-md text-sm text-on-surface font-semibold">Marketing</p>
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-widest mt-1">6 Modules</p>
                </div>
                
                <div className="glass-card p-stack-md p-6 rounded-xl glow-hover transition-all cursor-pointer text-center group opacity-50 relative">
                  <div className="absolute inset-0 flex items-center justify-center z-10 backdrop-blur-[2px] bg-black/45 rounded-xl">
                    <span className="material-symbols-outlined text-primary text-xl">lock</span>
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant text-[32px] mb-2">
                    database
                  </span>
                  <p className="font-label-md text-sm text-on-surface font-semibold">DevOps</p>
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-widest mt-1">15 Modules</p>
                </div>
              </div>
            </section>
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


      {/* Floating Action Button */}
      <button className="fixed bottom-gutter right-gutter bottom-8 right-8 w-14 h-14 bg-primary-container text-on-primary-container rounded-full shadow-lg shadow-primary/20 flex items-center justify-center z-[55] hover:scale-105 active:scale-95 transition-transform cursor-pointer text-white bg-brand">
        <span className="material-symbols-outlined text-[32px]">question_answer</span>
      </button>
    </div>
  );
}
