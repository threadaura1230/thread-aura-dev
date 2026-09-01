"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowRight, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function NewArrivals() {
  const router = useRouter();
  const { addToCart } = useCart();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        // Fetch top 5 products (sorted by createdAt: -1 in the API)
        const res = await fetch("/api/manage-products/products?limit=5");
        const data = await res.json();
        if (data.success) {
          // Filter active ones
          const active = data.products.filter((p: any) => p.isActive);
          setProducts(active);
        }
      } catch (err) {
        console.error("Error fetching new arrivals:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNewArrivals();
  }, []);

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
    const defaultSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : "2.0";
    await addToCart(cartProduct, defaultSize, 1);
  };

  if (loading) {
    return (
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col mb-10 animate-pulse">
          <div className="h-3 w-16 bg-slate-200 mb-2 rounded"></div>
          <div className="h-7 w-48 bg-slate-200 rounded"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[600px] animate-pulse">
          <div className="bg-slate-200 rounded-2xl h-full"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 h-full">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-slate-200 rounded-2xl h-full"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Hide the section if we don't have products
  if (products.length === 0) {
    return null;
  }

  const firstProduct = products[0];
  const firstProductHref = `/collections/${firstProduct.collection?.slug || "collections"}/${firstProduct.subCollection?.slug || "general"}/${firstProduct.slug}`;

  // Get remaining products up to 4
  const gridProducts = products.slice(1, 5);

  return (
    <section className="py-16 px-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col items-center text-center md:items-start md:text-left mb-12">
        <p className="text-[10px] font-bold tracking-[0.2em] text-[#b13d33] mb-2 uppercase">
          Newly Added
        </p>
        <h2 className="font-serif text-[28px] md:text-[34px] text-slate-900 leading-none">
          Fresh Arrivals
        </h2>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        
        {/* Left Column: Big Feature Card */}
        <div 
          onClick={() => router.push(firstProductHref)}
          className="relative group rounded-lg overflow-hidden cursor-pointer shadow-sm border border-slate-100 min-h-[600px] aspect-[4/5] lg:aspect-auto flex flex-col justify-end transition-all duration-500 hover:shadow-lg"
        >
          {/* Background Image */}
          <div className="absolute inset-0 w-full h-full bg-[#F1EFE7]">
            {firstProduct.images && firstProduct.images.length > 0 ? (
              <Image 
                src={firstProduct.images[0]} 
                alt={firstProduct.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                priority
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-slate-400 font-medium">
                No Image Available
              </div>
            )}
            {/* Dark/Warm Elegant Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity duration-500 group-hover:opacity-90" />
          </div>

          {/* Overlay Content */}
          <div className="relative z-10 p-8 md:p-12 text-white flex flex-col items-start">
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#fca5a5] mb-2 uppercase">
              Featured New Product
            </span>
            <h3 className="font-serif text-[24px] md:text-[32px] font-normal leading-tight mb-3 max-w-sm drop-shadow-sm">
              {firstProduct.name}
            </h3>
            <p className="text-[16px] text-slate-200 font-semibold mb-6">
              ₹{firstProduct.price}
            </p>
            <div className="inline-flex items-center gap-2 text-[12px] font-bold tracking-wider uppercase border-b border-white/60 pb-1 group-hover:border-white transition-colors">
              Explore Now
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </div>
        </div>

        {/* Right Column: 2x2 Grid of remaining 4 items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {gridProducts.map((product) => {
            const detailHref = `/collections/${product.collection?.slug || "collections"}/${product.subCollection?.slug || "general"}/${product.slug}`;
            return (
              <div 
                key={product._id}
                onClick={() => router.push(detailHref)}
                className="group relative bg-[#F8F9FC] rounded-lg border border-slate-100/80 p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-md cursor-pointer"
              >
                {/* Image Area */}
                <div className="relative w-full aspect-[4/3] flex items-center justify-center overflow-hidden mb-4 rounded-md bg-white/40">
                  {product.images && product.images.length > 0 ? (
                    <Image
                      src={product.images[0]} 
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-contain transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="text-slate-300 text-xs">No Image</div>
                  )}
                </div>

                {/* Details Footer */}
                <div className="flex items-end justify-between gap-4">
                  <div className="text-left">
                    <h4 className="text-slate-800 text-[14px] font-medium tracking-wide mb-0.5 line-clamp-1 group-hover:text-slate-900 transition-colors">
                      {product.name}
                    </h4>
                    <p className="text-slate-500 text-[12px] font-semibold mb-2">
                      ₹{product.price}
                    </p>
                    <span className="text-[11px] text-[#824B2C] font-semibold underline underline-offset-4 group-hover:text-[#6e3e23] transition-colors">
                      Explore Now
                    </span>
                  </div>

                  {/* Circular Chevron Arrow Button */}
                  <div className="flex-shrink-0 w-8 h-8 rounded-full border border-slate-300 flex items-center justify-center text-slate-600 transition-all duration-300 group-hover:bg-[#824B2C] group-hover:border-[#824B2C] group-hover:text-white">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
