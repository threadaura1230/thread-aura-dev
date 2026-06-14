"use client";

import { LogOut, Menu, Shield, User } from "lucide-react";
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
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-purple-900/20 bg-[#0e0416]/85 px-6 backdrop-blur-md">
      {/* Left side: Console branding and hamburger toggle */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-purple-900/30 bg-purple-950/20 text-gray-400 hover:text-white lg:hidden cursor-pointer active:scale-95 transition-all"
          aria-label="Toggle navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-white tracking-wide">
            Console Center
          </span>
        </div>
      </div>

      {/* Right side: User Profile & Logout */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-purple-950/20 border border-purple-900/30">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#a356db] text-white">
            <User className="h-3.5 w-3.5" />
          </div>
          <span className="text-xs font-medium text-gray-200">{username}</span>
        </div>

        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium border border-red-500/25 bg-red-500/10 text-red-400 hover:bg-red-500/20 active:scale-95 transition-all cursor-pointer"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
