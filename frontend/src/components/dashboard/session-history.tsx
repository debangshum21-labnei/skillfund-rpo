"use client";

import { useSessionStore } from "@/store/session-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

export function SessionHistory() {
  const previousSessions = useSessionStore((s) => s.previousSessions);

  if (previousSessions.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Session history</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <THead>
            <TR>
              <TH>Session</TH>
              <TH>Trades</TH>
              <TH>Wins</TH>
              <TH>Losses</TH>
              <TH>Win rate</TH>
              <TH>Avg hold</TH>
              <TH className="text-right">PnL</TH>
              <TH className="text-right">Return</TH>
            </TR>
          </THead>
          <TBody>
            {previousSessions.map((s) => {
              const winRate = s.tradesTaken > 0
                ? ((s.winningTrades / s.tradesTaken) * 100).toFixed(1)
                : "0.0";
              return (
                <TR key={s.id}>
                  <TD className="font-medium text-primary">{s.id}</TD>
                  <TD>{s.tradesTaken}</TD>
                  <TD className="text-success">{s.winningTrades}</TD>
                  <TD className="text-danger">{s.losingTrades}</TD>
                  <TD>{winRate}%</TD>
                  <TD>{formatDuration(s.averageHoldTimeSeconds)}</TD>
                  <TD className={s.sessionPnL >= 0 ? "text-right font-semibold text-success" : "text-right font-semibold text-danger"}>
                    {s.sessionPnL >= 0 ? "+" : ""}{s.sessionPnL.toFixed(2)}
                  </TD>
                  <TD className={s.sessionReturnPercent >= 0 ? "text-right font-semibold text-success" : "text-right font-semibold text-danger"}>
                    {s.sessionReturnPercent >= 0 ? "+" : ""}{s.sessionReturnPercent.toFixed(2)}%
                  </TD>
                </TR>
              );
            })}
          </TBody>
        </Table>
      </CardContent>
    </Card>
  );
}
