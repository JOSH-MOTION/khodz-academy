"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

/* ─── tiny animated dot ─────────────────────────────────────────── */
function Particle({ x, y, size, speed }: { x: number; y: number; size: number; speed: number }) {
  const style: React.CSSProperties = {
    position: "absolute",
    left: `${x}%`,
    top: `${y}%`,
    width: size,
    height: size,
    borderRadius: "50%",
    background: "rgba(69,236,157,0.18)",
    animation: `float ${speed}s ease-in-out infinite alternate`,
    pointerEvents: "none",
  };
  return <div style={style} />;
}

const particles = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 5 + 2,
  speed: Math.random() * 4 + 3,
}));

/* ─── Input Field ────────────────────────────────────────────────── */
function Field({
  label,
  type,
  placeholder,
  icon,
  value,
  onChange,
  error,
  extra,
}: {
  label: string;
  type: string;
  placeholder: string;
  icon: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  extra?: React.ReactNode;
}) {
  const [showPw, setShowPw] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPw ? "text" : "password") : type;

  return (
    <div className="space-y-1.5 flex flex-col">
      <div className="flex justify-between items-center">
        <label className="text-on-surface-variant px-1 text-xs font-medium">{label}</label>
        {extra}
      </div>
      <div
        className={`input-glow flex items-center bg-surface-container-low border rounded-lg px-3 py-2.5 focus-within:ring-1 focus-within:ring-primary transition-all ${
          error ? "border-error" : "border-outline-variant"
        }`}
      >
        <span className="material-symbols-outlined text-outline text-lg mr-2">{icon}</span>
        <input
          className="bg-transparent border-none focus:ring-0 w-full text-on-surface placeholder:text-outline/50 text-sm outline-none"
          placeholder={placeholder}
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={isPassword ? "current-password" : type === "email" ? "email" : "off"}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPw((p) => !p)}
            className="text-outline hover:text-primary transition-colors ml-1 cursor-pointer"
            tabIndex={-1}
          >
            <span className="material-symbols-outlined text-base">
              {showPw ? "visibility_off" : "visibility"}
            </span>
          </button>
        )}
      </div>
      {error && (
        <p className="text-[10px] text-error flex items-center gap-1 px-1">
          <span className="material-symbols-outlined text-[12px]">error</span>
          {error}
        </p>
      )}
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────────────── */
function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get("next") || "/student-dashboard";
  const cardRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"login" | "register">("login");

  const handleGoogleLogin = async () => {
    try {
      const supabase = createClient();
      // Use NEXT_PUBLIC_SITE_URL on production (set in Vercel env vars) to avoid localhost redirects
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${siteUrl}/api/auth/callback?next=${encodeURIComponent(nextUrl)}`,
        },
      });
      if (error) throw error;
    } catch (err) {
      console.error("Google sign in failed:", err);
      alert("Failed to initiate Google sign in. Please verify your Supabase configuration and keys.");
    }
  };

  /* Login state */
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginErrors, setLoginErrors] = useState<{ email?: string; password?: string }>({});
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  /* Register state */
  const [regName, setRegName] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regTerms, setRegTerms] = useState(false);
  const [regErrors, setRegErrors] = useState<Record<string, string>>({});
  const [regLoading, setRegLoading] = useState(false);
  const [regSuccess, setRegSuccess] = useState(false);

  /* Parallax tilt */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const card = cardRef.current;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x > 0 && x < rect.width && y > 0 && y < rect.height) {
        const rx = (y - rect.height / 2) / 25;
        const ry = (x - rect.width / 2) / -25;
        card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg)`;
      } else {
        card.style.transform = "perspective(1000px) rotateX(0) rotateY(0)";
      }
    };
    document.addEventListener("mousemove", handler);
    return () => document.removeEventListener("mousemove", handler);
  }, []);

  /* ── Validate login ── */
  function validateLogin() {
    const errs: typeof loginErrors = {};
    if (!loginEmail) errs.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(loginEmail)) errs.email = "Enter a valid email.";
    if (!loginPassword) errs.password = "Password is required.";
    else if (loginPassword.length < 6) errs.password = "Password must be at least 6 characters.";
    setLoginErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!validateLogin()) return;
    setLoginLoading(true);
    const supabase = createClient();
    supabase.auth.signInWithPassword({ email: loginEmail, password: loginPassword })
      .then(({ error }) => {
        setLoginLoading(false);
        if (error) {
          setLoginErrors({ email: error.message });
        } else {
          setLoginSuccess(true);
          setTimeout(() => router.push(nextUrl), 800);
        }
      });
  }

  /* ── Validate register ── */
  function validateRegister() {
    const errs: Record<string, string> = {};
    if (!regName.trim()) errs.name = "Full name is required.";
    if (!regEmail) errs.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(regEmail)) errs.email = "Enter a valid email.";
    if (!regPassword) errs.password = "Password is required.";
    else if (regPassword.length < 8) errs.password = "Password must be at least 8 characters.";
    if (!regTerms) errs.terms = "You must agree to the terms.";
    setRegErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (!validateRegister()) return;
    setRegLoading(true);
    const supabase = createClient();
    supabase.auth.signUp({
      email: regEmail,
      password: regPassword,
      options: { data: { full_name: regName, phone: regPhone } },
    }).then(({ error }) => {
      setRegLoading(false);
      if (error) {
        setRegErrors({ email: error.message });
      } else {
        setRegSuccess(true);
        setTimeout(() => router.push(nextUrl), 800);
      }
    });
  }

  function switchMode(next: "login" | "register") {
    setMode(next);
    setLoginErrors({});
    setRegErrors({});
  }

  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
      {/* ── Animated background ── */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <style>{`
          @keyframes float {
            from { transform: translateY(0px) scale(1); opacity: 0.3; }
            to   { transform: translateY(-18px) scale(1.15); opacity: 0.7; }
          }
          @keyframes auth-fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          .auth-anim { animation: auth-fade-in 0.4s ease-out forwards; }
        `}</style>
        {particles.map((p) => (
          <Particle key={p.id} {...p} />
        ))}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-primary/8 blur-[140px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-secondary-container/20 blur-[120px] rounded-full" />
      </div>

      {/* ── Main content ── */}
      <main className="flex-grow flex items-center justify-center relative z-10 px-6 py-12">
        <div className="w-full max-w-[480px]">

          {/* Brand */}
          <div className="flex flex-col items-center mb-8">
            <div className="mb-4 flex items-center justify-center w-16 h-16 rounded-xl bg-primary-container/20 border border-primary/20"
              style={{ boxShadow: "0 0 30px rgba(69,236,157,0.15)" }}>
              <span className="material-symbols-outlined text-primary text-[32px]"
                style={{ fontVariationSettings: "'FILL' 1" }}>school</span>
            </div>
            <h1 className="font-syne text-3xl font-bold text-primary tracking-tighter">KHODZ ACADEMY</h1>
            <p className="text-on-surface-variant text-center max-w-sm mt-2 text-sm leading-relaxed">
              Enter the ecosystem of high-performance technical mastery.
            </p>
          </div>

          {/* Card */}
          <div
            ref={cardRef}
            className="glass-card rounded-xl p-8 border border-white/5 shadow-2xl transition-transform duration-300 ease-out"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* ═══ LOGIN FORM ═══ */}
            {mode === "login" && (
              <div className="auth-anim">
                <h2 className="font-syne text-xl font-bold text-on-surface mb-6">Welcome Back</h2>

                {/* Google button */}
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full flex items-center justify-center gap-3 py-3 px-4 mb-6 rounded-lg bg-surface-container-high border border-outline-variant hover:bg-surface-container-highest transition-all duration-200 cursor-pointer text-sm font-semibold text-on-surface"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Continue with Google
                </button>

                {/* Divider */}
                <div className="relative flex items-center mb-6">
                  <div className="flex-grow border-t border-outline-variant" />
                  <span className="px-4 text-on-surface-variant text-[10px] tracking-widest font-semibold uppercase">or email</span>
                  <div className="flex-grow border-t border-outline-variant" />
                </div>

                {/* Success banner */}
                {loginSuccess && (
                  <div className="mb-4 bg-primary/20 text-primary border border-primary/30 p-3 rounded-lg flex items-center gap-2 text-xs font-bold auth-anim">
                    <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    Login successful! Redirecting…
                  </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4" noValidate>
                  <Field
                    label="Email Address"
                    type="email"
                    placeholder="name@company.com"
                    icon="alternate_email"
                    value={loginEmail}
                    onChange={setLoginEmail}
                    error={loginErrors.email}
                  />
                  <Field
                    label="Password"
                    type="password"
                    placeholder="••••••••"
                    icon="lock"
                    value={loginPassword}
                    onChange={setLoginPassword}
                    error={loginErrors.password}
                    extra={
                      <a href="#" className="text-primary hover:underline text-[10px] font-semibold">
                        Forgot password?
                      </a>
                    }
                  />
                  <button
                    type="submit"
                    disabled={loginLoading || loginSuccess}
                    className="primary-glow w-full bg-primary text-black font-syne font-bold py-3 rounded-lg transition-all active:scale-95 duration-150 mt-2 cursor-pointer text-xs uppercase tracking-wider disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {loginLoading ? (
                      <>
                        <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>
                        Signing in…
                      </>
                    ) : "LOG IN"}
                  </button>
                </form>

                <p className="mt-6 text-center text-on-surface-variant text-xs">
                  New to the Academy?{" "}
                  <button className="text-primary font-bold hover:underline cursor-pointer" onClick={() => switchMode("register")}>
                    Create Account
                  </button>
                </p>
              </div>
            )}

            {/* ═══ REGISTER FORM ═══ */}
            {mode === "register" && (
              <div className="auth-anim">
                <h2 className="font-syne text-xl font-bold text-on-surface mb-6">Join Khodz</h2>

                {/* Success banner */}
                {regSuccess && (
                  <div className="mb-4 bg-primary/20 text-primary border border-primary/30 p-3 rounded-lg flex items-center gap-2 text-xs font-bold auth-anim">
                    <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    Account created! Redirecting…
                  </div>
                )}

                <form onSubmit={handleRegister} className="space-y-4" noValidate>
                  {/* Name + Phone row */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5 flex flex-col">
                      <label className="text-on-surface-variant px-1 text-xs font-medium">Full Name</label>
                      <div className={`input-glow flex items-center bg-surface-container-low border rounded-lg px-3 py-2.5 transition-all ${regErrors.name ? "border-error" : "border-outline-variant"}`}>
                        <input
                          className="bg-transparent border-none focus:ring-0 w-full text-on-surface placeholder:text-outline/50 text-sm outline-none"
                          placeholder="John Doe"
                          type="text"
                          value={regName}
                          onChange={(e) => setRegName(e.target.value)}
                        />
                      </div>
                      {regErrors.name && <p className="text-[10px] text-error px-1">{regErrors.name}</p>}
                    </div>
                    <div className="space-y-1.5 flex flex-col">
                      <label className="text-on-surface-variant px-1 text-xs font-medium">Phone</label>
                      <div className="input-glow flex items-center bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2.5 transition-all">
                        <input
                          className="bg-transparent border-none focus:ring-0 w-full text-on-surface placeholder:text-outline/50 text-sm outline-none"
                          placeholder="+1 (555) 000"
                          type="tel"
                          value={regPhone}
                          onChange={(e) => setRegPhone(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <Field
                    label="Email Address"
                    type="email"
                    placeholder="name@company.com"
                    icon="mail"
                    value={regEmail}
                    onChange={setRegEmail}
                    error={regErrors.email}
                  />
                  <Field
                    label="Password"
                    type="password"
                    placeholder="Min. 8 characters"
                    icon="key"
                    value={regPassword}
                    onChange={setRegPassword}
                    error={regErrors.password}
                  />

                  {/* Password strength meter */}
                  {regPassword.length > 0 && (
                    <div className="space-y-1">
                      <div className="flex gap-1 h-1">
                        {[1, 2, 3, 4].map((lvl) => {
                          const strength = regPassword.length >= 12 ? 4 : regPassword.length >= 10 ? 3 : regPassword.length >= 8 ? 2 : 1;
                          return (
                            <div
                              key={lvl}
                              className={`flex-1 rounded-full transition-all ${
                                lvl <= strength
                                  ? strength === 4 ? "bg-primary" : strength === 3 ? "bg-primary/70" : strength === 2 ? "bg-amber-400" : "bg-error"
                                  : "bg-surface-variant"
                              }`}
                            />
                          );
                        })}
                      </div>
                      <p className="text-[10px] text-on-surface-variant px-1">
                        {regPassword.length >= 12 ? "Strong password ✓" : regPassword.length >= 8 ? "Moderate — add more characters" : "Weak — min. 8 characters"}
                      </p>
                    </div>
                  )}

                  {/* Terms */}
                  <div className="flex items-start gap-3 py-1">
                    <input
                      className="mt-1 bg-surface-container border-outline-variant rounded text-primary focus:ring-primary cursor-pointer"
                      id="terms"
                      type="checkbox"
                      checked={regTerms}
                      onChange={(e) => setRegTerms(e.target.checked)}
                    />
                    <label className="text-on-surface-variant leading-snug text-[11px] cursor-pointer" htmlFor="terms">
                      I agree to the{" "}
                      <a className="text-primary hover:underline" href="#">Terms of Service</a>{" "}
                      and{" "}
                      <a className="text-primary hover:underline" href="#">Privacy Policy</a>.
                    </label>
                  </div>
                  {regErrors.terms && (
                    <p className="text-[10px] text-error flex items-center gap-1 -mt-2">
                      <span className="material-symbols-outlined text-[12px]">error</span>
                      {regErrors.terms}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={regLoading || regSuccess}
                    className="primary-glow w-full bg-primary text-black font-syne font-bold py-3 rounded-lg transition-all active:scale-95 duration-150 cursor-pointer text-xs uppercase tracking-wider disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
                  >
                    {regLoading ? (
                      <>
                        <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>
                        Creating account…
                      </>
                    ) : "CREATE ACCOUNT"}
                  </button>
                </form>

                <p className="mt-6 text-center text-on-surface-variant text-xs">
                  Already have an account?{" "}
                  <button className="text-primary font-bold hover:underline cursor-pointer" onClick={() => switchMode("login")}>
                    Log In
                  </button>
                </p>
              </div>
            )}
          </div>

          {/* Trust badges */}
          <div className="mt-8 flex justify-center items-center gap-8 opacity-40 hover:opacity-100 transition-opacity duration-500">
            <div className="flex items-center gap-1.5 text-[10px] tracking-widest font-semibold uppercase text-on-surface-variant">
              <span className="material-symbols-outlined text-xs">verified_user</span>
              SECURE AES-256
            </div>
            <div className="w-px h-4 bg-outline-variant" />
            <div className="flex items-center gap-1.5 text-[10px] tracking-widest font-semibold uppercase text-on-surface-variant">
              <span className="material-symbols-outlined text-xs">privacy_tip</span>
              GDPR COMPLIANT
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 px-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center bg-background/50 backdrop-blur-sm z-10 gap-3">
        <p className="text-on-surface-variant text-xs">© 2024 Khodz Academy. All rights reserved.</p>
        <div className="flex gap-6">
          {["Privacy Policy", "Terms of Service", "Contact"].map((item) => (
            <a key={item} href="#" className="text-xs text-on-surface-variant hover:text-primary transition-colors">
              {item}
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <span className="material-symbols-outlined text-primary text-4xl animate-spin">progress_activity</span>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
