"use client";

import { usePathname, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  LogOut,
  UsersIcon,
  MessageSquareQuote,
  LayoutGrid,
  Mail,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onLogout: () => void;
}

export default function AdminSidebar({
  isOpen,
  onToggle,
  onLogout,
}: SidebarProps) {
  const pathname = usePathname();
  const params = useParams();
  const secret = params.secret as string || "";

  const menuItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: `/admin/${secret}/dashboard`,
    },
    {
      name: "Users",
      icon: UsersIcon,
      path: `/admin/${secret}/users`,
    },
    {
      name: "Testimonials",
      icon: MessageSquareQuote,
      path: `/admin/${secret}/testimonials`,
    },
    {
      name: "Services",
      icon: LayoutGrid,
      path: `/admin/${secret}/services-all`,
    },
    {
      name: "Team",
      icon: UsersIcon,
      path: `/admin/${secret}/team`,
    },
    {
      name: "Contacts",
      icon: Mail,
      path: `/admin/${secret}/contact`,
    },
  ];

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-purple-900/20 bg-[#0e0416] transition-transform duration-200 ease-in-out lg:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      {/* Sidebar Header */}
      <div className="flex h-16 items-center justify-between px-6 border-b border-purple-900/20">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative h-10 w-10 rounded-lg bg-black flex-shrink-0 overflow-hidden">
            <Image
              src="/logo.png"
              alt="Logo"
              width={100}
              height={100}
              className="object-contain"
            />
          </div>
          <span className="text-sm font-bold text-white tracking-widest">
            enteropia
          </span>
        </Link>

      </div>

      {/* Navigation menu */}
      <nav className="flex-1 space-y-1.5 px-4 py-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.path);

          return (
            <Link
              key={item.name}
              href={item.path}
              className={`
                flex items-center gap-3.5 rounded-xl px-4 py-3 text-xs font-semibold tracking-wide transition-all cursor-pointer
                ${isActive
                  ? "bg-[#a356db] text-white shadow-lg shadow-purple-500/10"
                  : "text-gray-400 hover:bg-purple-950/20 hover:text-gray-200"
                }
              `}
            >
              <Icon className="h-4.5 w-4.5 flex-shrink-0" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer / Log out */}
      <div className="p-4 border-t border-purple-900/10">
        <button
          onClick={onLogout}
          className="flex w-full items-center gap-3.5 rounded-xl px-4 py-3 text-xs font-semibold tracking-wide text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
        >
          <LogOut className="h-4.5 w-4.5 flex-shrink-0" />
          Log Out
        </button>
      </div>
    </aside>
  );
}
