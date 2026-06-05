import { rewardTiers } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function RewardProgress({ progressPercent }: { progressPercent: number }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-primary">Reward progress</span>
        <span className="text-muted">{progressPercent.toFixed(1)}% demo profit</span>
      </div>
      <div className="relative h-3 rounded-full bg-slate-100">
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
                active ? "border-green-200 bg-green-50" : "border-border bg-white",
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
