import dbConnect from "@/lib/db";
import SubCollection from "@/models/products/subcollection";
import Collection from "@/models/products/collections";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default async function ExploreSelection() {
  await dbConnect();

  // Retrieve top 3 active sub-collections populated with their parent Collection details
  const subCollections = await SubCollection.find({ isActive: true })
    .populate("collection")
    .limit(3);

  if (!subCollections || subCollections.length === 0) {
    return null;
  }

  return (
    <section className="bg-[#F1EFE7] py-24 md:py-32 w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-8">

        {/* Section Header */}
        <div className="mb-16 md:mb-20">
          <p className="text-[11px] font-bold tracking-[0.2em] text-[#b13d33] mb-3 uppercase">
            Categories
          </p>
          <h2 className="font-serif text-[32px] md:text-[40px] text-slate-900 leading-none">
            Explore Our Diverse Selection
          </h2>
        </div>

        {/* Content Rows — alternating layout */}
        <div className="flex flex-col space-y-16 md:space-y-24">
          {subCollections.map((subCol, index) => {
            const parentCol = subCol.collection as any;
            const linkHref = parentCol
              ? `/collections/${parentCol.slug}/${subCol.slug}`
              : "/collections";
            const isReversed = index % 2 !== 0;

            return (
              <div
                key={subCol._id.toString()}
                className={`flex flex-col ${isReversed ? "md:flex-row-reverse" : "md:flex-row"
                  } items-center gap-8 md:gap-12 lg:gap-16 group`}
              >
                {/* Image */}
                <div className="w-full md:w-[55%] lg:w-[58%]">
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#e3ded9] shadow-lg">
                    {subCol.image ? (
                      <Image
                        src={subCol.image}
                        alt={subCol.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 58vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-slate-400 font-medium text-sm bg-[#d9dcd6]">
                        {subCol.name}
                      </div>
                    )}
                    {/* Subtle gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  </div>
                </div>

                {/* Text Content */}
                <div className="w-full md:w-[45%] lg:w-[42%]">
                  {parentCol && (
                    <p className="text-[10px] font-bold tracking-[0.15em] text-[#134A31] mb-4 uppercase">
                      {parentCol.name}
                    </p>
                  )}
                  <h3 className="font-serif text-[24px] md:text-[30px] text-slate-900 leading-tight mb-4">
                    {subCol.name}
                  </h3>
                  <p className="text-slate-600 text-[13px] md:text-[14px] leading-[1.8] max-w-[420px] font-light mb-8">
                    {subCol.description ||
                      `Handcrafted ${subCol.name} bangles. Lightweight, comfortable, and durable, they beautifully complement both ethnic and contemporary styles.`}
                  </p>
                  <Link
                    href={linkHref}
                    className="inline-flex items-center px-7 py-3 bg-[#073623] text-white text-[13px] font-medium hover:bg-[#0c4a31] transition-all rounded-[4px] tracking-wide shadow-sm group/btn"
                  >
                    Explore Collection
                    <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
