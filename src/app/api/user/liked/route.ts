import { NextResponse } from "next/server";
import { isUserAuthenticated } from "@/lib/userAuth";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Product from "@/models/products/products";

export const dynamic = "force-dynamic";

// GET /api/user/liked - Get full details of all liked products for the authenticated user
export async function GET() {
  try {
    const payload = await isUserAuthenticated();
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findById(payload.id).select("liked");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Filter products from the database by the IDs in the user's liked list
    const liked = user.liked || [];
    const dbProducts = await Product.find({
      _id: { $in: liked },
      isActive: true,
    }).populate("collection");

    const likedProducts = dbProducts.map((p) => ({
      id: p._id.toString(),
      name: p.name,
      price: p.price,
      material: p.material || "",
      tag: p.tag || "",
      bgColor: p.bgColor || "#1f332a",
      images: p.images || [],
    }));

    return NextResponse.json({ liked: likedProducts });

  } catch (error) {
    console.error("GET liked error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// POST /api/user/liked - Toggle a product ID in the user's liked list
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
    const user = await User.findById(payload.id).select("liked");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const liked = user.liked || [];
    const index = liked.indexOf(productId);
    let added = false;
    let updatedLiked = [...liked];

    if (index > -1) {
      // Atomic pull (remove)
      await User.findByIdAndUpdate(payload.id, {
        $pull: { liked: productId }
      });
      updatedLiked = updatedLiked.filter((id) => id !== productId);
    } else {
      // Atomic push (add)
      await User.findByIdAndUpdate(payload.id, {
        $addToSet: { liked: productId }
      });
      updatedLiked.push(productId);
      added = true;
    }

    return NextResponse.json({
      success: true,
      added,
      liked: updatedLiked,
    });
  } catch (error) {
    console.error("POST liked error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
