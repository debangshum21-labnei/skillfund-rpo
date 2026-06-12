"use client";

import { useEffect, useMemo, useState } from "react";

function clamp(v: number, min: number, max: number) {
    return Math.max(min, Math.min(max, v));
}

export function RewardCalculator() {
    const [deposit, setDeposit] = useState(100);

    const demoCapital = deposit; // simple MVP mapping
    const perfPercent = 10; // assume example tier
    const rewardPercent = 5; // simplistic
    const reward = (deposit * rewardPercent) / 100;
    const newBalance = deposit + reward;

    const tier = useMemo(() => (rewardPercent >= 5 ? "Gold" : "Standard"), [rewardPercent]);
    const sessionCap = useMemo(() => `Cap reached at +${perfPercent}%`, [perfPercent]);

    const projectedGrowth = ((newBalance - deposit) / deposit) * 100;

    const percent = clamp(((deposit - 100) / (5000 - 100)) * 100, 0, 100);

    return (
        <section className="skillfund-section py-28" id="reward-calculator">
            <div className="app-container">
                <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
                    <div>
                        <p className="eyebrow">Reward calculator</p>
                        <h2 className="skillfund-h2">Project your potential reward.</h2>
                        <p className="mt-5 text-lg leading-8 text-slate-300">
                            Adjust your deposit and see demo capital + capped outcome preview.
                        </p>

                        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-300">Deposit</span>
                                <span className="tabular tabular-nums font-mono text-white">₹{deposit.toLocaleString("en-IN")}</span>
                            </div>

                            <input
                                aria-label="Deposit amount"
                                className="mt-4 w-full accent-[#10B981]"
                                type="range"
                                min={100}
                                max={5000}
                                step={10}
                                value={deposit}
                                onChange={(e) => setDeposit(Number(e.target.value))}
                            />

                            <div className="mt-2 h-2 w-full rounded-full bg-white/10">
                                <div className="h-2 rounded-full bg-gradient-to-r from-[#10B981] to-[#3B82F6]" style={{ width: `${percent}%` }} />
                            </div>

                            <div className="mt-5 grid gap-3 sm:grid-cols-2">
                                <div className="glassCard">
                                    <div className="glassLabel">Demo Capital</div>
                                    <div className="glassValue">${demoCapital.toFixed(0)}</div>
                                </div>
                                <div className="glassCard">
                                    <div className="glassLabel">Potential Reward</div>
                                    <div className="glassValue text-amber-200">₹{reward.toFixed(0)}</div>
                                </div>
                                <div className="glassCard">
                                    <div className="glassLabel">Reward Tier</div>
                                    <div className="glassValue">{tier}</div>
                                </div>
                                <div className="glassCard">
                                    <div className="glassLabel">Session Cap</div>
                                    <div className="glassValue text-slate-200 text-sm leading-6">{sessionCap}</div>
                                </div>
                                <div className="glassCard sm:col-span-2">
                                    <div className="glassLabel">Projected Growth</div>
                                    <div className="glassValue text-emerald-300">+{projectedGrowth.toFixed(1)}%</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="rewardCalcVisual" aria-hidden="true" />
                        <div className="absolute inset-0 flex items-end p-6">
                            <div className="w-full">
                                <div className="mb-2 flex items-center justify-between text-sm">
                                    <span className="text-slate-300">Preview</span>
                                    <span className="font-mono text-slate-200">₹{newBalance.toFixed(0)}</span>
                                </div>
                                <div className="sparkBar">
                                    <div className="sparkFill" style={{ height: `${clamp(projectedGrowth, 0, 20) * 5}%` }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

