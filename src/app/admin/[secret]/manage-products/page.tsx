"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Box, Layers, FolderTree, ArrowRight, Sparkles } from "lucide-react";

export default function ManageProductsDashboard() {
  const params = useParams();
  const secret = (params.secret as string) || "";
  const [counts, setCounts] = useState({
    products: 0,
    collections: 0,
    subCollections: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCounts() {
      try {
        const [prodRes, catRes, subRes] = await Promise.all([
          fetch("/api/manage-products/products"),
          fetch("/api/manage-products/category"),
          fetch("/api/manage-products/subcat"),
        ]);

        const prodData = await prodRes.json();
        const catData = await catRes.json();
        const subData = await subRes.json();

        setCounts({
          products: prodData.products?.length || 0,
          collections: catData.collections?.length || 0,
          subCollections: subData.subCollections?.length || 0,
        });
      } catch (err) {
        console.error("Failed to load counts:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCounts();
  }, []);

  const cards = [
    {
      name: "Products Catalog",
      description: "Manage individual items, price values, size options, custom descriptions, and list details.",
      count: counts.products,
      path: `/admin/${secret}/manage-products/products`,
      icon: Box,
      color: "bg-[#073623] text-white",
      btnText: "Manage Products",
    },
    {
      name: "Collections",
      description: "Add, edit, or delete main product categories (e.g. Bangles, Necklaces).",
      count: counts.collections,
      path: `/admin/${secret}/manage-products/collections`,
      icon: Layers,
      color: "bg-[#8b926d] text-white",
      btnText: "Manage Collections",
    },
    {
      name: "Sub-Collections",
      description: "Add, edit, or delete nested category variants (e.g. Silk, Velvet, Cotton).",
      count: counts.subCollections,
      path: `/admin/${secret}/manage-products/sub-collections`,
      icon: FolderTree,
      color: "bg-[#883d11] text-white",
      btnText: "Manage Sub-Collections",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Title block */}
      <div className="relative overflow-hidden rounded-2xl border border-black/[0.06] bg-white p-8 shadow-sm">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#073623]/[0.03] rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <h1 className="font-serif text-[28px] md:text-[32px] font-medium text-[#0f3a2a] tracking-tight flex items-center gap-3">
            Product Management
            <Sparkles className="h-6 w-6 text-[#8b926d]" />
          </h1>
          <p className="text-[13px] text-slate-500 max-w-xl leading-relaxed">
            Organize your catalog by dividing items into collections and sub-collections. Update listings with tags, size charts, descriptions, and premium images.
          </p>
        </div>
      </div>

      {/* Grid of Navigation Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.name}
              className="flex flex-col justify-between rounded-xl border border-black/[0.06] bg-white p-6 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.color} shadow-sm`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  {loading ? (
                    <div className="h-6 w-12 bg-slate-100 animate-pulse rounded-full" />
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-[#073623]/[0.06] border border-[#073623]/10 text-xs font-bold text-[#073623]">
                      {card.count} items
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <h3 className="font-serif text-[18px] font-semibold text-slate-800">
                    {card.name}
                  </h3>
                  <p className="text-[12px] leading-relaxed text-slate-500">
                    {card.description}
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-black/[0.04]">
                <Link
                  href={card.path}
                  className="flex items-center justify-between w-full text-[12px] font-semibold text-[#073623] hover:text-[#0c4a31] transition-colors group"
                >
                  <span>{card.btnText}</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
