export type Money = {
  amount: number;
  currency: "INR" | "USD";
};

export type SessionStatus = "active" | "cooldown" | "completed" | "not_started";

export type SessionOutcome = "profit_target" | "loss_limit" | "manual_review";

export type WalletSummary = {
  realBalance: Money;
  demoBalance: Money;
  reservedBalance: Money;
  projectedReward: Money;
};

export type RewardTier = {
  demoProfitPercent: number;
  rewardPercent: number;
  label: string;
};

export type SessionRule = {
  label: string;
  value: string;
  tone: "success" | "danger" | "neutral";
};

export type TradingSession = {
  id: string;
  status: SessionStatus;
  startedAt: string;
  completedAt?: string;
  cooldownEndsAt?: string;
  startingDemoBalance: number;
  currentDemoBalance: number;
  profitPercent: number;
  maxRewardPercent: number;
  lossLimitPercent: number;
  targetProfitPercent: number;
  outcome?: SessionOutcome;
};

export type Trade = {
  id: string;
  market: string;
  side: "Buy" | "Sell";
  leverage: string;
  entry: number;
  exit?: number;
  quantity: number;
  pnl: number;
  pnlPercent: number;
  status: "Open" | "Closed";
  openedAt: string;
  symbol?: string;
  positionId?: string;
};

export type Deposit = {
  id: string;
  amount: Money;
  demoCredit: Money;
  status: "Completed" | "Pending";
  createdAt: string;
};

export type Activity = {
  id: string;
  title: string;
  description: string;
  time: string;
  tone: "success" | "danger" | "neutral";
};

export type Session = {
  id: string;
  status: "not_started" | "active" | "completed";
  startedAt?: number;
  endedAt?: number;
  startingBalance: number;
  endingBalance?: number;
  sessionPnL: number;
  sessionReturnPercent: number;
  tradesTaken: number;
  winningTrades: number;
  losingTrades: number;
  totalHoldTimeSeconds: number;
  averageHoldTimeSeconds: number;
  cooldownEndsAt?: number;
};

export type Position = {
  id: string;
  market: string;
  symbol: string;
  side: "Long" | "Short";
  margin: number;
  leverage: string;
  liquidationBuffer: string;
  unrealizedPnl: number;
  entryPrice: number;
};
