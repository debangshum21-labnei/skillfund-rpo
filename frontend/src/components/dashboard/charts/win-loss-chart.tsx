"use client";

import { useMemo } from "react";
import { DonutChart } from "./donut-chart";
import { useSessionStore } from "@/store/session-store";

export function WinLossChart({ size = 120 }: { size?: number }) {
  const session = useSessionStore((s) => s.session);
  const previousSessions = useSessionStore((s) => s.previousSessions);

  const { wins, losses } = useMemo(() => {
    let w = session.winningTrades;
    let l = session.losingTrades;
    for (const s of previousSessions) {
      w += s.winningTrades;
      l += s.losingTrades;
    }
    return { wins: w, losses: l };
  }, [session, previousSessions]);

  const slices = [
    { label: "Wins", value: wins, color: "var(--green)" },
    { label: "Losses", value: losses, color: "var(--red)" },
  ];

  const total = wins + losses;
  const winRate = total > 0 ? ((wins / total) * 100).toFixed(1) : "0.0";

  return (
    <div className="flex items-center gap-4">
      <DonutChart slices={slices} size={size} />
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ background: "var(--green)" }} />
          <span className="text-xs text-muted">Wins</span>
          <span className="text-xs font-semibold text-primary">{wins}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ background: "var(--red)" }} />
          <span className="text-xs text-muted">Losses</span>
          <span className="text-xs font-semibold text-primary">{losses}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted">Win rate</span>
          <span className="text-xs font-semibold text-primary">{winRate}%</span>
        </div>
      </div>
    </div>
  );
}
