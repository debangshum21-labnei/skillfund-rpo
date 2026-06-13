"use client";

import { useState } from "react";
import type { Position, Trade } from "@/types";
import { cn, formatCurrency, formatPercent } from "@/lib/utils";
import { useTradingStore } from "@/store/trading-store";

const TABS = ["Positions", "Open Orders", "Order History"] as const;
type Tab = typeof TABS[number];

interface Props { positions: Position[]; trades: Trade[]; }

export function TerminalBottomPanel({ positions, trades }: Props) {
  const [tab, setTab] = useState<Tab>("Positions");
  const closePosition = useTradingStore((state) => state.closePosition);

  const th: React.CSSProperties = {
    padding: "6px 12px", fontSize: 11, fontWeight: 500,
    color: "var(--text-muted)", textAlign: "left",
    textTransform: "uppercase", letterSpacing: "0.05em",
    borderBottom: "0.5px solid var(--border)",
    background: "var(--bg-elevated)",
    whiteSpace: "nowrap",
  };
  const td: React.CSSProperties = {
    padding: "7px 12px", fontSize: 12,
    color: "var(--text-secondary)", whiteSpace: "nowrap",
    borderBottom: "0.5px solid var(--border)",
  };

  return (
    <div style={{
      borderTop: "0.5px solid var(--border)",
      background: "var(--bg-surface)",
      flexShrink: 0, maxHeight: 220,
      display: "flex", flexDirection: "column",
    }}>
      {/* Tab bar */}
      <div style={{
        display: "flex", borderBottom: "0.5px solid var(--border)",
        background: "var(--bg-elevated)", flexShrink: 0,
      }}>
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: "8px 16px", fontSize: 12, fontWeight: 500, cursor: "pointer",
            border: "none", background: "transparent",
            color: tab === t ? "var(--text-primary)" : "var(--text-muted)",
            borderBottom: tab === t ? "2px solid var(--green)" : "2px solid transparent",
            transition: "all 0.15s", display: "flex", alignItems: "center", gap: 6,
          }}>
            {t}
            {t === "Positions" && positions.length > 0 && (
              <span style={{
                fontSize: 10, padding: "0 5px", borderRadius: 99,
                background: "var(--green-dim)", color: "var(--green)",
              }}>{positions.length}</span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowX: "auto", overflowY: "auto" }}>
        {tab === "Positions" && (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Market","Side","Margin","Leverage","Loss Buffer","Unreal. P&L","Action"].map((h) => (
                  <th key={h} style={th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {positions.map((p) => (
                <tr key={p.id} style={{ transition: "background 0.1s" }}>
                  <td style={{ ...td, fontWeight: 600, color: "var(--text-primary)", fontFamily: "var(--font-mono)" }}>{p.market}</td>
                  <td style={td}>
                    <span style={{
                      color: p.side === "Long" ? "var(--green)" : "var(--red)",
                      fontWeight: 600,
                    }}>{p.side}</span>
                  </td>
                  <td style={{ ...td, fontFamily: "var(--font-mono)" }}>{formatCurrency(p.margin, "USD")}</td>
                  <td style={{ ...td, fontFamily: "var(--font-mono)" }}>{p.leverage}</td>
                  <td style={td}>{p.liquidationBuffer}</td>
                  <td style={{ ...td, fontFamily: "var(--font-mono)", color: "var(--green)", fontWeight: 600 }}>
                    {formatCurrency(p.unrealizedPnl, "USD")}
                  </td>
                  <td style={td}>
                    <button
                      onClick={() => closePosition(p.id)}
                      style={{
                        padding: "3px 10px", fontSize: 11, cursor: "pointer",
                        borderRadius: "var(--radius-sm)",
                        border: "0.5px solid rgba(244,63,94,0.3)",
                        background: "var(--red-dim)", color: "var(--red)",
                        transition: "all 0.15s",
                      }}
                    >
                      Close
                    </button>
                  </td>
                </tr>
              ))}
              {positions.length === 0 && (
                <tr><td colSpan={7} style={{ ...td, textAlign: "center", padding: "20px", color: "var(--text-muted)" }}>
                  No open positions
                </td></tr>
              )}
            </tbody>
          </table>
        )}

        {tab === "Open Orders" && (
          <div style={{ padding: "20px", textAlign: "center", fontSize: 12, color: "var(--text-muted)" }}>
            No open orders
          </div>
        )}

        {tab === "Order History" && (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Market","Side","Leverage","Entry","Status","P&L"].map((h) => (
                  <th key={h} style={th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {trades.map((t) => (
                <tr key={t.id}>
                  <td style={{ ...td, fontWeight: 600, color: "var(--text-primary)", fontFamily: "var(--font-mono)" }}>{t.market}</td>
                  <td style={td}>
                    <span style={{ color: t.side === "Buy" ? "var(--green)" : "var(--red)", fontWeight: 600 }}>{t.side}</span>
                  </td>
                  <td style={{ ...td, fontFamily: "var(--font-mono)" }}>{t.leverage}</td>
                  <td style={{ ...td, fontFamily: "var(--font-mono)" }}>{t.entry}</td>
                  <td style={td}>
                    <span style={{
                      padding: "2px 7px", borderRadius: 99, fontSize: 11,
                      background: t.status === "Open" ? "var(--blue-dim)" : "var(--bg-overlay)",
                      color: t.status === "Open" ? "var(--blue)" : "var(--text-muted)",
                    }}>{t.status}</span>
                  </td>
                  <td style={{ ...td, fontFamily: "var(--font-mono)", fontWeight: 600,
                    color: t.pnl >= 0 ? "var(--green)" : "var(--red)" }}>
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