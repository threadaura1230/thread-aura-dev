"use client";

import { usePathname, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  LayoutDashboard,
  LogOut,
  Package,
  ShoppingCart,
  Mail,
  X,
  ChevronDown,
  Layers,
  FolderTree,
  Box,
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
  const [productsOpen, setProductsOpen] = useState(
    pathname.includes("/manage-products")
  );

  const mainItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: `/admin/${secret}/dashboard`,
    },
    {
      name: "Orders",
      icon: ShoppingCart,
      path: `/admin/${secret}/orders`,
    },
    {
      name: "Contacts",
      icon: Mail,
      path: `/admin/${secret}/contact`,
    },
  ];

  const productSubItems = [
    {
      name: "All Products",
      icon: Box,
      path: `/admin/${secret}/manage-products/products`,
    },
    {
      name: "Collections",
      icon: Layers,
      path: `/admin/${secret}/manage-products/collections`,
    },
    {
      name: "Sub-Collections",
      icon: FolderTree,
      path: `/admin/${secret}/manage-products/sub-collections`,
    },
  ];

  const isProductsActive = pathname.includes("/manage-products");

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-black/[0.06] bg-[#FDFBF7] transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-black/[0.06]">
          <Link href="/" className="flex items-center gap-3" onClick={onClose}>
            <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
              <Image
                src="/logo.png"
                alt="Thread-aura Logo"
                width={40}
                height={40}
                className="object-cover"
              />
            </div>
            <span className="font-serif text-[18px] font-medium tracking-wide text-[#0f3a2a]">
              Thread-aura
            </span>
          </Link>

          {/* Close button */}
          <button
            onClick={onClose}
            className="flex items-center justify-center h-8 w-8 rounded-lg text-slate-400 hover:bg-black/[0.04] hover:text-slate-700 transition-all cursor-pointer"
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {/* Dashboard */}
          {mainItems.slice(0, 1).map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.path);
            return (
              <Link
                key={item.name}
                href={item.path}
                onClick={onClose}
                className={`
                  flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-[13px] font-medium transition-all
                  ${
                    isActive
                      ? "bg-[#073623] text-white shadow-sm"
                      : "text-slate-600 hover:bg-[#073623]/[0.05] hover:text-slate-900"
                  }
                `}
              >
                <Icon className="h-[18px] w-[18px] flex-shrink-0" strokeWidth={1.8} />
                {item.name}
              </Link>
            );
          })}

          {/* Manage Products (collapsible) */}
          <div>
            <button
              onClick={() => setProductsOpen(!productsOpen)}
              className={`
                flex w-full items-center justify-between rounded-lg px-3.5 py-2.5 text-[13px] font-medium transition-all cursor-pointer
                ${
                  isProductsActive
                    ? "bg-[#073623] text-white shadow-sm"
                    : "text-slate-600 hover:bg-[#073623]/[0.05] hover:text-slate-900"
                }
              `}
            >
              <span className="flex items-center gap-3">
                <Package className="h-[18px] w-[18px] flex-shrink-0" strokeWidth={1.8} />
                Manage Products
              </span>
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${
                  productsOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <div
              className={`overflow-hidden transition-all duration-200 ${
                productsOpen ? "max-h-48 mt-1" : "max-h-0"
              }`}
            >
              <div className="ml-4 pl-4 border-l border-black/[0.08] space-y-0.5">
                {productSubItems.map((sub) => {
                  const SubIcon = sub.icon;
                  const isSubActive = pathname === sub.path;
                  return (
                    <Link
                      key={sub.name}
                      href={sub.path}
                      onClick={onClose}
                      className={`
                        flex items-center gap-2.5 rounded-md px-3 py-2 text-[12px] font-medium transition-all
                        ${
                          isSubActive
                            ? "text-[#073623] bg-[#073623]/[0.06] font-semibold"
                            : "text-slate-500 hover:text-slate-800 hover:bg-black/[0.03]"
                        }
                      `}
                    >
                      <SubIcon className="h-[15px] w-[15px] flex-shrink-0" strokeWidth={1.8} />
                      {sub.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Orders & Contacts */}
          {mainItems.slice(1).map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.path);
            return (
              <Link
                key={item.name}
                href={item.path}
                onClick={onClose}
                className={`
                  flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-[13px] font-medium transition-all
                  ${
                    isActive
                      ? "bg-[#073623] text-white shadow-sm"
                      : "text-slate-600 hover:bg-[#073623]/[0.05] hover:text-slate-900"
                  }
                `}
              >
                <Icon className="h-[18px] w-[18px] flex-shrink-0" strokeWidth={1.8} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer / Log out */}
        <div className="p-4 border-t border-black/[0.06]">
          <button
            onClick={() => {
              onClose();
              onLogout();
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3.5 py-2.5 text-[13px] font-medium text-[#8C2323] hover:bg-[#8C2323]/[0.06] transition-all cursor-pointer"
          >
            <LogOut className="h-[18px] w-[18px] flex-shrink-0" strokeWidth={1.8} />
            Log Out
          </button>
        </div>
      </div>
    </>
  );
}
