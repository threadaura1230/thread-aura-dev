import CatalogHeader from "@/sitepages/components/catalog/CatalogHeader";
import FilterSidebar from "@/sitepages/components/catalog/FilterSidebar";
import ProductCard from "@/sitepages/components/catalog/ProductCard";
import dbConnect from "@/lib/db";
import Collection from "@/models/products/collections";
import SubCollection from "@/models/products/subcollection";
import Product from "@/models/products/products";

export default async function CatalogPage({ 
    params,
    searchParams 
}: { 
    params: Promise<{ catelog: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    // Await params and search parameters
    const resolvedParams = await params;
    const resolvedSearchParams = await searchParams;
    const categorySlug = resolvedParams.catelog;
    
    const activeMaterial = resolvedSearchParams.material as string | undefined;
    const activeSubCollection = resolvedSearchParams.subCollection as string | undefined;
    const activePrice = resolvedSearchParams.price as string | undefined;
    
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
    
    // Fetch distinct active materials present in this collection's products
    const distinctMaterials = (await Product.distinct("material", {
        collection: collection._id,
        isActive: true,
    })).filter(Boolean) as string[];

    // Find active subcollections belonging to this parent collection
    const dbSubCollections = await SubCollection.find({
        collection: collection._id,
        isActive: true,
    }).select("_id name slug");

    const subCollections = dbSubCollections.map((sub) => ({
        _id: sub._id.toString(),
        name: sub.name,
        slug: sub.slug,
    }));

    // Build the query dynamically
    const query: any = { collection: collection._id, isActive: true };

    if (activeMaterial) {
        const materials = activeMaterial.split(",");
        query.material = { $in: materials };
    }

    if (activeSubCollection) {
        const subColSlugs = activeSubCollection.split(",");
        const matchingSubCols = await SubCollection.find({
            slug: { $in: subColSlugs },
            collection: collection._id,
        });
        query.subCollection = { $in: matchingSubCols.map(s => s._id) };
    }

    if (activePrice) {
        if (activePrice === "under-500") {
            query.price = { $lt: 500 };
        } else if (activePrice === "500-1000") {
            query.price = { $gte: 500, $lte: 1000 };
        } else if (activePrice === "1000-2000") {
            query.price = { $gte: 1000, $lte: 2000 };
        } else if (activePrice === "over-2000") {
            query.price = { $gt: 2000 };
        }
    }

    // Retrieve products matching the query from MongoDB (populated with subCollection)
    const dbProducts = await Product.find(query)
        .populate("subCollection")
        .sort({ createdAt: -1 });
    
    // Map Mongoose documents to matching plain objects for ProductCard
    const categoryProducts = dbProducts.map((p) => ({
        id: p._id.toString(),
        name: p.name,
        price: p.price,
        material: p.material || "",
        tag: p.tag || "",
        bgColor: p.bgColor || "#1f332a",
        images: p.images || [],
        slug: p.slug,
        subCollectionSlug: p.subCollection && typeof p.subCollection === "object" ? (p.subCollection as any).slug : "general",
    }));

    return (
        <div className="bg-[#F1EFE7] min-h-screen py-24 px-6 md:px-8 lg:px-12">
            <div className="max-w-[1400px] mx-auto">
                {/* Header - pass the actual DB collection name */}
                <CatalogHeader categoryName={collection.name} />

                <div className="flex flex-col md:flex-row gap-8 lg:gap-12 relative">
                    {/* Sidebar */}
                    <FilterSidebar materials={distinctMaterials} subCollections={subCollections} />

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

