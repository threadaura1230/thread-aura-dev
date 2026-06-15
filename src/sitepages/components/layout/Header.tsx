"use client";

import { Search, Heart, ShoppingBag, User, LogOut, ThumbsUp, Package, X, Tag, ChevronRight, Menu } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import MobileMenu from "./MobileMenu";

export default function Header() {
    const { toggleCart, cartCount } = useCart();
    const [user, setUser] = useState<{ id: string; name?: string; email: string; avatar?: string } | null>(null);
    const [loading, setLoading] = useState(true);
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
            // If on another page, navigate to home page with the hash
            router.push(`/#${id}`);
            return;
        }

        const element = document.getElementById(id);
        if (element) {
            const targetPosition = element.getBoundingClientRect().top + window.scrollY;
            const startPosition = window.scrollY;
            const distance = targetPosition - startPosition;
            const duration = 1200; // 1.2 seconds for a slow, elegant glide
            let start: number | null = null;

            const animation = (currentTime: number) => {
                if (start === null) start = currentTime;
                const timeElapsed = currentTime - start;
                const run = easeInOutCubic(timeElapsed, startPosition, distance, duration);
                window.scrollTo(0, run);
                if (timeElapsed < duration) requestAnimationFrame(animation);
            };

            // Elegant easing function
            const easeInOutCubic = (t: number, b: number, c: number, d: number) => {
                t /= d / 2;
                if (t < 1) return c / 2 * t * t * t + b;
                t -= 2;
                return c / 2 * (t * t * t + 2) + b;
            };

            requestAnimationFrame(animation);
        }
    };

    return (
        <header className="absolute top-0 left-0 right-0 z-50 px-6 md:px-8 py-6 flex items-center justify-between border-b border-black/5 md:border-transparent">
            {/* Mobile Menu Toggle */}
            <button
                onClick={() => setMobileMenuOpen(true)}
                className="flex items-center justify-center md:hidden mr-3 text-slate-800 hover:text-black transition-colors focus:outline-none cursor-pointer"
                aria-label="Open navigation menu"
            >
                <Menu className="w-6 h-6 stroke-[1.5]" />
            </button>

            {/* Brand */}
            <div className="flex-1 flex items-center">
                <Link href="/" className="flex items-center gap-2 sm:gap-3 w-fit">
                    <div className="relative w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full overflow-hidden flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" className="w-full h-full">
                            <circle cx="44" cy="71" r="34" fill="none" stroke="#0f3a2a" strokeWidth="3.5" />
                            <circle cx="76" cy="71" r="34" fill="none" stroke="#d4af37" strokeWidth="3.5" />
                            <circle cx="60" cy="49" r="34" fill="none" stroke="#134a31" strokeWidth="3.5" />
                        </svg>
                    </div>
                    <h1 className="font-serif text-[20px] sm:text-[24px] md:text-[28px] font-medium tracking-wide text-[#0f3a2a] leading-none">
                        Thread-aura
                    </h1>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex flex-initial justify-center space-x-6 lg:space-x-8 text-[13px] font-medium text-slate-800 whitespace-nowrap">
                <Link href="/" className={`hover:text-slate-900 transition-colors border-b-2 pb-1 ${isHome ? "border-[#134A31]" : "border-transparent hover:border-slate-900"}`}>Home</Link>
                <a href="#collections" onClick={(e) => handleScroll(e, 'collections')} className="hover:text-slate-900 transition-colors border-b-2 border-transparent hover:border-slate-900 pb-1 cursor-pointer">Collections</a>
                <a href="#shop-all" onClick={(e) => handleScroll(e, 'shop-all')} className="hover:text-slate-900 transition-colors border-b-2 border-transparent hover:border-slate-900 pb-1 cursor-pointer">Shop All</a>
                <Link href="/orders" className={`hover:text-slate-900 transition-colors border-b-2 pb-1 ${isOrders ? "border-[#134A31]" : "border-transparent hover:border-slate-900"}`}>My Orders</Link>
                <a href="#about" onClick={(e) => handleScroll(e, 'about')} className="hover:text-slate-900 transition-colors border-b-2 border-transparent hover:border-slate-900 pb-1 cursor-pointer">About</a>
                <a href="#contact" onClick={(e) => handleScroll(e, 'contact')} className="hover:text-slate-900 transition-colors border-b-2 border-transparent hover:border-slate-900 pb-1 cursor-pointer">Contact</a>
            </nav>

            {/* Actions */}
            <div className="flex-1 flex items-center justify-end space-x-5 lg:space-x-6">
                <div className="relative" ref={searchRef}>
                    <div className="relative group hidden sm:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-slate-800 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search bangles, materials, prices..."
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
                        <div className="absolute right-0 mt-3 w-[350px] sm:w-[450px] md:w-[500px] rounded-2xl bg-white/95 backdrop-blur-md border border-black/[0.08] shadow-2xl p-5 z-50 max-h-[80vh] overflow-y-auto font-sans animate-in fade-in slide-in-from-top-2 duration-200">
                            {searchLoading ? (
                                <div className="py-10 text-center text-slate-500 text-xs font-medium">
                                    <div className="w-5 h-5 border-2 border-[#0f3a2a] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                                    Searching Thread-aura designs...
                                </div>
                            ) : (
                                <div className="space-y-5">
                                    {/* No results state */}
                                    {(!searchResults || (searchResults.products.length === 0 && searchResults.collections.length === 0 && searchResults.subCollections.length === 0)) ? (
                                        <div className="py-6 text-center text-slate-400 text-xs">
                                            No designs found matching &quot;<span className="font-semibold text-slate-600">{searchQuery}</span>&quot;
                                        </div>
                                    ) : (
                                        <>
                                            {/* Categories (Collections) Matches */}
                                            {searchResults.collections.length > 0 && (
                                                <div>
                                                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
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

                                            {/* Subcategories Matches */}
                                            {searchResults.subCollections.length > 0 && (
                                                <div>
                                                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                                                        <Tag className="w-3 h-3" /> Subcategories
                                                    </h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {searchResults.subCollections.map((sub: any) => (
                                                            <Link
                                                                key={sub._id}
                                                                href={`/collections/${sub.collection?.slug || "all"}/${sub.slug}`}
                                                                onClick={() => setShowResults(false)}
                                                                className="px-3 py-1.5 bg-slate-50 hover:bg-[#0f3a2a] text-slate-700 hover:text-[#fffbe4] rounded-lg text-xs font-medium transition-colors border border-black/5"
                                                            >
                                                                {sub.name} <span className="text-[9px] text-slate-400 group-hover:text-white/80 font-normal">in {sub.collection?.name}</span>
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Products Matches */}
                                            {searchResults.products.length > 0 && (
                                                <div className="space-y-2.5">
                                                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                                        Products
                                                    </h4>
                                                    <div className="divide-y divide-black/5">
                                                        {searchResults.products.map((prod: any) => (
                                                            <Link
                                                                key={prod._id}
                                                                href={`/collections/${prod.collection?.slug || "all"}/${prod.subCollection?.slug || "all"}/${prod.slug}`}
                                                                onClick={() => setShowResults(false)}
                                                                className="flex items-center gap-3.5 py-2.5 hover:bg-slate-50/50 rounded-lg px-1.5 transition-colors group"
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
                                                                        <h5 className="text-[13px] font-semibold text-slate-900 truncate group-hover:text-[#0f3a2a] transition-colors">
                                                                            {prod.name}
                                                                        </h5>
                                                                        <span className="text-xs font-bold text-[#0f3a2a] font-sans">
                                                                            ₹{prod.price.toFixed(2)}
                                                                        </span>
                                                                    </div>
                                                                    <p className="text-[10px] text-slate-400 mt-0.5 font-medium">
                                                                        Material: {prod.material || "Premium Thread"}
                                                                    </p>
                                                                    <p className="text-[9px] text-[#b13d33] font-bold uppercase tracking-wider mt-0.5">
                                                                        {prod.collection?.name} &bull; {prod.subCollection?.name}
                                                                    </p>
                                                                </div>
                                                                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition-colors" />
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
                <Link href="/liked" className="text-slate-800 hover:text-black transition-colors flex items-center" aria-label="Wishlist">
                    <Heart className="w-[18px] h-[18px] stroke-[1.5]" />
                </Link>
                <button 
                    onClick={toggleCart} 
                    className="relative text-slate-800 hover:text-black transition-colors cursor-pointer flex items-center justify-center"
                    aria-label="Open Cart"
                >
                    <ShoppingBag className="w-[18px] h-[18px] stroke-[1.5]" />
                    {cartCount > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 bg-[#0f3a2a] text-white text-[9px] font-bold rounded-full flex items-center justify-center font-sans">
                            {cartCount}
                        </span>
                    )}
                </button>

                {/* User Auth Section */}
                <div className="relative" ref={dropdownRef}>
                    {loading ? (
                        <div className="w-[18px] h-[18px] animate-pulse rounded-full bg-slate-200" />
                    ) : user ? (
                        <>
                            <button
                                onClick={() => setShowDropdown(!showDropdown)}
                                className="flex items-center justify-center focus:outline-none transition-transform active:scale-95"
                                aria-label="User profile settings"
                            >
                                {user.avatar ? (
                                    <div className="relative w-7 h-7 rounded-full overflow-hidden border border-[#0f3a2a]/20">
                                        <Image
                                            src={user.avatar}
                                            alt={user.name || user.email}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-7 h-7 rounded-full bg-[#0f3a2a] text-white flex items-center justify-center text-xs font-serif font-bold">
                                        {(user.name || user.email)[0].toUpperCase()}
                                    </div>
                                )}
                            </button>

                            {/* Dropdown Menu */}
                            {showDropdown && (
                                <div className="absolute right-0 mt-3 w-56 rounded-xl bg-white border border-black/[0.05] p-2 shadow-lg z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="px-3 py-2.5">
                                        <p className="text-xs text-slate-400">Signed in as</p>
                                        <p className="text-sm font-semibold text-[#0f3a2a] truncate mt-0.5">
                                            {user.name || "User"}
                                        </p>
                                        <p className="text-xs text-slate-500 truncate mt-0.5">
                                            {user.email}
                                        </p>
                                    </div>
                                    <div className="h-px bg-black/[0.05] my-1" />
                                    <Link
                                        href="/wishlist"
                                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors text-left font-medium"
                                        onClick={() => setShowDropdown(false)}
                                    >
                                        <Heart className="w-4 h-4" />
                                        <span>My Wishlist</span>
                                    </Link>
                                    <Link
                                        href="/liked"
                                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors text-left font-medium"
                                        onClick={() => setShowDropdown(false)}
                                    >
                                        <ThumbsUp className="w-4 h-4" />
                                        <span>Liked Products</span>
                                    </Link>
                                    <Link
                                        href="/orders"
                                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors text-left font-medium"
                                        onClick={() => setShowDropdown(false)}
                                    >
                                        <Package className="w-4 h-4" />
                                        <span>Order History</span>
                                    </Link>
                                    <div className="h-px bg-black/[0.05] my-1" />
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left font-medium"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span>Sign out</span>
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <Link
                            href="/login"
                            className="text-slate-800 hover:text-black transition-colors block"
                            aria-label="Account Login"
                        >
                            <User className="w-[18px] h-[18px] stroke-[1.5]" />
                        </Link>
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
        </header>
    );
}

