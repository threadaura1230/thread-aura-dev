import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Review from "@/models/Review";

export const dynamic = "force-dynamic";

// Initial seed reviews for fallback/display
const defaultReviews = [
  {
    name: "Aishwarya Sen",
    location: "Mumbai, India",
    rating: 5,
    productName: "Royal Indigo Handspun Kurta",
    productLink: "/collections/handspun-cotton",
    date: new Date("2026-07-24"),
    quote: "The texture is absolutely divine. You can feel the artisan's breath in every thread.",
    text: "I was skeptical about ordering handspun fabrics online, but Thread Aura has completely blown me away. The weight of the fabric is substantial yet breathable, and the natural indigo dye has this mesmerizing depth that synthetic dyes can never replicate. The stitching details on the collar are immaculate. I've already washed it twice, and the texture only gets softer.",
    mediaType: "video",
    mediaUrl: "https://assets.mixkit.co/videos/preview/mixkit-fashion-woman-with-silver-glitter-makeup-40113-large.mp4",
    posterUrl: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80",
    approved: true
  },
  {
    name: "Vikram Malhotra",
    location: "New Delhi, India",
    rating: 5,
    productName: "Textured Sage Linen Blazer",
    productLink: "/collections/linen-luxury",
    date: new Date("2026-06-18"),
    quote: "Sartorial perfection meets sustainable luxury. Fits like a glove.",
    text: "Finding a blazer that balances structure with relaxed drape is rare. The Sage Linen Blazer from Thread Aura achieves exactly this. It's incredibly light and has an understated lustre that looks stunning in daylight. I wore it to a summer wedding and received endless compliments. The shipping was prompt, and the packaging was completely plastic-free.",
    mediaType: "image",
    mediaUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80",
    posterUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80",
    approved: true
  },
  {
    name: "Meera Krishnan",
    location: "Bangalore, India",
    rating: 5,
    productName: "Heritage Mulberry Silk Scarf",
    productLink: "/collections/silk-heritage",
    date: new Date("2026-05-30"),
    quote: "Pure luxury against the skin. The colors are incredibly vibrant.",
    text: "This scarf is a masterpiece. The silk feels cool, heavy, and incredibly smooth. What surprised me most is how the colors change depending on how the light hits the weave. The hand-rolled edges show the sheer dedication to detail. It's not just an accessory; it is wearable art.",
    mediaType: "video",
    mediaUrl: "https://assets.mixkit.co/videos/preview/mixkit-woman-showing-off-her-handbag-40097-large.mp4",
    posterUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=80",
    approved: true
  },
  {
    name: "Rohan Dasgupta",
    location: "Kolkata, India",
    rating: 5,
    productName: "Premium Ivory Supima Tee",
    productLink: "/collections/supima-basics",
    date: new Date("2026-04-12"),
    quote: "The search for the perfect white tee ends here.",
    text: "I have tried premium tees from global luxury brands, but Thread Aura's Supima cotton stands in a league of its own. It holds its shape perfectly, isn't transparent, and feels like silk. The drop-shoulder fit is contemporary without being oversized. An absolute must-have basic.",
    mediaType: "image",
    mediaUrl: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&auto=format&fit=crop&q=80",
    posterUrl: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&auto=format&fit=crop&q=80",
    approved: true
  }
];

export async function GET() {
  try {
    await dbConnect();
    const dbReviews = await Review.find({ approved: true }).sort({ date: -1 });
    
    // If database is empty, return defaultReviews as a starting set
    if (dbReviews.length === 0) {
      return NextResponse.json({ success: true, reviews: defaultReviews });
    }
    
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
