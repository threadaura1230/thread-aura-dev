import { ArrowRight, Shield, Heart, Droplet, Truck, Package, ShieldCheck, Gift } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-[#F5F3EB]">
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0 flex justify-end">
        <div className="relative w-full md:w-[70%] lg:w-[65%] h-full">
          <Image
            src="/hero-bg.png"
            alt="Handcrafted Bracelets"
            fill
            className="object-cover object-center"
            priority
          />
          {/* Gradient Overlay to blend the image seamlessly into the left side background color */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#F5F3EB] via-[#F5F3EB]/70 to-transparent w-2/3" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#F5F3EB] via-[#F5F3EB]/40 to-transparent lg:hidden" />
        </div>
      </div>

      {/* Floating circular badge (New Arrivals) */}
      <Link 
        href="/new-arrivals" 
        className="absolute right-[10%] md:right-[15%] lg:right-[20%] top-[25%] md:top-[30%] z-20 hidden sm:flex flex-col items-center justify-center w-28 h-28 md:w-32 md:h-32 rounded-full bg-[#465448]/95 border-2 border-white/20 text-white shadow-xl hover:shadow-2xl hover:bg-[#3d4a3f] transition-all text-center p-2 group cursor-pointer"
      >
        <span className="text-[10px] uppercase tracking-widest font-semibold text-white/80">New</span>
        <span className="text-[12px] uppercase tracking-wider font-bold mb-1">Arrivals</span>
        <span className="w-8 h-[1px] bg-white/30 my-1"></span>
        <span className="text-[9px] uppercase tracking-widest group-hover:underline">Shop Now</span>
      </Link>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 w-full flex-1 flex items-center pt-28 pb-12">
        <div className="max-w-[550px]">
          <p className="text-[11px] font-bold tracking-[0.2em] text-slate-500 mb-4 uppercase">
            Elegant. Meaningful. You.
          </p>
          <h1 className="font-serif text-[42px] md:text-[58px] leading-[1.08] text-[#1E2522] mb-6 font-normal">
            Timeless Bracelets,<br />
            <span className="font-serif italic text-[#8B6E4E]">Made to Shine</span>
          </h1>
          <p className="text-slate-600 text-[14px] leading-relaxed mb-8 max-w-[420px]">
            Handcrafted with love. Designed to<br />
            elevate every moment of your life.
          </p>

          {/* Action buttons */}
          <div className="flex flex-row items-center gap-4 mb-10">
            <Link 
              href="/collections" 
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#0F2D21] text-white text-[12px] font-bold tracking-widest uppercase rounded hover:bg-[#153e2d] transition-colors"
            >
              Shop Now <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              href="/collections" 
              className="px-6 py-3.5 bg-transparent text-slate-800 text-[12px] font-bold tracking-widest border border-slate-700 rounded hover:bg-slate-800/5 transition-colors uppercase"
            >
              Explore Collections
            </Link>
          </div>

          {/* Features list below buttons */}
          <div className="flex items-center gap-8 pt-2">
            <div className="flex flex-col items-start gap-1.5 max-w-[120px]">
              <div className="w-8 h-8 rounded-full border border-slate-300 flex items-center justify-center text-slate-700">
                <Shield className="w-4 h-4 stroke-[1.5]" />
              </div>
              <span className="text-[10px] font-semibold text-slate-700 leading-tight">Premium Quality Materials</span>
            </div>

            <div className="flex flex-col items-start gap-1.5 max-w-[120px]">
              <div className="w-8 h-8 rounded-full border border-slate-300 flex items-center justify-center text-slate-700">
                <Heart className="w-4 h-4 stroke-[1.5]" />
              </div>
              <span className="text-[10px] font-semibold text-slate-700 leading-tight">Handcrafted With Love</span>
            </div>

            <div className="flex flex-col items-start gap-1.5 max-w-[120px]">
              <div className="w-8 h-8 rounded-full border border-slate-300 flex items-center justify-center text-slate-700">
                <Droplet className="w-4 h-4 stroke-[1.5]" />
              </div>
              <span className="text-[10px] font-semibold text-slate-700 leading-tight">Waterproof & Tarnish Free</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar banner */}
      <div className="relative z-10 w-full bg-[#FAF9F5] border-t border-slate-200/60 py-6 px-6 md:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4 items-center">
          
          {/* Shipping */}
          <div className="flex items-center gap-3 border-r border-slate-200/80 last:border-r-0 md:pr-4">
            <Truck className="w-5 h-5 text-slate-700 stroke-[1.5]" />
            <div>
              <h4 className="text-[10px] font-bold text-slate-800 uppercase tracking-widest">Free Shipping</h4>
              <p className="text-[10px] text-slate-500 mt-0.5">On orders over $50</p>
            </div>
          </div>

          {/* Returns */}
          <div className="flex items-center gap-3 border-r border-slate-200/80 last:border-r-0 md:px-4">
            <Package className="w-5 h-5 text-slate-700 stroke-[1.5]" />
            <div>
              <h4 className="text-[10px] font-bold text-slate-800 uppercase tracking-widest">Easy Returns</h4>
              <p className="text-[10px] text-slate-500 mt-0.5">30-day return policy</p>
            </div>
          </div>

          {/* Payment */}
          <div className="flex items-center gap-3 md:border-r md:border-slate-200/80 last:border-r-0 md:px-4">
            <ShieldCheck className="w-5 h-5 text-slate-700 stroke-[1.5]" />
            <div>
              <h4 className="text-[10px] font-bold text-slate-800 uppercase tracking-widest">Secure Payment</h4>
              <p className="text-[10px] text-slate-500 mt-0.5">100% safe & secure</p>
            </div>
          </div>

          {/* Gift Ready */}
          <div className="flex items-center gap-3 md:px-4">
            <Gift className="w-5 h-5 text-slate-700 stroke-[1.5]" />
            <div>
              <h4 className="text-[10px] font-bold text-slate-800 uppercase tracking-widest">Gift Ready</h4>
              <p className="text-[10px] text-slate-500 mt-0.5">Beautiful packaging</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
