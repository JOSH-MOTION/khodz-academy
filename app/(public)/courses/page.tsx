"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { COURSES } from "@/lib/courses-data";
import { CURRENT_COHORT } from "@/lib/cohorts";
import { createClient } from "@/lib/supabase/client";

interface CoursePricing {
  admission_ghs: number | null;
  tuition_ghs: number | null;
  promo_price_ghs: number | null;
}

export default function CoursesPage() {
  const [filter, setFilter] = useState("All");
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<Set<string>>(new Set());
  const [pricingById, setPricingById] = useState<Record<string, CoursePricing>>({});

  useEffect(() => {
    const loadEnrolments = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("enrolments").select("course_id").eq("student_id", user.id);
      setEnrolledCourseIds(new Set((data || []).map((e) => e.course_id)));
    };
    loadEnrolments();

    const loadPricing = async () => {
      const supabase = createClient();
      const { data } = await supabase.from("courses").select("id, admission_ghs, tuition_ghs, promo_price_ghs");
      if (!data) return;
      const map: Record<string, CoursePricing> = {};
      for (const row of data) {
        map[row.id] = { admission_ghs: row.admission_ghs, tuition_ghs: row.tuition_ghs, promo_price_ghs: row.promo_price_ghs };
      }
      setPricingById(map);
    };
    loadPricing();
  }, []);

  const filteredCourses = COURSES.filter((course) => {
    if (!course.active) return false;
    return filter === "All" || course.category === filter;
  });

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen">
      <Navbar />

      <main className="pt-32 pb-20 px-gutter max-w-container-max mx-auto max-w-[1280px] px-6">
        {/* Header Section */}
        <header className="mb-stack-lg flex flex-col md:flex-row md:items-end justify-between gap-stack-md gap-4 mb-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
              Admission in Progress — {CURRENT_COHORT}
            </div>
            <h1 className="font-syne text-display-lg text-primary mb-stack-sm text-3xl font-bold">Our Programmes</h1>
            <p className="text-on-surface-variant text-sm">
              Master the high-performance stack. Intense curriculums designed for software engineers who demand technical mastery.
            </p>
          </div>
          <div className="flex flex-wrap gap-stack-sm gap-2">
            {["All", "Beginner", "Design", "AI", "Full Stack"].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all border cursor-pointer ${
                  filter === cat
                    ? "bg-secondary-container text-on-secondary-container border-primary"
                    : "bg-surface-container text-on-surface-variant border-white/10 hover:border-primary"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-stack-lg gap-8">
          {/* Main List */}
          <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-stack-md gap-6">
            {filteredCourses.map((course) => {
              const isEnrolled = enrolledCourseIds.has(course.id);
              const pricing = pricingById[course.id];
              const admissionGhs = pricing?.admission_ghs ?? course.admissionGhs;
              const tuitionGhs = pricing?.tuition_ghs ?? course.tuitionGhs;
              const standardTotalGhs = admissionGhs + tuitionGhs;
              const promoPriceGhs = pricing?.promo_price_ghs ?? null;
              const hasPromo = promoPriceGhs != null && promoPriceGhs < standardTotalGhs;
              const displayTotalGhs = hasPromo ? promoPriceGhs : standardTotalGhs;
              return (
                <div key={course.id} className="glass-card glow-hover rounded-xl p-stack-md p-4 group transition-all duration-300 flex flex-col justify-between">
                  <div>
                    <div className="relative h-48 mb-stack-md rounded-lg overflow-hidden mb-4">
                      <img
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                        alt={course.title}
                        src={course.img}
                      />
                      <span className="absolute top-4 left-4 bg-primary text-background text-xs font-bold px-2 py-1 rounded text-black">
                        {course.duration.toUpperCase()}
                      </span>
                      {isEnrolled && (
                        <span className="absolute top-4 right-4 bg-background/90 text-primary text-[10px] font-bold px-2 py-1 rounded-full border border-primary/40 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                          Already Enrolled
                        </span>
                      )}
                    </div>
                    <h3 className="font-syne text-headline-md text-white mb-2 text-xl font-semibold leading-tight">{course.title}</h3>
                    <p className="text-on-surface-variant text-xs mb-stack-md mb-4 leading-relaxed">
                      {course.tagline}
                    </p>
                  </div>
                  <div className="flex flex-col border-t border-white/5 pt-stack-md pt-4 mt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-on-surface-variant text-xs">{course.category} • {course.level}</span>
                      <span className="text-primary font-bold text-sm flex items-baseline gap-1.5">
                        {hasPromo && course.id !== "beginner-web-design" && (
                          <span className="text-on-surface-variant text-[10px] line-through">GHS {standardTotalGhs.toLocaleString()}</span>
                        )}
                        {course.id === "beginner-web-design" ? "GHS 100 Reg." : `GHS ${displayTotalGhs.toLocaleString()}`}
                      </span>
                    </div>
                    {isEnrolled ? (
                      <Link href="/student-dashboard" className="mt-stack-md mt-4 w-full bg-primary/10 border border-primary/30 text-primary font-bold py-2 rounded-lg transition-all text-xs text-center hover:bg-primary hover:text-black">
                        Continue Learning
                      </Link>
                    ) : (
                      <Link href={`/courses/${course.id}`} className="mt-stack-md mt-4 w-full border border-white/20 hover:bg-white/5 text-on-surface font-bold py-2 rounded-lg transition-all text-xs text-center">
                        Learn More
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-3">
            <div className="sticky top-32 space-y-stack-lg space-y-6">
              {/* What's Included */}
              <div className="glass-card rounded-lg p-stack-md p-6 border border-white/10">
                <h4 className="font-syne text-headline-md text-primary mb-stack-md text-sm font-bold mb-4">What&apos;s included</h4>
                <ul className="space-y-stack-sm space-y-3">
                  {[
                    "Lifetime access to HD recording sessions.",
                    "Private Discord channel for 24/7 technical support.",
                    "Personalized code reviews from senior engineers.",
                    "Job placement assistance with partner tech firms.",
                    "Official Khodz Academy digital certification.",
                  ].map((text, i) => (
                    <li key={i} className="flex items-start gap-stack-sm gap-2">
                      <span className="material-symbols-outlined text-primary text-[16px] mt-0.5">check_circle</span>
                      <span className="text-xs text-on-surface-variant">{text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Payment Explainer */}
              <div className="bg-surface-container rounded-lg p-stack-md p-6 border border-primary/20 relative overflow-hidden">
                <div className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none">
                  <span className="material-symbols-outlined text-[120px]">payments</span>
                </div>
                <h4 className="font-syne text-headline-md text-on-surface mb-stack-sm text-sm font-bold mb-2">How Payment Works</h4>
                <p className="text-xs text-on-surface-variant mb-stack-md mb-4">
                  Pay in stages instead of all at once — here&apos;s the structure for every programme.
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                    <div>
                      <p className="text-xs font-semibold text-on-surface">Admission Fee</p>
                      <p className="text-[10px] text-on-surface-variant">Secures your seat. Non-refundable.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                    <div>
                      <p className="text-xs font-semibold text-on-surface">Tuition Deposit</p>
                      <p className="text-[10px] text-on-surface-variant">Required before your class starts.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                    <div>
                      <p className="text-xs font-semibold text-on-surface">Remaining Balance</p>
                      <p className="text-[10px] text-on-surface-variant">Due partway through the course to keep full access.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trust Badge */}
              <div className="flex items-center gap-stack-sm gap-2 px-stack-sm opacity-60 text-xs font-bold uppercase tracking-widest pl-1">
                <span className="material-symbols-outlined text-on-surface-variant text-base">verified_user</span>
                <span>Trusted by 10k+ Engineers</span>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Footer Component */}
      <footer className="w-full py-stack-lg py-8 px-gutter px-6 flex flex-col md:flex-row justify-between items-center border-t border-white/10 bg-background max-w-[1280px] mx-auto gap-4">
        <div className="mb-stack-md md:mb-0 text-center md:text-left">
          <span className="font-syne text-headline-md text-primary font-bold text-lg">KHODZ ACADEMY</span>
          <p className="text-xs text-on-surface-variant mt-1">© 2024 Khodz Academy. All rights reserved.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-stack-md gap-4 text-xs">
          <a className="text-on-surface-variant hover:text-primary underline transition-opacity duration-200" href="#">Terms of Service</a>
          <a className="text-on-surface-variant hover:text-primary underline transition-opacity duration-200" href="#">Privacy Policy</a>
          <a className="text-on-surface-variant hover:text-primary underline transition-opacity duration-200" href="#">Refund Policy</a>
          <a className="text-on-surface-variant hover:text-primary underline transition-opacity duration-200" href="#">Contact</a>
        </div>
      </footer>
    </div>
  );
}
