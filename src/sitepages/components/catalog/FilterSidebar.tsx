"use client";

import { ChevronDown, Check, X } from "lucide-react";
import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

interface FilterSidebarProps {
    materials?: string[];
    colors?: string[];
    subCollections?: { _id: string; name: string; slug: string }[];
    maxPrice?: number;
}

/**
 * Maps common color names to display-friendly hex codes.
 * Falls back to a neutral swatch if the color isn't recognised.
 */
const COLOR_SWATCHES: Record<string, string> = {
    red: "#c0392b",
    maroon: "#6b1f2a",
    pink: "#e91e90",
    rose: "#e8a0bf",
    orange: "#e67e22",
    yellow: "#f1c40f",
    gold: "#d4af37",
    green: "#27ae60",
    teal: "#0e6655",
    blue: "#2980b9",
    navy: "#1a3054",
    purple: "#8e44ad",
    violet: "#7c3aed",
    brown: "#6d4c41",
    beige: "#d4c5a9",
    cream: "#faf3e0",
    white: "#ffffff",
    silver: "#bdc3c7",
    grey: "#7f8c8d",
    gray: "#7f8c8d",
    black: "#1a1a1a",
    multicolor: "conic-gradient(red, yellow, green, blue, purple, red)",
    multi: "conic-gradient(red, yellow, green, blue, purple, red)",
};

function getSwatchStyle(color: string): React.CSSProperties {
    const key = color.toLowerCase().trim();
    if (key.startsWith("#")) {
        return { backgroundColor: key };
    }
    const val = COLOR_SWATCHES[key];
    if (val?.startsWith("conic")) {
        return { background: val };
    }
    return { backgroundColor: val || "#a0a0a0" };
}

function getColorName(color: string): string {
    const key = color.toLowerCase().trim();
    const entry = Object.entries(COLOR_SWATCHES).find(([_, hex]) => hex.toLowerCase() === key);
    if (entry) {
        return entry[0];
    }
    return color;
}

