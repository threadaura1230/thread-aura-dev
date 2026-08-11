import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Review from "@/models/Review";

export const dynamic = "force-dynamic";



export async function GET() {
  try {
    await dbConnect();
    const dbReviews = await Review.find({ approved: true }).sort({ date: -1 });
    
    return NextResponse.json({ success: true, reviews: dbReviews });
  } catch (error: any) {
    console.error("GET Reviews error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    const { name, location, rating, productName, text, quote, mediaType, mediaUrl, posterUrl } = body;
    
    if (!name || !location || !rating || !productName || !text || !quote || !mediaType || !mediaUrl) {
      return NextResponse.json(
        { success: false, error: "All required fields must be provided." },
        { status: 400 }
      );
    }
    
    const newReview = await Review.create({
      name,
      location,
      rating,
      productName,
      text,
      quote,
      mediaType,
      mediaUrl,
      posterUrl,
      approved: false, // Default is false, needs admin approval
    });
    
    return NextResponse.json({
      success: true,
      review: newReview,
      message: "Review submitted successfully and is awaiting moderation.",
    });
  } catch (error: any) {
    console.error("POST Review error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit review" },
      { status: 500 }
    );
  }
}
