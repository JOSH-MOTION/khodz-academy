"use client";

import { useState, useEffect } from "react";
import AppSidebar from "@/components/AppSidebar";
import AdminPinGuard from "@/components/AdminPinGuard";

type Status = "submitted" | "pass" | "needs_revision";

interface Submission {
  id: string;
  lessonId: string;
  lessonTitle: string;
  assignmentTitle: string | null;
  studentId: string;
  studentName: string;
  studentEmail: string | null;
  submissionUrl: string;
  status: Status;
  feedback: string | null;
  submittedAt: string;
  gradedAt: string | null;
}

const STATUS_LABEL: Record<Status, string> = {
  submitted: "Awaiting Review",
  pass: "Pass",
  needs_revision: "Needs Revision",
};

const STATUS_COLOR: Record<Status, string> = {
  submitted: "bg-tertiary/20 text-tertiary border-tertiary/30",
  pass: "bg-primary/20 text-primary border-primary/30",
  needs_revision: "bg-error/20 text-error border-error/30",
};

export default function AdminAssignmentsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [statusFilter, setStatusFilter] = useState<"All" | Status>("All");
  const [search, setSearch] = useState("");

  const [grading, setGrading] = useState<Submission | null>(null);
  const [formStatus, setFormStatus] = useState<Status>("pass");
  const [formFeedback, setFormFeedback] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/admin/submissions");
        const json = await res.json();
        setSubmissions(json.submissions || []);
      } catch (err) {
        console.error("Failed to load submissions:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [refreshKey]);

  const filtered = submissions.filter((s) => {
    const matchStatus = statusFilter === "All" || s.status === statusFilter;
    const matchSearch =
      s.studentName.toLowerCase().includes(search.toLowerCase()) ||
      (s.assignmentTitle || s.lessonTitle).toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const stats = [
    { label: "Total Submissions", value: submissions.length, icon: "assignment_turned_in" },
    { label: "Awaiting Review", value: submissions.filter((s) => s.status === "submitted").length, icon: "pending" },
    { label: "Passed", value: submissions.filter((s) => s.status === "pass").length, icon: "check_circle" },
    { label: "Needs Revision", value: submissions.filter((s) => s.status === "needs_revision").length, icon: "error" },
  ];

  function openGrade(s: Submission) {
    setGrading(s);
    setFormStatus(s.status === "submitted" ? "pass" : s.status);
    setFormFeedback(s.feedback || "");
  }

  async function saveGrade() {
    if (!grading) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ submissionId: grading.id, status: formStatus, feedback: formFeedback }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Save failed");
      setGrading(null);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminPinGuard>
      <div className="bg-background text-on-background font-body-md min-h-screen flex">
        <AppSidebar role="admin" />

        <main className="flex-1 lg:ml-64 min-h-screen">
          <header className="sticky top-0 z-40 bg-surface/70 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="font-syne text-xl font-bold text-on-surface">Assignments</h2>
              <p className="text-xs text-on-surface-variant mt-1">Review and grade student submissions.</p>
            </div>
            <div className="relative hidden md:block">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search student or assignment…"
                className="bg-surface-container-low border border-white/10 rounded-full pl-9 pr-4 py-2 text-xs focus:ring-1 focus:ring-primary focus:border-primary transition-all w-64 outline-none"
              />
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[16px]">search</span>
            </div>
          </header>

          <div className="p-6 max-w-[1280px] mx-auto space-y-6">
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

            <div className="flex gap-2 flex-wrap">
              {(["All", "submitted", "pass", "needs_revision"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border cursor-pointer ${
                    statusFilter === s
                      ? "bg-secondary-container text-on-secondary-container border-primary"
                      : "bg-surface-container text-on-surface-variant border-white/10 hover:border-primary"
                  }`}
                >
                  {s === "All" ? "All" : STATUS_LABEL[s]}
                </button>
              ))}
            </div>

            <div className="glass-card rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[760px]">
                  <thead className="bg-surface-container-high/50">
                    <tr className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
                      <th className="p-4">Student</th>
                      <th className="p-4">Assignment</th>
                      <th className="p-4">Submission</th>
                      <th className="p-4 text-center">Status</th>
                      <th className="p-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-sm">
                    {filtered.map((s) => (
                      <tr key={s.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4">
                          <p className="font-semibold text-xs text-on-surface">{s.studentName}</p>
                          <p className="text-[10px] text-on-surface-variant">{s.studentEmail}</p>
                        </td>
                        <td className="p-4">
                          <p className="text-xs text-on-surface">{s.assignmentTitle || s.lessonTitle}</p>
                          <p className="text-[10px] text-on-surface-variant">
                            Submitted {new Date(s.submittedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </p>
                        </td>
                        <td className="p-4">
                          <a
                            href={s.submissionUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary text-xs underline hover:no-underline break-all"
                          >
                            {s.submissionUrl}
                          </a>
                        </td>
                        <td className="p-4 text-center">
                          <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase border ${STATUS_COLOR[s.status]}`}>
                            {STATUS_LABEL[s.status]}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => openGrade(s)}
                            className="bg-primary/10 text-primary border border-primary/30 px-3 py-1.5 rounded text-[10px] font-bold hover:bg-primary hover:text-black transition-all cursor-pointer"
                          >
                            Grade
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {!loading && filtered.length === 0 && (
                <div className="py-16 text-center text-on-surface-variant text-xs">
                  <span className="material-symbols-outlined text-4xl block mb-2 opacity-30">assignment_turned_in</span>
                  {submissions.length === 0 ? "No assignments have been submitted yet." : "No submissions match your filters."}
                </div>
              )}
              {loading && (
                <div className="py-16 text-center">
                  <span className="material-symbols-outlined text-primary text-3xl animate-spin">progress_activity</span>
                </div>
              )}
            </div>
          </div>
        </main>

        {grading && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="glass-card rounded-2xl w-full max-w-md p-6 inner-glow border border-white/10 relative">
              <button
                onClick={() => setGrading(null)}
                className="absolute top-4 right-4 text-on-surface-variant hover:text-white cursor-pointer material-symbols-outlined text-sm"
              >
                close
              </button>
              <h3 className="font-syne text-lg font-bold text-white mb-1">Grade Submission</h3>
              <p className="text-xs text-on-surface-variant mb-6">
                {grading.studentName} · {grading.assignmentTitle || grading.lessonTitle}
              </p>

              <div className="space-y-4 text-xs">
                <a
                  href={grading.submissionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-surface-container-lowest border border-white/10 rounded-lg p-3 text-primary underline hover:no-underline break-all"
                >
                  <span className="material-symbols-outlined text-base shrink-0">open_in_new</span>
                  {grading.submissionUrl}
                </a>

                <div className="space-y-2 flex flex-col">
                  <label className="text-on-surface-variant font-semibold">Result</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as Status)}
                    className="w-full bg-surface-container-lowest border border-white/10 rounded-lg p-3 outline-none focus:border-primary transition-all text-white"
                  >
                    <option value="pass">Pass</option>
                    <option value="needs_revision">Needs Revision</option>
                  </select>
                </div>

                <div className="space-y-2 flex flex-col">
                  <label className="text-on-surface-variant font-semibold">Feedback (visible to student)</label>
                  <textarea
                    value={formFeedback}
                    onChange={(e) => setFormFeedback(e.target.value)}
                    rows={3}
                    placeholder="Nice work! Consider..."
                    className="w-full bg-surface-container-lowest border border-white/10 rounded-lg p-3 outline-none focus:border-primary transition-all text-white resize-none"
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setGrading(null)}
                    className="flex-1 bg-surface-container-high border border-white/10 text-on-surface py-3 rounded-lg font-bold hover:bg-surface-variant transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveGrade}
                    disabled={saving}
                    className="flex-1 bg-primary text-background py-3 rounded-lg font-bold hover:brightness-110 transition-all text-black cursor-pointer disabled:opacity-60"
                  >
                    {saving ? "Saving…" : "Save Grade"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminPinGuard>
  );
}
