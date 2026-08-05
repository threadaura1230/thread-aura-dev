import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Review from "@/models/Review";

export const dynamic = "force-dynamic";

// GET all reviews for Admin view
export async function GET() {
  try {
    await dbConnect();
    const reviews = await Review.find({}).sort({ date: -1 });
    return NextResponse.json({ success: true, data: reviews });
  } catch (error: any) {
    console.error("Admin GET reviews error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}
