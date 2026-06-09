"use client";

import { useEffect, useMemo, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";

// Lightweight client-side session info (optional usage).
export function useSessionInfo() {
    const supabase = useMemo(() => getSupabaseBrowserClient(), []);
    const [loading, setLoading] = useState(true);
    const [userEmail, setUserEmail] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;
        supabase.auth
            .getSession()
            .then(({ data }) => {
                if (!mounted) return;
                setUserEmail(data.session?.user?.email ?? null);
            })
            .finally(() => {
                if (!mounted) return;
                setLoading(false);
            });

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUserEmail(session?.user?.email ?? null);
        });

        return () => {
            mounted = false;
            listener.subscription.unsubscribe();
        };
    }, [supabase]);

    return { loading, userEmail };
}

