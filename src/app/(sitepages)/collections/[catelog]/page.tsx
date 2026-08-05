import CatalogHeader from "@/sitepages/components/catalog/CatalogHeader";
import SubCollectionGrid from "@/sitepages/components/catalog/SubCollectionGrid";
import FilterSidebar from "@/sitepages/components/catalog/FilterSidebar";
import ProductCard from "@/sitepages/components/catalog/ProductCard";
import dbConnect from "@/lib/db";
import Collection from "@/models/products/collections";
import SubCollection from "@/models/products/subcollection";
import Product from "@/models/products/products";
import { constructMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ catelog: string }> }) {
  const { catelog } = await params;
  await dbConnect();
  const collection = await Collection.findOne({ slug: catelog, isActive: true });
  
  if (!collection) {
    return constructMetadata({
      title: "Collection Not Found",
      description: "This bangle collection could not be found.",
    });
  }

  return constructMetadata({
    title: `${collection.name} Collection`,
    description: collection.description || `Browse artisanal, hand-woven luxury bangles from the ${collection.name} collection.`,
    image: collection.image,
  });
}


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
    const activeColor = resolvedSearchParams.color as string | undefined;
    const activePriceMin = resolvedSearchParams.priceMin as string | undefined;
    const activePriceMax = resolvedSearchParams.priceMax as string | undefined;
    
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
    
    // Fetch distinct active materials and colors present in this collection's products
    const baseFilter = { collection: collection._id, isActive: true };
    const distinctMaterials = (await Product.distinct("material", baseFilter)).filter(Boolean) as string[];
    const distinctColors = (await Product.distinct("color", baseFilter)).filter(Boolean) as string[];

    // Get max price for slider
    const maxPriceResult = await Product.findOne(baseFilter).sort({ price: -1 }).select("price").lean() as { price?: number } | null;
    const maxPrice = maxPriceResult?.price || 5000;

    // Find active subcollections belonging to this parent collection
    const dbSubCollections = await SubCollection.find({
        collection: collection._id,
        isActive: true,
    }).select("_id name slug description image");

    // Get product counts per subcollection in a single aggregate query
    const productCounts = await Product.aggregate([
        { $match: { collection: collection._id, isActive: true } },
        { $group: { _id: "$subCollection", count: { $sum: 1 } } },
    ]);
    const countMap = new Map(productCounts.map((pc: any) => [pc._id?.toString(), pc.count]));

    const subCollections = dbSubCollections.map((sub) => ({
        _id: sub._id.toString(),
        name: sub.name,
        slug: sub.slug,
    }));

    // Full subcollection data for the grid (includes image, description, count)
    const subCollectionsForGrid = dbSubCollections.map((sub) => ({
        _id: sub._id.toString(),
        name: sub.name,
        slug: sub.slug,
        description: sub.description || "",
        image: sub.image || "",
        productCount: countMap.get(sub._id.toString()) || 0,
    }));

    // Build the query dynamically
    const query: any = { collection: collection._id, isActive: true };

    if (activeMaterial) {
        const materials = activeMaterial.split(",");
        query.material = { $in: materials };
    }

    if (activeColor) {
        const colors = activeColor.split(",");
        query.color = { $in: colors };
    }

    if (activeSubCollection) {
        const subColSlugs = activeSubCollection.split(",");
        const matchingSubCols = await SubCollection.find({
            slug: { $in: subColSlugs },
            collection: collection._id,
        });
        query.subCollection = { $in: matchingSubCols.map(s => s._id) };
    }

    // Price range filtering
    if (activePriceMin || activePriceMax) {
        query.price = {};
        if (activePriceMin) query.price.$gte = Number(activePriceMin);
        if (activePriceMax) query.price.$lte = Number(activePriceMax);
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
                <CatalogHeader 
                    categoryName={collection.name} 
                    description={collection.description}
                    images={collection.images || (collection.image ? [collection.image] : [])}
                />

                {/* Subcollection browsing grid */}
                <SubCollectionGrid
                    subCollections={subCollectionsForGrid}
                    categorySlug={categorySlug}
                    categoryName={collection.name}
                />

                <div className="flex flex-col md:flex-row gap-8 lg:gap-12 relative">
                    {/* Sidebar */}
                    <FilterSidebar materials={distinctMaterials} colors={distinctColors} subCollections={subCollections} maxPrice={maxPrice} />

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

