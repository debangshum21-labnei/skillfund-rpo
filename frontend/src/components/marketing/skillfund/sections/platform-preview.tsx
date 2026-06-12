"use client";

import { useEffect, useRef, useState } from "react";

function clamp(v: number, min: number, max: number) {
    return Math.max(min, Math.min(max, v));
}

export function PlatformPreview() {
    const ref = useRef<HTMLDivElement | null>(null);
    const [p, setP] = useState(0);

    useEffect(() => {
        let raf = 0;
        const onScroll = () => {
            if (raf) return;
            raf = window.requestAnimationFrame(() => {
                raf = 0;
                const el = ref.current;
                if (!el) return;
                const r = el.getBoundingClientRect();
                const total = r.height + window.innerHeight;
                const v = 1 - Math.abs((r.top + r.bottom) / 2 - window.innerHeight / 2) / (window.innerHeight);
                setP(clamp(v, 0, 1));
            });
        };
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => {
            if (raf) window.cancelAnimationFrame(raf);
            window.removeEventListener("scroll", onScroll);
        };
    }, []);

    return (
        <section className="skillfund-section py-28" id="platform">
            <div className="app-container">
                <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
                    <div>
                        <p className="eyebrow">Platform preview</p>
                        <h2 className="skillfund-h2">A premium terminal, built around outcomes.</h2>
                        <p className="mt-5 text-lg leading-8 text-slate-300">
                            Wallet, session status, PnL, reward progress, and a realistic trading terminal—presented with depth and clarity.
                            (Visual mock only for the MVP.)
                        </p>
                    </div>

                    <div ref={ref} className="relative">
                        <div className="dashParallax" aria-hidden="true">
                            <div
                                className="dashLayer dashLayer--bg"
                                style={{ transform: `translate3d(0,${(1 - p) * 18}px,0)` }}
                            />
                            <div
                                className="dashLayer dashLayer--mid"
                                style={{ transform: `translate3d(${(p - 0.5) * 14}px,${(1 - p) * 10}px,0)` }}
                            />
                            <div
                                className="dashLayer dashLayer--fg"
                                style={{ transform: `translate3d(${(p - 0.5) * -10}px,${(1 - p) * -6}px,0)` }}
                            />
                        </div>

                        <div className="terminalMockBig" aria-hidden="true">
                            <div className="terminalTopBar" />
                            <div className="terminalGrid">
                                <div className="terminalCard" />
                                <div className="terminalCard" />
                                <div className="terminalCard terminalCard--wide" />
                                <div className="terminalCard" />
                            </div>
                            <div className="terminalMiniCandles" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

