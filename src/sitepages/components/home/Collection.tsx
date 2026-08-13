"use client";

import { ArrowRight } from "lucide-react";
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
                    // Filter active ones and select top 5
                    const active = data.collections.filter((c: any) => c.isActive).slice(0, 5);
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
            <section id="collections" className="py-24 px-6 md:px-8 max-w-[1440px] mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 animate-pulse">
                    <div>
                        <div className="h-4 w-20 bg-slate-200 mb-3 rounded"></div>
                        <div className="h-8 w-64 bg-slate-200 rounded"></div>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 items-center">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="bg-slate-200 rounded-sm w-full aspect-square animate-pulse"></div>
                    ))}
                </div>
            </section>
        );
    }

    return (
        <section id="collections" className="py-24 px-6 md:px-8 max-w-[1440px] mx-auto" ref={sectionRef}>
            {/* Header */}
            <div className={`flex flex-col md:flex-row md:items-end justify-between mb-12 transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 -translate-x-10 scale-95'}`}>
                <div>
                    <p className="text-[11px] font-bold tracking-[0.2em] text-[#8B6E4E] mb-3 uppercase">
                        Explore Our Collections
                    </p>
                    <h2 className="font-serif text-[32px] md:text-[40px] text-[#1E2522] leading-none">
                        Find the Jewelry That Tells Your Story
                    </h2>
                </div>
                <Link href="/collections" className="inline-flex items-center text-[11px] font-bold text-slate-800 hover:text-black tracking-wider uppercase transition-colors mt-6 md:mt-0 group">
                    View All Collections
                    <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>

            {/* Grid Layout (5 columns) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 items-stretch">
                {collections.map((col) => {
                    return (
                        <CollectionCard
                            key={col._id}
                            col={col}
                            isVisible={isVisible}
                        />
                    );
                })}
            </div>
        </section>
    );
}

function CollectionCard({ col, isVisible }: { col: any; isVisible: boolean }) {
    const images = col.images && col.images.length > 0 ? col.images : (col.image ? [col.image] : []);
    const [currentImageIdx, setCurrentImageIdx] = useState(0);

    useEffect(() => {
        if (images.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentImageIdx((prev) => (prev + 1) % images.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [images]);

    return (
        <Link 
            href={`/collections/${col.slug}`}
            className={`group flex flex-col rounded-lg overflow-hidden border border-slate-200/50 bg-[#FAF9F5] shadow-sm hover:shadow-md transition-all duration-300 w-full ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'}`}
        >
            {/* Image Container */}
            <div className="relative aspect-[1.1] w-full bg-white overflow-hidden">
                {images.length > 0 ? (
                    images.map((imgUrl: string, imgIdx: number) => (
                        <img 
                            key={imgUrl}
                            src={imgUrl} 
                            alt={`${col.name} ${imgIdx}`} 
                            className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 group-hover:scale-105 ${
                                imgIdx === currentImageIdx ? "opacity-100" : "opacity-0"
                            }`}
                        />
                    ))
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 font-medium bg-slate-50">
                        {col.name}
                    </div>
                )}
            </div>

            {/* Content Area */}
            <div className="p-6 md:p-7 flex flex-col items-center justify-center flex-1">
                <h3 className="font-sans text-[12px] font-extrabold uppercase tracking-widest text-[#1E2522] mb-1.5 text-center leading-tight">
                    {col.name}
                </h3>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 group-hover:text-black transition-colors">
                    Shop Now <ArrowRight className="w-3.5 h-3.5" />
                </span>
            </div>
        </Link>
    );
}
