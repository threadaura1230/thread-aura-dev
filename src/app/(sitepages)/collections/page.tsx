import dbConnect from "@/lib/db";
import Collection from "@/models/products/collections";
import Product from "@/models/products/products";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export const metadata = {
  title: "Collections | Thread-aura",
  description: "Explore our curated collections of handcrafted thread bangles. Each collection is carefully designed and masterfully woven for timeless elegance.",
};

export default async function CollectionsPage() {
  await dbConnect();

  // Retrieve active collections
  const dbCollections = await Collection.find({ isActive: true }).sort({ createdAt: -1 });

  // Fetch product counts for each collection to show in the UI
  const collections = await Promise.all(
    dbCollections.map(async (col) => {
      const productCount = await Product.countDocuments({
        collection: col._id,
        isActive: true,
      });
      return {
        id: col._id.toString(),
        name: col.name,
        slug: col.slug,
        description: col.description,
        image: col.image,
        productCount,
      };
    })
  );

  return (
    <div className="bg-[#F1EFE7] min-h-screen py-28 px-6 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center text-[11px] font-medium tracking-wider uppercase text-slate-500 mb-12">
          <Link href="/" className="hover:text-black transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-black">Collections</span>
        </nav>

        {/* Header Section */}
        <header className="mb-20 text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0F3A2A]/5 text-[#0F3A2A] rounded-full text-[10px] font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#0f3a2a]" />
            Curated Artistry
          </div>
          <h1 className="font-serif text-[40px] md:text-[52px] text-slate-900 leading-tight">
            Our Collections
          </h1>
          <div className="w-12 h-[1px] bg-[#0f3a2a] mx-auto my-6"></div>
          <p className="text-slate-600 text-sm md:text-base leading-relaxed font-light">
            Discover our carefully selected ranges of handcrafted bangles. From vibrant festive silk wraps to subtle everyday organic cotton creations, each collection represents a unique journey in master weaving.
          </p>
        </header>

        {/* Collections Listing */}
        {collections.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
            {collections.map((col, index) => {
              // Asymmetric design layouts
              const isEven = index % 2 === 0;

              return (
                <div 
                  key={col.id} 
                  className={`flex flex-col space-y-6 group ${
                    isEven ? "md:translate-y-0" : "md:translate-y-8"
                  } transition-transform duration-500`}
                >
                  {/* Image Container */}
                  <Link 
                    href={`/collections/${col.slug}`} 
                    className="relative block aspect-[16/10] w-full rounded-2xl overflow-hidden shadow-sm bg-[#e3ded9] group-hover:shadow-md transition-shadow duration-300"
                  >
                    {col.image ? (
                      <img 
                        src={col.image} 
                        alt={col.name} 
                        className="w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-slate-400 font-medium bg-[#d9dcd6] uppercase tracking-widest text-xs">
                        {col.name}
                      </div>
                    )}
                    
                    {/* Badge Overlay */}
                    <div className="absolute top-4 left-4 z-10 bg-[#0F3A2A] text-[#FFFBE4] text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-[3px] shadow-sm">
                      {col.productCount} {col.productCount === 1 ? "Design" : "Designs"}
                    </div>
                  </Link>

                  {/* Info Box */}
                  <div className="px-2 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="h-[1px] w-5 bg-[#b13d33]"></span>
                      <span className="text-[10px] font-bold tracking-[0.2em] text-[#b13d33] uppercase">
                        Collection {index + 1}
                      </span>
                    </div>

                    <h3 className="font-serif text-[28px] text-slate-900 leading-tight">
                      <Link href={`/collections/${col.slug}`} className="hover:underline underline-offset-4 decoration-1 decoration-slate-400">
                        {col.name}
                      </Link>
                    </h3>

                    <p className="text-slate-600 text-[13px] leading-relaxed max-w-xl font-light">
                      {col.description || `Explore our exclusive selection of ${col.name} bangles. Designed for both exceptional versatility and elegance.`}
                    </p>

                    <div className="pt-2">
                      <Link 
                        href={`/collections/${col.slug}`} 
                        className="inline-flex items-center text-[12px] font-bold tracking-widest uppercase text-[#0f3a2a] hover:text-black transition-colors group/btn"
                      >
                        Explore Collection
                        <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1.5 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-24 border border-dashed border-black/10 rounded-2xl bg-white/50 max-w-xl mx-auto">
            <h3 className="font-serif text-[22px] text-slate-800 mb-3">No Collections Found</h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6">
              We are currently designing and curating new collections of handcrafted bangles. Please check back soon.
            </p>
            <Link
              href="/"
              className="inline-block px-8 py-3.5 bg-[#0f3a2a] hover:bg-[#134a31] text-white text-xs font-semibold tracking-widest uppercase transition-colors"
            >
              Back to Home
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
