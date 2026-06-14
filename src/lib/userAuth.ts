import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("Please define JWT_SECRET in .env");
  }
  return secret;
}

export interface UserJWTPayload {
  id: string;
  email: string;
  role: string;
}

export function generateUserToken(payload: UserJWTPayload): string {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: "7d" });
}

export function verifyUserToken(token: string): UserJWTPayload | null {
  try {
    return jwt.verify(token, getJwtSecret()) as UserJWTPayload;
  } catch {
    return null;
  }
}

export async function getUserSession(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("user_session")?.value || null;
}

export async function setUserSession(token: string) {
  const cookieStore = await cookies();
  cookieStore.set("user_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
}

export async function removeUserSession() {
  const cookieStore = await cookies();
  cookieStore.delete("user_session");
}

export async function isUserAuthenticated(): Promise<UserJWTPayload | null> {
  const token = await getUserSession();
  if (!token) return null;
  return verifyUserToken(token);
}
