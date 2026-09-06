import dbConnect from "@/lib/db";
import Product from "@/models/products/products";
import Collection from "@/models/products/collections";
import SubCollection from "@/models/products/subcollection";
import ProductCard from "@/sitepages/components/catalog/ProductCard";
import { constructMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = constructMetadata({
  title: "New Arrivals - Thread Aura",
  description: "Explore our latest handcrafted, artisanal luxury thread bangles and collections.",
});

interface PopulatedRef {
  _id?: string;
  name?: string;
  slug?: string;
}

export default async function NewArrivalsPage() {
  await dbConnect();

  // Ensure Collection and SubCollection models are registered in Mongoose
  void Collection;
  void SubCollection;

  // Retrieve active products sorted by creation time (and _id) to show the newest arrivals first
  const dbProducts = await Product.find({ isActive: { $ne: false } })
    .populate("collection")
    .populate("subCollection")
    .sort({ createdAt: -1, _id: -1 })
    .limit(48);

  const newProducts = dbProducts.map((p) => {
    const subCol = p.subCollection as PopulatedRef | undefined;
    const col = p.collection as PopulatedRef | undefined;

    return {
      id: p._id.toString(),
      name: p.name,
      price: p.price,
      material: p.material || "",
      tag: p.tag || "",
      bgColor: p.bgColor || "#1f332a",
      images: p.images || [],
      sizes: p.sizes || [],
      slug: p.slug,
      subCollectionSlug: subCol?.slug || "general",
      categorySlug: col?.slug || "collections",
    };
  });

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
