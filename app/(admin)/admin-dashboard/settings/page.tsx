"use client";

import { useState } from "react";
import AppSidebar from "@/components/AppSidebar";
import AdminPinGuard from "@/components/AdminPinGuard";

export default function AdminSettingsPage() {
  const [formData, setFormData] = useState({
    cohortName: "Cohort 04 - Systems Engineering",
    admissionFee: "1250",
    maxSeats: "45",
    supportWhatsapp: "+233 24 000 0000"
  });

  const [integrations, setIntegrations] = useState({
    supabase: true,
    paystack: true,
    discordWebhooks: false,
    vimeoHosting: true
  });

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setTimeout(() => {
      setSaving(true);
      setSaving(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }, 1000);
  };

  return (
    <AdminPinGuard>
      <div className="bg-background text-on-background font-body-md selection:bg-primary selection:text-on-primary min-h-screen overflow-x-hidden flex flex-col pb-16 md:pb-0">
        <div className="flex flex-grow">
        <AppSidebar role="admin" />

        {/* Main Content Area */}
        <main className="flex-grow lg:ml-64 relative bg-background min-h-screen">
          {/* Header */}
          <header className="sticky top-0 w-full z-40 bg-surface/70 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex justify-between items-center">
            <div>
              <h2 className="font-syne text-xl font-bold text-on-surface">Platform Settings</h2>
              <p className="text-xs text-on-surface-variant mt-1">Configure global cohort configs, system thresholds, and integrations.</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-secondary-container overflow-hidden border border-primary/20 flex items-center justify-center font-bold text-on-secondary-container text-xs">
              AD
            </div>
          </header>

          <div className="p-6 max-w-[1000px] mx-auto space-y-6">
            {success && (
              <div className="w-full bg-primary/20 text-primary border border-primary/30 p-4 rounded-xl flex items-center gap-3 animate-fade-in">
                <span className="material-symbols-outlined text-lg">check_circle</span>
                <span className="text-xs font-bold uppercase tracking-wider">System configuration updated successfully!</span>
              </div>
            )}

            <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Cohort Configuration */}
              <div className="md:col-span-2 glass-card rounded-xl p-6 inner-glow space-y-6">
                <h3 className="font-syne text-base font-bold text-white pb-3 border-b border-white/5 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-xl">settings_system_daydream</span>
                  Cohort Cohort Parameters
                </h3>

                <div className="space-y-4 text-xs">
                  <div className="space-y-2 flex flex-col">
                    <label className="text-on-surface-variant font-semibold">Active Cohort Title</label>
                    <input
                      required
                      value={formData.cohortName}
                      onChange={(e) => setFormData({ ...formData, cohortName: e.target.value })}
                      className="w-full bg-surface-container-lowest border border-white/10 rounded-lg p-3 outline-none focus:border-primary transition-all text-white bg-[#08100b]"
                      type="text"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 flex flex-col">
                      <label className="text-on-surface-variant font-semibold">Admission Fee Amount (GHS)</label>
                      <input
                        required
                        value={formData.admissionFee}
                        onChange={(e) => setFormData({ ...formData, admissionFee: e.target.value })}
                        className="w-full bg-surface-container-lowest border border-white/10 rounded-lg p-3 outline-none focus:border-primary transition-all text-white bg-[#08100b]"
                        type="number"
                      />
                    </div>
                    <div className="space-y-2 flex flex-col">
                      <label className="text-on-surface-variant font-semibold">Maximum Enrollment Seats</label>
                      <input
                        required
                        value={formData.maxSeats}
                        onChange={(e) => setFormData({ ...formData, maxSeats: e.target.value })}
                        className="w-full bg-surface-container-lowest border border-white/10 rounded-lg p-3 outline-none focus:border-primary transition-all text-white bg-[#08100b]"
                        type="number"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 flex flex-col">
                    <label className="text-on-surface-variant font-semibold">Support Contact WhatsApp Number</label>
                    <input
                      required
                      value={formData.supportWhatsapp}
                      onChange={(e) => setFormData({ ...formData, supportWhatsapp: e.target.value })}
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
                  {saving ? "Updating System..." : "Update Settings"}
                </button>
              </div>

              {/* Service Integrations */}
              <div className="space-y-6">
                <div className="glass-card rounded-xl p-6 inner-glow space-y-4">
                  <h3 className="font-syne text-xs font-bold text-on-surface-variant uppercase tracking-widest pb-2 border-b border-white/5 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-base">hub</span>
                    Integrations
                  </h3>

                  <div className="space-y-3 text-xs">
                    {[
                      { key: "supabase", label: "Supabase DB", desc: "User accounts & cohort profiling data." },
                      { key: "paystack", label: "Paystack API", desc: "Credit card & Mobile Money checks." },
                      { key: "vimeoHosting", label: "Vimeo Video API", desc: "Interactive streaming endpoints." },
                      { key: "discordWebhooks", label: "Discord Webhooks", desc: "Push log events to private workspace channels." }
                    ].map((item) => (
                      <div key={item.key} className="flex items-start justify-between gap-3 p-2 rounded hover:bg-white/5 transition-colors">
                        <div>
                          <p className="font-bold text-white">{item.label}</p>
                          <p className="text-[10px] text-on-surface-variant mt-0.5">{item.desc}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setIntegrations({ ...integrations, [item.key]: !integrations[item.key as keyof typeof integrations] })}
                          className={`w-10 h-6 rounded-full relative p-1 transition-all cursor-pointer shrink-0 mt-1 ${
                            integrations[item.key as keyof typeof integrations] ? "bg-primary" : "bg-surface-variant"
                          }`}
                        >
                          <div
                            className={`absolute w-4 h-4 bg-background rounded-full transition-all ${
                              integrations[item.key as keyof typeof integrations] ? "right-1" : "left-1"
                            }`}
                          ></div>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* API Logs Threshold */}
                <div className="glass-card rounded-xl p-6 inner-glow border border-primary/20 text-xs">
                  <h4 className="font-syne font-bold text-[10px] uppercase text-primary tracking-wider mb-2">Security Logging</h4>
                  <p className="text-white">Active session count: <span className="font-bold text-primary">124 users</span></p>
                  <p className="text-on-surface-variant mt-1">Daily billing operations: 15 payments verified</p>
                  <p className="text-on-surface-variant mt-1">Log level: Debug mode enabled</p>
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
    </AdminPinGuard>
  );
}
