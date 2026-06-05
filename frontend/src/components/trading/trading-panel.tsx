"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import { PnLWidget } from "@/components/trading/pnl-widget";

export function TradingPanel() {
  const [leverage, setLeverage] = useState(5);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Order ticket</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Button variant="success">Buy</Button>
          <Button variant="danger">Sell</Button>
        </div>
        <div className="space-y-2">
          <Label htmlFor="market">Market</Label>
          <select
            id="market"
            className="h-11 w-full rounded-xl border border-border bg-white px-3 text-sm text-primary shadow-sm focus-visible:focus-ring"
            defaultValue="EUR/USD"
          >
            <option>EUR/USD</option>
            <option>GBP/USD</option>
            <option>XAU/USD</option>
            <option>USD/JPY</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="margin">Margin</Label>
          <Input id="margin" defaultValue="22" inputMode="decimal" />
        </div>
        <div className="space-y-2">
          <Label>Leverage</Label>
          <div className="flex items-center justify-between rounded-xl border border-border bg-slate-50 p-2">
            <Button
              type="button"
              variant="secondary"
              size="icon"
              onClick={() => setLeverage((value) => Math.max(1, value - 1))}
              aria-label="Decrease leverage"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="text-lg font-semibold text-primary">{leverage}x</span>
            <Button
              type="button"
              variant="secondary"
              size="icon"
              onClick={() => setLeverage((value) => Math.min(10, value + 1))}
              aria-label="Increase leverage"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <PnLWidget pnl={2.84} percent={2.7} />
        <div className="rounded-xl border border-border bg-slate-50 p-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted">Position size</span>
            <span className="font-medium text-primary">$110.00</span>
          </div>
          <div className="mt-2 flex justify-between">
            <span className="text-muted">Loss buffer</span>
            <span className="font-medium text-primary">15.4%</span>
          </div>
          <div className="mt-2 flex justify-between">
            <span className="text-muted">Mode</span>
            <span className="font-medium text-primary">Simulated</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
