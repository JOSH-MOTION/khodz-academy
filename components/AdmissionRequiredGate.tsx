"use client";

import Link from "next/link";

/** Shown instead of a silent redirect when a logged-in user has no
 * enrolment yet — explains why they can't see anything and what to do. */
export default function AdmissionRequiredGate() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center glass-card rounded-2xl border border-white/10 p-10">
        <div
          className="w-16 h-16 mx-auto rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-6"
          style={{ boxShadow: "0 0 30px rgba(69,236,157,0.15)" }}
        >
          <span className="material-symbols-outlined text-3xl">lock</span>
        </div>
        <h1 className="font-syne text-xl font-bold text-on-surface mb-2">Purchase Admission to Continue</h1>
        <p className="text-sm text-on-surface-variant leading-relaxed mb-8">
          You&apos;re signed in, but you&apos;re not enrolled in a course yet. Browse our programmes and complete admission to unlock your dashboard, videos, and slides.
        </p>
        <Link
          href="/courses"
          className="inline-flex items-center gap-2 bg-primary text-black font-bold py-3 px-8 rounded-lg hover:brightness-110 active:scale-95 transition-all text-sm"
        >
          Browse Courses
          <span className="material-symbols-outlined text-base">arrow_forward</span>
        </Link>
      </div>
    </div>
  );
}
