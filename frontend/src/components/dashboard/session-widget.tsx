"use client";

import { useEffect, useState, type ElementType } from "react";
import { Play, Square, Clock, BarChart3, TrendingUp, TrendingDown, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSessionStore } from "@/store/session-store";
import { formatPercent } from "@/lib/utils";

function formatDuration(totalSeconds: number): string {
  if (totalSeconds < 60) return `${totalSeconds}s`;
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

function Metric({ icon: Icon, label, value, tone }: {
  icon: ElementType; label: string; value: string;
  tone: "success" | "danger" | "neutral";
}) {
  return (
    <div className="rounded-xl border border-border bg-[var(--bg-elevated)] p-3">
      <Icon className={tone === "success" ? "h-4 w-4 text-success" : tone === "danger" ? "h-4 w-4 text-danger" : "h-4 w-4 text-muted"} />
      <p className="mt-2 text-xs text-muted">{label}</p>
      <p className="font-semibold text-primary">{value}</p>
    </div>
  );
}

export function DashboardSessionWidget() {
  const session = useSessionStore((s) => s.session);
  const startSession = useSessionStore((s) => s.startSession);
  const endSession = useSessionStore((s) => s.endSession);

  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (!session.cooldownEndsAt || session.cooldownEndsAt <= Date.now()) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [session.cooldownEndsAt]);

  const cooldownRemaining = session.cooldownEndsAt
    ? Math.max(0, Math.floor((session.cooldownEndsAt - now) / 1000))
    : 0;
  const inCooldown = cooldownRemaining > 0;

  if (session.status === "not_started") {
    return (
      <Card>
        <CardContent>
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--bg-elevated)] text-muted">
              <Play className="h-6 w-6" />
            </span>
            <div>
              <p className="text-sm font-medium text-primary">No active session</p>
              <p className="mt-1 text-xs text-muted">Start a session to track your trade performance.</p>
            </div>
            <button
              onClick={startSession}
              className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.97]"
              style={{ background: "var(--green)" }}
            >
              <Play size={15} />
              Start Session
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (session.status === "completed") {
    const returnPositive = session.sessionReturnPercent >= 0;
    const winRate = session.tradesTaken > 0
      ? ((session.winningTrades / session.tradesTaken) * 100).toFixed(1)
      : "0.0";
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <CardTitle>Session</CardTitle>
            <Badge tone="neutral">Completed</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-3 sm:grid-cols-3">
            <Metric icon={BarChart3} label="Trades" value={String(session.tradesTaken)} tone="neutral" />
            <Metric
              icon={returnPositive ? TrendingUp : TrendingDown}
              label="Return"
              value={formatPercent(session.sessionReturnPercent)}
              tone={returnPositive ? "success" : "danger"}
            />
            <Metric icon={Clock} label="Avg hold" value={formatDuration(session.averageHoldTimeSeconds)} tone="neutral" />
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-border bg-[var(--bg-elevated)] p-3">
              <p className="text-xs text-muted">Wins</p>
              <p className="font-semibold text-success">{session.winningTrades}</p>
            </div>
            <div className="rounded-xl border border-border bg-[var(--bg-elevated)] p-3">
              <p className="text-xs text-muted">Losses</p>
              <p className="font-semibold text-danger">{session.losingTrades}</p>
            </div>
            <div className="rounded-xl border border-border bg-[var(--bg-elevated)] p-3">
              <p className="text-xs text-muted">Win rate</p>
              <p className="font-semibold text-primary">{winRate}%</p>
            </div>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-border bg-[var(--bg-elevated)] p-3">
            <div className="flex items-center gap-2">
              <Award size={16} className="text-muted" />
              <span className="text-sm text-muted">Session PnL</span>
            </div>
            <span
              className="font-mono text-sm font-bold"
              style={{ color: returnPositive ? "var(--green)" : "var(--red)" }}
            >
              {returnPositive ? "+" : ""}{session.sessionPnL.toFixed(2)} USD
            </span>
          </div>
          <button
            onClick={startSession}
            className="w-full rounded-lg py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.97]"
            style={{ background: "var(--green)" }}
          >
            Start New Session
          </button>
        </CardContent>
      </Card>
    );
  }

  const returnPositive = session.sessionReturnPercent >= 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle>Session</CardTitle>
          <div className="flex items-center gap-2">
            {inCooldown && (
              <span className="flex items-center gap-1 rounded-full bg-[var(--amber-dim)] px-2.5 py-0.5 text-xs font-medium text-amber">
                <Clock size={11} />
                {Math.floor(cooldownRemaining / 60)}:{String(cooldownRemaining % 60).padStart(2, "0")}
              </span>
            )}
            <Badge tone="success">Active</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-3 sm:grid-cols-3">
          <Metric icon={BarChart3} label="Trades" value={String(session.tradesTaken)} tone="neutral" />
          <Metric
            icon={returnPositive ? TrendingUp : TrendingDown}
            label="Return"
            value={formatPercent(session.sessionReturnPercent)}
            tone={returnPositive ? "success" : "danger"}
          />
          <Metric icon={Clock} label="Avg hold" value={formatDuration(session.averageHoldTimeSeconds)} tone="neutral" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-[var(--bg-elevated)] p-3">
            <p className="text-xs text-muted">Wins / Losses</p>
            <p className="font-semibold text-primary">
              <span className="text-success">{session.winningTrades}</span>
              {" / "}
              <span className="text-danger">{session.losingTrades}</span>
            </p>
          </div>
          <div className="rounded-xl border border-border bg-[var(--bg-elevated)] p-3">
            <p className="text-xs text-muted">Duration</p>
            <p className="font-semibold text-primary">
              {session.startedAt ? formatDuration(Math.floor((Date.now() - session.startedAt) / 1000)) : "—"}
            </p>
          </div>
        </div>
        <button
          onClick={endSession}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border py-2.5 text-sm font-semibold text-muted transition-all hover:bg-[var(--bg-elevated)] hover:text-primary active:scale-[0.97]"
        >
          <Square size={14} />
          End Session
        </button>
      </CardContent>
    </Card>
  );
}
