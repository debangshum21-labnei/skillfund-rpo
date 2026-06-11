import type { Money } from "@/types";

export type BalanceCurrency = "INR" | "USD";

export function formatINR(amount: number) {
    return `₹${formatNumber(amount)}`;
}

export function formatUSD(amount: number) {
    return `$${formatNumber(amount)}`;
}

export function formatNumber(amount: number) {
    const safe = Number.isFinite(amount) ? amount : 0;
    // Match requirements: INR 2 decimals; USD 2 decimals.
    return new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(safe);
}

export function formatBalanceMoney(money: Money, currency: BalanceCurrency) {
    return currency === "INR" ? formatINR(money.amount) : formatUSD(money.amount);
}

export function nullishToNumber(value: unknown): number {
    if (value === null || value === undefined) return 0;
    if (typeof value === "number") return value;
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
}

