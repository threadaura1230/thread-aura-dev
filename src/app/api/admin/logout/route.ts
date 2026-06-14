import { NextResponse } from "next/server";
import { removeAuthToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    await removeAuthToken();
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}