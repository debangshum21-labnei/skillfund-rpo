"use client";

import { useMemo, useState } from "react";
import { CreditCard, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import { rewardTiers, sessionRules } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

export function DepositForm() {
  const [amount, setAmount] = useState(5000);
  const demoPreview = useMemo(() => amount / 50, [amount]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <Card>
        <CardHeader>
          <CardTitle>Deposit setup</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="deposit">Deposit amount</Label>
            <Input
              id="deposit"
              inputMode="numeric"
              min={100}
              type="number"
              value={amount}
              onChange={(event) => setAmount(Number(event.target.value))}
            />
          </div>
          <div className="rounded-card border border-border bg-slate-50 p-4">
            <p className="text-sm text-muted">Demo balance preview</p>
            <p className="mt-1 text-3xl font-semibold text-primary">{formatCurrency(demoPreview, "USD")}</p>
            <p className="mt-2 text-sm text-muted">MVP conversion: ₹50 maps to $1 demo credit.</p>
          </div>
          <Button className="w-full">
            <CreditCard className="h-4 w-4" />
            Confirm mock deposit
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Rules preview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {rewardTiers.map((tier) => (
              <div key={tier.label} className="flex items-center justify-between rounded-xl border border-border p-3">
                <span className="text-sm text-muted">{tier.demoProfitPercent}% demo profit</span>
                <span className="font-semibold text-primary">{tier.rewardPercent}% reward</span>
              </div>
            ))}
          </div>
          <div className="rounded-xl bg-slate-50 p-3 text-sm text-muted">
            <Info className="mb-2 h-4 w-4 text-primary" />
            Session ends automatically at +20% profit or -10% loss, then enters a 15-minute cooldown.
          </div>
          <div className="grid gap-2">
            {sessionRules.map((rule) => (
              <div key={rule.label} className="flex justify-between text-sm">
                <span className="text-muted">{rule.label}</span>
                <span className="font-medium text-primary">{rule.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
