import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";

export const dynamic = "force-dynamic";

// GET /api/admin/orders - Fetch all orders for admin dashboard
export async function GET() {
  try {
    const admin = await isAuthenticated();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Fetch all orders, populating user details, sorted by newest first
    const orders = await Order.find({})
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    return NextResponse.json({ orders });

  } catch (error: any) {
    console.error("GET admin orders error:", error);
    return NextResponse.json(
      { error: "Failed to fetch admin orders" },
      { status: 500 }
    );
  }
}
