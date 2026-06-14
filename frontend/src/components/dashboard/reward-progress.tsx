"use client";

import { useSessionStore } from "@/store/session-store";
import { cn } from "@/lib/utils";
import { AnimatedNumber } from "@/components/dashboard/animated-number";

const rewardTiers = [
  { demoProfitPercent: 10, rewardPercent: 5, label: "Starter reward" },
  { demoProfitPercent: 20, rewardPercent: 8, label: "Target reward" },
  { demoProfitPercent: 32.5, rewardPercent: 13, label: "Maximum session cap" },
];

export function RewardProgress() {
  const sessionReturnPercent = useSessionStore((s) => s.session.sessionReturnPercent);
  const progressPercent = sessionReturnPercent;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-primary">Reward progress</span>
        <span className="text-muted" style={{ color: progressPercent > 0 ? "var(--rewards-gold)" : undefined }}>
          <AnimatedNumber value={progressPercent} decimals={1} />% demo profit
        </span>
      </div>
      <div className="relative h-3 rounded-full bg-[var(--bg-overlay)] overflow-hidden">
        <div
          className="h-3 rounded-full progress-fill"
          style={{
            width: `${Math.min((progressPercent / 20) * 100, 100)}%`,
            background: "var(--rewards-gold)",
            boxShadow: "0 0 8px var(--rewards-gold-glow)",
          }}
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {rewardTiers.map((tier) => {
          const active = progressPercent >= tier.demoProfitPercent;
          return (
            <div
              key={tier.label}
              className={cn(
                "rounded-xl border p-3 text-sm transition-all duration-300",
                active ? "border-[var(--rewards-gold)] bg-[var(--rewards-gold-dim)]" : "border-border bg-surface",
              )}
              style={active ? { boxShadow: "0 0 12px var(--rewards-gold-glow)" } : undefined}
            >
              <p className="font-semibold text-primary">{tier.demoProfitPercent}% demo</p>
              <p className="mt-1 text-muted">{tier.rewardPercent}% deposit reward</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
