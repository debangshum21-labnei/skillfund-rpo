import { create } from "zustand";
import type { Position, Trade } from "@/types";
import { SYMBOLS } from "@/components/trading/symbols";

interface TradingState {
  demoBalance: number;
  startingDemoBalance: number;
  positions: Position[];
  trades: Trade[];
  prices: Record<string, number>;
  isMock: Record<string, boolean>;
  isSimulating: boolean;
  simulationIntervalId: any;
  
  startPriceSimulation: () => void;
  stopPriceSimulation: () => void;
  openPosition: (symbol: string, side: "Buy" | "Sell", margin: number, leverage: number, entryPrice: number) => void;
  closePosition: (positionId: string) => void;
}

const initialPrices: Record<string, number> = {
  "NASDAQ:AAPL": 189.5,
  "FX:EURUSD": 1.0861,
  "BINANCE:BTCUSDT": 62021,
  "OANDA:XAUUSD": 2326.5,
  "NSE:NIFTY50": 22400,
};

const initialIsMock: Record<string, boolean> = {
  "NASDAQ:AAPL": true,
  "FX:EURUSD": true,
  "BINANCE:BTCUSDT": true,
  "OANDA:XAUUSD": true,
  "NSE:NIFTY50": true,
};

const simulatePrice = (symbol: string, currentPrice: number) => {
  let volatility = 0.0001;
  if (symbol.includes("BTC")) {
    volatility = 0.0003;
  } else if (symbol.includes("EURUSD")) {
    volatility = 0.00005;
  }
  const changePercent = (Math.random() - 0.5) * 2 * volatility;
  const nextPrice = currentPrice * (1 + changePercent);
  
  if (symbol.includes("EURUSD")) {
    return parseFloat(nextPrice.toFixed(5));
  } else if (symbol.includes("AAPL") || symbol.includes("XAUUSD")) {
    return parseFloat(nextPrice.toFixed(2));
  } else if (symbol.includes("NIFTY50")) {
    return parseFloat(nextPrice.toFixed(1));
  }
  return parseFloat(nextPrice.toFixed(2));
};

