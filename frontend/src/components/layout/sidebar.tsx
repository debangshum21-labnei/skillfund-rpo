import Link from "next/link";
import { BarChart3, CreditCard, History, LayoutDashboard, LineChart, Trophy } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/deposit", label: "Deposit", icon: CreditCard },
  { href: "/terminal", label: "Terminal", icon: LineChart },
  { href: "/session-results", label: "Results", icon: Trophy },
];

export function Sidebar({ active }: { active: string }) {
  return (
    <aside className="hidden min-h-screen w-64 border-r border-border bg-white p-4 lg:block">
      <Link href="/" className="mb-8 flex items-center gap-2 font-semibold text-primary">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white">
          <BarChart3 className="h-4 w-4" />
        </span>
        SkillFund
      </Link>
      <nav className="space-y-2">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-primary",
                active === item.href && "bg-slate-100 text-primary",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-8 rounded-card border border-border bg-slate-50 p-4 text-sm text-slate-600">
        <History className="mb-3 h-4 w-4 text-primary" />
        <p className="font-semibold text-primary">MVP mode</p>
        <p className="mt-1 leading-6">All balances, trades, deposits, and rewards use mock data.</p>
      </div>
    </aside>
  );
}

export function AppShell({
  active,
  title,
  subtitle,
  children,
}: {
  active: string;
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background lg:flex">
      <Sidebar active={active} />
      <main className="min-w-0 flex-1">
        <header className="border-b border-border bg-white">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 sm:px-6 lg:px-8">
            <p className="text-sm font-medium text-muted">SkillFund console</p>
            <div className="flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-primary">{title}</h1>
                <p className="mt-1 text-sm text-muted">{subtitle}</p>
              </div>
            </div>
          </div>
        </header>
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}
