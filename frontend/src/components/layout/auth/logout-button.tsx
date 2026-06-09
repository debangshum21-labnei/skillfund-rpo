"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton({ className }: { className?: string }) {
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);

    async function onLogout() {
        setSubmitting(true);
        try {
            await fetch("/api/auth/logout", { method: "POST" });
        } finally {
            setSubmitting(false);
            router.replace("/");
        }
    }

    return (
        <button
            type="button"
            onClick={onLogout}
            disabled={submitting}
            style={{
                padding: "7px 14px",
                borderRadius: "var(--radius-sm)",
                textDecoration: "none",
                fontSize: 13,
                fontWeight: 500,
                color: "var(--text-secondary)",
                border: "0.5px solid var(--border-mid)",
                background: "transparent",
                transition: "all 0.15s",
                cursor: submitting ? "not-allowed" : "pointer",
            }}
            className={className}
        >
            {submitting ? "Logging out..." : "Logout"}
        </button>
    );
}

