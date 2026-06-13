"use client";

import Script from "next/script";
import { useEffect, useId, useMemo, useRef, useState, useCallback } from "react";
import { Maximize2, Minimize2, RefreshCw, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SYMBOLS } from "@/components/trading/symbols";
import { useTradingStore } from "@/store/trading-store";

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
  const positions = useTradingStore((state) => state.positions);
  const trades = useTradingStore((state) => state.trades);
  const prices = useTradingStore((state) => state.prices);
  const closePosition = useTradingStore((state) => state.closePosition);

  const generatedId = useId();
  const containerId = useMemo(
    () => `tvchart-${generatedId.replace(/:/g, "")}`,
    [generatedId],
  );
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [scriptReady, setScriptReady] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [interval, setInterval] = useState("60");
  const [fullscreen, setFullscreen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [toolbarBg, setToolbarBg] = useState("#161D2E");

  useEffect(() => {
    const isLight = document.documentElement.classList.contains("light");
    setTheme(isLight ? "light" : "dark");

    const bg = getComputedStyle(document.documentElement).getPropertyValue("--bg-elevated").trim();
    if (bg) setToolbarBg(bg);

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

    return () => {
      container.innerHTML = "";
    };
  }, [containerId, reloadKey, scriptReady, symbol, interval, theme, toolbarBg]);

  useEffect(() => {
    const handler = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      wrapperRef.current?.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }, []);

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
      <div className={cn(
        "flex shrink-0 flex-wrap items-center justify-between gap-2 border-b px-4 py-2.5 transition-colors duration-200",
        "bg-[var(--bg-elevated)] border-[var(--border-mid)] text-[var(--text-primary)]"
      )}>
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

        <div className="flex shrink-0 items-center gap-1">
          <Button
            type="button" variant="secondary" size="icon"
            onClick={() => setReloadKey((v) => v + 1)} aria-label="Reload chart"
            className={cn(
              "h-7 w-7 rounded-lg bg-transparent transition-colors",
              "text-[var(--text-muted)] hover:bg-[var(--bg-overlay)]/40 hover:text-[var(--text-primary)]"
            )}
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>
          <a
            href={`https://www.tradingview.com/chart/?symbol=${symbol}`}
            target="_blank" rel="noopener noreferrer"
            className={cn(
              "rounded-lg p-1.5 transition-colors",
              "text-[var(--text-muted)] hover:bg-[var(--bg-overlay)]/40 hover:text-[var(--text-primary)]"
            )}
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
          <button
            type="button" onClick={toggleFullscreen}
            title={fullscreen ? "Exit fullscreen (Esc)" : "Fullscreen"}
            className={cn(
              "rounded-lg p-1.5 transition-colors",
              "text-[var(--text-muted)] hover:bg-[var(--bg-overlay)]/40 hover:text-[var(--text-primary)]"
            )}
          >
            {fullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      <div className="relative min-h-0 flex-1">
        {!scriptReady && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-[var(--bg-base)]">
            <div className="text-center">
              <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-slate-600 border-t-success" />
              <p className="mt-3 text-sm text-slate-300">Loading TradingView chart</p>
            </div>
          </div>
        )}

        <Script
          src="https://s3.tradingview.com/tv.js"
          strategy="afterInteractive"
          onLoad={() => setScriptReady(true)}
        />
        <div id={containerId} className="h-full w-full" />

        {positions.length > 0 && (
          <div className="absolute top-3 right-3 z-20 flex flex-col gap-2 max-h-[calc(100%-24px)] overflow-y-auto pointer-events-none">
            {positions.map((pos) => {
              const isLong = pos.side === "Long";
              const pnlPositive = pos.unrealizedPnl >= 0;
              const pnlColor = pnlPositive ? "var(--green)" : "var(--red)";
              const pnlSign = pnlPositive ? "+" : "";
              const currentPrice = prices[pos.symbol] || pos.entryPrice;
              const leverageNum = parseFloat(pos.leverage);
              const percentageChange = ((isLong
                ? (currentPrice / pos.entryPrice - 1)
                : (1 - currentPrice / pos.entryPrice)
              ) * leverageNum * 100);

              const positionTrade = trades.find((t) => t.positionId === pos.id);
              const quantity =
                positionTrade?.quantity ??
                parseFloat((pos.margin * leverageNum / pos.entryPrice).toFixed(4));

              const glowColor = pnlPositive
                ? "rgba(16, 185, 129, 0.12)"
                : "rgba(244, 63, 94, 0.12)";
              const borderColor = pnlPositive
                ? "rgba(16, 185, 129, 0.35)"
                : "rgba(244, 63, 94, 0.35)";

              return (
                <div
                  key={pos.id}
                  className="pointer-events-auto backdrop-blur-xl rounded-lg shadow-2xl p-3 text-xs flex flex-col gap-1.5 min-w-[210px] transition-all duration-300 animate-slide-up"
                  style={{
                    background: "rgba(14, 20, 32, 0.88)",
                    border: `1px solid ${borderColor}`,
                    boxShadow: `0 0 20px ${glowColor}, 0 4px 24px rgba(0,0,0,0.4)`,
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span
                      style={{
                        fontWeight: 700,
                        fontSize: 11,
                        letterSpacing: "0.06em",
                        color: isLong ? "var(--green)" : "var(--red)",
                      }}
                    >
                      {pos.side} {pos.market || pos.symbol}
                    </span>
                    <span
                      style={{
                        fontSize: 10,
                        color: "var(--text-muted)",
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      {pos.leverage}
                    </span>
                  </div>

                  <div style={{ height: 1, background: "var(--border)", margin: "2px 0" }} />

                  <div className="flex justify-between items-center">
                    <span style={{ color: "var(--text-muted)", fontSize: 11 }}>Entry</span>
                    <span style={{ fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: 11 }}>
                      {pos.entryPrice.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 5,
                      })}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span style={{ color: "var(--text-muted)", fontSize: 11 }}>Current</span>
                    <span style={{ fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: 11 }}>
                      {currentPrice.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 5,
                      })}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span style={{ color: "var(--text-muted)", fontSize: 11 }}>PnL</span>
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontWeight: 700,
                        fontSize: 11,
                        color: pnlColor,
                      }}
                    >
                      {pnlSign}{pos.unrealizedPnl.toFixed(2)} ({pnlSign}{percentageChange.toFixed(2)}%)
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span style={{ color: "var(--text-muted)", fontSize: 11 }}>Qty</span>
                    <span style={{ fontFamily: "var(--font-mono)", fontWeight: 600, fontSize: 11 }}>
                      {quantity.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span
                      style={{
                        display: "inline-block",
                        width: 5,
                        height: 5,
                        borderRadius: "50%",
                        background: "var(--green)",
                        boxShadow: "0 0 6px var(--green-glow)",
                      }}
                    />
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: "var(--green)",
                        letterSpacing: "0.05em",
                      }}
                    >
                      OPEN
                    </span>
                  </div>

                  <button
                    onClick={() => closePosition(pos.id)}
                    className="mt-1.5 w-full text-center py-1.5 rounded text-[11px] font-semibold cursor-pointer border-none transition-all hover:opacity-80 active:scale-[0.97]"
                    style={{
                      background: "rgba(244, 63, 94, 0.14)",
                      color: "var(--red)",
                      border: "0.5px solid rgba(244, 63, 94, 0.25)",
                    }}
                  >
                    Close Position
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
