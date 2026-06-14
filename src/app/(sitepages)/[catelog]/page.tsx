import CatalogHeader from "@/sitepages/components/catalog/CatalogHeader";
import FilterSidebar from "@/sitepages/components/catalog/FilterSidebar";
import ProductCard from "@/sitepages/components/catalog/ProductCard";
import dbConnect from "@/lib/db";
import Collection from "@/models/products/collections";
import Product from "@/models/products/products";

export default async function CatalogPage({ params }: { params: Promise<{ catelog: string }> }) {
    // In Next 15+, params is a promise. We await it to be safe.
    const resolvedParams = await params;
    const categorySlug = resolvedParams.catelog;
    
    await dbConnect();
    
    // Find the collection matching the slug
    const collection = await Collection.findOne({ slug: categorySlug, isActive: true });
    
    if (!collection) {
        return (
            <div className="bg-[#F1EFE7] min-h-screen py-32 px-6 flex flex-col items-center justify-center text-center">
                <h1 className="font-serif text-[36px] text-slate-900 mb-4 capitalize">
                    Collection Not Found
                </h1>
                <p className="text-slate-600 max-w-md mb-8">
                    The collection &quot;{categorySlug.replace(/-/g, ' ')}&quot; could not be found or is currently inactive.
                </p>
                <a 
                    href="/" 
                    className="px-6 py-3 bg-[#0F3A2A] text-white text-[12px] font-bold tracking-widest uppercase hover:bg-[#134A31] transition-colors rounded"
                >
                    Back to Home
                </a>
            </div>
        );
    }
    
    // Retrieve products belonging to this category from MongoDB
    const dbProducts = await Product.find({ collection: collection._id, isActive: true }).sort({ createdAt: -1 });
    
    // Map Mongoose documents to matching plain objects for ProductCard
    const categoryProducts = dbProducts.map((p) => ({
        id: p._id.toString(),
        name: p.name,
        price: p.price,
        material: p.material || "",
        tag: p.tag || "",
        bgColor: p.bgColor || "#1f332a",
        images: p.images || [],
    }));

    return (
        <div className="bg-[#F1EFE7] min-h-screen py-24 px-6 md:px-8 lg:px-12">
            <div className="max-w-[1400px] mx-auto">
                {/* Header - pass the actual DB collection name */}
                <CatalogHeader categoryName={collection.name} />

                <div className="flex flex-col md:flex-row gap-8 lg:gap-12 relative">
                    {/* Sidebar */}
                    <FilterSidebar />

                    {/* Product Grid */}
                    <div className="flex-1">
                        {categoryProducts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
                                {categoryProducts.map((product) => (
                                    <ProductCard 
                                        key={product.id} 
                                        product={product} 
                                        categorySlug={categorySlug} 
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 border border-dashed border-black/10 rounded-lg">
                                <h3 className="font-serif text-[20px] text-slate-800 mb-2">No Products Found</h3>
                                <p className="text-[13px] text-slate-500">
                                    We are currently crafting new pieces. Please check back later.
                                </p>
                            </div>
                        )}

                        {/* Pagination Placeholder */}
                        {categoryProducts.length > 9 && (
                            <div className="mt-20 flex justify-center border-t border-black/10 pt-10">
                                <button className="px-8 py-3 border border-slate-300 text-slate-800 text-[13px] font-medium tracking-wider uppercase hover:border-slate-900 transition-colors">
                                    Load More
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

