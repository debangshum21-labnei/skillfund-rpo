"use client";

import { useSessionStore } from "@/store/session-store";
import { cn } from "@/lib/utils";

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
        <span className="text-muted">{progressPercent.toFixed(1)}% demo profit</span>
      </div>
      <div className="relative h-3 rounded-full bg-[var(--bg-overlay)]">
        <div
          className="h-3 rounded-full bg-success transition-all"
          style={{ width: `${Math.min((progressPercent / 20) * 100, 100)}%` }}
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {rewardTiers.map((tier) => {
          const active = progressPercent >= tier.demoProfitPercent;
          return (
            <div
              key={tier.label}
              className={cn(
                "rounded-xl border p-3 text-sm",
                active ? "border-[var(--green)] bg-[var(--green-dim)]" : "border-border bg-surface",
              )}
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
