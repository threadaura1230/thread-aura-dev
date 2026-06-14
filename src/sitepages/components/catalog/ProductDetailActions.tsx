"use client";

import { useState, useEffect } from "react";
import { Heart, ThumbsUp } from "lucide-react";
import { useRouter } from "next/navigation";

interface ProductDetailActionsProps {
    productId: string;
}

export default function ProductDetailActions({ productId }: ProductDetailActionsProps) {
    const router = useRouter();
    const [inWishlist, setInWishlist] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);

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
                        setInWishlist(ids.includes(productId));
                    }
                    
                    // Check liked
                    const lRes = await fetch("/api/user/liked");
                    if (lRes.ok) {
                        const data = await lRes.json();
                        const ids = data.liked.map((p: any) => p.id);
                        setIsLiked(ids.includes(productId));
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
    }, [productId]);

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
                body: JSON.stringify({ productId }),
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
                body: JSON.stringify({ productId }),
            });
            if (!res.ok) {
                setIsLiked(previouslyLiked);
            }
        } catch {
            setIsLiked(previouslyLiked);
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex gap-4">
                <button className="flex-1 py-4 bg-[#073623] hover:bg-[#0c4a31] text-white text-[13px] font-bold tracking-widest uppercase rounded transition-colors shadow-sm active:scale-[0.99]">
                    Add to Bag
                </button>
                
                {/* Like Button */}
                <button 
                    onClick={handleLikeToggle}
                    disabled={loading}
                    className={`p-4 border border-slate-300 rounded hover:border-slate-800 transition-colors flex items-center justify-center ${
                        isLiked ? "bg-blue-50/50 border-blue-200" : ""
                    }`}
                    title={isLiked ? "Liked" : "Like product"}
                >
                    <ThumbsUp 
                        className={`w-5 h-5 transition-colors ${
                            isLiked ? "text-blue-600 fill-blue-500" : "text-slate-600 hover:text-blue-600"
                        }`} 
                    />
                </button>

                {/* Wishlist Button */}
                <button 
                    onClick={handleWishlistToggle}
                    disabled={loading}
                    className={`p-4 border border-slate-300 rounded hover:border-slate-800 transition-colors flex items-center justify-center ${
                        inWishlist ? "bg-red-50/50 border-red-200" : ""
                    }`}
                    title={inWishlist ? "In Wishlist" : "Add to Wishlist"}
                >
                    <Heart 
                        className={`w-5 h-5 transition-colors ${
                            inWishlist ? "text-red-500 fill-red-500" : "text-slate-600 hover:text-red-500"
                        }`} 
                    />
                </button>
            </div>
            
            {loading && (
                <p className="text-[11px] text-slate-400 italic text-center animate-pulse">
                    Checking save preferences...
                </p>
            )}
        </div>
    );
}
