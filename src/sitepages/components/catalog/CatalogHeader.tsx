"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

interface CatalogHeaderProps {
    categoryName: string;
    description?: string;
    images?: string[];

}

export default function CatalogHeader({ 
    categoryName, 
    description, 
    images = [], 

}: CatalogHeaderProps) {
    const displayDesc = description || "";
    const [currentImageIdx, setCurrentImageIdx] = useState(0);



    const slideImages = images.length > 0 ? images : [];

    useEffect(() => {
        if (slideImages.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentImageIdx((prev) => (prev + 1) % slideImages.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [slideImages]);

    return (
        <div className="mb-14">
            {/* Split Hero Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8 lg:gap-14 items-center mb-10 pb-8 border-b border-black/10">
                {/* Left Side: Content */}
                <div className="space-y-6">
                    {/* Breadcrumbs */}
                    <nav className="flex items-center text-[11px] font-medium tracking-wider uppercase text-slate-500">
                        <Link href="/" className="hover:text-black transition-colors">Home</Link>
                        <ChevronRight className="w-3 h-3 mx-2" />
                        <span className="text-black capitalize">{categoryName.replace(/-/g, ' ')}</span>
                    </nav>

                    <div className="space-y-4">
                        <h1 className="font-serif text-[36px] md:text-[48px] text-slate-900 leading-tight capitalize">
                            {categoryName.replace(/-/g, ' ')}
                        </h1>
                        <p className="text-slate-600 text-[14px] leading-relaxed max-w-xl">
                            {displayDesc}
                        </p>
                    </div>

                </div>

                {/* Right Side: Auto-sliding Images Box */}
                {slideImages.length > 0 && (
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-black/[0.06] bg-[#e3ded9] shadow-md p-2">
                        <div className="relative w-full h-full rounded-xl overflow-hidden">
                            {slideImages.map((imgUrl, idx) => (
                                <img
                                    key={imgUrl}
                                    src={imgUrl}
                                    alt={`${categoryName} Slide ${idx}`}
                                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                                        idx === currentImageIdx ? "opacity-100" : "opacity-0"
                                    }`}
                                />
                            ))}

                            {/* Slider Dots Indicator */}
                            {slideImages.length > 1 && (
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20 bg-black/25 px-3 py-1.5 rounded-full backdrop-blur-sm">
                                    {slideImages.map((_, dotIdx) => (
                                        <button
                                            key={dotIdx}
                                            onClick={() => setCurrentImageIdx(dotIdx)}
                                            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                                                dotIdx === currentImageIdx ? "bg-white w-3" : "bg-white/40"
                                            }`}
                                            aria-label={`Go to slide ${dotIdx + 1}`}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
