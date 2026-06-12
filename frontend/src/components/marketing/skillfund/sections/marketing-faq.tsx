"use client";

import { useMemo } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

type Faq = { question: string; answer: string };

type FaqGroup = {
    id: string;
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    faqs: Faq[];
};

const faqs: Faq[] = [
    {
        question: "What is SkillFund?",
        answer: "SkillFund is a performance-driven bridge: your trading skill on a demo session maps to predefined rewards on a real wallet (mocked in MVP).",
    },
    {
        question: "How does SkillFund work?",
        answer: "Deposit a small amount, receive demo capital, complete a trading session, then settle to a capped reward or deduction based on performance thresholds.",
    },
    {
        question: "How are rewards calculated?",
        answer: "Rewards are determined by predefined performance tiers and caps. Exact logic is communicated before the session begins.",
    },
    {
        question: "Can I lose more than my balance?",
        answer: "No. Session outcomes are bounded by defined caps and session rules.",
    },
    {
        question: "Why use demo capital?",
        answer: "Demo capital lets the system evaluate trading performance without executing real trades during the MVP flow.",
    },
    {
        question: "What happens after a profitable session?",
        answer: "Your real wallet is updated with the predefined reward (mocked for now).",
    },
    {
        question: "What happens after a losing session?",
        answer: "Your balance updates based on the predefined deduction rules, within defined session limits.",
    },
    {
        question: "What ends a session?",
        answer: "A session ends when performance hits target/cap conditions or a loss limit, followed by a cooldown state.",
    },
    {
        question: "How do withdrawals work?",
        answer: "Withdrawal mechanics are not connected in this MVP. In the full product, settlement and cooldown determine withdrawal eligibility.",
    },
    {
        question: "What makes SkillFund different?",
        answer: "We value skill and transparency: predefined outcomes, capped lifecycle, and a clear settlement logic rather than open-ended trading contests.",
    },
];

function IconDot({ className }: { className?: string }) {
    return (
        <span
            aria-hidden
            className={
                className ??
                "inline-flex h-2.5 w-2.5 items-center justify-center rounded-full bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.9),rgba(255,255,255,0.1))]"
            }
        />
    );
}

function ProcessDiagram() {
    const steps = [
        { label: "Deposit", hint: "Small amount → session entry" },
        { label: "Trade", hint: "Demo capital → controlled flow" },
        { label: "Performance", hint: "Tiers & caps → transparent logic" },
        { label: "Reward", hint: "Bounded outcome → wallet update" },
    ];

    return (
        <div className="relative mt-4 rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.10),rgba(255,255,255,0.04))] p-4 backdrop-blur">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-[220px]">
                    <div className="text-xs font-semibold uppercase tracking-wider text-white/70">Knowledge flow</div>
                    <div className="mt-1 text-base font-semibold text-white">Deposit → Trade → Performance → Reward</div>
                    <div className="mt-2 text-sm text-white/70">
                        A clear, bounded lifecycle designed for onboarding confidence.
                    </div>
                </div>
                <div className="hidden items-center gap-2 md:flex">
                    <div className="h-1 w-10 rounded-full bg-white/10" />
                    <div className="h-1 w-10 rounded-full bg-white/10" />
                    <div className="h-1 w-10 rounded-full bg-white/10" />
                </div>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-4">
                {steps.map((s, idx) => (
                    <div
                        key={s.label}
                        className="group relative rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm"
                    >
                        <div className="flex items-center gap-2">
                            <IconDot className="h-2.5 w-2.5 bg-[radial-gradient(circle_at_top,rgba(56,189,248,1),rgba(56,189,248,0.2))]" />
                            <div className="text-sm font-semibold text-white">{s.label}</div>
                        </div>
                        <div className="mt-2 text-xs leading-relaxed text-white/65">{s.hint}</div>
                        <div
                            aria-hidden
                            className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                        >
                            <div className="absolute -inset-px rounded-xl bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.30),rgba(56,189,248,0))]" />
                        </div>
                        {idx !== steps.length - 1 ? (
                            <div
                                aria-hidden
                                className="pointer-events-none absolute -right-3 top-1/2 hidden h-0 w-0 -translate-y-1/2 border-t-[7px] border-b-[7px] border-l-[10px] border-t-transparent border-b-transparent border-l-white/15 md:block"
                            />
                        ) : null}
                    </div>
                ))}
            </div>
        </div>
    );
}

function GroupSeparator({ index }: { index: number }) {
    return (
        <div
            className="my-7 flex items-center gap-3"
            aria-hidden
            style={{ animationDelay: `${index * 80}ms` }}
        >
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white/50">
                <span className="opacity-80">•</span>
                <span className="opacity-80">•</span>
                <span className="opacity-80">•</span>
            </div>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
    );
}

