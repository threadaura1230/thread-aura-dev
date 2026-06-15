import { NextResponse } from "next/server";
import { isUserAuthenticated } from "@/lib/userAuth";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Product from "@/models/products/products";

export const dynamic = "force-dynamic";

// GET /api/user/cart - Retrieve database-synced cart items for authenticated user
export async function GET() {
  try {
    const payload = await isUserAuthenticated();
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findById(payload.id)
      .select("cart")
      .populate({
        path: "cart.product",
        populate: [
          { path: "collection" },
          { path: "subCollection" }
        ]
      });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const cartItems = (user.cart || [])
      .filter((item: any) => item.product && item.product.isActive)
      .map((item: any) => {
        const p = item.product;
        return {
          productId: p._id.toString(),
          name: p.name,
          price: p.price,
          size: item.size,
          quantity: item.quantity,
          image: p.images?.[0] || "",
          bgColor: p.bgColor || "#1f332a",
          slug: p.slug,
          categorySlug: p.collection && typeof p.collection === "object" ? (p.collection as any).slug : "collections",
          subCollectionSlug: p.subCollection && typeof p.subCollection === "object" ? (p.subCollection as any).slug : "general",
        };
      });

    return NextResponse.json({ cart: cartItems });

  } catch (error) {
    console.error("GET cart error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// POST /api/user/cart - Save/Synchronize cart items to database
export async function POST(request: Request) {
  try {
    const payload = await isUserAuthenticated();
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { cart } = await request.json();
    if (!Array.isArray(cart)) {
      return NextResponse.json({ error: "Invalid cart payload" }, { status: 400 });
    }

    await dbConnect();

    // Map into correct schema structure
    const dbCartItems = cart.map((item: any) => ({
      product: item.productId,
      size: item.size,
      quantity: item.quantity
    }));

    const user = await User.findByIdAndUpdate(
      payload.id,
      { $set: { cart: dbCartItems } },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("POST cart error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
