import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Product from "@/models/products/products";
import Collection from "@/models/products/collections";
import SubCollection from "@/models/products/subcollection";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const q = url.searchParams.get("q") || "";

    if (!q.trim()) {
      return NextResponse.json({
        success: true,
        products: [],
        collections: [],
        subCollections: []
      });
    }

    await dbConnect();

    // 1. Find matching Collections (Categories)
    const collections = await Collection.find({
      isActive: true,
      $or: [
        { name: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } }
      ]
    }).limit(5);

    // 2. Find matching SubCollections (Subcategories)
    const subCollections = await SubCollection.find({
      isActive: true,
      $or: [
        { name: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } }
      ]
    }).populate("collection", "name slug").limit(5);

    // 3. Find matching Products (Products, Materials, Prices)
    const productQuery: any = { isActive: true };

    // Price query logic (e.g. "under 500", "below 1000", "500")
    const numericMatch = q.match(/\d+/);
    if (numericMatch) {
      const priceLimit = parseInt(numericMatch[0], 10);
      const isBelow = /under|below|less\s+than|max|maximum|</i.test(q);
      const isAbove = /over|above|greater\s+than|min|minimum|>/i.test(q);

      if (isBelow || (!isBelow && !isAbove)) {
        // e.g. "under 500" or just "500"
        productQuery.price = { $lte: priceLimit };
      } else if (isAbove) {
        // e.g. "above 500"
        productQuery.price = { $gte: priceLimit };
      }
    }

    // Text search query details (name, description, material, tag)
    // If the text query is just a price, search for all products matching the price limit.
    // If it contains other words, combine price query and text query
    const cleanSearchText = q.replace(/\d+/g, "").replace(/under|below|less\s+than|max|maximum|over|above|greater\s+than|[<>]/gi, "").trim();

    if (cleanSearchText) {
      // Find matching collections/subcollections to search products by their references too!
      const matchingColIds = await Collection.find({ name: { $regex: cleanSearchText, $options: "i" } }).select("_id");
      const matchingSubColIds = await SubCollection.find({ name: { $regex: cleanSearchText, $options: "i" } }).select("_id");

      productQuery.$or = [
        { name: { $regex: cleanSearchText, $options: "i" } },
        { description: { $regex: cleanSearchText, $options: "i" } },
        { material: { $regex: cleanSearchText, $options: "i" } },
        { tag: { $regex: cleanSearchText, $options: "i" } },
        { collection: { $in: matchingColIds } },
        { subCollection: { $in: matchingSubColIds } }
      ];
    }

    const products = await Product.find(productQuery)
      .populate("collection", "name slug")
      .populate("subCollection", "name slug")
      .limit(8)
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      products,
      collections,
      subCollections
    });

  } catch (error: any) {
    console.error("Search API error:", error);
    return NextResponse.json({ success: false, error: "Failed to perform search" }, { status: 500 });
  }
}
