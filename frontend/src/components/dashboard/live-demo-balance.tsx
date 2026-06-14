"use client";

import { useMemo } from "react";
import { useTradingStore } from "@/store/trading-store";
import { formatCurrency } from "@/lib/utils";

export function LiveDemoBalance() {
  const demoBalance = useTradingStore((s) => s.demoBalance);
  const startingDemoBalance = useTradingStore((s) => s.startingDemoBalance);
  const positions = useTradingStore((s) => s.positions);

  const totalUnrealizedPnl = useMemo(
    () => positions.reduce((sum, p) => sum + p.unrealizedPnl, 0),
    [positions],
  );

  const equity = demoBalance + totalUnrealizedPnl;
  const realizedPnl = demoBalance - startingDemoBalance;
  const upColor = "var(--green)";
  const downColor = "var(--red)";

  return (
    <div className="relative overflow-hidden rounded-card border border-border bg-surface p-4 shadow-soft">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <p className="text-[11px] uppercase tracking-[0.04em]" style={{ color: "var(--text-muted)", margin: 0 }}>
            Demo balance
          </p>
          <p className="mt-1 font-mono text-xl font-semibold" style={{ color: "var(--text-primary)", margin: 0 }}>
            {formatCurrency(demoBalance, "USD")}
          </p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.04em]" style={{ color: "var(--text-muted)", margin: 0 }}>
            Equity
          </p>
          <p className="mt-1 font-mono text-xl font-semibold" style={{ color: equity >= 0 ? "var(--text-primary)" : downColor, margin: 0 }}>
            {formatCurrency(equity, "USD")}
          </p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.04em]" style={{ color: "var(--text-muted)", margin: 0 }}>
            Unrealized PnL
          </p>
          <p
            className="mt-1 font-mono text-base font-semibold"
            style={{ color: totalUnrealizedPnl >= 0 ? upColor : downColor, margin: 0 }}
          >
            {totalUnrealizedPnl >= 0 ? "+" : ""}{formatCurrency(totalUnrealizedPnl, "USD")}
          </p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.04em]" style={{ color: "var(--text-muted)", margin: 0 }}>
            Realized PnL
          </p>
          <p
            className="mt-1 font-mono text-base font-semibold"
            style={{ color: realizedPnl >= 0 ? upColor : downColor, margin: 0 }}
          >
            {realizedPnl >= 0 ? "+" : ""}{formatCurrency(realizedPnl, "USD")}
          </p>
        </div>
      </div>
      <p className="mt-3 text-[11px]" style={{ color: "var(--text-muted)", margin: 0 }}>
        Live from trading store · matches terminal
      </p>
    </div>
  );
}
