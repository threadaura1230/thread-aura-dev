"use client";

import { useState, useEffect } from "react";
import { Heart, ThumbsUp } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ProductCardProps {
    product: {
        id: string;
        name: string;
        price: number;
        material: string;
        tag?: string;
        bgColor: string;
        images?: string[];
    };
    categorySlug: string;
}

// Simple global cache to avoid n+1 API fetches for grids
let wishlistCache: string[] | null = null;
let likedCache: string[] | null = null;
let isAuthenticated: boolean | null = null;
let isFetching = false;
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
        listeners.delete(listener);
    };
}

function notify() {
    listeners.forEach((l) => l());
}

async function fetchUserData() {
    if (isFetching) return;
    if (wishlistCache !== null && likedCache !== null && isAuthenticated !== null) return;
    isFetching = true;
    try {
        const verifyRes = await fetch("/api/auth/verify");
        if (verifyRes.ok) {
            isAuthenticated = true;
            
            // Fetch wishlist
            const wlRes = await fetch("/api/user/wishlist");
            if (wlRes.ok) {
                const data = await wlRes.json();
                wishlistCache = data.wishlist.map((p: any) => p.id);
            }
            
            // Fetch liked
            const lRes = await fetch("/api/user/liked");
            if (lRes.ok) {
                const data = await lRes.json();
                likedCache = data.liked.map((p: any) => p.id);
            }
        } else {
            isAuthenticated = false;
            wishlistCache = [];
            likedCache = [];
        }
    } catch (err) {
        console.error("Error fetching user data in ProductCard:", err);
    } finally {
        isFetching = false;
        notify();
    }
}

export default function ProductCard({ product, categorySlug }: ProductCardProps) {
    const router = useRouter();
    const [inWishlist, setInWishlist] = useState(false);
    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        const updateState = () => {
            setInWishlist(wishlistCache?.includes(product.id) || false);
            setIsLiked(likedCache?.includes(product.id) || false);
        };

        const unsubscribe = subscribe(updateState);
        updateState();

        if (wishlistCache === null) {
            fetchUserData();
        }

        return unsubscribe;
    }, [product.id]);

    const handleWishlistToggle = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (isAuthenticated === false) {
            router.push(`/login?error=auth_required_wishlist`);
            return;
        }

        // Optimistic UI update
        const previouslyInWishlist = inWishlist;
        setInWishlist(!previouslyInWishlist);
        if (wishlistCache) {
            if (previouslyInWishlist) {
                wishlistCache = wishlistCache.filter((id) => id !== product.id);
            } else {
                wishlistCache.push(product.id);
            }
            notify();
        }

        try {
            const res = await fetch("/api/user/wishlist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId: product.id }),
            });
            if (!res.ok) {
                // Revert on error
                setInWishlist(previouslyInWishlist);
                if (wishlistCache) {
                    if (previouslyInWishlist) {
                        wishlistCache.push(product.id);
                    } else {
                        wishlistCache = wishlistCache.filter((id) => id !== product.id);
                    }
                    notify();
                }
            }
        } catch {
            setInWishlist(previouslyInWishlist);
        }
    };

    const handleLikeToggle = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (isAuthenticated === false) {
            router.push(`/login?error=auth_required_liked`);
            return;
        }

        // Optimistic UI update
        const previouslyLiked = isLiked;
        setIsLiked(!previouslyLiked);
        if (likedCache) {
            if (previouslyLiked) {
                likedCache = likedCache.filter((id) => id !== product.id);
            } else {
                likedCache.push(product.id);
            }
            notify();
        }

        try {
            const res = await fetch("/api/user/liked", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId: product.id }),
            });
            if (!res.ok) {
                // Revert on error
                setIsLiked(previouslyLiked);
                if (likedCache) {
                    if (previouslyLiked) {
                        likedCache.push(product.id);
                    } else {
                        likedCache = likedCache.filter((id) => id !== product.id);
                    }
                    notify();
                }
            }
        } catch {
            setIsLiked(previouslyLiked);
        }
    };

    return (
        <div className="group relative flex flex-col w-full">
            {/* Image Container */}
            <Link href={`/${categorySlug}/${product.id}`} className="block relative aspect-[4/5] overflow-hidden rounded-md bg-[#e3ded9] mb-4">
                <div 
                    className="absolute inset-0 w-full h-full transition-transform duration-700 ease-out group-hover:scale-105"
                    style={{ backgroundColor: product.bgColor }}
                >
                    {product.images && product.images.length > 0 ? (
                        <img 
                            src={product.images[0]} 
                            alt={product.name}
                            className="w-full h-full object-cover animate-fade-in"
                        />
                    ) : (
                        /* Placeholder Text for Image */
                        <div className="absolute inset-0 flex items-center justify-center text-white/40 font-medium text-sm tracking-widest uppercase">
                            Product Image
                        </div>
                    )}
                </div>
                
                {/* Optional Tag */}
                {product.tag && (
                    <div className="absolute top-3 left-3 bg-white text-slate-900 text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-[2px] z-10">
                        {product.tag}
                    </div>
                )}

                {/* Quick Add Button (appears on hover) */}
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out z-10">
                    <button className="w-full bg-white/90 backdrop-blur-sm text-slate-900 text-[12px] font-semibold tracking-wider uppercase py-3 hover:bg-white transition-colors shadow-lg">
                        Add to Bag
                    </button>
                </div>
            </Link>

            {/* Product Info */}
            <div className="flex justify-between items-start gap-4">
                <div>
                    <h3 className="text-[14px] font-medium text-slate-900 mb-1 leading-tight">
                        <Link href={`/${categorySlug}/${product.id}`} className="hover:underline underline-offset-4">
                            {product.name}
                        </Link>
                    </h3>
                    <p className="text-[12px] text-slate-500 mb-2">{product.material}</p>
                    <p className="text-[13px] font-semibold text-slate-900">${product.price.toFixed(2)}</p>
                </div>
                
                {/* Wishlist & Like Icons */}
                <div className="flex items-center gap-3 pt-0.5">
                    {/* Like Button */}
                    <button 
                        onClick={handleLikeToggle}
                        className={`transition-colors duration-200 ${
                            isLiked 
                                ? "text-blue-600 hover:text-blue-700" 
                                : "text-slate-400 hover:text-blue-500"
                        }`}
                        title={isLiked ? "Unlike product" : "Like product"}
                    >
                        <ThumbsUp className={`w-[16px] h-[16px] stroke-[1.5] ${isLiked ? "fill-blue-50" : ""}`} />
                    </button>

                    {/* Wishlist Button */}
                    <button 
                        onClick={handleWishlistToggle}
                        className={`transition-colors duration-200 ${
                            inWishlist 
                                ? "text-red-500 hover:text-red-600" 
                                : "text-slate-400 hover:text-red-500"
                        }`}
                        title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
                    >
                        <Heart 
                            className={`w-[17px] h-[17px] stroke-[1.5] ${
                                inWishlist ? "fill-red-500 text-red-500" : ""
                            }`} 
                        />
                    </button>
                </div>
            </div>
        </div>
    );
}
