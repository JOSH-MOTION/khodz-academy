"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { COURSES_MAP } from "@/lib/courses-data";

// Dynamically generate payment details for any course from the shared library
function getCoursePaymentInfo(courseId: string, option: "admission" | "full") {
  const course = COURSES_MAP[courseId] || COURSES_MAP["beginner-web-design"];
  const isBootcamp = course.id === "beginner-web-design";
  const isVacation = course.id.includes("vacation");

  let baseAmount = option === "admission" ? course.admissionGhs : (course.admissionGhs + course.tuitionGhs);
  
  let platformFee = 50;
  if (option === "admission") {
    if (course.admissionGhs === 250) platformFee = 25;
    else if (course.admissionGhs === 200) platformFee = 20;
    else if (course.admissionGhs === 100) platformFee = 15;
  } else {
    platformFee = 100; // Flat platform fee for full tuition
  }
  
  const netPrice = baseAmount - platformFee;

  return {
    id: course.id,
    name: course.title,
    cohort: isBootcamp 
      ? "Phase 1 - Introductory Bootcamp" 
      : isVacation 
        ? "Vacation Program - Cohort 01" 
        : "Cohort 04",
    price: `GHS ${netPrice.toFixed(2)}`,
    fee: `GHS ${platformFee.toFixed(2)}`,
    total: `GHS ${baseAmount.toFixed(2)}`,
    feeLabel: (isBootcamp || isVacation) ? "Registration processing fee" : "Platform access fee",
    admissionGhs: course.admissionGhs,
    tuitionGhs: course.tuitionGhs,
    totalGhs: course.admissionGhs + course.tuitionGhs,
  };
}

type SubmitState = "idle" | "loading" | "success" | "error" | "already_enrolled";

function AdmissionPaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = searchParams.get("course") || "beginner-web-design";
  
  const [paymentOption, setPaymentOption] = useState<"admission" | "full">("admission");
  const courseInfo = getCoursePaymentInfo(courseId, paymentOption);

  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [loadingUser, setLoadingUser] = useState(true);

  // Pre-fill user info from Supabase auth session
  useEffect(() => {
    const loadUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setFormData({
          name: user.user_metadata?.full_name || user.user_metadata?.name || "",
          email: user.email || "",
          phone: user.user_metadata?.phone || "",
        });
      } else {
        // Redirect to login with next param
        router.push(`/auth/login?next=${encodeURIComponent(`/payment/admission?course=${courseId}`)}`);
      }
      setLoadingUser(false);
    };
    loadUser();
  }, [courseId, router]);

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
          paymentType: paymentOption === "admission" ? "admission" : "full",
          name: formData.name,
          phone: formData.phone,
        }),
      });

      const data = await res.json();

      if (res.status === 409) {
        setSubmitState("already_enrolled");
        return;
      }

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

  if (loadingUser) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <span className="material-symbols-outlined text-primary text-4xl animate-spin">progress_activity</span>
      </div>
    );
  }

  return (
    <div className="bg-background text-on-background font-body-md selection:bg-primary selection:text-background min-h-screen">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 py-4 bg-surface/70 backdrop-blur-xl border-b border-white/10 max-w-[1280px] mx-auto left-1/2 -translate-x-1/2">
        <Link href="/" className="font-syne text-2xl font-bold text-primary tracking-tighter">
          KHODZ ACADEMY
        </Link>
        <div className="flex items-center gap-2 text-xs">
          <span className="material-symbols-outlined text-sm">lock</span>
          <span className="font-semibold text-on-surface-variant">Secure Checkout</span>
        </div>
      </header>

      <main className="pt-32 pb-20 px-6 max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Order Summary */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-2 text-primary text-xs font-bold">
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              <Link className="uppercase tracking-widest hover:underline" href={`/courses/${courseId}`}>
                Back to Course
              </Link>
            </div>

            <h1 className="font-syne text-3xl font-extrabold leading-tight">Complete Your Enrollment</h1>
            <p className="text-on-surface-variant text-sm">
              Unlock access to high-performance learning modules and the elite developer community.
            </p>

            {/* Order box */}
            <div className="glass-panel p-6 rounded-xl space-y-4 border-t-2 border-primary">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-syne text-base font-bold">{courseInfo.name}</h3>
                  <p className="text-on-surface-variant text-xs mt-1">{courseInfo.cohort}</p>
                </div>
              </div>
              <div className="pt-4 border-t border-white/5 space-y-2 text-xs text-on-surface-variant">
                {paymentOption === "admission" ? (
                  <div className="flex justify-between">
                    <span>Admission Fee Only</span>
                    <span className="font-bold text-white">GHS {courseInfo.admissionGhs.toFixed(2)}</span>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between">
                      <span>Admission Fee</span>
                      <span>GHS {courseInfo.admissionGhs.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tuition Fee</span>
                      <span>GHS {courseInfo.tuitionGhs.toFixed(2)}</span>
                    </div>
                  </>
                )}
                <div className="flex justify-between">
                  <span>{courseInfo.feeLabel}</span>
                  <span>{courseInfo.fee}</span>
                </div>
                <div className="flex justify-between font-bold text-on-surface pt-2 text-sm text-white border-t border-white/5 mt-2">
                  <span>Total Amount</span>
                  <span className="text-primary font-bold text-base">{courseInfo.total}</span>
                </div>
              </div>
            </div>

            {/* Highlight Image */}
            <div className="rounded-xl overflow-hidden relative h-48 border border-white/10 group">
              <img
                alt="Coding environment"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCebIb2aAdSb9JqQ-2xhmiEEv8GaJMUEJ9OJiN8hgyc3cbVxU2HWjwFmBMTd5LJsNV88qglEqSH1W8-7MZUvAKuOJqvQt9PZYCruWpIi7TWR3w7hDVXyVS_fCjko1wKlMSkoMKhz8wJRbKC22qHpWW0BsJdYpIssjC1L5BZHS_xFLKNp9qUoNWWlWE3o8M0Pu-A7uqc-K2V6ptuMrBia43fVJjMPfGtVdBk1nkMrOQYMOgGmsodtj9m12fR8dCZn9bJyQ9RO7H3jOA"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-4 left-4">
                <span className="bg-primary/20 text-primary text-[10px] font-bold px-2 py-1 rounded border border-primary/30 uppercase tracking-tighter">
                  Premium Track
                </span>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="flex items-center gap-3 p-3 rounded-lg border border-white/5 bg-surface-container-low">
                <span className="material-symbols-outlined text-primary text-xl">verified_user</span>
                <div className="leading-tight">
                  <p className="font-bold text-white">Encrypted</p>
                  <p className="text-[10px] text-on-surface-variant">256-bit AES Security</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg border border-white/5 bg-surface-container-low">
                <span className="material-symbols-outlined text-primary text-xl">workspace_premium</span>
                <div className="leading-tight">
                  <p className="font-bold text-white">Certification</p>
                  <p className="text-[10px] text-on-surface-variant">Industry Recognized</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Payment Form */}
          <div className="lg:col-span-7">
            <div className="glass-panel p-6 rounded-xl relative overflow-hidden">
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />

              {/* Already enrolled banner */}
              {submitState === "already_enrolled" && (
                <div className="mb-6 bg-primary/20 border border-primary/30 rounded-lg p-4 flex items-start gap-3 animate-fade-in">
                  <span className="material-symbols-outlined text-primary text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  <div>
                    <p className="font-bold text-primary text-sm">You&apos;re already enrolled!</p>
                    <p className="text-on-surface-variant text-xs mt-1">You already have access to this course. Head to your dashboard.</p>
                    <Link href="/student-dashboard" className="mt-3 inline-block bg-primary text-black font-bold text-xs px-4 py-2 rounded-lg">
                      Go to Dashboard →
                    </Link>
                  </div>
                </div>
              )}

              {/* Success banner */}
              {submitState === "success" && (
                <div className="mb-6 bg-primary/20 border border-primary/30 rounded-lg p-4 flex items-start gap-3 animate-fade-in">
                  <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  <div>
                    <p className="font-bold text-primary text-sm">Redirecting to Paystack... 🎉</p>
                  </div>
                </div>
              )}

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

              <form onSubmit={handlePay} className="space-y-6 relative z-10">
                
                {/* Choice selection */}
                <div className="space-y-3">
                  <label className="text-white font-bold text-sm">Choose Payment Option</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div 
                      onClick={() => setPaymentOption("admission")}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentOption === "admission" ? "border-primary bg-primary/5" : "border-white/10 hover:border-primary/50"}`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="material-symbols-outlined text-primary text-lg">payments</span>
                        <span className="text-white font-bold text-xs">Admission Only</span>
                      </div>
                      <p className="text-[10px] text-on-surface-variant leading-relaxed">
                        Pay GHS {courseInfo.admissionGhs.toFixed(2)} to secure admission. The remaining tuition can be paid in installments.
                      </p>
                    </div>

                    <div 
                      onClick={() => setPaymentOption("full")}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentOption === "full" ? "border-primary bg-primary/5" : "border-white/10 hover:border-primary/50"}`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="material-symbols-outlined text-primary text-lg">local_atm</span>
                        <span className="text-white font-bold text-xs">Full Payment</span>
                      </div>
                      <p className="text-[10px] text-on-surface-variant leading-relaxed">
                        Pay GHS {courseInfo.totalGhs.toFixed(2)} full tuition + admission at once to unlock the entire course.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h2 className="font-syne text-lg font-bold text-white">Registrant Information</h2>
                  <p className="text-on-surface-variant text-xs">
                    Ensure your details match your official identification for certification.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-2 flex flex-col">
                    <label className="text-on-surface-variant font-semibold">Full Name</label>
                    <input
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-[#0d1510] border border-white/10 rounded-lg p-3 outline-none focus:border-primary transition-all text-white"
                      placeholder="Kojo Mensah"
                      type="text"
                    />
                  </div>
                  <div className="space-y-2 flex flex-col">
                    <label className="text-on-surface-variant font-semibold">Email Address</label>
                    <input
                      required
                      value={formData.email}
                      readOnly
                      className="w-full bg-[#0d1510] border border-white/10 rounded-lg p-3 outline-none text-white/60 cursor-not-allowed"
                      placeholder="kojo@example.com"
                      type="email"
                      title="Email comes from your account"
                    />
                  </div>
                </div>

                <div className="space-y-2 flex flex-col text-xs">
                  <label className="text-on-surface-variant font-semibold">Phone Number (WhatsApp Preferred)</label>
                  <div className="flex gap-2">
                    <div className="w-24 bg-surface-container-high border border-white/10 rounded-lg p-3 flex items-center justify-center font-bold text-white">
                      🇬🇭 +233
                    </div>
                    <input
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="flex-1 bg-[#0d1510] border border-white/10 rounded-lg p-3 outline-none focus:border-primary transition-all text-white"
                      placeholder="24 000 0000"
                      type="tel"
                    />
                  </div>
                </div>

                <div className="pt-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <h3 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                      Payment Method
                    </h3>
                    <div className="flex gap-2 text-on-surface-variant opacity-60">
                      <span className="material-symbols-outlined text-[20px]">credit_card</span>
                      <span className="material-symbols-outlined text-[20px]">account_balance_wallet</span>
                    </div>
                  </div>

                  <button
                    className="w-full bg-primary text-black font-bold py-4 rounded-lg flex items-center justify-center gap-2 active:scale-95 transition-all shadow-[0_0_20px_rgba(69,236,157,0.2)] hover:shadow-[0_0_30px_rgba(69,236,157,0.4)] text-xs uppercase tracking-wider cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    type="submit"
                    disabled={submitState === "loading" || submitState === "success" || submitState === "already_enrolled"}
                  >
                    {submitState === "loading" ? (
                      <>
                        <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>
                        Processing…
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-lg">payments</span>
                        Pay with Paystack – {courseInfo.total}
                      </>
                    )}
                  </button>

                  <p className="text-center text-on-surface-variant text-[10px] leading-relaxed">
                    By clicking the button above, you agree to our{" "}
                    <a className="text-primary hover:underline" href="#">Terms of Service</a>{" "}
                    and{" "}
                    <a className="text-primary hover:underline" href="#">Refund Policy</a>.
                    Payments are processed securely via Paystack.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-8 px-6 flex flex-col md:flex-row justify-between items-center border-t border-white/10 bg-background max-w-[1280px] mx-auto gap-4">
        <div className="font-syne text-primary font-bold text-lg">KHODZ ACADEMY</div>
        <div className="flex flex-wrap justify-center gap-4 text-xs font-semibold">
          <a className="hover:text-primary underline transition-opacity duration-200 uppercase" href="#">Terms of Service</a>
          <a className="hover:text-primary underline transition-opacity duration-200 uppercase" href="#">Privacy Policy</a>
          <a className="hover:text-primary underline transition-opacity duration-200 uppercase" href="#">Refund Policy</a>
          <a className="hover:text-primary underline transition-opacity duration-200 uppercase" href="#">Contact</a>
        </div>
        <p className="text-on-surface-variant text-xs">© 2024 Khodz Academy. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default function AdmissionPaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <span className="material-symbols-outlined text-primary text-4xl animate-spin">progress_activity</span>
      </div>
    }>
      <AdmissionPaymentContent />
    </Suspense>
  );
}
