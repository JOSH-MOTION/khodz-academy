"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { COURSES } from "@/lib/courses-data";

export default function HomePage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const featuredCourses = COURSES.filter((c) =>
    ["beginner-web-design", "mern-engineering", "kids-coding-camp"].includes(c.id)
  );

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const faqs = [
    {
      q: "Do I need prior coding experience?",
      a: "Yes, our courses are designed for intermediate developers. You should have a solid grasp of JavaScript fundamentals before applying for our Mastery programs.",
    },
    {
      q: "Is the security deposit refundable?",
      a: "Absolutely. The deposit is deducted from your tuition or refunded if you are not accepted after the final technical interview.",
    },
    {
      q: "How much time commitment is required?",
      a: "Expect to spend 15-20 hours per week. This includes 4 hours of live mentorship and 10+ hours of dedicated building and code challenges.",
    },
    {
      q: "Will I get a certificate?",
      a: "You receive a verifiable digital certificate, but more importantly, you finish with a portfolio of production-grade code that proves your ability to companies.",
    },
    {
      q: "Do you offer job placement?",
      a: "We provide career coaching, portfolio reviews, and direct introductions to our partner hiring network for top-performing students.",
    },
    {
      q: "Can I pay in installments?",
      a: "Yes, we offer flexible payment plans over 3 to 6 months to ensure the program is accessible to dedicated learners.",
    },
  ];

  return (
    <div className="font-body-md bg-background text-on-background selection:bg-primary selection:text-background min-h-screen">
      <Navbar />

      <main className="pt-24 linear-gradient-bg">
        {/* Hero Section */}
        <section className="relative px-gutter py-24 flex flex-col items-center text-center max-w-5xl mx-auto overflow-hidden">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full pointer-events-none"></div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 mb-stack-lg animate-fade-in mb-6">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span className="text-label-sm font-bold text-primary uppercase tracking-widest text-[10px]">
              Next Batch Starting Soon
            </span>
          </div>
          <h1 className="font-syne text-display-lg md:text-[80px] font-extrabold text-white leading-none tracking-tight mb-stack-md text-4xl md:text-6xl mb-6">
            Build Real Products. <br />
            <span className="text-primary text-glow italic">Get Hired.</span>
          </h1>
          <p className="text-on-surface-variant text-body-lg max-w-2xl mb-stack-lg text-lg mb-8">
            Master the modern stack with high-performance mentorship. We teach you{" "}
            <span className="text-white font-bold">React, Node.js, and MongoDB</span> through production-grade engineering.
          </p>
          <div className="flex flex-col sm:flex-row gap-stack-md gap-4 mb-20">
            <Link href="/auth/login" className="bg-primary text-background px-8 py-4 rounded font-bold text-lg hover:shadow-[0_0_20px_rgba(69,236,157,0.4)] transition-all text-center">
              Apply Now
            </Link>
            <a href="#curriculum" className="bg-surface-container border border-white/10 text-on-surface px-8 py-4 rounded font-bold text-lg hover:bg-surface-variant transition-all text-center">
              View Curriculum
            </a>
          </div>

          {/* Social Proof Strip */}
          <div className="w-full border-y border-white/5 py-stack-lg py-6">
            <p className="text-label-sm text-on-surface-variant uppercase tracking-widest mb-stack-md text-[10px] tracking-wider mb-4">
              Our alumni work at top tech companies
            </p>
            <div className="flex flex-wrap justify-center items-center gap-margin-desktop gap-8 opacity-40 grayscale">
              <span className="font-syne font-bold text-xl">TECHNO</span>
              <span className="font-syne font-bold text-xl">CLOUD.LY</span>
              <span className="font-syne font-bold text-xl">VECTOR</span>
              <span className="font-syne font-bold text-xl">AESTHETIC</span>
              <span className="font-syne font-bold text-xl">QUANTUM</span>
            </div>
          </div>
        </section>

        {/* Featured Courses Grid */}
        <section className="px-gutter py-24 max-w-container-max mx-auto max-w-[1280px]" id="courses">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-4">
            <div>
              <h2 className="font-syne text-display-md text-white mb-2 text-3xl font-bold">Featured Programs</h2>
              <p className="text-on-surface-variant text-sm">Intensive cohorts designed for professional mastery.</p>
            </div>
            <a className="text-primary font-bold flex items-center gap-2 hover:underline text-sm" href="#">
              View All <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </a>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-stack-lg gap-8">
            {featuredCourses.map((course) => (
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
                  </div>
                  <h3 className="font-syne text-headline-md text-white mb-2 text-xl font-semibold leading-tight">{course.title}</h3>
                  <p className="text-on-surface-variant text-xs mb-stack-md mb-4 leading-relaxed">
                    {course.tagline}
                  </p>
                </div>
                <div className="flex items-center justify-between border-t border-white/5 pt-stack-md pt-4 mt-4">
                  <span className="text-primary font-bold text-sm">
                    {course.id === "beginner-web-design" ? "GHS 100 Reg." : `GHS ${course.totalGhs.toLocaleString()}`}
                  </span>
                  <Link href={`/courses/${course.id}`} className="text-white text-xs font-bold uppercase tracking-widest hover:text-primary transition-colors">
                    Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="bg-surface-container py-24 border-y border-white/5" id="curriculum">
          <div className="px-gutter max-w-container-max mx-auto max-w-[1280px]">
            <div className="text-center mb-16">
              <h2 className="font-syne text-display-md text-white mb-4 text-3xl font-bold">How It Works</h2>
              <p className="text-on-surface-variant max-w-xl mx-auto text-sm">
                A streamlined process to take you from applicant to professional engineer in record time.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-card p-stack-lg p-6 rounded-2xl flex flex-col gap-4">
                <div className="w-12 h-12 rounded bg-primary/10 border border-primary/20 flex items-center justify-center mb-2">
                  <span className="material-symbols-outlined text-primary text-2xl">school</span>
                </div>
                <span className="text-label-sm text-primary font-bold uppercase text-[10px]">Phase 01</span>
                <h3 className="font-syne text-headline-lg text-white text-2xl font-bold">2-Week Intro Bootcamp</h3>
                <p className="text-on-surface-variant text-sm">
                  Start with our <strong>Web Development Foundation Bootcamp</strong>. Learn HTML, CSS, JavaScript, and build a project. Filters unserious students with a GHS 100 registration fee.
                </p>
              </div>

              <div className="glass-card p-stack-lg p-6 rounded-2xl flex flex-col gap-4 md:mt-12">
                <div className="w-12 h-12 rounded bg-primary/10 border border-primary/20 flex items-center justify-center mb-2">
                  <span className="material-symbols-outlined text-primary text-2xl">workspace_premium</span>
                </div>
                <span className="text-label-sm text-primary font-bold uppercase text-[10px]">Deliverables</span>
                <h3 className="font-syne text-headline-lg text-white text-2xl font-bold">Submit Assignments</h3>
                <p className="text-on-surface-variant text-sm">
                  Attend class, finish assignments, and submit your portfolio landing page. Experience our high-quality mentorship first-hand before committing to the full track.
                </p>
              </div>

              <div className="glass-card p-stack-lg p-6 rounded-2xl flex flex-col gap-4 md:mt-24">
                <div className="w-12 h-12 rounded bg-primary/10 border border-primary/20 flex items-center justify-center mb-2">
                  <span className="material-symbols-outlined text-primary text-2xl">terminal</span>
                </div>
                <span className="text-label-sm text-primary font-bold uppercase text-[10px]">Phase 02</span>
                <h3 className="font-syne text-headline-lg text-white text-2xl font-bold">Paid Full Stack Program</h3>
                <p className="text-on-surface-variant text-sm">
                  Seamlessly transition into our 6-month <strong>Full Stack Program</strong>. Master React, Node, MongoDB, APIs, cloud deployments, and get direct job placement introductions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="px-gutter py-24 max-w-container-max mx-auto max-w-[1280px]">
          <h2 className="font-syne text-display-md text-white text-center mb-16 text-3xl font-bold">
            Results from the community
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-stack-lg gap-8">
            {/* Testimonial 1 */}
            <div className="glass-card p-stack-lg p-6 rounded-xl relative overflow-hidden">
              <div className="flex gap-1 text-primary mb-4 text-sm">
                {"★★★★★"}
              </div>
              <p className="text-body-md text-on-surface italic mb-stack-lg text-sm mb-6">
                &ldquo;Khodz Academy was the pivot point for my career. Within 3 months of finishing the React Mastery course, I landed a Senior Role at a top European fintech firm.&rdquo;
              </p>
              <div className="flex items-center gap-stack-md gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary">
                  <img
                    className="w-full h-full object-cover"
                    alt="Alex Rivera"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCi-ew-2UlUsdzS1umF6_3yYRYRKxmJNwx7wB-wdKbtF5ZYof5OR87mLm0rL59dn-h7HEqKiyf6l-8KabTql6iMbm8YHmjJ79B3XHzqFGsqpe6dwIlMpCa_X017H4Qs4g20RH4pKR_QIycbRy5ZqpWFJBGdgq4Kxp1LeRoseUf42O-7E2y9Wp1scy1_Qfp3l-m46qwn-XDmVpzrt4Yfo9YDknVt6s8iGFfJEWtdfIF0LEwcb-8Je9lzG2FQpBY4PFWO0VrGFWwGQdk"
                  />
                </div>
                <div>
                  <p className="font-bold text-white text-sm">Alex Rivera</p>
                  <p className="text-label-sm text-on-surface-variant text-xs">Senior Engineer @ Volt</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="glass-card p-stack-lg p-6 rounded-xl relative overflow-hidden border-primary/30 md:scale-105 z-10">
              <div className="flex gap-1 text-primary mb-4 text-sm">
                {"★★★★★"}
              </div>
              <p className="text-body-md text-on-surface italic mb-stack-lg text-sm mb-6">
                &ldquo;The focus on production architecture is what sets this academy apart. You don't just learn syntax; you learn how to think like a staff engineer.&rdquo;
              </p>
              <div className="flex items-center gap-stack-md gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary">
                  <img
                    className="w-full h-full object-cover"
                    alt="Sarah Chen"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDd7vUDb7TsJ0EZIwUPDpTc0HwQ5tAeTs6EYUagoKOyLNFVfYtvnpFzYSs7jNNIWUaJuYWp-5R7riJvOXvbcsSc_CqMOSPzKfROJs70GzwXL-dlECYQuw9UocDtFnS4sCMqXjpcbqgk-NsyT_RpJumcIkZHDDmUAZp-RdJ_sBQGssf76SjJIvjJSdnqrKx_w188KimFVWwAdSh8d2khn5BtWlr2P69qs8EyJN2YzcZv7GtJNurja16onsxDA_17pvPxnizlwLpES7o"
                  />
                </div>
                <div>
                  <p className="font-bold text-white text-sm">Sarah Chen</p>
                  <p className="text-label-sm text-on-surface-variant text-xs">Lead Dev @ Stripe</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="glass-card p-stack-lg p-6 rounded-xl relative overflow-hidden">
              <div className="flex gap-1 text-primary mb-4 text-sm">
                {"★★★★★"}
              </div>
              <p className="text-body-md text-on-surface italic mb-stack-lg text-sm mb-6">
                &ldquo;Going from 'tutorial hell' to shipping real features was exactly what I needed. The mentorship and code reviews were brutal but invaluable.&rdquo;
              </p>
              <div className="flex items-center gap-stack-md gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary">
                  <img
                    className="w-full h-full object-cover"
                    alt="James Wilson"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSl817OfJsYp5nheXxm6O1jxnWBkfEdY_4dj2v5RpmjLWYXx1F44JiWLHIyjcQl_6iMThNHDdRv2a8WaXuhCiAM3D-0_NFiSjPdN1duYMTCtmMZ_SpVjx5YeKGTHvmmKd4gI5as97Ofz7CZXE9mUNl6vpddmEC6ECRurlN2ei-ticXD5dpbtaz2KjnX9Bwcf2gvGPA3UtxS6pZmNTjgrf_XrK5IgIlMeSfIX4WnuHlBvGKFzXhe_gJBgEOQfPlm12ARRVXf2Yzb8M"
                  />
                </div>
                <div>
                  <p className="font-bold text-white text-sm">James Wilson</p>
                  <p className="text-label-sm text-on-surface-variant text-xs">Frontend Lead @ Vercel</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="px-gutter py-24 max-w-3xl mx-auto" id="faq">
          <h2 className="font-syne text-display-md text-white mb-12 text-center text-3xl font-bold">
            Frequently Asked Questions
          </h2>
          
          <div className="flex flex-col gap-4">
            {faqs.map((faq, index) => {
              const isActive = activeFaq === index;
              return (
                <div
                  key={index}
                  onClick={() => toggleFaq(index)}
                  className={`accordion-item glass-card rounded-lg overflow-hidden border cursor-pointer transition-all duration-300 ${
                    isActive ? "border-primary/30" : "border-white/5"
                  }`}
                >
                  <div className="p-6 flex justify-between items-center">
                    <h3 className="font-bold text-white text-sm md:text-base">{faq.q}</h3>
                    <span className={`material-symbols-outlined transition-transform text-xl ${isActive ? "rotate-180" : ""}`}>
                      expand_more
                    </span>
                  </div>
                  <div
                    className="overflow-hidden transition-all duration-300 ease-out"
                    style={{
                      maxHeight: isActive ? "200px" : "0",
                      opacity: isActive ? 1 : 0,
                    }}
                  >
                    <div className="px-6 pb-6 text-on-surface-variant text-sm">
                      {faq.a}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-gutter py-24 max-w-container-max mx-auto max-w-[1280px]">
          <div className="glass-card rounded-[40px] p-12 md:p-24 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-primary/5 -z-10"></div>
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary/10 blur-[100px] rounded-full"></div>
            <h2 className="font-syne text-display-md md:text-display-lg text-white mb-6 text-3xl md:text-4xl font-bold">
              Ready to upgrade your career?
            </h2>
            <p className="text-on-surface-variant text-body-lg max-w-xl mx-auto mb-12 text-base md:text-lg">
              Applications for the Summer Cohort are closing in 5 days. Secure your spot now.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/auth/login" className="bg-primary text-background px-10 py-5 rounded font-bold text-xl hover:shadow-[0_0_30px_rgba(69,236,157,0.5)] transition-all text-center text-lg">
                Apply Now
              </Link>
              <a href="mailto:sales@khodz.academy" className="bg-surface border border-white/10 text-white px-10 py-5 rounded font-bold text-xl hover:bg-surface-variant transition-all text-center text-lg">
                Contact Sales
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-stack-lg px-gutter border-t border-white/10 flex flex-col md:flex-row justify-between items-center bg-background max-w-[1280px] mx-auto py-8">
        <div className="flex flex-col items-center md:items-start gap-2 mb-stack-lg md:mb-0">
          <span className="font-syne text-headline-md text-primary font-bold text-lg">KHODZ ACADEMY</span>
          <p className="text-on-surface-variant font-body-sm text-xs">
            © 2024 Khodz Academy. All rights reserved.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-stack-lg gap-6 mb-stack-lg md:mb-0 text-xs my-4 md:my-0">
          <a className="text-on-surface-variant hover:text-primary transition-opacity duration-200 underline" href="#">
            Terms of Service
          </a>
          <a className="text-on-surface-variant hover:text-primary transition-opacity duration-200 underline" href="#">
            Privacy Policy
          </a>
          <a className="text-on-surface-variant hover:text-primary transition-opacity duration-200 underline" href="#">
            Refund Policy
          </a>
          <a className="text-on-surface-variant hover:text-primary transition-opacity duration-200 underline" href="#">
            Contact
          </a>
        </div>
        <div className="flex gap-4">
          <a className="text-on-surface-variant hover:text-primary transition-colors text-sm" href="#">
            <span className="material-symbols-outlined">brand_awareness</span>
          </a>
          <a className="text-on-surface-variant hover:text-primary transition-colors text-sm" href="#">
            <span className="material-symbols-outlined">public</span>
          </a>
          <a className="text-on-surface-variant hover:text-primary transition-colors text-sm" href="#">
            <span className="material-symbols-outlined">mail</span>
          </a>
        </div>
      </footer>
    </div>
  );
}
