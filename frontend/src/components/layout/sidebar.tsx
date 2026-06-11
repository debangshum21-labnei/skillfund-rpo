"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  CreditCard,
  History,
  LayoutDashboard,
  LineChart,
  Trophy,
  Menu,
  X,
  TrendingUp,
} from "lucide-react";
import type { ReactNode } from "react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { activeSession, wallets } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

const items = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/account", label: "Account", icon: CreditCard },
  { href: "/deposit", label: "Deposit", icon: CreditCard },
  { href: "/terminal", label: "Terminal", icon: LineChart },
  { href: "/session-results", label: "Results", icon: Trophy },
];

const progressPct = Math.min(
  (activeSession.profitPercent / activeSession.targetProfitPercent) * 100,
  100,
);
const circumference = 2 * Math.PI * 18;
const dashOffset = circumference - (progressPct / 100) * circumference;

function SessionRing() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 12px",
        borderRadius: "var(--radius-md)",
        background: "var(--bg-elevated)",
        border: "0.5px solid var(--border)",
        marginTop: 8,
      }}
    >
      <div style={{ position: "relative", width: 40, height: 40, flexShrink: 0 }}>
        <svg width="40" height="40" viewBox="0 0 40 40">
          <circle cx="20" cy="20" r="18" fill="none" stroke="var(--border-mid)" strokeWidth="3" />
          <circle
            cx="20"
            cy="20"
            r="18"
            fill="none"
            stroke="var(--green)"
            strokeWidth="3"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            style={{
              transform: "rotate(-90deg)",
              transformOrigin: "center",
              transition: "stroke-dashoffset 0.6s ease",
            }}
          />
        </svg>
        <span
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 9,
            fontFamily: "var(--font-mono)",
            color: "var(--green)",
            fontWeight: 500,
          }}
        >
          {progressPct.toFixed(0)}%
        </span>
      </div>
      <div style={{ minWidth: 0 }}>
        <p style={{ fontSize: 11, color: "var(--text-muted)", margin: 0 }}>Session profit</p>
        <p
          style={{
            fontSize: 13,
            fontFamily: "var(--font-mono)",
            color: "var(--green)",
            margin: 0,
            fontWeight: 500,
          }}
        >
          +{activeSession.profitPercent.toFixed(2)}%
        </p>
        <p style={{ fontSize: 10, color: "var(--text-muted)", margin: 0 }}>
          Target: +{activeSession.targetProfitPercent}%
        </p>
      </div>
    </div>
  );
}

