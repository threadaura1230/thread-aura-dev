import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { setUserTokens } from "@/lib/userAuth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      if (existingUser.provider === "google") {
        return NextResponse.json(
          { error: "This email is registered via Google sign-in. Please log in using Google." },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: "Email is already in use. Please log in instead." },
        { status: 400 }
      );
    }

    // Create user. Mongoose pre-save hook will hash the password.
    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      password, // Plain text here, Mongoose hashes it
      provider: "manual",
      role: "user",
    });

    // Set cookies using our helper
    await setUserTokens({
      id: newUser._id.toString(),
      email: newUser.email,
      role: newUser.role,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: newUser._id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "An error occurred during registration. Please try again." },
      { status: 500 }
    );
  }
}
