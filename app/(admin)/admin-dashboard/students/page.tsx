"use client";

import { useState } from "react";
import AppSidebar from "@/components/AppSidebar";

type Status = "Active" | "Inactive" | "Pending";

interface Student {
  id: string;
  name: string;
  email: string;
  cohort: string;
  enrolled: string;
  progress: number;
  status: Status;
  avatar: string;
}

const studentsData: Student[] = [
  { id: "s1",  name: "Kwame Asante",    email: "kwame@khodz.academy",    cohort: "Cohort 04", enrolled: "Jan 2024", progress: 87, status: "Active",   avatar: "KA" },
  { id: "s2",  name: "Ama Owusu",       email: "ama@khodz.academy",       cohort: "Cohort 04", enrolled: "Jan 2024", progress: 62, status: "Active",   avatar: "AO" },
  { id: "s3",  name: "Kofi Mensah",     email: "kofi@khodz.academy",     cohort: "Cohort 03", enrolled: "Sep 2023", progress: 100, status: "Inactive", avatar: "KM" },
  { id: "s4",  name: "Abena Boateng",   email: "abena@khodz.academy",   cohort: "Cohort 04", enrolled: "Feb 2024", progress: 44, status: "Pending",  avatar: "AB" },
  { id: "s5",  name: "Yaw Darko",       email: "yaw@khodz.academy",       cohort: "Cohort 03", enrolled: "Oct 2023", progress: 78, status: "Active",   avatar: "YD" },
  { id: "s6",  name: "Efua Koomson",    email: "efua@khodz.academy",    cohort: "Cohort 04", enrolled: "Feb 2024", progress: 15, status: "Pending",  avatar: "EK" },
  { id: "s7",  name: "Nana Adjei",      email: "nana@khodz.academy",      cohort: "Cohort 04", enrolled: "Jan 2024", progress: 55, status: "Active",   avatar: "NA" },
  { id: "s8",  name: "Akosua Frimpong", email: "akosua@khodz.academy", cohort: "Cohort 03", enrolled: "Sep 2023", progress: 93, status: "Active",   avatar: "AF" },
];

const statusColors: Record<Status, string> = {
  Active:   "bg-primary/20 text-primary border-primary/30",
  Inactive: "bg-white/5 text-on-surface-variant border-white/10",
  Pending:  "bg-amber-500/20 text-amber-400 border-amber-500/30",
};

