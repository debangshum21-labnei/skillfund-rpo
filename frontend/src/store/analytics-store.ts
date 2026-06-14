import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useTradingStore } from "./trading-store";
import { useSessionStore } from "./session-store";

export interface BalancePoint {
  balance: number;
  timestamp: number;
  event: "start" | "trade" | "session_start" | "session_end";
}

interface AnalyticsState {
  balanceHistory: BalancePoint[];
}

let subscribed = false;

export const useAnalyticsStore = create<AnalyticsState>()(
  persist(
    (set) => {
      if (!subscribed) {
        subscribed = true;

        let lastBalance = useTradingStore.getState().demoBalance;

        useTradingStore.subscribe(() => {
          const { demoBalance } = useTradingStore.getState();
          if (demoBalance !== lastBalance) {
            lastBalance = demoBalance;
            set((s) => {
              const point: BalancePoint = { balance: demoBalance, timestamp: Date.now(), event: "trade" };
              return { balanceHistory: [...s.balanceHistory, point].slice(-1000) };
            });
          }
        });

        let prevStatus = useSessionStore.getState().session.status;

        useSessionStore.subscribe(() => {
          const session = useSessionStore.getState().session;
          const balance = useTradingStore.getState().demoBalance;

          if (session.status !== prevStatus) {
            if (session.status === "active") {
              set((s) => {
                const point: BalancePoint = { balance, timestamp: Date.now(), event: "session_start" };
                return { balanceHistory: [...s.balanceHistory, point].slice(-1000) };
              });
            } else if (session.status === "completed") {
              set((s) => {
                const point: BalancePoint = { balance, timestamp: Date.now(), event: "session_end" };
                return { balanceHistory: [...s.balanceHistory, point].slice(-1000) };
              });
            }
            prevStatus = session.status;
          }
        });
      }

      const initialBalance = useTradingStore.getState().demoBalance;
      const point: BalancePoint = { balance: initialBalance, timestamp: Date.now(), event: "start" };

      return {
        balanceHistory: [point],
      };
    },
    {
      name: "skillfund-analytics",
      partialize: (state) => ({
        balanceHistory: state.balanceHistory,
      }),
    },
  ),
);
