"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const navLinks = [
  { label: "Courses", href: "/courses" },
  { label: "Curriculum", href: "/#curriculum" },
  { label: "Pricing", href: "/#pricing" },
  { label: "FAQ", href: "/#faq" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-[1280px] mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center">
            <Image
              src="/k3.png"
              alt="Khodz Academy"
              width={3000}
              height={1156}
              className="h-12 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-xs font-semibold transition-colors duration-200 ${pathname === link.href
                    ? "text-primary border-b-2 border-primary pb-0.5"
                    : "text-on-surface-variant hover:text-primary"
                  }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right-side actions */}
        <div className="flex items-center gap-4">
          {/* Dashboard quick-links (desktop only) */}
          <div className="hidden lg:flex items-center gap-3 border-r border-white/10 pr-4 mr-1">
            <Link
              href="/student-dashboard"
              className="flex items-center gap-1.5 text-xs text-on-surface-variant hover:text-primary transition-colors font-semibold"
            >
              <span className="material-symbols-outlined text-[16px]">school</span>
              Student
            </Link>
            <Link
              href="/admin-dashboard"
              className="flex items-center gap-1.5 text-xs text-on-surface-variant hover:text-primary transition-colors font-semibold"
            >
              <span className="material-symbols-outlined text-[16px]">admin_panel_settings</span>
              Admin
            </Link>
          </div>

          {/* Notifications icon */}
          <button className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors text-[20px] cursor-pointer hidden md:block">
            notifications
          </button>

          {/* Get Started CTA */}
          <Link
            href="/auth/login"
            className="bg-primary text-on-primary font-bold text-xs px-4 py-2 rounded hover:brightness-110 active:scale-95 transition-all"
          >
            Get Started
          </Link>

          {/* Mobile hamburger */}
          <button
            className="md:hidden material-symbols-outlined text-on-surface-variant cursor-pointer"
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? "close" : "menu"}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-surface-container border-t border-white/10 px-6 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-sm text-on-surface-variant hover:text-primary font-semibold transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <hr className="border-white/10" />
          <Link href="/student-dashboard" onClick={() => setMobileOpen(false)} className="text-sm font-semibold text-on-surface-variant hover:text-primary flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">school</span> Student Dashboard
          </Link>
          <Link href="/admin-dashboard" onClick={() => setMobileOpen(false)} className="text-sm font-semibold text-on-surface-variant hover:text-primary flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">admin_panel_settings</span> Admin Dashboard
          </Link>
          <Link href="/auth/login" onClick={() => setMobileOpen(false)} className="bg-primary text-on-primary font-bold text-xs px-4 py-2 rounded text-center">
            Get Started
          </Link>
        </div>
      )}
    </header>
  );
}
