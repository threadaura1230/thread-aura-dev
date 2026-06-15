"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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

  // Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{ products: any[]; collections: any[]; subCollections: any[] } | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Close menu on body scroll lock / unlock
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

  // Debounced search logic (matching Header.tsx search)
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

  // Handle cinematic scroll for hash links
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    onClose();

    if (pathname !== "/") {
      router.push(`/#${id}`);
      return;
    }

    const element = document.getElementById(id);
    if (element) {
      const targetPosition = element.getBoundingClientRect().top + window.scrollY;
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
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Container */}
      <div
        ref={menuRef}
        className={`fixed inset-y-0 left-0 z-50 flex w-80 max-w-[85vw] flex-col border-r border-black/[0.06] bg-[#F1EFE7] transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation Menu"
      >
        {/* Header Section */}
        <div className="flex h-20 items-center justify-between px-6 border-b border-black/[0.05]">
          <Link href="/" className="flex items-center gap-2.5" onClick={onClose}>
            <div className="relative w-9 h-9 rounded-full overflow-hidden flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" className="w-full h-full">
                <circle cx="44" cy="71" r="34" fill="none" stroke="#0f3a2a" strokeWidth="3.5" />
                <circle cx="76" cy="71" r="34" fill="none" stroke="#d4af37" strokeWidth="3.5" />
                <circle cx="60" cy="49" r="34" fill="none" stroke="#134a31" strokeWidth="3.5" />
              </svg>
            </div>
            <span className="font-serif text-[18px] font-medium tracking-wide text-[#0f3a2a]">
              Thread-aura
            </span>
          </Link>

          <button
            onClick={onClose}
            className="flex items-center justify-center h-9 w-9 rounded-full text-slate-500 hover:bg-black/5 hover:text-black transition-all cursor-pointer"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6">
          {/* Search Box */}
          <div className="relative">
            <div className="relative group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-slate-800 transition-colors" />
              <input
                type="text"
                placeholder="Search bangles, materials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => {
                  if (searchQuery.trim()) setShowResults(true);
                }}
                className="w-full pl-10 pr-10 py-2.5 bg-[#e8e6df]/80 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#0f3a2a] transition-all placeholder:text-slate-500 font-sans"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSearchResults(null);
                    setShowResults(false);
                  }}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                  aria-label="Clear search query"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Search Results Overlay in drawer (expanding content) */}
            {showResults && (
              <div className="mt-3 rounded-xl bg-white/95 backdrop-blur-md border border-black/[0.08] shadow-lg p-4 max-h-[300px] overflow-y-auto font-sans">
                {searchLoading ? (
                  <div className="py-6 text-center text-slate-500 text-xs font-medium">
                    <div className="w-4 h-4 border-2 border-[#0f3a2a] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    Searching...
                  </div>
                ) : (
                  <div className="space-y-4">
                    {(!searchResults || (searchResults.products.length === 0 && searchResults.collections.length === 0 && searchResults.subCollections.length === 0)) ? (
                      <div className="py-4 text-center text-slate-400 text-xs">
                        No designs found matching &quot;<span className="font-semibold text-slate-600">{searchQuery}</span>&quot;
                      </div>
                    ) : (
                      <>
                        {/* Collections */}
                        {searchResults.collections.length > 0 && (
                          <div>
                            <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
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

                        {/* Subcategories */}
                        {searchResults.subCollections.length > 0 && (
                          <div>
                            <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
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
                                  className="px-2 py-1 bg-slate-50 hover:bg-[#0f3a2a] text-slate-700 hover:text-[#fffbe4] rounded text-[11px] font-medium transition-colors border border-black/5"
                                >
                                  {sub.name}
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Products */}
                        {searchResults.products.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                              Products
                            </h4>
                            <div className="divide-y divide-black/5">
                              {searchResults.products.map((prod: any) => (
                                <Link
                                  key={prod._id}
                                  href={`/collections/${prod.collection?.slug || "all"}/${prod.subCollection?.slug || "all"}/${prod.slug}`}
                                  onClick={() => {
                                    setShowResults(false);
                                    onClose();
                                  }}
                                  className="flex items-center gap-2.5 py-2 hover:bg-slate-50/50 rounded transition-colors group text-left"
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
                                      <h5 className="text-[12px] font-semibold text-slate-900 truncate group-hover:text-[#0f3a2a] transition-colors">
                                        {prod.name}
                                      </h5>
                                      <span className="text-[11px] font-bold text-[#0f3a2a]">
                                        ₹{prod.price.toFixed(2)}
                                      </span>
                                    </div>
                                    <p className="text-[9px] text-slate-400 truncate">
                                      {prod.collection?.name}
                                    </p>
                                  </div>
                                  <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
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

          {/* Primary Navigation Links */}
          <nav className="flex flex-col space-y-1.5">
            <Link 
              href="/" 
              onClick={onClose}
              className={`flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-[14px] font-medium transition-all ${
                pathname === "/" ? "bg-[#0f3a2a] text-[#fffbe4]" : "text-slate-700 hover:bg-[#0f3a2a]/5 hover:text-slate-900"
              }`}
            >
              <Home className="w-[18px] h-[18px] stroke-[1.6]" />
              Home
            </Link>

            <a 
              href="#collections" 
              onClick={(e) => handleScroll(e, "collections")}
              className="flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-[14px] font-medium text-slate-700 hover:bg-[#0f3a2a]/5 hover:text-slate-900 transition-all cursor-pointer"
            >
              <Compass className="w-[18px] h-[18px] stroke-[1.6]" />
              Collections
            </a>

            <a 
              href="#shop-all" 
              onClick={(e) => handleScroll(e, "shop-all")}
              className="flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-[14px] font-medium text-slate-700 hover:bg-[#0f3a2a]/5 hover:text-slate-900 transition-all cursor-pointer"
            >
              <ShoppingBag className="w-[18px] h-[18px] stroke-[1.6]" />
              Shop All
            </a>

            <Link 
              href="/orders" 
              onClick={onClose}
              className={`flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-[14px] font-medium transition-all ${
                pathname.startsWith("/orders") ? "bg-[#0f3a2a] text-[#fffbe4]" : "text-slate-700 hover:bg-[#0f3a2a]/5 hover:text-slate-900"
              }`}
            >
              <Package className="w-[18px] h-[18px] stroke-[1.6]" />
              My Orders
            </Link>

            <a 
              href="#about" 
              onClick={(e) => handleScroll(e, "about")}
              className="flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-[14px] font-medium text-slate-700 hover:bg-[#0f3a2a]/5 hover:text-slate-900 transition-all cursor-pointer"
            >
              <Info className="w-[18px] h-[18px] stroke-[1.6]" />
              About
            </a>

            <a 
              href="#contact" 
              onClick={(e) => handleScroll(e, "contact")}
              className="flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-[14px] font-medium text-slate-700 hover:bg-[#0f3a2a]/5 hover:text-slate-900 transition-all cursor-pointer"
            >
              <Phone className="w-[18px] h-[18px] stroke-[1.6]" />
              Contact
            </a>
          </nav>
        </div>

        {/* User Account / Auth Section Footer */}
        <div className="p-5 border-t border-black/[0.05] bg-black/[0.01]">
          {loading ? (
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="w-8 h-8 rounded-full bg-slate-200 animate-pulse" />
              <div className="space-y-1.5 flex-1">
                <div className="h-3 bg-slate-200 rounded animate-pulse w-3/4" />
                <div className="h-2.5 bg-slate-200 rounded animate-pulse w-1/2" />
              </div>
            </div>
          ) : user ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3 px-2 py-1">
                {user.avatar ? (
                  <div className="relative w-9 h-9 rounded-full overflow-hidden border border-[#0f3a2a]/10 flex-shrink-0">
                    <img
                      src={user.avatar}
                      alt={user.name || user.email}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-9 h-9 rounded-full bg-[#0f3a2a] text-white flex items-center justify-center text-sm font-serif font-bold flex-shrink-0">
                    {(user.name || user.email)[0].toUpperCase()}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-[#0f3a2a] truncate">
                    {user.name || "User"}
                  </p>
                  <p className="text-[10px] text-slate-500 truncate">
                    {user.email}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center text-xs">
                <Link
                  href="/liked"
                  onClick={onClose}
                  className="flex items-center justify-center gap-1.5 py-2.5 border border-black/[0.06] hover:bg-black/[0.02] text-slate-700 rounded-lg transition-all"
                >
                  <Heart className="w-3.5 h-3.5 text-slate-500" />
                  Wishlist
                </Link>
                <Link
                  href="/orders"
                  onClick={onClose}
                  className="flex items-center justify-center gap-1.5 py-2.5 border border-black/[0.06] hover:bg-black/[0.02] text-slate-700 rounded-lg transition-all"
                >
                  <Package className="w-3.5 h-3.5 text-slate-500" />
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
    </>
  );
}
