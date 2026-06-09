import { createBrowserClient, createServerClient, type CookieOptions } from "@supabase/ssr";
import { type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// NOTE: This project uses Next.js App Router. We keep both server and browser clients.
// For server-side auth, we rely on cookies from @supabase/ssr helpers.

export function getSupabaseBrowserClient(): SupabaseClient {
    return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

// Server client factory. Cookie handling is provided by caller via helpers from @supabase/ssr.
export function getSupabaseServerClient(params: {
    cookieStore: {
        get: (name: string) => { name: string; value: string } | undefined;
        set: (name: string, value: string, options: CookieOptions) => void;
        remove: (name: string, options: CookieOptions) => void;
    };
}) {
    return createServerClient(supabaseUrl, supabaseAnonKey, {
        cookies: {
            get(name) {
                const c = params.cookieStore.get(name);
                return c?.value;
            },
            set(name, value, options) {
                params.cookieStore.set(name, value, options);
            },
            remove(name, options) {
                params.cookieStore.remove(name, options);
            },
        },
    });
}

