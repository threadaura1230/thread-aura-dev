import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Product from "@/models/products/products";
import Collection from "@/models/products/collections";
import SubCollection from "@/models/products/subcollection";

export const dynamic = "force-dynamic";

// Helper to generate a URL-friendly slug
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

// GET /api/manage-products/products - List products with filters
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const collection = url.searchParams.get("collection");
    const subCollection = url.searchParams.get("subCollection");
    const search = url.searchParams.get("search");
    const limit = parseInt(url.searchParams.get("limit") || "100");

    await dbConnect();

    const query: any = {};

    if (collection) {
      // Check if it's an ObjectId or slug
      if (collection.match(/^[0-9a-fA-F]{24}$/)) {
        query.collection = collection;
      } else {
        const foundCol = await Collection.findOne({ slug: collection });
        if (foundCol) {
          query.collection = foundCol._id;
        } else {
          query.collection = null; // No match found
        }
      }
    }

    if (subCollection) {
      if (subCollection.match(/^[0-9a-fA-F]{24}$/)) {
        query.subCollection = subCollection;
      } else {
        const foundSubCol = await SubCollection.findOne({ slug: subCollection });
        if (foundSubCol) {
          query.subCollection = foundSubCol._id;
        } else {
          query.subCollection = null;
        }
      }
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { material: { $regex: search, $options: "i" } },
      ];
    }

    const products = await Product.find(query)
      .populate("collection", "name slug")
      .populate("subCollection", "name slug")
      .limit(limit)
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error("GET products error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

// POST /api/manage-products/products - Create a new product (admin restricted)
export async function POST(request: Request) {
  try {
    const admin = await isAuthenticated();
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const {
      name,
      description,
      price,
      images,
      collection,
      subCollection,
      material,
      tag,
      bgColor,
      sizes,
      details,
      isActive,
    } = await request.json();

    if (!name || !price || !collection || !subCollection) {
      return NextResponse.json(
        { success: false, error: "Name, price, collection, and sub-collection are required" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Verify parent relationships
    const colExists = await Collection.findById(collection);
    const subColExists = await SubCollection.findById(subCollection);

    if (!colExists || !subColExists) {
      return NextResponse.json(
        { success: false, error: "Invalid collection or sub-collection ID" },
        { status: 400 }
      );
    }

    // Auto-generate unique slug
    let slug = slugify(name);
    let existing = await Product.findOne({ slug });
    let counter = 1;
    while (existing) {
      slug = `${slugify(name)}-${counter}`;
      existing = await Product.findOne({ slug });
      counter++;
    }

    const newProduct = await Product.create({
      name,
      slug,
      description: description || "",
      price: Number(price),
      images: images || [],
      collection,
      subCollection,
      material: material || "",
      tag: tag || "",
      bgColor: bgColor || "#1f332a",
      sizes: sizes || ["2.4", "2.6", "2.8"],
      details: details || [],
      isActive: isActive !== undefined ? isActive : true,
    });

    return NextResponse.json({ success: true, product: newProduct });
  } catch (error) {
    console.error("POST product error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
