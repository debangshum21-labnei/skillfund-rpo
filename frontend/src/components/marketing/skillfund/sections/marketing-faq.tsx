"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
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

export function MarketingFaq() {
    return (
        <Accordion type="single" collapsible className="skillfund-faq">
            {faqs.map((faq, index) => (
                <AccordionItem key={faq.question} value={`item-${index}`}>
                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                    <AccordionContent>
                        <div className="text-slate-300">{faq.answer}</div>
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    );
}

