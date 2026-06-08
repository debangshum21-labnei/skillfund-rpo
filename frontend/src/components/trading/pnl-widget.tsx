import { TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, formatPercent } from "@/lib/utils";

export function PnLWidget({ pnl, percent }: { pnl: number; percent: number }) {
  const isPositive = pnl >= 0;

  return (
    <Card className="shadow-none">
      <CardContent className="flex items-center justify-between p-4">
        <div>
          <p className="text-sm text-muted">Live PnL</p>
          <p className={isPositive ? "mt-1 text-2xl font-semibold text-success" : "mt-1 text-2xl font-semibold text-danger"}>
            {formatCurrency(pnl, "USD")}
          </p>
          <p className="text-sm text-muted">{formatPercent(percent)} session impact</p>
        </div>
        <span className={`flex h-11 w-11 items-center justify-center rounded-xl transition-colors ${
          isPositive
            ? "bg-[var(--green-dim)] text-success"
            : "bg-[var(--red-dim)] text-danger"
        }`}>
          {isPositive ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
        </span>
      </CardContent>
    </Card>
  );
}
