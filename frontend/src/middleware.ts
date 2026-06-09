import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabaseServer";

export async function middleware(req: NextRequest) {
    const { pathname, origin } = req.nextUrl;

    const requiresAuth = pathname === "/dashboard" || pathname.startsWith("/dashboard/") || pathname === "/terminal" || pathname.startsWith("/terminal/");
    if (!requiresAuth) return NextResponse.next();

    // Skip auth check for the login page itself.
    if (pathname.startsWith("/login")) return NextResponse.next();

    try {
        const supabase = createSupabaseServerClient();
        const { data } = await supabase.auth.getSession();

        if (!data.session) {
            const loginUrl = new URL("/login", origin);
            loginUrl.searchParams.set("next", pathname);
            return NextResponse.redirect(loginUrl);
        }

        return NextResponse.next();
    } catch {
        const loginUrl = new URL("/login", origin);
        loginUrl.searchParams.set("next", pathname);
        return NextResponse.redirect(loginUrl);
    }
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};



