import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

export async function GET() {
    try {
        const supabase = createSupabaseServerClient();

        // Auth call requires valid Supabase config and (optionally) cookies.
        // If you're not logged in yet, error is expected; we still verify connectivity.
        const { data, error } = await supabase.auth.getSession();

        return NextResponse.json({
            ok: !error,
            sessionPresent: !!data?.session,
            error: error ? { message: error.message } : null,
        });
    } catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        return NextResponse.json(
            {
                ok: false,
                error: { message },
            },
            { status: 500 },
        );
    }

}

