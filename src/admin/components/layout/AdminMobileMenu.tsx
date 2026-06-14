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
  X,
} from "lucide-react";

interface AdminMobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export default function AdminMobileMenu({
  isOpen,
  onClose,
  onLogout,
}: AdminMobileMenuProps) {
  const pathname = usePathname();
  const params = useParams();
  const secret = (params.secret as string) || "";

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
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-purple-900/20 bg-[#0e0416] transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-purple-900/20">
          <Link href="/" className="flex items-center gap-2" onClick={onClose}>
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

          {/* Close button */}
          <button
            onClick={onClose}
            className="flex items-center justify-center h-8 w-8 rounded-lg text-gray-400 hover:bg-purple-950/30 hover:text-white transition-all cursor-pointer"
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1.5 px-4 py-6 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.path);

            return (
              <Link
                key={item.name}
                href={item.path}
                onClick={onClose}
                className={`
                  flex items-center gap-3.5 rounded-xl px-4 py-3 text-xs font-semibold tracking-wide transition-all cursor-pointer
                  ${
                    isActive
                      ? "bg-[#a356db] text-white shadow-lg shadow-purple-500/10"
                      : "text-gray-400 hover:bg-purple-950/20 hover:text-gray-200"
                  }
                `}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer / Log out */}
        <div className="p-4 border-t border-purple-900/10">
          <button
            onClick={() => {
              onClose();
              onLogout();
            }}
            className="flex w-full items-center gap-3.5 rounded-xl px-4 py-3 text-xs font-semibold tracking-wide text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
          >
            <LogOut className="h-4 w-4 flex-shrink-0" />
            Log Out
          </button>
        </div>
      </div>
    </>
  );
}