function SidebarContent({ active, onClose }: { active: string; onClose?: () => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", padding: "0 12px 16px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 4px 16px" }}>
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            textDecoration: "none",
            color: "var(--text-primary)",
            fontWeight: 600,
            fontSize: 16,
            letterSpacing: "-0.02em",
          }}
        >
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 32,
              height: 32,
              borderRadius: "var(--radius-sm)",
              background: "var(--green)",
              color: "var(--text-primary)",
            }}
          >
            <TrendingUp size={16} />
          </span>
          SkillFund
        </Link>

        {onClose && (
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "var(--text-muted)",
              cursor: "pointer",
              padding: 4,
            }}
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <div
        style={{
          padding: "8px 12px",
          borderRadius: "var(--radius-md)",
          background: "var(--bg-elevated)",
          border: "0.5px solid var(--border)",
          marginBottom: 8,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Real balance</span>
          <span
            style={{
              fontSize: 11,
              padding: "1px 6px",
              borderRadius: 99,
              background: "var(--green-dim)",
              color: "var(--green)",
            }}
          >
            Protected
          </span>
        </div>
        <p
          style={{
            fontSize: 18,
            fontFamily: "var(--font-mono)",
            fontWeight: 500,
            color: "var(--text-primary)",
            margin: "2px 0 0",
          }}
        >
          {formatCurrency(wallets.realBalance.amount, "INR")}
        </p>
      </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
        {items.map(({ href, label, icon: Icon }) => {
          const isActive = active === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "9px 12px",
                borderRadius: "var(--radius-md)",
                textDecoration: "none",
                fontSize: 14,
                fontWeight: isActive ? 500 : 400,
                color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                background: isActive ? "var(--bg-overlay)" : "transparent",
                borderLeft: isActive ? "2px solid var(--green)" : "2px solid transparent",
                transition: "all 0.15s",
              }}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>

      <SessionRing />

      <div
        style={{
          marginTop: 8,
          padding: "8px 12px",
          borderRadius: "var(--radius-md)",
          background: "var(--bg-elevated)",
          border: "0.5px solid var(--border)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <History size={12} color="var(--text-muted)" />
          <span style={{ fontSize: 11, color: "var(--text-muted)" }}>MVP · Mock data only</span>
        </div>
      </div>
    </div>
  );
}

export function Sidebar({ active }: { active: string }) {
  return (
    <aside
      style={{
        width: 220,
        flexShrink: 0,
        minHeight: "100vh",
        background: "var(--bg-surface)",
        borderRight: "0.5px solid var(--border)",
        display: "none",
      }}
      className="lg:block"
    >
      <SidebarContent active={active} />
    </aside>
  );
}

export function AppShell({
  active,
  title,
  subtitle,
  children,
  fullWidth = false,
}: {
  active: string;
  title: string;
  subtitle: string;
  children: ReactNode;
  fullWidth?: boolean;
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (drawerOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  const mainPadding = useMemo(() => (fullWidth ? 0 : 24), [fullWidth]);
  const mainMaxWidth = fullWidth ? "none" : "none";

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)", display: "flex" }}>
      {/* Desktop sidebar */}
      <aside
        style={{
          width: 220,
          flexShrink: 0,
          minHeight: "100vh",
          background: "var(--bg-surface)",
          borderRight: "0.5px solid var(--border)",
        }}
        className="hidden lg:block"
      >
        <SidebarContent active={active} />
      </aside>

      {/* Mobile drawer backdrop */}
      {drawerOpen && (
        <div
          onClick={() => setDrawerOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 40,
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(2px)",
          }}
          className="lg:hidden"
        />
      )}

      {/* Mobile drawer */}
      <aside
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 50,
          width: 240,
          background: "var(--bg-surface)",
          borderRight: "0.5px solid var(--border)",
          transform: drawerOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.25s ease",
        }}
        className="lg:hidden"
      >
        <SidebarContent active={active} onClose={() => setDrawerOpen(false)} />
      </aside>

      {/* Main */}
      <main style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <header
          style={{
            background: "var(--bg-surface)",
            borderBottom: "0.5px solid var(--border)",
            padding: "0 24px",
            height: 56,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            flexShrink: 0,
            position: "sticky",
            top: 0,
            zIndex: 30,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
            <button
              onClick={() => setDrawerOpen(true)}
              className="lg:hidden"
              style={{
                background: "none",
                border: "none",
                color: "var(--text-secondary)",
                cursor: "pointer",
                padding: 4,
                flexShrink: 0,
              }}
              aria-label="Open sidebar"
            >
              <Menu size={20} />
            </button>

            <div style={{ minWidth: 0 }}>
              <h1
                style={{
                  margin: 0,
                  fontSize: 15,
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  letterSpacing: "-0.02em",
                }}
              >
                {title}
              </h1>
              {subtitle && <p style={{ margin: 0, fontSize: 12, color: "var(--text-muted)" }}>{subtitle}</p>}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "4px 10px",
                borderRadius: 99,
                background: "var(--green-dim)",
                border: "0.5px solid var(--green-glow)",
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "var(--green)",
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontSize: 12,
                  fontFamily: "var(--font-mono)",
                  color: "var(--green)",
                  fontWeight: 500,
                }}
              >
                {formatCurrency(wallets.demoBalance.amount, "USD")} demo
              </span>
            </div>

            <ThemeToggle />
          </div>
        </header>

        <div
          style={{
            flex: 1,
            padding: mainPadding,
            maxWidth: mainMaxWidth,
          }}
        >
          {children}
        </div>
      </main>
    </div>
  );
}
