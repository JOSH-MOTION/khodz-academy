"use client";

import { useState, useEffect } from "react";
import AppSidebar from "@/components/AppSidebar";
import { createClient } from "@/lib/supabase/client";

export default function StudentSettingsPage() {
  const [formData, setFormData] = useState({
    name: "Alex Rivera",
    email: "alex.rivera@volt.com",
    github: "github.com/alexrivera-dev",
    discord: "alexrivera#1337"
  });

  useEffect(() => {
    const loadUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setFormData(prev => ({
          ...prev,
          name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || prev.name,
          email: user.email || prev.email,
        }));
      }
    };
    loadUser();
  }, []);

  const [notifications, setNotifications] = useState({
    email: true,
    whatsapp: false,
    quizReminders: true
  });

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setTimeout(() => {
      setSaving(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }, 1200);
  };

  return (
    <div className="bg-background text-on-background font-body-md selection:bg-primary selection:text-on-primary min-h-screen overflow-x-hidden flex flex-col pb-16 md:pb-0">
      <div className="flex flex-grow">
        <AppSidebar role="student" />

        {/* Main Content Area */}
        <main className="flex-grow lg:ml-64 relative bg-background min-h-screen">
          {/* Header */}
          <header className="sticky top-0 w-full z-40 bg-surface/70 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex justify-between items-center">
            <div>
              <h2 className="font-syne text-xl font-bold text-on-surface">Account Settings</h2>
              <p className="text-xs text-on-surface-variant mt-1">Configure your personal profiles and preferences.</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-secondary-container overflow-hidden border border-primary/20 flex items-center justify-center font-bold text-on-secondary-container text-xs">
              {formData.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "ST"}
            </div>
          </header>

          <div className="p-6 max-w-[1000px] mx-auto space-y-6">
            {/* Settings Saved Notification Banner */}
            {success && (
              <div className="w-full bg-primary/20 text-primary border border-primary/30 p-4 rounded-xl flex items-center gap-3 animate-fade-in">
                <span className="material-symbols-outlined text-lg">check_circle</span>
                <span className="text-xs font-bold uppercase tracking-wider">Settings updated successfully!</span>
              </div>
            )}

            <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Account Information Panel */}
              <div className="md:col-span-2 glass-card rounded-xl p-6 inner-glow space-y-6">
                <h3 className="font-syne text-base font-bold text-white pb-3 border-b border-white/5 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-xl">person</span>
                  Profile Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-2 flex flex-col">
                    <label className="text-on-surface-variant font-semibold">Full Name</label>
                    <input
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-surface-container-lowest border border-white/10 rounded-lg p-3 outline-none focus:border-primary transition-all text-white bg-[#08100b]"
                      type="text"
                    />
                  </div>
                  <div className="space-y-2 flex flex-col">
                    <label className="text-on-surface-variant font-semibold">Email Address</label>
                    <input
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-surface-container-lowest border border-white/10 rounded-lg p-3 outline-none focus:border-primary transition-all text-white bg-[#08100b]"
                      type="email"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-2 flex flex-col">
                    <label className="text-on-surface-variant font-semibold">GitHub Profile Link</label>
                    <input
                      value={formData.github}
                      onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                      className="w-full bg-surface-container-lowest border border-white/10 rounded-lg p-3 outline-none focus:border-primary transition-all text-white bg-[#08100b]"
                      type="text"
                    />
                  </div>
                  <div className="space-y-2 flex flex-col">
                    <label className="text-on-surface-variant font-semibold">Discord Username</label>
                    <input
                      value={formData.discord}
                      onChange={(e) => setFormData({ ...formData, discord: e.target.value })}
                      className="w-full bg-surface-container-lowest border border-white/10 rounded-lg p-3 outline-none focus:border-primary transition-all text-white bg-[#08100b]"
                      type="text"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="bg-primary text-background font-bold px-6 py-3 rounded-lg hover:brightness-110 active:scale-95 transition-all text-xs uppercase tracking-wider text-black font-semibold cursor-pointer disabled:opacity-50"
                >
                  {saving ? "Saving Changes..." : "Save Settings"}
                </button>
              </div>

              {/* Sidebar Panels: Preferences & Account status */}
              <div className="space-y-6">
                {/* Notifications Options */}
                <div className="glass-card rounded-xl p-6 inner-glow space-y-4">
                  <h3 className="font-syne text-xs font-bold text-on-surface-variant uppercase tracking-widest pb-2 border-b border-white/5 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-base">notifications</span>
                    Notifications
                  </h3>

                  <div className="space-y-3 text-xs">
                    {[
                      { key: "email", label: "Email Updates", desc: "Receive cohort news & announcements." },
                      { key: "whatsapp", label: "WhatsApp Alerts", desc: "Receive immediate session links & grades." },
                      { key: "quizReminders", label: "Quiz Reminders", desc: "Weekly notification for pending quizzes." }
                    ].map((item) => (
                      <div key={item.key} className="flex items-start justify-between gap-3 p-2 rounded hover:bg-white/5 transition-colors">
                        <div>
                          <p className="font-bold text-white">{item.label}</p>
                          <p className="text-[10px] text-on-surface-variant mt-0.5">{item.desc}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key as keyof typeof notifications] })}
                          className={`w-10 h-6 rounded-full relative p-1 transition-all cursor-pointer shrink-0 mt-1 ${
                            notifications[item.key as keyof typeof notifications] ? "bg-primary" : "bg-surface-variant"
                          }`}
                        >
                          <div
                            className={`absolute w-4 h-4 bg-background rounded-full transition-all ${
                              notifications[item.key as keyof typeof notifications] ? "right-1" : "left-1"
                            }`}
                          ></div>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Account Status Card */}
                <div className="glass-card rounded-xl p-6 inner-glow border border-primary/20">
                  <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Enrollment tier</p>
                  <p className="text-2xl font-syne text-primary font-bold mt-1">ADVANCED TIER</p>
                  <p className="text-[10px] text-on-surface-variant mt-1">Status: Active (Balance due Friday)</p>
                  <hr className="border-white/10 my-4" />
                  <p className="text-xs text-white leading-relaxed">
                    Access to: Modules 1-4, Private Discord server, Weekly cohort calls, gRPC Masterclass.
                  </p>
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
