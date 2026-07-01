"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface AdminPinGuardProps {
  children: React.ReactNode;
}

export default function AdminPinGuard({ children }: AdminPinGuardProps) {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isPinVerified, setIsPinVerified] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth/login?next=" + window.location.pathname);
        return;
      }
      
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      
      if (profile && profile.role === "admin") {
        setIsAdmin(true);
        if (sessionStorage.getItem("admin_pin_verified") === "true") {
          setIsPinVerified(true);
        }
      } else {
        router.push("/student-dashboard");
      }
    };
    checkAuth();
  }, [router]);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPin = process.env.NEXT_PUBLIC_ADMIN_PIN || "4321";
    if (pinInput === correctPin) {
      sessionStorage.setItem("admin_pin_verified", "true");
      setIsPinVerified(true);
    } else {
      setPinError("Incorrect PIN. Access Denied.");
      setPinInput("");
    }
  };

  if (isAdmin === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <span className="material-symbols-outlined text-primary text-4xl animate-spin">progress_activity</span>
      </div>
    );
  }

  if (!isPinVerified) {
    return (
      <div className="min-h-screen bg-[#010d1a] flex items-center justify-center px-4 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="w-full max-w-sm glass-card border border-white/10 rounded-xl p-8 shadow-2xl flex flex-col items-center gap-6 relative z-10">
          <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary"
            style={{ boxShadow: "0 0 30px rgba(10, 207, 131, 0.15)" }}>
            <span className="material-symbols-outlined text-3xl">admin_panel_settings</span>
          </div>

          <div className="text-center space-y-1">
            <h2 className="font-syne text-lg font-bold text-white tracking-tight">Admin Passcode Required</h2>
            <p className="text-[11px] text-on-surface-variant max-w-[280px]">
              Access restricted to system administrators. Please enter your secondary access PIN.
            </p>
          </div>

          <form onSubmit={handleVerify} className="w-full space-y-4">
            <div className="space-y-1.5 flex flex-col">
              <div className="input-glow flex items-center bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2.5 transition-all">
                <span className="material-symbols-outlined text-outline text-lg mr-2">lock</span>
                <input
                  type="password"
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value);
                    setPinError("");
                  }}
                  placeholder="••••"
                  maxLength={10}
                  className="bg-transparent border-none text-center tracking-[0.3em] font-mono text-lg w-full text-on-surface placeholder:text-outline/30 outline-none focus:ring-0"
                  autoFocus
                />
              </div>
              {pinError && (
                <p className="text-[10px] text-error flex items-center justify-center gap-1 mt-1 font-bold">
                  <span className="material-symbols-outlined text-xs">error</span>
                  {pinError}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="primary-glow w-full bg-primary text-black font-syne font-bold py-3 rounded-lg hover:scale-[1.01] active:scale-95 transition-all cursor-pointer text-xs uppercase tracking-wider"
              style={{ boxShadow: "0 0 15px rgba(69,236,157,0.2)" }}
            >
              Verify passcode
            </button>
          </form>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
