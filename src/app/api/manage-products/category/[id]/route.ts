import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Collection from "@/models/products/collections";
import SubCollection from "@/models/products/subcollection";
import Product from "@/models/products/products";

// Helper to generate a URL-friendly slug
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

// PUT /api/manage-products/category/[id] - Update collection (admin restricted)
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await isAuthenticated();
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { name, description, image, isActive } = await request.json();

    await dbConnect();
    const collection = await Collection.findById(id);

    if (!collection) {
      return NextResponse.json({ success: false, error: "Collection not found" }, { status: 404 });
    }

    // If name is changing, auto-update slug too
    if (name && name !== collection.name) {
      collection.name = name;
      let slug = slugify(name);
      let existing = await Collection.findOne({ slug, _id: { $ne: id } });
      let counter = 1;
      while (existing) {
        slug = `${slugify(name)}-${counter}`;
        existing = await Collection.findOne({ slug, _id: { $ne: id } });
        counter++;
      }
      collection.slug = slug;
    }

    if (description !== undefined) collection.description = description;
    if (image !== undefined) collection.image = image;
    if (isActive !== undefined) collection.isActive = isActive;

    await collection.save();

    return NextResponse.json({ success: true, collection });
  } catch (error: any) {
    console.error("PUT collection error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

// DELETE /api/manage-products/category/[id] - Delete collection with relationship checks (admin restricted)
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await isAuthenticated();
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    await dbConnect();

    // Check relationship integrity
    const subColCount = await SubCollection.countDocuments({ collection: id });
    const productCount = await Product.countDocuments({ collection: id });

    if (subColCount > 0 || productCount > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Cannot delete collection. It contains ${subColCount} sub-collection(s) and ${productCount} product(s). Please delete or reassign them first.`,
        },
        { status: 400 }
      );
    }

    const deleted = await Collection.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: "Collection not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Collection deleted successfully" });
  } catch (error) {
    console.error("DELETE collection error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
