"use client";

import { useState, useEffect } from "react";
import { TradingViewChart } from "@/components/trading/tradingview-chart";
import { OrderPanel } from "@/components/trading/order-panel";
import { OrderPanelMobile } from "@/components/trading/order-panel-mobile";
import { TerminalBottomPanel } from "@/components/trading/terminal-bottom";
import { SYMBOLS } from "@/components/trading/symbols";
import { wallets, activeSession } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import { useTradingStore } from "@/store/trading-store";

export function TerminalView() {
  const [activeSymbol, setActiveSymbol] = useState(SYMBOLS[1].value);
  const [panelOpen, setPanelOpen] = useState(true);

  const demoBalance = useTradingStore((state) => state.demoBalance);
  const startingDemoBalance = useTradingStore((state) => state.startingDemoBalance);
  const positions = useTradingStore((state) => state.positions);
  const trades = useTradingStore((state) => state.trades);
  const startPriceSimulation = useTradingStore((state) => state.startPriceSimulation);
  const stopPriceSimulation = useTradingStore((state) => state.stopPriceSimulation);

  useEffect(() => {
    startPriceSimulation();
    return () => stopPriceSimulation();
  }, [startPriceSimulation, stopPriceSimulation]);

  const totalUnrealizedPnl = positions.reduce((sum, p) => sum + p.unrealizedPnl, 0);
  const currentEquity = demoBalance + totalUnrealizedPnl;
  const profitPercent = ((currentEquity - startingDemoBalance) / startingDemoBalance) * 100;
  const profitColor = profitPercent >= 0 ? "var(--green)" : "var(--red)";
  const profitSign = profitPercent >= 0 ? "+" : "";

  return (
    <div style={{ display: "flex", flexDirection: "column", margin: "-24px", height: "calc(100vh - 56px)" }} className="pb-[70px] lg:pb-0">

      {/* Account ribbon */}
      <div style={{
        display: "flex", alignItems: "center", gap: 0,
        borderBottom: "0.5px solid var(--border)",
        background: "var(--bg-surface)",
        overflowX: "auto", flexShrink: 0,
        scrollbarWidth: "none",
      }}>
        {[
          {
            label: "Real balance",
            value: formatCurrency(wallets.realBalance.amount, "INR"),
            pill: "Protected", pillColor: "var(--text-muted)", pillBg: "var(--bg-overlay)",
            color: "var(--text-primary)",
          },
          {
            label: "Demo balance",
            value: formatCurrency(demoBalance, "USD"),
            pill: "Active", pillColor: "var(--green)", pillBg: "var(--green-dim)",
            color: "var(--green)",
          },
          {
            label: "Session P&L",
            value: `${profitSign}${profitPercent.toFixed(2)}%`,
            pill: null, color: profitColor,
          },
          {
            label: "Next reward",
            value: "10% profit",
            pill: "🎯", pillColor: "var(--amber)", pillBg: "var(--amber-dim)",
            color: "var(--amber)",
          },
        ].map((item, i) => (
          <div key={i} style={{
            padding: "8px 16px", flexShrink: 0,
            borderRight: "0.5px solid var(--border)",
            display: "flex", flexDirection: "column", gap: 1,
          }}>
            <span style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.04em" }}>
              {item.label}
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{
                fontSize: 14, fontFamily: "var(--font-mono)", fontWeight: 600,
                color: item.color,
              }}>{item.value}</span>
              {item.pill && (
                <span style={{
                  fontSize: 10, padding: "1px 6px", borderRadius: 99,
                  background: item.pillBg, color: item.pillColor,
                }}>{item.pill}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Main area */}
      <div style={{ display: "flex", flex: 1, minHeight: 0, overflow: "hidden" }}>

        {/* Chart */}
        <div style={{ flex: 1, minWidth: 0, overflow: "hidden" }}>
          <TradingViewChart symbol={activeSymbol} onSymbolChange={setActiveSymbol} />
        </div>

        {/* Order panel — responsive toggle on mobile */}
        <div style={{
          width: panelOpen ? 280 : 0,
          flexShrink: 0,
          overflow: "hidden",
          transition: "width 0.2s ease",
        }}
          className="hidden lg:block"
        >
          <div style={{ width: 280, height: "100%", overflowY: "auto" }}>
            <OrderPanel symbol={activeSymbol} onSymbolChange={setActiveSymbol} />
          </div>
        </div>

      </div>

      {/* Mobile bottom sheet */}
      <OrderPanelMobile symbol={activeSymbol} onSymbolChange={setActiveSymbol} />

      {/* Bottom panel */}
      <TerminalBottomPanel positions={positions} trades={trades} />
    </div>
  );
}