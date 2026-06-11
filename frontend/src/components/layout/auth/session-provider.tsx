"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";
import type { Session } from "@supabase/supabase-js";

type AuthContextValue = {
    loading: boolean;
    session: Session | null;
    refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const supabase = useMemo(() => getSupabaseBrowserClient(), []);
    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState<Session | null>(null);

    async function refresh() {
        const { data } = await supabase.auth.getSession();
        setSession(data.session ?? null);
    }

    useEffect(() => {
        let active = true;

        (async () => {
            try {
                await refresh();
            } finally {
                if (active) setLoading(false);
            }
        })();

        const { data: sub } = supabase.auth.onAuthStateChange((_event, nextSession) => {
            setSession(nextSession ?? null);
        });

        return () => {
            active = false;
            sub.subscription.unsubscribe();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const value = useMemo<AuthContextValue>(() => ({ loading, session, refresh }), [loading, session]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthSession() {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuthSession must be used within <AuthProvider>");
    }
    return ctx;
}

