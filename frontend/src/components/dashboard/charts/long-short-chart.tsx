"use client";

import { useMemo } from "react";
import { DonutChart } from "./donut-chart";
import { useTradingStore } from "@/store/trading-store";

export function LongShortChart({ size = 120 }: { size?: number }) {
  const trades = useTradingStore((s) => s.trades);

  const { long, short } = useMemo(() => {
    let lo = 0;
    let sh = 0;
    for (const t of trades) {
      if (t.side === "Buy") lo++;
      else sh++;
    }
    return { long: lo, short: sh };
  }, [trades]);

  const slices = [
    { label: "Long", value: long, color: "var(--analytics-blue)" },
    { label: "Short", value: short, color: "var(--session-purple)" },
  ];

  const total = long + short;

  return (
    <div className="flex items-center gap-4">
      <DonutChart slices={slices} size={size} />
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ background: "var(--analytics-blue)" }} />
          <span className="text-xs text-muted">Long</span>
          <span className="text-xs font-semibold text-primary">{long}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ background: "var(--session-purple)" }} />
          <span className="text-xs text-muted">Short</span>
          <span className="text-xs font-semibold text-primary">{short}</span>
        </div>
        {total > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted">Long ratio</span>
            <span className="text-xs font-semibold text-primary">{((long / total) * 100).toFixed(0)}%</span>
          </div>
        )}
      </div>
    </div>
  );
}
