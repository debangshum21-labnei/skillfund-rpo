import { ChartNoAxesCombined, TrendingUp, Zap } from "lucide-react";
import { AppShell } from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BalanceCard } from "@/components/dashboard/balance-card";
import { RewardProgress } from "@/components/dashboard/reward-progress";
import { DashboardSessionWidget } from "@/components/dashboard/session-widget";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { TradeTable } from "@/components/dashboard/trade-table";
import { SessionHistory } from "@/components/dashboard/session-history";
import { EquityCurveChart } from "@/components/dashboard/charts/equity-curve-chart";
import { SessionBarChart } from "@/components/dashboard/charts/session-bar-chart";
import { WinLossChart } from "@/components/dashboard/charts/win-loss-chart";
import { LongShortChart } from "@/components/dashboard/charts/long-short-chart";
import { LiveDemoBalance } from "@/components/dashboard/live-demo-balance";
import { DashboardAmbient } from "@/components/dashboard/ambient-background";
import { getAuthedAccountPageData } from "@/lib/accountData";

export default async function DashboardPage() {
  const account = await getAuthedAccountPageData();

  return (
    <AppShell
      active="/dashboard"
      title={`Dashboard, ${account.name}`}
      subtitle="Live analytics from actual trade and session data."
    >
      <DashboardAmbient>
        <div aria-hidden="true" className="mesh-bg" />
        <div style={{ position: "relative", zIndex: 1 }}>
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

            <div className="md:col-span-2">
              <LiveDemoBalance />
            </div>
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <DashboardSessionWidget />
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Reward progress</CardTitle>
              </CardHeader>
              <CardContent>
                <RewardProgress />
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-2">
            <Card className="glass-card chart-entrance-1">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" style={{ color: "var(--analytics-blue)" }} />
                  <CardTitle>Equity curve</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <EquityCurveChart width={480} height={140} />
                </div>
              </CardContent>
            </Card>
            <Card className="glass-card chart-entrance-2">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <ChartNoAxesCombined className="h-4 w-4" style={{ color: "var(--analytics-blue)" }} />
                  <CardTitle>Session performance</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <SessionBarChart width={480} height={140} />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[0.8fr_0.8fr_1.4fr]">
            <Card className="glass-card chart-entrance-1">
              <CardHeader>
                <CardTitle>Win / Loss</CardTitle>
              </CardHeader>
              <CardContent>
                <WinLossChart />
              </CardContent>
            </Card>
            <Card className="glass-card chart-entrance-2">
              <CardHeader>
                <CardTitle>Long vs Short</CardTitle>
              </CardHeader>
              <CardContent>
                <LongShortChart />
              </CardContent>
            </Card>
            <Card className="glass-card chart-entrance-3">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4" style={{ color: "var(--analytics-blue)" }} />
                  <CardTitle>Recent activity</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ActivityFeed />
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 chart-entrance-1">
            <TradeTable />
          </div>

          <div className="mt-6 chart-entrance-2">
            <SessionHistory />
          </div>
        </div>
      </DashboardAmbient>
    </AppShell>
  );
}