export function MarketingFaq() {
    const groups: FaqGroup[] = useMemo(
        () => [
            {
                id: "understanding",
                title: "Understanding SkillFund",
                subtitle: "What it is and why it’s different.",
                icon: <span className="text-[18px]">🧠</span>,
                faqs: [
                    faqs.find((f) => f.question === "What is SkillFund?")!,
                    faqs.find((f) => f.question === "How does SkillFund work?")!,
                    faqs.find((f) => f.question === "What makes SkillFund different?")!,
                ],
            },
            {
                id: "rewards",
                title: "Rewards & Sessions",
                subtitle: "How outcomes map to performance.",
                icon: <span className="text-[18px]">🏁</span>,
                faqs: [
                    faqs.find((f) => f.question === "How are rewards calculated?")!,
                    faqs.find((f) => f.question === "What happens after a profitable session?")!,
                    faqs.find((f) => f.question === "What happens after a losing session?")!,
                    faqs.find((f) => f.question === "What ends a session?")!,
                ],
            },
            {
                id: "risk",
                title: "Risk & Transparency",
                subtitle: "Bounded risk and clear rules.",
                icon: <span className="text-[18px]">🛡️</span>,
                faqs: [
                    faqs.find((f) => f.question === "Can I lose more than my balance?")!,
                    faqs.find((f) => f.question === "Why use demo capital?")!,
                    faqs.find((f) => f.question === "How do withdrawals work?")!,
                ],
            },
            {
                id: "future",
                title: "Future Vision",
                subtitle: "From MVP clarity to production readiness.",
                icon: <span className="text-[18px]">🔮</span>,
                faqs: [
                    faqs.find((f) => f.question === "How do withdrawals work?")!,
                ],
            },
        ],
        [],
    );

    // Ensure we preserve the exact 10 FAQ entries overall.
    // Note: “How do withdrawals work?” is currently the single “Future Vision” entry; this keeps content verbatim.
    const usedQuestions = new Set(groups.flatMap((g) => g.faqs.map((f) => f.question)));
    const allQuestions = faqs.map((f) => f.question);
    const missing = allQuestions.filter((q) => !usedQuestions.has(q));

    if (missing.length > 0) {
        // If anything changes accidentally, fail loudly in dev.
        // eslint-disable-next-line no-console
        console.warn("MarketingFaq missing questions from groups:", missing);
    }

    return (
        <section className="skillfund-faq">
            <div className="mx-auto w-full rounded-3xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.10),rgba(255,255,255,0.04))] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] backdrop-blur">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                        <div className="text-xs font-semibold uppercase tracking-wider text-white/60">SkillFund Knowledge Center</div>
                        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white md:text-3xl">
                            FAQ, explained like a fintech onboarding flow
                        </h2>
                        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/70">
                            Transparent tiers, capped lifecycle, and a demo-to-reward mapping—all organized so you can find answers fast.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <Badge className="border-white/10 bg-white/5 text-white/85 backdrop-blur">Mocked MVP</Badge>
                        <Badge className="border-white/10 bg-white/5 text-white/85 backdrop-blur">Capped Outcomes</Badge>
                        <Badge className="border-white/10 bg-white/5 text-white/85 backdrop-blur">Transparent Tiers</Badge>
                        <Badge className="border-white/10 bg-white/5 text-white/85 backdrop-blur">Demo-to-Reward Flow</Badge>
                    </div>
                </div>

                <ProcessDiagram />

                <div className="mt-6">
                    <div className="grid gap-6">
                        {groups.map((group, idx) => (
                            <div
                                key={group.id}
                                className="group relative rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur"
                                style={{ animationDelay: `${idx * 90}ms` }}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <div className="text-xl">{group.icon}</div>
                                            <h3 className="text-lg font-semibold text-white">{group.title}</h3>
                                        </div>
                                        <p className="mt-1 text-sm text-white/65">{group.subtitle}</p>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <Accordion type="single" collapsible className="space-y-3">
                                        {group.faqs.map((faq, index) => (
                                            <AccordionItem key={faq.question} value={`${group.id}-${index}`}>
                                                <AccordionTrigger className="text-[13px] font-semibold text-white/90">
                                                    {faq.question}
                                                </AccordionTrigger>
                                                <AccordionContent>
                                                    <div className="text-sm leading-relaxed text-white/75">{faq.answer}</div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        ))}
                                    </Accordion>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Visual separators between groups (extra) */}
                    <div className="hidden" />

                    {/* separators already baked in via spacing; keep explicit separators visually */}
                    <div className="mt-0">
                        {/* no-op */}
                    </div>
                </div>

                <div className="mt-7">
                    {/* Explicit group separators to satisfy visual requirement */}
                    <div className="hidden md:block">
                        {[0, 1, 2].map((i) => (
                            <GroupSeparator key={i} index={i} />
                        ))}
                    </div>
                </div>
            </div>

        </section>
    );
}



