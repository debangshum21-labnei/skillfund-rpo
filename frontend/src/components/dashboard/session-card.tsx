import { Clock, ShieldAlert, Target } from "lucide-react";
import type { ElementType } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { activeSession, sessionRules } from "@/lib/mock-data";
import { formatPercent } from "@/lib/utils";

export function SessionCard() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle>Current session</CardTitle>
          <Badge tone="success">Active</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-3 sm:grid-cols-3">
          <Metric icon={Target} label="Target" value="+20%" tone="success" />
          <Metric icon={ShieldAlert} label="Loss stop" value="-10%" tone="danger" />
          <Metric icon={Clock} label="Cooldown" value="15 min" tone="neutral" />
        </div>
        <div>
          <div className="mb-2 flex justify-between text-sm">
            <span className="font-medium text-primary">Session PnL</span>
            <span className="text-success">{formatPercent(activeSession.profitPercent)}</span>
          </div>
          <div className="h-3 rounded-full bg-[var(--bg-overlay)]">
            <div
              className="h-3 rounded-full bg-success"
              style={{ width: `${(activeSession.profitPercent / activeSession.targetProfitPercent) * 100}%` }}
            />
          </div>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {sessionRules.map((rule) => (
            <div key={rule.label} className="rounded-xl border border-border bg-[var(--bg-elevated)] p-3">
              <p className="text-xs font-medium uppercase text-[var(--text-muted)]">{rule.label}</p>
              <p className="mt-1 text-sm font-semibold text-primary">{rule.value}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: ElementType;
  label: string;
  value: string;
  tone: "success" | "danger" | "neutral";
}) {
  return (
    <div className="rounded-xl border border-border bg-[var(--bg-elevated)] p-3">
      <Icon
        className={
          tone === "success"
            ? "h-4 w-4 text-success"
            : tone === "danger"
              ? "h-4 w-4 text-danger"
              : "h-4 w-4 text-muted"
        }
      />
      <p className="mt-2 text-xs text-muted">{label}</p>
      <p className="font-semibold text-primary">{value}</p>
    </div>
  );
}
