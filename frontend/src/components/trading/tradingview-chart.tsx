"use client";

import Script from "next/script";
import { useEffect, useId, useMemo, useState } from "react";
import { RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    TradingView?: {
      widget: new (config: TradingViewWidgetConfig) => unknown;
    };
  }
}

type TradingViewWidgetConfig = {
  width: string;
  height: string | number;
  symbol: string;
  interval: string;
  timezone: string;
  theme: "dark" | "light";
  style: string;
  locale: string;
  toolbar_bgcolor: string;
  enable_publishing: boolean;
  allow_symbol_change: boolean;
  hide_side_toolbar: boolean;
  studies?: string[];
  container_id: string;
};

export const SYMBOLS = [
  { label: "AAPL",    value: "NASDAQ:AAPL" },
  { label: "EUR/USD", value: "FX:EURUSD" },
  { label: "BTC/USD", value: "BINANCE:BTCUSDT" },
  { label: "NIFTY",   value: "NSE:NIFTY" },
];

interface Props {
  symbol: string;
  onSymbolChange: (symbol: string) => void;
}

export function TradingViewChart({ symbol, onSymbolChange }: Props) {
  const generatedId = useId();
  const containerId = useMemo(() => `tradingview-${generatedId.replace(/:/g, "")}`, [generatedId]);
  const [scriptReady, setScriptReady] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!scriptReady || !window.TradingView) return;
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = "";

    new window.TradingView.widget({
      width: "100%",
      height: "100%",
      symbol,
      interval: "60",
      timezone: "Etc/UTC",
      theme: "dark",
      style: "1",
      locale: "en",
      toolbar_bgcolor: "#131722",
      enable_publishing: false,
      allow_symbol_change: false,
      hide_side_toolbar: false,
      studies: ["Volume@tv-basicstudies"],
      container_id: containerId,
    });

    return () => { container.innerHTML = ""; };
  }, [containerId, reloadKey, scriptReady, symbol]);

  return (
    <section className="rounded-card border border-border bg-white p-4 shadow-soft">
      <Script
        src="https://s3.tradingview.com/tv.js"
        strategy="afterInteractive"
        onLoad={() => setScriptReady(true)}
      />
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-medium text-muted">Live market chart</p>
          <h2 className="text-xl font-semibold text-primary">{symbol}</h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="success">TradingView</Badge>
          {SYMBOLS.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => onSymbolChange(item.value)}
              className={cn(
                "h-9 rounded-lg border px-3 text-xs font-semibold transition",
                symbol === item.value
                  ? "border-primary bg-primary text-white"
                  : "border-border bg-white text-slate-600 hover:bg-slate-50 hover:text-primary",
              )}
            >
              {item.label}
            </button>
          ))}
          <Button
            type="button"
            variant="secondary"
            size="icon"
            onClick={() => setReloadKey((v) => v + 1)}
            aria-label="Reload chart"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="relative h-[520px] overflow-hidden rounded-xl border border-slate-800 bg-[#131722]">
        {!scriptReady && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-slate-600 border-t-success" />
              <p className="mt-3 text-sm text-slate-300">Loading TradingView chart</p>
            </div>
          </div>
        )}
        <div id={containerId} className="h-full w-full" />
      </div>
    </section>
  );
}