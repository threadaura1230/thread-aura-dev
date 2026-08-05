import Link from "next/link";

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
        <section className="mb-12">
            {/* Horizontally scrollable row of small circular category bubbles */}
            <div
                className="flex items-start gap-6 md:gap-8 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0"
                style={{ scrollSnapType: "x mandatory" }}
            >
                {subCollections.map((sub) => (
                    <Link
                        key={sub._id}
                        href={`/collections/${categorySlug}/${sub.slug}`}
                        className="group flex flex-col items-center gap-2.5 flex-shrink-0"
                        style={{ scrollSnapAlign: "start" }}
                    >
                        {/* Arch background + circular image */}
                        <div
                            className="relative flex items-end justify-center overflow-hidden transition-transform duration-300 group-hover:scale-105"
                            style={{
                                width: "110px",
                                height: "120px",
                            }}
                        >
                            {/* Soft arch background */}
                            <div
                                className="absolute bottom-0 left-1/2 -translate-x-1/2"
                                style={{
                                    width: "110px",
                                    height: "90px",
                                    borderRadius: "55px 55px 8px 8px",
                                    background: "linear-gradient(180deg, #f3e8f4 0%, #edd5ef 100%)",
                                }}
                            />

                            {/* Circular image */}
                            <div className="relative z-10 mb-1">
                                {sub.image ? (
                                    <img
                                        src={sub.image}
                                        alt={sub.name}
                                        className="w-[96px] h-[96px] rounded-full object-cover border-[3px] border-white shadow-sm"
                                        loading="lazy"
                                    />
                                ) : (
                                    <div className="w-[96px] h-[96px] rounded-full bg-gradient-to-br from-[#f0e6f3] to-[#e6d5ea] border-[3px] border-white shadow-sm flex items-center justify-center">
                                        <span className="font-serif text-[32px] text-[#8b5e83]/40 select-none">
                                            {sub.name[0]}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Label */}
                        <span className="text-[12px] md:text-[13px] font-medium text-slate-700 text-center leading-tight max-w-[110px] group-hover:text-slate-900 transition-colors">
                            {sub.name}
                        </span>
                    </Link>
                ))}
            </div>
        </section>
    );
}
