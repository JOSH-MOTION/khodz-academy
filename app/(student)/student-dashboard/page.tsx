"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AppSidebar from "@/components/AppSidebar";
import { createClient } from "@/lib/supabase/client";

export default function StudentDashboardPage() {
  const [warningDismissed, setWarningDismissed] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "dashboard" },
    { id: "courses", label: "My Courses", icon: "school" },
    { id: "slides", label: "Slides", icon: "present_to_all" },
    { id: "videos", label: "Videos", icon: "play_circle" },
    { id: "progress", label: "Progress", icon: "insights" },
    { id: "settings", label: "Settings", icon: "settings" },
  ];

  // Chart bar load animation helper
  const [animateChart, setAnimateChart] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setAnimateChart(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>("https://lh3.googleusercontent.com/aida-public/AB6AXuCXcZ0Y-k35tsaUPewSwh8RfmTddpo7nlyD1GZOHEi8WUuXSF5HqmklT4tkJieXXVFTmHt9AIizG5_biJQzl0MZ1kR693G50tC_qXtsLwd8bvnIHodQ32ccNCgtYIuGAjJbUapSEC3oLybUKIyXYey_SEcXm159Wl-2xEs5NUoDd1cZgdxNozNwmM-DPLNTwqwOqLCp3Msok09iItHHxPIa6V5JHhOwtAR0EZ3a182zZGP-yMNwWfbCbXyL6Zk4vzW_i4OgY_oDl7s");
  const [displayName, setDisplayName] = useState<string>("Student");

  useEffect(() => {
    const loadUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
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
          setProfile(profileData);
        }
      }
    };
    loadUser();
  }, []);

  const chartData = [
    { day: 1, height: "20%" },
    { day: 2, height: "35%" },
    { day: 3, height: "25%" },
    { day: 4, height: "45%" },
    { day: 5, height: "70%", active: true, tooltip: "4.2 hrs Today" },
    { day: 6, height: "40%" },
    { day: 7, height: "15%" },
    { day: 8, height: "60%" },
    { day: 9, height: "30%" },
    { day: 10, height: "50%" },
  ];

  return (
    <div className="bg-background text-on-background font-body-md selection:bg-primary selection:text-on-primary min-h-screen overflow-x-hidden flex flex-col pb-16 md:pb-0">
      {/* Top Warning Banner */}
      {!warningDismissed && (
        <div className="w-full bg-error-container text-on-error-container py-stack-sm px-gutter flex items-center justify-between sticky top-0 z-[60] border-b border-error/20 px-6 py-2 gap-4">
          <div className="flex items-center gap-stack-md gap-3">
            <span className="material-symbols-outlined text-[20px] text-error">warning</span>
            <p className="font-label-md text-sm">
              Pending balance detected. Complete your payment by Friday to maintain full access to advanced modules.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/payment/balance" className="bg-on-error-container text-error-container px-stack-md py-1 rounded-full font-label-md text-xs hover:opacity-90 transition-opacity cursor-pointer font-bold px-3 py-1 bg-white text-black text-center decoration-none">
              Pay Now
            </Link>
            <button
              onClick={() => setWarningDismissed(true)}
              className="material-symbols-outlined hover:text-white cursor-pointer text-sm"
            >
              close
            </button>
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
              <p className="font-body-sm text-xs text-on-surface-variant mt-1">Let's continue your mastery journey.</p>
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

      {/* Mobile Nav Bar */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-surface-container border-t border-white/10 py-stack-sm flex justify-around items-center z-[50] py-2">
        {menuItems.slice(0, 4).map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center cursor-pointer ${
              activeTab === item.id ? "text-primary" : "text-on-surface-variant"
            }`}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span className="text-[10px] font-bold mt-1">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Floating Action Button */}
      <button className="fixed bottom-gutter right-gutter bottom-8 right-8 w-14 h-14 bg-primary-container text-on-primary-container rounded-full shadow-lg shadow-primary/20 flex items-center justify-center z-[55] hover:scale-105 active:scale-95 transition-transform cursor-pointer text-white bg-brand">
        <span className="material-symbols-outlined text-[32px]">question_answer</span>
      </button>
    </div>
  );
}
