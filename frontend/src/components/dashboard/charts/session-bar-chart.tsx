"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { useSessionStore } from "@/store/session-store";

export function SessionBarChart({ width = 320, height = 140 }: { width?: number; height?: number }) {
  const session = useSessionStore((s) => s.session);
  const previousSessions = useSessionStore((s) => s.previousSessions);
  const padding = { top: 8, right: 8, bottom: 20, left: 40 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const bars = useMemo(() => {
    const all = [...previousSessions].reverse();
    if (all.length === 0) return [];

    const returns = all.map((s) => s.sessionReturnPercent);
    const maxAbs = Math.max(...returns.map(Math.abs), 1);
    const barW = Math.max(4, Math.min(24, (chartW - (all.length - 1) * 4) / all.length));

    return all.map((s, i) => {
      const pct = s.sessionReturnPercent;
      const barH = (Math.abs(pct) / maxAbs) * (chartH * 0.8);
      const x = padding.left + i * (barW + 4);
      const y = pct >= 0 ? padding.top + chartH * 0.9 - barH : padding.top + chartH * 0.9;
      return { x, y, w: barW, h: Math.max(barH, 2), pct, label: s.id.slice(-4) };
    });
  }, [previousSessions, chartW, chartH, padding]);

  if (bars.length === 0) {
    return (
      <div className="flex items-center justify-center" style={{ height, width }}>
        <p className="text-xs text-muted">No session history yet</p>
      </div>
    );
  }

  const maxAbs = Math.max(...bars.map((b) => Math.abs(b.pct)), 1);
  const zeroY = padding.top + chartH * 0.9;

  return (
    <svg width={width} height={height} className="tabular">
      <line x1={padding.left} y1={zeroY} x2={padding.left + chartW} y2={zeroY} stroke="var(--border)" strokeWidth={0.5} />
      {[-maxAbs, 0, maxAbs].map((v) => (
        <text
          key={String(v)}
          x={padding.left - 6}
          y={v === 0 ? zeroY + 3 : v > 0 ? zeroY - (v / maxAbs) * (chartH * 0.8) + 3 : zeroY + Math.abs(v / maxAbs) * (chartH * 0.8) + 3}
          textAnchor="end"
          className="text-[10px]"
          fill="var(--text-muted)"
        >
          {v.toFixed(0)}%
        </text>
      ))}
      {bars.map((bar) => (
        <g key={bar.label}>
          <motion.rect
            x={bar.x}
            y={bar.pct >= 0 ? bar.y : zeroY}
            width={bar.w}
            height={bar.pct >= 0 ? bar.h : Math.max(bar.h, 2)}
            rx={2}
            fill={bar.pct >= 0 ? "var(--green)" : "var(--red)"}
            initial={{ height: 0, y: zeroY }}
            animate={{
              height: bar.pct >= 0 ? bar.h : Math.max(bar.h, 2),
              y: bar.pct >= 0 ? bar.y : zeroY,
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
          <text x={bar.x + bar.w / 2} y={zeroY + 14} textAnchor="middle" className="text-[9px]" fill="var(--text-muted)">
            {bar.label}
          </text>
        </g>
      ))}
    </svg>
  );
}
