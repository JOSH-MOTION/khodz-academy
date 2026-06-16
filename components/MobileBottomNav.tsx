"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface MobileBottomNavProps {
  role?: "student" | "admin";
}

const studentMenu = [
  { id: "student-dashboard", label: "Dashboard", icon: "dashboard", href: "/student-dashboard" },
  { id: "courses", label: "Courses", icon: "school", href: "/courses" },
  { id: "slides", label: "Slides", icon: "present_to_all", href: "/lesson/slides" },
  { id: "videos", label: "Videos", icon: "play_circle", href: "/lesson/video" },
];

const adminMenu = [
  { id: "admin-dashboard", label: "Dashboard", icon: "dashboard", href: "/admin-dashboard" },
  { id: "courses", label: "Courses", icon: "school", href: "/admin-dashboard/courses" },
  { id: "slides", label: "Slides", icon: "present_to_all", href: "/admin-dashboard/slides" },
  { id: "videos", label: "Videos", icon: "play_circle", href: "/admin-dashboard/video" },
];

export default function MobileBottomNav({ role = "student" }: MobileBottomNavProps) {
  const pathname = usePathname();
  const menu = role === "admin" ? adminMenu : studentMenu;

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 w-full bg-surface-container/90 backdrop-blur-xl border-t border-white/10 py-2.5 flex justify-around items-center z-50">
      {menu.map((item) => {
        // Active logic: checks match or path prefix (ignoring courses catalog slash match)
        const isActive =
          pathname === item.href ||
          (item.href !== "/courses" && pathname.startsWith(item.href));
        
        return (
          <Link
            key={item.id}
            href={item.href}
            className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${
              isActive ? "text-primary" : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
            <span className="text-[9px] font-bold uppercase tracking-wider">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
