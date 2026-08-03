import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import ContactMessage from "@/models/ContactMessage";
import { isAuthenticated } from "@/lib/auth"; // using the same auth standard as verify

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await isAuthenticated();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const messages = await ContactMessage.find().sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: messages });
  } catch (error) {
    console.error("Error fetching contact messages:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
