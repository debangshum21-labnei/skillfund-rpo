"use client";

import { useEffect, useState } from "react";
import { Minus, Plus, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import { SYMBOLS } from "@/components/trading/symbols";

const SYMBOL_LABELS: Record<string, string> = Object.fromEntries(
  SYMBOLS.map((s) => [s.value, s.label])
);

const MOCK_PRICES: Record<string, number> = {
  "NASDAQ:AAPL":     189.5,
  "FX:EURUSD":       1.0861,
  "BINANCE:BTCUSDT": 60620,
  "OANDA:XAUUSD":    2326.5,
  "NSE:NIFTY50":     22400,
};

interface Order {
  id: number;
  symbol: string;
  side: "Buy" | "Sell";
  margin: number;
  leverage: number;
  positionSize: number;
  entryPrice: number;
  time: string;
}

interface Props {
  symbol: string;
  onSymbolChange: (symbol: string) => void;
}

export function TradingPanel({ symbol, onSymbolChange }: Props) {
  const [leverage, setLeverage] = useState(5);
  const [margin, setMargin] = useState(22);
  const [livePrice, setLivePrice] = useState<number | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  const positionSize = margin * leverage;
  const lossBuffer = ((margin / positionSize) * 100).toFixed(1);

  useEffect(() => {
    setLivePrice(null);
    const ticker = symbol.split(":")[1];

    async function fetchPrice() {
      try {
        const res = await fetch(
          `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1m&range=1d`
        );
        const data = await res.json();
        const price = data?.chart?.result?.[0]?.meta?.regularMarketPrice;
        if (price) setLivePrice(price);
        else setLivePrice(MOCK_PRICES[symbol] ?? null);
      } catch {
        setLivePrice(MOCK_PRICES[symbol] ?? null);
      }
    }

    fetchPrice();
    const interval = setInterval(fetchPrice, 15000);
    return () => clearInterval(interval);
  }, [symbol]);

  function placeOrder(side: "Buy" | "Sell") {
    const entry = livePrice ?? MOCK_PRICES[symbol] ?? 0;
    setOrders((prev) => [
      {
        id: Date.now(),
        symbol,
        side,
        margin,
        leverage,
        positionSize,
        entryPrice: entry,
        time: new Date().toLocaleTimeString(),
      },
      ...prev.slice(0, 4),
    ]);
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Order ticket</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Button variant="success" onClick={() => placeOrder("Buy")}>Buy</Button>
          <Button variant="danger"  onClick={() => placeOrder("Sell")}>Sell</Button>
        </div>

        <div className="rounded-xl border border-border bg-slate-50 px-4 py-3 flex items-center justify-between">
          <span className="text-sm text-muted">Live price</span>
          {livePrice ? (
            <span className="text-lg font-semibold text-primary">
              {livePrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 5 })}
            </span>
          ) : (
            <span className="text-sm text-muted animate-pulse">Fetching…</span>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="market">Market</Label>
          <select
            id="market"
            value={symbol}
            onChange={(e) => onSymbolChange(e.target.value)}
            className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm text-primary shadow-sm"
          >
            {SYMBOLS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="margin">Margin ($)</Label>
          <Input
            id="margin"
            value={margin}
            onChange={(e) => setMargin(Number(e.target.value) || 0)}
            inputMode="decimal"
          />
        </div>

        <div className="space-y-2">
          <Label>Leverage</Label>
          <div className="flex items-center justify-between rounded-xl border border-border bg-slate-50 p-2">
            <Button type="button" variant="secondary" size="icon"
              onClick={() => setLeverage((v) => Math.max(1, v - 1))} aria-label="Decrease leverage">
              <Minus className="h-4 w-4" />
            </Button>
            <span className="text-lg font-semibold text-primary">{leverage}x</span>
            <Button type="button" variant="secondary" size="icon"
              onClick={() => setLeverage((v) => Math.min(100, v + 1))} aria-label="Increase leverage">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-slate-50 p-3 text-sm space-y-2">
          <div className="flex justify-between">
            <span className="text-muted">Position size</span>
            <span className="font-medium text-primary">${positionSize.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Loss buffer</span>
            <span className="font-medium text-primary">{lossBuffer}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Mode</span>
            <span className="font-medium text-primary">Simulated</span>
          </div>
        </div>

        {orders.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase text-muted">Recent orders</p>
            {orders.map((o) => (
              <div key={o.id} className="flex items-center justify-between rounded-lg border border-border bg-white px-3 py-2 text-xs">
                <div className="flex items-center gap-2">
                  {o.side === "Buy"
                    ? <TrendingUp className="h-3 w-3 text-green-500" />
                    : <TrendingDown className="h-3 w-3 text-red-500" />}
                  <span className={o.side === "Buy" ? "font-semibold text-green-600" : "font-semibold text-red-600"}>
                    {o.side}
                  </span>
                  <span className="text-muted">{SYMBOL_LABELS[o.symbol] ?? o.symbol}</span>
                </div>
                <div className="text-right">
                  <p className="font-medium text-primary">@ {o.entryPrice.toLocaleString(undefined, { maximumFractionDigits: 5 })}</p>
                  <p className="text-muted">{o.time}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}