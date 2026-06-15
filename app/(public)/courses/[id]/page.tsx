"use client";

import { useState, use, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { createClient } from "@/lib/supabase/client";
import { COURSES_MAP } from "@/lib/courses-data";

interface CourseDetailsProps {
  params: Promise<{ id: string }>;
}

export default function CourseDetailsPage({ params }: CourseDetailsProps) {
  const resolvedParams = use(params);
  const courseId = resolvedParams.id;
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"overview" | "curriculum" | "instructor">("overview");
  const [activeAccordion, setActiveAccordion] = useState<number | null>(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);
    };
    checkAuth();
  }, []);

  const handleApply = () => {
    const paymentUrl = `/payment/admission?course=${courseId}`;
    if (isLoggedIn) {
      router.push(paymentUrl);
    } else {
      router.push(`/auth/login?next=${encodeURIComponent(paymentUrl)}`);
    }
  };

  // Get course details from shared data, default to beginner-web-design
  const course = COURSES_MAP[courseId] || COURSES_MAP["beginner-web-design"];
  const instructor = {
    name: "Dr. Alex Khodz",
    role: "Ex-Lead Architect at Meta & Stripe",
    bio: "With over 15 years in the industry, Dr. Khodz has specialized in building global scale infrastructure. He now leads Khodz Academy to mentor the next generation of 1% developers.",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAxdVEdNNnYx4mBeyOKsYpTV-i-9qZ5_3us9gybvwoQpogwsGz37wGZUMMQD5AVb-CnvgQA6FIGiTJ3IqlRyQqayqHmmuAXJnoK18N4bPVkBiDKI38c_6leEfN0Eh5FAIbZT2iZbkqY2v1phDAEJSSQ4cYYAhck01BvbQsxX2uRSJJAwRI1OPZ5_lSHIMdl-LBYlhYM47_QHzPkRvWEXVGvIGHlwuy6rU9T6fcrqR-YBsW2enQOLEkYaqFsW04mX1SfgYxKzyNxRFw",
  };

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen">
      <Navbar />

      <main className="pt-32 pb-stack-lg px-6 max-w-[1280px] mx-auto">
        {/* Hero Section */}
        <section className="relative max-w-container-max mx-auto mb-stack-lg mb-8">
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary/10 blur-[120px] rounded-full pointer-events-none"></div>
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-stack-lg gap-8">
            <div className="lg:col-span-8">
              <div className="flex items-center gap-stack-sm mb-stack-md mb-4 gap-3">
                <span className="bg-primary-container/20 text-primary px-3 py-1 rounded text-xs uppercase font-bold tracking-widest border border-primary/20">
                  {course.category}
                </span>
                <div className="flex items-center gap-1 text-tertiary text-xs">
                  <span className="material-symbols-outlined text-base">star</span>
                  <span className="font-bold">{course.rating}</span>
                </div>
              </div>
              
              <h1 className="font-syne text-display-md md:text-display-lg leading-tight mb-stack-md text-3xl font-extrabold mb-4">
                {course.title}
              </h1>
              <p className="text-body-lg text-on-surface-variant max-w-2xl mb-stack-lg text-sm mb-6">
                {course.tagline}
              </p>

              {/* Tabs Navigation */}
              <div className="flex gap-stack-lg border-b border-white/10 mb-stack-lg overflow-x-auto whitespace-nowrap gap-6 mb-6 text-xs">
                {(["overview", "curriculum", "instructor"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-stack-md pb-2 font-bold transition-all capitalize cursor-pointer border-b-2 ${
                      activeTab === tab
                        ? "text-primary border-primary font-bold"
                        : "text-on-surface-variant hover:text-on-surface border-transparent"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Tab Contents */}
              {activeTab === "overview" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md gap-6 animate-fade-in">
                  <div className="glass-card p-stack-md p-6 rounded-lg">
                    <span className="material-symbols-outlined text-primary mb-stack-sm text-2xl mb-2">rocket_launch</span>
                    <h3 className="font-syne text-headline-md text-sm font-bold mb-3">Learning Outcomes</h3>
                    <ul className="space-y-2 text-on-surface-variant text-xs">
                      {course.outcomes.map((outcome, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-primary mr-1">•</span> {outcome}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="glass-card p-stack-md p-6 rounded-lg">
                    <span className="material-symbols-outlined text-primary mb-stack-sm text-2xl mb-2">terminal</span>
                    <h3 className="font-syne text-headline-md text-sm font-bold mb-3">Prerequisites</h3>
                    <ul className="space-y-2 text-on-surface-variant text-xs">
                      {course.prerequisites.map((prereq, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-primary mr-1">•</span> {prereq}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {course.projects && course.projects.length > 0 && (
                    <div className="glass-card p-stack-md p-6 rounded-lg md:col-span-2">
                      <span className="material-symbols-outlined text-primary mb-stack-sm text-2xl mb-2">folder_open</span>
                      <h3 className="font-syne text-headline-md text-sm font-bold mb-3">Course Projects</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {course.projects.map((project, idx) => (
                          <div key={idx} className="flex items-center gap-2 bg-white/5 p-3 rounded-lg border border-white/5">
                            <span className="material-symbols-outlined text-primary text-sm">construction</span>
                            <span className="text-on-surface text-xs font-semibold">{project}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "curriculum" && (
                <div className="space-y-stack-md space-y-4 animate-fade-in">
                  {course.syllabus.map((module, mIdx) => {
                    const isOpen = activeAccordion === mIdx;
                    return (
                      <div
                        key={mIdx}
                        className={`accordion-item glass-card rounded-lg overflow-hidden transition-all duration-300 border ${
                          isOpen ? "border-primary/20" : "border-transparent"
                        }`}
                      >
                        <button
                          className="w-full flex items-center justify-between p-stack-md p-4 text-left hover:bg-white/5 transition-colors cursor-pointer"
                          onClick={() => setActiveAccordion(isOpen ? null : mIdx)}
                        >
                          <div className="flex items-center gap-stack-md gap-4">
                            <span className="w-8 h-8 flex items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs">
                              {module.num}
                            </span>
                            <div>
                              <h4 className="font-syne text-headline-md text-sm font-semibold">{module.title}</h4>
                              <span className="text-[10px] text-on-surface-variant uppercase tracking-wider">{module.details}</span>
                            </div>
                          </div>
                          <span className={`material-symbols-outlined transition-transform text-lg ${isOpen ? "rotate-180" : ""}`}>
                            expand_more
                          </span>
                        </button>
                        
                        <div
                          className="overflow-hidden transition-all duration-300 ease-out"
                          style={{
                            maxHeight: isOpen ? "300px" : "0",
                            opacity: isOpen ? 1 : 0,
                          }}
                        >
                          <div className="p-stack-md p-4 space-y-stack-sm space-y-2 border-t border-white/5 bg-background/50">
                            {module.sessions.map((session, sIdx) => (
                              <div
                                key={sIdx}
                                className={`flex items-center justify-between py-2 border-b border-white/5 text-xs ${
                                  session.type === "lock" ? "opacity-60" : ""
                                }`}
                              >
                                <div className="flex items-center gap-stack-sm gap-2">
                                  <span className="material-symbols-outlined text-primary text-lg">
                                    {session.type === "video" ? "play_circle" : "lock"}
                                  </span>
                                  <span>{session.title}</span>
                                </div>
                                <span className="text-[10px] text-on-surface-variant">
                                  {session.preview ? "Preview" : "Locked"}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {activeTab === "instructor" && (
                <div className="glass-card p-stack-lg p-6 rounded-lg flex flex-col md:flex-row gap-stack-lg gap-6 items-center md:items-start animate-fade-in">
                  <div className="w-32 h-32 md:w-48 md:h-48 rounded-lg overflow-hidden flex-shrink-0 border-2 border-primary/20">
                    <img
                      alt={instructor.name}
                      className="w-full h-full object-cover"
                      src={instructor.img}
                    />
                  </div>
                  <div>
                    <h3 className="font-syne text-headline-lg text-lg font-bold mb-2">
                      {instructor.name}
                    </h3>
                    <p className="text-primary font-bold mb-stack-md uppercase tracking-wide text-xs">
                      {instructor.role}
                    </p>
                    <p className="text-on-surface-variant text-xs mb-stack-lg leading-relaxed mt-2">
                      {instructor.bio}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Side price card */}
            <div className="lg:col-span-4">
              <div className="sticky top-32 space-y-stack-md space-y-4">
                <div className="glass-card p-stack-lg p-6 rounded-xl overflow-hidden relative">
                  <div className="absolute top-0 right-0 p-4">
                    <span className="bg-primary text-background text-[10px] font-bold px-2 py-1 rounded-full animate-pulse text-black">
                      LIVE SOON
                    </span>
                  </div>
                  <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-stack-lg border border-white/10 mb-4">
                    <img
                      alt="Course preview thumbnail"
                      className="w-full h-full object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAS2hRIGFKCW5Vgti3G8pIqhYA-pKHu3MHRYGrISRdbupRRu169dHyVe8W3gHGxeTr8DRHPL5EG0YtmQbeR09-vY6DWf2I2kx8UwNsFzLCgPmt7UMEMxBw63o_xfYUOFtqiIRXsgYB9rZJfp7aC_tE8iFcvxamvv8Vcg2w7AjHxGYZIj9_TvDpuU_OhuEefFHo-yqlCCx7qDpooHqi0_WEG8Lg1GSR_aFmD0ZHirriKUk2qtCtm9jwd6lPRZURNoPkq5KnV2jNEo9s"
                    />
                    <div className="absolute inset-0 bg-background/40 flex items-center justify-center cursor-pointer group">
                      <div className="w-16 h-16 bg-primary text-background rounded-full flex items-center justify-center transition-transform group-hover:scale-110 text-black">
                        <span className="material-symbols-outlined text-[32px]">play_arrow</span>
                      </div>
                    </div>
                  </div>
                  <div className="mb-stack-lg mb-6">
                    <div className="space-y-2 border-b border-white/5 pb-4 mb-4">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-on-surface-variant">
                          {course.id === "beginner-web-design" ? "Bootcamp Tuition" : "Tuition Fee"}
                        </span>
                        <span className="text-on-surface font-semibold">
                          {course.id === "beginner-web-design" ? "FREE (GHS 0)" : `GHS ${course.tuitionGhs.toLocaleString()}`}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-on-surface-variant">
                          {course.id === "beginner-web-design" ? "Registration Fee" : "Admission Fee"}
                        </span>
                        <span className="text-on-surface font-semibold">GHS {course.admissionGhs.toLocaleString()}</span>
                      </div>
                    </div>
                    
                    {course.id === "mern-engineering" && (
                      <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 text-xs mb-4 text-left">
                        <div className="flex items-center gap-2 text-primary font-bold mb-1">
                          <span className="material-symbols-outlined text-[16px] text-primary">local_offer</span>
                          <span>Bootcamp Completion Promo</span>
                        </div>
                        <p className="text-[10px] text-on-surface-variant leading-relaxed">
                          Students who successfully complete the 2-week <strong>Web Development Foundation Bootcamp</strong> receive a <strong>GHS 500 discount</strong> off the full program tuition.
                        </p>
                      </div>
                    )}

                    <div className="flex items-baseline justify-between mb-1">
                      <span className="text-xs text-on-surface-variant uppercase tracking-wider font-semibold">
                        {course.id === "beginner-web-design" ? "Total Registration" : "Total Price"}
                      </span>
                      <span className="text-2xl font-syne text-primary font-bold">GHS {course.totalGhs.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="space-y-stack-md space-y-3 mb-stack-lg mb-6">
                    <button
                      onClick={handleApply}
                      className="w-full bg-primary text-background font-bold py-3 rounded-lg hover:shadow-[0_0_20px_rgba(69,236,157,0.3)] transition-all active:scale-95 text-center text-xs text-black font-semibold cursor-pointer"
                    >
                      Apply Now
                    </button>
                    <button className="w-full border border-white/20 text-on-surface font-bold py-3 rounded-lg hover:bg-white/5 transition-all text-xs cursor-pointer">
                      Download Syllabus
                    </button>
                  </div>
                  <div className="space-y-stack-sm border-t border-white/10 pt-stack-md pt-4">
                    <h5 className="text-xs font-bold text-on-surface">Included in this course:</h5>
                    <div className="grid grid-cols-1 gap-2 text-on-surface-variant text-xs mt-2">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-[18px]">auto_stories</span>
                        <span>24 Hours of Content</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-[18px]">workspace_premium</span>
                        <span>Official Certification</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-[18px]">group</span>
                        <span>Private Discord Community</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="glass-card p-stack-md p-4 rounded-lg flex items-center gap-stack-md gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary">verified</span>
                  </div>
                  <div>
                    <h6 className="text-xs font-bold">Secure Checkout</h6>
                    <p className="text-[10px] text-on-surface-variant">30-day money back guarantee.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-stack-lg py-8 px-gutter px-6 flex flex-col md:flex-row justify-between items-center border-t border-white/10 bg-background max-w-[1280px] mx-auto gap-4">
        <div className="mb-stack-md md:mb-0 text-center md:text-left">
          <span className="font-syne text-headline-md text-primary block mb-2 font-bold text-lg">KHODZ ACADEMY</span>
          <p className="text-xs text-on-surface-variant">© 2024 Khodz Academy. All rights reserved.</p>
        </div>
        <div className="flex gap-stack-lg gap-4 text-xs font-semibold">
          <a className="hover:text-primary transition-opacity duration-200 underline decoration-primary/30 underline-offset-4" href="#">Terms of Service</a>
          <a className="hover:text-primary transition-opacity duration-200 underline decoration-primary/30 underline-offset-4" href="#">Privacy Policy</a>
          <a className="hover:text-primary transition-opacity duration-200 underline decoration-primary/30 underline-offset-4" href="#">Refund Policy</a>
          <a className="hover:text-primary transition-opacity duration-200 underline decoration-primary/30 underline-offset-4" href="#">Contact</a>
        </div>
      </footer>
    </div>
  );
}
