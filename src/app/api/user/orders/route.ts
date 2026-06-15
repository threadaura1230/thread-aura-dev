import { NextResponse } from "next/server";
import { isUserAuthenticated } from "@/lib/userAuth";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const payload = await isUserAuthenticated();
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Fetch user's orders sorted by newest first
    const orders = await Order.find({ user: payload.id }).sort({ createdAt: -1 });

    return NextResponse.json({ orders });

  } catch (error: any) {
    console.error("GET user orders error:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
