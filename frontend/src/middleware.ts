import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Minimal middleware placeholder.
// We intentionally do not enforce auth redirects here to avoid changing UX.
export function middleware(_req: NextRequest) {
    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

