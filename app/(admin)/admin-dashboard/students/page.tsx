"use client";

import { useState, useEffect } from "react";
import AppSidebar from "@/components/AppSidebar";
import AdminPinGuard from "@/components/AdminPinGuard";
import { createClient } from "@/lib/supabase/client";
import { COHORTS, CURRENT_COHORT } from "@/lib/cohorts";

type Tier = "admitted" | "deposited" | "paid";

interface Enrolment {
  id: string;
  courseId: string;
  courseTitle: string | null;
  tier: Tier;
  cohort: string | null;
  waterlineWeek: number;
  paymentDeadline: string | null;
  enrolledAt: string;
  amountPaid: number;
  totalPriceGhs: number | null;
  remainingGhs: number | null;
}

interface Payment {
  amount: number;
  paymentType: string;
  status: string;
  paidAt: string;
}

interface Student {
  id: string;
  email: string | null;
  name: string;
  avatarUrl: string | null;
  phone: string | null;
  dateOfBirth: string | null;
  gender: string | null;
  address: string | null;
  educationBackground: string | null;
  occupation: string | null;
  emergencyContactName: string | null;
  emergencyContactPhone: string | null;
  referralSource: string | null;
  motivation: string | null;
  profileCompleted: boolean | null;
  createdAt: string;
  lastSignInAt: string | null;
  enrolments: Enrolment[];
  payments: Payment[];
}

interface Course {
  id: string;
  title: string;
}

const TIER_LABEL: Record<Tier, string> = {
  admitted: "Admitted",
  deposited: "Deposited",
  paid: "Paid",
};

