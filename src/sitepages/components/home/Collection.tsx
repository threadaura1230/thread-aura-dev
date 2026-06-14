"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function Collection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [collections, setCollections] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCollections = async () => {
            try {
                const res = await fetch("/api/manage-products/category");
                const data = await res.json();
                if (data.success) {
                    // Filter active ones and select top 4
                    const active = data.collections.filter((c: any) => c.isActive).slice(0, 4);
                    setCollections(active);
                }
            } catch (err) {
                console.error("Error fetching collections:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCollections();

        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return (
            <section id="collections" className="py-24 px-6 md:px-8 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 animate-pulse">
                    <div>
                        <div className="h-4 w-20 bg-slate-200 mb-3 rounded"></div>
                        <div className="h-8 w-64 bg-slate-200 rounded"></div>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-center">
                    <div className="bg-slate-200 rounded-2xl w-full aspect-[3/4] animate-pulse"></div>
                    <div className="bg-slate-200 rounded-2xl w-full aspect-square animate-pulse"></div>
                    <div className="bg-slate-200 rounded-2xl w-full aspect-[3/4] animate-pulse"></div>
                    <div className="bg-slate-200 rounded-2xl w-full aspect-square animate-pulse"></div>
                </div>
            </section>
        );
    }

    const cardStyles = [
        { aspect: "aspect-[3/4]", isTall: true, delay: "delay-100" },
        { aspect: "aspect-square", isTall: false, delay: "delay-300" },
        { aspect: "aspect-[3/4]", isTall: false, delay: "delay-500" },
        { aspect: "aspect-square", isTall: false, delay: "delay-700" }
    ];

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
                {collections.map((col, idx) => {
                    const style = cardStyles[idx] || cardStyles[1];
                    return (
                        <div 
                            key={col._id} 
                            className={`relative group rounded-2xl overflow-hidden w-full ${style.aspect} transition-all duration-[1200ms] ease-out ${style.delay} ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-24 scale-90'}`}
                        >
                            {/* Background image or fallback */}
                            <div className="absolute inset-0 bg-[#e3ded9] transition-transform duration-700 group-hover:scale-105">
                                {col.image ? (
                                    <img 
                                        src={col.image} 
                                        alt={col.name} 
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-400 font-medium bg-[#d9dcd6]">
                                        {col.name}
                                    </div>
                                )}
                            </div>
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none"></div>

                            <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full z-10">
                                {style.isTall && (
                                    <span className="inline-block px-3 py-1 bg-[#0F3A2A] text-white text-[10px] font-bold uppercase tracking-wider rounded-[3px] mb-4">
                                        Featured Collection
                                    </span>
                                )}
                                <h3 className="font-serif text-[22px] md:text-3xl text-white mb-3">{col.name}</h3>
                                {style.isTall && col.description && (
                                    <p className="text-white/90 text-[13px] leading-relaxed max-h-0 opacity-0 translate-y-4 overflow-hidden transition-all duration-500 ease-out group-hover:max-h-64 group-hover:opacity-100 group-hover:translate-y-0 group-hover:mb-6">
                                        {col.description}
                                    </p>
                                )}
                                {!style.isTall && col.description && (
                                    <p className="text-white/90 text-[13px] max-h-0 opacity-0 translate-y-4 overflow-hidden transition-all duration-500 ease-out group-hover:max-h-32 group-hover:opacity-100 group-hover:translate-y-0 group-hover:mb-4">
                                        {col.description.slice(0, 50)}...
                                    </p>
                                )}
                                <Link href={`/collections/${col.slug}`} className="inline-block px-6 py-2.5 bg-white text-slate-900 text-[13px] font-medium rounded-[4px] hover:bg-slate-100 transition-colors">
                                    Explore
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
