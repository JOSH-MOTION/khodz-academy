"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AppSidebar from "@/components/AppSidebar";
import AdminPinGuard from "@/components/AdminPinGuard";
import NotificationBell from "@/components/NotificationBell";

type Tier = "admitted" | "deposited" | "paid";

interface Enrolment {
  id: string;
  courseId: string;
  courseTitle: string | null;
  tier: Tier;
  cohort: string | null;
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
  createdAt: string;
  enrolments: Enrolment[];
  payments: Payment[];
}

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function lastSixMonthsRevenue(students: Student[]) {
  const now = new Date();
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    return { year: d.getFullYear(), month: d.getMonth(), label: MONTH_LABELS[d.getMonth()], total: 0 };
  });

  for (const s of students) {
    for (const p of s.payments) {
      const paidAt = new Date(p.paidAt);
      const bucket = months.find((m) => m.year === paidAt.getFullYear() && m.month === paidAt.getMonth());
      if (bucket) bucket.total += Number(p.amount);
    }
  }
  return months;
}

export default function AdminDashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [animateChart, setAnimateChart] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/admin/students");
        const json = await res.json();
        setStudents(json.students || []);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setAnimateChart(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const totalRevenue = students.reduce((sum, s) => sum + s.payments.reduce((a, p) => a + Number(p.amount), 0), 0);
  const paidCount = students.filter((s) => s.enrolments.some((e) => e.tier === "paid")).length;
  const awaitingBalanceCount = students.filter((s) => s.enrolments.some((e) => e.tier === "deposited")).length;
  const unenrolledCount = students.filter((s) => s.enrolments.length === 0).length;

  const stats = [
    { label: "Total Students", value: students.length, icon: "group" },
    { label: "Fully Paid", value: paidCount, icon: "check_circle" },
    { label: "Awaiting Balance", value: awaitingBalanceCount, icon: "pending" },
    { label: "Not Yet Enrolled", value: unenrolledCount, icon: "person_add" },
  ];

  const revenueByMonth = lastSixMonthsRevenue(students);
  const maxMonthlyRevenue = Math.max(1, ...revenueByMonth.map((m) => m.total));

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (student.email || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminPinGuard>
      <div className="bg-background text-on-background font-body-md overflow-x-hidden min-h-screen pb-16 lg:pb-0 flex">
        <AppSidebar role="admin" />

        <main className="lg:ml-64 flex-grow min-h-screen px-gutter py-stack-lg flex flex-col gap-stack-lg max-w-[1400px] mx-auto p-6 gap-6">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-stack-md gap-4">
            <div>
              <h2 className="font-syne text-display-md text-on-surface leading-tight text-2xl font-bold">Admin Dashboard</h2>
              <p className="text-on-surface-variant text-sm">Real registrations and payments, live from the database.</p>
            </div>
            <div className="flex items-center gap-3">
              <NotificationBell />
              <Link
                href="/admin-dashboard/students"
                className="bg-primary text-on-primary font-bold px-stack-lg py-stack-sm rounded-lg hover:scale-[1.02] active:scale-95 transition-all text-black cursor-pointer px-4 py-2 text-sm"
              >
                Manage Students
              </Link>
            </div>
          </header>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <div key={i} className="glass-panel rounded-xl p-4 flex items-center gap-3">
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

          <section className="grid grid-cols-1 md:grid-cols-3 gap-stack-lg gap-6">
            <div className="md:col-span-2 glass-panel p-stack-lg p-6 rounded-xl flex flex-col gap-stack-md relative overflow-hidden">
              <div className="absolute top-0 right-0 p-stack-md opacity-25">
                <span className="material-symbols-outlined text-primary scale-[5]">analytics</span>
              </div>

              <div className="flex justify-between items-center z-10">
                <h3 className="font-syne text-headline-md text-primary font-bold text-lg">Revenue — Last 6 Months</h3>
              </div>

              <div className="h-48 w-full flex items-end justify-between gap-2 z-10 pt-stack-md pt-4">
                {revenueByMonth.map((item, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                    <span className="text-[10px] text-on-surface-variant font-bold">
                      {item.total > 0 ? `GHS ${item.total.toLocaleString()}` : ""}
                    </span>
                    <div className="w-full bg-surface-variant/30 rounded-t-lg relative flex flex-col justify-end min-h-[40px] h-[80%] overflow-hidden">
                      <div
                        style={{ height: animateChart ? `${Math.max(4, (item.total / maxMonthlyRevenue) * 100)}%` : "0%" }}
                        className="bg-primary w-full rounded-t-lg shadow-[0_0_10px_rgba(69,236,157,0.2)] transition-all duration-1000"
                      />
                    </div>
                    <span className="text-[10px] text-on-surface-variant uppercase font-bold">{item.label}</span>
                  </div>
                ))}
              </div>
              {totalRevenue === 0 && (
                <p className="text-[11px] text-on-surface-variant text-center z-10">No payments recorded yet.</p>
              )}
            </div>

            <div className="glass-panel p-stack-lg p-6 rounded-xl flex flex-col justify-between">
              <div>
                <h3 className="font-syne text-label-md text-xs text-on-surface-variant uppercase tracking-widest mb-stack-sm mb-2 font-bold">
                  Total Revenue Received
                </h3>
                <div className="text-3xl font-bold text-primary">GHS {totalRevenue.toLocaleString()}</div>
              </div>

              <div className="mt-stack-lg space-y-stack-sm mt-6">
                <div className="flex justify-between items-center text-xs text-on-surface-variant">
                  <span>Not Yet Enrolled</span>
                  <span className="text-on-surface font-semibold">{unenrolledCount} Students</span>
                </div>
                <Link
                  href="/admin-dashboard/students"
                  className="w-full inline-block text-center border border-primary/30 text-primary font-bold py-3 rounded-lg mt-stack-md hover:bg-primary hover:text-black transition-all cursor-pointer text-sm font-bold uppercase tracking-wider"
                >
                  Review Students
                </Link>
              </div>
            </div>
          </section>

          <section className="glass-panel rounded-xl overflow-hidden flex flex-col">
            <div className="p-stack-lg border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-stack-md gap-4 p-6">
              <h3 className="font-syne text-headline-md text-on-surface text-lg font-bold">Recent Registrations</h3>
              <div className="flex bg-surface-container-low p-1 rounded-lg border border-white/5 w-full md:w-auto items-center">
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none focus:ring-0 text-xs px-stack-md py-1 w-full md:w-64 outline-none px-3"
                  placeholder="Search students..."
                  type="text"
                />
                <span className="material-symbols-outlined text-sm p-1 px-2 text-on-surface-variant">search</span>
              </div>
            </div>

            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead className="bg-surface-container-high/50">
                  <tr className="text-xs">
                    <th className="p-stack-md p-4 text-on-surface-variant font-bold uppercase tracking-widest">Student</th>
                    <th className="p-stack-md p-4 text-on-surface-variant font-bold uppercase tracking-widest">Course</th>
                    <th className="p-stack-md p-4 text-on-surface-variant font-bold uppercase tracking-widest text-right">
                      Total Paid
                    </th>
                    <th className="p-stack-md p-4 text-on-surface-variant font-bold uppercase tracking-widest text-center">
                      Manage
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {filteredStudents.slice(0, 8).map((student) => {
                    const paid = student.payments.reduce((a, p) => a + Number(p.amount), 0);
                    return (
                      <tr key={student.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-stack-md p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary-container text-background flex items-center justify-center font-bold text-xs uppercase">
                              {student.name.slice(0, 2)}
                            </div>
                            <div>
                              <div className="text-on-surface font-semibold">{student.name}</div>
                              <div className="text-[10px] text-on-surface-variant">{student.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-stack-md p-4">
                          {student.enrolments.length === 0 ? (
                            <span className="text-[10px] text-on-surface-variant italic">No course yet</span>
                          ) : (
                            <span className="text-xs">{student.enrolments.map((e) => e.courseTitle || e.courseId).join(", ")}</span>
                          )}
                        </td>
                        <td className="p-stack-md p-4 text-right">
                          <div className="text-on-surface font-bold text-xs">GHS {paid.toLocaleString()}</div>
                        </td>
                        <td className="p-stack-md p-4 text-center">
                          <Link
                            href="/admin-dashboard/students"
                            className="bg-primary/10 text-primary border border-primary/30 px-3 py-1 rounded text-[10px] font-bold hover:bg-primary hover:text-background transition-all cursor-pointer"
                          >
                            MANAGE
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {!loading && filteredStudents.length === 0 && (
              <div className="py-16 text-center text-on-surface-variant text-xs">
                <span className="material-symbols-outlined text-4xl block mb-2 opacity-30">manage_search</span>
                {students.length === 0 ? "No students have signed up yet." : "No students match your search."}
              </div>
            )}
            {loading && (
              <div className="py-16 text-center">
                <span className="material-symbols-outlined text-primary text-3xl animate-spin">progress_activity</span>
              </div>
            )}

            {students.length > 8 && (
              <div className="p-stack-md p-4 bg-surface-container-high/30 mt-auto flex justify-between items-center text-xs">
                <span className="text-on-surface-variant">Showing 8 of {students.length} students</span>
                <Link href="/admin-dashboard/students" className="text-primary font-bold hover:underline">
                  View all →
                </Link>
              </div>
            )}
          </section>

          <footer className="w-full py-stack-lg py-8 flex flex-col md:flex-row justify-between items-center border-t border-white/10 mt-auto max-w-[1400px] mx-auto gap-4">
            <div className="font-syne text-headline-md text-primary font-bold text-lg">KHODZ</div>
            <div className="flex gap-stack-lg gap-6 text-on-surface-variant text-xs font-semibold">
              <a className="hover:text-primary transition-colors" href="mailto:sales@khodz.academy">Contact</a>
            </div>
            <p className="text-on-surface-variant text-xs mt-stack-md md:mt-0">© 2026 Khodz Academy. All rights reserved.</p>
          </footer>
        </main>
      </div>
    </AdminPinGuard>
  );
}
