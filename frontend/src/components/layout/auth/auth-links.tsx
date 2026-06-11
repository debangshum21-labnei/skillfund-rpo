"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LogoutButton } from "@/components/layout/auth/logout-button";
import { useAuthSession } from "@/components/layout/auth/session-provider";

export function AuthLinks() {
    const { loading, session } = useAuthSession();
    const isAuthed = Boolean(session?.user);

    // Avoid flicker by not rendering auth switches until we know.
    if (loading) {
        return (
            <div className="hidden sm:inline-flex" style={{ padding: "7px 14px" }} aria-hidden>
                Loading...
            </div>
        );
    }

    if (isAuthed) {
        return (
            <>
                <div className="hidden sm:inline-flex">
                    <LogoutButton />
                </div>
            </>
        );
    }

    return (
        <>
            <div className="hidden sm:inline-flex">
                <Link
                    href="/login"
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
                    }}
                >
                    Login
                </Link>
            </div>

            <Link
                href="/register"
                style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "7px 14px",
                    borderRadius: "var(--radius-sm)",
                    textDecoration: "none",
                    fontSize: 13,
                    fontWeight: 500,
                    color: "var(--text-primary)",
                    background: "var(--green)",
                    transition: "opacity 0.15s",
                }}
            >
                Start <ArrowRight size={13} />
            </Link>
        </>
    );
}

