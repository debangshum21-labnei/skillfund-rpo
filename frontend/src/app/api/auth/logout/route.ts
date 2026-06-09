import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabaseServer";

export async function POST() {
    try {
        const supabase = createSupabaseServerClient();
        const { error } = await supabase.auth.signOut();
        if (error) {
            return NextResponse.json({ ok: false, error: { message: error.message } }, { status: 400 });
        }
        return NextResponse.json({ ok: true });
    } catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        return NextResponse.json({ ok: false, error: { message } }, { status: 500 });
    }
}

