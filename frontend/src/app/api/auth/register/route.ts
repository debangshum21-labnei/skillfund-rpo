import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabaseServer";

function isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function normalizeName(s: string) {
    return s.trim().replace(/\s+/g, " ");
}

export async function POST(req: Request) {
    try {
        const supabase = createSupabaseServerClient();

        const body = (await req.json()) as {
            firstName?: string;
            lastName?: string;
            email?: string;
            password?: string;
        };

        const firstName = normalizeName(body.firstName ?? "");
        const lastName = normalizeName(body.lastName ?? "");
        const email = (body.email ?? "").trim();
        const password = body.password ?? "";

        // Input validation
        if (!firstName || firstName.length < 1) {
            return NextResponse.json({ ok: false, error: { message: "First name is required" } }, { status: 400 });
        }
        if (!lastName || lastName.length < 1) {
            return NextResponse.json({ ok: false, error: { message: "Last name is required" } }, { status: 400 });
        }
        if (!email || !isValidEmail(email)) {
            return NextResponse.json({ ok: false, error: { message: "Valid email is required" } }, { status: 400 });
        }
        if (!password || password.length < 8) {
            return NextResponse.json({ ok: false, error: { message: "Password must be at least 8 characters" } }, { status: 400 });
        }

        // Create Supabase user
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    firstName,
                    lastName,
                    display_name: `${firstName} ${lastName}`.trim(),
                },
            },
        });

        if (error) {
            return NextResponse.json({ ok: false, error: { message: error.message } }, { status: 400 });
        }

        // Depending on your Supabase email confirmation settings, user may not be immediately active.
        const userId = data?.user?.id;
        if (!userId) {
            // If email confirmation is enabled, signUp may not return a usable session/user immediately.
            return NextResponse.json(
                {
                    ok: true,
                    message: "Account created. Please check your email to confirm before login.",
                },
                { status: 200 },
            );
        }

        const displayName = `${firstName} ${lastName}`.trim();

        // Create profile record
        // Table/schema assumption (conventional): profiles(id, display_name, first_name, last_name)
        const { error: profileError } = await supabase.from("profiles").insert({
            id: userId,
            display_name: displayName,
            first_name: firstName,
            last_name: lastName,
            updated_at: new Date().toISOString(),
        });

        if (profileError) {
            // Don't block auth; return explicit error so user can see something wrong.
            return NextResponse.json({ ok: false, error: { message: profileError.message } }, { status: 500 });
        }

        // Create account record
        // Table/schema assumption (conventional): accounts(user_id or id, profile_id)
        const { error: accountError } = await supabase.from("accounts").insert({
            user_id: userId,
            profile_id: userId,
            updated_at: new Date().toISOString(),
        });

        if (accountError) {
            return NextResponse.json({ ok: false, error: { message: accountError.message } }, { status: 500 });
        }

        return NextResponse.json({ ok: true });
    } catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        return NextResponse.json({ ok: false, error: { message } }, { status: 500 });
    }
}

