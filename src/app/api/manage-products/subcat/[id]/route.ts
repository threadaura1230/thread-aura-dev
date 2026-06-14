import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import dbConnect from "@/lib/db";
import SubCollection from "@/models/products/subcollection";
import Collection from "@/models/products/collections";
import Product from "@/models/products/products";

// Helper to generate a URL-friendly slug
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

// PUT /api/manage-products/subcat/[id] - Update sub-collection (admin restricted)
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
    const { name, description, collection, image, isActive } = await request.json();

    await dbConnect();
    const subCollection = await SubCollection.findById(id);

    if (!subCollection) {
      return NextResponse.json({ success: false, error: "Sub-Collection not found" }, { status: 404 });
    }

    // Verify parent collection exists if changed
    if (collection && collection !== subCollection.collection.toString()) {
      const parentCol = await Collection.findById(collection);
      if (!parentCol) {
        return NextResponse.json({ success: false, error: "Parent Collection not found" }, { status: 404 });
      }
      subCollection.collection = collection;
    }

    // If name is changing, auto-update slug too
    if (name && name !== subCollection.name) {
      subCollection.name = name;
      let slug = slugify(name);
      let existing = await SubCollection.findOne({ slug, _id: { $ne: id } });
      let counter = 1;
      while (existing) {
        slug = `${slugify(name)}-${counter}`;
        existing = await SubCollection.findOne({ slug, _id: { $ne: id } });
        counter++;
      }
      subCollection.slug = slug;
    }

    if (description !== undefined) subCollection.description = description;
    if (image !== undefined) subCollection.image = image;
    if (isActive !== undefined) subCollection.isActive = isActive;

    await subCollection.save();

    return NextResponse.json({ success: true, subCollection });
  } catch (error: any) {
    console.error("PUT subcollection error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

// DELETE /api/manage-products/subcat/[id] - Delete sub-collection with safety checks (admin restricted)
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
    const productCount = await Product.countDocuments({ subCollection: id });
    if (productCount > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Cannot delete sub-collection. It is linked to ${productCount} active product(s). Please delete or reassign them first.`,
        },
        { status: 400 }
      );
    }

    const deleted = await SubCollection.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: "Sub-Collection not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Sub-Collection deleted successfully" });
  } catch (error) {
    console.error("DELETE subcollection error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
