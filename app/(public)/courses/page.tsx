"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { COURSES } from "@/lib/courses-data";

export default function CoursesPage() {
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCourses = COURSES.filter((course) => {
    const matchesFilter = filter === "All" || course.category === filter;
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen">
      <Navbar />

      <main className="pt-32 pb-20 px-gutter max-w-container-max mx-auto max-w-[1280px] px-6">
        {/* Header Section */}
        <header className="mb-stack-lg flex flex-col md:flex-row md:items-end justify-between gap-stack-md gap-4 mb-8">
          <div className="max-w-2xl">
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
          {/* Courses Grid */}
          <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-stack-lg gap-6">
            {filteredCourses.map((course) => (
              <div key={course.id} className="glass-card rounded-lg overflow-hidden flex flex-col course-card-hover transition-all duration-300">
                <div className="relative h-48 w-full bg-surface-container">
                  <img
                    className="w-full h-full object-cover opacity-80 transition-opacity hover:opacity-100"
                    alt={course.title}
                    src={course.img}
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 bg-primary/20 backdrop-blur-md border border-primary/30 rounded">
                    <span className="text-primary text-[10px] uppercase font-bold tracking-widest">{course.category}</span>
                  </div>
                </div>
                <div className="p-stack-md p-4 flex-1 flex flex-col">
                  <h3 className="font-syne text-headline-md text-on-surface mb-stack-sm text-base font-semibold">{course.title}</h3>
                  <div className="flex items-center gap-stack-md gap-4 text-on-surface-variant mb-stack-md mb-4 text-xs mt-2">
                    <div className="flex items-center gap-unit"><span className="material-symbols-outlined text-[16px] mr-1">schedule</span><span>{course.duration}</span></div>
                    <div className="flex items-center gap-unit"><span className="material-symbols-outlined text-[16px] mr-1">cast_for_education</span><span>{course.sessionsCount}</span></div>
                  </div>
                  <div className="mt-auto pt-stack-md border-t border-white/5 flex items-center justify-between pt-4 text-xs">
                    <div>
                      <span className="text-[10px] text-on-surface-variant block uppercase tracking-tighter">Level</span>
                      <span className="text-primary font-bold">{course.level}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-base text-on-surface font-bold">GHS {course.totalGhs.toLocaleString()}</span>
                    </div>
                  </div>
                  <Link href={`/courses/${course.id}`} className="mt-stack-md mt-4 w-full border border-white/20 hover:bg-white/5 text-on-surface font-bold py-2 rounded-lg transition-all text-xs text-center">
                    Learn More
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-3">
            <div className="sticky top-32 space-y-stack-lg space-y-6">
              {/* What's Included */}
              <div className="glass-card rounded-lg p-stack-md p-6 border border-white/10">
                <h4 className="font-syne text-headline-md text-primary mb-stack-md text-sm font-bold mb-4">What's included</h4>
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
                <h4 className="font-syne text-headline-md text-on-surface mb-stack-sm text-sm font-bold mb-2">Flexible Payment</h4>
                <p className="text-xs text-on-surface-variant mb-stack-md mb-4">
                  We believe in making high-end education accessible. Choose from one-time payment or 0% interest monthly installments.
                </p>
                <div className="space-y-stack-sm space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-on-surface-variant">Full Payment</span>
                    <span className="text-primary font-bold">15% Discount</span>
                  </div>
                  <div className="h-1 bg-white/5 w-full rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-full shadow-[0_0_8px_#0acf83]"></div>
                  </div>
                  <div className="flex justify-between text-xs font-semibold pt-1">
                    <span className="text-on-surface-variant">Installments</span>
                    <span className="text-on-surface">Up to 6 Months</span>
                  </div>
                </div>
                <button className="mt-stack-md mt-4 w-full bg-primary-container text-on-primary-container font-bold py-2 rounded text-xs hover:bg-primary hover:text-black transition-colors cursor-pointer">
                  Compare Plans
                </button>
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
