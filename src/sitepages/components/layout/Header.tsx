"use client";

import { Search, Heart, ShoppingBag, User, LogOut, ThumbsUp, Package, X, Tag, ChevronRight, Menu } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Fraunces, Manrope, Space_Grotesk } from "next/font/google";
import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import MobileMenu from "./MobileMenu";

/**
 * Same type system as the rest of the site (see /collections):
 * Fraunces for the wordmark, Manrope for body copy, Space Grotesk for
 * tracked-out labels. Ideally these three live once in app/layout.tsx —
 * left here so Header keeps working standalone.
 */
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

export default function Header() {
    const { toggleCart, cartCount } = useCart();
    const [user, setUser] = useState<{ id: string; name?: string; email: string; avatar?: string } | null>(null);
    const [loading, setLoading] = useState(true);
    const [scrolled, setScrolled] = useState(false);
    const [collections, setCollections] = useState<any[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();
    const router = useRouter();
    const isHome = pathname === "/";
    const isOrders = pathname.startsWith("/orders");

    // Search states
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<{ products: any[]; collections: any[]; subCollections: any[] } | null>(null);
    const [searchLoading, setSearchLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);



    // Header only floats transparent over a hero on the home route — every
    // other route gets a solid header immediately, since there's no hero to
    // show through. On home it solidifies once the page scrolls.
    useEffect(() => {
        if (!isHome) {
            setScrolled(true);
            return;
        }
        const onScroll = () => setScrolled(window.scrollY > 24);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, [isHome]);

    // Debounced search handler
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
                console.error("Search fetch error:", err);
            } finally {
                setSearchLoading(false);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    // Close search dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowResults(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Fetch collections for Shop dropdown
    useEffect(() => {
        fetch("/api/manage-products/category")
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setCollections(data.collections);
                }
            })
            .catch(err => console.error("Error fetching collections", err));
    }, []);

    useEffect(() => {
        fetch("/api/auth/verify")
            .then((res) => {
                if (res.ok) return res.json();
                throw new Error("Not authenticated");
            })
            .then((data) => {
                if (data.authenticated && data.user) {
                    setUser(data.user);
                } else {
                    setUser(null);
                }
            })
            .catch(() => setUser(null))
            .finally(() => setLoading(false));
    }, []);

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = async () => {
        try {
            const res = await fetch("/api/auth/logout", { method: "POST" });
            if (res.ok) {
                setUser(null);
                setShowDropdown(false);
                window.location.reload();
            }
        } catch (err) {
            console.error("Logout failed", err);
        }
    };

    // Custom slow, cinematic smooth scroll function
    const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();

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
        const duration = 1200; // 1.2 seconds for a slow, elegant glide
        let start: number | null = null;

        const easeInOutCubic = (t: number, b: number, c: number, d: number) => {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t * t + b;
            t -= 2;
            return c / 2 * (t * t * t + 2) + b;
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

    const solid = !isHome || scrolled;

    const navLinkClass = (active: boolean) =>
        `relative pb-1.5 transition-colors ${active ? "text-[#151510]" : "text-[#151510]/65 hover:text-[#151510]"}`;

    return (
        <header
            className={`fixed inset-x-0 top-0 z-50 px-4 md:px-8 py-5 flex items-center justify-between transition-all duration-500 gap-4 ${
                solid
                    ? "bg-[#f1efe7]/90 backdrop-blur-md border-b border-[#0f3a2a]/10 shadow-[0_2px_24px_rgba(15,58,42,0.05)]"
                    : "bg-transparent border-b border-transparent"
            }`}
            style={{ fontFamily: "var(--font-body)" }}
        >
            <div className={`${display.variable} ${body.variable} ${label.variable} contents`}>
                {/* Mobile Menu Toggle */}
                <button
                    onClick={() => setMobileMenuOpen(true)}
                    className="flex items-center justify-center lg:hidden mr-2 text-[#151510] hover:text-[#0f3a2a] transition-colors focus:outline-none cursor-pointer"
                    aria-label="Open navigation menu"
                >
                    <Menu className="w-6 h-6 stroke-[1.5]" />
                </button>

                {/* Brand */}
                <div className="flex-1 flex items-center justify-start min-w-0">
                    <Link href="/" className="flex items-center gap-2 sm:gap-3 w-fit">
                        <div className="relative w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full overflow-hidden flex-shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" className="w-full h-full">
                                <circle cx="44" cy="71" r="34" fill="none" stroke="#0f3a2a" strokeWidth="3.5" />
                                <circle cx="76" cy="71" r="34" fill="none" stroke="#d4af37" strokeWidth="3.5" />
                                <circle cx="60" cy="49" r="34" fill="none" stroke="#134a31" strokeWidth="3.5" />
                            </svg>
                        </div>
                        <h1
                            className="text-[20px] sm:text-[24px] md:text-[28px] font-medium tracking-wide text-[#0f3a2a] leading-none shrink-0"
                            style={{ fontFamily: "var(--font-display)" }}
                        >
                            Thread-aura
                        </h1>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="hidden lg:flex flex-none items-center justify-center space-x-5 xl:space-x-8 text-[13px] font-medium whitespace-nowrap">
                    <Link href="/" className={navLinkClass(isHome)}>
                        Home
                        <span className={`absolute left-0 right-0 -bottom-px h-[2px] bg-[#b13d33] transition-transform duration-300 origin-center ${isHome ? "scale-x-100" : "scale-x-0"}`} />
                    </Link>
                    
                    {/* Collections Dropdown */}
                    <div className="relative group flex items-center h-full py-2">
                        <Link href="#collections" onClick={(e) => handleScroll(e, "collections")} className={`${navLinkClass(false)} flex items-center gap-1 cursor-pointer group-hover:text-[#151510]`}>
                            Collections
                            <span className="absolute left-0 right-0 -bottom-px h-[2px] bg-[#b13d33] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />
                        </Link>
                        
                        {/* Dropdown Menu */}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 pt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                            <div className="w-48 bg-white border border-[#0f3a2a]/10 shadow-[0_2px_24px_rgba(15,58,42,0.05)] rounded-xl overflow-hidden py-2 flex flex-col">
                                <Link href="/collections/all" className="px-4 py-2.5 hover:bg-[#f1efe7]/50 text-[#0f3a2a] font-semibold text-[13px] transition-colors border-b border-[#0f3a2a]/5">
                                    Shop All
                                </Link>
                                {collections.map((c) => (
                                    <Link key={c._id} href={`/collections/${c.slug}`} className="px-4 py-2 hover:bg-[#f1efe7]/50 text-[#151510]/80 hover:text-[#151510] text-[13px] transition-colors">
                                        {c.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                    
                    <Link href="/orders" className={`${navLinkClass(isOrders)} group`}>
                        My Orders
                        <span className={`absolute left-0 right-0 -bottom-px h-[2px] bg-[#b13d33] transition-transform duration-300 origin-center ${isOrders ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`} />
                    </Link>
                    <Link href="#about" onClick={(e) => handleScroll(e, "about")} className={`${navLinkClass(false)} cursor-pointer group`}>
                        About
                        <span className="absolute left-0 right-0 -bottom-px h-[2px] bg-[#b13d33] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />
                    </Link>
                    <Link href="/reviews" className={`${navLinkClass(false)} cursor-pointer group`}>
                        Reviews
                        <span className="absolute left-0 right-0 -bottom-px h-[2px] bg-[#b13d33] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />
                    </Link>
                    <Link href="#contact" onClick={(e) => handleScroll(e, "contact")} className={`${navLinkClass(false)} cursor-pointer group`}>
                        Contact
                        <span className="absolute left-0 right-0 -bottom-px h-[2px] bg-[#b13d33] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />
                    </Link>
                </nav>

                {/* Actions */}
                <div className="flex-1 flex items-center justify-end space-x-4 lg:space-x-6 min-w-0">
                    <div className="relative" ref={searchRef}>
                        <div className="relative group hidden sm:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#151510]/45 group-focus-within:text-[#0f3a2a] transition-colors" />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => {
                                    if (searchQuery.trim()) setShowResults(true);
                                }}
                                className="pl-9 pr-10 py-2 bg-[#e8e6df]/80 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-[#0f3a2a] w-32 lg:w-64 transition-all placeholder:text-slate-500 font-sans"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => {
                                        setSearchQuery("");
                                        setSearchResults(null);
                                        setShowResults(false);
                                    }}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                                    aria-label="Clear search"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                    </div>

                        {/* Search Suggestions Overlay */}
                        {showResults && (
                            <div className="absolute right-0 mt-3 w-[350px] sm:w-[450px] md:w-[500px] rounded-2xl bg-white/95 backdrop-blur-md border border-[#0f3a2a]/[0.08] shadow-2xl p-5 z-50 max-h-[80vh] overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200" style={{ fontFamily: "var(--font-body)" }}>
                                {searchLoading ? (
                                    <div className="py-10 text-center text-[#151510]/50 text-xs font-medium">
                                        <div className="w-5 h-5 border-2 border-[#0f3a2a] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                                        Searching Thread-aura designs...
                                    </div>
                                ) : (
                                    <div className="space-y-5">
                                        {(!searchResults || (searchResults.products.length === 0 && searchResults.collections.length === 0 && searchResults.subCollections.length === 0)) ? (
                                            <div className="py-6 text-center text-[#151510]/35 text-xs">
                                                No designs found matching &quot;<span className="font-semibold text-[#151510]/65">{searchQuery}</span>&quot;
                                            </div>
                                        ) : (
                                            <>
                                                {searchResults.collections.length > 0 && (
                                                    <div>
                                                        <h4 className="text-[10px] font-semibold text-[#b13d33] uppercase tracking-[0.2em] mb-2 flex items-center gap-1.5" style={{ fontFamily: "var(--font-label)" }}>
                                                            <Tag className="w-3 h-3" /> Collections
                                                        </h4>
                                                        <div className="flex flex-wrap gap-2">
                                                            {searchResults.collections.map((col: any) => (
                                                                <Link
                                                                    key={col._id}
                                                                    href={`/collections/${col.slug}`}
                                                                    onClick={() => setShowResults(false)}
                                                                    className="px-3 py-1.5 bg-[#0f3a2a]/5 hover:bg-[#0f3a2a] text-[#0f3a2a] hover:text-[#fffbe4] rounded-lg text-xs font-medium transition-colors border border-[#0f3a2a]/10"
                                                                >
                                                                    {col.name}
                                                                </Link>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {searchResults.subCollections.length > 0 && (
                                                    <div>
                                                        <h4 className="text-[10px] font-semibold text-[#b13d33] uppercase tracking-[0.2em] mb-2 flex items-center gap-1.5" style={{ fontFamily: "var(--font-label)" }}>
                                                            <Tag className="w-3 h-3" /> Subcategories
                                                        </h4>
                                                        <div className="flex flex-wrap gap-2">
                                                            {searchResults.subCollections.map((sub: any) => (
                                                                <Link
                                                                    key={sub._id}
                                                                    href={`/collections/${sub.collection?.slug || "all"}/${sub.slug}`}
                                                                    onClick={() => setShowResults(false)}
                                                                    className="px-3 py-1.5 bg-[#151510]/[0.03] hover:bg-[#0f3a2a] text-[#151510]/70 hover:text-[#fffbe4] rounded-lg text-xs font-medium transition-colors border border-[#0f3a2a]/[0.08] group"
                                                                >
                                                                    {sub.name} <span className="text-[9px] text-[#151510]/35 group-hover:text-white/80 font-normal">in {sub.collection?.name}</span>
                                                                </Link>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {searchResults.products.length > 0 && (
                                                    <div className="space-y-2.5">
                                                        <h4 className="text-[10px] font-semibold text-[#b13d33] uppercase tracking-[0.2em] flex items-center gap-1.5" style={{ fontFamily: "var(--font-label)" }}>
                                                            Products
                                                        </h4>
                                                        <div className="divide-y divide-[#0f3a2a]/[0.06]">
                                                            {searchResults.products.map((prod: any) => (
                                                                <Link
                                                                    key={prod._id}
                                                                    href={`/collections/${prod.collection?.slug || "all"}/${prod.subCollection?.slug || "all"}/${prod.slug}`}
                                                                    onClick={() => setShowResults(false)}
                                                                    className="flex items-center gap-3.5 py-2.5 hover:bg-[#0f3a2a]/[0.03] rounded-lg px-1.5 transition-colors group"
                                                                >
                                                                    <div
                                                                        className="w-10 h-14 rounded overflow-hidden flex-shrink-0"
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
                                                                        <div className="flex items-baseline justify-between gap-2">
                                                                            <h5 className="text-[13px] font-semibold text-[#151510] truncate group-hover:text-[#0f3a2a] transition-colors">
                                                                                {prod.name}
                                                                            </h5>
                                                                            <span className="text-xs font-bold text-[#0f3a2a]">
                                                                                ₹{prod.price.toFixed(2)}
                                                                            </span>
                                                                        </div>
                                                                        <p className="text-[10px] text-[#151510]/40 mt-0.5 font-medium">
                                                                            Material: {prod.material || "Premium Thread"}
                                                                        </p>
                                                                        <p className="text-[9px] text-[#b13d33] font-bold uppercase tracking-wider mt-0.5">
                                                                            {prod.collection?.name} &bull; {prod.subCollection?.name}
                                                                        </p>
                                                                    </div>
                                                                    <ChevronRight className="w-4 h-4 text-[#151510]/20 group-hover:text-[#151510]/50 transition-colors" />
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

                    {/* User Auth Section */}
                    <div className="relative" ref={dropdownRef}>
                        {loading ? (
                            <div className="w-[18px] h-[18px] animate-pulse rounded-full bg-[#0f3a2a]/10" />
                        ) : (
                            <>
                                <button
                                    onClick={() => setShowDropdown(!showDropdown)}
                                    className="flex items-center justify-center focus:outline-none transition-transform active:scale-95 text-[#151510] hover:text-[#b13d33]"
                                    aria-label="User profile settings"
                                >
                                    {user ? (
                                        user.avatar ? (
                                            <div className="relative w-7 h-7 rounded-full overflow-hidden ring-1 ring-[#d4af37]/50">
                                                <Image
                                                    src={user.avatar}
                                                    alt={user.name || user.email}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <div
                                                className="w-7 h-7 rounded-full bg-[#0f3a2a] text-white flex items-center justify-center text-xs font-bold ring-1 ring-[#d4af37]/50"
                                                style={{ fontFamily: "var(--font-display)" }}
                                            >
                                                {(user.name || user.email)[0].toUpperCase()}
                                            </div>
                                        )
                                    ) : (
                                        <User className="w-[18px] h-[18px] stroke-[1.5]" />
                                    )}
                                </button>

                                {showDropdown && (
                                    <div className="absolute right-0 mt-3 w-56 rounded-xl bg-white border border-[#0f3a2a]/[0.08] p-2 shadow-lg z-50 animate-in fade-in slide-in-from-top-2 duration-200" style={{ fontFamily: "var(--font-body)" }}>
                                        {user ? (
                                            <>
                                                <div className="px-3 py-2.5">
                                                    <p className="text-[10px] uppercase tracking-[0.15em] text-[#151510]/40" style={{ fontFamily: "var(--font-label)" }}>Signed in as</p>
                                                    <p className="text-sm font-semibold text-[#0f3a2a] truncate mt-1">
                                                        {user.name || "User"}
                                                    </p>
                                                    <p className="text-xs text-[#151510]/50 truncate mt-0.5">
                                                        {user.email}
                                                    </p>
                                                </div>
                                                <div className="h-px bg-[#0f3a2a]/[0.08] my-1" />
                                            </>
                                        ) : (
                                            <>
                                                <div className="px-3 py-2">
                                                    <Link
                                                        href="/login"
                                                        className="w-full flex items-center justify-center px-3 py-2 text-sm bg-[#0f3a2a] text-white rounded-lg hover:bg-[#0f3a2a]/90 transition-colors text-center font-medium"
                                                        onClick={() => setShowDropdown(false)}
                                                    >
                                                        Sign In / Register
                                                    </Link>
                                                </div>
                                                <div className="h-px bg-[#0f3a2a]/[0.08] my-1" />
                                            </>
                                        )}
                                        
                                        <button
                                            onClick={() => {
                                                toggleCart();
                                                setShowDropdown(false);
                                            }}
                                            className="w-full flex items-center justify-between px-3 py-2 text-sm text-[#151510]/80 hover:bg-[#0f3a2a]/5 hover:text-[#0f3a2a] rounded-lg transition-colors text-left font-medium"
                                        >
                                            <div className="flex items-center gap-2">
                                                <ShoppingBag className="w-4 h-4" />
                                                <span>Shopping Cart</span>
                                            </div>
                                            {cartCount > 0 && (
                                                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#b13d33] text-white text-[10px] font-bold">
                                                    {cartCount}
                                                </span>
                                            )}
                                        </button>

                                        <Link
                                            href="/wishlist"
                                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#151510]/80 hover:bg-[#0f3a2a]/5 hover:text-[#0f3a2a] rounded-lg transition-colors text-left font-medium"
                                            onClick={() => setShowDropdown(false)}
                                        >
                                            <Heart className="w-4 h-4" />
                                            <span>My Wishlist</span>
                                        </Link>

                                        {user && (
                                            <>
                                                <Link
                                                    href="/liked"
                                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#151510]/80 hover:bg-[#0f3a2a]/5 hover:text-[#0f3a2a] rounded-lg transition-colors text-left font-medium"
                                                    onClick={() => setShowDropdown(false)}
                                                >
                                                    <ThumbsUp className="w-4 h-4" />
                                                    <span>Liked Products</span>
                                                </Link>
                                                <Link
                                                    href="/orders"
                                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#151510]/80 hover:bg-[#0f3a2a]/5 hover:text-[#0f3a2a] rounded-lg transition-colors text-left font-medium"
                                                    onClick={() => setShowDropdown(false)}
                                                >
                                                    <Package className="w-4 h-4" />
                                                    <span>Order History</span>
                                                </Link>
                                                <div className="h-px bg-[#0f3a2a]/[0.08] my-1" />
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left font-medium"
                                                >
                                                    <LogOut className="w-4 h-4" />
                                                    <span>Sign out</span>
                                                </button>
                                            </>
                                        )}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* Mobile Menu Drawer */}
                <MobileMenu
                    isOpen={mobileMenuOpen}
                    onClose={() => setMobileMenuOpen(false)}
                    user={user}
                    loading={loading}
                    onLogout={handleLogout}
                />
            </div>
        </header>
    );
}