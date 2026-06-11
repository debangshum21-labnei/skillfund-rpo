import { Activity, CreditCard } from "lucide-react";
import { AppShell } from "@/components/layout/sidebar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { BalanceCard } from "@/components/dashboard/balance-card";
import { RewardProgress } from "@/components/dashboard/reward-progress";
import { SessionCard } from "@/components/dashboard/session-card";
import { TradeTable } from "@/components/dashboard/trade-table";
import { activities, activeSession, deposits, trades } from "@/lib/mock-data";
import { formatINR, formatUSD } from "@/lib/balanceFormat";
import { getAuthedAccountPageData } from "@/lib/accountData";



export default async function DashboardPage() {
  const account = await getAuthedAccountPageData();

  return (
    <AppShell
      active="/dashboard"
      title={`Dashboard, ${account.name}`}
      subtitle="Monitor live balance plus mock trading widgets (MVP)."
    >
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <BalanceCard
          label="Real balance"
          amount={account.realBalance}
          currency="INR"
          detail="Live real wallet balance"
        />

        <BalanceCard
          label="Deposit balance"
          amount={account.depositBalance}
          currency="INR"
          detail="Live deposit balance"
        />

        <BalanceCard
          label="Demo balance"
          amount={account.demoBalance}
          currency="USD"
          detail="Demo wallet (MVP mapping)"
        />

        <Card className="relative overflow-hidden">
          <CardContent style={{ padding: 16 }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
              <div style={{ minWidth: 0 }}>
                <p
                  style={{
                    fontSize: 11,
                    color: "var(--text-muted)",
                    margin: "0 0 4px",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                  }}
                >
                  Projected reward
                </p>
                <p
                  style={{
                    fontSize: 22,
                    fontFamily: "var(--font-mono)",
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    margin: "0 0 4px",
                    letterSpacing: "-0.02em",
                  }}
                >
                  Mock only
                </p>
                <p style={{ fontSize: 11, color: "var(--text-muted)", margin: 0 }}>
                  Kept as mock until trading tables exist.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
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
                    <TD>{deposit.amount.currency === "INR" ? formatINR(deposit.amount.amount) : formatUSD(deposit.amount.amount)}</TD>
                    <TD>{deposit.demoCredit.currency === "INR" ? formatINR(deposit.demoCredit.amount) : formatUSD(deposit.demoCredit.amount)}</TD>

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
    </AppShell >
  );
}
