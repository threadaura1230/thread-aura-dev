import CatalogHeader from "@/sitepages/components/catalog/CatalogHeader";
import FilterSidebar from "@/sitepages/components/catalog/FilterSidebar";
import ProductCard from "@/sitepages/components/catalog/ProductCard";

// Mock data for the products (specific to subcategory)
const subcategoryProducts = [
    { id: "1", name: "Imperial Emerald Wrap", price: 145.00, material: "Silk & Gold Thread", tag: "Bestseller", bgColor: "#1f332a" },
    { id: "2", name: "Crimson Velvet Core", price: 85.00, material: "Velvet Wrapped", tag: "New", bgColor: "#4a1919" },
    { id: "3", name: "Midnight Sapphire", price: 120.00, material: "Silk Thread", bgColor: "#1a1f33" },
];

interface PageProps {
    params: Promise<{
        catelog: string;
        subcatelog: string;
    }>;
}

export default async function SubcatalogPage({ params }: PageProps) {
    const { catelog, subcatelog } = await params;
    
    // Construct a beautiful display name
    const displayCategory = catelog.replace(/-/g, ' ');
    const displaySubcategory = subcatelog.replace(/-/g, ' ');

    return (
        <div className="bg-[#F1EFE7] min-h-screen py-24 px-6 md:px-8 lg:px-12">
            <div className="max-w-[1400px] mx-auto">
                {/* Header */}
                <div className="mb-10 border-b border-black/10 pb-6">
                    <nav className="flex items-center text-[11px] font-medium tracking-wider uppercase text-slate-500 mb-6">
                        <span className="hover:text-black transition-colors">Home</span>
                        <span className="mx-2">/</span>
                        <span className="hover:text-black transition-colors capitalize">{displayCategory}</span>
                        <span className="mx-2">/</span>
                        <span className="text-black capitalize">{displaySubcategory}</span>
                    </nav>
                    
                    <h1 className="font-serif text-[32px] md:text-[42px] text-slate-900 leading-none capitalize">
                        {displaySubcategory}
                    </h1>
                    <p className="text-slate-600 text-[13px] mt-3 max-w-xl leading-relaxed">
                        Discover our exclusive range of {displaySubcategory} within the {displayCategory} collection. Handcrafted to perfection.
                    </p>
                </div>

                <div className="flex flex-col md:flex-row gap-8 lg:gap-12 relative">
                    {/* Sidebar */}
                    <FilterSidebar />

                    {/* Product Grid */}
                    <div className="flex-1">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
                            {subcategoryProducts.map((product) => (
                                <ProductCard 
                                    key={product.id} 
                                    product={product} 
                                    // Point the card's dynamic link deeper to the Product Detail Page [slug]
                                    categorySlug={`${catelog}/${subcatelog}`} 
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
