"use client";

import { ChevronDown, Check } from "lucide-react";
import { useState } from "react";

export default function FilterSidebar() {
    const [openSections, setOpenSections] = useState({
        material: true,
        color: true,
        price: true,
    });

    const toggleSection = (section: keyof typeof openSections) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const filterOptions = {
        material: ['Silk Thread', 'Cotton Base', 'Metallic Zari', 'Velvet Wrapped'],

        price: ['Under $50', '$50 - $100', '$100 - $200', 'Over $200']
    };

    return (
        <aside className="hidden md:block w-64 flex-shrink-0 pr-8">
            <div className="sticky top-32">
                <h3 className="text-[14px] font-bold tracking-widest uppercase text-slate-900 mb-6 pb-4 border-b border-black/10">
                    Filter By
                </h3>

                {/* Material Filter */}
                <div className="mb-6 pb-6 border-b border-black/5">
                    <button
                        onClick={() => toggleSection('material')}
                        className="flex items-center justify-between w-full text-left"
                    >
                        <span className="text-[13px] font-semibold text-slate-800">Material</span>
                        <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${openSections.material ? 'rotate-180' : ''}`} />
                    </button>

                    {openSections.material && (
                        <div className="mt-4 space-y-3">
                            {filterOptions.material.map((item, idx) => (
                                <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative w-4 h-4 border border-slate-300 rounded-[2px] group-hover:border-[#134A31] transition-colors">
                                        <input type="checkbox" className="peer absolute opacity-0 w-full h-full cursor-pointer" />
                                        <div className="absolute inset-0 bg-[#134A31] rounded-[2px] opacity-0 peer-checked:opacity-100 flex items-center justify-center transition-opacity">
                                            <Check className="w-3 h-3 text-white" />
                                        </div>
                                    </div>
                                    <span className="text-[13px] text-slate-600 group-hover:text-slate-900 transition-colors">{item}</span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                {/* Color Filter
                <div className="mb-6 pb-6 border-b border-black/5">
                    <button
                        onClick={() => toggleSection('color')}
                        className="flex items-center justify-between w-full text-left"
                    >
                        <span className="text-[13px] font-semibold text-slate-800">Color</span>
                        <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${openSections.color ? 'rotate-180' : ''}`} />
                    </button>

                    {openSections.color && (
                        <div className="mt-4 space-y-3">
                            {filterOptions.color.map((item, idx) => (
                                <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative w-4 h-4 border border-slate-300 rounded-full group-hover:border-[#134A31] transition-colors">
                                        <input type="checkbox" className="peer absolute opacity-0 w-full h-full cursor-pointer" />
                                        <div className="absolute inset-0 bg-[#134A31] rounded-full opacity-0 peer-checked:opacity-100 flex items-center justify-center transition-opacity">
                                            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                                        </div>
                                    </div>
                                    <span className="text-[13px] text-slate-600 group-hover:text-slate-900 transition-colors">{item}</span>
                                </label>
                            ))}
                        </div>
                    )}
                </div> */}

                {/* Price Filter */}
                <div className="mb-6">
                    <button
                        onClick={() => toggleSection('price')}
                        className="flex items-center justify-between w-full text-left"
                    >
                        <span className="text-[13px] font-semibold text-slate-800">Price</span>
                        <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${openSections.price ? 'rotate-180' : ''}`} />
                    </button>

                    {openSections.price && (
                        <div className="mt-4 space-y-3">
                            {filterOptions.price.map((item, idx) => (
                                <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative w-4 h-4 border border-slate-300 rounded-[2px] group-hover:border-[#134A31] transition-colors">
                                        <input type="radio" name="price" className="peer absolute opacity-0 w-full h-full cursor-pointer" />
                                        <div className="absolute inset-0 bg-[#134A31] rounded-[2px] opacity-0 peer-checked:opacity-100 flex items-center justify-center transition-opacity">
                                            <Check className="w-3 h-3 text-white" />
                                        </div>
                                    </div>
                                    <span className="text-[13px] text-slate-600 group-hover:text-slate-900 transition-colors">{item}</span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </aside>
    );
}
