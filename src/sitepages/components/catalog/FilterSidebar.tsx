"use client";

import { ChevronDown, Check } from "lucide-react";
import { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

interface FilterSidebarProps {
    materials?: string[];
    subCollections?: { _id: string; name: string; slug: string }[];
}

const priceRanges = [
    { label: "Under ₹500", value: "under-500" },
    { label: "₹500 - ₹1000", value: "500-1000" },
    { label: "₹1000 - ₹2000", value: "1000-2000" },
    { label: "Over ₹2000", value: "over-2000" },
];

export default function FilterSidebar({ materials = [], subCollections = [] }: FilterSidebarProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [openSections, setOpenSections] = useState({
        subCollection: true,
        material: true,
        price: true,
    });

    const toggleSection = (section: keyof typeof openSections) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    // Helper to add/remove items from a comma-separated query param
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

    // Helper for single select with toggle uncheck capability
    const handlePriceToggle = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        const current = params.get("price");

        if (current === value) {
            params.delete("price");
        } else {
            params.set("price", value);
        }
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const activeMaterials = searchParams.get("material")?.split(",") || [];
    const activeSubCols = searchParams.get("subCollection")?.split(",") || [];
    const activePrice = searchParams.get("price") || "";

    const hasFilters = materials.length > 0 || subCollections.length > 0;

    return (
        <aside className="hidden md:block w-64 flex-shrink-0 pr-8">
            <div className="sticky top-32">
                <h3 className="text-[14px] font-bold tracking-widest uppercase text-slate-900 mb-6 pb-4 border-b border-black/10">
                    Filter By
                </h3>

                {/* Sub-Collection / Subcategory Filter */}
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

                {/* Material Filter */}
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

                {/* Price Filter */}
                <div className="mb-6">
                    <button
                        onClick={() => toggleSection("price")}
                        className="flex items-center justify-between w-full text-left"
                    >
                        <span className="text-[13px] font-semibold text-slate-800">Price</span>
                        <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${openSections.price ? "rotate-180" : ""}`} />
                    </button>

                    {openSections.price && (
                        <div className="mt-4 space-y-3">
                            {priceRanges.map((range, idx) => {
                                const isChecked = activePrice === range.value;
                                return (
                                    <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                                        <div className="relative w-4 h-4 border border-slate-300 rounded-[2px] group-hover:border-[#134A31] transition-colors">
                                            <input 
                                                type="checkbox" 
                                                checked={isChecked}
                                                onChange={() => handlePriceToggle(range.value)}
                                                className="peer absolute opacity-0 w-full h-full cursor-pointer" 
                                            />
                                            <div className="absolute inset-0 bg-[#134A31] rounded-[2px] opacity-0 peer-checked:opacity-100 flex items-center justify-center transition-opacity">
                                                <Check className="w-3 h-3 text-white" />
                                            </div>
                                        </div>
                                        <span className="text-[13px] text-slate-600 group-hover:text-slate-900 transition-colors">{range.label}</span>
                                    </label>
                                );
                            })}
                        </div>
                    )}
                </div>

            </div>
        </aside>
    );
}
