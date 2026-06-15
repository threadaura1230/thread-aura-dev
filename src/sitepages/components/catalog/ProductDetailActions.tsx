"use client";

import { useState, useEffect } from "react";
import { Heart, ThumbsUp, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

interface ProductDetailActionsProps {
    product: {
        id: string;
        name: string;
        price: number;
        material: string;
        bgColor: string;
        images: string[];
        sizes: string[];
        slug: string;
        categorySlug?: string;
        subCollectionSlug?: string;
    };
}

export default function ProductDetailActions({ product }: ProductDetailActionsProps) {
    const router = useRouter();
    const { addToCart } = useCart();
    const [selectedSize, setSelectedSize] = useState("");
    const [inWishlist, setInWishlist] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);

    // Initialize size once product sizes are available
    useEffect(() => {
        if (product.sizes && product.sizes.length > 0) {
            setSelectedSize(product.sizes[0]);
        } else {
            setSelectedSize("2.4");
        }
    }, [product.sizes]);

    useEffect(() => {
        async function checkStatus() {
            try {
                const verifyRes = await fetch("/api/auth/verify");
                if (verifyRes.ok) {
                    setAuthenticated(true);
                    
                    // Check wishlist
                    const wlRes = await fetch("/api/user/wishlist");
                    if (wlRes.ok) {
                        const data = await wlRes.json();
                        const ids = data.wishlist.map((p: any) => p.id);
                        setInWishlist(ids.includes(product.id));
                    }
                    
                    // Check liked
                    const lRes = await fetch("/api/user/liked");
                    if (lRes.ok) {
                        const data = await lRes.json();
                        const ids = data.liked.map((p: any) => p.id);
                        setIsLiked(ids.includes(product.id));
                    }
                } else {
                    setAuthenticated(false);
                }
            } catch (err) {
                console.error("Error checking user auth status:", err);
            } finally {
                setLoading(false);
            }
        }
        checkStatus();
    }, [product.id]);

    const handleWishlistToggle = async () => {
        if (!authenticated) {
            router.push(`/login?error=auth_required_wishlist`);
            return;
        }

        const previouslyInWishlist = inWishlist;
        setInWishlist(!previouslyInWishlist);

        try {
            const res = await fetch("/api/user/wishlist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId: product.id }),
            });
            if (!res.ok) {
                setInWishlist(previouslyInWishlist);
            }
        } catch {
            setInWishlist(previouslyInWishlist);
        }
    };

    const handleLikeToggle = async () => {
        if (!authenticated) {
            router.push(`/login?error=auth_required_liked`);
            return;
        }

        const previouslyLiked = isLiked;
        setIsLiked(!previouslyLiked);

        try {
            const res = await fetch("/api/user/liked", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId: product.id }),
            });
            if (!res.ok) {
                setIsLiked(previouslyLiked);
            }
        } catch {
            setIsLiked(previouslyLiked);
        }
    };

    const handleAddToCart = async () => {
        await addToCart(product, selectedSize, 1);
    };

    const handleBuyNow = async () => {
        await addToCart(product, selectedSize, 1);
        router.push("/checkout");
    };

    const sizesList = product.sizes && product.sizes.length > 0 ? product.sizes : ["2.4", "2.6", "2.8"];

    return (
        <div className="flex flex-col gap-6">
            {/* Size Selector */}
            <div>
                <div className="flex justify-between items-center mb-3">
                    <span className="text-[12px] text-slate-500 font-bold uppercase tracking-wider font-sans">
                        Select Size (Bangle Inner Diameter)
                    </span>
                    <button className="text-[11px] text-slate-900 underline underline-offset-4 hover:text-black font-sans">
                        Size Guide
                    </button>
                </div>
                <div className="flex gap-3">
                    {sizesList.map((size) => (
                        <button 
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`w-14 h-11 border rounded font-sans text-[13px] font-medium transition-colors flex items-center justify-center cursor-pointer ${
                                selectedSize === size 
                                    ? "border-[#073623] bg-[#073623] text-white font-bold" 
                                    : "border-slate-300 hover:border-[#073623] hover:text-[#073623] bg-white"
                            }`}
                        >
                            {size}
                        </button>
                    ))}
                </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-3">
                <div className="flex gap-4">
                    <button 
                        onClick={handleAddToCart}
                        className="flex-1 py-4 bg-transparent border-2 border-[#073623] text-[#073623] hover:bg-[#073623]/5 text-[13px] font-bold tracking-widest uppercase rounded transition-colors shadow-sm active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer font-sans"
                    >
                        <ShoppingBag className="w-4 h-4" />
                        Add to Bag
                    </button>

                    <button 
                        onClick={handleBuyNow}
                        className="flex-1 py-4 bg-[#073623] hover:bg-[#0c4a31] text-white text-[13px] font-bold tracking-widest uppercase rounded transition-colors shadow-sm active:scale-[0.99] cursor-pointer font-sans"
                    >
                        Buy Now
                    </button>
                </div>

                {/* Like and Wishlist row */}
                <div className="flex gap-4">
                    {/* Like Button */}
                    <button 
                        onClick={handleLikeToggle}
                        disabled={loading}
                        className={`flex-1 py-3 border border-slate-300 rounded hover:border-slate-800 transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                            isLiked ? "bg-blue-50/50 border-blue-200" : "bg-white"
                        }`}
                        title={isLiked ? "Liked" : "Like product"}
                    >
                        <ThumbsUp 
                            className={`w-4 h-4 transition-colors ${
                                isLiked ? "text-blue-600 fill-blue-500" : "text-slate-600"
                            }`} 
                        />
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 font-sans">
                            {isLiked ? "Liked" : "Like"}
                        </span>
                    </button>

                    {/* Wishlist Button */}
                    <button 
                        onClick={handleWishlistToggle}
                        disabled={loading}
                        className={`flex-1 py-3 border border-slate-300 rounded hover:border-slate-800 transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                            inWishlist ? "bg-red-50/50 border-red-200" : "bg-white"
                        }`}
                        title={inWishlist ? "In Wishlist" : "Add to Wishlist"}
                    >
                        <Heart 
                            className={`w-4 h-4 transition-colors ${
                                inWishlist ? "text-red-500 fill-red-500" : "text-slate-600"
                            }`} 
                        />
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 font-sans">
                            {inWishlist ? "Wishlisted" : "Wishlist"}
                        </span>
                    </button>
                </div>
            </div>
            
            {loading && (
                <p className="text-[11px] text-slate-400 italic text-center animate-pulse">
                    Checking save preferences...
                </p>
            )}
        </div>
    );
}
