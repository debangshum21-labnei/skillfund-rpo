import { Activity, CreditCard } from "lucide-react";
import { AppShell } from "@/components/layout/sidebar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { BalanceCard } from "@/components/dashboard/balance-card";
import { RewardProgress } from "@/components/dashboard/reward-progress";
import { SessionCard } from "@/components/dashboard/session-card";
import { TradeTable } from "@/components/dashboard/trade-table";
import { activities, activeSession, deposits, trades, wallets } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

export default function DashboardPage() {
  return (
    <AppShell
      active="/dashboard"
      title="Dashboard"
      subtitle="Monitor real balance, demo progress, session status, and recent simulated activity."
    >
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <BalanceCard
          label="Real balance"
          amount={wallets.realBalance.amount}
          currency={wallets.realBalance.currency}
          detail="Available after mock settlement"
        />
        <BalanceCard
          label="Demo balance"
          amount={wallets.demoBalance.amount}
          currency={wallets.demoBalance.currency}
          detail="Used for simulated trading only"
        />
        <BalanceCard
          label="Projected reward"
          amount={wallets.projectedReward.amount}
          currency={wallets.projectedReward.currency}
          detail="Unlocked at next tier"
        />
        <BalanceCard
          label="Reserved capital"
          amount={wallets.reservedBalance.amount}
          currency={wallets.reservedBalance.currency}
          detail="Held during active session"
          trend="down"
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <SessionCard />
        <Card>
          <CardHeader>
            <CardTitle>Reward progress</CardTitle>
          </CardHeader>
          <CardContent>
            <RewardProgress progressPercent={activeSession.profitPercent} />
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              <CardTitle>Recent activity</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {activities.map((item) => (
              <div key={item.id} className="rounded-xl border border-border bg-slate-50 p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-primary">{item.title}</p>
                  <Badge tone={item.tone}>{item.time}</Badge>
                </div>
                <p className="mt-1 text-sm leading-6 text-muted">{item.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-primary" />
              <CardTitle>Deposit history</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <THead>
                <TR>
                  <TH>ID</TH>
                  <TH>Real amount</TH>
                  <TH>Demo credit</TH>
                  <TH>Status</TH>
                  <TH>Date</TH>
                </TR>
              </THead>
              <TBody>
                {deposits.map((deposit) => (
                  <TR key={deposit.id}>
                    <TD className="font-medium text-primary">{deposit.id}</TD>
                    <TD>{formatCurrency(deposit.amount.amount, deposit.amount.currency)}</TD>
                    <TD>{formatCurrency(deposit.demoCredit.amount, deposit.demoCredit.currency)}</TD>
                    <TD>
                      <Badge tone="success">{deposit.status}</Badge>
                    </TD>
                    <TD>{deposit.createdAt}</TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <TradeTable trades={trades} />
      </div>
    </AppShell>
  );
}
