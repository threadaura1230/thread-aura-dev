"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function ExploreSelection() {
  const [subCollections, setSubCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubcats = async () => {
      try {
        const res = await fetch("/api/manage-products/subcat");
        const data = await res.json();
        if (data.success) {
          // Filter active ones and slice top 5
          const active = data.subCollections
            .filter((s: any) => s.isActive)
            .slice(0, 5);
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

  if (loading) {
    return (
      <section className="bg-[#F5F3EB] py-16 w-full overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 items-stretch">
            {[1, 2, 3, 4, 5].map((i) => (
              <div 
                key={i} 
                className="bg-slate-200 rounded-2xl w-full aspect-[4/5] animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (subCollections.length === 0) {
    return null;
  }

  return (
    <section className="bg-[#F5F3EB] py-16 w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 items-stretch">
          {subCollections.map((subCol) => {
            const parentCol = subCol.collection as any;
            const linkHref = parentCol?.slug
              ? `/collections/${parentCol.slug}/${subCol.slug}`
              : "/collections";

            return (
              <Link 
                key={subCol._id}
                href={linkHref}
                className="group flex flex-col rounded-2xl overflow-hidden border border-slate-200/50 bg-[#FAF9F5] shadow-sm hover:shadow-md transition-all duration-300 w-full"
              >
                {/* Image Container */}
                <div className="relative aspect-[1.1] w-full overflow-hidden bg-white">
                  {subCol.image ? (
                    <Image
                      src={subCol.image}
                      alt={subCol.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 20vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-slate-300 font-medium text-xs bg-slate-50">
                      No Image
                    </div>
                  )}
                </div>

                {/* Text Content */}
                <div className="p-6 md:p-7 flex flex-col items-center justify-center flex-1 text-center">
                  <h3 className="font-sans text-[12px] font-extrabold uppercase tracking-widest text-[#1E2522] mb-2 leading-tight">
                    {subCol.name}
                  </h3>
                  {subCol.description && (
                    <p className="text-slate-500 text-[11px] font-medium leading-relaxed">
                      {subCol.description}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
