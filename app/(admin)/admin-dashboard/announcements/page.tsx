"use client";

import { useState, useEffect } from "react";
import AppSidebar from "@/components/AppSidebar";
import AdminPinGuard from "@/components/AdminPinGuard";
import { createClient } from "@/lib/supabase/client";

interface Announcement {
  id: string;
  courseId: string | null;
  courseTitle: string | null;
  title: string;
  body: string;
  createdAt: string;
}

interface Course {
  id: string;
  title: string;
}

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [messageBody, setMessageBody] = useState("");
  const [courseId, setCourseId] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/admin/announcements");
        const json = await res.json();
        setAnnouncements(json.announcements || []);
      } catch (err) {
        console.error("Failed to load announcements:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [refreshKey]);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("courses")
      .select("id, title")
      .order("title")
      .then(({ data }) => setCourses(data || []));
  }, []);

  async function handlePost(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !messageBody.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body: messageBody, courseId: courseId || null }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to post");
      setTitle("");
      setMessageBody("");
      setCourseId("");
      setShowForm(false);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to post");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this announcement? Students will no longer see it.")) return;
    try {
      const res = await fetch(`/api/admin/announcements?id=${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Delete failed");
      setRefreshKey((k) => k + 1);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    }
  }

  return (
    <AdminPinGuard>
      <div className="bg-background text-on-background font-body-md min-h-screen flex">
        <AppSidebar role="admin" />

        <main className="flex-1 lg:ml-64 min-h-screen">
          <header className="sticky top-0 z-40 bg-surface/70 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="font-syne text-xl font-bold text-on-surface">Announcements</h2>
              <p className="text-xs text-on-surface-variant mt-1">Broadcast a message to all students, or just one course.</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="bg-primary text-black font-bold text-xs px-4 py-2 rounded-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer"
            >
              + New Announcement
            </button>
          </header>

          <div className="p-6 max-w-[900px] mx-auto space-y-4">
            {loading ? (
              <div className="py-16 text-center">
                <span className="material-symbols-outlined text-primary text-3xl animate-spin">progress_activity</span>
              </div>
            ) : announcements.length === 0 ? (
              <div className="glass-card rounded-xl p-10 inner-glow text-center text-on-surface-variant text-xs">
                <span className="material-symbols-outlined text-4xl block mb-2 opacity-30">campaign</span>
                No announcements posted yet.
              </div>
            ) : (
              announcements.map((a) => (
                <div key={a.id} className="glass-card rounded-xl p-5 inner-glow">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-syne text-sm font-bold text-on-surface">{a.title}</h3>
                        <span className="text-[9px] bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full font-bold uppercase">
                          {a.courseTitle || "All Courses"}
                        </span>
                      </div>
                      <p className="text-xs text-on-surface-variant leading-relaxed whitespace-pre-wrap">{a.body}</p>
                      <p className="text-[10px] text-on-surface-variant mt-2">
                        {new Date(a.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(a.id)}
                      className="p-1.5 hover:bg-error/10 rounded text-on-surface-variant hover:text-error transition-colors cursor-pointer shrink-0"
                      title="Delete"
                    >
                      <span className="material-symbols-outlined text-base">delete</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>

        {showForm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="glass-card rounded-2xl w-full max-w-lg p-6 inner-glow border border-white/10 relative">
              <button
                onClick={() => setShowForm(false)}
                className="absolute top-4 right-4 text-on-surface-variant hover:text-white cursor-pointer material-symbols-outlined text-sm"
              >
                close
              </button>
              <h3 className="font-syne text-lg font-bold text-white mb-6">New Announcement</h3>

              <form onSubmit={handlePost} className="space-y-4 text-xs">
                <div className="space-y-2 flex flex-col">
                  <label className="text-on-surface-variant font-semibold">Audience</label>
                  <select
                    value={courseId}
                    onChange={(e) => setCourseId(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-white/10 rounded-lg p-3 outline-none focus:border-primary transition-all text-white"
                  >
                    <option value="">All Courses (everyone)</option>
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2 flex flex-col">
                  <label className="text-on-surface-variant font-semibold">Title</label>
                  <input
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Class rescheduled to Friday"
                    className="w-full bg-surface-container-lowest border border-white/10 rounded-lg p-3 outline-none focus:border-primary transition-all text-white"
                  />
                </div>
                <div className="space-y-2 flex flex-col">
                  <label className="text-on-surface-variant font-semibold">Message</label>
                  <textarea
                    required
                    value={messageBody}
                    onChange={(e) => setMessageBody(e.target.value)}
                    rows={4}
                    placeholder="Write your announcement..."
                    className="w-full bg-surface-container-lowest border border-white/10 rounded-lg p-3 outline-none focus:border-primary transition-all text-white resize-none"
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 bg-surface-container-high border border-white/10 text-on-surface py-3 rounded-lg font-bold hover:bg-surface-variant transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-primary text-background py-3 rounded-lg font-bold hover:brightness-110 transition-all text-black cursor-pointer disabled:opacity-60"
                  >
                    {saving ? "Posting…" : "Post Announcement"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminPinGuard>
  );
}
