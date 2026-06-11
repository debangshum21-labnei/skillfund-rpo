import Link from "next/link";
import { ShieldCheck, TrendingUp } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { AuthProvider } from "@/components/layout/auth/session-provider";
import { AuthLinks } from "@/components/layout/auth/auth-links";





const navItems = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#rewards", label: "Rewards" },
  { href: "#rules", label: "Rules" },
  { href: "#faq", label: "FAQ" },
];

export function Navbar() {
  return (
    <AuthProvider>

      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 40,
          borderBottom: "0.5px solid var(--border)",
          background: "var(--bg-surface)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div
          className="app-container"
          style={{
            display: "flex",
            alignItems: "center",
            height: 60,
            gap: 16,
          }}
        >
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
              flexShrink: 0,
            }}
          >
            <span
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 30,
                height: 30,
                borderRadius: "var(--radius-sm)",
                background: "var(--green)",
                color: "var(--text-primary)",
              }}
            >
              <TrendingUp size={14} />
            </span>
            SkillFund
          </Link>

          <nav
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              flex: 1,
              justifyContent: "center",
            }}
            className="hidden md:flex"
          >
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                style={{
                  padding: "6px 12px",
                  borderRadius: "var(--radius-sm)",
                  textDecoration: "none",
                  fontSize: 13,
                  color: "var(--text-secondary)",
                  transition: "color 0.15s",
                }}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: "auto" }}>
            <ThemeToggle />

            <AuthLinks />


          </div>
        </div>
      </header>
    </AuthProvider>
  );
}


export function TrustStrip({ inverted = false }: { inverted?: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: 16,
        fontSize: 12,
        color: inverted ? "rgba(255,255,255,0.55)" : "var(--text-muted)",
      }}
    >
      {["Rule-based sessions", "Simulated trading MVP", "Transparent caps"].map((item) => (
        <span key={item} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <ShieldCheck size={13} color="var(--green)" />
          {item}
        </span>
      ))}
    </div>
  );
}
