"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function ExploreSelection() {
  const [subCollections, setSubCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const fetchSubcats = async () => {
      try {
        const res = await fetch("/api/manage-products/subcat");
        const data = await res.json();
        if (data.success) {
          // Filter active ones
          const active = data.subCollections.filter((s: any) => s.isActive);
          setSubCollections(active);
        }
      } catch (err) {
        console.error("Error fetching sub-collections:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubcats();
  }, []);

  const totalPages = Math.ceil(subCollections.length / 3);

  // Auto-sliding effect
  useEffect(() => {
    if (subCollections.length <= 3) return;
    const interval = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % totalPages);
    }, 4000);
    return () => clearInterval(interval);
  }, [subCollections.length, totalPages]);

  if (loading) {
    return (
      <section className="bg-[#F5ECE3] py-10 w-full">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          {/* Section Heading Skeleton */}
          <div className="flex flex-col items-center text-center mb-10 animate-pulse">
            <div className="h-3 w-24 bg-[#EAD9C9] mb-2 rounded" />
            <div className="h-7 w-48 bg-[#EAD9C9]/85 rounded" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col items-center w-full max-w-[240px] mx-auto animate-pulse">
                <div className="w-full rounded-t-full aspect-square bg-slate-200" />
                <div className="w-full bg-[#EAD9C9]/50 h-28 rounded-b-lg mt-[-1px]" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (subCollections.length === 0) {
    return null;
  }

  // Get exactly 3 items for display based on page index, wrapping around on last page if total count is not multiple of 3
  const displayItems = [];
  if (subCollections.length > 0) {
    const itemsToShow = Math.min(3, subCollections.length);
    for (let i = 0; i < itemsToShow; i++) {
      const idx = (currentPage * 3 + i) % subCollections.length;
      displayItems.push(subCollections[idx]);
    }
  }

  return (
    <section className="bg-[#F5ECE3] py-10 w-full">
      <div className="max-w-4xl mx-auto px-6 md:px-8">

        {/* Section Heading */}
        <div className="flex flex-col items-center text-center mb-10">
          <p className="text-[10px] font-bold tracking-[0.2em] text-[#b13d33] mb-2 uppercase">
            Curated For You
          </p>
          <h2 className="font-serif text-[26px] md:text-[32px] text-[#2C2621] leading-none">
            Shop By Style
          </h2>
        </div>

        {/* Grid layout - 3 columns displaying current page items */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 items-stretch">
          {displayItems.map((subCol, idx) => {
            const parentCol = subCol.collection as any;
            const linkHref = parentCol?.slug
              ? `/collections/${parentCol.slug}/${subCol.slug}`
              : "/collections";

            // Add animation key or class to trigger smooth state changes
            return (
              <div
                key={`${subCol._id}-${idx}`}
                className="group flex flex-col items-center w-full max-w-[240px] mx-auto transition-all duration-500 hover:-translate-y-1 animate-fade-in"
              >
                {/* 1. Arch Image Container */}
                <div className="relative w-full rounded-t-full aspect-square overflow-hidden bg-white border border-[#2C2621]/20 border-b-0 shadow-sm">
                  {subCol.image ? (
                    <Image
                      src={subCol.image}
                      alt={subCol.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      priority
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-slate-300 font-medium text-xs bg-[#FAF7F2]">
                      No Image Available
                    </div>
                  )}
                </div>

                {/* 2. Text Content Area */}
                <div className="w-full bg-[#EAD9C9] p-4 md:p-5 flex flex-col items-center text-center border border-[#2C2621]/20 rounded-b-[1px] mt-[-1px] shadow-sm flex-1 min-h-[140px] justify-between">
                  <div className="flex flex-col items-center">
                    <h3 className="font-serif text-[15px] md:text-[16px] text-[#2C2621] mb-2 leading-tight tracking-wide font-medium">
                      {subCol.name}
                    </h3>
                    {subCol.description ? (
                      <p className="text-[#5C544F] text-[10px] leading-relaxed max-w-[200px] mb-3 line-clamp-2">
                        {subCol.description}
                      </p>
                    ) : (
                      <p className="text-[#5C544F] text-[10px] leading-relaxed max-w-[200px] mb-3 line-clamp-2">
                        Discover our exquisite collection of custom crafted pieces for every special occasion.
                      </p>
                    )}
                  </div>

                  <Link
                    href={linkHref}
                    className="text-[8px] font-bold tracking-[0.2em] text-[#2C2621] hover:text-[#b13d33] transition-colors border-b border-[#2C2621]/40 pb-0.5 uppercase"
                  >
                    Read More
                  </Link>
                </div>

              </div>
            );
          })}
        </div>

        {/* Pagination Dots */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${currentPage === idx
                    ? "bg-[#2C2621] w-4"
                    : "bg-[#2C2621]/30 hover:bg-[#2C2621]/60"
                  }`}
                aria-label={`Go to page ${idx + 1}`}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}


