import { NextResponse } from "next/server";
import { isUserAuthenticated } from "@/lib/userAuth";
import dbConnect from "@/lib/db";
import Product from "@/models/products/products";
import Order from "@/models/Order";
import User from "@/models/User";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const payload = await isUserAuthenticated();
    if (!payload) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { shippingDetails, items } = await request.json();

    if (!shippingDetails || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Invalid order details" }, { status: 400 });
    }

    await dbConnect();

    // Compute prices and map order items
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product || !product.isActive) {
        return NextResponse.json(
          { error: `Product not found or inactive: ${item.name}` },
          { status: 400 }
        );
      }
      totalAmount += product.price * item.quantity;
      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        size: item.size,
        quantity: item.quantity,
        image: product.images?.[0] || "",
      });
    }

    // Generate a unique user-friendly order number (e.g. TA-X8D3R9)
    const generateOrderNumber = () => {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let result = "";
      for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return `TA-${result}`;
    };
    const orderNumber = generateOrderNumber();

    // Create new Order document
    const order = await Order.create({
      user: payload.id,
      orderNumber,
      items: orderItems,
      shippingDetails,
      paymentMethod: "COD",
      paymentStatus: "Pending", // Cash on Delivery starts as Pending
      orderStatus: "Pending",
      totalAmount,
      trackingUpdates: [
        {
          status: "Pending",
          description: "Order placed. Awaiting dispatch and payment on delivery.",
        },
      ],
    });

    // Clear user's database cart
    await User.findByIdAndUpdate(payload.id, { $set: { cart: [] } });

    return NextResponse.json({
      success: true,
      orderId: order.orderNumber,
    });

  } catch (error: any) {
    console.error("COD checkout error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create Cash on Delivery order" },
      { status: 500 }
    );
  }
}