export default function FilterSidebar({
    materials = [],
    colors = [],
    subCollections = [],
    maxPrice = 5000,
}: FilterSidebarProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [openSections, setOpenSections] = useState({
        subCollection: true,
        material: true,
        color: true,
        price: true,
    });

    const toggleSection = (section: keyof typeof openSections) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    // ── Price slider state ──
    const currentPriceMin = Number(searchParams.get("priceMin") || 0);
    const currentPriceMax = Number(searchParams.get("priceMax") || maxPrice);
    const [priceRange, setPriceRange] = useState<[number, number]>([currentPriceMin, currentPriceMax]);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Sync if URL changes externally
    useEffect(() => {
        const min = Number(searchParams.get("priceMin") || 0);
        const max = Number(searchParams.get("priceMax") || maxPrice);
        setPriceRange([min, max]);
    }, [searchParams, maxPrice]);

    // ── Query helpers ──
    const handleToggleList = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        const currentVal = params.get(key);
        let items = currentVal ? currentVal.split(",") : [];

        if (items.includes(value)) {
            items = items.filter(i => i !== value);
        } else {
            items.push(value);
        }

        if (items.length > 0) {
            params.set(key, items.join(","));
        } else {
            params.delete(key);
        }
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const handlePriceChange = useCallback(
        (min: number, max: number) => {
            setPriceRange([min, max]);
            // Debounce URL update so the slider is smooth
            if (debounceRef.current) clearTimeout(debounceRef.current);
            debounceRef.current = setTimeout(() => {
                const params = new URLSearchParams(searchParams.toString());
                // Remove legacy price param
                params.delete("price");

                if (min > 0) {
                    params.set("priceMin", String(min));
                } else {
                    params.delete("priceMin");
                }
                if (max < maxPrice) {
                    params.set("priceMax", String(max));
                } else {
                    params.delete("priceMax");
                }
                router.replace(`${pathname}?${params.toString()}`, { scroll: false });
            }, 350);
        },
        [searchParams, pathname, router, maxPrice],
    );

    const resetPrice = () => {
        setPriceRange([0, maxPrice]);
        const params = new URLSearchParams(searchParams.toString());
        params.delete("priceMin");
        params.delete("priceMax");
        params.delete("price");
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const activeMaterials = searchParams.get("material")?.split(",") || [];
    const activeColors = searchParams.get("color")?.split(",") || [];
    const activeSubCols = searchParams.get("subCollection")?.split(",") || [];
    const isPriceFiltered = priceRange[0] > 0 || priceRange[1] < maxPrice;

    // Round max price to nearest nice step
    const step = maxPrice <= 1000 ? 50 : maxPrice <= 5000 ? 100 : 500;
    const ceilMax = Math.ceil(maxPrice / step) * step;

    return (
        <aside className="hidden md:block w-64 flex-shrink-0 pr-8">
            <div className="sticky top-32">
                <h3 className="text-[14px] font-bold tracking-widest uppercase text-slate-900 mb-6 pb-4 border-b border-black/10">
                    Filter By
                </h3>

                {/* ── Sub-Collection Filter ── */}
                {subCollections.length > 0 && (
                    <div className="mb-6 pb-6 border-b border-black/5">
                        <button
                            onClick={() => toggleSection("subCollection")}
                            className="flex items-center justify-between w-full text-left"
                        >
                            <span className="text-[13px] font-semibold text-slate-800">Subcategory</span>
                            <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${openSections.subCollection ? "rotate-180" : ""}`} />
                        </button>

                        {openSections.subCollection && (
                            <div className="mt-4 space-y-3">
                                {subCollections.map((subCol) => {
                                    const isChecked = activeSubCols.includes(subCol.slug);
                                    return (
                                        <label key={subCol._id} className="flex items-center gap-3 cursor-pointer group">
                                            <div className="relative w-4 h-4 border border-slate-300 rounded-[2px] group-hover:border-[#134A31] transition-colors">
                                                <input
                                                    type="checkbox"
                                                    checked={isChecked}
                                                    onChange={() => handleToggleList("subCollection", subCol.slug)}
                                                    className="peer absolute opacity-0 w-full h-full cursor-pointer"
                                                />
                                                <div className="absolute inset-0 bg-[#134A31] rounded-[2px] opacity-0 peer-checked:opacity-100 flex items-center justify-center transition-opacity">
                                                    <Check className="w-3 h-3 text-white" />
                                                </div>
                                            </div>
                                            <span className="text-[13px] text-slate-600 group-hover:text-slate-900 transition-colors capitalize">{subCol.name}</span>
                                        </label>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* ── Material Filter ── */}
                {materials.length > 0 && (
                    <div className="mb-6 pb-6 border-b border-black/5">
                        <button
                            onClick={() => toggleSection("material")}
                            className="flex items-center justify-between w-full text-left"
                        >
                            <span className="text-[13px] font-semibold text-slate-800">Material</span>
                            <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${openSections.material ? "rotate-180" : ""}`} />
                        </button>

                        {openSections.material && (
                            <div className="mt-4 space-y-3">
                                {materials.map((item, idx) => {
                                    const isChecked = activeMaterials.includes(item);
                                    return (
                                        <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                                            <div className="relative w-4 h-4 border border-slate-300 rounded-[2px] group-hover:border-[#134A31] transition-colors">
                                                <input
                                                    type="checkbox"
                                                    checked={isChecked}
                                                    onChange={() => handleToggleList("material", item)}
                                                    className="peer absolute opacity-0 w-full h-full cursor-pointer"
                                                />
                                                <div className="absolute inset-0 bg-[#134A31] rounded-[2px] opacity-0 peer-checked:opacity-100 flex items-center justify-center transition-opacity">
                                                    <Check className="w-3 h-3 text-white" />
                                                </div>
                                            </div>
                                            <span className="text-[13px] text-slate-600 group-hover:text-slate-900 transition-colors">{item}</span>
                                        </label>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* ── Color Filter ── */}
                {colors.length > 0 && (
                    <div className="mb-6 pb-6 border-b border-black/5">
                        <button
                            onClick={() => toggleSection("color")}
                            className="flex items-center justify-between w-full text-left"
                        >
                            <span className="text-[13px] font-semibold text-slate-800">Color</span>
                            <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${openSections.color ? "rotate-180" : ""}`} />
                        </button>

                        {openSections.color && (
                            <div className="mt-4 flex flex-wrap gap-2.5">
                                {colors.map((clr, idx) => {
                                    const isChecked = activeColors.includes(clr);
                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => handleToggleList("color", clr)}
                                            title={getColorName(clr)}
                                            className={`relative w-8 h-8 rounded-full border-2 transition-all duration-200 flex items-center justify-center ${
                                                isChecked
                                                    ? "border-[#134A31] ring-2 ring-[#134A31]/30 scale-110"
                                                    : "border-slate-200 hover:border-slate-400 hover:scale-105"
                                            }`}
                                        >
                                            <span
                                                className="w-6 h-6 rounded-full block"
                                                style={getSwatchStyle(clr)}
                                            />
                                            {isChecked && (
                                                <span className="absolute inset-0 flex items-center justify-center">
                                                    <Check className="w-3.5 h-3.5 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]" />
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        )}

                        {/* Active color chips */}
                        {activeColors.length > 0 && openSections.color && (
                            <div className="mt-3 flex flex-wrap gap-1.5">
                                {activeColors.map((clr) => (
                                    <span
                                        key={clr}
                                        className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#134A31]/10 text-[#134A31] rounded-full text-[11px] font-medium capitalize"
                                    >
                                        {getColorName(clr)}
                                        <X
                                            className="w-3 h-3 cursor-pointer hover:text-red-600 transition-colors"
                                            onClick={() => handleToggleList("color", clr)}
                                        />
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ── Price Range Slider ── */}
                <div className="mb-6">
                    <button
                        onClick={() => toggleSection("price")}
                        className="flex items-center justify-between w-full text-left"
                    >
                        <span className="text-[13px] font-semibold text-slate-800">Price</span>
                        <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${openSections.price ? "rotate-180" : ""}`} />
                    </button>

                    {openSections.price && (
                        <div className="mt-5">
                            {/* Display values */}
                            <div className="flex items-center justify-between text-[12px] text-slate-600 mb-4">
                                <span className="font-semibold text-[#0f3a2a] bg-[#0f3a2a]/5 px-2.5 py-1 rounded-md">
                                    ₹{priceRange[0].toLocaleString("en-IN")}
                                </span>
                                <span className="text-[10px] text-slate-400 uppercase tracking-wider">to</span>
                                <span className="font-semibold text-[#0f3a2a] bg-[#0f3a2a]/5 px-2.5 py-1 rounded-md">
                                    ₹{priceRange[1].toLocaleString("en-IN")}
                                </span>
                            </div>

                            {/* Dual range slider using overlapping inputs */}
                            <div className="relative h-6 flex items-center">
                                {/* Track background */}
                                <div className="absolute left-0 right-0 h-[5px] bg-slate-200 rounded-full" />

                                {/* Active track */}
                                <div
                                    className="absolute h-[5px] bg-gradient-to-r from-[#134A31] to-[#0f3a2a] rounded-full transition-all duration-75"
                                    style={{
                                        left: `${(priceRange[0] / ceilMax) * 100}%`,
                                        right: `${100 - (priceRange[1] / ceilMax) * 100}%`,
                                    }}
                                />

                                {/* Min slider */}
                                <input
                                    type="range"
                                    min={0}
                                    max={ceilMax}
                                    step={step}
                                    value={priceRange[0]}
                                    onChange={(e) => {
                                        const val = Math.min(Number(e.target.value), priceRange[1] - step);
                                        handlePriceChange(val, priceRange[1]);
                                    }}
                                    className="absolute w-full appearance-none bg-transparent pointer-events-none z-10 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-[18px] [&::-webkit-slider-thumb]:h-[18px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#134A31] [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-[18px] [&::-moz-range-thumb]:h-[18px] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[#134A31] [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-pointer"
                                    aria-label="Minimum price"
                                />

                                {/* Max slider */}
                                <input
                                    type="range"
                                    min={0}
                                    max={ceilMax}
                                    step={step}
                                    value={priceRange[1]}
                                    onChange={(e) => {
                                        const val = Math.max(Number(e.target.value), priceRange[0] + step);
                                        handlePriceChange(priceRange[0], val);
                                    }}
                                    className="absolute w-full appearance-none bg-transparent pointer-events-none z-20 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-[18px] [&::-webkit-slider-thumb]:h-[18px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#134A31] [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-[18px] [&::-moz-range-thumb]:h-[18px] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-[#134A31] [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-pointer"
                                    aria-label="Maximum price"
                                />
                            </div>

                            {/* Scale labels */}
                            <div className="flex items-center justify-between mt-2 text-[10px] text-slate-400 font-medium">
                                <span>₹0</span>
                                <span>₹{ceilMax.toLocaleString("en-IN")}</span>
                            </div>

                            {/* Reset button */}
                            {isPriceFiltered && (
                                <button
                                    onClick={resetPrice}
                                    className="mt-3 text-[11px] text-[#b13d33] font-medium hover:underline transition-colors"
                                >
                                    Reset price filter
                                </button>
                            )}
                        </div>
                    )}
                </div>

            </div>
        </aside>
    );
}
