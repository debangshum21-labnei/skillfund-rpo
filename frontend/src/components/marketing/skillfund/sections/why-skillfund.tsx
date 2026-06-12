"use client";

import { useEffect, useRef, useState } from "react";

function useInView<T extends HTMLElement>(ref: React.RefObject<T | null>, rootMargin = "-10% 0px -30% 0px") {
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const io = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setInView(true);
            },
            { rootMargin, threshold: 0.12 }
        );

        io.observe(el);
        return () => io.disconnect();
    }, [ref, rootMargin]);

    return inView;
}

export function WhySkillfund() {
    const ref = useRef<HTMLDivElement | null>(null);
    const inView = useInView(ref);


    return (
        <section id="why" className="skillfund-section relative py-28" aria-label="Why SkillFund exists">
            <div className="app-container">
                <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
                    <div>
                        <p className="eyebrow">Why SkillFund exists</p>
                        <h2 className="skillfund-h2">
                            THE MARKET REWARDS CAPITAL.
                            <br />
                            WE REWARD SKILL.
                        </h2>

                        <p className="mt-6 text-lg leading-8" style={{ color: "rgba(255,255,255,0.88)" }}>
                            Thousands of traders spend months learning. Many develop real skills. Most never receive enough capital to
                            meaningfully apply them.
                        </p>
                        <p className="mt-4 text-lg leading-8" style={{ color: "rgba(255,255,255,0.88)" }}>
                            SkillFund exists to bridge that gap. By connecting trading performance with predefined rewards, SkillFund
                            gives traders a way to demonstrate and monetize skill.
                        </p>
                    </div>

                    <div ref={ref} className="relative">
                        <div className={`skillfund-cinematic ${inView ? "is-active" : ""}`} aria-hidden="true">
                            <div className="skillfund-cinematic__bgGlow" />
                            <div className="skillfund-cinematic__chart" />
                            <div className="skillfund-cinematic__wallet" />
                            <div className="skillfund-cinematic__connection" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

