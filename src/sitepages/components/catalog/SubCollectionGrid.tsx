import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface SubCollectionItem {
    _id: string;
    name: string;
    slug: string;
    description?: string;
    image?: string;
    productCount: number;
}

interface SubCollectionGridProps {
    subCollections: SubCollectionItem[];
    categorySlug: string;
    categoryName: string;
}

export default function SubCollectionGrid({
    subCollections,
    categorySlug,
    categoryName,
}: SubCollectionGridProps) {
    if (!subCollections || subCollections.length === 0) return null;

    return (
        <section className="mb-14">
            {/* Section header */}
            <div className="flex items-end justify-between mb-8">
                <div>
                    <p
                        className="text-[10px] font-bold tracking-[0.2em] text-[#b13d33] uppercase mb-2"
                        style={{ fontFamily: "var(--font-label, inherit)" }}
                    >
                        Browse by Style
                    </p>
                    <h2
                        className="font-serif text-[24px] md:text-[30px] text-slate-900 leading-none"
                    >
                        {categoryName} Styles
                    </h2>
                </div>
                <p className="hidden sm:block text-[12px] text-slate-500 font-medium">
                    {subCollections.length} {subCollections.length === 1 ? "style" : "styles"}
                </p>
            </div>

            {/* Scrollable row on mobile, grid on md+ */}
            <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 overflow-x-auto pb-4 md:pb-0 snap-x snap-mandatory scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0">
                {subCollections.map((sub, idx) => (
                    <Link
                        key={sub._id}
                        href={`/collections/${categorySlug}/${sub.slug}`}
                        className="group relative flex-shrink-0 w-[260px] md:w-auto snap-start rounded-2xl overflow-hidden bg-[#e3ded9] aspect-[4/5] transition-all duration-500"
                        style={{
                            animationDelay: `${idx * 80}ms`,
                        }}
                    >
                        {/* Image / fallback */}
                        <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105">
                            {sub.image ? (
                                <img
                                    src={sub.image}
                                    alt={sub.name}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0f3a2a]/10 to-[#d4af37]/10">
                                    <span
                                        className="font-serif text-[48px] text-[#0f3a2a]/15 select-none"
                                    >
                                        {sub.name[0]}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent pointer-events-none" />

                        {/* Content */}
                        <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 z-10">
                            {/* Product count pill */}
                            {sub.productCount > 0 && (
                                <span className="inline-block px-2.5 py-1 bg-white/15 backdrop-blur-sm text-white/90 text-[10px] font-bold tracking-wider uppercase rounded-full mb-3 border border-white/10">
                                    {sub.productCount} {sub.productCount === 1 ? "design" : "designs"}
                                </span>
                            )}

                            <h3 className="font-serif text-[20px] md:text-[22px] text-white leading-tight mb-1.5">
                                {sub.name}
                            </h3>

                            {sub.description && (
                                <p className="text-white/70 text-[12px] leading-relaxed line-clamp-2 mb-3">
                                    {sub.description}
                                </p>
                            )}

                            {/* Explore link */}
                            <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-white/80 group-hover:text-white transition-colors">
                                Explore
                                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
                            </span>
                        </div>

                        {/* Subtle hover border glow */}
                        <div className="absolute inset-0 rounded-2xl border border-white/0 group-hover:border-white/20 transition-colors duration-500 pointer-events-none" />
                    </Link>
                ))}
            </div>
        </section>
    );
}
