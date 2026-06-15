import { NextResponse } from "next/server";
import { isUserAuthenticated } from "@/lib/userAuth";
import dbConnect from "@/lib/db";
import Product from "@/models/products/products";
import Razorpay from "razorpay";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const payload = await isUserAuthenticated();
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { items } = await request.json();
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart items required" }, { status: 400 });
    }

    await dbConnect();

    // Recalculate price from DB to avoid client-side tampering
    let totalAmount = 0;
    const resolvedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product || !product.isActive) {
        return NextResponse.json({ error: `Product not found or inactive: ${item.name}` }, { status: 400 });
      }
      totalAmount += product.price * item.quantity;
      resolvedItems.push({
        productId: product._id.toString(),
        name: product.name,
        price: product.price,
        size: item.size,
        quantity: item.quantity,
        image: product.images?.[0] || "",
      });
    }

    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // Check if key credentials are placeholder or empty
    const isMockMode =
      !keyId ||
      !keySecret ||
      keyId.includes("placeholder") ||
      keyId.includes("test_YOUR_KEY_ID");

    if (isMockMode) {
      // In development / mock mode, return a dummy Razorpay order details
      console.log("Razorpay credentials not set or mock. Returning mock order details.");
      const mockOrderId = `order_mock_${Math.random().toString(36).substr(2, 9)}`;
      return NextResponse.json({
        success: true,
        orderId: mockOrderId,
        amount: totalAmount * 100, // in paise
        currency: "INR",
        mockMode: true,
      });
    }

    // Initialize Razorpay SDK
    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    // Create Razorpay Order
    const rzpOrder = await razorpay.orders.create({
      amount: totalAmount * 100, // Razorpay works in paise
      currency: "INR",
      receipt: `order_rcpt_${Date.now()}`,
    });

    return NextResponse.json({
      success: true,
      orderId: rzpOrder.id,
      amount: rzpOrder.amount,
      currency: rzpOrder.currency,
      mockMode: false,
    });

  } catch (error: any) {
    console.error("Razorpay order generation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to initiate payment" },
      { status: 500 }
    );
  }
}
