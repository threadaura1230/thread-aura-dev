"use client";

import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

export default function FeatureProduct() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { addToCart } = useCart();
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

  const handleAddToCart = async (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    e.stopPropagation();
    const cartProduct = {
      id: product._id,
      name: product.name,
      price: product.price,
      bgColor: product.bgColor || "#F1EFE7",
      images: product.images,
      sizes: product.sizes,
      slug: product.slug,
      subCollectionSlug: product.subCollection?.slug || "general",
      categorySlug: product.collection?.slug || "collections",
    };
    const defaultSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : "2.4";
    await addToCart(cartProduct, defaultSize, 1);
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
    <section id="shop-all" className="py-16 px-6 max-w-7xl mx-auto relative">
      <div className="flex items-end justify-between mb-10">
        <div className="text-left">
          <p className="text-[10px] font-bold tracking-[0.2em] text-[#b13d33] mb-2 uppercase">
            Shop
          </p>
          <h2 className="font-serif text-[28px] md:text-[34px] text-slate-900 leading-none">
            Featured Products
          </h2>
        </div>
        {/* Carousel Controls in Header to prevent overlapping */}
        <div className="flex gap-2.5">
          <button 
            onClick={() => scroll("left")} 
            className="w-9 h-9 flex items-center justify-center bg-white border border-slate-200 rounded-full shadow-sm hover:bg-slate-50 transition-all cursor-pointer"
            aria-label="Scroll Left"
          >
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </button>
          <button 
            onClick={() => scroll("right")} 
            className="w-9 h-9 flex items-center justify-center bg-white border border-slate-200 rounded-full shadow-sm hover:bg-slate-50 transition-all cursor-pointer"
            aria-label="Scroll Right"
          >
            <ChevronRight className="w-5 h-5 text-slate-600" />
          </button>
        </div>
      </div>

      {/* Outer wrapper */}
      <div className="relative group/carousel">
        
        {/* Carousel Container */}
        <div 
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] w-full"
        >
          {products.map((product) => {
            const detailHref = `/collections/${product.collection?.slug || "collections"}/${product.subCollection?.slug || "general"}/${product.slug}`;
            return (
              <div 
                key={product._id} 
                onClick={() => router.push(detailHref)}
                className="snap-start flex-none w-[240px] md:w-[260px] bg-white rounded-lg border border-slate-100 p-4 flex flex-col overflow-hidden group/card cursor-pointer shadow-sm hover:shadow-md transition-all duration-300"
              >
                {/* Image Container with full cover image */}
                <div className="relative aspect-square w-full bg-slate-50 overflow-hidden rounded-lg flex items-center justify-center">
                  {product.images && product.images.length > 0 ? (
                    <img 
                      src={product.images[0]} 
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-slate-300 font-medium text-sm">
                      No Image
                    </div>
                  )}
                </div>

                {/* Content Details */}
                <div className="pt-4 flex-1 flex flex-col items-start text-left">
                  <h3 className="text-slate-800 text-[14px] font-sans font-medium tracking-wide mb-1 line-clamp-1 w-full">
                    {product.name}
                  </h3>
                  <p className="text-slate-700 text-[14px] font-sans font-semibold mb-3">
                    ₹{product.price}
                  </p>

                  {/* Add to Cart Button */}
                  <button 
                    onClick={(e) => handleAddToCart(e, product)}
                    className="mt-auto px-5 py-2 bg-[#824B2C] hover:bg-[#6e3e23] text-white text-[12px] font-semibold rounded-full flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    Add
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

