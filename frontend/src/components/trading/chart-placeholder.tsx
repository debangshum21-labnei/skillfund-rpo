"use client";

import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";

const SYMBOL_MAP: Record<string, string> = {
  "EUR/USD": "FX:EURUSD",
  "GBP/USD": "FX:GBPUSD",
  "XAU/USD": "OANDA:XAUUSD",
  "USD/JPY": "FX:USDJPY",
};

const TIMEFRAMES = ["1", "5", "15", "60", "D"];

interface ChartProps {
  symbol?: string;
}

export function ChartPlaceholder({ symbol = "EUR/USD" }: ChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeInterval, setActiveInterval] = useState("60");

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = () => {
      if (typeof (window as any).TradingView === "undefined") return;
      new (window as any).TradingView.widget({
        autosize: true,
        symbol: SYMBOL_MAP[symbol] ?? "FX:EURUSD",
        interval: activeInterval,
        timezone: "Etc/UTC",
        theme: "dark",
        style: "1",
        locale: "en",
        toolbar_bg: "#131722",
        enable_publishing: false,
        hide_side_toolbar: false,
        allow_symbol_change: false,
        container_id: "tv_chart_container",
      });
    };

    containerRef.current.appendChild(script);
  }, [symbol, activeInterval]);

  return (
    <div className="min-h-[480px] rounded-card border border-border bg-white p-4 shadow-soft">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-muted">Live chart</p>
          <h2 className="text-xl font-semibold text-primary">{symbol}</h2>
        </div>
        <div className="flex gap-2 flex-wrap">
          {TIMEFRAMES.map((tf) => (
            <button
              key={tf}
              onClick={() => setActiveInterval(tf)}
              className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${
                activeInterval === tf
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-muted border-border hover:border-primary"
              }`}
            >
              {tf === "D" ? "1D" : tf === "60" ? "1H" : tf + "m"}
            </button>
          ))}
          <Badge>Live</Badge>
        </div>
      </div>
      <div
        id="tv_chart_container"
        ref={containerRef}
        className="h-[380px] rounded-xl overflow-hidden"
      />
    </div>
  );
}