import Link from "next/link";
import { ArrowRight, BarChart3, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#rewards", label: "Rewards" },
  { href: "#rules", label: "Rules" },
  { href: "#faq", label: "FAQ" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-white/90 backdrop-blur">
      <div className="app-container flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 font-semibold text-primary">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white">
            <BarChart3 className="h-4 w-4" />
          </span>
          SkillFund
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="transition hover:text-primary">
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/register">
              Start <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

export function TrustStrip({ inverted = false }: { inverted?: boolean }) {
  return (
    <div className={cn("flex flex-wrap items-center gap-3 text-sm", inverted ? "text-slate-300" : "text-slate-600")}>
      {["Rule-based sessions", "Mock trading MVP", "Transparent caps"].map((item) => (
        <span key={item} className="inline-flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-success" />
          {item}
        </span>
      ))}
    </div>
  );
}
