"use client";

import { useMemo, type ReactNode } from "react";
import { useSessionStore } from "@/store/session-store";
import { useTradingStore } from "@/store/trading-store";

export function DashboardAmbient({ children }: { children: ReactNode }) {
  const sessionStatus = useSessionStore((s) => s.session.status);
  const positions = useTradingStore((s) => s.positions);

  const atmosphere = useMemo(() => {
    const totalPnl = positions.reduce((sum, p) => sum + p.unrealizedPnl, 0);
    if (sessionStatus === "active" && totalPnl > 0.5) return "active-positive";
    if (sessionStatus === "active" && totalPnl < -0.5) return "active-negative";
    if (sessionStatus === "active") return "active";
    if (totalPnl > 0.5) return "positive";
    if (totalPnl < -0.5) return "negative";
    return "neutral";
  }, [sessionStatus, positions]);

  return <div data-atmosphere={atmosphere}>{children}</div>;
}
