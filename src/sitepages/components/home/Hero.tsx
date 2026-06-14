import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#F1EFE7]">
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0 flex justify-end">
        {/* We position the image to the right */}
        <div className="relative w-full md:w-[70%] lg:w-[65%] h-full">
          <Image
            src="/hero-bg.png"
            alt="Hand woven silk bangles"
            fill
            className="object-cover object-left lg:object-center"
            priority
          />
          {/* Gradient Overlay to blend the image seamlessly into the left side background color */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#F1EFE7] via-[#F1EFE7]/80 to-transparent w-2/3" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#F1EFE7] via-[#F1EFE7]/40 to-transparent lg:hidden" />
          
          {/* Soft gradient from top and bottom to blend edges if necessary */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#F1EFE7] to-transparent" />
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#F1EFE7]/30 to-transparent" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-8 w-full flex">
        <div className="max-w-[540px] pt-32 pb-20">
          <p className="text-[10px] font-bold tracking-[0.15em] text-[#134A31] mb-5 uppercase">
            Artisanal, Hand-Woven Luxury
          </p>
          <h2 className="font-serif text-[42px] md:text-[56px] leading-[1.1] text-slate-900 mb-6 -ml-0.5">
            The Rhythmic Art of <span className="text-[#134A31]">Woven Light</span>
          </h2>
          <p className="text-slate-800 text-[15px] leading-relaxed mb-10 max-w-[420px]">
            Discover our signature collection of bangles, meticulously hand-wrapped with the finest Mulberry silk and Giza cotton threads. A legacy of craftsmanship in every circle.
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href="/collections" className="inline-block px-8 py-3.5 bg-[#073623] text-white text-[13px] font-medium hover:bg-[#0c4a31] transition-all rounded-[4px] tracking-wide w-full sm:w-auto text-center shadow-sm">
              Shop the Collection
            </Link>
            <Link href="#about" className="inline-block px-8 py-3.5 bg-transparent text-[#073623] text-[13px] font-medium border border-[#073623] hover:bg-[#073623]/5 transition-all rounded-[4px] tracking-wide w-full sm:w-auto text-center">
              Our Story
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
