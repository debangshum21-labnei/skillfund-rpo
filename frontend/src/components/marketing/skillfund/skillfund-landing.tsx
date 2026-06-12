"use client";

import { useMemo } from "react";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { SkillfundHero } from "./sections/skillfund-hero";
import { ProblemTimeline } from "./sections/problem-timeline";
import { WhySkillfund } from "./sections/why-skillfund";
import { HowItWorksPinned } from "./sections/how-it-works-pinned";
import { RewardExample } from "./sections/reward-example";
import { RewardCalculator } from "./sections/reward-calculator";
import { TrustArchitecture } from "./sections/trust-architecture";
import { PlatformPreview } from "./sections/platform-preview";
import { MarketingFaq } from "./sections/marketing-faq";
import { FounderMessage } from "./sections/founder-message";
import { FinalCta } from "./sections/final-cta";

export function SkillfundLanding() {
    const sections = useMemo(
        () => [
            { id: "hero" },
            { id: "problem" },
            { id: "why" },
            { id: "how" },
            { id: "reward-example" },
            { id: "reward-calculator" },
            { id: "trust" },
            { id: "platform" },
            { id: "faq" },
            { id: "founder" },
            { id: "cta" },
        ],
        []
    );

    return (
        <>
            <Navbar />
            <SkillfundHero />
            <main>
                <ProblemTimeline />
                <WhySkillfund />
                <HowItWorksPinned />
                <RewardExample />
                <RewardCalculator />
                <TrustArchitecture />
                <PlatformPreview />
                <MarketingFaq />
                <FounderMessage />
                <FinalCta />
            </main>
            <Footer />
        </>
    );
}

