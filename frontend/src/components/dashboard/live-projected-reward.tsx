"use client";

import { useSessionStore } from "@/store/session-store";

export function LiveProjectedReward() {
  const session = useSessionStore((s) => s.session);

  const isActive = session.status === "active";
  const pnl = session.sessionPnL;
  const ret = session.sessionReturnPercent;
  const sign = ret >= 0 ? "+" : "";

  return (
    <div className="relative overflow-hidden rounded-card border border-border bg-surface p-4 shadow-soft">
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
        <div style={{ minWidth: 0 }}>
          <p
            style={{
              fontSize: 11,
              color: "var(--text-muted)",
              margin: "0 0 4px",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}
          >
            Session PnL
          </p>
          <p
            style={{
              fontSize: 22,
              fontFamily: "var(--font-mono)",
              fontWeight: 600,
              color: "var(--text-primary)",
              margin: "0 0 4px",
              letterSpacing: "-0.02em",
            }}
          >
            {pnl.toFixed(2)} USD
          </p>
          <p
            style={{
              fontSize: 11,
              color: ret >= 0 ? "var(--green)" : "var(--red)",
              margin: 0,
            }}
          >
            {sign}{ret.toFixed(2)}% return
            {!isActive && " • No active session"}
          </p>
        </div>
      </div>
    </div>
  );
}
