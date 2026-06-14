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

export async function setUserTokens(payload: UserJWTPayload) {
  const secret = getJwtSecret();
  const accessToken = jwt.sign(payload, secret, { expiresIn: "15m" });
  const refreshToken = jwt.sign(payload, secret, { expiresIn: "15d" });

  const cookieStore = await cookies();
  
  cookieStore.set("access_token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 15 * 60, // 15 minutes
    path: "/",
  });

  cookieStore.set("refresh_token", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 15, // 15 days
    path: "/",
  });
}

export async function removeUserSession() {
  const cookieStore = await cookies();
  cookieStore.delete("access_token");
  cookieStore.delete("refresh_token");
  cookieStore.delete("user_session");
}

export async function isUserAuthenticated(): Promise<UserJWTPayload | null> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;
    const refreshToken = cookieStore.get("refresh_token")?.value;

    if (accessToken) {
      const decodedAccess = verifyUserToken(accessToken);
      if (decodedAccess) {
        // Access token is valid. Rotate it by generating a new one to replace the old one.
        const newPayload: UserJWTPayload = {
          id: decodedAccess.id,
          email: decodedAccess.email,
          role: decodedAccess.role,
        };
        const newAccessToken = jwt.sign(newPayload, getJwtSecret(), { expiresIn: "15m" });
        
        try {
          cookieStore.set("access_token", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 15 * 60,
            path: "/",
          });
        } catch (cookieError) {
          // In Server Components rendering, setting cookies is not permitted and will throw.
          // We catch the error so the page renders fine, while Route Handlers will successfully rotate the cookie.
          console.warn("Could not write rotated access token cookie in this context:", cookieError);
        }
        
        return decodedAccess;
      }
    }

    // Access token is missing or expired. Let's check the refresh token.
    if (refreshToken) {
      const decodedRefresh = verifyUserToken(refreshToken);
      if (decodedRefresh) {
        // Refresh token is valid. Issue a fresh access token.
        const newPayload: UserJWTPayload = {
          id: decodedRefresh.id,
          email: decodedRefresh.email,
          role: decodedRefresh.role,
        };
        const newAccessToken = jwt.sign(newPayload, getJwtSecret(), { expiresIn: "15m" });

        try {
          cookieStore.set("access_token", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 15 * 60,
            path: "/",
          });
        } catch (cookieError) {
          console.warn("Could not write refreshed access token cookie in this context:", cookieError);
        }

        return decodedRefresh;
      }
    }
  } catch (error) {
    console.error("Error verifying user session:", error);
  }

  return null;
}

