"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { COURSES_MAP } from "@/lib/courses-data";

function getCoursePaymentInfo(courseId: string) {
  const course = COURSES_MAP[courseId] || COURSES_MAP["beginner-web-design"];
  return {
    id: course.id,
    name: course.title,
    tuition: course.tuitionGhs,
    admission: course.admissionGhs,
    total: course.tuitionGhs,
    img: course.img,
  };
}

type SubmitState = "idle" | "loading" | "success" | "error";

function BalancePaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = searchParams.get("course") || "beginner-web-design";
  const courseInfo = getCoursePaymentInfo(courseId);

  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes in seconds
  const [promoCode, setPromoCode] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [loadingUser, setLoadingUser] = useState(true);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  // Pre-fill user info from Supabase auth session
  useEffect(() => {
    const loadUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email || "");
      } else {
        router.push(`/auth/login?next=${encodeURIComponent(`/payment/balance?course=${courseId}`)}`);
      }
      setLoadingUser(false);
    };
    loadUser();
  }, [courseId, router]);

  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return {
      min: minutes.toString().padStart(2, "0"),
      sec: seconds.toString().padStart(2, "0"),
    };
  };

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitState("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/payment/enrol", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId,
          paymentType: "balance",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Payment processing failed.");
      }

      if (data.authorizationUrl) {
        setSubmitState("success");
        window.location.href = data.authorizationUrl;
      } else {
        throw new Error("Payment gateway did not return checkout link.");
      }
    } catch (err: unknown) {
      setSubmitState("error");
      const message = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setErrorMsg(message);
    }
  };

  const time = formatTime();

  if (loadingUser) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <span className="material-symbols-outlined text-primary text-4xl animate-spin">progress_activity</span>
      </div>
    );
  }

  return (
    <div className="bg-background text-on-background font-body-md selection:bg-primary selection:text-background min-h-screen">
      {/* TopNavBar */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 py-4 bg-surface/70 backdrop-blur-xl border-b border-white/10 max-w-[1280px] mx-auto left-1/2 -translate-x-1/2">
        <Link href="/" className="font-syne text-display-md font-bold text-primary tracking-tighter text-2xl">
          KHODZ ACADEMY
        </Link>
        <div className="flex items-center gap-4 text-xs">
          <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary">notifications</span>
          <div className="w-10 h-10 rounded-full bg-surface-container-high border border-white/10 flex items-center justify-center overflow-hidden">
            <span className="material-symbols-outlined text-on-surface-variant text-xl">account_circle</span>
          </div>
        </div>
      </header>

      <main className="pt-32 pb-20 px-6 max-w-[1280px] mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="font-syne text-display-md text-3xl font-extrabold mb-2 text-white">Complete Your Enrollment</h1>
          <p className="text-on-surface-variant text-sm max-w-2xl">
            Secure your spot in the {courseInfo.name} course. Your seat is temporarily held while you finalize the payment.
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Payment Methods & Actions */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Countdown Timer */}
            <div className="glass-card p-6 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs">
                <span className="material-symbols-outlined text-tertiary-container animate-pulse">timer</span>
                <span className="font-label-md text-on-surface-variant font-bold uppercase tracking-wider">Payment Deadline</span>
              </div>
              <div className="flex gap-2 text-xs" id="countdown">
                <div className="countdown-segment px-3 py-2 rounded text-primary font-bold text-sm bg-white/5 border border-white/10">
                  {time.min}
                </div>
                <span className="text-primary font-bold self-center text-sm">:</span>
                <div className="countdown-segment px-3 py-2 rounded text-primary font-bold text-sm bg-white/5 border border-white/10">
                  {time.sec}
                </div>
              </div>
            </div>

            {/* Error banner */}
            {submitState === "error" && (
              <div className="mb-6 bg-error/10 border border-error/30 rounded-lg p-4 flex items-start gap-3">
                <span className="material-symbols-outlined text-error text-xl">error</span>
                <div>
                  <p className="font-bold text-error text-sm">Payment Failed</p>
                  <p className="text-on-surface-variant text-xs mt-1">{errorMsg}</p>
                </div>
              </div>
            )}

            {/* Paystack UI checkout trigger */}
            <div className="glass-card rounded-xl overflow-hidden inner-glow">
              <div className="bg-surface-container-high p-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs">
                  <span className="material-symbols-outlined text-primary text-lg">account_balance_wallet</span>
                  <span className="font-syne font-bold text-sm text-white">Secure Payment</span>
                </div>
                <span className="text-xs text-on-surface-variant">Paystack Secured</span>
              </div>
              
              <div className="p-6">
                <form onSubmit={handlePay} className="space-y-4 text-xs">
                  <p className="text-on-surface-variant leading-relaxed mb-4 text-sm">
                    You are paying the remaining balance of <span className="text-white font-bold">GHS {courseInfo.total.toFixed(2)}</span> for <span className="text-white font-bold">{courseInfo.name}</span>. Click the button below to open Paystack secure portal.
                  </p>
                  <button
                    className="w-full bg-primary text-black font-bold py-4 rounded-lg flex items-center justify-center gap-2 active:scale-95 transition-all primary-glow mt-4 cursor-pointer text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(69,236,157,0.2)] disabled:opacity-60"
                    type="submit"
                    disabled={submitState === "loading" || submitState === "success"}
                  >
                    {submitState === "loading" ? "Redirecting to Paystack..." : `Pay Balance GHS ${courseInfo.total.toFixed(2)}`}
                    <span className="material-symbols-outlined text-lg">arrow_forward</span>
                  </button>
                </form>
              </div>
              <div className="bg-surface-container-low p-4 text-center border-t border-white/5 text-[10px]">
                <p className="text-on-surface-variant flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-sm">lock</span>
                  Encrypted with 256-bit SSL security
                </p>
              </div>
            </div>

            {/* Trust Signals */}
            <div className="grid grid-cols-3 gap-4 text-xs font-semibold">
              <div className="glass-card p-4 rounded-lg text-center flex flex-col items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">verified_user</span>
                <span>Secure Data</span>
              </div>
              <div className="glass-card p-4 rounded-lg text-center flex flex-col items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">history</span>
                <span>Refund Policy</span>
              </div>
              <div className="glass-card p-4 rounded-lg text-center flex flex-col items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">support_agent</span>
                <span>24/7 Support</span>
              </div>
            </div>
          </div>

          {/* Right Column: Summary Breakdown */}
          <div className="lg:col-span-5">
            <div className="sticky top-32 glass-card rounded-xl p-6 inner-glow">
              <h2 className="font-syne text-headline-md text-sm font-bold mb-4 text-white">Order Summary</h2>
              
              {/* Breakdown */}
              <div className="space-y-3 mb-6 text-xs text-on-surface-variant">
                <div className="flex justify-between items-center">
                  <span>Tuition / Course Fee</span>
                  <span className="text-on-surface font-semibold">GHS {courseInfo.tuition.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Admission Registration Fee</span>
                  <span className="text-secondary font-bold">-GHS {courseInfo.admission.toFixed(2)}</span>
                </div>
                <div className="h-px bg-white/10 my-4"></div>
                <div className="flex justify-between items-center text-sm mt-4">
                  <div className="flex flex-col">
                    <span className="font-syne text-headline-md font-bold text-white">Remaining Balance</span>
                    <span className="text-[10px] text-on-surface-variant font-semibold">Due now</span>
                  </div>
                  <span className="font-syne text-primary text-base font-bold">GHS {courseInfo.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Selected Program Info */}
              <div className="bg-surface-container-high rounded-lg p-4 border border-white/5 flex gap-4 text-xs">
                <div className="w-20 h-20 bg-surface rounded overflow-hidden flex-shrink-0">
                  <img
                    alt="Course Thumbnail"
                    className="w-full h-full object-cover"
                    src={courseInfo.img}
                  />
                </div>
                <div>
                  <span className="inline-block bg-secondary-container text-on-secondary-container text-[10px] uppercase font-bold px-2 py-0.5 rounded-sm mb-1 tracking-widest">
                    Premium Track
                  </span>
                  <h3 className="font-bold text-on-surface leading-tight mt-1 text-xs">
                    {courseInfo.name}
                  </h3>
                  <p className="text-[10px] text-on-surface-variant mt-1">Cohort 04</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-8 px-6 flex flex-col md:flex-row justify-between items-center border-t border-white/10 bg-background max-w-[1280px] mx-auto gap-4">
        <div className="text-center md:text-left">
          <span className="font-syne text-headline-md text-primary font-bold text-lg">KHODZ ACADEMY</span>
          <p className="text-xs text-on-surface-variant">© 2024 Khodz Academy. All rights reserved.</p>
        </div>
        <div className="flex gap-4 text-xs font-semibold">
          <a className="hover:text-primary underline transition-opacity duration-200" href="#">Terms of Service</a>
          <a className="hover:text-primary underline transition-opacity duration-200" href="#">Privacy Policy</a>
          <a className="hover:text-primary underline transition-opacity duration-200" href="#">Refund Policy</a>
          <a className="hover:text-primary underline transition-opacity duration-200" href="#">Contact</a>
        </div>
      </footer>
    </div>
  );
}

export default function BalancePaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <span className="material-symbols-outlined text-primary text-4xl animate-spin">progress_activity</span>
      </div>
    }>
      <BalancePaymentContent />
    </Suspense>
  );
}
