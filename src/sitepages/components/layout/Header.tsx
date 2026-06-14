"use client";

import { Search, Heart, ShoppingBag, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
    // Custom slow, cinematic smooth scroll function
    const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
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
                        <Image
                            src="/logo.png"
                            alt="Thread-aura Logo"
                            fill
                            className="object-cover"
                            priority
                        />
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
                <button className="text-slate-800 hover:text-black transition-colors">
                    <Heart className="w-[18px] h-[18px] stroke-[1.5]" />
                </button>
                <button className="relative text-slate-800 hover:text-black transition-colors">
                    <ShoppingBag className="w-[18px] h-[18px] stroke-[1.5]" />
                    <span className="absolute -top-1.5 -right-2 bg-[#8C2323] text-white text-[9px] font-bold w-[15px] h-[15px] flex items-center justify-center rounded-full">
                        2
                    </span>
                </button>
                <button className="text-slate-800 hover:text-black transition-colors">
                    <User className="w-[18px] h-[18px] stroke-[1.5]" />
                </button>
            </div>
        </header>
    );
}
