"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProductCard from "@/sitepages/components/catalog/ProductCard";
import { Heart } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  material: string;
  tag?: string;
  bgColor: string;
  categorySlug: string;
}

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    async function loadWishlist() {
      try {
        const res = await fetch("/api/user/wishlist");
        if (res.status === 401) {
          setAuthenticated(false);
          setLoading(false);
          return;
        }
        if (res.ok) {
          const data = await res.json();
          setWishlist(data.wishlist || []);
          setAuthenticated(true);
        } else {
          setAuthenticated(false);
        }
      } catch (err) {
        console.error("Failed to load wishlist:", err);
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    }
    loadWishlist();
  }, []);

  if (loading) {
    return (
      <div className="bg-[#F1EFE7] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#0f3a2a] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-slate-500 font-medium tracking-wide">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  // Unauthenticated State
  if (authenticated === false) {
    return (
      <div className="bg-[#F1EFE7] min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-white/60 backdrop-blur-sm rounded-2xl border border-black/[0.04] p-10 text-center shadow-sm">
          <div className="w-16 h-16 bg-[#0f3a2a]/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-8 h-8 text-[#0f3a2a] stroke-[1.2]" />
          </div>
          <h1 className="text-2xl font-serif font-medium text-[#0f3a2a] mb-3">
            Your Wishlist
          </h1>
          <p className="text-slate-500 text-sm mb-8 leading-relaxed">
            Sign in to save your favorite handcrafted pieces and access your personal wishlist from any device.
          </p>
          <Link
            href="/login"
            className="block w-full py-3.5 bg-[#0f3a2a] hover:bg-[#134a31] text-white text-sm font-semibold tracking-wider uppercase rounded-xl transition-all shadow-sm hover:shadow-md"
          >
            Sign in to Thread-aura
          </Link>
        </div>
      </div>
    );
  }

  // Empty Wishlist State
  if (wishlist.length === 0) {
    return (
      <div className="bg-[#F1EFE7] min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 border border-black/[0.06] rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-6 h-6 text-slate-400 stroke-[1.2]" />
          </div>
          <h1 className="text-2xl font-serif font-medium text-[#0f3a2a] mb-3">
            Your Wishlist is Empty
          </h1>
          <p className="text-slate-500 text-sm mb-8 leading-relaxed">
            Explore our collections and tap the heart icon on any piece you love to save it here.
          </p>
          <Link
            href="/"
            className="inline-block px-8 py-3.5 border border-[#0f3a2a] text-[#0f3a2a] hover:bg-[#0f3a2a] hover:text-white text-xs font-semibold tracking-widest uppercase transition-all duration-200"
          >
            Discover Collections
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F1EFE7] min-h-screen py-28 px-6 md:px-8 lg:px-12">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="mb-12 border-b border-black/10 pb-6 text-center sm:text-left">
          <h1 className="font-serif text-[36px] md:text-[46px] text-[#0f3a2a] leading-none mb-4">
            My Wishlist
          </h1>
          <p className="text-slate-500 text-sm max-w-md">
            Your personal collection of saved pieces, handcrafted to order.
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
          {wishlist.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              categorySlug={product.categorySlug}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
