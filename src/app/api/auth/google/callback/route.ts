import { NextResponse } from "next/server";
import { setUserTokens } from "@/lib/userAuth";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const returnedState = url.searchParams.get("state");
  const errorParam = url.searchParams.get("error");

  // Read the oauth_state cookie from the request headers
  const cookieHeader = request.headers.get("cookie") || "";
  const storedState = cookieHeader
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith("oauth_state="))
    ?.split("=")[1];

  // Google denied or user cancelled
  if (errorParam) {
    return NextResponse.redirect(
      new URL("/login?error=google_access_denied", request.url)
    );
  }

  // CSRF state validation
  if (!returnedState || !storedState || returnedState !== storedState) {
    return NextResponse.redirect(
      new URL("/login?error=invalid_state", request.url)
    );
  }

  // No authorization code
  if (!code) {
    return NextResponse.redirect(
      new URL("/login?error=google_auth_failed", request.url)
    );
  }

  // Exchange code for tokens
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
      grant_type: "authorization_code",
    }),
  });

  const tokens = await tokenRes.json();

  if (!tokens.access_token) {
    return NextResponse.redirect(
      new URL("/login?error=google_token_failed", request.url)
    );
  }

  // Fetch Google profile
  const profileRes = await fetch(
    "https://www.googleapis.com/oauth2/v2/userinfo",
    {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    }
  );
  const profile = await profileRes.json();

  if (!profile.email) {
    return NextResponse.redirect(
      new URL("/login?error=google_profile_failed", request.url)
    );
  }

  // Connect to DB and find-or-create user
  await dbConnect();

  let user = await User.findOne({ googleId: profile.id });

  if (!user) {
    // Check if a manual user with same email exists
    user = await User.findOne({ email: profile.email });

    if (user) {
      // Link Google ID to existing manual account
      user.googleId = profile.id;
      user.avatar = user.avatar || profile.picture;
      if (!user.provider || user.provider === "manual") {
        user.provider = "google";
      }
      await user.save();
    } else {
      // Create a brand-new user
      try {
        user = await User.create({
          googleId: profile.id,
          email: profile.email,
          name: profile.name,
          avatar: profile.picture,
          role: "user",
          provider: "google",
        });
      } catch {
        // Handle race condition on duplicate email/googleId
        return NextResponse.redirect(
          new URL("/login?error=google_signup_failed", request.url)
        );
      }
    }
  }

  // Set user session cookies (access_token & refresh_token)
  await setUserTokens({
    id: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  const response = NextResponse.redirect(new URL("/", request.url));

  // Clear the CSRF state cookie
  response.cookies.set("oauth_state", "", { maxAge: 0, path: "/" });

  return response;
}
