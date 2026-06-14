import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import dbConnect from "@/lib/db";
import SubCollection from "@/models/products/subcollection";
import Collection from "@/models/products/collections";

export const dynamic = "force-dynamic";

// Helper to generate a URL-friendly slug
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

// GET /api/manage-products/subcat - List all sub-collections (supports filtering by collection query param)
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const collectionId = url.searchParams.get("collection");

    await dbConnect();
    
    const filter: any = {};
    if (collectionId) {
      filter.collection = collectionId;
    }

    const subCollections = await SubCollection.find(filter)
      .populate("collection", "name")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, subCollections });
  } catch (error) {
    console.error("GET subcollections error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

// POST /api/manage-products/subcat - Create a new sub-collection (admin restricted)
export async function POST(request: Request) {
  try {
    const admin = await isAuthenticated();
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { name, description, collection, image, isActive } = await request.json();
    if (!name || !collection) {
      return NextResponse.json(
        { success: false, error: "Name and parent Collection are required" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Verify parent collection exists
    const parentCollection = await Collection.findById(collection);
    if (!parentCollection) {
      return NextResponse.json({ success: false, error: "Parent Collection not found" }, { status: 404 });
    }

    // Auto-generate unique slug
    let slug = slugify(name);
    let existing = await SubCollection.findOne({ slug });
    let counter = 1;
    while (existing) {
      slug = `${slugify(name)}-${counter}`;
      existing = await SubCollection.findOne({ slug });
      counter++;
    }

    const newSubCollection = await SubCollection.create({
      name,
      slug,
      description: description || "",
      collection,
      image: image || "",
      isActive: isActive !== undefined ? isActive : true,
    });

    return NextResponse.json({ success: true, subCollection: newSubCollection });
  } catch (error: any) {
    console.error("POST subcollection error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
