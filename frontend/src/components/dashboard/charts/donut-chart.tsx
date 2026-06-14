"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

interface Slice {
  label: string;
  value: number;
  color: string;
}

export function DonutChart({
  slices,
  size = 120,
  thickness = 18,
  animated = true,
}: {
  slices: Slice[];
  size?: number;
  thickness?: number;
  animated?: boolean;
}) {
  const cx = size / 2;
  const cy = size / 2;
  const r = (size - thickness) / 2;

  const arcs = useMemo(() => {
    const total = slices.reduce((a, s) => a + s.value, 0);
    if (total === 0) return [];

    const circumference = 2 * Math.PI * r;
    let offset = 0;

    return slices.map((slice) => {
      const ratio = slice.value / total;
      const len = ratio * circumference;
      const arc = {
        ...slice,
        ratio,
        circumference,
        len,
        offset,
        dashArray: `${len} ${circumference - len}`,
        dashOffset: -offset,
      };
      offset += len;
      return arc;
    });
  }, [slices, r]);

  const total = slices.reduce((a, s) => a + s.value, 0);

  if (total === 0) {
    return (
      <svg width={size} height={size}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--border)" strokeWidth={thickness} />
        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central" className="text-[10px]" fill="var(--text-muted)">
          No data
        </text>
      </svg>
    );
  }

  return (
    <svg width={size} height={size}>
      {arcs.map((arc, i) =>
        animated ? (
          <motion.circle
            key={arc.label}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={arc.color}
            strokeWidth={thickness}
            strokeDasharray={arc.dashArray}
            strokeDashoffset={arc.dashOffset}
            transform={`rotate(-90 ${cx} ${cy})`}
            strokeLinecap="round"
            initial={{ strokeDasharray: `0 ${arc.circumference}` }}
            animate={{ strokeDasharray: arc.dashArray }}
            transition={{ duration: 0.7, delay: i * 0.1, ease: "easeOut" }}
          />
        ) : (
          <circle
            key={arc.label}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={arc.color}
            strokeWidth={thickness}
            strokeDasharray={arc.dashArray}
            strokeDashoffset={arc.dashOffset}
            transform={`rotate(-90 ${cx} ${cy})`}
            strokeLinecap="round"
          />
        ),
      )}
    </svg>
  );
}
