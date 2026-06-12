"use client";

import { useEffect, useMemo, useState } from "react";

function formatINR(n: number) {
    return `₹${Math.round(n).toLocaleString("en-IN")}`;
}

function easeOutCubic(t: number) {
    return 1 - Math.pow(1 - t, 3);
}

function useCountUp(target: number, ms = 900) {
    const [v, setV] = useState(0);
    useEffect(() => {
        let raf = 0;
        const start = performance.now();
        const from = v;
        const tick = (now: number) => {
            const t = Math.min(1, (now - start) / ms);
            const e = easeOutCubic(t);
            setV(from + (target - from) * e);
            if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [target]);

    return v;
}

export function RewardExample() {
    const deposit = useCountUp(100);
    const demo = useCountUp(100);
    const perf = useCountUp(10);
    const reward = useCountUp(5);
    const balance = useCountUp(105);

    const tiers = useMemo(() => [{ label: "Demo profit", value: "+₹5" }], []);

    return (
        <section className="skillfund-section py-28" aria-label="Interactive reward example">
            <div className="app-container">
                <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
                    <div>
                        <p className="eyebrow">Interactive reward example</p>
                        <h2 className="skillfund-h2">SEE HOW REWARDS WORK.</h2>
                        <p className="mt-5 text-lg leading-8 text-slate-300">
                            A rules-based bridge: performance on demo → capped reward on your real wallet.
                        </p>

                        <div className="mt-8 grid gap-4 sm:grid-cols-2">
                            <div className="glassCard">
                                <div className="glassLabel">Deposit</div>
                                <div className="glassValue">{formatINR(deposit)}</div>
                            </div>
                            <div className="glassCard">
                                <div className="glassLabel">Demo Capital</div>
                                <div className="glassValue">${demo.toFixed(0)}</div>
                            </div>
                            <div className="glassCard">
                                <div className="glassLabel">Performance</div>
                                <div className="glassValue text-emerald-300">+{perf.toFixed(0)}%</div>
                            </div>
                            <div className="glassCard">
                                <div className="glassLabel">Reward</div>
                                <div className="glassValue text-amber-200">{formatINR(reward)}</div>
                            </div>
                            <div className="glassCard sm:col-span-2">
                                <div className="glassLabel">New Balance</div>
                                <div className="glassValue">{formatINR(balance)}</div>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="rewardWallet" aria-hidden="true" />
                        <div className="rewardTierRow">
                            {tiers.map((t) => (
                                <div key={t.label} className="rewardTier">
                                    <div className="rewardTierLabel">Reward Tier</div>
                                    <div className="rewardTierValue">{t.value}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

