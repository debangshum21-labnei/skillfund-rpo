import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabaseServer";

function isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: Request) {
    try {
        const supabase = createSupabaseServerClient();

        const body = (await req.json()) as { email?: string; password?: string };
        const email = (body.email ?? "").trim();
        const password = body.password ?? "";

        if (!email || !isValidEmail(email)) {
            return NextResponse.json({ ok: false, error: { message: "Valid email is required" } }, { status: 400 });
        }
        if (!password) {
            return NextResponse.json({ ok: false, error: { message: "Password is required" } }, { status: 400 });
        }

        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            return NextResponse.json({ ok: false, error: { message: error.message } }, { status: 400 });
        }

        return NextResponse.json({ ok: true });
    } catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        return NextResponse.json({ ok: false, error: { message } }, { status: 500 });
    }
}

