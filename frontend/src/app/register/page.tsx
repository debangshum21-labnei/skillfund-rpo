"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { BarChart3 } from "lucide-react";

// Note: UI styling intentionally unchanged; logic only adds auth.


import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";

export default function RegisterPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const fn = firstName.trim();
    const ln = lastName.trim();
    const em = email.trim();

    if (!fn) return setError("First name is required");
    if (!ln) return setError("Last name is required");
    if (!em) return setError("Email is required");
    if (!password) return setError("Password is required");
    if (password.length < 8) return setError("Password must be at least 8 characters");

    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName: fn, lastName: ln, email: em, password }),
      });

      const data = (await res.json()) as { ok: boolean; error?: { message?: string } };

      if (!res.ok || !data.ok) {
        setError(data.error?.message ?? "Registration failed");
        return;
      }

      router.replace("/dashboard");
    } catch {
      setError("Unexpected error during registration");
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
          <CardTitle>Create your account</CardTitle>
          <p className="text-sm text-muted">Start with a mock profile for the frontend MVP.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First name</Label>
                <Input
                  id="firstName"
                  placeholder="Aarav"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last name</Label>
                <Input
                  id="lastName"
                  placeholder="Mehta"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>

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
              {submitting ? "Creating..." : "Create mock account"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-primary">
              Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}

