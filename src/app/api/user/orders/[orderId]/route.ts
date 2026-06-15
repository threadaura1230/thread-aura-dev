import { NextResponse } from "next/server";
import { isUserAuthenticated } from "@/lib/userAuth";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import mongoose from "mongoose";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{
    orderId: string;
  }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const payload = await isUserAuthenticated();
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderId } = await params;
    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    await dbConnect();

    const isMongoId = mongoose.Types.ObjectId.isValid(orderId);
    const order = isMongoId
      ? await Order.findById(orderId).populate("items.product")
      : await Order.findOne({ orderNumber: orderId }).populate("items.product");

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Verify ownership (or admin status)
    if (order.user.toString() !== payload.id && payload.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized access to order" }, { status: 403 });
    }

    return NextResponse.json({ order });

  } catch (error: any) {
    console.error("GET user order detail error:", error);
    return NextResponse.json(
      { error: "Failed to fetch order details" },
      { status: 500 }
    );
  }
}
