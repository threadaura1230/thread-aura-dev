"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function Collection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Trigger the beautiful staggered entrance animation shortly after mounting on the client
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <section id="collections" className="py-24 px-6 md:px-8 max-w-7xl mx-auto" ref={sectionRef}>
            {/* Header */}
            <div className={`flex flex-col md:flex-row md:items-end justify-between mb-16 transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 -translate-x-10 scale-95'}`}>
                <div>
                    <p className="text-[11px] font-bold tracking-[0.2em] text-[#b13d33] mb-3 uppercase">
                        Curation
                    </p>
                    <h2 className="font-serif text-[32px] md:text-[40px] text-slate-900 leading-none">
                        Featured Collections
                    </h2>
                </div>
                <Link href="/collections" className="inline-flex items-center text-[13px] font-semibold text-[#0f3a2a] hover:text-black transition-colors mt-6 md:mt-0 group">
                    View All Collections
                    <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>

            {/* Horizontal Alternating Layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-center">

                {/* Card 1: Tall */}
                <div className={`relative group rounded-2xl overflow-hidden bg-[#d9dcd6] w-full aspect-[3/4] transition-all duration-[1200ms] ease-out delay-100 ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-24 scale-90'}`}>
                    {/* USER: Replace the div below with your next/image */}
                    <div className="absolute inset-0 bg-[#d9dcd6] transition-transform duration-700 group-hover:scale-105">
                        <div className="w-full h-full flex items-center justify-center text-slate-400 font-medium">Image (Tall)</div>
                    </div>
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none"></div>

                    <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full z-10">
                        <span className="inline-block px-3 py-1 bg-[#0F3A2A] text-white text-[10px] font-bold uppercase tracking-wider rounded-[3px] mb-4">
                            Limited Edition
                        </span>
                        <h3 className="font-serif text-[24px] md:text-3xl text-white mb-3">Imperial Emerald</h3>
                        <p className="text-white/90 text-[13px] mb-6 leading-relaxed hidden md:block">
                            Our royal thread weave, inspired by the lush gardens of the Orient.
                        </p>
                        <Link href="/imperial-emerald" className="inline-block px-6 py-2.5 bg-white text-slate-900 text-[13px] font-medium rounded-[4px] hover:bg-slate-100 transition-colors">
                            Explore
                        </Link>
                    </div>
                </div>

                {/* Card 2: Square */}
                <div className={`relative group rounded-2xl overflow-hidden bg-[#e3ded9] w-full aspect-square transition-all duration-[1200ms] ease-out delay-300 ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-24 scale-90'}`}>
                    {/* USER: Replace the div below with your next/image */}
                    <div className="absolute inset-0 bg-[#e3ded9] transition-transform duration-700 group-hover:scale-105">
                        <div className="w-full h-full flex items-center justify-center text-slate-400 font-medium">Image (Square)</div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>

                    <div className="absolute bottom-0 left-0 p-6 w-full z-10">
                        <h3 className="font-serif text-[22px] md:text-2xl text-white mb-1.5">Sunset Silk</h3>
                        <p className="text-white/90 text-[13px]">Warm tones for every hour.</p>
                    </div>
                </div>

                {/* Card 3: Tall */}
                <div className={`relative group rounded-2xl overflow-hidden bg-[#d5d1cc] w-full aspect-[3/4] transition-all duration-[1200ms] ease-out delay-500 ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-24 scale-90'}`}>
                    {/* USER: Replace the div below with your next/image */}
                    <div className="absolute inset-0 bg-[#d5d1cc] transition-transform duration-700 group-hover:scale-105">
                        <div className="w-full h-full flex items-center justify-center text-slate-400 font-medium text-center px-4">Image (Tall)</div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>

                    <div className="absolute bottom-0 left-0 p-6 w-full z-10">
                        <h3 className="font-serif text-[20px] md:text-xl text-white mb-1.5">The Core Blank</h3>
                        <p className="text-white/90 text-[13px]">Essentials for your collection.</p>
                    </div>
                </div>

                {/* Card 4: Square (Bespoke Design) */}
                <div className={`relative rounded-2xl overflow-hidden bg-[#883d11] w-full aspect-square flex flex-col items-center justify-center p-6 text-center text-white group hover:bg-[#73340e] cursor-pointer transition-all duration-[1200ms] ease-out delay-700 ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-24 scale-90'}`}>
                    <Sparkles className="w-7 h-7 mb-4 text-[#fdfbf7]" strokeWidth={1.5} />
                    <h3 className="font-serif text-[20px] md:text-xl mb-2 text-[#fdfbf7]">Bespoke Design</h3>
                    <p className="text-[#fdfbf7]/80 text-[12px] mb-5">Your story, translated in threads.</p>
                    <Link href="/bespoke-design" className="text-[11px] font-semibold tracking-wider uppercase underline underline-offset-4 hover:text-white transition-colors">
                        Begin Crafting
                    </Link>
                </div>

            </div>
        </section>
    );
}
