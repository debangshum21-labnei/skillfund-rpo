"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function clamp(v: number, min: number, max: number) {
    return Math.max(min, Math.min(max, v));
}

export function SkillfundHero() {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [ready, setReady] = useState(false);
    const [cursor, setCursor] = useState({ x: 0.5, y: 0.5 });

    useEffect(() => {
        const t = window.setTimeout(() => setReady(true), 60);
        return () => window.clearTimeout(t);
    }, []);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const onMove = (e: PointerEvent) => {
            const r = el.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width;
            const y = (e.clientY - r.top) / r.height;
            setCursor({ x: clamp(x, 0, 1), y: clamp(y, 0, 1) });
        };

        el.addEventListener("pointermove", onMove, { passive: true });
        return () => el.removeEventListener("pointermove", onMove);
    }, []);

    const particles = useMemo(() => {
        // deterministic-ish
        const arr: Array<{ x: number; y: number; s: number; d: number; o: number }> = [];
        for (let i = 0; i < 42; i++) {
            const x = (i * 37) % 100;
            const y = (i * 61) % 100;
            const s = 0.4 + ((i * 13) % 100) / 100;
            const d = (i * 73) % 4000;
            const o = 0.08 + (((i * 19) % 100) / 100) * 0.22;
            arr.push({ x, y, s, d, o });
        }
        return arr;
    }, []);

    return (
        <section
            ref={containerRef}
            className="skillfund-hero relative min-h-[100vh] overflow-hidden bg-[#050505] text-white"
        >
            <div className="skillfund-hero__bg" aria-hidden="true" />
            <div className="skillfund-hero__noise" aria-hidden="true" />

            <div className="absolute inset-0">
                {particles.map((p, i) => (
                    <span
                        key={i}
                        className="skillfund-particle"
                        style={
                            {
                                left: `${p.x}%`,
                                top: `${p.y}%`,
                                opacity: p.o,
                                transform: `translate3d(0,0,0) scale(${p.s})`,
                                animationDelay: `${p.d}ms`,
                            } as React.CSSProperties
                        }
                    />
                ))}
            </div>

            <div className="skillfund-hero__container app-container relative mx-auto flex min-h-[100vh] flex-col justify-center py-28">
                <div className="relative max-w-3xl">
                    <div className="glass-pill inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-slate-200">
                        <span className="h-2 w-2 rounded-full bg-[#10B981]" />
                        Premium, rules-first demo trading → real rewards (mocked MVP)
                    </div>

                    <h1 className="mt-6 text-5xl font-semibold leading-[1.02] tracking-tight sm:text-6xl">
                        TURN TRADING SKILL INTO REAL REWARDS.
                    </h1>

                    <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                        SkillFund bridges the gap between trading skill and opportunity.
                        Start with a small deposit. Trade with demo capital. Earn rewards based on performance.
                    </p>

                    <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
                        <Button asChild size="lg" className="magnetic bg-white text-[#050505] hover:bg-white/90">
                            <Link href="/deposit" aria-label="Start Trading">
                                Start Trading
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </Button>
                        <Button
                            size="lg"
                            variant="secondary"
                            className="magnetic border-white/20 bg-white/5 text-white hover:bg-white/10"
                            asChild
                        >
                            <Link href="#how-it-works">See How It Works</Link>
                        </Button>
                    </div>
                </div>

                <div className="skillfund-hero__cardWrap mt-14 flex items-center justify-center">
                    <div
                        className={`skillfund-hero__glassCard ${ready ? "is-ready" : ""}`}
                        style={
                            {
                                "--mx": cursor.x,
                                "--my": cursor.y,
                            } as React.CSSProperties
                        }
                        aria-hidden="true"
                    >
                        <div className="skillfund-hero__glassInner">
                            <div className="skillfund-stepRow">
                                <div className="skillfund-step">Deposit <span className="accent">₹100</span></div>
                                <div className="skillfund-step">→</div>
                                <div className="skillfund-step">Receive <span className="accent">$100</span> Demo Capital</div>
                                <div className="skillfund-step">→</div>
                                <div className="skillfund-step">Trade Session</div>
                                <div className="skillfund-step">→</div>
                                <div className="skillfund-step">+10% Performance</div>
                                <div className="skillfund-step">→</div>
                                <div className="skillfund-step">Reward <span className="gold">+₹5</span></div>
                                <div className="skillfund-step">→</div>
                                <div className="skillfund-step">Balance <span className="accent">₹105</span></div>
                            </div>

                            <div className="skillfund-hero__chart" aria-hidden="true">
                                <div className="skillfund-chartLine" />
                                <div className="skillfund-chartCandles" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

