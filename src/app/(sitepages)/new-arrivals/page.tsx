import dbConnect from "@/lib/db";
import Product from "@/models/products/products";
import ProductCard from "@/sitepages/components/catalog/ProductCard";
import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "New Arrivals - Thread Aura",
  description: "Explore our latest handcrafted, artisanal luxury thread bangles and collections.",
});

export default async function NewArrivalsPage() {
  await dbConnect();

  // Retrieve active products sorted by creation time to show the newest arrivals first
  const dbProducts = await Product.find({ isActive: true })
    .populate("collection")
    .populate("subCollection")
    .sort({ createdAt: -1 })
    .limit(12);

  const newProducts = dbProducts.map((p) => ({
    id: p._id.toString(),
    name: p.name,
    price: p.price,
    material: p.material || "",
    tag: p.tag || "",
    bgColor: p.bgColor || "#1f332a",
    images: p.images || [],
    slug: p.slug,
    subCollectionSlug: p.subCollection && typeof p.subCollection === "object" ? (p.subCollection as any).slug : "general",
    categorySlug: p.collection && typeof p.collection === "object" ? (p.collection as any).slug : "collections"
  }));

  return (
    <div className="bg-[#F1EFE7] min-h-screen py-24 px-6 md:px-8 lg:px-12">
      <div className="max-w-[1400px] mx-auto">
        {/* Page Header */}
        <div className="mb-14 pb-8 border-b border-black/10">
          <p className="text-[11px] font-bold tracking-[0.2em] text-[#b13d33] mb-3 uppercase">
            Freshly Crafted
          </p>
          <h1 className="font-serif text-[36px] md:text-[48px] text-slate-900 leading-tight">
            New Arrivals
          </h1>
          <p className="text-slate-600 text-[14px] leading-relaxed max-w-xl mt-3">
            Discover our latest creations, fresh from the loom. Meticulously hand-wrapped with fine silk threads, organic cotton, and metallic accents.
          </p>
        </div>

        {/* Product Grid */}
        {newProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
            {newProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                categorySlug={product.categorySlug}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 border border-dashed border-black/10 rounded-lg">
            <h3 className="font-serif text-[20px] text-slate-800 mb-2">
              No New Products Found
            </h3>
            <p className="text-[13px] text-slate-500">
              We are currently designing and weaving new pieces. Please stay tuned!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
