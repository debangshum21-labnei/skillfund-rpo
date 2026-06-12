"use client";

import { useEffect, useMemo, useRef, useState, type RefObject } from "react";

function useInView(
    ref: RefObject<HTMLElement | null>,
    rootMargin = "-20% 0px -20% 0px"
) {
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const el = ref.current;

        if (!el) return;

        const io = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);
                }
            },
            {
                rootMargin,
                threshold: 0.15,
            }
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
        <section id="problem" className="skillfund-section relative py-28" aria-label="The real blocker">
            <div className="app-container">
                <div className="mb-10 max-w-3xl">
                    <p className="eyebrow">The real blocker</p>

                    <h2 className="skillfund-h2">
                        MOST TRADERS NEVER REACH REAL CAPITAL.
                    </h2>

                    <p className="mt-5 text-lg leading-8" style={{ color: "rgba(243,246,255,0.88)" }}>
                        Skill isn’t missing. Opportunity is. Most traders stop before they can trade with the capital their process deserves.
                    </p>

                    <div className="mt-4 flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/80 backdrop-blur">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#F59E0B]" />
                            Skill grows. Capital doesn’t.
                        </span>
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/80 backdrop-blur">
                            <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
                            Performance should create opportunity.
                        </span>
                    </div>
                </div>


                <div ref={ref} className="relative mx-auto max-w-4xl">
                    <div
                        className={`skillfund-timelineLine ${inView ? "is-drawn" : ""
                            }`}
                        aria-hidden="true"
                    />
                </div>

                <ol className="skillfund-timeline" aria-label="Trader journey timeline showing the progression from learning to giving up">
                    {items.map((it, idx) => (
                        <li
                            key={it.label}
                            className={`skillfund-timelineItem ${inView ? "is-active" : ""
                                } ${it.kind}`}
                            style={{
                                animationDelay: `${idx * 120}ms`,
                            }}
                        >
                            <div className="skillfund-timelineDot" aria-hidden="true" />

                            <div className="skillfund-timelineCard">
                                <div className="skillfund-timelineLabel">
                                    {it.label}
                                </div>
                            </div>
                        </li>
                    ))}
                </ol>

                <div className="mt-14 text-center">

                    <div className="mx-auto max-w-3xl">
                        <h3 className="skillfund-lead">
                            Skill should create opportunity.
                        </h3>
                    </div>
                </div>
            </div>
        </section>
    );
}