export const useTradingStore = create<TradingState>((set, get) => ({
  demoBalance: 100.00,
  startingDemoBalance: 100.00,
  positions: [],
  trades: [
    {
      id: "TRD-3097",
      market: "GBP/USD",
      side: "Sell",
      leverage: "3x",
      entry: 1.2684,
      exit: 1.2641,
      quantity: 1800,
      pnl: 4.12,
      pnlPercent: 3.92,
      status: "Closed",
      openedAt: "09:12",
    },
    {
      id: "TRD-3096",
      market: "XAU/USD",
      side: "Buy",
      leverage: "2x",
      entry: 2326.5,
      exit: 2321.4,
      quantity: 0.08,
      pnl: -1.64,
      pnlPercent: -1.56,
      status: "Closed",
      openedAt: "08:36",
    },
  ],
  prices: initialPrices,
  isMock: initialIsMock,
  isSimulating: false,
  simulationIntervalId: null,

  startPriceSimulation: () => {
    if (get().isSimulating) return;
    set({ isSimulating: true });

    // Helper to fetch and update prices on start
    const fetchInitialPrices = async () => {
      const updatedPrices = { ...get().prices };
      const updatedIsMock = { ...get().isMock };

      await Promise.all(
        SYMBOLS.map(async (s) => {
          const ticker = s.value.split(":")[1];
          try {
            const res = await fetch(`/api/price?ticker=${ticker}&symbol=${encodeURIComponent(s.value)}`);
            if (res.ok) {
              const data = await res.json();
              if (data.price !== undefined && data.price !== null) {
                updatedPrices[s.value] = data.price;
                updatedIsMock[s.value] = data.mock ?? false;
              }
            }
          } catch (e) {
            console.error("Failed to fetch initial price for", s.value, e);
          }
        })
      );

      set({ prices: updatedPrices, isMock: updatedIsMock });
    };

    fetchInitialPrices().then(() => {
      const intervalId = setInterval(() => {
        const currentPrices = { ...get().prices };
        const nextPrices: Record<string, number> = {};

        // Simulate new prices
        Object.keys(currentPrices).forEach((symbol) => {
          nextPrices[symbol] = simulatePrice(symbol, currentPrices[symbol]);
        });

        // Recalculate unrealized PnL for positions
        const updatedPositions = get().positions.map((p) => {
          const currentPrice = nextPrices[p.symbol] || p.entryPrice;
          const leverageNum = parseFloat(p.leverage);
          let pnl = 0;
          if (p.side === "Long") {
            pnl = (currentPrice / p.entryPrice - 1) * p.margin * leverageNum;
          } else {
            pnl = (1 - currentPrice / p.entryPrice) * p.margin * leverageNum;
          }

          return {
            ...p,
            unrealizedPnl: parseFloat(pnl.toFixed(2)),
          };
        });

        // Recalculate ticking PnL in open trades
        const updatedTrades = get().trades.map((t) => {
          if (t.status === "Open" && t.positionId) {
            const position = updatedPositions.find((pos) => pos.id === t.positionId);
            if (position) {
              return {
                ...t,
                pnl: position.unrealizedPnl,
                pnlPercent: parseFloat((position.unrealizedPnl / position.margin * 100).toFixed(2)),
              };
            }
          }
          return t;
        });

        set({
          prices: nextPrices,
          positions: updatedPositions,
          trades: updatedTrades,
        });
      }, 1000);

      set({ simulationIntervalId: intervalId });
    });
  },

  stopPriceSimulation: () => {
    const intervalId = get().simulationIntervalId;
    if (intervalId) {
      clearInterval(intervalId);
    }
    set({ isSimulating: false, simulationIntervalId: null });
  },

  openPosition: (symbol, side, margin, leverage, entryPrice) => {
    const marketLabel = SYMBOLS.find((s) => s.value === symbol)?.label ?? symbol;
    const positionId = `POS-${Math.floor(100 + Math.random() * 900)}`;
    const tradeId = `TRD-${Math.floor(3000 + Math.random() * 1000)}`;

    const newPosition: Position = {
      id: positionId,
      market: marketLabel,
      symbol,
      side: side === "Buy" ? "Long" : "Short",
      margin,
      leverage: `${leverage}x`,
      liquidationBuffer: `${((1 / leverage) * 100).toFixed(1)}%`,
      unrealizedPnl: 0,
      entryPrice,
    };

    const newTrade: Trade = {
      id: tradeId,
      market: marketLabel,
      symbol,
      positionId,
      side,
      leverage: `${leverage}x`,
      entry: entryPrice,
      quantity: parseFloat((margin * leverage / entryPrice).toFixed(4)),
      pnl: 0,
      pnlPercent: 0,
      status: "Open",
      openedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    set((state) => ({
      positions: [newPosition, ...state.positions],
      trades: [newTrade, ...state.trades],
    }));
  },

  closePosition: (positionId) => {
    const position = get().positions.find((p) => p.id === positionId);
    if (!position) return;

    const currentPrice = get().prices[position.symbol] || position.entryPrice;
    const leverageNum = parseFloat(position.leverage);

    let pnl = 0;
    if (position.side === "Long") {
      pnl = (currentPrice / position.entryPrice - 1) * position.margin * leverageNum;
    } else {
      pnl = (1 - currentPrice / position.entryPrice) * position.margin * leverageNum;
    }
    const finalPnl = parseFloat(pnl.toFixed(2));
    const pnlPercent = parseFloat((finalPnl / position.margin * 100).toFixed(2));

    set((state) => {
      const newDemoBalance = parseFloat((state.demoBalance + finalPnl).toFixed(2));
      const newPositions = state.positions.filter((p) => p.id !== positionId);
      const newTrades = state.trades.map((t) => {
        if (t.positionId === positionId) {
          return {
            ...t,
            status: "Closed" as const,
            exit: currentPrice,
            pnl: finalPnl,
            pnlPercent,
          };
        }
        return t;
      });

      return {
        demoBalance: newDemoBalance,
        positions: newPositions,
        trades: newTrades,
      };
    });
  },
}));
