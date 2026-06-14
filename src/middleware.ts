import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const url = request.nextUrl.clone();
    const path = url.pathname;

    // We only target paths starting with /admin
    if (path.startsWith("/admin")) {
        const secretSegment = process.env.NEXT_PUBLIC_ADMIN_SECRET_PATH || "master_console-dp1230";
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
    matcher: ["/admin/:path*"],
};
