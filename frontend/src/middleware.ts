import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabaseServer";

export async function middleware(req: NextRequest) {
    const { pathname, origin } = req.nextUrl;

    const requiresAuth =
        pathname === "/dashboard" ||
        pathname.startsWith("/dashboard/") ||
        pathname === "/terminal" ||
        pathname.startsWith("/terminal/");

    const isAuthPage = pathname === "/login" || pathname.startsWith("/login/") || pathname === "/register" || pathname.startsWith("/register/");

    // We still need to check session for auth pages to avoid logged-in users seeing Login/Register.
    if (!requiresAuth && !isAuthPage) return NextResponse.next();


    try {
        const supabase = createSupabaseServerClient();
        const { data } = await supabase.auth.getSession();

        const session = data.session;

        // Unauthenticated: redirect away from protected routes.
        if (!session) {
            if (requiresAuth) {
                const loginUrl = new URL("/login", origin);
                loginUrl.searchParams.set("next", pathname);
                return NextResponse.redirect(loginUrl);
            }
            return NextResponse.next();
        }

        // Authenticated: redirect away from login/register pages.
        if (isAuthPage) {
            const target = new URL("/dashboard", origin);
            return NextResponse.redirect(target);
        }

        return NextResponse.next();

    } catch {
        // On failure, preserve original behavior for protected routes.
        if (requiresAuth) {
            const loginUrl = new URL("/login", origin);
            loginUrl.searchParams.set("next", pathname);
            return NextResponse.redirect(loginUrl);
        }
        return NextResponse.next();
    }

}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};



