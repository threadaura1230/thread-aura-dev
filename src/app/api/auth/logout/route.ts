import { NextResponse } from "next/server";
import { removeUserSession } from "@/lib/userAuth";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    await removeUserSession();
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
