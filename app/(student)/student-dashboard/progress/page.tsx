"use client";

import { useState, useEffect } from "react";
import AppSidebar from "@/components/AppSidebar";
import { createClient } from "@/lib/supabase/client";

export default function StudentProgressPage() {
  const [activeFilter, setActiveFilter] = useState<"all" | "completed" | "pending">("all");
  const [initials, setInitials] = useState("ST");

  useEffect(() => {
    const loadUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const name = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "Student";
        setInitials(name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) || "ST");
      }
    };
    loadUser();
  }, []);

  const metrics = [
    { label: "Overall Progress", value: "68%", icon: "verified", color: "text-primary bg-primary/10" },
    { label: "Study Time", value: "124h", icon: "timer", color: "text-tertiary bg-tertiary/10" },
    { label: "Completed Lessons", value: "18 / 24", icon: "task_alt", color: "text-secondary bg-secondary-container/20" },
    { label: "Average Quiz Score", value: "91.2%", icon: "grade", color: "text-brand bg-primary/10" }
  ];

  const projects = [
    {
      id: "p1",
      title: "High-Performance TCP Router",
      desc: "Implement a low-latency packet router using vanilla Go/Node TCP sockets.",
      status: "completed",
      grade: "96% (Grade A)",
      date: "May 24, 2026"
    },
    {
      id: "p2",
      title: "In-Memory Redis Clone",
      desc: "Build a multi-threaded key-value store with TTL and basic publish-subscribe.",
      status: "in-progress",
      grade: "Pending review",
      date: "Started June 2, 2026"
    },
    {
      id: "p3",
      title: "Distributed Logging Daemon",
      desc: "Create a lightweight background agent that tails system files and streams logs over gRPC.",
      status: "pending",
      grade: "Locked",
      date: "Module 4 required"
    }
  ];

  const filteredProjects = projects.filter((project) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "completed") return project.status === "completed";
    return project.status !== "completed";
  });

  return (
    <div className="bg-background text-on-background font-body-md selection:bg-primary selection:text-on-primary min-h-screen overflow-x-hidden flex flex-col pb-16 md:pb-0">
      <div className="flex flex-grow">
        <AppSidebar role="student" />

        {/* Main Content Area */}
        <main className="flex-grow lg:ml-64 relative bg-background min-h-screen">
          {/* Header */}
          <header className="sticky top-0 w-full z-40 bg-surface/70 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex justify-between items-center">
            <div>
              <h2 className="font-syne text-xl font-bold text-on-surface">My Learning Progress</h2>
              <p className="text-xs text-on-surface-variant mt-1">Track your course completions and grades.</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-secondary-container overflow-hidden border border-primary/20 flex items-center justify-center font-bold text-on-secondary-container text-xs">
              {initials}
            </div>
          </header>

          <div className="p-6 max-w-[1280px] mx-auto space-y-6">
            {/* Metrics Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {metrics.map((m, idx) => (
                <div key={idx} className="glass-card rounded-xl p-4 inner-glow flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl ${m.color}`}>
                    <span className="material-symbols-outlined">{m.icon}</span>
                  </div>
                  <div>
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">{m.label}</p>
                    <p className="text-xl font-syne text-white font-bold leading-tight mt-1">{m.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Curriculum Modules Progress */}
            <section className="glass-card rounded-xl p-6 inner-glow">
              <h3 className="font-syne text-lg font-semibold mb-4 text-white">Module Progress Breakdown</h3>
              <div className="space-y-4">
                {[
                  { name: "Module 1: Foundations", desc: "Basic distributed architectures, scaling principles", progress: 100, color: "bg-primary" },
                  { name: "Module 2: Advanced Design", desc: "Database sharding, consistency strategies, routing algorithms", progress: 50, color: "bg-primary" },
                  { name: "Module 3: Security & Networking", desc: "gRPC architectures, zero-trust setups, TLS/security layers", progress: 0, color: "bg-surface-variant", locked: true }
                ].map((mod, idx) => (
                  <div key={idx} className={`space-y-2 p-4 rounded-lg border border-white/5 bg-surface-container-low/30 relative overflow-hidden ${mod.locked ? "opacity-60" : ""}`}>
                    {mod.locked && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 bg-black/40 border border-white/10 px-3 py-1 rounded-full text-xs font-bold text-tertiary">
                        <span className="material-symbols-outlined text-sm">lock</span> Locked
                      </div>
                    )}
                    <div className="flex justify-between items-center text-xs">
                      <div>
                        <p className="font-semibold text-white">{mod.name}</p>
                        <p className="text-on-surface-variant text-[11px] mt-0.5">{mod.desc}</p>
                      </div>
                      <span className="font-bold text-primary">{mod.progress}%</span>
                    </div>
                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                      <div className={`${mod.color} h-full transition-all duration-700`} style={{ width: `${mod.progress}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Projects & Deliverables */}
            <section className="glass-card rounded-xl p-6 inner-glow">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h3 className="font-syne text-lg font-semibold text-white">Project Deliverables</h3>
                <div className="flex bg-surface-container-low p-1 rounded-lg border border-white/5 text-xs">
                  {["all", "completed", "pending"].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setActiveFilter(filter as any)}
                      className={`px-3 py-1.5 rounded-md font-semibold transition-all capitalize cursor-pointer ${
                        activeFilter === filter
                          ? "bg-secondary-container text-on-secondary-container"
                          : "text-on-surface-variant hover:text-on-surface"
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                {filteredProjects.map((project) => (
                  <div key={project.id} className="p-4 rounded-lg border border-white/5 hover:border-primary/20 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-white text-sm">{project.title}</h4>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                          project.status === "completed"
                            ? "bg-primary/20 text-primary border border-primary/30"
                            : project.status === "in-progress"
                            ? "bg-tertiary/20 text-tertiary border border-tertiary/30 animate-pulse"
                            : "bg-white/5 text-on-surface-variant border border-white/10"
                        }`}>
                          {project.status.replace("-", " ")}
                        </span>
                      </div>
                      <p className="text-xs text-on-surface-variant leading-relaxed max-w-2xl">{project.desc}</p>
                    </div>
                    <div className="text-right text-xs shrink-0 self-end md:self-center">
                      <p className="font-bold text-white">{project.grade}</p>
                      <p className="text-[10px] text-on-surface-variant mt-0.5">{project.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
