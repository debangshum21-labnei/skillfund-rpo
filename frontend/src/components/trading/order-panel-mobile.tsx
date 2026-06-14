"use client";

import { useState, useEffect } from "react";
import { Zap } from "lucide-react";
import { SYMBOLS } from "@/components/trading/symbols";
import { cn } from "@/lib/utils";
import { useTradingStore } from "@/store/trading-store";
import { useSessionStore } from "@/store/session-store";
import { SessionConfirmModal } from "@/components/trading/session-confirm-modal";

const MOCK_PRICES: Record<string, number> = {
  "NASDAQ:AAPL": 189.5,
  "FX:EURUSD": 1.0861,
  "BINANCE:BTCUSDT": 62021,
  "OANDA:XAUUSD": 2326.5,
  "NSE:NIFTY50": 22400,
};

const MARGIN_PRESETS = [10, 25, 50, 75, 100];

interface Props {
  symbol: string;
  onSymbolChange: (symbol: string) => void;
}

export function OrderPanelMobile({ symbol }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [side, setSide] = useState<"Buy" | "Sell">("Buy");
  const [leverage, setLeverage] = useState(5);
  const [margin, setMargin] = useState(22);
  const [flash, setFlash] = useState(false);
  const [now, setNow] = useState(Date.now());
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [pendingOrder, setPendingOrder] = useState<{
    symbol: string; side: "Buy" | "Sell"; margin: number; leverage: number; entry: number;
  } | null>(null);

  const session = useSessionStore((s) => s.session);
  const startSession = useSessionStore((s) => s.startSession);

  useEffect(() => {
    if (!session.cooldownEndsAt || session.cooldownEndsAt <= Date.now()) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [session.cooldownEndsAt]);

  const cooldownRemaining = session.cooldownEndsAt
    ? Math.max(0, Math.floor((session.cooldownEndsAt - now) / 1000))
    : 0;
  const inCooldown = cooldownRemaining > 0;

  const demoBalance = useTradingStore((state) => state.demoBalance);
  const positions = useTradingStore((state) => state.positions);
  const prices = useTradingStore((state) => state.prices);
  const openPosition = useTradingStore((state) => state.openPosition);

  const livePrice = prices[symbol] ?? MOCK_PRICES[symbol] ?? null;
  const entryPrice = livePrice ?? MOCK_PRICES[symbol] ?? 0;

  const atMaxPositions = positions.length >= 2;
  const symLabel = SYMBOLS.find((s) => s.value === symbol)?.label ?? symbol;

  const buyPrice = livePrice ? livePrice * 1.0001 : null;
  const sellPrice = livePrice ? livePrice * 0.9999 : null;

  const quantity = livePrice
    ? parseFloat((margin * leverage / livePrice).toFixed(6))
    : 0;

  const priceStr = (p: number | null) =>
    p ? p.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 5 }) : "—";

  function handleSideSelect(s: "Buy" | "Sell") {
    if (atMaxPositions || inCooldown) return;
    if (side === s && showForm) {
      setShowForm(false);
      return;
    }
    setSide(s);
    setShowForm(true);
  }

  function placeOrder() {
    if (atMaxPositions || inCooldown) return;
    if (margin <= 0) return;
    const totalUsedMargin = positions.reduce((sum, p) => sum + p.margin, 0);
    if (totalUsedMargin + margin > demoBalance) return;

    if (session.status !== "active") {
      setPendingOrder({ symbol, side, margin, leverage, entry: entryPrice });
      setShowSessionModal(true);
      return;
    }

    executeTrade(symbol, side, margin, leverage, entryPrice);
  }

  function executeTrade(sym: string, s: "Buy" | "Sell", mg: number, lv: number, entry: number) {
    openPosition(sym, s, mg, lv, entry);
    setFlash(true);
    setTimeout(() => {
      setFlash(false);
      setShowForm(false);
    }, 500);
  }

  function handleStartSessionAndTrade() {
    const order = pendingOrder;
    setShowSessionModal(false);
    setPendingOrder(null);
    if (!order) return;
    startSession();
    executeTrade(order.symbol, order.side, order.margin, order.leverage, order.entry);
  }

  function applyPreset(pct: number) {
    setMargin(Math.floor((demoBalance * pct) / 100));
  }

  const isBuy = side === "Buy";

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 lg:hidden"
      style={{
        background: "var(--bg-surface)",
        borderTop: "0.5px solid var(--border)",
        boxShadow: "0 -4px 24px rgba(0,0,0,0.2)",
      }}
    >
      {/* Buy / Sell action bar — always visible */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
        {[
          { label: "SELL", price: sellPrice, val: "Sell" as const, color: "var(--red)", activeBg: "var(--red-dim)" },
          { label: "BUY", price: buyPrice, val: "Buy" as const, color: "var(--green)", activeBg: "var(--green-dim)" },
        ].map(({ label, price, val, color, activeBg }) => {
          const isActive = side === val;
          return (
            <button
              key={label}
              disabled={atMaxPositions || inCooldown}
              onClick={() => handleSideSelect(val)}
              style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                padding: "10px 8px", border: "none", cursor: (atMaxPositions || inCooldown) ? "not-allowed" : "pointer",
                background: isActive ? activeBg : "transparent",
                borderBottom: isActive ? `2px solid ${color}` : "2px solid transparent",
                opacity: (atMaxPositions || inCooldown) ? 0.45 : 1,
                transition: "all 0.15s",
              }}
            >
              <span style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.06em" }}>
                {label}
              </span>
              <span style={{
                fontSize: 15, fontFamily: "var(--font-mono)", fontWeight: 600,
                color: isActive ? color : "var(--text-secondary)",
              }}>
                {priceStr(price)}
              </span>
            </button>
          );
        })}
      </div>

      {/* Trade form — slides in when user picks a direction */}
      <div
        style={{
          overflow: "hidden",
          maxHeight: showForm ? 520 : 0,
          transition: "max-height 0.35s ease",
        }}
      >
        <div style={{ padding: "12px 12px 16px", display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Max positions warning */}
          {atMaxPositions && (
            <div style={{
              padding: "8px 10px", borderRadius: "var(--radius-sm)",
              background: "var(--amber-dim)", border: "0.5px solid var(--amber)",
              fontSize: 12, color: "var(--amber)", textAlign: "center", fontWeight: 500,
            }}>
              Maximum 2 active positions allowed.
            </div>
          )}

          {/* Cooldown warning */}
          {inCooldown && (
            <div style={{
              padding: "8px 10px", borderRadius: "var(--radius-sm)",
              background: "var(--amber-dim)", border: "0.5px solid var(--amber)",
              fontSize: 12, color: "var(--amber)", textAlign: "center", fontWeight: 500,
            }}>
              Please wait {cooldownRemaining}s before opening another position.
            </div>
          )}

          {/* Margin */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
              <label style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500 }}>
                Margin ($)
              </label>
              <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
                Max: ${demoBalance.toFixed(2)}
              </span>
            </div>
            <input
              type="number" value={margin}
              onChange={(e) => setMargin(Number(e.target.value) || 0)}
              style={{
                width: "100%", height: 44, padding: "0 12px", fontSize: 15,
                borderRadius: "var(--radius-sm)", outline: "none",
                border: "0.5px solid var(--border-mid)",
                background: "var(--bg-elevated)", color: "var(--text-primary)",
              }}
            />
            <div className="grid grid-cols-5 gap-2 mt-2">
              {MARGIN_PRESETS.map((pct) => (
                <button
                  key={pct} type="button" onClick={() => applyPreset(pct)}
                  className="py-[10px] text-[13px] font-medium cursor-pointer rounded-sm border border-[var(--border-mid)] bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-all duration-150"
                >
                  {pct}%
                </button>
              ))}
            </div>
          </div>

          {/* Leverage */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
              <label style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500 }}>
                Leverage
              </label>
              <span style={{
                fontSize: 14, fontFamily: "var(--font-mono)", fontWeight: 600,
                color: "var(--text-primary)",
              }}>
                {leverage}x
              </span>
            </div>
            <input
              type="range" min={1} max={100} value={leverage}
              onChange={(e) => setLeverage(Number(e.target.value))}
              style={{ width: "100%", height: 32, accentColor: "var(--green)" }}
            />
            <div className="grid grid-cols-5 gap-2 mt-2">
              {[2, 5, 10, 20, 50].map((lv) => (
                <button
                  key={lv} type="button" onClick={() => setLeverage(lv)}
                  className={cn(
                    "py-[10px] text-[13px] font-medium cursor-pointer rounded-sm border transition-all duration-150",
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

          {/* Trade details row */}
          <div
            style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "8px 10px", borderRadius: "var(--radius-sm)",
              background: "var(--bg-elevated)", border: "0.5px solid var(--border)",
            }}
          >
            <div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 1 }}>Qty</div>
              <div style={{ fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: 13, color: "var(--text-primary)" }}>
                {quantity.toLocaleString(undefined, { maximumFractionDigits: 6 })}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 1 }}>Price</div>
              <div style={{ fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: 13, color: "var(--text-primary)" }}>
                ${priceStr(livePrice)}
              </div>
            </div>
          </div>

          {/* Confirm button */}
          <button
            disabled={atMaxPositions || inCooldown}
            onClick={placeOrder}
            style={{
              width: "100%", height: 48, border: "none", cursor: (atMaxPositions || inCooldown) ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              fontSize: 15, fontWeight: 700, borderRadius: "var(--radius-sm)",
              background: (atMaxPositions || inCooldown) ? "var(--bg-overlay)" : (isBuy ? "var(--green)" : "var(--red)"),
              color: (atMaxPositions || inCooldown) ? "var(--text-muted)" : "#FFFFFF",
              transform: flash ? "scale(0.97)" : "scale(1)",
              transition: "transform 0.15s",
            }}
          >
            <Zap size={18} />
            {isBuy ? "Confirm Buy" : "Confirm Sell"} {symLabel} · {leverage}x
          </button>

          {/* Position summary */}
          {livePrice && (
            <div style={{
              display: "flex", justifyContent: "space-between", fontSize: 11,
              color: "var(--text-muted)", paddingTop: 2,
            }}>
              <span>Position size</span>
              <span style={{ fontFamily: "var(--font-mono)", color: "var(--text-primary)", fontWeight: 500 }}>
                ${(margin * leverage).toFixed(2)}
              </span>
            </div>
          )}
        </div>
      </div>

      <SessionConfirmModal
        isOpen={showSessionModal}
        onConfirm={handleStartSessionAndTrade}
        onCancel={() => { setShowSessionModal(false); setPendingOrder(null); }}
      />
    </div>
  );
}
