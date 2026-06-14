import { NextResponse } from "next/server";
import { isUserAuthenticated } from "@/lib/userAuth";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Product from "@/models/products/products";

export const dynamic = "force-dynamic";

// GET /api/user/wishlist - Get full details of all wishlist products for the authenticated user
export async function GET() {
  try {
    const payload = await isUserAuthenticated();
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findById(payload.id).select("wishlist");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Filter products from the database by the IDs in the user's wishlist
    const wishlist = user.wishlist || [];
    const dbProducts = await Product.find({
      _id: { $in: wishlist },
      isActive: true,
    }).populate("collection");

    const wishlistProducts = dbProducts.map((p) => ({
      id: p._id.toString(),
      name: p.name,
      price: p.price,
      material: p.material || "",
      tag: p.tag || "",
      bgColor: p.bgColor || "#1f332a",
      images: p.images || [],
    }));

    return NextResponse.json({ wishlist: wishlistProducts });

  } catch (error) {
    console.error("GET wishlist error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// POST /api/user/wishlist - Toggle a product ID in the user's wishlist
export async function POST(request: Request) {
  try {
    const payload = await isUserAuthenticated();
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId } = await request.json();
    if (!productId) {
      return NextResponse.json({ error: "Product ID required" }, { status: 400 });
    }

    await dbConnect();
    const user = await User.findById(payload.id).select("wishlist");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const wishlist = user.wishlist || [];
    const index = wishlist.indexOf(productId);
    let added = false;
    let updatedWishlist = [...wishlist];

    if (index > -1) {
      // Atomic pull (remove)
      await User.findByIdAndUpdate(payload.id, {
        $pull: { wishlist: productId }
      });
      updatedWishlist = updatedWishlist.filter((id) => id !== productId);
    } else {
      // Atomic push (add)
      await User.findByIdAndUpdate(payload.id, {
        $addToSet: { wishlist: productId }
      });
      updatedWishlist.push(productId);
      added = true;
    }

    return NextResponse.json({
      success: true,
      added,
      wishlist: updatedWishlist,
    });
  } catch (error) {
    console.error("POST wishlist error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
