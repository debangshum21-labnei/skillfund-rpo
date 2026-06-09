"use client";

import Script from "next/script";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Maximize2, Minimize2, RefreshCw, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SYMBOLS } from "@/components/trading/symbols";

export { SYMBOLS } from "@/components/trading/symbols";

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

const TIMEFRAMES = [
  { label: "1m", value: "1" },
  { label: "5m", value: "5" },
  { label: "15m", value: "15" },
  { label: "1H", value: "60" },
  { label: "4H", value: "240" },
  { label: "1D", value: "D" },
  { label: "1W", value: "W" },
];

interface Props {
  symbol: string;
  onSymbolChange: (symbol: string) => void;
}

export function TradingViewChart({ symbol, onSymbolChange }: Props) {
  const generatedId = useId();
  const containerId = useMemo(() => `tradingview-${generatedId.replace(/:/g, "")}`, [generatedId]);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [scriptReady, setScriptReady] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [interval, setInterval] = useState("60");
  const [fullscreen, setFullscreen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [toolbarBg, setToolbarBg] = useState("#161D2E");

  useEffect(() => {
    // Set initial theme
    const isLight = document.documentElement.classList.contains("light");
    setTheme(isLight ? "light" : "dark");

    // Read toolbar bg color from CSS variable
    const bg = getComputedStyle(document.documentElement).getPropertyValue("--bg-elevated").trim();
    if (bg) setToolbarBg(bg);

    // Observe class list changes to toggle theme dynamically
    const observer = new MutationObserver(() => {
      const currentIsLight = document.documentElement.classList.contains("light");
      setTheme(currentIsLight ? "light" : "dark");
      const updatedBg = getComputedStyle(document.documentElement).getPropertyValue("--bg-elevated").trim();
      if (updatedBg) setToolbarBg(updatedBg);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!scriptReady || !window.TradingView) return;
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = "";

    new window.TradingView.widget({
      width: "100%",
      height: "100%",
      symbol,
      interval,
      timezone: "Asia/Kolkata",
      theme,
      style: "1",
      locale: "en",
      toolbar_bgcolor: toolbarBg,
      enable_publishing: false,
      allow_symbol_change: false,
      hide_side_toolbar: false,
      studies: ["Volume@tv-basicstudies", "RSI@tv-basicstudies"],
      container_id: containerId,
    });

    return () => { container.innerHTML = ""; };
  }, [containerId, reloadKey, scriptReady, symbol, interval, theme]);

  useEffect(() => {
    const handler = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      wrapperRef.current?.requestFullscreen().catch(() => { });
    } else {
      document.exitFullscreen().catch(() => { });
    }
  };

  return (
    <div
      ref={wrapperRef}
      className={cn(
        "flex flex-col overflow-hidden border border-border shadow-soft transition-all duration-200 h-full w-full",
        fullscreen
          ? "fixed inset-0 z-[9999] rounded-none"
          : "rounded-card bg-surface",
      )}
    >
      <Script
        src="https://s3.tradingview.com/tv.js"
        strategy="afterInteractive"
        onLoad={() => setScriptReady(true)}
      />

      {/* Header bar */}
      <div className={cn(
        "flex shrink-0 flex-wrap items-center justify-between gap-2 border-b px-4 py-2.5 transition-colors duration-200",
        "bg-[var(--bg-elevated)] border-[var(--border-mid)] text-[var(--text-primary)]"
      )}>
        {/* Symbol tabs */}
        <div className="flex items-center gap-1 overflow-x-auto">
          {SYMBOLS.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => onSymbolChange(item.value)}
              className={cn(
                "whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
                symbol === item.value
                  ? "bg-success text-white"
                  : "text-[var(--text-muted)] hover:bg-[var(--bg-overlay)]/40 hover:text-[var(--text-primary)]",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Timeframe pills */}
        <div className={cn(
          "flex shrink-0 items-center gap-0.5 rounded-lg p-0.5 transition-colors",
          "bg-[var(--bg-overlay)]/45"
        )}>
          {TIMEFRAMES.map((tf) => (
            <button
              key={tf.value}
              type="button"
              onClick={() => setInterval(tf.value)}
              className={cn(
                "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                interval === tf.value
                  ? "bg-[var(--bg-overlay)] text-[var(--text-primary)] shadow-sm"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-overlay)]/40",
              )}
            >
              {tf.label}
            </button>
          ))}
        </div>

        {/* Action icons */}
        <div className="flex shrink-0 items-center gap-1">
          <Button type="button" variant="secondary" size="icon"
            onClick={() => setReloadKey((v) => v + 1)} aria-label="Reload chart"
            className={cn(
              "h-7 w-7 rounded-lg bg-transparent transition-colors",
              "text-[var(--text-muted)] hover:bg-[var(--bg-overlay)]/40 hover:text-[var(--text-primary)]"
            )}>
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>
          <a href={`https://www.tradingview.com/chart/?symbol=${symbol}`}
            target="_blank" rel="noopener noreferrer"
            className={cn(
              "rounded-lg p-1.5 transition-colors",
              "text-[var(--text-muted)] hover:bg-[var(--bg-overlay)]/40 hover:text-[var(--text-primary)]"
            )}>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
          <button type="button" onClick={toggleFullscreen}
            title={fullscreen ? "Exit fullscreen (Esc)" : "Fullscreen"}
            className={cn(
              "rounded-lg p-1.5 transition-colors",
              "text-[var(--text-muted)] hover:bg-[var(--bg-overlay)]/40 hover:text-[var(--text-primary)]"
            )}>
            {fullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      {/* Chart area */}
      <div className="relative min-h-0 flex-1">
        {!scriptReady && (
          <div className={cn(
            "absolute inset-0 flex items-center justify-center transition-colors",
            "bg-[var(--bg-base)]"
          )}>
            <div className="text-center">
              <div className={cn(
                "mx-auto h-9 w-9 animate-spin rounded-full border-2",
                "border-[var(--border-mid)] border-t-success"
              )} />
              <p className={cn(
                "mt-3 text-sm",
                "text-[var(--text-muted)]"
              )}>Loading TradingView chart</p>
            </div>
          </div>
        )}
        <div id={containerId} className="h-full w-full" />
      </div>
    </div>
  );
}