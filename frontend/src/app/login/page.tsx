"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { BarChart3 } from "lucide-react";

// Note: UI styling intentionally unchanged; logic only adds auth.


import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const emailTrimmed = email.trim();
    if (!emailTrimmed) return setError("Email is required");
    if (!password) return setError("Password is required");

    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailTrimmed, password }),
      });

      const data = (await res.json()) as { ok: boolean; error?: { message?: string } };

      if (!res.ok || !data.ok) {
        setError(data.error?.message ?? "Login failed");
        return;
      }

      router.replace("/dashboard");
    } catch {
      setError("Unexpected error during login");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <Link href="/" className="mb-4 flex items-center gap-2 font-semibold text-primary">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white">
              <BarChart3 className="h-4 w-4" />
            </span>
            SkillFund
          </Link>
          <CardTitle>Welcome back</CardTitle>
          <p className="text-sm text-muted">Sign in to your mock trading console.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <Button className="w-full" type="submit" disabled={submitting}>
              {submitting ? "Logging in..." : "Login"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted">
            New to SkillFund?{" "}
            <Link href="/register" className="font-semibold text-primary">
              Create account
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}

