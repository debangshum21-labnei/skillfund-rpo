import * as React from "react";
import { cn } from "@/lib/utils";

type BadgeTone = "neutral" | "success" | "danger" | "warning" | "info" | "dark";

const tones: Record<BadgeTone, React.CSSProperties> = {
  neutral: { background: "var(--bg-overlay)", color: "var(--text-secondary)", border: "0.5px solid var(--border)" },
  success: { background: "var(--green-dim)",  color: "var(--green)",  border: "0.5px solid var(--green-glow)" },
  danger:  { background: "var(--red-dim)",   color: "var(--red)",   border: "0.5px solid rgba(244,63,94,0.2)" },
  warning: { background: "var(--amber-dim)", color: "var(--amber)", border: "0.5px solid rgba(245,158,11,0.2)" },
  info:    { background: "var(--blue-dim)",  color: "var(--blue)",  border: "0.5px solid rgba(59,130,246,0.2)" },
  dark:    { background: "var(--bg-overlay)", color: "var(--text-primary)", border: "0.5px solid var(--border-mid)" },
};

export function Badge({
  className, tone = "neutral", style, ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: BadgeTone }) {
  return (
    <span
      className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium", className)}
      style={{ ...tones[tone], ...style }}
      {...props}
    />
  );
}