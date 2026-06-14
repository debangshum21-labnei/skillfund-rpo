import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Session } from "@/types";
import { useTradingStore } from "./trading-store";

interface StoredActivity {
  id: string;
  title: string;
  description: string;
  createdAt: number;
  tone: "success" | "danger" | "neutral";
}

interface SessionState {
  session: Session;
  positionOpenTimes: Record<string, number>;
  sessionActivities: StoredActivity[];
  previousSessions: Session[];

  startSession: () => void;
  endSession: () => void;
  recordTradeOpen: (positionId: string) => void;
  recordTradeClose: (holdTimeSeconds: number, tradePnl?: number) => void;
  updateSessionMetrics: () => void;
  resetSession: () => void;
}

let activityCounter = 0;
function addActivity(
  activities: StoredActivity[],
  title: string,
  description: string,
  tone: StoredActivity["tone"],
): StoredActivity[] {
  const entry: StoredActivity = {
    id: `ACT-${Date.now()}-${++activityCounter}`,
    title,
    description,
    createdAt: Date.now(),
    tone,
  };
  return [entry, ...activities].slice(0, 50);
}

function createInitialSession(): Session {
  return {
    id: "",
    status: "not_started",
    startingBalance: 0,
    sessionPnL: 0,
    sessionReturnPercent: 0,
    tradesTaken: 0,
    winningTrades: 0,
    losingTrades: 0,
    totalHoldTimeSeconds: 0,
    averageHoldTimeSeconds: 0,
  };
}

let subscribed = false;

