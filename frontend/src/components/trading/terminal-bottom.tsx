"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import type { Position, Trade } from "@/types";
import { cn, formatCurrency, formatPercent } from "@/lib/utils";

const TABS = ["Positions", "Open Orders", "Order History"] as const;
type Tab = typeof TABS[number];

interface Props {
  positions: Position[];
  trades: Trade[];
}

export function TerminalBottomPanel({ positions, trades }: Props) {
  const [tab, setTab] = useState<Tab>("Positions");

  return (
    <div className="border-t border-[#1e293b] bg-[#0a1120]">
      {/* Tab bar */}
      <div className="flex border-b border-[#1e293b]">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "px-5 py-2.5 text-xs font-semibold transition-colors",
              tab === t
                ? "border-b-2 border-success text-success"
                : "text-slate-500 hover:text-slate-300"
            )}
          >
            {t}
            {t === "Positions" && positions.length > 0 && (
              <span className="ml-1.5 rounded-full bg-success/20 px-1.5 py-0.5 text-[10px] text-success">
                {positions.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="overflow-x-auto">
        {tab === "Positions" && (
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#1e293b]">
                {["Market", "Side", "Margin", "Leverage", "Loss Buffer", "Unrealized PnL", "Action"].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-left font-medium text-slate-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {positions.map((p) => (
                <tr key={p.id} className="border-b border-[#1e293b]/50 hover:bg-white/[0.02]">
                  <td className="px-4 py-2.5 font-semibold text-white">{p.market}</td>
                  <td className="px-4 py-2.5">
                    <span className={cn("font-semibold", p.side === "Long" ? "text-success" : "text-danger")}>{p.side}</span>
                  </td>
                  <td className="px-4 py-2.5 text-slate-300">{formatCurrency(p.margin, "USD")}</td>
                  <td className="px-4 py-2.5 text-slate-300">{p.leverage}</td>
                  <td className="px-4 py-2.5 text-slate-300">{p.liquidationBuffer}</td>
                  <td className="px-4 py-2.5 font-semibold text-success">{formatCurrency(p.unrealizedPnl, "USD")}</td>
                  <td className="px-4 py-2.5">
                    <button className="rounded border border-danger/40 px-2 py-0.5 text-danger transition-colors hover:bg-danger/10">
                      Close
                    </button>
                  </td>
                </tr>
              ))}
              {positions.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-600">No open positions</td></tr>
              )}
            </tbody>
          </table>
        )}

        {tab === "Open Orders" && (
          <div className="px-4 py-8 text-center text-xs text-slate-600">No open orders</div>
        )}

        {tab === "Order History" && (
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#1e293b]">
                {["Market", "Side", "Leverage", "Entry", "Status", "PnL"].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-left font-medium text-slate-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {trades.map((t) => (
                <tr key={t.id} className="border-b border-[#1e293b]/50 hover:bg-white/[0.02]">
                  <td className="px-4 py-2.5 font-semibold text-white">{t.market}</td>
                  <td className="px-4 py-2.5">
                    <span className={cn("font-semibold", t.side === "Buy" ? "text-success" : "text-danger")}>{t.side}</span>
                  </td>
                  <td className="px-4 py-2.5 text-slate-300">{t.leverage}</td>
                  <td className="px-4 py-2.5 text-slate-300">{t.entry}</td>
                  <td className="px-4 py-2.5">
                    <span className={cn("rounded px-1.5 py-0.5 text-[10px] font-semibold",
                      t.status === "Open" ? "bg-blue-900/40 text-blue-400" : "bg-slate-800 text-slate-400"
                    )}>{t.status}</span>
                  </td>
                  <td className={cn("px-4 py-2.5 font-semibold", t.pnl >= 0 ? "text-success" : "text-danger")}>
                    {formatCurrency(t.pnl, "USD")} · {formatPercent(t.pnlPercent)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}