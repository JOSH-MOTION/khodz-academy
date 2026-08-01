"use client";

import { useState, useRef, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

interface NotificationBellProps {
  className?: string;
}

interface Notification {
  id: string;
  title: string;
  body: string;
  read_at: string | null;
  created_at: string;
}

export default function NotificationBell({ className = "" }: NotificationBellProps) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("notifications")
        .select("id, title, body, read_at, created_at")
        .order("created_at", { ascending: false })
        .limit(20);
      setNotifications(data || []);
    };
    load();
  }, []);

  const unreadCount = notifications.filter((n) => !n.read_at).length;

  async function markRead(id: string) {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read_at: new Date().toISOString() } : n)));
    const supabase = createClient();
    await supabase.from("notifications").update({ read_at: new Date().toISOString() }).eq("id", id);
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={`relative material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors cursor-pointer ${className}`}
      >
        notifications
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-black text-[9px] font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-3 w-80 glass-card rounded-xl border border-white/10 shadow-2xl z-50 text-left overflow-hidden">
          <div className="p-4 border-b border-white/5">
            <p className="text-xs font-bold text-on-surface">Notifications</p>
          </div>
          {notifications.length === 0 ? (
            <p className="text-[11px] text-on-surface-variant p-4">You&apos;re all caught up — no new notifications.</p>
          ) : (
            <div className="max-h-80 overflow-y-auto divide-y divide-white/5">
              {notifications.map((n) => (
                <button
                  key={n.id}
                  onClick={() => markRead(n.id)}
                  className={`w-full text-left p-4 hover:bg-white/5 transition-colors cursor-pointer ${!n.read_at ? "bg-primary/5" : ""}`}
                >
                  <div className="flex items-start gap-2">
                    {!n.read_at && <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />}
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-on-surface">{n.title}</p>
                      <p className="text-[11px] text-on-surface-variant mt-0.5">{n.body}</p>
                      <p className="text-[9px] text-on-surface-variant mt-1">
                        {new Date(n.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