export default function AdminStudentsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | Status>("All");
  const [cohortFilter, setCohortFilter] = useState("All");

  const cohorts = ["All", ...Array.from(new Set(studentsData.map((s) => s.cohort)))];

  const filtered = studentsData.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || s.status === statusFilter;
    const matchCohort = cohortFilter === "All" || s.cohort === cohortFilter;
    return matchSearch && matchStatus && matchCohort;
  });

  const stats = [
    { label: "Total Students",  value: studentsData.length,                                        icon: "group" },
    { label: "Active",          value: studentsData.filter((s) => s.status === "Active").length,   icon: "check_circle" },
    { label: "Pending",         value: studentsData.filter((s) => s.status === "Pending").length,  icon: "pending" },
    { label: "Avg Progress",    value: `${Math.round(studentsData.reduce((a, s) => a + s.progress, 0) / studentsData.length)}%`, icon: "insights" },
  ];

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex">
      <AppSidebar role="admin" />

      <main className="flex-1 lg:ml-64 min-h-screen">
        {/* ─── Header ──────────────────────────────────────────────────────── */}
        <header className="sticky top-0 z-40 bg-surface/70 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="font-syne text-xl font-bold text-on-surface">Student Management</h2>
            <p className="text-xs text-on-surface-variant mt-1">Track enrolments, progress, and cohort assignments.</p>
          </div>
          <div className="flex gap-3 items-center">
            {/* Search */}
            <div className="relative hidden md:block">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search students…"
                className="bg-surface-container-low border border-white/10 rounded-full pl-9 pr-4 py-2 text-xs focus:ring-1 focus:ring-primary focus:border-primary transition-all w-52 outline-none"
              />
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[16px]">search</span>
            </div>
            <button className="bg-primary text-black font-bold text-xs px-4 py-2 rounded-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer">
              + Enrol Student
            </button>
          </div>
        </header>

        <div className="p-6 max-w-[1280px] mx-auto space-y-6">

          {/* ─── Stats ───────────────────────────────────────────────────────── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <div key={i} className="glass-card rounded-xl p-4 inner-glow flex items-center gap-3">
                <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-lg">{stat.icon}</span>
                </div>
                <div>
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">{stat.label}</p>
                  <p className="font-syne text-xl text-white font-bold leading-tight">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ─── Filters ─────────────────────────────────────────────────────── */}
          <div className="flex flex-wrap gap-3">
            {/* Cohort */}
            <div className="flex gap-2 flex-wrap">
              {cohorts.map((c) => (
                <button
                  key={c}
                  onClick={() => setCohortFilter(c)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border cursor-pointer ${
                    cohortFilter === c
                      ? "bg-secondary-container text-on-secondary-container border-primary"
                      : "bg-surface-container text-on-surface-variant border-white/10 hover:border-primary"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
            {/* Status */}
            <div className="flex gap-2 flex-wrap ml-auto">
              {(["All", "Active", "Pending", "Inactive"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border cursor-pointer ${
                    statusFilter === s
                      ? "bg-secondary-container text-on-secondary-container border-primary"
                      : "bg-surface-container text-on-surface-variant border-white/10 hover:border-primary"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* ─── Table ───────────────────────────────────────────────────────── */}
          <div className="glass-card rounded-xl overflow-hidden" id="students-table">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead className="bg-surface-container-high/50">
                  <tr className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
                    <th className="p-4">Student</th>
                    <th className="p-4">Cohort</th>
                    <th className="p-4">Enrolled</th>
                    <th className="p-4">Progress</th>
                    <th className="p-4 text-center">Status</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {filtered.map((student) => (
                    <tr key={student.id} className="hover:bg-white/5 transition-colors">
                      {/* Student */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-secondary-container flex items-center justify-center font-bold text-on-secondary-container text-xs flex-shrink-0">
                            {student.avatar}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-xs text-on-surface truncate">{student.name}</p>
                            <p className="text-[10px] text-on-surface-variant truncate">{student.email}</p>
                          </div>
                        </div>
                      </td>
                      {/* Cohort */}
                      <td className="p-4">
                        <span className="text-[10px] bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded font-bold uppercase">
                          {student.cohort}
                        </span>
                      </td>
                      {/* Enrolled */}
                      <td className="p-4 text-xs text-on-surface-variant">{student.enrolled}</td>
                      {/* Progress bar */}
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-surface-variant rounded-full overflow-hidden min-w-[80px]">
                            <div
                              className="h-full bg-primary rounded-full transition-all"
                              style={{ width: `${student.progress}%`, boxShadow: "0 0 8px #45ec9d" }}
                            />
                          </div>
                          <span className="text-[10px] font-bold text-on-surface w-8 text-right">{student.progress}%</span>
                        </div>
                      </td>
                      {/* Status */}
                      <td className="p-4 text-center">
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase border ${statusColors[student.status]}`}>
                          {student.status}
                        </span>
                      </td>
                      {/* Actions */}
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            className="p-1.5 hover:bg-surface-variant rounded text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                            title="View profile"
                          >
                            <span className="material-symbols-outlined text-base">person</span>
                          </button>
                          <button
                            className="p-1.5 hover:bg-surface-variant rounded text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                            title="Send message"
                          >
                            <span className="material-symbols-outlined text-base">mail</span>
                          </button>
                          <button
                            className="p-1.5 hover:bg-error/10 rounded text-on-surface-variant hover:text-error transition-colors cursor-pointer"
                            title="Remove student"
                          >
                            <span className="material-symbols-outlined text-base">person_remove</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filtered.length === 0 && (
              <div className="py-16 text-center text-on-surface-variant text-xs">
                <span className="material-symbols-outlined text-4xl block mb-2 opacity-30">manage_search</span>
                No students match your filters.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
