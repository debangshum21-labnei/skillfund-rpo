import { createSupabaseServerClient } from "@/lib/supabaseServer";

// Minimal helpers for login state.
// No UI changes are made; components can use this later.
export async function getSession() {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.auth.getSession();
    if (error) return { session: null, user: null, error };
    return { session: data.session, user: data.session?.user ?? null, error: null };
}

