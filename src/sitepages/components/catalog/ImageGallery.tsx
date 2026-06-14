"use client";

import { useState } from "react";

interface ImageGalleryProps {
    images: string[];
    bgColor: string;
    productName: string;
}

export default function ImageGallery({ images, bgColor, productName }: ImageGalleryProps) {
    const [activeIndex, setActiveIndex] = useState(0);

    const hasImages = images && images.length > 0;

    return (
        <div className="space-y-4 w-full">
            {/* Main Image View */}
            <div 
                className="aspect-[4/5] rounded-lg w-full flex items-center justify-center relative overflow-hidden group transition-all duration-300"
                style={{ backgroundColor: bgColor }}
            >
                {hasImages ? (
                    <img 
                        src={images[activeIndex]} 
                        alt={`${productName} - View ${activeIndex + 1}`}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-white/40 text-sm font-semibold tracking-widest uppercase select-none">
                        Product Image Placeholder
                    </div>
                )}
            </div>

            {/* Thumbnails Row */}
            {hasImages && images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                    {images.map((imgUrl, idx) => (
                        <button 
                            key={idx} 
                            onClick={() => setActiveIndex(idx)}
                            className={`aspect-square bg-white rounded overflow-hidden border-2 transition-all cursor-pointer relative ${
                                activeIndex === idx 
                                    ? "border-[#073623] scale-[0.98]" 
                                    : "border-transparent hover:border-slate-300"
                            }`}
                        >
                            <img 
                                src={imgUrl} 
                                alt={`${productName} thumbnail ${idx + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
