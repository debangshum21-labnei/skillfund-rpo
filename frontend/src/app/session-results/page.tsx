import { CheckCircle2, TrendingUp, Wallet } from "lucide-react";
import { AppShell } from "@/components/layout/sidebar";
import { BalanceCard } from "@/components/dashboard/balance-card";
import { CooldownTimer } from "@/components/dashboard/cooldown-timer";
import { RewardProgress } from "@/components/dashboard/reward-progress";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { completedSession, wallets } from "@/lib/mock-data";
import { formatCurrency, formatPercent } from "@/lib/utils";

export default function SessionResultsPage() {
  return (
    <AppShell
      active="/session-results"
      title="Session results"
      subtitle="Review settlement, reward earned, updated balance, and cooldown before the next session."
    >
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-success">
                <CheckCircle2 className="h-5 w-5" />
              </span>
              <div>
                <CardTitle>Profit target reached</CardTitle>
                <p className="text-sm text-muted">Session {completedSession.id} completed at +20% demo profit.</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-3">
            <ResultMetric label="Profit/Loss" value={formatPercent(completedSession.profitPercent)} tone="success" />
            <ResultMetric label="Reward earned" value={formatCurrency(400, "INR")} tone="success" />
            <ResultMetric label="Updated balance" value={formatCurrency(9150, "INR")} tone="neutral" />
          </CardContent>
        </Card>

        <div className="space-y-4">
          <CooldownTimer minutes={15} />
          <Button className="w-full" disabled>
            Start new session
          </Button>
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Settlement summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-xl border border-border bg-slate-50 p-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="h-5 w-5 text-success" />
                <span className="text-sm text-muted">Demo wallet result</span>
              </div>
              <span className="font-semibold text-success">+$20.00</span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-border bg-slate-50 p-4">
              <div className="flex items-center gap-3">
                <Wallet className="h-5 w-5 text-primary" />
                <span className="text-sm text-muted">Real wallet settlement</span>
              </div>
              <span className="font-semibold text-primary">+₹400</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Reward tier achieved</CardTitle>
          </CardHeader>
          <CardContent>
            <RewardProgress progressPercent={completedSession.profitPercent} />
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <BalanceCard
          label="Real balance"
          amount={wallets.realBalance.amount + 400}
          currency="INR"
          detail="After mock reward settlement"
        />
        <BalanceCard
          label="Demo balance reset"
          amount={100}
          currency="USD"
          detail="Next session starts from mapped demo capital"
        />
      </div>
    </AppShell>
  );
}

function ResultMetric({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "success" | "neutral";
}) {
  return (
    <div className="rounded-xl border border-border bg-slate-50 p-4">
      <p className="text-sm text-muted">{label}</p>
      <p className={tone === "success" ? "mt-2 text-2xl font-semibold text-success" : "mt-2 text-2xl font-semibold text-primary"}>
        {value}
      </p>
    </div>
  );
}
