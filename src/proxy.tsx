import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { apiRateLimiter } from "@/lib/rateLimit";

export function proxy(request: NextRequest) {
    const url = request.nextUrl.clone();
    const path = url.pathname;

    // Rate Limit /api/auth and /api/contact paths
    if (path.startsWith("/api/auth") || path.startsWith("/api/contact")) {
        const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || 
                   request.headers.get("x-real-ip") || 
                   "127.0.0.1";
        const rateLimitRes = apiRateLimiter.limitRequest(ip);


        if (!rateLimitRes.success) {
            return new NextResponse(
                JSON.stringify({
                    error: "Too many requests. Please slow down and try again.",
                }),
                {
                    status: 429,
                    headers: {
                        "Content-Type": "application/json",
                        "X-RateLimit-Limit": rateLimitRes.limit.toString(),
                        "X-RateLimit-Remaining": rateLimitRes.remaining.toString(),
                        "X-RateLimit-Reset": rateLimitRes.reset.toString(),
                    },
                }
            );
        }
    }

    // We only target paths starting with /admin
    if (path.startsWith("/admin")) {
        const secretSegment = process.env.ADMIN_SECRET_PATH;
        const parts = path.split("/");

        // URL format: /admin/[secret]/[subpage]
        // parts array: ["", "admin", "[secret]", "[subpage]"]
        const secret = parts[2];

        // If secret key doesn't match, stealth redirect to home page
        if (secret !== secretSegment) {
            url.pathname = "/";
            return NextResponse.redirect(url);
        }

        const page = parts[3];
        const isAuthenticated = request.cookies.has("admin_session");

        if (page === "dashboard" && !isAuthenticated) {
            url.pathname = `/admin/${secretSegment}/login`;
            return NextResponse.redirect(url);
        }

        if (page === "login" && isAuthenticated) {
            url.pathname = `/admin/${secretSegment}/dashboard`;
            return NextResponse.redirect(url);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*", "/api/auth/:path*", "/api/contact/:path*"],
};

