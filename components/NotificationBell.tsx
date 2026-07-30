"use client";

import { useState, useRef, useEffect } from "react";

interface NotificationBellProps {
  className?: string;
}

export default function NotificationBell({ className = "" }: NotificationBellProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={`material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors cursor-pointer ${className}`}
      >
        notifications
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-3 w-64 glass-card rounded-xl border border-white/10 shadow-2xl p-4 z-50 text-left">
          <p className="text-xs font-bold text-on-surface mb-1">Notifications</p>
          <p className="text-[11px] text-on-surface-variant">You&apos;re all caught up — no new notifications.</p>
        </div>
      )}
    </div>
  );
}
