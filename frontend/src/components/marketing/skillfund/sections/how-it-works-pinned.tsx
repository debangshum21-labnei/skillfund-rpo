"use client";

import { useEffect, useMemo, useRef, useState } from "react";

function clamp(v: number, min: number, max: number) {
    return Math.max(min, Math.min(max, v));
}

export function HowItWorksPinned() {
    const steps = useMemo(
        () => [
            { id: "deposit", title: "Deposit", subtitle: "Start with a small deposit", badge: "₹100" },
            { id: "demo", title: "Receive Demo Capital", subtitle: "Trading with simulation", badge: "$100" },
            { id: "trade", title: "Trade", subtitle: "Session terminal comes alive", badge: "PnL" },
            { id: "tracking", title: "Performance Tracking", subtitle: "Progress indicators", badge: "+10%" },
            { id: "settlement", title: "Settlement", subtitle: "Wallet updates and glow", badge: "+₹5" },
        ],
        []
    );

    const wrapRef = useRef<HTMLDivElement | null>(null);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        let raf = 0;
        const onScroll = () => {
            if (raf) return;
            raf = window.requestAnimationFrame(() => {
                raf = 0;
                const el = wrapRef.current;
                if (!el) return;
                const r = el.getBoundingClientRect();
                // When top is above viewport and until bottom passes
                const total = r.height - window.innerHeight;
                const p = total <= 0 ? 1 : (window.innerHeight - r.top) / total;
                setProgress(clamp(p, 0, 1));
            });
        };
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => {
            if (raf) window.cancelAnimationFrame(raf);
            window.removeEventListener("scroll", onScroll);
        };
    }, []);

    const activeIndex = Math.min(steps.length - 1, Math.floor(progress * steps.length));

    return (
        <section id="how-it-works" className="skillfund-section relative py-28" aria-label="How it works">
            <div className="app-container">
                <div className="mb-10 max-w-3xl">
                    <p className="eyebrow">How it works</p>
                    <h2 className="skillfund-h2">A pinned, scroll-linked product flow.</h2>
                </div>
            </div>

            <div ref={wrapRef} className="relative">
                <div className="skillfund-pinnedTrack" aria-hidden="true" />

                <div className="skillfund-pinnedContainer">
                    <div className="skillfund-pinnedSticky" style={{ ['--p' as any]: progress }}>
                        <div className="skillfund-pinnedLeft" aria-hidden="true">
                            <div className="skillfund-terminalMock" />
                            <div className={`skillfund-pinnedGlow ${activeIndex >= 2 ? "is-on" : ""}`} />
                        </div>

                        <div className="skillfund-pinnedRight">
                            {steps.map((s, idx) => (
                                <div
                                    key={s.id}
                                    className={`skillfund-stepCard ${idx === activeIndex ? "is-active" : idx < activeIndex ? "is-past" : ""}`}
                                    style={{ ['--i' as any]: idx }}
                                >
                                    <div className="skillfund-stepMeta">
                                        <div className="skillfund-stepIndex">{idx + 1}</div>
                                        <div>
                                            <div className="skillfund-stepTitle">{s.title}</div>
                                            <div className="skillfund-stepSubtitle">{s.subtitle}</div>
                                        </div>
                                    </div>
                                    <div className="skillfund-stepBadge">{s.badge}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="skillfund-pinnedSpacer" />
                </div>
            </div>
        </section>
    );
}

