import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import mongoose from "mongoose";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{
    orderId: string;
  }>;
}

// GET /api/admin/orders/[orderId] - Fetch single order details for admin
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const admin = await isAuthenticated();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderId } = await params;
    await dbConnect();

    const isMongoId = mongoose.Types.ObjectId.isValid(orderId);
    const order = isMongoId
      ? await Order.findById(orderId).populate("user", "name email")
      : await Order.findOne({ orderNumber: orderId }).populate("user", "name email");
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ order });

  } catch (error: any) {
    console.error("GET admin order detail error:", error);
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}

// PUT /api/admin/orders/[orderId] - Update order status, payment status, and tracking numbers
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const admin = await isAuthenticated();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderId } = await params;
    const { orderStatus, paymentStatus, trackingNumber } = await request.json();

    await dbConnect();

    const isMongoId = mongoose.Types.ObjectId.isValid(orderId);
    const order = isMongoId
      ? await Order.findById(orderId)
      : await Order.findOne({ orderNumber: orderId });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Capture old status
    const oldStatus = order.orderStatus;
    const oldTracking = order.trackingNumber;

    // Apply updates
    if (orderStatus) order.orderStatus = orderStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    if (trackingNumber !== undefined) order.trackingNumber = trackingNumber;

    // Add automatic timeline log updates if status changed
    if (orderStatus && orderStatus !== oldStatus) {
      let description = `Order status updated to ${orderStatus}.`;

      if (orderStatus === "Processing") {
        description = "Weaving studio: Artisan weaving and custom design validation initiated.";
      } else if (orderStatus === "Shipped") {
        description = `Package dispatched. Transit tracking reference ID: ${trackingNumber || order.trackingNumber || "N/A"}.`;
      } else if (orderStatus === "Delivered") {
        description = "Bangles successfully handed over to client. Delivery complete.";
        order.paymentStatus = "Paid"; // Delivered automatically infers paid
      } else if (orderStatus === "Cancelled") {
        description = "Order was cancelled.";
      }

      order.trackingUpdates.push({
        status: orderStatus,
        description,
        timestamp: new Date(),
      });
    } else if (trackingNumber && trackingNumber !== oldTracking && oldStatus === "Shipped") {
      // Just tracking number updated for shipped order
      order.trackingUpdates.push({
        status: "Shipped",
        description: `Dispatch tracking information updated. New ID: ${trackingNumber}.`,
        timestamp: new Date(),
      });
    }

    await order.save();

    return NextResponse.json({ success: true, order });

  } catch (error: any) {
    console.error("PUT admin order update error:", error);
    return NextResponse.json({ error: error.message || "Failed to update order" }, { status: 500 });
  }
}
