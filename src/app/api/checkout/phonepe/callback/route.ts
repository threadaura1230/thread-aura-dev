import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import User from "@/models/User";
import crypto from "crypto";

export const dynamic = "force-dynamic";

async function handleCallback(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const transactionId = searchParams.get("transactionId");
    const mockParam = searchParams.get("mock");

    if (!transactionId) {
      console.error("PhonePe callback: transactionId is missing");
      return NextResponse.redirect(new URL("/checkout?error=invalid_transaction", request.url));
    }

    await dbConnect();

    // Look up the order using the merchantTransactionId stored in paymentDetails
    const order = await Order.findOne({ "paymentDetails.phonepeMerchantOrderId": transactionId });
    if (!order) {
      console.error(`PhonePe callback: Order not found for transactionId ${transactionId}`);
      return NextResponse.redirect(new URL("/checkout?error=order_not_found", request.url));
    }

    const host = request.headers.get("host") || "localhost:3000";
    const protocol = request.headers.get("x-forwarded-proto") || "http";
    const origin = `${protocol}://${host}`;

    // If order is already paid, redirect straight to success
    if (order.paymentStatus === "Paid") {
      return NextResponse.redirect(new URL(`/checkout/success?orderId=${order.orderNumber}`, origin));
    }

    const merchantId = process.env.PHONEPE_MERCHANT_ID;
    const saltKey = process.env.PHONEPE_SALT_KEY;
    const saltIndex = process.env.PHONEPE_SALT_INDEX;
    const phonepeEnv = process.env.PHONEPE_ENV || "sandbox";

    const isMock =
      mockParam === "true" ||
      phonepeEnv === "mock" ||
      !merchantId ||
      !saltKey ||
      !saltIndex ||
      merchantId.includes("placeholder");

    let isSuccess = false;
    let gatewayTransactionId = `txn_${Date.now()}`;

    if (isMock) {
      console.log(`PhonePe callback running in MOCK mode for transaction ${transactionId}`);
      isSuccess = true;
    } else {
      // Run real PhonePe status check API call
      try {
        const baseUrl =
          phonepeEnv === "production"
            ? "https://api.phonepe.com/apis/hermes"
            : "https://api-preprod.phonepe.com/apis/pg-sandbox";

        const stringToHash = `/pg/v1/status/${merchantId}/${transactionId}${saltKey}`;
        const sha256 = crypto.createHash("sha256").update(stringToHash).digest("hex");
        const checksum = `${sha256}###${saltIndex}`;

        const statusRes = await fetch(`${baseUrl}/pg/v1/status/${merchantId}/${transactionId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-VERIFY": checksum,
            "X-MERCHANT-ID": merchantId,
            "accept": "application/json",
          },
        });

        const data = await statusRes.json();
        console.log("PhonePe status check response:", data);

        if (data.success && data.code === "PAYMENT_SUCCESS" && data.data?.responseCode === "SUCCESS") {
          isSuccess = true;
          gatewayTransactionId = data.data.providerReferenceId || data.data.transactionId;
        } else {
          console.error("PhonePe payment status verify failed or pending:", data);
        }
      } catch (err) {
        console.error("Error verifying PhonePe status:", err);
      }
    }

    if (isSuccess) {
      // 1. Update order payment & logistics status
      order.paymentStatus = "Paid";
      order.orderStatus = "Processing";
      order.paymentDetails = {
        ...order.paymentDetails,
        phonepeTransactionId: gatewayTransactionId,
      };
      
      // Add tracking update
      order.trackingUpdates.push({
        status: "Processing",
        description: "Payment confirmed. Artisan weaving initiated.",
        timestamp: new Date(),
      });

      await order.save();

      // 2. Clear user's database cart
      await User.findByIdAndUpdate(order.user, { $set: { cart: [] } });

      console.log(`PhonePe payment successful. Redirecting order ${order.orderNumber} to success.`);
      return NextResponse.redirect(new URL(`/checkout/success?orderId=${order.orderNumber}`, origin));
    } else {
      // Update order to Failed
      order.paymentStatus = "Failed";
      order.orderStatus = "Cancelled";
      order.trackingUpdates.push({
        status: "Cancelled",
        description: "Payment failed or was cancelled.",
        timestamp: new Date(),
      });
      await order.save();

      console.log(`PhonePe payment failed for order ${order.orderNumber}. Redirecting to checkout page.`);
      return NextResponse.redirect(new URL(`/checkout?error=phonepe_failed`, origin));
    }
  } catch (error) {
    console.error("PhonePe callback handler error:", error);
    return NextResponse.redirect(new URL("/checkout?error=callback_error", request.url));
  }
}

export async function GET(request: Request) {
  return handleCallback(request);
}

export async function POST(request: Request) {
  return handleCallback(request);
}
