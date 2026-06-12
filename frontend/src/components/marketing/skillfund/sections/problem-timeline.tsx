"use client";

import { useEffect, useMemo, useRef, useState } from "react";

function useInView(ref: React.RefObject<HTMLElement | null>, rootMargin = "-20% 0px -20% 0px") {
    const [inView, setInView] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const io = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setInView(true);
            },
            { rootMargin, threshold: 0.15 }
        );
        io.observe(el);
        return () => io.disconnect();
    }, [ref, rootMargin]);
    return inView;
}

export function ProblemTimeline() {
    const ref = useRef<HTMLDivElement | null>(null);
    const inView = useInView(ref);

    const items = useMemo(
        () => [
            { label: "Learn Trading", kind: "neutral" },
            { label: "Practice", kind: "neutral" },
            { label: "Improve", kind: "neutral" },
            { label: "Trade Demo Accounts", kind: "neutral" },
            { label: "Stay Stuck", kind: "loss" },
            { label: "Give Up", kind: "loss" },
        ],
        []
    );

    return (
        <section id="problem" className="skillfund-section relative py-28">
            <div className="app-container">

                <div className="mb-10 max-w-3xl">
                    <p className="eyebrow">The Problem</p>
                    <h2 className="skillfund-h2">MOST TRADERS NEVER REACH REAL CAPITAL.</h2>
                </div>

                <div ref={ref} className="relative mx-auto max-w-4xl" />
                <div className={`skillfund-timelineLine ${inView ? "is-drawn" : ""}`} aria-hidden="true" />

                <ol className="skillfund-timeline" aria-label="Trading timeline">
                    {items.map((it, idx) => (
                        <li
                            key={it.label}
                            className={`skillfund-timelineItem ${inView ? "is-active" : ""} ${it.kind}`}
                            style={{ animationDelay: `${idx * 120}ms` }}
                        >
                            <div className="skillfund-timelineDot" />
                            <div className="skillfund-timelineCard">
                                <div className="skillfund-timelineLabel">{it.label}</div>
                            </div>
                        </li>
                    ))}
                </ol>
            </div>
            <div className="mt-14 text-center">
                <div className="mx-auto max-w-3xl">
                    <h3 className="skillfund-lead">Skill should create opportunity.</h3>
                </div>
            </div>
        </div>
        </section >

    );
}





