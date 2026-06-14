import { NextResponse } from "next/server";
import { isUserAuthenticated } from "@/lib/userAuth";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const payload = await isUserAuthenticated();

    if (!payload) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findById(payload.id).select(
      "email name avatar role"
    );

    if (!user) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        role: user.role,
      },
    });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}
