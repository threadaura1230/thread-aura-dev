"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Heart, ShoppingBag, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

interface ProductDetailActionsProps {
    product: {
        id: string;
        name: string;
        price: number;
        material: string;
        bgColor: string;
        color?: string | string[];
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
    const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
    const [selectedSize, setSelectedSize] = useState("");
    const [inWishlist, setInWishlist] = useState(false);
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Lock background scroll when drawer is open
    useEffect(() => {
        if (!isSizeGuideOpen) return;

        const body = document.body;
        const html = document.documentElement;

        const previousBodyOverflow = body.style.overflow;
        const previousHtmlOverflow = html.style.overflow;

        body.style.overflow = "hidden";
        html.style.overflow = "hidden";

        return () => {
            body.style.overflow = previousBodyOverflow;
            html.style.overflow = previousHtmlOverflow;
        };
    }, [isSizeGuideOpen]);

    // Initialize size once product sizes are available
    useEffect(() => {
        if (product.sizes && product.sizes.length > 0) {
            setSelectedSize(product.sizes[0]);
        } else {
            setSelectedSize("2.0");
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



    const handleAddToCart = async () => {
        await addToCart(product, selectedSize, 1);
    };

    const handleBuyNow = async () => {
        await addToCart(product, selectedSize, 1);
        router.push("/checkout");
    };

    const sizesList = product.sizes && product.sizes.length > 0 ? product.sizes : ["2.0", "2.2", "2.4", "2.6", "2.8", "2.10", "2.12"];

    return (
        <div className="flex flex-col gap-6">
            {/* Color Swatch Display */}
            {product.color && (
                <div className="flex items-center gap-2">
                    <span className="text-[12px] text-slate-500 font-bold uppercase tracking-wider font-sans">
                        Bangle Colors:
                    </span>
                    <div className="flex gap-1.5">
                        {(Array.isArray(product.color) ? product.color : [product.color]).filter(Boolean).map((clr) => (
                            <div 
                                key={clr}
                                className="w-5 h-5 rounded-full border border-black/10 shadow-sm"
                                style={{ backgroundColor: clr }}
                                title={clr}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Size Selector */}
            <div>
                <div className="flex justify-between items-center mb-3">
                    <span className="text-[12px] text-slate-500 font-bold uppercase tracking-wider font-sans">
                        Select Size (Bangle Inner Diameter)
                    </span>
                    <button
                        onClick={() => setIsSizeGuideOpen(true)}
                        className="text-[11px] text-slate-900 underline underline-offset-4 hover:text-black font-sans cursor-pointer"
                    >
                        Size Guide
                    </button>
                </div>
                <div className="flex gap-3">
                    {sizesList.map((size) => (
                        <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`w-14 h-11 border rounded font-sans text-[13px] font-medium transition-colors flex items-center justify-center cursor-pointer ${selectedSize === size
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
                    {/* Wishlist Button */}
                    <button
                        onClick={handleWishlistToggle}
                        disabled={loading}
                        className={`flex-1 py-3 border border-slate-300 rounded hover:border-slate-800 transition-colors flex items-center justify-center gap-2 cursor-pointer ${inWishlist ? "bg-red-50/50 border-red-200" : "bg-white"
                            }`}
                        title={inWishlist ? "In Wishlist" : "Add to Wishlist"}
                    >
                        <Heart
                            className={`w-4 h-4 transition-colors ${inWishlist ? "text-red-500 fill-red-500" : "text-slate-600"
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

            {/* Size Guide Drawer (Side Context) - Rendered via Portal to avoid stacking context scroll issues */}
            {isSizeGuideOpen && mounted && createPortal(
                <div data-lenis-prevent className="fixed inset-0 z-50 overflow-hidden">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ease-in-out cursor-pointer"
                        onClick={() => setIsSizeGuideOpen(false)}
                    />

                    {/* Panel Wrapper */}
                    <div className="absolute inset-y-0 right-0 max-w-full flex pl-6 h-full z-50">
                        <div className="w-screen max-w-[350px] bg-[#FDFBF7] shadow-xl flex flex-col h-screen max-h-screen border-l border-black/5 animate-in slide-in-from-right duration-300">

                            {/* Drawer Header */}
                            <div className="px-5 py-5 border-b border-black/10 flex items-center justify-between bg-[#F1EFE7]">
                                <h2 className="text-[16px] font-serif font-semibold text-[#073623]">Bangle Size Guide</h2>
                                <button
                                    onClick={() => setIsSizeGuideOpen(false)}
                                    className="text-slate-500 hover:text-black transition-colors p-1 rounded-full hover:bg-black/5 cursor-pointer"
                                    aria-label="Close size guide"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Drawer Scrollable Content */}
                            <div data-lenis-prevent className="flex-1 min-h-0 overflow-y-auto overscroll-contain py-5 px-5 space-y-5">
                                {/* Note Section */}
                                <div className="p-3 bg-[#FAF8F2] border-l-4 border-[#073623] rounded-r-md text-[12px] text-slate-700 space-y-2 leading-relaxed shadow-sm">
                                    <h4 className="font-sans font-extrabold uppercase tracking-wider text-[#073623] text-[10px]">
                                        Note:
                                    </h4>
                                    <ol className="list-decimal pl-4 space-y-1.5">
                                        <li>
                                            All clients are requested to cross-verify their bangle sizes in cms before placing their order by measuring a bangle that fits you perfectly.
                                        </li>
                                        <li>
                                            Bangle sizes will differ from brand to brand, so this step is mandatory to avoid confusion.
                                        </li>
                                    </ol>
                                </div>

                                {/* Instructions Section */}
                                <div className="space-y-2 text-[12px] text-slate-700 leading-relaxed">
                                    <h4 className="font-serif font-bold text-[14px] text-[#073623]">
                                        Instructions:
                                    </h4>
                                    <ol className="list-decimal pl-4 space-y-1.5">
                                        <li>Take a bangle that fits perfectly. Check if it fits both hands.</li>
                                        <li>Draw a circle of the bangle&apos;s inner diameter on paper.</li>
                                        <li>Measure the inner diameter with a scale/ruler and verify with the size chart below.</li>
                                    </ol>
                                </div>

                                {/* SVG Diagram */}
                                <div className="flex flex-col items-center justify-center py-3 bg-white rounded-lg border border-black/5 shadow-sm">
                                    <svg viewBox="0 0 200 200" className="w-32 h-32">
                                        {/* Outer circle representing bangle */}
                                        <circle cx="100" cy="100" r="80" stroke="#073623" strokeWidth="8" fill="none" />
                                        <circle cx="100" cy="100" r="76" stroke="#fff" strokeWidth="1" fill="none" opacity="0.3" />

                                        {/* Dimension Line */}
                                        <line x1="26" y1="100" x2="174" y2="100" stroke="#b13d33" strokeWidth="2" strokeDasharray="3 3" />

                                        {/* Left Arrow Head */}
                                        <polygon points="26,100 34,96 34,104" fill="#b13d33" />

                                        {/* Right Arrow Head */}
                                        <polygon points="174,100 166,96 166,104" fill="#b13d33" />

                                        {/* Text Labels */}
                                        <text x="100" y="88" textAnchor="middle" fill="#073623" fontSize="9" fontWeight="bold" letterSpacing="0.05em">INNER DIAMETER</text>
                                        <text x="100" y="116" textAnchor="middle" fill="#b13d33" fontSize="13" fontWeight="bold">X</text>
                                    </svg>
                                    <span className="text-[10px] text-slate-500 mt-1 font-medium tracking-wide">Inner Diameter (X)</span>
                                </div>

                                {/* Size Chart Table */}
                                <div className="overflow-hidden border border-black/10 rounded-lg shadow-sm bg-white">
                                    <table className="w-full text-center border-collapse text-[12px]">
                                        <thead>
                                            <tr className="bg-[#073623] text-white font-sans font-bold text-[10px] uppercase tracking-wider">
                                                <th className="py-2 px-3 border-r border-white/10">Size in Inches</th>
                                                <th className="py-2 px-3">Size in Cms</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-black/5 text-slate-800 font-medium">
                                            <tr className="hover:bg-slate-50 transition-colors">
                                                <td className="py-1.5 border-r border-black/5">2.0</td>
                                                <td className="py-1.5">5</td>
                                            </tr>
                                            <tr className="bg-slate-50/50 hover:bg-slate-50 transition-colors">
                                                <td className="py-1.5 border-r border-black/5">2.2</td>
                                                <td className="py-1.5">5.4</td>
                                            </tr>
                                            <tr className="hover:bg-slate-50 transition-colors">
                                                <td className="py-1.5 border-r border-black/5">2.4</td>
                                                <td className="py-1.5">5.8</td>
                                            </tr>
                                            <tr className="bg-slate-50/50 hover:bg-slate-50 transition-colors">
                                                <td className="py-1.5 border-r border-black/5">2.6</td>
                                                <td className="py-1.5">6</td>
                                            </tr>
                                            <tr className="hover:bg-slate-50 transition-colors">
                                                <td className="py-1.5 border-r border-black/5">2.8</td>
                                                <td className="py-1.5">6.3</td>
                                            </tr>
                                            <tr className="bg-slate-50/50 hover:bg-slate-50 transition-colors">
                                                <td className="py-1.5 border-r border-black/5">2.10</td>
                                                <td className="py-1.5">6.5</td>
                                            </tr>
                                            <tr className="hover:bg-slate-50 transition-colors">
                                                <td className="py-1.5 border-r border-black/5">2.12</td>
                                                <td className="py-1.5">7</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                , document.body)}
        </div>
    );
}