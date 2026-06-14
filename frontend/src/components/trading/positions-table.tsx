import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import type { Position } from "@/types";
import { cn, formatCurrency } from "@/lib/utils";

export function PositionsTable({ positions }: { positions: Position[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Open positions</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <THead>
            <TR>
              <TH>Market</TH>
              <TH>Side</TH>
              <TH>Margin</TH>
              <TH>Leverage</TH>
              <TH>Buffer</TH>
              <TH className="text-right">Unrealized PnL</TH>
            </TR>
          </THead>
          <TBody>
            {positions.map((position) => (
              <TR key={position.id}>
                <TD className="font-medium text-primary">{position.market}</TD>
                <TD>{position.side}</TD>
                <TD>{formatCurrency(position.margin, "USD")}</TD>
                <TD>{position.leverage}</TD>
                <TD>{position.liquidationBuffer}</TD>
                <TD className={cn("text-right font-semibold", position.unrealizedPnl >= 0 ? "text-success" : "text-danger")}>{formatCurrency(position.unrealizedPnl, "USD")}</TD>
              </TR>
            ))}
          </TBody>
        </Table>
      </CardContent>
    </Card>
  );
}
