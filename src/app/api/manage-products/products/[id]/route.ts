import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Product from "@/models/products/products";
import Collection from "@/models/products/collections";
import SubCollection from "@/models/products/subcollection";

// Helper to generate a URL-friendly slug
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

// PUT /api/manage-products/products/[id] - Update product (admin restricted)
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
    const body = await request.json();

    await dbConnect();
    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    // Verify parent relationships if changed
    if (body.collection && body.collection !== product.collection.toString()) {
      const colExists = await Collection.findById(body.collection);
      if (!colExists) {
        return NextResponse.json({ success: false, error: "Collection not found" }, { status: 400 });
      }
      product.collection = body.collection;
    }

    if (body.subCollection && body.subCollection !== product.subCollection.toString()) {
      const subColExists = await SubCollection.findById(body.subCollection);
      if (!subColExists) {
        return NextResponse.json({ success: false, error: "Sub-Collection not found" }, { status: 400 });
      }
      product.subCollection = body.subCollection;
    }

    // If name is changing, auto-update slug too
    if (body.name && body.name !== product.name) {
      product.name = body.name;
      let slug = slugify(body.name);
      let existing = await Product.findOne({ slug, _id: { $ne: id } });
      let counter = 1;
      while (existing) {
        slug = `${slugify(body.name)}-${counter}`;
        existing = await Product.findOne({ slug, _id: { $ne: id } });
        counter++;
      }
      product.slug = slug;
    }

    if (body.description !== undefined) product.description = body.description;
    if (body.price !== undefined) product.price = Number(body.price);
    if (body.images !== undefined) product.images = body.images;
    if (body.material !== undefined) product.material = body.material;
    if (body.tag !== undefined) product.tag = body.tag;
    if (body.bgColor !== undefined) product.bgColor = body.bgColor;
    if (body.sizes !== undefined) product.sizes = body.sizes;
    if (body.details !== undefined) product.details = body.details;
    if (body.isActive !== undefined) product.isActive = body.isActive;

    await product.save();

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    console.error("PUT product error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

// DELETE /api/manage-products/products/[id] - Delete product (admin restricted)
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
    const deleted = await Product.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error("DELETE product error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