const TIER_COLOR: Record<Tier, string> = {
  paid: "bg-primary/20 text-primary border-primary/30",
  deposited: "bg-tertiary/20 text-tertiary border-tertiary/30",
  admitted: "bg-white/5 text-on-surface-variant border-white/10",
};

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [search, setSearch] = useState("");
  const [cohortFilter, setCohortFilter] = useState("All");

  const [viewing, setViewing] = useState<Student | null>(null);
  const [managing, setManaging] = useState<Student | null>(null);
  const [formCourseId, setFormCourseId] = useState("");
  const [formTier, setFormTier] = useState<Tier>("paid");
  const [formCohort, setFormCohort] = useState("");
  const [saving, setSaving] = useState(false);

  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/admin/students");
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || `Request failed (${res.status})`);
        setStudents(json.students || []);
        setLoadError("");
      } catch (err) {
        console.error("Failed to load students:", err);
        setLoadError(err instanceof Error ? err.message : "Failed to load students");
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

  const cohorts = ["All", ...Array.from(new Set(students.flatMap((s) => s.enrolments.map((e) => e.cohort).filter((c): c is string => !!c))))];

  const filtered = students.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) || (s.email || "").toLowerCase().includes(search.toLowerCase());
    const matchCohort = cohortFilter === "All" || s.enrolments.some((e) => e.cohort === cohortFilter);
    return matchSearch && matchCohort;
  });

  const stats = [
    { label: "Total Students", value: students.length, icon: "group" },
    { label: "Paid (Full Access)", value: students.filter((s) => s.enrolments.some((e) => e.tier === "paid")).length, icon: "check_circle" },
    { label: "Awaiting Balance", value: students.filter((s) => s.enrolments.some((e) => e.tier === "deposited")).length, icon: "pending" },
    {
      label: "Total Received",
      value: `GHS ${students.reduce((sum, s) => sum + s.payments.reduce((a, p) => a + Number(p.amount), 0), 0).toLocaleString()}`,
      icon: "payments",
    },
  ];

  function openManage(student: Student, enrolment?: Enrolment) {
    setManaging(student);
    setFormCourseId(enrolment?.courseId || courses[0]?.id || "");
    setFormTier(enrolment?.tier || "paid");
    setFormCohort(enrolment?.cohort || CURRENT_COHORT);
  }

  async function saveAccess() {
    if (!managing || !formCourseId) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/enrolments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId: managing.id, courseId: formCourseId, tier: formTier, cohort: formCohort }),
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Save failed");
      }
      setManaging(null);
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
              <h2 className="font-syne text-xl font-bold text-on-surface">Student Management</h2>
              <p className="text-xs text-on-surface-variant mt-1">Real registrations, payments, and cohort assignments.</p>
            </div>
            <div className="relative hidden md:block">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search students…"
                className="bg-surface-container-low border border-white/10 rounded-full pl-9 pr-4 py-2 text-xs focus:ring-1 focus:ring-primary focus:border-primary transition-all w-52 outline-none"
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

            {cohorts.length > 1 && (
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
            )}

            <div className="glass-card rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[760px]">
                  <thead className="bg-surface-container-high/50">
                    <tr className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
                      <th className="p-4">Student</th>
                      <th className="p-4">Courses</th>
                      <th className="p-4">Payments</th>
                      <th className="p-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-sm">
                    {filtered.map((student) => (
                      <tr key={student.id} className="hover:bg-white/5 transition-colors align-top">
                        <td className="p-4">
                          <button onClick={() => setViewing(student)} className="flex items-center gap-3 text-left cursor-pointer group">
                            {student.avatarUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={student.avatarUrl} alt={student.name} className="w-9 h-9 rounded-full object-cover flex-shrink-0 border border-white/10" />
                            ) : (
                              <div className="w-9 h-9 rounded-full bg-secondary-container flex items-center justify-center font-bold text-on-secondary-container text-xs flex-shrink-0 uppercase">
                                {student.name.slice(0, 2)}
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="font-semibold text-xs text-on-surface truncate group-hover:text-primary transition-colors">{student.name}</p>
                              <p className="text-[10px] text-on-surface-variant truncate">{student.email}</p>
                              {student.profileCompleted === false && (
                                <span className="text-[9px] text-amber-400 font-bold">Admission profile incomplete</span>
                              )}
                            </div>
                          </button>
                        </td>
                        <td className="p-4">
                          {student.enrolments.length === 0 ? (
                            <span className="text-[10px] text-on-surface-variant italic">No course yet</span>
                          ) : (
                            <div className="flex flex-col gap-2">
                              {student.enrolments.map((e) => (
                                <button
                                  key={e.id}
                                  onClick={() => openManage(student, e)}
                                  className="flex flex-col items-start gap-1 text-left cursor-pointer group"
                                  title="Edit this enrolment"
                                >
                                  <div className="flex items-center gap-2">
                                    <span className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase border ${TIER_COLOR[e.tier]}`}>
                                      {TIER_LABEL[e.tier]}
                                    </span>
                                    <span className="text-[11px] text-on-surface group-hover:text-primary transition-colors truncate">
                                      {e.courseTitle || e.courseId}
                                    </span>
                                    {e.cohort && (
                                      <span className="text-[9px] text-on-surface-variant border border-white/10 px-1.5 rounded">{e.cohort}</span>
                                    )}
                                  </div>
                                  {e.totalPriceGhs !== null && (
                                    <span className="text-[9px] text-on-surface-variant">
                                      GHS {e.amountPaid.toLocaleString()} / {e.totalPriceGhs.toLocaleString()} paid
                                      {e.remainingGhs !== null && e.remainingGhs > 0 && (
                                        <span className="text-amber-400"> · {e.remainingGhs.toLocaleString()} remaining</span>
                                      )}
                                    </span>
                                  )}
                                </button>
                              ))}
                            </div>
                          )}
                        </td>
                        <td className="p-4">
                          {student.payments.length === 0 ? (
                            <span className="text-[10px] text-on-surface-variant italic">None recorded</span>
                          ) : (
                            <div className="flex flex-col gap-1">
                              {student.payments.slice(0, 2).map((p, i) => (
                                <span key={i} className="text-[10px] text-on-surface">
                                  GHS {Number(p.amount).toLocaleString()} · {p.paymentType}
                                </span>
                              ))}
                            </div>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => openManage(student)}
                            className="bg-primary/10 text-primary border border-primary/30 px-3 py-1.5 rounded text-[10px] font-bold hover:bg-primary hover:text-black transition-all cursor-pointer"
                          >
                            Manage Access
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {!loading && loadError && (
                <div className="py-16 text-center text-error text-xs">
                  <span className="material-symbols-outlined text-4xl block mb-2 opacity-60">error</span>
                  <p className="font-bold mb-1">Couldn&apos;t load students</p>
                  <p className="text-on-surface-variant">{loadError}</p>
                </div>
              )}
              {!loading && !loadError && filtered.length === 0 && (
                <div className="py-16 text-center text-on-surface-variant text-xs">
                  <span className="material-symbols-outlined text-4xl block mb-2 opacity-30">manage_search</span>
                  {students.length === 0 ? "No students have signed up yet." : "No students match your filters."}
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

        {managing && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="glass-card rounded-2xl w-full max-w-md p-6 inner-glow border border-white/10 relative">
              <button
                onClick={() => setManaging(null)}
                className="absolute top-4 right-4 text-on-surface-variant hover:text-white cursor-pointer material-symbols-outlined text-sm"
              >
                close
              </button>
              <h3 className="font-syne text-lg font-bold text-white mb-1">Manage Access</h3>
              <p className="text-xs text-on-surface-variant mb-6">{managing.name} · {managing.email}</p>

              <div className="space-y-4 text-xs">
                <div className="space-y-2 flex flex-col">
                  <label className="text-on-surface-variant font-semibold">Course</label>
                  <select
                    value={formCourseId}
                    onChange={(e) => setFormCourseId(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-white/10 rounded-lg p-3 outline-none focus:border-primary transition-all text-white"
                  >
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2 flex flex-col">
                  <label className="text-on-surface-variant font-semibold">Access Tier</label>
                  <select
                    value={formTier}
                    onChange={(e) => setFormTier(e.target.value as Tier)}
                    className="w-full bg-surface-container-lowest border border-white/10 rounded-lg p-3 outline-none focus:border-primary transition-all text-white"
                  >
                    <option value="admitted">Admitted (no content access)</option>
                    <option value="deposited">Deposited (partial access, waterline-gated)</option>
                    <option value="paid">Paid (full access to all slides/video)</option>
                  </select>
                </div>
                <div className="space-y-2 flex flex-col">
                  <label className="text-on-surface-variant font-semibold">Cohort</label>
                  <select
                    value={formCohort}
                    onChange={(e) => setFormCohort(e.target.value)}
                    className="w-full bg-surface-container-lowest border border-white/10 rounded-lg p-3 outline-none focus:border-primary transition-all text-white"
                  >
                    <option value="">No cohort assigned</option>
                    {COHORTS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setManaging(null)}
                    className="flex-1 bg-surface-container-high border border-white/10 text-on-surface py-3 rounded-lg font-bold hover:bg-surface-variant transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveAccess}
                    disabled={saving || !formCourseId}
                    className="flex-1 bg-primary text-background py-3 rounded-lg font-bold hover:brightness-110 transition-all text-black cursor-pointer disabled:opacity-60"
                  >
                    {saving ? "Saving…" : "Save Access"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {viewing && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="glass-card rounded-2xl w-full max-w-lg p-6 inner-glow border border-white/10 relative max-h-[85vh] overflow-y-auto">
              <button
                onClick={() => setViewing(null)}
                className="absolute top-4 right-4 text-on-surface-variant hover:text-white cursor-pointer material-symbols-outlined text-sm"
              >
                close
              </button>

              <div className="flex items-center gap-4 mb-6">
                {viewing.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={viewing.avatarUrl} alt={viewing.name} className="w-16 h-16 rounded-full object-cover border border-white/10" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-secondary-container flex items-center justify-center font-bold text-on-secondary-container text-lg uppercase">
                    {viewing.name.slice(0, 2)}
                  </div>
                )}
                <div>
                  <h3 className="font-syne text-lg font-bold text-white">{viewing.name}</h3>
                  <p className="text-xs text-on-surface-variant">{viewing.email}</p>
                  {viewing.profileCompleted === false && (
                    <span className="text-[9px] text-amber-400 font-bold">Admission profile not yet completed</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <DetailField label="Phone" value={viewing.phone} />
                <DetailField label="Date of Birth" value={viewing.dateOfBirth ? new Date(viewing.dateOfBirth).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : null} />
                <DetailField label="Gender" value={viewing.gender} />
                <DetailField label="Occupation" value={viewing.occupation} />
                <DetailField label="Address" value={viewing.address} full />
                <DetailField label="Education Background" value={viewing.educationBackground} full />
                <DetailField label="Emergency Contact" value={viewing.emergencyContactName} />
                <DetailField label="Emergency Contact Phone" value={viewing.emergencyContactPhone} />
                <DetailField label="How they heard about us" value={viewing.referralSource} />
                <DetailField label="Motivation" value={viewing.motivation} full />
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminPinGuard>
  );
}

function DetailField({ label, value, full = false }: { label: string; value: string | null; full?: boolean }) {
  return (
    <div className={`space-y-1 ${full ? "col-span-2" : ""}`}>
      <p className="text-[9px] text-on-surface-variant uppercase tracking-widest font-bold">{label}</p>
      <p className="text-on-surface">{value || <span className="text-on-surface-variant italic">Not provided</span>}</p>
    </div>
  );
}
