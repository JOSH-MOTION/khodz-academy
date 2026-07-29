"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    // Deliberately generic error for both "wrong password" and "valid
    // account but not an admin" — an admin-only login shouldn't reveal
    // which case it is.
    if (signInError || !data.user) {
      setError("Invalid admin credentials.");
      setLoading(false);
      return;
    }

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", data.user.id).single();

    if (profile?.role !== "admin") {
      await supabase.auth.signOut();
      setError("Invalid admin credentials.");
      setLoading(false);
      return;
    }

    router.push("/admin-dashboard");
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="w-full max-w-sm glass-card border border-white/10 rounded-xl p-8 shadow-2xl relative z-10">
        <div className="flex flex-col items-center gap-3 mb-8">
          <div
            className="w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary"
            style={{ boxShadow: "0 0 30px rgba(69,236,157,0.15)" }}
          >
            <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              admin_panel_settings
            </span>
          </div>
          <div className="text-center">
            <h1 className="font-syne text-lg font-bold text-white tracking-tight">Admin Sign In</h1>
            <p className="text-[11px] text-on-surface-variant mt-1">Khodz Academy staff access only.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="space-y-1.5 flex flex-col">
            <label className="text-on-surface-variant px-1 text-xs font-medium">Email Address</label>
            <div className="input-glow flex items-center bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2.5 transition-all">
              <span className="material-symbols-outlined text-outline text-lg mr-2">alternate_email</span>
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@khodz.academy"
                className="bg-transparent border-none focus:ring-0 w-full text-on-surface placeholder:text-outline/50 text-sm outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5 flex flex-col">
            <label className="text-on-surface-variant px-1 text-xs font-medium">Password</label>
            <div className="input-glow flex items-center bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2.5 transition-all">
              <span className="material-symbols-outlined text-outline text-lg mr-2">lock</span>
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-transparent border-none focus:ring-0 w-full text-on-surface placeholder:text-outline/50 text-sm outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="text-outline hover:text-primary transition-colors ml-1 cursor-pointer"
                tabIndex={-1}
              >
                <span className="material-symbols-outlined text-base">{showPassword ? "visibility_off" : "visibility"}</span>
              </button>
            </div>
          </div>

          {error && (
            <p className="text-[10px] text-error flex items-center gap-1 px-1 font-bold">
              <span className="material-symbols-outlined text-xs">error</span>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="primary-glow w-full bg-primary text-black font-syne font-bold py-3 rounded-lg hover:scale-[1.01] active:scale-95 transition-all cursor-pointer text-xs uppercase tracking-wider disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <>
                <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>
                Signing in…
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
