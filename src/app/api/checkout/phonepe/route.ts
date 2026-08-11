import { NextResponse } from "next/server";
import { isUserAuthenticated } from "@/lib/userAuth";
import dbConnect from "@/lib/db";
import Product from "@/models/products/products";
import Order from "@/models/Order";
import crypto from "crypto";

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
    const transactionId = `TXN_${orderNumber}_${Date.now().toString().slice(-6)}`;

    // Create a new Order in DB with status "Pending"
    const order = await Order.create({
      user: payload.id,
      orderNumber,
      items: orderItems,
      shippingDetails,
      paymentMethod: "PhonePe",
      paymentStatus: "Pending",
      orderStatus: "Pending",
      totalAmount,
      paymentDetails: {
        phonepeMerchantOrderId: transactionId,
      },
      trackingUpdates: [
        {
          status: "Pending",
          description: "Order initiated. Redirecting to PhonePe for secure payment.",
        },
      ],
    });

    // Check PhonePe credentials
    const merchantId = process.env.PHONEPE_MERCHANT_ID;
    const saltKey = process.env.PHONEPE_SALT_KEY;
    const saltIndex = process.env.PHONEPE_SALT_INDEX;
    const phonepeEnv = process.env.PHONEPE_ENV || "sandbox";

    const host = request.headers.get("host") || "localhost:3000";
    const protocol = request.headers.get("x-forwarded-proto") || "http";
    const origin = `${protocol}://${host}`;
    const frontendUrl = process.env.FRONTEND_URL || origin;

    // Detect if we should use local Mock mode
    const isMockMode =
      phonepeEnv === "mock" ||
      !merchantId ||
      !saltKey ||
      !saltIndex ||
      merchantId.includes("placeholder") ||
      saltKey.includes("placeholder") ||
      merchantId === "";

    if (isMockMode) {
      console.log("PhonePe running in Mock Mode. Returning local redirect.");
      const mockRedirectUrl = `${frontendUrl}/api/checkout/phonepe/callback?transactionId=${transactionId}&mock=true`;
      return NextResponse.json({
        success: true,
        redirectUrl: mockRedirectUrl,
      });
    }

    // Prepare PhonePe API call
    try {
      const baseUrl =
        phonepeEnv === "production"
          ? "https://api.phonepe.com/apis/hermes"
          : "https://api-preprod.phonepe.com/apis/pg-sandbox";

      const phonepePayload = {
        merchantId,
        merchantTransactionId: transactionId,
        merchantUserId: payload.id,
        amount: Math.round(totalAmount * 100), // PhonePe accepts amount in paise
        redirectUrl: `${frontendUrl}/api/checkout/phonepe/callback?transactionId=${transactionId}`,
        redirectMode: "REDIRECT",
        mobileNumber: shippingDetails.phone,
        paymentInstrument: {
          type: "PAY_PAGE",
        },
      };

      const base64Payload = Buffer.from(JSON.stringify(phonepePayload)).toString("base64");
      const stringToHash = base64Payload + "/pg/v1/pay" + saltKey;
      const sha256 = crypto.createHash("sha256").update(stringToHash).digest("hex");
      const checksum = `${sha256}###${saltIndex}`;

      const response = await fetch(`${baseUrl}/pg/v1/pay`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-VERIFY": checksum,
          "accept": "application/json",
        },
        body: JSON.stringify({ request: base64Payload }),
      });

      const data = await response.json();

      if (data.success && data.data?.instrumentResponse?.redirectInfo?.url) {
        return NextResponse.json({
          success: true,
          redirectUrl: data.data.instrumentResponse.redirectInfo.url,
        });
      } else {
        console.error("PhonePe API initiation failed:", data);
        // Fallback to mock in development if the API fails
        if (process.env.NODE_ENV !== "production") {
          console.log("PhonePe API failed. Falling back to Mock redirection in dev.");
          const mockRedirectUrl = `${frontendUrl}/api/checkout/phonepe/callback?transactionId=${transactionId}&mock=true`;
          return NextResponse.json({
            success: true,
            redirectUrl: mockRedirectUrl,
          });
        }
        return NextResponse.json(
          { error: data.message || "Failed to initiate PhonePe payment" },
          { status: 500 }
        );
      }
    } catch (apiError: any) {
      console.error("PhonePe Fetch/Network error:", apiError);
      if (process.env.NODE_ENV !== "production") {
        console.log("PhonePe network error. Falling back to Mock redirection in dev.");
        const mockRedirectUrl = `${frontendUrl}/api/checkout/phonepe/callback?transactionId=${transactionId}&mock=true`;
        return NextResponse.json({
          success: true,
          redirectUrl: mockRedirectUrl,
        });
      }
      return NextResponse.json(
        { error: "Payment gateway network error. Please try again." },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("PhonePe checkout error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create PhonePe transaction" },
      { status: 500 }
    );
  }
}
