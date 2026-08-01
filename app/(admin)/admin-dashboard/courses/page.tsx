"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AppSidebar from "@/components/AppSidebar";
import AdminPinGuard from "@/components/AdminPinGuard";
import { createClient } from "@/lib/supabase/client";
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

interface Lesson {
  id: string;
  title: string;
  video_url: string | null;
  slides_url: string | null;
  assignment_title: string | null;
  assignment_description: string | null;
  assignment_due_at: string | null;
  order_in_week: number;
}

interface WeekWithLessons {
  id: string;
  week_number: number;
  title: string;
  lessons: Lesson[];
}

interface LessonEditState {
  video: string;
  slides: string;
  assignmentTitle: string;
  assignmentDescription: string;
  assignmentDueAt: string;
}

export default function AdminCoursesPage() {
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [courses, setCourses] = useState(initialCoursesData);
  
  // Modal states
  const [selectedCourse, setSelectedCourse] = useState<{ id: string; title: string } | null>(null);
  const [weeks, setWeeks] = useState<WeekWithLessons[]>([]);
  const [loadingWeeks, setLoadingWeeks] = useState(false);
  const [savingLessonId, setSavingLessonId] = useState<string | null>(null);
  const [editUrls, setEditUrls] = useState<Record<string, LessonEditState>>({});

  // Course settings modal state
  const [settingsCourse, setSettingsCourse] = useState<{ id: string; title: string } | null>(null);
  const [loadingSettings, setLoadingSettings] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [endDate, setEndDate] = useState("");
  const [depositPercent, setDepositPercent] = useState(50);
  const [reminderLeadDays, setReminderLeadDays] = useState(21);
  const [admissionGhs, setAdmissionGhs] = useState("");
  const [tuitionGhs, setTuitionGhs] = useState("");
  const [promoPriceGhs, setPromoPriceGhs] = useState("");

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

  // Fetch weeks and lessons for course
  const openMaterialsModal = async (courseId: string, courseTitle: string) => {
    setSelectedCourse({ id: courseId, title: courseTitle });
    setLoadingWeeks(true);
    setWeeks([]);
    
    try {
      const supabase = createClient();
      
      // Fetch weeks ordered by number
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

      // Type assert and sort lessons
      const typedWeeks = (weeksData || []).map((w: any) => {
        const sortedLessons = (w.lessons || []).sort((a: any, b: any) => a.order_in_week - b.order_in_week);
        return {
          id: w.id,
          week_number: w.week_number,
          title: w.title,
          lessons: sortedLessons
        };
      }) as WeekWithLessons[];

      setWeeks(typedWeeks);

      // Initialize form state
      const initialUrls: Record<string, LessonEditState> = {};
      typedWeeks.forEach(w => {
        w.lessons.forEach(l => {
          initialUrls[l.id] = {
            video: l.video_url || "",
            slides: l.slides_url || "",
            assignmentTitle: l.assignment_title || "",
            assignmentDescription: l.assignment_description || "",
            assignmentDueAt: l.assignment_due_at ? l.assignment_due_at.slice(0, 10) : "",
          };
        });
      });
      setEditUrls(initialUrls);

    } catch (err) {
      console.error("Failed to load lessons:", err);
      alert("Error loading syllabus from database. Please check your Supabase schema setup.");
    } finally {
      setLoadingWeeks(false);
    }
  };

  // Save lesson URLs + assignment via the admin API (service role — lessons
  // has no client-side UPDATE policy, so a direct Supabase client call here
  // would always fail silently against RLS).
  const saveUrls = async (lessonId: string) => {
    setSavingLessonId(lessonId);
    try {
      const urls = editUrls[lessonId] || {
        video: "", slides: "", assignmentTitle: "", assignmentDescription: "", assignmentDueAt: "",
      };

      const res = await fetch(`/api/admin/lessons/${lessonId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          video_url: urls.video || null,
          slides_url: urls.slides || null,
          assignment_title: urls.assignmentTitle || null,
          assignment_description: urls.assignmentDescription || null,
          assignment_due_at: urls.assignmentDueAt ? new Date(urls.assignmentDueAt).toISOString() : null,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Save failed");

      // Update local weeks state
      setWeeks(prev => prev.map(w => ({
        ...w,
        lessons: w.lessons.map(l => l.id === lessonId ? {
          ...l,
          video_url: urls.video || null,
          slides_url: urls.slides || null,
          assignment_title: urls.assignmentTitle || null,
          assignment_description: urls.assignmentDescription || null,
          assignment_due_at: urls.assignmentDueAt ? new Date(urls.assignmentDueAt).toISOString() : null,
        } : l)
      })));

      alert("Lesson materials successfully updated!");
    } catch (err) {
      console.error("Failed to update lesson:", err);
      alert("Save failed: " + (err instanceof Error ? err.message : "Unknown error"));
    } finally {
      setSavingLessonId(null);
    }
  };

  // Fetch a course's scheduling/deposit settings from the database
  const openSettingsModal = async (courseId: string, courseTitle: string) => {
    setSettingsCourse({ id: courseId, title: courseTitle });
    setLoadingSettings(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("courses")
        .select("end_date, deposit_percent, reminder_lead_days, admission_ghs, tuition_ghs, promo_price_ghs")
        .eq("id", courseId)
        .maybeSingle();
      if (error) throw error;
      setEndDate(data?.end_date || "");
      setDepositPercent(data?.deposit_percent ?? 50);
      setReminderLeadDays(data?.reminder_lead_days ?? 21);
      setAdmissionGhs(data?.admission_ghs != null ? String(data.admission_ghs) : "");
      setTuitionGhs(data?.tuition_ghs != null ? String(data.tuition_ghs) : "");
      setPromoPriceGhs(data?.promo_price_ghs != null ? String(data.promo_price_ghs) : "");
    } catch (err) {
      console.error("Failed to load course settings:", err);
      alert("Error loading course settings.");
    } finally {
      setLoadingSettings(false);
    }
  };

  const saveSettings = async () => {
    if (!settingsCourse) return;
    setSavingSettings(true);
    try {
      const res = await fetch(`/api/admin/courses/${settingsCourse.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          endDate: endDate || null,
          depositPercent,
          reminderLeadDays,
          admissionGhs: admissionGhs === "" ? "" : Number(admissionGhs),
          tuitionGhs: tuitionGhs === "" ? "" : Number(tuitionGhs),
          promoPriceGhs: promoPriceGhs === "" ? "" : Number(promoPriceGhs),
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Save failed");
      alert("Course settings updated!");
      setSettingsCourse(null);
    } catch (err) {
      alert("Save failed: " + (err instanceof Error ? err.message : "Unknown error"));
    } finally {
      setSavingSettings(false);
    }
  };

  return (
    <AdminPinGuard>
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
                      {/* Status */}
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
                          <button
                            onClick={() => openMaterialsModal(course.id, course.title)}
                            className="p-1.5 hover:bg-primary/20 rounded text-primary border border-primary/20 hover:border-primary transition-all cursor-pointer flex items-center gap-1 text-[11px] font-bold"
                            title="Manage Lesson Materials"
                          >
                            <span className="material-symbols-outlined text-xs">folder_open</span>
                            Links
                          </button>
                          <button
                            onClick={() => openSettingsModal(course.id, course.title)}
                            className="p-1.5 hover:bg-primary/20 rounded text-primary border border-primary/20 hover:border-primary transition-all cursor-pointer flex items-center gap-1 text-[11px] font-bold"
                            title="Pricing, Deposit & Deadline Settings"
                          >
                            <span className="material-symbols-outlined text-xs">payments</span>
                            Pricing
                          </button>
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

      {/* Course Materials / Syllabus Links Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container border border-white/10 rounded-xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-surface-container-highest">
              <div>
                <h3 className="font-syne text-md font-bold text-primary">Manage Links: {selectedCourse.title}</h3>
                <p className="text-[10px] text-on-surface-variant mt-1">
                  Paste Google Drive view/preview links below. Make sure sharing is set to &apos;Anyone with the link can view&apos;.
                </p>
              </div>
              <button
                onClick={() => setSelectedCourse(null)}
                className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {loadingWeeks ? (
                <div className="py-12 flex flex-col items-center justify-center gap-3">
                  <span className="material-symbols-outlined text-primary text-3xl animate-spin">progress_activity</span>
                  <span className="text-xs text-on-surface-variant">Loading syllabus from Supabase...</span>
                </div>
              ) : weeks.length === 0 ? (
                <div className="py-12 text-center text-on-surface-variant text-xs">
                  <span className="material-symbols-outlined text-3xl block mb-2 opacity-30">info</span>
                  No weeks or lessons defined for this course in database yet.
                </div>
              ) : (
                weeks.map((week) => (
                  <div key={week.id} className="border border-white/5 bg-background/25 rounded-lg p-4 space-y-4">
                    <h4 className="text-xs font-bold text-on-surface uppercase tracking-wider">
                      Week {week.week_number}: {week.title || `Module ${week.week_number}`}
                    </h4>
                    
                    <div className="space-y-4">
                      {week.lessons.map((lesson) => (
                        <div key={lesson.id} className="bg-surface-container-low p-4 rounded-lg border border-white/5 space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-white">{lesson.title}</span>
                            <button
                              onClick={() => saveUrls(lesson.id)}
                              disabled={savingLessonId === lesson.id}
                              className="bg-primary/20 text-primary border border-primary/30 hover:bg-primary hover:text-black font-bold text-[10px] px-3 py-1 rounded transition-all cursor-pointer disabled:opacity-50"
                            >
                              {savingLessonId === lesson.id ? "Saving..." : "Save Links"}
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Video input */}
                            <div className="space-y-1">
                              <label className="text-[10px] text-on-surface-variant font-bold uppercase">Google Drive Video URL</label>
                              <div className="flex items-center bg-background border border-white/10 rounded px-2.5 py-1.5 focus-within:border-primary">
                                <span className="material-symbols-outlined text-on-surface-variant text-sm mr-2">play_circle</span>
                                <input
                                  type="text"
                                  value={editUrls[lesson.id]?.video || ""}
                                  onChange={(e) => setEditUrls({
                                    ...editUrls,
                                    [lesson.id]: {
                                      ...editUrls[lesson.id],
                                      video: e.target.value
                                    }
                                  })}
                                  placeholder="https://drive.google.com/file/d/.../preview"
                                  className="bg-transparent border-none text-xs w-full text-on-surface outline-none focus:ring-0"
                                />
                              </div>
                            </div>

                            {/* Slides input */}
                            <div className="space-y-1">
                              <label className="text-[10px] text-on-surface-variant font-bold uppercase">Google Drive Slides/PDF URL</label>
                              <div className="flex items-center bg-background border border-white/10 rounded px-2.5 py-1.5 focus-within:border-primary">
                                <span className="material-symbols-outlined text-on-surface-variant text-sm mr-2">description</span>
                                <input
                                  type="text"
                                  value={editUrls[lesson.id]?.slides || ""}
                                  onChange={(e) => setEditUrls({
                                    ...editUrls,
                                    [lesson.id]: {
                                      ...editUrls[lesson.id],
                                      slides: e.target.value
                                    }
                                  })}
                                  placeholder="https://drive.google.com/file/d/.../preview"
                                  className="bg-transparent border-none text-xs w-full text-on-surface outline-none focus:ring-0"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Assignment fields */}
                          <div className="border-t border-white/5 pt-3 space-y-3">
                            <label className="text-[10px] text-primary font-bold uppercase flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-xs">assignment</span>
                              Assignment (optional)
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <label className="text-[10px] text-on-surface-variant font-bold uppercase">Title</label>
                                <input
                                  type="text"
                                  value={editUrls[lesson.id]?.assignmentTitle || ""}
                                  onChange={(e) => setEditUrls({
                                    ...editUrls,
                                    [lesson.id]: { ...editUrls[lesson.id], assignmentTitle: e.target.value }
                                  })}
                                  placeholder="e.g. Build a Counter App"
                                  className="bg-background border border-white/10 rounded px-2.5 py-1.5 text-xs w-full text-on-surface outline-none focus:border-primary focus:ring-0"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] text-on-surface-variant font-bold uppercase">Due Date</label>
                                <input
                                  type="date"
                                  value={editUrls[lesson.id]?.assignmentDueAt || ""}
                                  onChange={(e) => setEditUrls({
                                    ...editUrls,
                                    [lesson.id]: { ...editUrls[lesson.id], assignmentDueAt: e.target.value }
                                  })}
                                  className="bg-background border border-white/10 rounded px-2.5 py-1.5 text-xs w-full text-on-surface outline-none focus:border-primary focus:ring-0"
                                />
                              </div>
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] text-on-surface-variant font-bold uppercase">Description / Instructions</label>
                              <textarea
                                value={editUrls[lesson.id]?.assignmentDescription || ""}
                                onChange={(e) => setEditUrls({
                                  ...editUrls,
                                  [lesson.id]: { ...editUrls[lesson.id], assignmentDescription: e.target.value }
                                })}
                                placeholder="What should the student build/submit? Paste a link to your GitHub repo or deployed site when done."
                                rows={2}
                                className="bg-background border border-white/10 rounded px-2.5 py-1.5 text-xs w-full text-on-surface outline-none focus:border-primary focus:ring-0 resize-none"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-surface-container-highest border-t border-white/10 flex justify-end">
              <button
                onClick={() => setSelectedCourse(null)}
                className="bg-white/10 text-white font-bold text-xs px-4 py-2 rounded-lg hover:bg-white/20 transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Course Settings Modal */}
      {settingsCourse && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container border border-white/10 rounded-xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-surface-container-highest">
              <div>
                <h3 className="font-syne text-md font-bold text-primary">Pricing & Deadlines: {settingsCourse.title}</h3>
                <p className="text-[10px] text-on-surface-variant mt-1">
                  Controls admission fee, tuition, promo price, deposit, and when unpaid students get reminded before losing access.
                </p>
              </div>
              <button
                onClick={() => setSettingsCourse(null)}
                className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-6 space-y-5">
              {loadingSettings ? (
                <div className="py-8 flex justify-center">
                  <span className="material-symbols-outlined text-primary text-3xl animate-spin">progress_activity</span>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-on-surface-variant font-bold uppercase">Admission Fee (GHS)</label>
                      <input
                        type="number"
                        min={0}
                        value={admissionGhs}
                        onChange={(e) => setAdmissionGhs(e.target.value)}
                        placeholder="e.g. 200"
                        className="w-full bg-background border border-white/10 rounded px-3 py-2 text-xs text-on-surface outline-none focus:border-primary"
                      />
                      <p className="text-[9px] text-on-surface-variant">Non-refundable. Paid to secure a seat before class starts.</p>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-on-surface-variant font-bold uppercase">Tuition Fee (GHS)</label>
                      <input
                        type="number"
                        min={0}
                        value={tuitionGhs}
                        onChange={(e) => setTuitionGhs(e.target.value)}
                        placeholder="e.g. 1500"
                        className="w-full bg-background border border-white/10 rounded px-3 py-2 text-xs text-on-surface outline-none focus:border-primary"
                      />
                      <p className="text-[9px] text-on-surface-variant">Full course tuition, paid as deposit + balance.</p>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-on-surface-variant font-bold uppercase">Promo Price (GHS) — optional</label>
                    <input
                      type="number"
                      min={0}
                      value={promoPriceGhs}
                      onChange={(e) => setPromoPriceGhs(e.target.value)}
                      placeholder="Leave blank for no promo"
                      className="w-full bg-background border border-white/10 rounded px-3 py-2 text-xs text-on-surface outline-none focus:border-primary"
                    />
                    <p className="text-[9px] text-on-surface-variant">
                      When set, shown as a discounted all-in price (admission + tuition) on the course page and used for one-time full-payment checkout.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-on-surface-variant font-bold uppercase">Cohort End Date</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full bg-background border border-white/10 rounded px-3 py-2 text-xs text-on-surface outline-none focus:border-primary"
                    />
                    <p className="text-[9px] text-on-surface-variant">When the current cohort finishes. Used to calculate the payment deadline below.</p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-on-surface-variant font-bold uppercase">Deposit Percentage of Tuition</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={1}
                        max={100}
                        value={depositPercent}
                        onChange={(e) => setDepositPercent(Number(e.target.value))}
                        className="w-24 bg-background border border-white/10 rounded px-3 py-2 text-xs text-on-surface outline-none focus:border-primary"
                      />
                      <span className="text-xs text-on-surface-variant">%</span>
                    </div>
                    <p className="text-[9px] text-on-surface-variant">e.g. 50 means students pay half the tuition upfront to unlock content.</p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-on-surface-variant font-bold uppercase">Reminder Lead Time (days before cohort ends)</label>
                    <input
                      type="number"
                      min={1}
                      value={reminderLeadDays}
                      onChange={(e) => setReminderLeadDays(Number(e.target.value))}
                      className="w-24 bg-background border border-white/10 rounded px-3 py-2 text-xs text-on-surface outline-none focus:border-primary"
                    />
                    <p className="text-[9px] text-on-surface-variant">
                      e.g. 21 = balance is due 3 weeks before the cohort ends; 7 = due 1 week before (good for shorter, 1-month courses).
                      Deposited students get an email + in-app reminder as this date approaches, and lose slide/video access if it passes unpaid.
                    </p>
                  </div>
                </>
              )}
            </div>

            <div className="p-4 bg-surface-container-highest border-t border-white/10 flex justify-end gap-3">
              <button
                onClick={() => setSettingsCourse(null)}
                className="bg-white/10 text-white font-bold text-xs px-4 py-2 rounded-lg hover:bg-white/20 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={saveSettings}
                disabled={savingSettings || loadingSettings}
                className="bg-primary text-black font-bold text-xs px-4 py-2 rounded-lg hover:brightness-110 transition-all cursor-pointer disabled:opacity-50"
              >
                {savingSettings ? "Saving…" : "Save Settings"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </AdminPinGuard>
  );
}
