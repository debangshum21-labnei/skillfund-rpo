"use client";

import { useTradingStore } from "@/store/trading-store";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { cn, formatCurrency, formatPercent } from "@/lib/utils";

export function TradeTable({ title = "Trade history" }: { title?: string }) {
  const trades = useTradingStore((s) => s.trades);

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        {trades.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted">No trades yet</p>
        ) : (
          <Table>
            <THead>
              <TR>
                <TH>Market</TH>
                <TH>Side</TH>
                <TH>Leverage</TH>
                <TH>Entry</TH>
                <TH>Status</TH>
                <TH className="text-right">PnL</TH>
              </TR>
            </THead>
            <TBody>
              {trades.map((trade) => (
                <TR key={trade.id}>
                  <TD className="font-medium text-primary">{trade.market}</TD>
                  <TD>
                    <Badge tone={trade.side === "Buy" ? "success" : "danger"}>{trade.side}</Badge>
                  </TD>
                  <TD>{trade.leverage}</TD>
                  <TD>{trade.entry}</TD>
                  <TD>{trade.status}</TD>
                  <TD className={cn("text-right font-semibold", trade.pnl >= 0 ? "text-success" : "text-danger")}>
                    {formatCurrency(trade.pnl, "USD")} &middot; {formatPercent(trade.pnlPercent)}
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
