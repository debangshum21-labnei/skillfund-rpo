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
            aria-label="Hero section"
        >
            <div className="skillfund-hero__bg" aria-hidden="true" />
            <div className="skillfund-hero__noise" aria-hidden="true" />

            <div className="absolute inset-0" aria-hidden="true">
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
                    <div className="glass-pill inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm" style={{ color: "rgba(255,255,255,0.88)" }}>


                        <span className="h-2 w-2 rounded-full bg-[#10B981]" />
                        Skill first. Outcomes capped. Rewards based on performance.
                    </div>

                    <h1 className="mt-6 text-5xl font-semibold leading-[1.02] tracking-tight sm:text-6xl">
                        SKILL GROWS. CAPITAL DOESN’T.
                    </h1>

                    <p className="mt-6 max-w-2xl text-lg leading-8 skillfund-text-88">
                        SkillFund turns your demo trading into bounded, rules-first rewards.
                        You’re not “hoping for volatility”—you’re executing a process with measurable outcomes.
                    </p>

                    <div className="mt-5 flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/80 backdrop-blur">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" /> Performance → reward mapping
                        </span>
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/80 backdrop-blur">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#3B82F6]" /> Session caps keep outcomes bounded
                        </span>
                    </div>


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

                            <div className="skillfund-chartLine mt-4" aria-hidden="true" />

                            <div className="skillfund-hero__chart" aria-hidden="true">
                                <svg viewBox="0 0 720 160" preserveAspectRatio="none" role="presentation" focusable="false">
                                    <defs>
                                        <linearGradient id="sf-line" x1="0" y1="0" x2="720" y2="0" gradientUnits="userSpaceOnUse">
                                            <stop offset="0" stopColor="rgba(59,130,246,0)" />
                                            <stop offset="0.2" stopColor="rgba(59,130,246,0.85)" />
                                            <stop offset="0.55" stopColor="rgba(16,185,129,0.85)" />
                                            <stop offset="1" stopColor="rgba(16,185,129,0)" />
                                        </linearGradient>
                                        <linearGradient id="sf-candle" x1="0" y1="0" x2="0" y2="160" gradientUnits="userSpaceOnUse">
                                            <stop offset="0" stopColor="rgba(16,185,129,0.65)" />
                                            <stop offset="1" stopColor="rgba(16,185,129,0)" />
                                        </linearGradient>
                                        <filter id="sf-glow" x="-30%" y="-50%" width="160%" height="200%">
                                            <feGaussianBlur stdDeviation="3" result="blur" />
                                            <feMerge>
                                                <feMergeNode in="blur" />
                                                <feMergeNode in="SourceGraphic" />
                                            </feMerge>
                                        </filter>
                                    </defs>

                                    {/* baseline grid */}
                                    <g opacity="0.35">
                                        {Array.from({ length: 6 }).map((_, i) => {
                                            const y = 20 + i * 24;
                                            return (
                                                <path
                                                    key={i}
                                                    d={`M 0 ${y} L 720 ${y}`}
                                                    stroke="rgba(255,255,255,0.06)"
                                                    strokeWidth="1"
                                                />
                                            );
                                        })}
                                    </g>

                                    {/* animated line */}
                                    <path
                                        className="sf-line"
                                        d="M 18 108 C 86 80, 120 92, 162 78 S 240 58, 298 72 S 392 102, 446 84 S 538 48, 600 66 S 662 106, 702 86"
                                        fill="none"
                                        stroke="url(#sf-line)"
                                        strokeWidth="4"
                                        strokeLinecap="round"
                                        filter="url(#sf-glow)"
                                    />

                                    {/* soft glow pass */}
                                    <path
                                        className="sf-glow"
                                        d="M 18 108 C 86 80, 120 92, 162 78 S 240 58, 298 72 S 392 102, 446 84 S 538 48, 600 66 S 662 106, 702 86"
                                        fill="none"
                                        stroke="rgba(16,185,129,0.35)"
                                        strokeWidth="8"
                                        strokeLinecap="round"
                                        opacity="0.55"
                                    />

                                    {/* candles */}
                                    <g>
                                        {[
                                            { x: 74, w: 16, y: 88, o: 0.8 },
                                            { x: 110, w: 16, y: 70, o: 0.95 },
                                            { x: 146, w: 16, y: 78, o: 0.85 },
                                            { x: 182, w: 16, y: 54, o: 0.98 },
                                            { x: 218, w: 16, y: 66, o: 0.9 },
                                            { x: 254, w: 16, y: 60, o: 0.92 },
                                            { x: 290, w: 16, y: 40, o: 1 },
                                            { x: 326, w: 16, y: 58, o: 0.9 },
                                            { x: 362, w: 16, y: 46, o: 0.96 },
                                            { x: 398, w: 16, y: 62, o: 0.88 },
                                            { x: 434, w: 16, y: 36, o: 1 },
                                            { x: 470, w: 16, y: 52, o: 0.92 },
                                            { x: 506, w: 16, y: 44, o: 0.95 },
                                            { x: 542, w: 16, y: 66, o: 0.88 },
                                            { x: 578, w: 16, y: 58, o: 0.9 },
                                        ].map((c, i) => (
                                            <g key={i} className="sf-candle" style={{ animationDelay: `${i * 80}ms`, transformOrigin: `${c.x + c.w / 2}px 80px` }}>
                                                <path
                                                    d={`M ${c.x + c.w / 2} 130 L ${c.x + c.w / 2} ${c.y}`}
                                                    stroke="rgba(16,185,129,0.55)"
                                                    strokeWidth="3"
                                                    strokeLinecap="round"
                                                    opacity={c.o}
                                                />
                                                <rect
                                                    x={c.x}
                                                    y={c.y}
                                                    width={c.w}
                                                    height={130 - c.y}
                                                    rx="6"
                                                    fill="url(#sf-candle)"
                                                    stroke="rgba(16,185,129,0.55)"
                                                    strokeWidth="1"
                                                    opacity={c.o}
                                                />
                                            </g>
                                        ))}
                                    </g>
                                </svg>
                            </div>

                        </div>
                    </div>
                </div>

                <div className="skillfund-chartCandles mx-auto mt-6 max-w-[720px]" aria-hidden="true" />
            </div>
        </section>
    );
}

