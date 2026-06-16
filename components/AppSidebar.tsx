"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import MobileBottomNav from "./MobileBottomNav";

interface AppSidebarProps {
  role?: "student" | "admin";
}

const studentMenu = [
  { id: "student-dashboard", label: "Dashboard", icon: "dashboard", href: "/student-dashboard" },
  { id: "courses", label: "My Courses", icon: "school", href: "/courses" },
  { id: "slides", label: "Slides", icon: "present_to_all", href: "/lesson/slides" },
  { id: "videos", label: "Videos", icon: "play_circle", href: "/lesson/video" },
  { id: "progress", label: "Progress", icon: "insights", href: "/student-dashboard/progress" },
  { id: "settings", label: "Settings", icon: "settings", href: "/student-dashboard/settings" },
];

const adminMenu = [
  { id: "admin-dashboard", label: "Dashboard",  icon: "dashboard",         href: "/admin-dashboard" },
  { id: "courses",         label: "Courses",    icon: "school",            href: "/admin-dashboard/courses" },
  { id: "slides",          label: "Slides",     icon: "present_to_all",    href: "/admin-dashboard/slides" },
  { id: "videos",          label: "Videos",     icon: "play_circle",       href: "/admin-dashboard/video" },
  { id: "students",        label: "Students",   icon: "group",             href: "/admin-dashboard/students" },
  { id: "settings",        label: "Settings",   icon: "settings",          href: "/admin-dashboard/settings" },
];

export default function AppSidebar({ role = "student" }: AppSidebarProps) {
  const pathname = usePathname();
  const menu = role === "admin" ? adminMenu : studentMenu;

  return (
    <>
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-screen w-64 py-8 bg-surface-container border-r border-white/10 z-50">
      {/* Logo */}
      <div className="px-6 mb-8">
        <Link href="/" className="flex items-center">
          <Image
            src="/k4.png"
            alt="Khodz Academy"
            width={3000}
            height={1156}
            className="h-14 w-auto object-contain"
            priority
          />
        </Link>
      </div>

      {/* Role badge */}
      <div className="mx-4 mb-4 flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 border border-primary/10">
        <span className="material-symbols-outlined text-primary text-[16px]">
          {role === "admin" ? "admin_panel_settings" : "person"}
        </span>
        <span className="text-[11px] font-bold text-primary uppercase tracking-widest">
          {role === "admin" ? "Admin Panel" : "Student Portal"}
        </span>
      </div>

      {/* Nav links */}
      <nav className="flex-1 flex flex-col gap-0.5 overflow-y-auto px-2">
        {menu.map((item) => {
          const isActive =
            pathname === item.href || (item.href !== "#" && pathname.startsWith(item.href) && item.href !== "/courses");
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex items-center gap-3 py-3 px-4 rounded-lg transition-all text-xs font-semibold ${
                isActive
                  ? "bg-secondary-container text-on-secondary-container"
                  : "text-on-surface-variant hover:bg-surface-variant hover:text-on-surface"
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Switch role quick link */}
      <div className="mx-4 mb-2 mt-4">
        <Link
          href={role === "admin" ? "/student-dashboard" : "/admin-dashboard"}
          className="flex items-center gap-2 text-[11px] text-on-surface-variant hover:text-primary transition-colors px-2 py-2"
        >
          <span className="material-symbols-outlined text-[16px]">swap_horiz</span>
          Switch to {role === "admin" ? "Student View" : "Admin Panel"}
        </Link>
      </div>

      {/* Bottom section */}
      <div className="px-4 pt-4 border-t border-white/5 space-y-0.5">
        <div className="bg-primary/10 rounded-xl p-4 mb-4">
          <p className="text-[11px] text-primary font-bold mb-2 uppercase tracking-wide">Upgrade to Pro</p>
          <button className="w-full bg-primary text-black py-2 rounded font-bold text-xs transition-transform active:scale-95 cursor-pointer hover:brightness-110">
            Go Premium
          </button>
        </div>
        <Link
          href="#"
          className="flex items-center gap-3 py-2.5 px-3 text-on-surface-variant hover:text-on-surface text-xs rounded-lg hover:bg-surface-variant/50 transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">help_outline</span> Support
        </Link>
        <Link
          href="/auth/login"
          className="flex items-center gap-3 py-2.5 px-3 text-on-surface-variant hover:text-error text-xs rounded-lg hover:bg-error/5 transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">logout</span> Logout
        </Link>
      </div>
    </aside>
    <MobileBottomNav role={role} />
  </>
);
}
