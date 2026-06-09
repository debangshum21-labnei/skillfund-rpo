import { cookies } from "next/headers";
import { getSupabaseServerClient } from "@/lib/supabaseClient";


// Convenience for server components / route handlers.
export function createSupabaseServerClient() {
    return getSupabaseServerClient({
        cookieStore: {
            get: (name) => {
                const cookieStore = cookies() as unknown as {
                    get: (n: string) => { name: string; value: string } | undefined;
                };
                const c = cookieStore.get(name);
                if (!c) return undefined;
                return { name: c.name, value: c.value };
            },
            set: (name, value, options) => {
                const cookieStore = cookies() as unknown as {
                    set: (v: { name: string; value: string } & Record<string, unknown>) => void;
                };
                cookieStore.set({
                    name,
                    value,
                    ...(options as Record<string, unknown>),
                });
            },
            remove: (name, options) => {
                const cookieStore = cookies() as unknown as {
                    delete: (v: { name: string } & Record<string, unknown>) => void;
                };
                cookieStore.delete({
                    name,
                    ...(options as Record<string, unknown>),
                });
            },


        },
    });
}


