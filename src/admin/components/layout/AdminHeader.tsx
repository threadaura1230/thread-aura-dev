"use client";

import { LogOut, Menu, User } from "lucide-react";
import { useEffect, useState } from "react";

interface AdminHeaderProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  onLogout: () => void;
}

export default function AdminHeader({
  sidebarOpen,
  onToggleSidebar,
  onLogout,
}: AdminHeaderProps) {
  const [username, setUsername] = useState("Admin");

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/admin/verify");
        if (res.ok) {
          const data = await res.json();
          if (data.user?.username) {
            setUsername(data.user.username);
          }
        }
      } catch (err) {
        console.error("Failed to load user info:", err);
      }
    }
    fetchUser();
  }, []);

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-black/[0.06] bg-[#F1EFE7]/85 px-6 backdrop-blur-md">
      {/* Left side */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-black/[0.08] bg-white/60 text-slate-500 hover:text-slate-800 lg:hidden cursor-pointer active:scale-95 transition-all"
          aria-label="Toggle navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <span className="font-serif text-[17px] font-medium text-[#0f3a2a] tracking-wide">
          Admin Panel
        </span>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/70 border border-black/[0.06]">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#073623] text-white">
            <User className="h-3.5 w-3.5" />
          </div>
          <span className="text-[12px] font-medium text-slate-700">{username}</span>
        </div>

        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-[12px] font-medium border border-[#8C2323]/20 bg-[#8C2323]/[0.06] text-[#8C2323] hover:bg-[#8C2323]/[0.12] active:scale-95 transition-all cursor-pointer"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
