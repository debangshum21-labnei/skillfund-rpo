"use client";

import Link from "next/link";
import { useState } from "react";
import { TrendingUp, Loader2 } from "lucide-react";
import { PasswordInput, Input, Label } from "@/components/ui/input";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 1800);
  }

  return (
    <main style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", background: "var(--bg-base)", padding: "24px 16px",
    }}>
      <div style={{
        width: "100%", maxWidth: 380,
        background: "var(--bg-surface)",
        border: "0.5px solid var(--border)",
        borderRadius: "var(--radius-xl)",
        padding: 28, boxShadow: "var(--shadow-soft)",
      }}>
        {/* Logo */}
        <Link href="/" style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          textDecoration: "none", color: "var(--text-primary)",
          fontWeight: 600, fontSize: 16, letterSpacing: "-0.02em", marginBottom: 24,
        }}>
          <span style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            width: 30, height: 30, borderRadius: "var(--radius-sm)",
            background: "var(--green)", color: "#000",
          }}><TrendingUp size={14} /></span>
          SkillFund
        </Link>

        <h1 style={{ fontSize: 20, fontWeight: 600, letterSpacing: "-0.02em", margin: "0 0 4px", color: "var(--text-primary)" }}>
          Welcome back
        </h1>
        <p style={{ fontSize: 13, color: "var(--text-muted)", margin: "0 0 24px" }}>
          Sign in to your mock trading console.
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" required />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <Label htmlFor="password">Password</Label>
            <PasswordInput id="password" placeholder="••••••••" required />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 4, height: 42, borderRadius: "var(--radius-md)",
              border: "none", cursor: loading ? "not-allowed" : "pointer",
              background: "var(--green)", color: "#000",
              fontWeight: 600, fontSize: 14,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              opacity: loading ? 0.7 : 1, transition: "opacity 0.15s",
            }}
          >
            {loading ? <><Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> Signing in…</> : "Login"}
          </button>
        </form>

        <p style={{ textAlign: "center", fontSize: 13, color: "var(--text-muted)", marginTop: 18 }}>
          New to SkillFund?{" "}
          <Link href="/register" style={{ color: "var(--green)", textDecoration: "none", fontWeight: 500 }}>
            Create account
          </Link>
        </p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </main>
  );
}