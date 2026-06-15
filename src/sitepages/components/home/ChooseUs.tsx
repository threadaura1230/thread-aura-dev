import Image from "next/image";

export default function ChooseUs() {
  return (
    <section id="about" className="relative w-full min-h-[600px] lg:min-h-[800px] bg-[#071411] overflow-hidden flex flex-col justify-center py-24 px-6">
      
      {/* Scattered Floating Image Placeholders */}
      {/* Note: I've added a subtle hover effect to make them feel interactive even as placeholders */}

      {/* Image 1: Top Left (Portrait) */}
      <div className="hidden md:block absolute top-[10%] left-[8%] lg:left-[12%] w-[180px] lg:w-[220px] aspect-[4/5] bg-[#12241e] shadow-2xl group transition-transform duration-500 hover:scale-105 hover:z-20">
        <Image
          src="/choose-1.png"
          alt="Handcrafted green and gold silk thread bangles"
          fill
          sizes="(max-width: 1024px) 180px, 220px"
          className="object-cover"
          priority
        />
      </div>

      {/* Image 2: Top Right (Small Square) */}
      <div className="hidden lg:block absolute top-[8%] right-[15%] w-[120px] aspect-square bg-[#12241e] shadow-2xl group transition-transform duration-500 hover:scale-105 hover:z-20">
        <Image
          src="/choose-2.png"
          alt="Crimson red silk thread bangle"
          fill
          sizes="120px"
          className="object-cover"
        />
      </div>

      {/* Image 3: Bottom Left/Center (Landscape) */}
      <div className="hidden md:block absolute bottom-[10%] left-[25%] lg:left-[30%] w-[240px] lg:w-[300px] aspect-[3/2] bg-[#12241e] shadow-2xl group transition-transform duration-500 hover:scale-105 hover:z-20">
        <Image
          src="/choose-3.png"
          alt="Vibrant pastel silk thread bangles collection"
          fill
          sizes="(max-width: 1024px) 240px, 300px"
          className="object-cover"
        />
      </div>

      {/* Image 4: Middle Right (Portrait) */}
      <div className="hidden md:block absolute top-[55%] -translate-y-1/2 right-[8%] lg:right-[15%] w-[160px] lg:w-[200px] aspect-[3/4] bg-[#12241e] shadow-2xl group transition-transform duration-500 hover:scale-105 hover:z-20 mt-10">
        <Image
          src="/choose-4.png"
          alt="Royal blue and gold silk thread bangles"
          fill
          sizes="(max-width: 1024px) 160px, 200px"
          className="object-cover"
        />
      </div>

      {/* Central Content */}
      <div className="relative z-10 text-center max-w-[480px] mx-auto w-full">
        <h2 className="text-[#fdfbf7] text-[28px] md:text-[34px] font-serif mb-6 tracking-wide">
          Why Choose Us
        </h2>
        <p className="text-[#a4b5ae] text-[13px] md:text-[14px] leading-relaxed md:leading-[1.8] font-light">
          At Thread-aura, we are dedicated to providing you with the purest and most beautiful silk threads. Our products are carefully selected and sourced for their exceptional quality and vibrant properties, ensuring you experience the true legacy of our craftsmanship.
        </p>
      </div>

      {/* Mobile-only simple grid (shown when screen is too small for floating images) */}
      <div className="md:hidden grid grid-cols-2 gap-4 mt-16 relative z-10 max-w-sm mx-auto w-full">
        <div className="relative w-full aspect-[4/5] bg-[#12241e]">
          <Image
            src="/choose-1.png"
            alt="Handcrafted green and gold silk thread bangles"
            fill
            sizes="50vw"
            className="object-cover"
          />
        </div>
        <div className="relative w-full aspect-square bg-[#12241e] mt-8">
          <Image
            src="/choose-2.png"
            alt="Crimson red silk thread bangle"
            fill
            sizes="50vw"
            className="object-cover"
          />
        </div>
        <div className="relative w-full aspect-[3/2] bg-[#12241e] col-span-2">
          <Image
            src="/choose-3.png"
            alt="Vibrant pastel silk thread bangles collection"
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </div>

    </section>
  );
}
