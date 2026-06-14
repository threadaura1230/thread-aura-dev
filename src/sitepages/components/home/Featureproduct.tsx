"use client";

import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function FeatureProduct() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/manage-products/products?limit=8");
        const data = await res.json();
        if (data.success) {
          // Filter active ones
          const active = data.products.filter((p: any) => p.isActive);
          setProducts(active);
        }
      } catch (err) {
        console.error("Error fetching featured products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300; // Approximate width of one card + gap
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };

  if (loading) {
    return (
      <section id="shop-all" className="py-16 px-6 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 animate-pulse">
          <div>
            <div className="h-3 w-16 bg-slate-200 mb-2 rounded"></div>
            <div className="h-7 w-48 bg-slate-200 rounded"></div>
          </div>
        </div>
        <div className="flex gap-5 overflow-x-auto pb-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex-none w-[260px] md:w-[270px] bg-slate-200 rounded aspect-[3/4] animate-pulse"></div>
          ))}
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section id="shop-all" className="py-16 px-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
        <div className="text-center md:text-left">
          <p className="text-[10px] font-bold tracking-[0.2em] text-[#b13d33] mb-2 uppercase">
            Shop
          </p>
          <h2 className="font-serif text-[28px] md:text-[34px] text-slate-900 leading-none">
            Featured Products
          </h2>
        </div>
        
        {/* Carousel Controls */}
        <div className="hidden md:flex space-x-3 mt-6 md:mt-0">
          <button 
            onClick={() => scroll("left")} 
            className="w-10 h-10 flex items-center justify-center border border-slate-300 rounded-full hover:bg-slate-100 hover:border-slate-400 transition-colors cursor-pointer"
            aria-label="Scroll Left"
          >
            <ChevronLeft className="w-5 h-5 text-slate-700" />
          </button>
          <button 
            onClick={() => scroll("right")} 
            className="w-10 h-10 flex items-center justify-center border border-slate-300 rounded-full hover:bg-slate-100 hover:border-slate-400 transition-colors cursor-pointer"
            aria-label="Scroll Right"
          >
            <ChevronRight className="w-5 h-5 text-slate-700" />
          </button>
        </div>
      </div>

      {/* Carousel Container */}
      <div 
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] w-full"
      >
        {products.map((product) => {
          const detailHref = `/collections/${product.collection?.slug || "collections"}/${product.subCollection?.slug || "general"}/${product.slug}`;
          return (
            <div 
              key={product._id} 
              onClick={() => router.push(detailHref)}
              className="snap-start flex-none w-[260px] md:w-[270px] bg-[#0A1310] flex flex-col overflow-hidden border border-[#162721] group/card cursor-pointer"
            >
              {/* Image Container */}
              <div className="relative aspect-[3/4] w-full bg-white overflow-hidden">
                {product.images && product.images.length > 0 ? (
                  <img 
                    src={product.images[0]} 
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-slate-300 font-medium text-sm">
                    Image Placeholder
                  </div>
                )}

                {/* Quick View Bar (Animated overlay) */}
                <div className="absolute bottom-0 left-0 w-full bg-[#364B44]/90 backdrop-blur-sm text-white text-[12px] font-light text-center py-2.5 transition-all duration-300 translate-y-full opacity-0 group-hover/card:translate-y-0 group-hover/card:opacity-100 hover:!bg-[#4a635b]">
                  View Details
                </div>
              </div>

              {/* Content Details */}
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="text-white text-[14px] font-sans font-light tracking-wide mb-1 line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-[#A4B5AE] text-[13px] font-light mb-5">
                  ₹{product.price.toFixed(2)}
                </p>

                {/* Add to Cart Button */}
                <button className="mt-auto w-full py-2.5 bg-[#FFFBE4] text-[#0A1310] text-[13px] font-medium hover:bg-[#f2ead3] transition-colors cursor-pointer">
                  View Details
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

