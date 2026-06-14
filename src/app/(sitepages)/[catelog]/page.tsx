import CatalogHeader from "@/sitepages/components/catalog/CatalogHeader";
import FilterSidebar from "@/sitepages/components/catalog/FilterSidebar";
import ProductCard from "@/sitepages/components/catalog/ProductCard";

// Mock data for the products
const products = [
    { id: "1", name: "Imperial Emerald Wrap", price: 145.00, material: "Silk & Gold Thread", tag: "Bestseller", bgColor: "#1f332a" },
    { id: "2", name: "Crimson Velvet Core", price: 85.00, material: "Velvet Wrapped", tag: "New", bgColor: "#4a1919" },
    { id: "3", name: "Midnight Sapphire", price: 120.00, material: "Silk Thread", bgColor: "#1a1f33" },
    { id: "4", name: "Giza Cotton Basic", price: 45.00, material: "Cotton Base", bgColor: "#c2bbaf" },
    { id: "5", name: "Rose Gold Zari", price: 195.00, material: "Metallic Zari", tag: "Limited", bgColor: "#d4a373" },
    { id: "6", name: "Ivory Pearl Weave", price: 110.00, material: "Silk Thread", bgColor: "#e8e5df" },
    { id: "7", name: "Olive Earth Tone", price: 65.00, material: "Cotton Base", bgColor: "#5c664d" },
    { id: "8", name: "Royal Purple Velvet", price: 95.00, material: "Velvet Wrapped", bgColor: "#3b2247" },
    { id: "9", name: "Copper Metallic Wrap", price: 155.00, material: "Metallic Zari", bgColor: "#b85d19" },
];

export default async function CatalogPage({ params }: { params: Promise<{ catelog: string }> }) {
    // In Next 15+, params is a promise. We await it to be safe.
    const resolvedParams = await params;
    const categorySlug = resolvedParams.catelog;

    return (
        <div className="bg-[#F1EFE7] min-h-screen py-24 px-6 md:px-8 lg:px-12">
            <div className="max-w-[1400px] mx-auto">
                {/* Header */}
                <CatalogHeader categoryName={categorySlug} />

                <div className="flex flex-col md:flex-row gap-8 lg:gap-12 relative">
                    {/* Sidebar */}
                    <FilterSidebar />

                    {/* Product Grid */}
                    <div className="flex-1">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
                            {products.map((product) => (
                                <ProductCard 
                                    key={product.id} 
                                    product={product} 
                                    categorySlug={categorySlug} 
                                />
                            ))}
                        </div>

                        {/* Pagination Placeholder */}
                        <div className="mt-20 flex justify-center border-t border-black/10 pt-10">
                            <button className="px-8 py-3 border border-slate-300 text-slate-800 text-[13px] font-medium tracking-wider uppercase hover:border-slate-900 transition-colors">
                                Load More
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
