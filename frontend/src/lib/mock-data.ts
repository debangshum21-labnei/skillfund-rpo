import type {
  Activity,
  Deposit,
  Position,
  RewardTier,
  SessionRule,
  Trade,
  TradingSession,
  WalletSummary,
} from "@/types";

export const wallets: WalletSummary = {
  realBalance: { amount: 8750, currency: "INR" },
  demoBalance: { amount: 105.4, currency: "USD" },
  reservedBalance: { amount: 500, currency: "INR" },
  projectedReward: { amount: 438, currency: "INR" },
};

export const rewardTiers: RewardTier[] = [
  { demoProfitPercent: 10, rewardPercent: 5, label: "Starter reward" },
  { demoProfitPercent: 20, rewardPercent: 8, label: "Target reward" },
  { demoProfitPercent: 32.5, rewardPercent: 13, label: "Maximum session cap" },
];

export const sessionRules: SessionRule[] = [
  { label: "Profit target", value: "+20% demo PnL", tone: "success" },
  { label: "Loss limit", value: "-10% demo PnL", tone: "danger" },
  { label: "Cooldown", value: "15 minutes", tone: "neutral" },
  { label: "Reward cap", value: "13% of deposit", tone: "neutral" },
];

export const activeSession: TradingSession = {
  id: "SF-SESSION-1042",
  status: "active",
  startedAt: "2026-06-06T09:10:00+05:30",
  startingDemoBalance: 100,
  currentDemoBalance: 105.4,
  profitPercent: 5.4,
  maxRewardPercent: 13,
  lossLimitPercent: -10,
  targetProfitPercent: 20,
};

export const completedSession: TradingSession = {
  id: "SF-SESSION-1041",
  status: "cooldown",
  startedAt: "2026-06-06T08:20:00+05:30",
  completedAt: "2026-06-06T08:58:00+05:30",
  cooldownEndsAt: "2026-06-06T09:13:00+05:30",
  startingDemoBalance: 100,
  currentDemoBalance: 120,
  profitPercent: 20,
  maxRewardPercent: 13,
  lossLimitPercent: -10,
  targetProfitPercent: 20,
  outcome: "profit_target",
};

export const trades: Trade[] = [
  {
    id: "TRD-3098",
    market: "EUR/USD",
    side: "Buy",
    leverage: "5x",
    entry: 1.0832,
    quantity: 2400,
    pnl: 2.84,
    pnlPercent: 2.7,
    status: "Open",
    openedAt: "09:41",
  },
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
];

export const deposits: Deposit[] = [
  {
    id: "DEP-1821",
    amount: { amount: 5000, currency: "INR" },
    demoCredit: { amount: 100, currency: "USD" },
    status: "Completed",
    createdAt: "2026-06-06",
  },
  {
    id: "DEP-1814",
    amount: { amount: 2500, currency: "INR" },
    demoCredit: { amount: 50, currency: "USD" },
    status: "Completed",
    createdAt: "2026-06-03",
  },
];

export const activities: Activity[] = [
  {
    id: "ACT-1",
    title: "Session target in progress",
    description: "Demo wallet is up 5.4%; next tier unlocks at 10%.",
    time: "2 min ago",
    tone: "success",
  },
  {
    id: "ACT-2",
    title: "Risk buffer updated",
    description: "Loss limit remains 15.4% away from current demo equity.",
    time: "12 min ago",
    tone: "neutral",
  },
  {
    id: "ACT-3",
    title: "Deposit credited",
    description: "₹5,000 real balance mapped to $100 demo balance.",
    time: "Today",
    tone: "neutral",
  },
];

export const positions: Position[] = [
  {
    id: "POS-17",
    market: "EUR/USD",
    side: "Long",
    margin: 22,
    leverage: "5x",
    liquidationBuffer: "42%",
    unrealizedPnl: 2.84,
  },
];
