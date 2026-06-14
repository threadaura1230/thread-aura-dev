"use client";

import { Search, Heart, ShoppingBag, User, LogOut, ThumbsUp } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function Header() {
    const [user, setUser] = useState<{ id: string; name?: string; email: string; avatar?: string } | null>(null);
    const [loading, setLoading] = useState(true);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();
    const router = useRouter();

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
        <header className="absolute top-0 left-0 right-0 z-50 px-8 py-6 flex items-center justify-between border-b border-black/5 md:border-transparent">
            {/* Brand */}
            <div className="flex-1">
                <Link href="/" className="flex items-center gap-3 w-fit">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" className="w-full h-full">
                            <circle cx="44" cy="71" r="34" fill="none" stroke="#0f3a2a" strokeWidth="3.5" />
                            <circle cx="76" cy="71" r="34" fill="none" stroke="#d4af37" strokeWidth="3.5" />
                            <circle cx="60" cy="49" r="34" fill="none" stroke="#134a31" strokeWidth="3.5" />
                        </svg>
                    </div>
                    <h1 className="font-serif text-[28px] font-medium tracking-wide text-[#0f3a2a] leading-none">
                        Thread-aura
                    </h1>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex flex-1 justify-center space-x-8 lg:space-x-10 text-[13px] font-medium text-slate-800">
                <Link href="/" className="hover:text-slate-900 transition-colors border-b-2 border-[#134A31] pb-1">Home</Link>
                <a href="#collections" onClick={(e) => handleScroll(e, 'collections')} className="hover:text-slate-900 transition-colors border-b-2 border-transparent hover:border-slate-900 pb-1 cursor-pointer">Collections</a>
                <a href="#shop-all" onClick={(e) => handleScroll(e, 'shop-all')} className="hover:text-slate-900 transition-colors border-b-2 border-transparent hover:border-slate-900 pb-1 cursor-pointer">Shop All </a>
                <a href="#about" onClick={(e) => handleScroll(e, 'about')} className="hover:text-slate-900 transition-colors border-b-2 border-transparent hover:border-slate-900 pb-1 cursor-pointer">About</a>
                <a href="#contact" onClick={(e) => handleScroll(e, 'contact')} className="hover:text-slate-900 transition-colors border-b-2 border-transparent hover:border-slate-900 pb-1 cursor-pointer">Contact </a>
            </nav>

            {/* Actions */}
            <div className="flex-1 flex items-center justify-end space-x-5 lg:space-x-6">
                <div className="relative group hidden sm:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-slate-800 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="pl-9 pr-4 py-2 bg-[#e8e6df]/80 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-slate-300 w-32 lg:w-56 transition-all placeholder:text-slate-500"
                    />
                </div>
                <Link href="/liked" className="text-slate-800 hover:text-black transition-colors flex items-center">
                    <Heart className="w-[18px] h-[18px] stroke-[1.5]" />
                </Link>
                <Link href="/wishlist" className="relative text-slate-800 hover:text-black transition-colors">
                    <ShoppingBag className="w-[18px] h-[18px] stroke-[1.5]" />
                </Link>

                {/* User Auth Section */}
                <div className="relative" ref={dropdownRef}>
                    {loading ? (
                        <div className="w-[18px] h-[18px] animate-pulse rounded-full bg-slate-200" />
                    ) : user ? (
                        <>
                            <button
                                onClick={() => setShowDropdown(!showDropdown)}
                                className="flex items-center justify-center focus:outline-none transition-transform active:scale-95"
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
                        >
                            <User className="w-[18px] h-[18px] stroke-[1.5]" />
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}

