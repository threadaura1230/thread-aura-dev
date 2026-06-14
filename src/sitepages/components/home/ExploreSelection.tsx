import Link from "next/link";

export default function ExploreSelection() {
  const items = [
    {
      title: "Silk Thread Bangles",
      description: "Handcrafted with premium silk threads, these bangles add a touch of elegance and tradition to any outfit.Lightweight, comfortable, and durable, they beautifully complement both ethnic and contemporary styles.",
      imagePlaceholder: "Image Placeholder (Wide Horizontal)"
    },
    {
      title: "Cotton Thread Bangles",
      description: "Their lightweight design ensures all-day comfort while adding a vibrant touch to your traditional and casual outfits.Durable and beautifully handcrafted, they are perfect for daily wear, festivals, and special celebrations.",
      imagePlaceholder: "Image Placeholder (Wide Horizontal)"
    },
    {
      title: "Chain and Heishi Bracelet",
      description: "Designed for comfort and style, it complements both casual and chic outfits effortlessly.Handcrafted with attention to detail, it's a versatile piece ideal for everyday wear and special occasions.",
      imagePlaceholder: "Image Placeholder (Wide Horizontal)"
    }
  ];

  return (
    <section className="bg-[#909771] py-20 md:py-32 w-full overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-16">

        {/* Section Heading */}
        <h2 className="text-[#131b11] text-[18px] md:text-[22px] font-sans font-medium mb-16 tracking-wide">
          Explore Our Diverse Selection
        </h2>

        {/* Content Rows */}
        <div className="flex flex-col space-y-12 md:space-y-16">
          {items.map((item, index) => (
            <div key={index} className="flex flex-col md:flex-row items-start md:items-center justify-between group">

              {/* Text Content */}
              <div className="w-full md:w-[45%] lg:w-[35%] mb-6 md:mb-0">
                <h3 className="text-[#131b11] text-[17px] md:text-[19px] font-sans font-medium mb-3 md:mb-4 hover:underline underline-offset-4">
                  <Link href={`/collections`}>
                    {item.title}
                  </Link>
                </h3>
                <p className="text-[#131b11]/80 text-[12px] md:text-[13px] leading-[1.8] max-w-[420px] font-medium">
                  {item.description}
                </p>
              </div>

              {/* Image Container */}
              <div className="w-full md:w-[50%] lg:w-[55%] flex justify-end">
                <div className="relative aspect-[21/7] w-full bg-[#828a65] group-hover:bg-[#7b835e] transition-colors duration-500 overflow-hidden shadow-sm">
                  {/* USER: Replace the div below with your next/image */}
                  <div className="absolute inset-0 flex items-center justify-center text-[#3c422c] text-sm font-medium">
                    {item.imagePlaceholder}
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
