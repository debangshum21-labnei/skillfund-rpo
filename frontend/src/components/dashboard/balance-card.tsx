import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

export function BalanceCard({
  label,
  amount,
  currency,
  detail,
  trend = "up",
}: {
  label: string;
  amount: number;
  currency: "INR" | "USD";
  detail: string;
  trend?: "up" | "down";
}) {
  const TrendIcon = trend === "up" ? ArrowUpRight : ArrowDownRight;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between gap-3">
          <p className="text-2xl font-semibold text-primary">{formatCurrency(amount, currency)}</p>
          <span
            className={
              trend === "up"
                ? "flex h-9 w-9 items-center justify-center rounded-xl bg-green-50 text-success"
                : "flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-danger"
            }
          >
            <TrendIcon className="h-4 w-4" />
          </span>
        </div>
        <p className="mt-3 text-sm text-muted">{detail}</p>
      </CardContent>
    </Card>
  );
}
