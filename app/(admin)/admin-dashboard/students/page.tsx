"use client";

import { useState } from "react";
import AppSidebar from "@/components/AppSidebar";

type Status = "Active" | "Inactive" | "Pending";

interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  cohort: string;
  enrolled: string;
  progress: number;
  status: Status;
  avatar: string;
}

const studentsData: Student[] = [
  { id: "s1",  name: "Kwame Asante",    email: "kwame@khodz.academy",    phone: "233240000001", cohort: "Cohort 04", enrolled: "Jan 2024", progress: 87, status: "Active",   avatar: "KA" },
  { id: "s2",  name: "Ama Owusu",       email: "ama@khodz.academy",       phone: "233240000002", cohort: "Cohort 04", enrolled: "Jan 2024", progress: 62, status: "Active",   avatar: "AO" },
  { id: "s3",  name: "Kofi Mensah",     email: "kofi@khodz.academy",     phone: "233240000003", cohort: "Cohort 03", enrolled: "Sep 2023", progress: 100, status: "Inactive", avatar: "KM" },
  { id: "s4",  name: "Abena Boateng",   email: "abena@khodz.academy",   phone: "233240000004", cohort: "Cohort 04", enrolled: "Feb 2024", progress: 44, status: "Pending",  avatar: "AB" },
  { id: "s5",  name: "Yaw Darko",       email: "yaw@khodz.academy",       phone: "233240000005", cohort: "Cohort 03", enrolled: "Oct 2023", progress: 78, status: "Active",   avatar: "YD" },
  { id: "s6",  name: "Efua Koomson",    email: "efua@khodz.academy",    phone: "233240000006", cohort: "Cohort 04", enrolled: "Feb 2024", progress: 15, status: "Pending",  avatar: "EK" },
  { id: "s7",  name: "Nana Adjei",      email: "nana@khodz.academy",      phone: "233240000007", cohort: "Cohort 04", enrolled: "Jan 2024", progress: 55, status: "Active",   avatar: "NA" },
  { id: "s8",  name: "Akosua Frimpong", email: "akosua@khodz.academy", phone: "233240000008", cohort: "Cohort 03", enrolled: "Sep 2023", progress: 93, status: "Active",   avatar: "AF" },
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
                            <p className="text-[10px] text-on-surface-variant truncate">{student.email} • {student.phone}</p>
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
                          <a
                            href={`https://wa.me/${student.phone}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 hover:bg-surface-variant rounded text-on-surface-variant hover:text-[#25D366] transition-colors flex items-center justify-center cursor-pointer"
                            title="Chat on WhatsApp"
                          >
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.665.989 3.3.15 5.336.15 5.548 0 10.061-4.512 10.064-10.064.002-2.69-1.042-5.219-2.937-7.117-1.894-1.897-4.417-2.942-7.106-2.943-5.556 0-10.068 4.513-10.072 10.067-.001 2.01.523 3.974 1.517 5.717L2.148 21.83l6.5-.676zM17.7 14.542c-.31-.156-1.838-.907-2.122-1.01-.284-.103-.49-.156-.696.156-.206.31-.798 1.01-.978 1.216-.18.206-.36.232-.67.077-.31-.156-1.31-.483-2.496-1.542-.924-.824-1.547-1.842-1.728-2.152-.18-.31-.02-.477.135-.632.14-.139.31-.36.465-.54.155-.18.206-.31.31-.516.103-.207.05-.387-.025-.542-.077-.156-.696-1.678-.954-2.298-.25-.602-.503-.52-.69-.53l-.587-.01c-.206 0-.54.077-.824.387-.284.31-1.082 1.057-1.082 2.578 0 1.52 1.108 2.99 1.263 3.196.155.206 2.18 3.327 5.28 4.664.737.318 1.312.507 1.76.65.74.235 1.414.201 1.947.122.593-.087 1.838-.75 2.096-1.472.258-.722.258-1.342.18-1.472-.078-.13-.284-.207-.593-.363z"/>
                            </svg>
                          </a>
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
