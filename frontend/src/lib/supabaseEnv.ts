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
    // Avoid crashing the entire app in environments where env vars are not provided.
    // If these are missing, Supabase client will fail on usage with clearer errors.
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
};

export function getRequiredSupabaseUrl() {
    return requireEnv("NEXT_PUBLIC_SUPABASE_URL");
}

export function getRequiredSupabaseAnonKey() {
    return requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");
}




