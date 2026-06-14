"use client";

import { useState } from "react";
import { Minus, Plus, TrendingUp, TrendingDown, Zap, Target } from "lucide-react";
import { SYMBOLS } from "@/components/trading/symbols";
import { activeSession } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { useTradingStore } from "@/store/trading-store";

const MOCK_PRICES: Record<string, number> = {
  "NASDAQ:AAPL": 189.5,
  "FX:EURUSD": 1.0861,
  "BINANCE:BTCUSDT": 62021,
  "OANDA:XAUUSD": 2326.5,
  "NSE:NIFTY50": 22400,
};

const MARGIN_PRESETS = [10, 25, 50, 75, 100];

interface Order {
  id: number; symbol: string; side: "Buy" | "Sell";
  margin: number; leverage: number; entryPrice: number; time: string;
}

interface Props { symbol: string; onSymbolChange: (symbol: string) => void; }

export function OrderPanel({ symbol, onSymbolChange }: Props) {
  const [tab, setTab] = useState<"Market" | "Limit">("Market");
  const [side, setSide] = useState<"Buy" | "Sell">("Buy");
  const [leverage, setLeverage] = useState(5);
  const [margin, setMargin] = useState(22);
  const [orders, setOrders] = useState<Order[]>([]);
  const [flash, setFlash] = useState(false);

  const demoBalance = useTradingStore((state) => state.demoBalance);
  const startingDemoBalance = useTradingStore((state) => state.startingDemoBalance);
  const positions = useTradingStore((state) => state.positions);
  const prices = useTradingStore((state) => state.prices);
  const isMockMap = useTradingStore((state) => state.isMock);
  const openPosition = useTradingStore((state) => state.openPosition);

  const livePrice = prices[symbol] ?? MOCK_PRICES[symbol] ?? null;
  const isMock = isMockMap[symbol] ?? false;

  const positionSize = margin * leverage;
  const lossBuffer = ((1 / leverage) * 100).toFixed(1);
  const symLabel = SYMBOLS.find((s) => s.value === symbol)?.label ?? symbol;

  const totalUnrealizedPnl = positions.reduce((sum, p) => sum + p.unrealizedPnl, 0);
  const currentEquity = demoBalance + totalUnrealizedPnl;
  const profitPercent = ((currentEquity - startingDemoBalance) / startingDemoBalance) * 100;
  const targetProfitPercent = activeSession.targetProfitPercent;
  const sessionPct = Math.min(Math.max((profitPercent / targetProfitPercent) * 100, 0), 100);

  function placeOrder() {
    if (atMaxPositions) return;
    const entry = livePrice ?? MOCK_PRICES[symbol] ?? 0;
    if (margin <= 0) {
      alert("Please enter a valid margin amount.");
      return;
    }
    const totalUsedMargin = positions.reduce((sum, p) => sum + p.margin, 0);
    if (totalUsedMargin + margin > demoBalance) {
      alert("Insufficient demo balance to open this position.");
      return;
    }
    openPosition(symbol, side, margin, leverage, entry);

    setOrders((prev) => [
      { id: Date.now(), symbol, side, margin, leverage, entryPrice: entry, time: new Date().toLocaleTimeString() },
      ...prev.slice(0, 9),
    ]);
    setFlash(true);
    setTimeout(() => setFlash(false), 500);
  }

  function applyPreset(pct: number) {
    setMargin(Math.floor((demoBalance * pct) / 100));
  }

  const atMaxPositions = positions.length >= 2;

  const buyPrice = livePrice ? livePrice * 1.0001 : null;
  const sellPrice = livePrice ? livePrice * 0.9999 : null;

  const priceStr = (p: number | null) =>
    p ? p.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 5 }) : "—";

  return (
    <div style={{
      display: "flex", flexDirection: "column", height: "100%",
      background: "var(--bg-surface)",
      borderLeft: "0.5px solid var(--border)",
      fontSize: 13,
    }}>
      {/* Session progress bar */}
      <div style={{
        padding: "8px 12px",
        borderBottom: "0.5px solid var(--border)",
        background: "var(--bg-elevated)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "var(--text-muted)" }}>
            <Target size={11} /> Session goal
          </span>
          <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--green)" }}>
            {profitPercent >= 0 ? "+" : ""}{profitPercent.toFixed(1)}% / +{targetProfitPercent}%
          </span>
        </div>
        <div style={{ height: 3, borderRadius: 99, background: "var(--bg-overlay)", overflow: "hidden" }}>
          <div style={{
            height: "100%", borderRadius: 99,
            background: sessionPct > 80 ? "var(--amber)" : "var(--green)",
            width: `${sessionPct}%`,
            transition: "width 0.6s ease",
            boxShadow: `0 0 6px ${sessionPct > 80 ? "var(--amber-dim)" : "var(--green-glow)"}`,
          }} />
        </div>
      </div>

      {/* Bid / Ask */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: "0.5px solid var(--border)" }}>
        {[
          { label: "SELL", price: sellPrice, isSide: "Sell" as const, color: "var(--red)" },
          { label: "BUY", price: buyPrice, isSide: "Buy" as const, color: "var(--green)" },
        ].map(({ label, price, isSide, color }) => (
          <button
            key={label}
            disabled={atMaxPositions}
            onClick={() => {
              if (atMaxPositions) return;
              setSide(isSide);
            }}
            style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              padding: "10px 8px", cursor: atMaxPositions ? "not-allowed" : "pointer", border: "none",
              background: side === isSide ? (isSide === "Buy" ? "var(--green-dim)" : "var(--red-dim)") : "transparent",
              borderBottom: side === isSide ? `2px solid ${color}` : "2px solid transparent",
              opacity: atMaxPositions ? 0.45 : 1,
              transition: "all 0.15s",
            }}
          >
            <span style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.06em" }}>{label}</span>
            <span style={{
              fontSize: 17, fontFamily: "var(--font-mono)", fontWeight: 600,
              color: side === isSide ? color : "var(--text-secondary)",
              letterSpacing: "-0.02em",
            }}>
              {priceStr(price)}
            </span>
          </button>
        ))}
      </div>

      {/* Order type tabs */}
      <div style={{ display: "flex", borderBottom: "0.5px solid var(--border)" }}>
        {(["Market", "Limit"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex: 1, padding: "7px 0", fontSize: 12, fontWeight: 500, cursor: "pointer",
            border: "none", background: "transparent",
            color: tab === t ? "var(--text-primary)" : "var(--text-muted)",
            borderBottom: tab === t ? "2px solid var(--green)" : "2px solid transparent",
            transition: "all 0.15s",
          }}>{t}</button>
        ))}
      </div>

      {/* Form body */}
      <div style={{ flex: 1, overflowY: "auto", padding: 12, display: "flex", flexDirection: "column", gap: 10 }}>

        {/* Max positions warning */}
        {atMaxPositions && (
          <div style={{
            padding: "8px 10px", borderRadius: "var(--radius-sm)",
            background: "var(--amber-dim)", border: "0.5px solid var(--amber)",
            fontSize: 11, color: "var(--amber)", textAlign: "center", fontWeight: 500,
          }}>
            Maximum 2 active positions allowed.
          </div>
        )}

        {/* Market */}
        <div>
          <label style={{ fontSize: 11, color: "var(--text-muted)", display: "block", marginBottom: 4 }}>Market</label>
          <select
            value={symbol} onChange={(e) => onSymbolChange(e.target.value)}
            style={{
              width: "100%", height: 36, padding: "0 10px",
              borderRadius: "var(--radius-sm)",
              border: "0.5px solid var(--border-mid)",
              background: "var(--bg-elevated)", color: "var(--text-primary)",
              fontSize: 13, outline: "none", cursor: "pointer",
            }}
          >
            {SYMBOLS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>

        {/* Mock price indicator */}
        {isMock && livePrice && (
          <div           style={{
            padding: "5px 8px", borderRadius: "var(--radius-sm)",
            background: "var(--amber-dim)", border: "0.5px solid var(--amber)",
            fontSize: 11, color: "var(--amber)", display: "flex", alignItems: "center", gap: 5,
          }}>
            ⚡ Using reference price · live feed unavailable
          </div>
        )}

        {/* Margin */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <label style={{ fontSize: 11, color: "var(--text-muted)" }}>Margin ($)</label>
            <span style={{ fontSize: 11, color: "var(--text-muted)" }}>Max: ${demoBalance.toFixed(2)}</span>
          </div>
          <input
            type="number" value={margin}
            onChange={(e) => setMargin(Number(e.target.value) || 0)}
            style={{
              width: "100%", height: 36, padding: "0 10px",
              borderRadius: "var(--radius-sm)",
              border: "0.5px solid var(--border-mid)",
              background: "var(--bg-elevated)", color: "var(--text-primary)",
              fontSize: 13, outline: "none",
            }}
          />
          <div className="grid grid-cols-5 gap-1 mt-1.5">
            {MARGIN_PRESETS.map((pct) => (
              <button
                key={pct}
                type="button"
                onClick={() => applyPreset(pct)}
                className="py-1 text-[11px] font-medium cursor-pointer rounded-sm border border-[var(--border-mid)] bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-all duration-150"
              >
                {pct}%
              </button>
            ))}
          </div>
        </div>

        {/* Leverage */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
            <label style={{ fontSize: 11, color: "var(--text-muted)" }}>Leverage</label>
            <span style={{ fontSize: 12, fontFamily: "var(--font-mono)", fontWeight: 600, color: "var(--text-primary)" }}>{leverage}x</span>
          </div>
          <input
            type="range" min={1} max={100} value={leverage}
            onChange={(e) => setLeverage(Number(e.target.value))}
            style={{ width: "100%", accentColor: "var(--green)" }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--text-muted)", marginTop: 2 }}>
            {["1x", "25x", "50x", "75x", "100x"].map(l => <span key={l}>{l}</span>)}
          </div>
          <div className="grid grid-cols-5 gap-1 mt-1.5">
            {[2, 5, 10, 20, 50].map((lv) => (
              <button
                key={lv}
                type="button"
                onClick={() => setLeverage(lv)}
                className={cn(
                  "py-1 text-[11px] font-medium cursor-pointer rounded-sm border transition-all duration-150",
                  leverage === lv
                    ? "border-[var(--green)] bg-[var(--green-dim)] text-[var(--green)]"
                    : "border-[var(--border-mid)] bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
                )}
              >
                {lv}x
              </button>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div style={{
          borderRadius: "var(--radius-sm)",
          background: "var(--bg-elevated)",
          border: "0.5px solid var(--border)",
          padding: "8px 10px",
          display: "flex", flexDirection: "column", gap: 5,
        }}>
          {[
            ["Position size", `$${positionSize.toFixed(2)}`],
            ["Loss buffer", `${lossBuffer}%`],
            ["Entry price", livePrice ? livePrice.toLocaleString(undefined, { maximumFractionDigits: 5 }) : "—"],
            ["Mode", "Simulated"],
          ].map(([label, value]) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
              <span style={{ color: "var(--text-muted)" }}>{label}</span>
              <span style={{
                fontFamily: label === "Mode" ? "inherit" : "var(--font-mono)",
                color: label === "Mode" ? "var(--green)" : "var(--text-primary)",
                fontWeight: 500,
              }}>{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Place order CTA */}
      <div style={{ padding: "10px 12px", borderTop: "0.5px solid var(--border)", flexShrink: 0 }}>
        <button
          disabled={atMaxPositions}
          onClick={placeOrder}
          className="w-full h-11 rounded-md font-bold text-sm flex items-center justify-center gap-2 transition-all duration-150"
          style={{
            border: "none",
            cursor: atMaxPositions ? "not-allowed" : "pointer",
            background: atMaxPositions ? "var(--bg-overlay)" : (side === "Buy" ? "var(--green)" : "var(--red)"),
            color: atMaxPositions ? "var(--text-muted)" : "#FFFFFF",
            transform: flash ? "scale(0.97)" : "scale(1)",
            boxShadow: atMaxPositions
              ? "none"
              : (side === "Buy" ? "0 0 20px var(--green-glow)" : "0 0 20px var(--red-dim)"),
          }}
        >
          <Zap size={16} />
          {side} {symLabel} · {leverage}x
        </button>
      </div>

      {/* Recent orders */}
      {orders.length > 0 && (
        <div style={{
          borderTop: "0.5px solid var(--border)",
          padding: "8px 12px",
          maxHeight: 160, overflowY: "auto", flexShrink: 0,
        }}>
          <p style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>
            Recent orders
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {orders.map((o) => (
              <div key={o.id} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "5px 8px", borderRadius: "var(--radius-sm)",
                background: "var(--bg-elevated)", border: "0.5px solid var(--border)",
                fontSize: 11,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  {o.side === "Buy"
                    ? <TrendingUp size={11} color="var(--green)" />
                    : <TrendingDown size={11} color="var(--red)" />}
                  <span style={{ color: o.side === "Buy" ? "var(--green)" : "var(--red)", fontWeight: 600 }}>{o.side}</span>
                  <span style={{ color: "var(--text-muted)" }}>{SYMBOLS.find((s) => s.value === o.symbol)?.label}</span>
                </div>
                <div style={{ textAlign: "right", fontFamily: "var(--font-mono)" }}>
                  <p style={{ color: "var(--text-primary)", margin: 0 }}>
                    @ {o.entryPrice.toLocaleString(undefined, { maximumFractionDigits: 5 })}
                  </p>
                  <p style={{ color: "var(--text-muted)", margin: 0 }}>{o.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}