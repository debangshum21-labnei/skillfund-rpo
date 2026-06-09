/**
 * Supabase environment helpers.
 *
 * This file centralizes access to required env vars.
 */

function requireEnv(name: string): string {
    const v = process.env[name];
    if (!v) {
        throw new Error(`[Supabase] Missing required env var: ${name}`);
    }
    return v;
}

export const supabaseEnv = {
    supabaseUrl: requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    supabaseAnonKey: requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
};


