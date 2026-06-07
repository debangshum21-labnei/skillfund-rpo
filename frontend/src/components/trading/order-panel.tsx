"use client";

import { useEffect, useState } from "react";
import { Minus, Plus, TrendingUp, TrendingDown, Zap } from "lucide-react";
import { SYMBOLS } from "@/components/trading/symbols";
import { cn } from "@/lib/utils";

const MOCK_PRICES: Record<string, number> = {
  "NASDAQ:AAPL":     189.5,
  "FX:EURUSD":       1.0861,
  "BINANCE:BTCUSDT": 62021,
  "OANDA:XAUUSD":    2326.5,
  "NSE:NIFTY50":     22400,
};

const MARGIN_PRESETS = [10, 25, 50, 75, 100];
const MAX_DEMO_BALANCE = 105.40;

interface Order {
  id: number;
  symbol: string;
  side: "Buy" | "Sell";
  margin: number;
  leverage: number;
  entryPrice: number;
  time: string;
}

interface Props {
  symbol: string;
  onSymbolChange: (symbol: string) => void;
}

export function OrderPanel({ symbol, onSymbolChange }: Props) {
  const [tab, setTab]           = useState<"Market" | "Limit">("Market");
  const [side, setSide]         = useState<"Buy" | "Sell">("Buy");
  const [leverage, setLeverage] = useState(5);
  const [margin, setMargin]     = useState(22);
  const [livePrice, setLivePrice] = useState<number | null>(null);
  const [orders, setOrders]     = useState<Order[]>([]);
  const [flash, setFlash]       = useState(false);

  const positionSize = margin * leverage;
  const lossBuffer   = ((1 / leverage) * 100).toFixed(1);
  const symLabel     = SYMBOLS.find((s) => s.value === symbol)?.label ?? symbol;

  useEffect(() => {
    setLivePrice(null);
    const ticker = symbol.split(":")[1];
    async function fetchPrice() {
      try {
        const res  = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1m&range=1d`);
        const data = await res.json();
        const price = data?.chart?.result?.[0]?.meta?.regularMarketPrice;
        setLivePrice(price ?? MOCK_PRICES[symbol] ?? null);
      } catch {
        setLivePrice(MOCK_PRICES[symbol] ?? null);
      }
    }
    fetchPrice();
    const id = setInterval(fetchPrice, 15000);
    return () => clearInterval(id);
  }, [symbol]);

  function placeOrder() {
    const entry = livePrice ?? MOCK_PRICES[symbol] ?? 0;
    setOrders((prev) => [
      { id: Date.now(), symbol, side, margin, leverage, entryPrice: entry, time: new Date().toLocaleTimeString() },
      ...prev.slice(0, 9),
    ]);
    setFlash(true);
    setTimeout(() => setFlash(false), 600);
  }

  function applyPreset(pct: number) {
    setMargin(Math.floor((MAX_DEMO_BALANCE * pct) / 100));
  }

  const buyPrice  = livePrice ? livePrice * 1.0001 : null;
  const sellPrice = livePrice ? livePrice * 0.9999 : null;

  return (
    <div className="flex h-full flex-col bg-[#0f172a] text-sm text-white">

      {/* Bid / Ask display */}
      <div className="grid grid-cols-2 border-b border-[#1e293b]">
        <button
          onClick={() => setSide("Sell")}
          className={cn(
            "flex flex-col items-center py-3 transition-colors",
            side === "Sell" ? "bg-red-500/10" : "hover:bg-red-500/5"
          )}
        >
          <span className="text-xs text-slate-500">SELL</span>
          <span className={cn("text-xl font-bold tabular-nums", side === "Sell" ? "text-danger" : "text-slate-300")}>
            {sellPrice ? sellPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 5 }) : "—"}
          </span>
        </button>
        <button
          onClick={() => setSide("Buy")}
          className={cn(
            "flex flex-col items-center py-3 transition-colors",
            side === "Buy" ? "bg-green-500/10" : "hover:bg-green-500/5"
          )}
        >
          <span className="text-xs text-slate-500">BUY</span>
          <span className={cn("text-xl font-bold tabular-nums", side === "Buy" ? "text-success" : "text-slate-300")}>
            {buyPrice ? buyPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 5 }) : "—"}
          </span>
        </button>
      </div>

      {/* Order type tabs */}
      <div className="flex border-b border-[#1e293b]">
        {(["Market", "Limit"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "flex-1 py-2 text-xs font-semibold transition-colors",
              tab === t ? "border-b-2 border-success text-success" : "text-slate-500 hover:text-slate-300"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">

        {/* Market selector */}
        <div>
          <label className="mb-1 block text-xs text-slate-500">Market</label>
          <select
            value={symbol}
            onChange={(e) => onSymbolChange(e.target.value)}
            className="h-9 w-full rounded-lg border border-[#1e293b] bg-[#1e293b] px-3 text-sm text-white focus:border-success focus:outline-none"
          >
            {SYMBOLS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>

        {/* Margin input + presets */}
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="text-xs text-slate-500">Margin ($)</label>
            <span className="text-xs text-slate-500">Max: ${MAX_DEMO_BALANCE}</span>
          </div>
          <input
            type="number"
            value={margin}
            onChange={(e) => setMargin(Number(e.target.value) || 0)}
            className="h-9 w-full rounded-lg border border-[#1e293b] bg-[#1e293b] px-3 text-sm text-white focus:border-success focus:outline-none"
          />
          <div className="mt-2 grid grid-cols-5 gap-1">
            {MARGIN_PRESETS.map((pct) => (
              <button
                key={pct}
                onClick={() => applyPreset(pct)}
                className="rounded-md border border-[#1e293b] py-1 text-xs text-slate-400 transition-colors hover:border-success hover:text-success"
              >
                {pct}%
              </button>
            ))}
          </div>
        </div>

        {/* Leverage */}
        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="text-xs text-slate-500">Leverage</label>
            <span className="text-xs font-bold text-white">{leverage}x</span>
          </div>
          <input
            type="range"
            min={1}
            max={100}
            value={leverage}
            onChange={(e) => setLeverage(Number(e.target.value))}
            className="w-full accent-success"
          />
          <div className="mt-1 flex justify-between text-[10px] text-slate-600">
            <span>1x</span><span>25x</span><span>50x</span><span>75x</span><span>100x</span>
          </div>
          {/* Quick leverage buttons */}
          <div className="mt-2 grid grid-cols-5 gap-1">
            {[2, 5, 10, 20, 50].map((lv) => (
              <button
                key={lv}
                onClick={() => setLeverage(lv)}
                className={cn(
                  "rounded-md border py-1 text-xs transition-colors",
                  leverage === lv
                    ? "border-success bg-success/10 text-success"
                    : "border-[#1e293b] text-slate-400 hover:border-slate-500"
                )}
              >
                {lv}x
              </button>
            ))}
          </div>
        </div>

        {/* Order summary */}
        <div className="rounded-lg border border-[#1e293b] bg-[#1e293b]/50 p-3 space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-slate-500">Position size</span>
            <span className="font-semibold text-white">${positionSize.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-500">Loss buffer</span>
            <span className="font-semibold text-white">{lossBuffer}%</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-500">Entry price</span>
            <span className="font-semibold text-white">
              {livePrice ? livePrice.toLocaleString(undefined, { maximumFractionDigits: 5 }) : "—"}
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-slate-500">Mode</span>
            <span className="rounded bg-green-900/40 px-1.5 text-success">Simulated</span>
          </div>
        </div>

        {/* Place order button */}
        <button
          onClick={placeOrder}
          className={cn(
            "w-full rounded-lg py-3 text-sm font-bold transition-all",
            flash ? "scale-95" : "scale-100",
            side === "Buy"
              ? "bg-success text-white hover:bg-green-400"
              : "bg-danger text-white hover:bg-red-400"
          )}
        >
          <span className="flex items-center justify-center gap-2">
            <Zap className="h-4 w-4" />
            {side} {symLabel} · {leverage}x
          </span>
        </button>

        {/* Recent orders */}
        {orders.length > 0 && (
          <div>
            <p className="mb-2 text-xs font-semibold uppercase text-slate-500">Recent orders</p>
            <div className="space-y-1.5">
              {orders.map((o) => (
                <div key={o.id} className="flex items-center justify-between rounded-lg border border-[#1e293b] bg-[#1e293b]/50 px-3 py-2 text-xs">
                  <div className="flex items-center gap-2">
                    {o.side === "Buy"
                      ? <TrendingUp className="h-3 w-3 text-success" />
                      : <TrendingDown className="h-3 w-3 text-danger" />}
                    <span className={o.side === "Buy" ? "font-semibold text-success" : "font-semibold text-danger"}>{o.side}</span>
                    <span className="text-slate-500">{SYMBOLS.find((s) => s.value === o.symbol)?.label}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-white">@ {o.entryPrice.toLocaleString(undefined, { maximumFractionDigits: 5 })}</p>
                    <p className="text-slate-500">{o.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}