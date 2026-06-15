"use client";

import { useState } from "react";
import Link from "next/link";
import AppSidebar from "@/components/AppSidebar";
import { COURSES } from "@/lib/courses-data";

const initialCoursesData = COURSES.map(course => ({
  id: course.id,
  title: course.title,
  category: course.category,
  enrolled: course.enrolledCount,
  sessions: parseInt(course.sessionsCount) || 0,
  status: "Active" as "Active" | "Draft",
  img: course.img,
}));

export default function AdminCoursesPage() {
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [courses, setCourses] = useState(initialCoursesData);

  const filtered = courses.filter((c) => {
    const matchCat = filter === "All" || c.category === filter;
    const matchSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const toggleStatus = (id: string) => {
    setCourses((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, status: c.status === "Active" ? "Draft" : "Active" }
          : c
      )
    );
  };

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex">
      <AppSidebar role="admin" />

      <main className="flex-1 lg:ml-64 min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-surface/70 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="font-syne text-xl font-bold text-on-surface">Course Management</h2>
            <p className="text-xs text-on-surface-variant mt-1">
              Publish, draft, and monitor all active programmes.
            </p>
          </div>
          <div className="flex gap-3 items-center">
            {/* Search */}
            <div className="relative hidden md:block">
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search courses..."
                className="bg-surface-container-low border border-white/10 rounded-full pl-9 pr-4 py-2 text-xs focus:ring-1 focus:ring-primary focus:border-primary transition-all w-52 outline-none"
              />
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[16px]">
                search
              </span>
            </div>
            <button className="bg-primary text-black font-bold text-xs px-4 py-2 rounded-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer">
              + Add Course
            </button>
          </div>
        </header>

        <div className="p-6 max-w-[1280px] mx-auto space-y-6">
          {/* Category filters */}
          <div className="flex flex-wrap gap-2">
            {["All", "Beginner", "Design", "AI", "Full Stack"].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border cursor-pointer ${
                  filter === cat
                    ? "bg-secondary-container text-on-secondary-container border-primary"
                    : "bg-surface-container text-on-surface-variant border-white/10 hover:border-primary"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Courses table */}
          <div className="glass-card rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[640px]">
                <thead className="bg-surface-container-high/50">
                  <tr className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
                    <th className="p-4">Course</th>
                    <th className="p-4">Category</th>
                    <th className="p-4 text-center">Enrolled</th>
                    <th className="p-4 text-center">Sessions</th>
                    <th className="p-4 text-center">Status</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {filtered.map((course) => (
                    <tr key={course.id} className="hover:bg-white/5 transition-colors">
                      {/* Course */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-10 rounded overflow-hidden flex-shrink-0 border border-white/10">
                            <img
                              src={course.img}
                              alt={course.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <p className="font-semibold text-xs text-on-surface leading-tight max-w-[220px]">
                            {course.title}
                          </p>
                        </div>
                      </td>
                      {/* Category */}
                      <td className="p-4">
                        <span className="text-[10px] bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded font-bold uppercase">
                          {course.category}
                        </span>
                      </td>
                      {/* Enrolled */}
                      <td className="p-4 text-center">
                        <span className="text-xs font-bold text-on-surface">{course.enrolled.toLocaleString()}</span>
                      </td>
                      {/* Sessions */}
                      <td className="p-4 text-center">
                        <span className="text-xs text-on-surface-variant">{course.sessions}</span>
                      </td>
                      {/* Status toggle */}
                      <td className="p-4 text-center">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase border ${
                            course.status === "Active"
                              ? "bg-primary/20 text-primary border-primary/30"
                              : "bg-white/5 text-on-surface-variant border-white/10"
                          }`}
                        >
                          {course.status}
                        </span>
                      </td>
                      {/* Actions */}
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <Link
                            href={`/courses/${course.id}`}
                            className="p-1.5 hover:bg-surface-variant rounded text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                            title="View public page"
                          >
                            <span className="material-symbols-outlined text-base">open_in_new</span>
                          </Link>
                          <button
                            onClick={() => toggleStatus(course.id)}
                            className="p-1.5 hover:bg-surface-variant rounded text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                            title={course.status === "Active" ? "Set to Draft" : "Publish"}
                          >
                            <span className="material-symbols-outlined text-base">
                              {course.status === "Active" ? "pause_circle" : "play_circle"}
                            </span>
                          </button>
                          <button
                            className="p-1.5 hover:bg-error/10 rounded text-on-surface-variant hover:text-error transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <span className="material-symbols-outlined text-base">delete</span>
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
                <span className="material-symbols-outlined text-4xl block mb-2 opacity-30">search_off</span>
                No courses match your search.
              </div>
            )}
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total Courses", value: courses.length, icon: "school" },
              { label: "Active", value: courses.filter((c) => c.status === "Active").length, icon: "play_circle" },
              { label: "Total Enrolled", value: courses.reduce((s, c) => s + c.enrolled, 0).toLocaleString(), icon: "group" },
              { label: "Total Sessions", value: courses.reduce((s, c) => s + c.sessions, 0), icon: "video_library" },
            ].map((stat, i) => (
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
        </div>
      </main>
    </div>
  );
}
