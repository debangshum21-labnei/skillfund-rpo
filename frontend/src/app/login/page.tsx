import Link from "next/link";
import { BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";

export default function LoginPage() {
  return <AuthShell mode="login" />;
}

function AuthShell({ mode }: { mode: "login" | "register" }) {
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
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="********" />
          </div>
          <Button className="w-full">Login</Button>
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