export const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => {
      if (!subscribed) {
        subscribed = true;
        useTradingStore.subscribe(() => {
          const { positions } = useTradingStore.getState();
          const currentIds = positions.map((p) => p.id);
          const sessionState = get();
          const status = sessionState.session.status;

          if (status === "active") {
            const openTimes = get().positionOpenTimes;

            // Detect position opened (use positionOpenTimes as source of truth)
            for (const pos of positions) {
              if (!openTimes[pos.id]) {
                const currentActs = get().sessionActivities;
                set({
                  positionOpenTimes: { ...get().positionOpenTimes, [pos.id]: Date.now() },
                  session: {
                    ...get().session,
                    tradesTaken: get().session.tradesTaken + 1,
                    cooldownEndsAt: Date.now() + 120000,
                  },
                  sessionActivities: addActivity(
                    addActivity(
                      currentActs,
                      "Position opened",
                      `${pos.market} ${pos.side} at ${pos.entryPrice}`,
                      "neutral",
                    ),
                    "Cooldown started",
                    "2-minute cooldown until next trade",
                    "neutral",
                  ),
                });
              }
            }

            // Detect position closed
            for (const prevId of Object.keys(openTimes)) {
              if (!currentIds.includes(prevId)) {
                const currentOpenTimes = get().positionOpenTimes;
                const openTime = currentOpenTimes[prevId];
                const holdTime = openTime
                  ? Math.floor((Date.now() - openTime) / 1000)
                  : 0;
                const newTotal =
                  get().session.totalHoldTimeSeconds + holdTime;
                const trades = get().session.tradesTaken;
                const { [prevId]: _, ...rest } = currentOpenTimes;

                const { trades: allTrades } = useTradingStore.getState();
                const closedTrade = allTrades.find(
                  (t) => t.positionId === prevId,
                );
                const pnl = closedTrade?.pnl ?? 0;
                const winningTrades = get().session.winningTrades;
                const losingTrades = get().session.losingTrades;
                const closedPos = positions.find((p) => p.id === prevId);
                const marketLabel = closedPos?.market
                  ?? allTrades.find((t) => t.positionId === prevId)?.market
                  ?? "Unknown";

                set((s) => ({
                  positionOpenTimes: rest,
                  session: {
                    ...s.session,
                    totalHoldTimeSeconds: newTotal,
                    averageHoldTimeSeconds:
                      trades > 0
                        ? parseFloat((newTotal / trades).toFixed(1))
                        : 0,
                    winningTrades:
                      pnl > 0 ? winningTrades + 1 : winningTrades,
                    losingTrades:
                      pnl < 0 ? losingTrades + 1 : losingTrades,
                  },
                  sessionActivities: addActivity(
                    s.sessionActivities,
                    "Position closed",
                    `${marketLabel} closed with ${pnl >= 0 ? "+" : ""}${pnl.toFixed(2)} USD PnL`,
                    pnl > 0 ? "success" : pnl < 0 ? "danger" : "neutral",
                  ),
                }));
              }
            }

            // Update PnL metrics
            const { demoBalance } = useTradingStore.getState();
            const s = get().session;
            const sessionPnL = parseFloat(
              (demoBalance - s.startingBalance).toFixed(2),
            );
            const sessionReturnPercent =
              s.startingBalance > 0
                ? parseFloat(
                    ((sessionPnL / s.startingBalance) * 100).toFixed(2),
                  )
                : 0;
            if (sessionPnL !== s.sessionPnL) {
              set({
                session: { ...get().session, sessionPnL, sessionReturnPercent },
              });
            }
          }
        });
      }

      return {
        session: createInitialSession(),
        positionOpenTimes: {},
        sessionActivities: [],
        previousSessions: [],

        startSession: () => {
          const { demoBalance } = useTradingStore.getState();
          const id = `SES-${Date.now()}`;
          set((s) => ({
            session: {
              id,
              status: "active",
              startedAt: Date.now(),
              startingBalance: demoBalance,
              sessionPnL: 0,
              sessionReturnPercent: 0,
              tradesTaken: 0,
              winningTrades: 0,
              losingTrades: 0,
              totalHoldTimeSeconds: 0,
              averageHoldTimeSeconds: 0,
            },
            positionOpenTimes: {},
            sessionActivities: addActivity(
              s.sessionActivities,
              "Session started",
              `Session ${id} started with $${demoBalance.toFixed(2)} demo balance`,
              "neutral",
            ),
          }));
        },

        endSession: () => {
          const { session } = get();
          if (session.status !== "active") return;
          const { demoBalance } = useTradingStore.getState();
          const sessionPnL = parseFloat(
            (demoBalance - session.startingBalance).toFixed(2),
          );
          const sessionReturnPercent =
            session.startingBalance > 0
              ? parseFloat(
                  ((sessionPnL / session.startingBalance) * 100).toFixed(2),
                )
              : 0;
          const completedSession: Session = {
            ...session,
            status: "completed",
            endedAt: Date.now(),
            endingBalance: demoBalance,
            sessionPnL,
            sessionReturnPercent,
          };
          const tone = sessionPnL >= 0 ? "success" : "danger";
          set((s) => ({
            session: completedSession,
            positionOpenTimes: {},
            sessionActivities: addActivity(
              s.sessionActivities,
              "Session completed",
              `Final PnL: ${sessionPnL >= 0 ? "+" : ""}${sessionPnL.toFixed(2)} USD (${sessionReturnPercent >= 0 ? "+" : ""}${sessionReturnPercent.toFixed(2)}%)`,
              tone,
            ),
            previousSessions: [completedSession, ...s.previousSessions].slice(0, 20),
          }));
        },

        recordTradeOpen: (positionId: string) => {
          const { session, positionOpenTimes } = get();
          if (session.status !== "active") return;
          set({
            positionOpenTimes: {
              ...positionOpenTimes,
              [positionId]: Date.now(),
            },
            session: {
              ...session,
              tradesTaken: session.tradesTaken + 1,
              cooldownEndsAt: Date.now() + 120000,
            },
          });
        },

        recordTradeClose: (holdTimeSeconds: number, tradePnl?: number) => {
          const { session } = get();
          if (session.status !== "active") return;
          const newTotal = session.totalHoldTimeSeconds + holdTimeSeconds;
          const trades = session.tradesTaken;
          const pnl = tradePnl ?? 0;
          set({
            session: {
              ...session,
              totalHoldTimeSeconds: newTotal,
              averageHoldTimeSeconds:
                trades > 0
                  ? parseFloat((newTotal / trades).toFixed(1))
                  : 0,
              winningTrades:
                pnl > 0
                  ? session.winningTrades + 1
                  : session.winningTrades,
              losingTrades:
                pnl < 0
                  ? session.losingTrades + 1
                  : session.losingTrades,
            },
          });
        },

        updateSessionMetrics: () => {
          const { session } = get();
          if (session.status !== "active") return;
          const { demoBalance } = useTradingStore.getState();
          const sessionPnL = parseFloat(
            (demoBalance - session.startingBalance).toFixed(2),
          );
          const sessionReturnPercent =
            session.startingBalance > 0
              ? parseFloat(
                  ((sessionPnL / session.startingBalance) * 100).toFixed(2),
                )
              : 0;
          set({ session: { ...session, sessionPnL, sessionReturnPercent } });
        },

        resetSession: () => {
          set({
            session: createInitialSession(),
            positionOpenTimes: {},
            sessionActivities: [],
          });
        },
      };
    },
    {
      name: "skillfund-session",
      partialize: (state) => ({
        session: state.session,
        positionOpenTimes: state.positionOpenTimes,
        sessionActivities: state.sessionActivities,
        previousSessions: state.previousSessions,
      }),
    },
  ),
);
