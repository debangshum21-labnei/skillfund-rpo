import { AppShell } from "@/components/layout/sidebar";
import { BalanceCard } from "@/components/dashboard/balance-card";
import { RewardProgress } from "@/components/dashboard/reward-progress";
import { TradeTable } from "@/components/dashboard/trade-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartPlaceholder } from "@/components/trading/chart-placeholder";
import { PositionsTable } from "@/components/trading/positions-table";
import { TradingPanel } from "@/components/trading/trading-panel";
import { activeSession, positions, trades, wallets } from "@/lib/mock-data";

export default function TerminalPage() {
  return (
    <AppShell
      active="/terminal"
      title="Trading terminal"
      subtitle="Simulated execution surface for session progress, PnL, positions, and trade history."
    >
      <div className="grid gap-5 md:grid-cols-3">
        <BalanceCard
          label="Real balance"
          amount={wallets.realBalance.amount}
          currency={wallets.realBalance.currency}
          detail="Protected from direct terminal execution"
        />
        <BalanceCard
          label="Demo balance"
          amount={wallets.demoBalance.amount}
          currency={wallets.demoBalance.currency}
          detail="Available for this simulated session"
        />
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted">Session progress</CardTitle>
          </CardHeader>
          <CardContent>
            <RewardProgress progressPercent={activeSession.profitPercent} />
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_360px]">
        <ChartPlaceholder />
        <TradingPanel />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <PositionsTable positions={positions} />
        <TradeTable trades={trades} title="Terminal trade history" />
      </div>
    </AppShell>
  );
}
