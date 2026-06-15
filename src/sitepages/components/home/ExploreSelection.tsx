import dbConnect from "@/lib/db";
import SubCollection from "@/models/products/subcollection";
import Collection from "@/models/products/collections";
import Link from "next/link";

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
    <section className="bg-[#909771] py-20 md:py-32 w-full overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16">

        {/* Section Heading */}
        <h2 className="text-[#131b11] text-[18px] md:text-[22px] font-sans font-medium mb-16 tracking-wide">
          Explore Our Diverse Selection
        </h2>

        {/* Content Rows */}
        <div className="flex flex-col space-y-12 md:space-y-16">
          {subCollections.map((subCol) => {
            const parentCol = subCol.collection as any;
            const linkHref = parentCol ? `/collections/${parentCol.slug}/${subCol.slug}` : "/collections";

            return (
              <div key={subCol._id.toString()} className="flex flex-col md:flex-row items-start md:items-center justify-between group">

                {/* Text Content */}
                <div className="w-full md:w-[45%] lg:w-[35%] mb-6 md:mb-0">
                  <h3 className="text-[#131b11] text-[17px] md:text-[19px] font-sans font-medium mb-3 md:mb-4 hover:underline underline-offset-4">
                    <Link href={linkHref}>
                      {subCol.name}
                    </Link>
                  </h3>
                  <p className="text-[#131b11] text-[12px] md:text-[13px] leading-[1.8] max-w-[420px] font-medium">
                    {subCol.description || `Handcrafted ${subCol.name} bangles. Lightweight, comfortable, and durable, they beautifully complement both ethnic and contemporary styles.`}
                  </p>
                </div>

                {/* Image Container */}
                <div className="w-full md:w-[50%] lg:w-[55%] flex justify-end">
                  <div className="relative aspect-[21/7] w-full bg-[#828a65] group-hover:bg-[#7b835e] transition-colors duration-500 overflow-hidden shadow-sm">
                    {subCol.image ? (
                      <img 
                        src={subCol.image} 
                        alt={subCol.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-[#3c422c] text-sm font-medium">
                        {subCol.name}
                      </div>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

