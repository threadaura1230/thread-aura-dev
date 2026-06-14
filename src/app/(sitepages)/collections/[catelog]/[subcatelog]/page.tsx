import CatalogHeader from "@/sitepages/components/catalog/CatalogHeader";
import FilterSidebar from "@/sitepages/components/catalog/FilterSidebar";
import ProductCard from "@/sitepages/components/catalog/ProductCard";
import dbConnect from "@/lib/db";
import Collection from "@/models/products/collections";
import SubCollection from "@/models/products/subcollection";
import Product from "@/models/products/products";
import Link from "next/link";

interface PageProps {
    params: Promise<{
        catelog: string;
        subcatelog: string;
    }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SubcatalogPage({ params, searchParams }: PageProps) {
    const { catelog, subcatelog } = await params;
    const resolvedSearchParams = await searchParams;
    const activeMaterial = resolvedSearchParams.material as string | undefined;
    const activePrice = resolvedSearchParams.price as string | undefined;
    
    await dbConnect();
    
    // Find parent Collection
    const collection = await Collection.findOne({ slug: catelog, isActive: true });
    
    // Find SubCollection
    const subCollection = collection 
        ? await SubCollection.findOne({ slug: subcatelog, collection: collection._id, isActive: true })
        : null;
        
    if (!collection || !subCollection) {
        return (
            <div className="bg-[#F1EFE7] min-h-screen py-32 px-6 flex flex-col items-center justify-center text-center">
                <h1 className="font-serif text-[36px] text-slate-900 mb-4 capitalize">
                    Sub-Collection Not Found
                </h1>
                <p className="text-slate-600 max-w-md mb-8">
                    The requested page could not be found or is currently inactive.
                </p>
                <Link 
                    href="/" 
                    className="px-6 py-3 bg-[#0F3A2A] text-white text-[12px] font-bold tracking-widest uppercase hover:bg-[#134A31] transition-colors rounded"
                >
                    Back to Home
                </Link>
            </div>
        );
    }
    
    // Fetch distinct active materials present specifically in this subcategory's products
    const distinctMaterials = (await Product.distinct("material", {
        collection: collection._id,
        subCollection: subCollection._id,
        isActive: true,
    })).filter(Boolean) as string[];

    // Build the query dynamically
    const query: any = { 
        collection: collection._id, 
        subCollection: subCollection._id, 
        isActive: true 
    };

    if (activeMaterial) {
        const materials = activeMaterial.split(",");
        query.material = { $in: materials };
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

    // Retrieve products belonging to this category and subcategory from MongoDB
    const dbProducts = await Product.find(query).sort({ createdAt: -1 });
    
    // Map Mongoose documents to plain objects for ProductCard
    const subcategoryProducts = dbProducts.map((p) => ({
        id: p._id.toString(),
        name: p.name,
        price: p.price,
        material: p.material || "",
        tag: p.tag || "",
        bgColor: p.bgColor || "#1f332a",
        images: p.images || [],
        slug: p.slug,
        subCollectionSlug: subCollection.slug,
    }));

    return (
        <div className="bg-[#F1EFE7] min-h-screen py-24 px-6 md:px-8 lg:px-12">
            <div className="max-w-[1400px] mx-auto">
                {/* Header */}
                <div className="mb-10 border-b border-black/10 pb-6">
                    <nav className="flex items-center text-[11px] font-medium tracking-wider uppercase text-slate-500 mb-6">
                        <Link href="/" className="hover:text-black transition-colors">Home</Link>
                        <span className="mx-2">/</span>
                        <Link href={`/collections/${catelog}`} className="hover:text-black transition-colors capitalize">{collection.name}</Link>
                        <span className="mx-2">/</span>
                        <span className="text-black capitalize">{subCollection.name}</span>
                    </nav>
                    
                    <h1 className="font-serif text-[32px] md:text-[42px] text-slate-900 leading-none capitalize">
                        {subCollection.name}
                    </h1>
                    <p className="text-slate-600 text-[13px] mt-3 max-w-xl leading-relaxed">
                        {subCollection.description || `Discover our exclusive range of ${subCollection.name} within the ${collection.name} collection. Handcrafted to perfection.`}
                    </p>
                </div>

                <div className="flex flex-col md:flex-row gap-8 lg:gap-12 relative">
                    {/* Sidebar */}
                    <FilterSidebar materials={distinctMaterials} />

                    {/* Product Grid */}
                    <div className="flex-1">
                        {subcategoryProducts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
                                {subcategoryProducts.map((product) => (
                                    <ProductCard 
                                        key={product.id} 
                                        product={product} 
                                        categorySlug={`${catelog}/${subcatelog}`} 
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 border border-dashed border-black/10 rounded-lg">
                                <h3 className="font-serif text-[20px] text-slate-800 mb-2">No Products Found</h3>
                                <p className="text-[13px] text-slate-500">
                                    We are currently crafting new pieces for this category. Please check back later.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

