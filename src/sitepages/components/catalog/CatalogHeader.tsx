import Link from "next/link";
import { ChevronRight, SlidersHorizontal } from "lucide-react";

interface CatalogHeaderProps {
    categoryName: string;
    description?: string;
    images?: string[];
}

export default function CatalogHeader({ categoryName, description, images = [] }: CatalogHeaderProps) {
    const displayDesc = description || `Explore our handcrafted collection of ${categoryName.replace(/-/g, ' ')}. Each piece is meticulously designed with the finest threads and materials.`;

    return (
        <div className="mb-10">
            {/* Breadcrumbs */}
            <nav className="flex items-center text-[11px] font-medium tracking-wider uppercase text-slate-500 mb-8">
                <Link href="/" className="hover:text-black transition-colors">Home</Link>
                <ChevronRight className="w-3 h-3 mx-2" />
                <span className="text-black capitalize">{categoryName.replace(/-/g, ' ')}</span>
            </nav>

            {/* Image Collage / Banner Section */}
            {images.length > 0 && (
                <div className="mb-12 overflow-hidden rounded-2xl border border-black/[0.06] bg-white p-2.5 shadow-sm">
                    {images.length === 1 ? (
                        <div className="relative aspect-[21/9] w-full overflow-hidden rounded-xl bg-slate-50">
                            <img
                                src={images[0]}
                                alt={categoryName}
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                        </div>
                    ) : images.length === 2 ? (
                        <div className="grid grid-cols-2 gap-2.5 aspect-[21/9] w-full overflow-hidden rounded-xl bg-slate-50">
                            <div className="relative h-full w-full">
                                <img
                                    src={images[0]}
                                    alt={`${categoryName} 1`}
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                            </div>
                            <div className="relative h-full w-full">
                                <img
                                    src={images[1]}
                                    alt={`${categoryName} 2`}
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-2.5 aspect-[21/9] w-full overflow-hidden rounded-xl bg-slate-50">
                            {/* Main large image */}
                            <div className="relative h-full w-full min-h-[160px]">
                                <img
                                    src={images[0]}
                                    alt={`${categoryName} Main`}
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                            </div>
                            {/* Two smaller stacked images */}
                            <div className="grid grid-rows-2 gap-2.5 h-full">
                                <div className="relative h-full w-full">
                                    <img
                                        src={images[1]}
                                        alt={`${categoryName} Detail 1`}
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />
                                </div>
                                <div className="relative h-full w-full">
                                    <img
                                        src={images[2] || images[0]}
                                        alt={`${categoryName} Detail 2`}
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Title and Sort */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-black/10">
                <div>
                    <h1 className="font-serif text-[32px] md:text-[42px] text-slate-900 leading-none capitalize">
                        {categoryName.replace(/-/g, ' ')}
                    </h1>
                    <p className="text-slate-600 text-[13px] mt-3 max-w-xl leading-relaxed">
                        {displayDesc}
                    </p>
                </div>

                {/* Mobile Filter Toggle & Desktop Sort */}
                <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto">
                    <button className="md:hidden flex items-center gap-2 text-[13px] font-semibold text-slate-800 border border-slate-300 rounded px-4 py-2">
                        <SlidersHorizontal className="w-4 h-4" />
                        Filters
                    </button>
                    
                    <div className="flex items-center gap-3">
                        <label htmlFor="sort" className="text-[12px] text-slate-500 font-medium uppercase tracking-wider hidden sm:block">Sort By</label>
                        <select 
                            id="sort" 
                            className="text-[13px] bg-transparent border border-slate-300 text-slate-800 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer"
                        >
                            <option value="featured">Featured</option>
                            <option value="newest">Newest Arrivals</option>
                            <option value="price-asc">Price: Low to High</option>
                            <option value="price-desc">Price: High to Low</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
}
