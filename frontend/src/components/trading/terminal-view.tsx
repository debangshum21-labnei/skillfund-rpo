"use client";

import { useState } from "react";
import { TradingViewChart } from "@/components/trading/tradingview-chart";
import { OrderPanel } from "@/components/trading/order-panel";
import { TerminalBottomPanel } from "@/components/trading/terminal-bottom-panel";
import { SYMBOLS } from "@/components/trading/symbols";
import { positions, trades, wallets, activeSession } from "@/lib/mock-data";

export function TerminalView() {
  const [activeSymbol, setActiveSymbol] = useState(SYMBOLS[1].value); // EUR/USD

  return (
    <div className="flex flex-col gap-0 -mx-4 sm:-mx-6 lg:-mx-8">
      {/* ── Account ribbon ── */}
      <div className="flex items-center gap-6 border-b border-[#1e293b] bg-[#0f172a] px-6 py-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-500">Real balance</span>
          <span className="font-semibold text-white">₹{wallets.realBalance.amount.toLocaleString()}</span>
          <span className="rounded bg-slate-700 px-1.5 py-0.5 text-[10px] text-slate-400">Protected</span>
        </div>
        <div className="h-3 w-px bg-slate-700" />
        <div className="flex items-center gap-2">
          <span className="text-slate-500">Demo balance</span>
          <span className="font-semibold text-success">${wallets.demoBalance.amount.toFixed(2)}</span>
          <span className="rounded bg-green-900/40 px-1.5 py-0.5 text-[10px] text-success">Active session</span>
        </div>
        <div className="h-3 w-px bg-slate-700" />
        <div className="flex items-center gap-2">
          <span className="text-slate-500">Session profit</span>
          <span className="font-semibold text-success">+{activeSession.profitPercent.toFixed(1)}%</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-slate-500">Next reward at</span>
          <span className="font-semibold text-amber-400">10% demo profit</span>
        </div>
      </div>

      {/* ── Main trading area: chart + order panel ── */}
      <div className="flex min-h-0 bg-[#0f172a]">
        {/* Chart — takes full remaining width */}
        <div className="min-w-0 flex-1">
          <TradingViewChart symbol={activeSymbol} onSymbolChange={setActiveSymbol} />
        </div>

        {/* Order panel — fixed width sidebar */}
        <div className="w-[300px] shrink-0 border-l border-[#1e293b]">
          <OrderPanel symbol={activeSymbol} onSymbolChange={setActiveSymbol} />
        </div>
      </div>

      {/* ── Bottom tabbed panel ── */}
      <TerminalBottomPanel positions={positions} trades={trades} />
    </div>
  );
}