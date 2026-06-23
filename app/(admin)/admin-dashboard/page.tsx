"use client";

import { useState, useEffect } from "react";
import AppSidebar from "@/components/AppSidebar";

export default function AdminDashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [animateChart, setAnimateChart] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStudentName, setNewStudentName] = useState("");
  const [newStudentEmail, setNewStudentEmail] = useState("");
  const [newStudentPhone, setNewStudentPhone] = useState("");
  const [newStudentTier, setNewStudentTier] = useState("Pro Developer");

  // Release lock states for modules
  const [modules, setModules] = useState([
    { id: "W1", label: "Foundation", details: "12 Lessons • 4 PDFs", released: true },
    { id: "W2", label: "Advanced Logic", details: "8 Lessons • 2 PDFs", released: true },
    { id: "W3", label: "Cloud Architecture", details: "Scheduled for next week", released: false },
  ]);

  // Student approval states
  const [students, setStudents] = useState([
    {
      id: 1,
      initials: "JD",
      name: "Jordan Devlin",
      email: "jordan.d@example.com",
      phone: "233240000101",
      status: "Active",
      tier: "Elite Mastery",
      payment: "$1,200.00",
      paymentStatus: "PAID",
    },
    {
      id: 2,
      initials: "SM",
      name: "Sarah Miller",
      email: "sarah.m@design.io",
      phone: "233240000102",
      status: "Pending",
      tier: "Pro Developer",
      payment: "$450.00",
      paymentStatus: "AWAITING",
    },
    {
      id: 3,
      initials: "KB",
      name: "Kevin Black",
      email: "kb@code.net",
      phone: "233240000103",
      status: "Suspended",
      tier: "Starter",
      payment: "$0.00",
      paymentStatus: "REVOKED",
    },
  ]);

  useEffect(() => {
    const timer = setTimeout(() => setAnimateChart(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleApprove = (id: number) => {
    setStudents(
      students.map((student) =>
        student.id === id
          ? { ...student, status: "Active", paymentStatus: "PAID" }
          : student
      )
    );
  };

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName || !newStudentEmail) return;
    
    const initials = newStudentName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    const newStudent = {
      id: Date.now(),
      initials: initials || "ST",
      name: newStudentName,
      email: newStudentEmail,
      phone: newStudentPhone || "233240000000",
      status: "Pending",
      tier: newStudentTier,
      payment: "$450.00",
      paymentStatus: "AWAITING" as const,
    };

    setStudents([newStudent, ...students]);
    setShowAddModal(false);
    setNewStudentName("");
    setNewStudentEmail("");
    setNewStudentPhone("");
  };

  const handleToggleRelease = (id: string) => {
    setModules(
      modules.map((m) => (m.id === id ? { ...m, released: !m.released } : m))
    );
  };

  // Filter students based on search input
  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-background text-on-background font-body-md overflow-x-hidden min-h-screen pb-16 lg:pb-0 flex">

      <AppSidebar role="admin" />


      {/* Main Content Canvas */}
      <main className="lg:ml-64 flex-grow min-h-screen px-gutter py-stack-lg flex flex-col gap-stack-lg max-w-[1400px] mx-auto p-6 gap-6">
        
        {/* Top Header Row */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-stack-md gap-4">
          <div>
            <h2 className="font-syne text-display-md text-on-surface leading-tight text-2xl font-bold">
              Admin Dashboard
            </h2>
            <p className="text-on-surface-variant text-sm">Welcome back. Performance metrics are looking optimal.</p>
          </div>
          <div className="flex gap-stack-md gap-3">
            <button className="bg-surface-container border border-white/10 px-stack-md py-stack-sm rounded-lg flex items-center gap-2 hover:bg-surface-variant transition-all cursor-pointer px-4 py-2 text-sm">
              <span className="material-symbols-outlined text-primary text-lg">calendar_month</span>
              <span className="text-label-md font-semibold">Export Report</span>
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-primary text-on-primary font-bold px-stack-lg py-stack-sm rounded-lg hover:scale-[1.02] active:scale-95 transition-all text-black cursor-pointer px-4 py-2 text-sm"
            >
              Add New Student
            </button>
          </div>
        </header>

        {/* Revenue & Monthly Chart Bento */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-stack-lg gap-6">
          <div className="md:col-span-2 glass-panel p-stack-lg p-6 rounded-xl flex flex-col gap-stack-md relative overflow-hidden">
            <div className="absolute top-0 right-0 p-stack-md opacity-25">
              <span className="material-symbols-outlined text-primary scale-[5]">analytics</span>
            </div>
            
            <div className="flex justify-between items-center z-10">
              <h3 className="font-syne text-headline-md text-primary font-bold text-lg">Revenue Overview</h3>
              <div className="flex gap-2 text-xs">
                <span className="w-3 h-3 bg-primary rounded-full inline-block"></span>
                <span className="text-label-sm text-on-surface-variant">Completed</span>
                <span className="w-3 h-3 bg-secondary-container rounded-full ml-4 inline-block"></span>
                <span className="text-label-sm text-on-surface-variant">Outstanding</span>
              </div>
            </div>
            
            {/* Chart Bars */}
            <div className="h-48 w-full flex items-end justify-between gap-2 z-10 pt-stack-md pt-4">
              {[
                { month: "Jan", comp: 30, out: 60 },
                { month: "Feb", comp: 50, out: 40 },
                { month: "Mar", comp: 80, out: 20 },
                { month: "Apr", comp: 90, out: 10 },
                { month: "May", comp: 65, out: 35 },
                { month: "Jun", comp: 75, out: 15 },
              ].map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                  <div className="w-full bg-surface-variant/30 rounded-t-lg relative flex flex-col justify-end min-h-[40px] h-[80%] overflow-hidden">
                    <div
                      style={{ height: animateChart ? `${item.out}%` : "0%" }}
                      className="bg-secondary-container w-full rounded-t-lg group-hover:opacity-80 transition-all duration-1000"
                    ></div>
                    <div
                      style={{ height: animateChart ? `${item.comp}%` : "0%" }}
                      className="bg-primary w-full rounded-t-lg shadow-[0_0_10px_rgba(69,236,157,0.2)] transition-all duration-1000"
                    ></div>
                  </div>
                  <span className="text-[10px] text-on-surface-variant uppercase font-bold">{item.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Outstanding Balance Info */}
          <div className="glass-panel p-stack-lg p-6 rounded-xl flex flex-col justify-between">
            <div>
              <h3 className="font-syne text-label-md text-xs text-on-surface-variant uppercase tracking-widest mb-stack-sm mb-2 font-bold">
                Outstanding Balance
              </h3>
              <div className="text-3xl font-bold text-tertiary">$12,450.00</div>
              <div className="flex items-center gap-2 text-error mt-2 text-xs">
                <span className="material-symbols-outlined text-sm">trending_up</span>
                <span className="text-label-sm font-semibold">+12% from last month</span>
              </div>
            </div>
            
            <div className="mt-stack-lg space-y-stack-sm mt-6">
              <div className="flex justify-between items-center text-xs text-on-surface-variant">
                <span>Pending Approvals</span>
                <span className="text-on-surface font-semibold">14 Students</span>
              </div>
              <div className="w-full bg-surface-variant h-1 rounded-full overflow-hidden">
                <div className="bg-tertiary w-1/3 h-full rounded-full"></div>
              </div>
              <button className="w-full border border-tertiary/30 text-tertiary font-bold py-3 rounded-lg mt-stack-md hover:bg-tertiary hover:text-black transition-all cursor-pointer text-sm font-bold uppercase tracking-wider">
                Review Payments
              </button>
            </div>
          </div>
        </section>

        {/* Student List & Course Management Tabs */}
        <section className="grid grid-cols-1 xl:grid-cols-3 gap-stack-lg gap-6">
          
          {/* Student Management Table */}
          <div className="xl:col-span-2 glass-panel rounded-xl overflow-hidden flex flex-col">
            <div className="p-stack-lg border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-stack-md gap-4 p-6">
              <h3 className="font-syne text-headline-md text-on-surface text-lg font-bold">Enrolled Students</h3>
              <div className="flex bg-surface-container-low p-1 rounded-lg border border-white/5 w-full md:w-auto items-center">
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none focus:ring-0 text-xs px-stack-md py-1 w-full md:w-64 outline-none px-3"
                  placeholder="Search students..."
                  type="text"
                />
                <button className="p-1 px-2 text-on-surface-variant">
                  <span className="material-symbols-outlined text-sm">search</span>
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead className="bg-surface-container-high/50">
                  <tr className="text-xs">
                    <th className="p-stack-md p-4 text-on-surface-variant font-bold uppercase tracking-widest">
                      Student
                    </th>
                    <th className="p-stack-md p-4 text-on-surface-variant font-bold uppercase tracking-widest">
                      Status
                    </th>
                    <th className="p-stack-md p-4 text-on-surface-variant font-bold uppercase tracking-widest">
                      Tier
                    </th>
                    <th className="p-stack-md p-4 text-on-surface-variant font-bold uppercase tracking-widest text-right">
                      Payment
                    </th>
                    <th className="p-stack-md p-4 text-on-surface-variant font-bold uppercase tracking-widest text-center">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-stack-md p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary-container text-background flex items-center justify-center font-bold text-xs">
                            {student.initials}
                          </div>
                          <div>
                            <div className="text-on-surface font-semibold">{student.name}</div>
                            <div className="text-[10px] text-on-surface-variant">{student.email}{student.phone ? ` • ${student.phone}` : ""}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-stack-md p-4">
                        <span
                          className={`status-pill inline-block text-[10px] px-2 py-0.5 rounded-sm font-bold uppercase ${
                            student.status === "Active"
                              ? "bg-primary/20 text-primary border border-primary/30"
                              : student.status === "Pending"
                              ? "bg-tertiary/20 text-tertiary border border-tertiary/30"
                              : "bg-white/10 text-on-surface-variant border border-white/10"
                          }`}
                        >
                          {student.status}
                        </span>
                      </td>
                      <td className="p-stack-md p-4">
                        <span className="text-xs">{student.tier}</span>
                      </td>
                      <td className="p-stack-md p-4 text-right">
                        <div className="text-on-surface font-bold text-xs">{student.payment}</div>
                        <div
                          className={`text-[10px] font-bold ${
                            student.paymentStatus === "PAID"
                              ? "text-primary"
                              : student.paymentStatus === "AWAITING"
                              ? "text-tertiary"
                              : "text-error"
                          }`}
                        >
                          {student.paymentStatus}
                        </div>
                      </td>
                      <td className="p-stack-md p-4">
                        <div className="flex items-center justify-center gap-2">
                          {student.phone && (
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
                          )}
                          {student.status === "Pending" ? (
                            <button
                              onClick={() => handleApprove(student.id)}
                              className="bg-primary/10 text-primary border border-primary/30 px-3 py-1 rounded text-[10px] font-bold hover:bg-primary hover:text-background transition-all cursor-pointer text-xs"
                            >
                              APPROVE
                            </button>
                          ) : (
                            <>
                              <button
                                onClick={() => handleApprove(student.id)}
                                className="p-2 hover:bg-surface-variant rounded text-on-surface-variant cursor-pointer"
                                title="Mark Paid"
                              >
                                <span className="material-symbols-outlined text-lg">check_circle</span>
                              </button>
                              <button
                                onClick={() =>
                                  setStudents(
                                    students.map((s) =>
                                      s.id === student.id
                                        ? { ...s, status: "Suspended", paymentStatus: "REVOKED" }
                                        : s
                                    )
                                  )
                                }
                                className="p-2 hover:bg-error/10 rounded text-error cursor-pointer"
                                title="Revoke"
                              >
                                <span className="material-symbols-outlined text-lg">cancel</span>
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="p-stack-md p-4 bg-surface-container-high/30 mt-auto flex justify-between items-center text-xs">
              <span className="text-on-surface-variant">Showing 3 of 1,245 students</span>
              <div className="flex gap-2">
                <button className="w-8 h-8 flex items-center justify-center rounded border border-white/5 hover:bg-surface-variant cursor-pointer">
                  <span className="material-symbols-outlined text-sm">chevron_left</span>
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded border border-primary/30 bg-primary/10 text-primary font-bold text-xs cursor-pointer">
                  1
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded border border-white/5 hover:bg-surface-variant cursor-pointer">
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </button>
              </div>
            </div>
          </div>

          {/* Course Management Column */}
          <div className="flex flex-col gap-stack-lg gap-6">
            {/* Quick Upload */}
            <div className="glass-panel p-stack-lg p-6 rounded-xl">
              <h3 className="font-syne text-headline-md text-on-surface mb-stack-md mb-4 flex items-center gap-2 text-lg font-bold">
                <span className="material-symbols-outlined text-primary text-xl">upload_file</span>
                Quick Upload
              </h3>
              <div className="border-2 border-dashed border-white/10 rounded-lg p-stack-lg p-6 text-center hover:border-primary/50 transition-all cursor-pointer group">
                <span className="material-symbols-outlined text-2xl text-on-surface-variant group-hover:text-primary transition-colors">
                  cloud_upload
                </span>
                <p className="text-xs text-on-surface mt-2 font-bold">Drop PDF or Click to browse</p>
                <p className="text-[10px] text-on-surface-variant uppercase mt-1">MAX SIZE: 100MB</p>
              </div>
              <div className="mt-stack-md mt-4 space-y-stack-sm">
                <div className="bg-surface-container-low p-stack-sm p-3 rounded border border-white/5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span className="material-symbols-outlined text-error text-lg">picture_as_pdf</span>
                    <span className="truncate">full-stack-curriculum.pdf</span>
                  </div>
                  <span className="text-[10px] text-primary font-bold">COMPLETED</span>
                </div>
              </div>
            </div>

            {/* Module Controls */}
            <div className="glass-panel p-stack-lg p-6 rounded-xl flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-syne text-headline-md text-on-surface mb-stack-md mb-4 text-lg font-bold">
                  Module Controls
                </h3>
                <div className="space-y-stack-md space-y-4">
                  {modules.map((m) => (
                    <div key={m.id} className="flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-surface-variant flex items-center justify-center">
                          <span className="text-xs font-bold text-on-surface-variant">{m.id}</span>
                        </div>
                        <div>
                          <div className={`text-sm text-on-surface ${!m.released ? "opacity-60" : ""}`}>
                            {m.label}
                          </div>
                          <div className="text-[10px] text-on-surface-variant">{m.details}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleToggleRelease(m.id)}
                        className={`w-10 h-6 rounded-full relative p-1 transition-all cursor-pointer ${
                          m.released ? "bg-primary" : "bg-surface-variant"
                        }`}
                      >
                        <div
                          className={`absolute w-4 h-4 bg-background rounded-full transition-all ${
                            m.released ? "right-1" : "left-1"
                          }`}
                        ></div>
                        <span
                          className={`material-symbols-outlined absolute text-[12px] font-bold ${
                            m.released ? "left-1 text-background" : "right-1 text-surface-container"
                          }`}
                        >
                          {m.released ? "lock_open" : "lock"}
                        </span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              
              <button className="w-full mt-stack-lg mt-6 border border-white/10 text-on-surface-variant font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-surface-variant transition-all cursor-pointer text-sm">
                <span className="material-symbols-outlined text-sm">settings_ethernet</span>
                Bulk Automate Release
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="w-full py-stack-lg py-8 flex flex-col md:flex-row justify-between items-center border-t border-white/10 mt-auto max-w-[1400px] mx-auto gap-4">
          <div className="font-syne text-headline-md text-primary font-bold text-lg">KHODZ</div>
          <div className="flex gap-stack-lg gap-6 text-on-surface-variant text-xs font-semibold">
            <a className="hover:text-primary transition-colors" href="#">Terms of Service</a>
            <a className="hover:text-primary transition-colors" href="#">Privacy Policy</a>
            <a className="hover:text-primary transition-colors" href="#">Refund Policy</a>
            <a className="hover:text-primary transition-colors" href="#">Contact</a>
          </div>
          <p className="text-on-surface-variant text-xs mt-stack-md md:mt-0">
            © 2024 Khodz Academy. All rights reserved.
          </p>
        </footer>
      </main>


      {/* Add Student Modal Overlay */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="glass-card rounded-2xl w-full max-w-md p-6 inner-glow border border-white/10 relative overflow-hidden animate-fade-in">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-white cursor-pointer material-symbols-outlined text-sm"
            >
              close
            </button>
            <h3 className="font-syne text-lg font-bold text-white mb-2">Enroll New Student</h3>
            <p className="text-xs text-on-surface-variant mb-6">Manually record a pending enrollment and generate details.</p>
            
            <form onSubmit={handleAddStudent} className="space-y-4 text-xs">
              <div className="space-y-2 flex flex-col">
                <label className="text-on-surface-variant font-semibold">Student Full Name</label>
                <input
                  required
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-white/10 rounded-lg p-3 outline-none focus:border-primary transition-all text-white bg-[#08100b]"
                  placeholder="Kofi Atta"
                  type="text"
                />
              </div>
              <div className="space-y-2 flex flex-col">
                <label className="text-on-surface-variant font-semibold">Email Address</label>
                <input
                  required
                  value={newStudentEmail}
                  onChange={(e) => setNewStudentEmail(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-white/10 rounded-lg p-3 outline-none focus:border-primary transition-all text-white bg-[#08100b]"
                  placeholder="kofi@example.com"
                  type="email"
                />
              </div>
              <div className="space-y-2 flex flex-col">
                <label className="text-on-surface-variant font-semibold">Phone Number (WhatsApp)</label>
                <input
                  required
                  value={newStudentPhone}
                  onChange={(e) => setNewStudentPhone(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-white/10 rounded-lg p-3 outline-none focus:border-primary transition-all text-white bg-[#08100b]"
                  placeholder="233240000000"
                  type="tel"
                />
              </div>
              <div className="space-y-2 flex flex-col">
                <label className="text-on-surface-variant font-semibold">Cohort Program Tier</label>
                <select
                  value={newStudentTier}
                  onChange={(e) => setNewStudentTier(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-white/10 rounded-lg p-3 outline-none focus:border-primary transition-all text-white bg-[#08100b]"
                >
                  <option value="Starter">Starter ($0.00)</option>
                  <option value="Pro Developer">Pro Developer ($450.00)</option>
                  <option value="Elite Mastery">Elite Mastery ($1,200.00)</option>
                </select>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-surface-container-high border border-white/10 text-on-surface py-3 rounded-lg font-bold hover:bg-surface-variant transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-primary text-background py-3 rounded-lg font-bold hover:brightness-110 transition-all text-black cursor-pointer"
                >
                  Enroll Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
