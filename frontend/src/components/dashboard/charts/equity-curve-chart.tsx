"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { useAnalyticsStore } from "@/store/analytics-store";
import { useSessionStore } from "@/store/session-store";

export function EquityCurveChart({ width = 320, height = 140 }: { width?: number; height?: number }) {
  const balanceHistory = useAnalyticsStore((s) => s.balanceHistory);
  const session = useSessionStore((s) => s.session);
  const padding = { top: 8, right: 8, bottom: 20, left: 40 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const points = useMemo(() => {
    const startBalance = session.startingBalance || balanceHistory[0]?.balance || 100;
    const all = balanceHistory.length > 0
      ? balanceHistory
      : [{ balance: startBalance, timestamp: Date.now(), event: "start" as const }];

    const values = all.map((p) => p.balance);
    const min = Math.min(...values, startBalance * 0.95);
    const max = Math.max(...values, startBalance * 1.05);
    const range = max - min || 1;
    const yScale = (v: number) => padding.top + chartH - ((v - min) / range) * chartH;
    const xScale = (_: number, i: number) =>
      padding.left + (all.length > 1 ? (i / (all.length - 1)) * chartW : chartW / 2);

    return all.map((p, i) => ({ x: xScale(p.balance, i), y: yScale(p.balance), ...p }));
  }, [balanceHistory, session.startingBalance, chartW, chartH, padding]);

  const areaPath = useMemo(() => {
    if (points.length < 2) return "";
    const line = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
    return `${line} L${points[points.length - 1].x.toFixed(1)},${padding.top + chartH} L${points[0].x.toFixed(1)},${padding.top + chartH} Z`;
  }, [points, padding, chartH]);

  const linePath = useMemo(() => {
    if (points.length < 2) return "";
    return points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  }, [points]);

  const { min, max } = useMemo(() => {
    const values = points.map((p) => p.balance);
    return {
      min: Math.min(...values),
      max: Math.max(...values),
    };
  }, [points]);

  const currentValue = points.length > 0 ? points[points.length - 1].balance : 0;
  const startValue = points.length > 0 ? points[0].balance : 0;
  const change = currentValue - startValue;

  const yTicks = useMemo(() => {
    const ticks: number[] = [];
    const range = max - min || 1;
    const steps = 4;
    for (let i = 0; i <= steps; i++) {
      ticks.push(min + (range / steps) * i);
    }
    return ticks;
  }, [min, max]);

  if (points.length < 2) {
    const val = points.length === 1 ? points[0].balance : session.startingBalance || 100;
    return (
      <div className="flex flex-col items-center justify-center gap-1" style={{ height, width }}>
        <span className="font-mono text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
          ${val.toFixed(2)}
        </span>
        <p className="text-xs text-muted">Make a trade to see the equity curve</p>
      </div>
    );
  }

  return (
    <svg width={width} height={height} className="tabular">
      {yTicks.map((v) => (
        <g key={v}>
          <text x={padding.left - 6} y={padding.top + chartH - ((v - min) / (max - min || 1)) * chartH + 3} textAnchor="end" className="text-[10px]" fill="var(--text-muted)">
            {v.toFixed(1)}
          </text>
          <line
            x1={padding.left}
            y1={padding.top + chartH - ((v - min) / (max - min || 1)) * chartH}
            x2={padding.left + chartW}
            y2={padding.top + chartH - ((v - min) / (max - min || 1)) * chartH}
            stroke="var(--border)"
            strokeWidth={0.5}
          />
        </g>
      ))}
      <motion.path
        d={areaPath}
        fill="url(#equityGradient)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      />
      <motion.path
        d={linePath}
        fill="none"
        stroke={change >= 0 ? "var(--green)" : "var(--red)"}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      />
      <defs>
        <linearGradient id="equityGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={change >= 0 ? "var(--green)" : "var(--red)"} stopOpacity={0.2} />
          <stop offset="100%" stopColor={change >= 0 ? "var(--green)" : "var(--red)"} stopOpacity={0.02} />
        </linearGradient>
      </defs>
    </svg>
  );
}
