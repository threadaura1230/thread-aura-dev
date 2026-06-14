import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Collection from "@/models/products/collections";

export const dynamic = "force-dynamic";

// Helper to generate a URL-friendly slug
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-") // replace spaces and non-alphanumeric characters with hyphens
    .replace(/(^-|-$)+/g, "");  // trim leading/trailing hyphens
}

// GET /api/manage-products/category - Public list of active/all collections
export async function GET() {
  try {
    await dbConnect();
    const collections = await Collection.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, collections });
  } catch (error) {
    console.error("GET collections error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

// POST /api/manage-products/category - Create a new collection (admin restricted)
export async function POST(request: Request) {
  try {
    const admin = await isAuthenticated();
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { name, description, image, isActive } = await request.json();
    if (!name) {
      return NextResponse.json({ success: false, error: "Name is required" }, { status: 400 });
    }

    await dbConnect();
    
    // Auto-generate unique slug
    let slug = slugify(name);
    let existing = await Collection.findOne({ slug });
    let counter = 1;
    while (existing) {
      slug = `${slugify(name)}-${counter}`;
      existing = await Collection.findOne({ slug });
      counter++;
    }

    const newCollection = await Collection.create({
      name,
      slug,
      description: description || "",
      image: image || "",
      isActive: isActive !== undefined ? isActive : true,
    });

    return NextResponse.json({ success: true, collection: newCollection });
  } catch (error: any) {
    console.error("POST collection error:", error);
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: "A collection with this name already exists" },
        { status: 400 }
      );
    }
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
