import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

export function BalanceCard({
  label, amount, currency, detail, trend = "up",
}: {
  label: string; amount: number; currency: "INR" | "USD";
  detail: string; trend?: "up" | "down";
}) {
  const TrendIcon = trend === "up" ? ArrowUpRight : ArrowDownRight;
  const color     = trend === "up" ? "var(--green)" : "var(--red)";
  const dimColor  = trend === "up" ? "var(--green-dim)" : "var(--red-dim)";

  return (
    <Card>
      <CardContent style={{ padding: 16 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: 11, color: "var(--text-muted)", margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.04em" }}>
              {label}
            </p>
            <p style={{
              fontSize: 22, fontFamily: "var(--font-mono)", fontWeight: 600,
              color: "var(--text-primary)", margin: "0 0 4px", letterSpacing: "-0.02em",
            }}>
              {formatCurrency(amount, currency)}
            </p>
            <p style={{ fontSize: 11, color: "var(--text-muted)", margin: 0 }}>{detail}</p>
          </div>
          <span style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            width: 32, height: 32, borderRadius: "var(--radius-sm)",
            background: dimColor, color, flexShrink: 0,
          }}>
            <TrendIcon size={15} />
          </span>
        </div>
      </CardContent>
    </Card>
  );
}