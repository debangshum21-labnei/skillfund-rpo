"use client";

import { useMemo, useRef, useState } from "react";

function clamp(v: number, min: number, max: number) {
    return Math.max(min, Math.min(max, v));
}

export function TrustArchitecture() {
    const cards = useMemo(
        () => [
            { title: "Transparent Rules", value: "Every reward and deduction is predefined." },
            { title: "Performance-Based System", value: "Results matter." },
            { title: "Defined Session Limits", value: "Clear beginning and ending conditions." },
            { title: "Low Entry Barrier", value: "Accessible to ambitious traders." },
            { title: "Future AI Insights", value: "Performance analysis and guidance (roadmap)." },
            { title: "Clear Settlement Logic", value: "Understand every balance update." },
        ],
        []
    );

    const wrapRef = useRef<HTMLDivElement | null>(null);
    const [tilt, setTilt] = useState({ rx: 0, ry: 0, gx: 50, gy: 30 });

    return (
        <section className="skillfund-section py-28" id="trust" aria-label="Trust architecture">
            <div className="app-container">
                <div className="mb-10 max-w-3xl">
                    <p className="eyebrow">Trust architecture</p>
                    <h2 className="skillfund-h2">DESIGNED AROUND TRANSPARENCY.</h2>
                </div>

                <div
                    ref={wrapRef}
                    className="relative"
                    onPointerMove={(e) => {
                        const el = wrapRef.current;
                        if (!el) return;
                        const r = el.getBoundingClientRect();
                        const x = (e.clientX - r.left) / r.width;
                        const y = (e.clientY - r.top) / r.height;
                        const rx = (y - 0.5) * -10;
                        const ry = (x - 0.5) * 12;
                        setTilt({ rx, ry, gx: x * 100, gy: y * 100 });
                    }}
                    onPointerLeave={() => setTilt({ rx: 0, ry: 0, gx: 50, gy: 30 })}
                >
                    <div
                        className="trustTiltGrid"
                        aria-hidden="true"
                        style={
                            {
                                transform: `perspective(900px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
                                backgroundPosition: `${tilt.gx}% ${tilt.gy}%`,
                            } as React.CSSProperties
                        }
                    />

                    <div className="grid gap-4 md:grid-cols-3">
                        {cards.map((c) => (
                            <div key={c.title} className="trustCard">
                                <div className="trustCardTitle">{c.title}</div>
                                <div className="trustCardValue">{c.value}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

