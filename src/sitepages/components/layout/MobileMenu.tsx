"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Fraunces, Manrope, Space_Grotesk } from "next/font/google";
import {
  X,
  Search,
  Tag,
  ChevronRight,
  Heart,
  ThumbsUp,
  Package,
  LogOut,
  User,
  Home,
  Info,
  Phone,
  Compass,
  ShoppingBag
} from "lucide-react";

const display = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
});
const body = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});
const label = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-label",
});

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  user: { id: string; name?: string; email: string; avatar?: string } | null;
  loading: boolean;
  onLogout: () => void;
}

export default function MobileMenu({
  isOpen,
  onClose,
  user,
  loading,
  onLogout
}: MobileMenuProps) {
  const pathname = usePathname();
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{ products: any[]; collections: any[]; subCollections: any[] } | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults(null);
      setShowResults(false);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data);
          setShowResults(true);
        }
      } catch (err) {
        console.error("Mobile search error:", err);
      } finally {
        setSearchLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    onClose();
    document.body.style.overflow = "";

    if (pathname !== "/") {
      router.push(`/#${id}`);
      return;
    }

    const element = document.getElementById(id);
    if (!element) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const targetPosition = element.getBoundingClientRect().top + window.scrollY;

    if (prefersReducedMotion) {
      window.scrollTo(0, targetPosition);
      return;
    }

    const startPosition = window.scrollY;
    const distance = targetPosition - startPosition;
    const duration = 1200;
    let start: number | null = null;

    const easeInOutCubic = (t: number, b: number, c: number, d: number) => {
      t /= d / 2;
      if (t < 1) return (c / 2) * t * t * t + b;
      t -= 2;
      return (c / 2) * (t * t * t + 2) + b;
    };

    const animation = (currentTime: number) => {
      if (start === null) start = currentTime;
      const timeElapsed = currentTime - start;
      const run = easeInOutCubic(timeElapsed, startPosition, distance, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) requestAnimationFrame(animation);
    };

    requestAnimationFrame(animation);
  };

  const navItemClass = (active: boolean) =>
    `flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-[14px] font-medium transition-all ${active ? "bg-[#0f3a2a] text-[#fffbe4]" : "text-[#151510]/75 hover:bg-[#0f3a2a]/[0.06] hover:text-[#151510]"
    }`;

  return (
    <div className={`${display.variable} ${body.variable} ${label.variable} contents`} style={{ fontFamily: "var(--font-body)" }}>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-[#151510]/45 backdrop-blur-sm transition-opacity duration-300 md:hidden ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Container */}
      <div
        ref={menuRef}
        className={`fixed inset-y-0 left-0 z-[60] flex h-full w-80 max-w-[85vw] flex-col border-r border-[#0f3a2a]/[0.08] bg-[#F1EFE7] transition-transform duration-300 ease-in-out md:hidden ${isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation Menu"
      >
        {/* Header Section */}
        <div className="flex h-20 items-center justify-between px-6 border-b border-[#0f3a2a]/[0.08]">
          <Link href="/" className="flex items-center gap-2.5" onClick={onClose}>
            <div className="relative w-9 h-9 rounded-full overflow-hidden flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" className="w-full h-full">
                <circle cx="44" cy="71" r="34" fill="none" stroke="#0f3a2a" strokeWidth="3.5" />
                <circle cx="76" cy="71" r="34" fill="none" stroke="#d4af37" strokeWidth="3.5" />
                <circle cx="60" cy="49" r="34" fill="none" stroke="#134a31" strokeWidth="3.5" />
              </svg>
            </div>
            <span className="text-[18px] font-medium tracking-wide text-[#0f3a2a]" style={{ fontFamily: "var(--font-display)" }}>
              Thread-aura
            </span>
          </Link>

          <button
            onClick={onClose}
            className="flex items-center justify-center h-9 w-9 rounded-full text-[#151510]/50 hover:bg-[#0f3a2a]/[0.06] hover:text-[#151510] transition-all cursor-pointer"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search Box Section */}
        <div ref={searchContainerRef} className="px-5 py-4 border-b border-[#0f3a2a]/[0.08] relative">
          <div className="relative group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#151510]/45 group-focus-within:text-[#0f3a2a] transition-colors" />
            <input
              type="text"
              placeholder="Search bangles, materials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                if (searchQuery.trim()) setShowResults(true);
              }}
              className="w-full pl-10 pr-10 py-2.5 bg-white/70 border border-[#0f3a2a]/10 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#b13d33] focus:border-[#b13d33]/40 transition-all placeholder:text-[#151510]/40"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSearchResults(null);
                  setShowResults(false);
                }}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#151510]/35 hover:text-[#151510]/70 transition-colors"
                aria-label="Clear search query"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {showResults && (
            <div className="absolute left-5 right-5 mt-2 z-50 rounded-xl bg-white/98 backdrop-blur-md border border-[#0f3a2a]/[0.08] shadow-xl p-4 max-h-[350px] overflow-y-auto">
              {searchLoading ? (
                <div className="py-6 text-center text-[#151510]/50 text-xs font-medium">
                  <div className="w-4 h-4 border-2 border-[#0f3a2a] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  Searching...
                </div>
              ) : (
                <div className="space-y-4">
                  {(!searchResults || (searchResults.products.length === 0 && searchResults.collections.length === 0 && searchResults.subCollections.length === 0)) ? (
                    <div className="py-4 text-center text-[#151510]/35 text-xs">
                      No designs found matching &quot;<span className="font-semibold text-[#151510]/65">{searchQuery}</span>&quot;
                    </div>
                  ) : (
                    <>
                      {searchResults.collections.length > 0 && (
                        <div>
                          <h4 className="text-[9px] font-semibold text-[#b13d33] uppercase tracking-[0.2em] mb-1.5 flex items-center gap-1" style={{ fontFamily: "var(--font-label)" }}>
                            <Tag className="w-2.5 h-2.5" /> Collections
                          </h4>
                          <div className="flex flex-wrap gap-1.5">
                            {searchResults.collections.map((col: any) => (
                              <Link
                                key={col._id}
                                href={`/collections/${col.slug}`}
                                onClick={() => {
                                  setShowResults(false);
                                  onClose();
                                }}
                                className="px-2 py-1 bg-[#0f3a2a]/5 hover:bg-[#0f3a2a] text-[#0f3a2a] hover:text-[#fffbe4] rounded text-[11px] font-medium transition-colors"
                              >
                                {col.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}

                      {searchResults.subCollections.length > 0 && (
                        <div>
                          <h4 className="text-[9px] font-semibold text-[#b13d33] uppercase tracking-[0.2em] mb-1.5 flex items-center gap-1" style={{ fontFamily: "var(--font-label)" }}>
                            <Tag className="w-2.5 h-2.5" /> Subcategories
                          </h4>
                          <div className="flex flex-wrap gap-1.5">
                            {searchResults.subCollections.map((sub: any) => (
                              <Link
                                key={sub._id}
                                href={`/collections/${sub.collection?.slug || "all"}/${sub.slug}`}
                                onClick={() => {
                                  setShowResults(false);
                                  onClose();
                                }}
                                className="px-2 py-1 bg-[#151510]/[0.03] hover:bg-[#0f3a2a] text-[#151510]/70 hover:text-[#fffbe4] rounded text-[11px] font-medium transition-colors border border-[#0f3a2a]/[0.08]"
                              >
                                {sub.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}

                      {searchResults.products.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-[9px] font-semibold text-[#b13d33] uppercase tracking-[0.2em] flex items-center gap-1" style={{ fontFamily: "var(--font-label)" }}>
                            Products
                          </h4>
                          <div className="divide-y divide-[#0f3a2a]/[0.06]">
                            {searchResults.products.map((prod: any) => (
                              <Link
                                key={prod._id}
                                href={`/collections/${prod.collection?.slug || "all"}/${prod.subCollection?.slug || "all"}/${prod.slug}`}
                                onClick={() => {
                                  setShowResults(false);
                                  onClose();
                                }}
                                className="flex items-center gap-2.5 py-2 hover:bg-[#0f3a2a]/[0.03] rounded transition-colors group text-left"
                              >
                                <div
                                  className="w-8 h-10 rounded overflow-hidden flex-shrink-0"
                                  style={{ backgroundColor: prod.bgColor || "#1f332a" }}
                                >
                                  {prod.images?.[0] && (
                                    <img
                                      src={prod.images[0]}
                                      alt={prod.name}
                                      className="w-full h-full object-cover"
                                    />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-baseline justify-between gap-1">
                                    <h5 className="text-[12px] font-semibold text-[#151510] truncate group-hover:text-[#0f3a2a] transition-colors">
                                      {prod.name}
                                    </h5>
                                    <span className="text-[11px] font-bold text-[#0f3a2a]">
                                      ₹{prod.price.toFixed(2)}
                                    </span>
                                  </div>
                                  <p className="text-[9px] text-[#151510]/40 truncate">
                                    {prod.collection?.name}
                                  </p>
                                </div>
                                <ChevronRight className="w-3.5 h-3.5 text-[#151510]/25" />
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6">
          <nav className="flex flex-col space-y-1.5">
            <Link href="/" onClick={onClose} className={navItemClass(pathname === "/")}>
              <Home className="w-[18px] h-[18px] stroke-[1.6]" />
              Home
            </Link>

            <a href="#collections" onClick={(e) => handleScroll(e, "collections")} className={`${navItemClass(false)} cursor-pointer`}>
              <Compass className="w-[18px] h-[18px] stroke-[1.6]" />
              Collections
            </a>

            <a href="#shop-all" onClick={(e) => handleScroll(e, "shop-all")} className={`${navItemClass(false)} cursor-pointer`}>
              <ShoppingBag className="w-[18px] h-[18px] stroke-[1.6]" />
              Shop All
            </a>

            <Link href="/orders" onClick={onClose} className={navItemClass(pathname.startsWith("/orders"))}>
              <Package className="w-[18px] h-[18px] stroke-[1.6]" />
              My Orders
            </Link>

            <a href="#about" onClick={(e) => handleScroll(e, "about")} className={`${navItemClass(false)} cursor-pointer`}>
              <Info className="w-[18px] h-[18px] stroke-[1.6]" />
              About
            </a>

            <a href="#contact" onClick={(e) => handleScroll(e, "contact")} className={`${navItemClass(false)} cursor-pointer`}>
              <Phone className="w-[18px] h-[18px] stroke-[1.6]" />
              Contact
            </a>
          </nav>
        </div>

        {/* User Account / Auth Section Footer */}
        <div className="p-5 border-t border-[#0f3a2a]/[0.08]">
          {loading ? (
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="w-8 h-8 rounded-full bg-[#0f3a2a]/10 animate-pulse" />
              <div className="space-y-1.5 flex-1">
                <div className="h-3 bg-[#0f3a2a]/10 rounded animate-pulse w-3/4" />
                <div className="h-2.5 bg-[#0f3a2a]/10 rounded animate-pulse w-1/2" />
              </div>
            </div>
          ) : user ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3 px-2 py-1">
                {user.avatar ? (
                  <div className="relative w-9 h-9 rounded-full overflow-hidden ring-1 ring-[#d4af37]/50 flex-shrink-0">
                    <img
                      src={user.avatar}
                      alt={user.name || user.email}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div
                    className="w-9 h-9 rounded-full bg-[#0f3a2a] text-white flex items-center justify-center text-sm font-bold ring-1 ring-[#d4af37]/50 flex-shrink-0"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {(user.name || user.email)[0].toUpperCase()}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-[#0f3a2a] truncate">
                    {user.name || "User"}
                  </p>
                  <p className="text-[10px] text-[#151510]/50 truncate">
                    {user.email}
                  </p>
                </div>
              </div>

              {/* Wishlist / Orders — two separate features, two tiles */}
              <div className="grid grid-cols-2 gap-2 text-center text-[11px]">
                <Link
                  href="/wishlist"
                  onClick={onClose}
                  className="flex flex-col items-center justify-center gap-1 py-2.5 border border-[#0f3a2a]/[0.08] hover:bg-[#0f3a2a]/[0.04] text-[#151510]/75 rounded-lg transition-all"
                >
                  <Heart className="w-3.5 h-3.5 text-[#151510]/50" />
                  Wishlist
                </Link>
                <Link
                  href="/orders"
                  onClick={onClose}
                  className="flex flex-col items-center justify-center gap-1 py-2.5 border border-[#0f3a2a]/[0.08] hover:bg-[#0f3a2a]/[0.04] text-[#151510]/75 rounded-lg transition-all"
                >
                  <Package className="w-3.5 h-3.5 text-[#151510]/50" />
                  Orders
                </Link>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onLogout();
                }}
                className="flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-all cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              onClick={onClose}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#0f3a2a] py-3 text-sm font-medium text-[#fffbe4] hover:bg-[#134a31] transition-all cursor-pointer shadow-sm"
            >
              <User className="h-4 w-4" />
              Sign In / Register
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}