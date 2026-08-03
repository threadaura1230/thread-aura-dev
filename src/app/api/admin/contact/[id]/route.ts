import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import ContactMessage from "@/models/ContactMessage";
import { isAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await isAuthenticated();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    
    await dbConnect();
    const deletedMessage = await ContactMessage.findByIdAndDelete(id);
    
    if (!deletedMessage) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting contact message:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
