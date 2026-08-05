import dbConnect from "@/lib/db";
import Collection from "@/models/products/collections";
import Product from "@/models/products/products";
import Link from "next/link";
import { Fraunces, Manrope, Space_Grotesk } from "next/font/google";
import { ArrowUpRight, Circle } from "lucide-react";

/**
 * Type system
 * — display: Fraunces, an editorial serif with real optical weight, used for
 *   headlines and the italic "chapter" numerals. Set with restraint.
 * — body: Manrope, a clean geometric sans for anything the eye reads at length.
 * — label: Space Grotesk, tracked out in caps for eyebrows/tags — gives the
 *   craft-tag, measured-thread feel without leaning on the display face.
 *
 * Ideally these live in app/layout.tsx and get applied to <html> once, so every
 * page shares them. Left here so the file is drop-in runnable on its own.
 */
const display = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
});

const body = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
});

const label = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-label",
});

import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "Our Collections",
  description: "Explore our curated collections of handcrafted thread bangles. Each collection is carefully designed and masterfully woven for timeless elegance.",
});


type CollectionVM = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  productCount: number;
};

export default async function CollectionsPage() {
  await dbConnect();

  const dbCollections = await Collection.find({ isActive: true }).sort({
    createdAt: -1,
  });

  const collections: CollectionVM[] = await Promise.all(
    dbCollections.map(async (col: any) => {
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
    <div
      className={`${display.variable} ${body.variable} ${label.variable} relative min-h-screen overflow-hidden bg-[#F1EFE7]`}
      style={{ fontFamily: "var(--font-body)" }}
    >
      {/* Ambient wash — quiet, not the whole idea */}
      <div className="pointer-events-none absolute -right-[10%] top-[-8%] h-[42vw] w-[42vw] rounded-full bg-[#0F3A2A]/[0.06] blur-[90px]" />
      <div className="pointer-events-none absolute -left-[8%] bottom-[8%] h-[36vw] w-[36vw] rounded-full bg-[#B13D33]/[0.04] blur-[110px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-40 pt-16 sm:px-6 lg:px-16">
        {/* Breadcrumb */}
        <nav
          className="mb-20 flex items-center text-[10px] font-semibold uppercase tracking-[0.2em] text-[#0F3A2A]/50"
          style={{ fontFamily: "var(--font-label)" }}
        >
          <Link href="/" className="transition-colors hover:text-[#0F3A2A]">
            Home
          </Link>
          <span className="mx-3 text-[#0F3A2A]/25">—</span>
          <span className="text-[#0F3A2A]">Collections</span>
        </nav>

        <Hero />

        {/* Collections — a continuous thread runs through them */}
        {collections.length > 0 ? (
          <div className="mt-8">
            {collections.map((col, index) => (
              <Row key={col.id} col={col} index={index} total={collections.length} />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </div>

      {/* Reduced-motion-aware keyframes for the hero thread */}
      <style>{`
        @keyframes draw-thread {
          from { stroke-dashoffset: 340; }
          to { stroke-dashoffset: 0; }
        }
        .thread-draw {
          stroke-dasharray: 340;
          stroke-dashoffset: 340;
          animation: draw-thread 2.2s ease-out 0.2s forwards;
        }
        @media (prefers-reduced-motion: reduce) {
          .thread-draw {
            animation: none;
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </div>
  );
}

function Hero() {
  return (
    <header className="mb-28 grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.3fr_1fr] lg:gap-8">
      <div className="max-w-2xl">
        <span
          className="mb-6 inline-block text-[10px] font-semibold uppercase tracking-[0.3em] text-[#B13D33]"
          style={{ fontFamily: "var(--font-label)" }}
        >
          Handwoven, one strand at a time
        </span>
        <h1
          className="text-[44px] font-medium leading-[1.02] tracking-tight text-[#151510] sm:text-[58px] md:text-[72px]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Every bangle
          <br />
          starts as a{" "}
          <span className="italic font-normal text-[#0F3A2A]">single thread.</span>
        </h1>
        <p className="mt-8 max-w-lg text-[15px] font-light leading-relaxed text-[#151510]/70 sm:text-[16px]">
          Below are the collections that thread runs through — each one a
          different hand, a different tension, a different reason to tie a
          knot. Follow the line down the page the way we follow it on the
          loom.
        </p>
      </div>

      {/* Brand logo design in place of thread knot */}
      <div className="hidden justify-self-end lg:block" aria-hidden="true">
        <div className="relative w-64 h-64 rounded-full overflow-hidden flex-shrink-0 bg-[#e7e2d8]/40 border border-[#0f3a2a]/10 p-4 flex items-center justify-center shadow-[inset_0_2px_8px_rgba(15,58,42,0.05)]">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" className="w-full h-full drop-shadow-sm">
            <circle cx="44" cy="71" r="34" fill="none" stroke="#0f3a2a" strokeWidth="3" />
            <circle cx="76" cy="71" r="34" fill="none" stroke="#d4af37" strokeWidth="3" />
            <circle cx="60" cy="49" r="34" fill="none" stroke="#134a31" strokeWidth="3" />
          </svg>
        </div>
      </div>
    </header>
  );
}

function Row({
  col,
  index,
  total,
}: {
  col: CollectionVM;
  index: number;
  total: number;
}) {
  const isEven = index % 2 === 0;
  const strand = String(index + 1).padStart(2, "0");
  const isLast = index === total - 1;

  return (
    <div className="relative lg:grid lg:grid-cols-[1fr_64px_1fr] lg:gap-x-14">
      {/* Left slot */}
      <div className="lg:flex lg:items-center lg:justify-end">
        {isEven ? (
          <CollectionCard col={col} index={index} strand={strand} />
        ) : (
          <GhostNumeral strand={strand} />
        )}
      </div>

      {/* Spine */}
      <div className="hidden lg:flex lg:flex-col lg:items-center">
        <div
          className={`w-px flex-1 bg-gradient-to-b from-transparent to-[#B13D33]/35 ${index === 0 ? "opacity-0" : ""
            }`}
        />
        <Circle
          className="my-1 h-2.5 w-2.5 shrink-0 fill-[#B13D33] text-[#B13D33]"
          strokeWidth={0}
        />
        <div
          className={`w-px flex-1 bg-gradient-to-b from-[#B13D33]/35 to-transparent ${isLast ? "opacity-0" : ""
            }`}
        />
      </div>

      {/* Right slot */}
      <div className="lg:flex lg:items-center lg:justify-start">
        {!isEven ? (
          <CollectionCard col={col} index={index} strand={strand} />
        ) : (
          <GhostNumeral strand={strand} />
        )}
      </div>
    </div>
  );
}

function GhostNumeral({ strand }: { strand: string }) {
  return (
    <span
      className="hidden select-none text-[130px] italic leading-none text-[#0F3A2A]/[0.045] xl:block"
      style={{ fontFamily: "var(--font-display)" }}
      aria-hidden="true"
    >
      {strand}
    </span>
  );
}

function CollectionCard({
  col,
  index,
  strand,
}: {
  col: CollectionVM;
  index: number;
  strand: string;
}) {
  return (
    <article className="group w-full py-10 first:pt-0 lg:py-14">
      <div className="mb-5 flex items-center gap-3">
        <span
          className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#B13D33]"
          style={{ fontFamily: "var(--font-label)" }}
        >
          Strand {strand}
        </span>
        <span className="h-px flex-1 bg-[#0F3A2A]/10" />
      </div>

      <Link
        href={`/collections/${col.slug}`}
        className="relative block aspect-[16/11] w-full overflow-hidden rounded-sm border border-[#0F3A2A]/10 bg-[#e7e2d8] shadow-[0_18px_40px_rgba(15,58,42,0.08)] transition-all duration-500 hover:shadow-[0_24px_55px_rgba(15,58,42,0.14)]"
      >
        {col.image ? (
          <img
            src={col.image}
            alt={col.name}
            className="h-full w-full object-cover transition-transform duration-[1.8s] ease-out group-hover:scale-[1.06]"
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center bg-[#0F3A2A]/[0.06] text-lg italic text-[#0F3A2A]/40"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {col.name}
          </div>
        )}

        {/* corner marks — a woven selvage edge, not a badge */}
        <span className="absolute left-4 top-4 h-4 w-4 border-l-2 border-t-2 border-white/70" />
        <span className="absolute bottom-4 right-4 h-4 w-4 border-b-2 border-r-2 border-white/70" />

        <div
          className="absolute bottom-4 left-4 rounded-sm bg-[#151510]/70 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/90 backdrop-blur-sm"
          style={{ fontFamily: "var(--font-label)" }}
        >
          {col.productCount} {col.productCount === 1 ? "design" : "designs"}
        </div>
      </Link>

      <div className="mt-6 max-w-md">
        <h3
          className="text-[28px] leading-tight text-[#151510] sm:text-[32px]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          <Link
            href={`/collections/${col.slug}`}
            className="transition-colors hover:text-[#0F3A2A]"
          >
            {col.name}
          </Link>
        </h3>

        <p className="mt-3 text-[14px] font-light leading-relaxed text-[#151510]/65">
          {col.description ||
            `A close look at ${col.name} — how the color was chosen, how the knot holds, and why it wears the way it does.`}
        </p>

        <Link
          href={`/collections/${col.slug}`}
          className="group/btn mt-5 inline-flex items-center text-[11px] font-semibold uppercase tracking-[0.2em] text-[#0F3A2A]"
          style={{ fontFamily: "var(--font-label)" }}
        >
          View the collection
          <ArrowUpRight className="ml-1.5 h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
        </Link>
      </div>
    </article>
  );
}

function EmptyState() {
  return (
    <div className="mx-auto max-w-xl rounded-sm border border-[#0F3A2A]/10 bg-white/30 py-24 text-center backdrop-blur-sm">
      <h3
        className="text-[24px] text-[#151510]"
        style={{ fontFamily: "var(--font-display)" }}
      >
        No strand is on the loom yet.
      </h3>
      <p className="mx-auto mt-3 max-w-sm text-sm font-light text-[#151510]/60">
        We add a collection once it's fully woven, not before. Check back
        shortly, or browse everything we've already finished.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-sm bg-[#0F3A2A] px-8 py-3.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-white transition-colors hover:bg-[#134a31]"
        style={{ fontFamily: "var(--font-label)" }}
      >
        Back to home
      </Link>
    </div>
  );
}