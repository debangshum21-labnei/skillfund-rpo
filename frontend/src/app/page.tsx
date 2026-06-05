import Link from "next/link";
import {
  BadgeIndianRupee,
  BarChart4,
  CheckCircle2,
  Clock,
  LineChart,
  LockKeyhole,
  ShieldCheck,
  Target,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { FAQAccordion } from "@/components/marketing/faq-accordion";
import { FeatureCard } from "@/components/marketing/feature-card";
import { HeroSection } from "@/components/marketing/hero-section";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { rewardTiers, sessionRules } from "@/lib/mock-data";

const solutionFeatures: Array<{ icon: LucideIcon; title: string; description: string }> = [
  { icon: Wallet, title: "Deposit", description: "₹100 real wallet" },
  { icon: LineChart, title: "Trade", description: "$100 demo wallet" },
  { icon: BadgeIndianRupee, title: "Settle", description: "Rules update balance" },
];

const productFeatures: Array<{ icon: LucideIcon; title: string; description: string }> = [
  { icon: ShieldCheck, title: "Transparent rules", description: "Every reward, deduction, cap, and session limit is visible before action." },
  { icon: BarChart4, title: "Terminal-first experience", description: "The product centers on simulated execution, live PnL, and position awareness." },
  { icon: LockKeyhole, title: "Trust groundwork", description: "Mock-only flows keep the frontend ready for future compliance and payment integrations." },
  { icon: Clock, title: "Cooldown states", description: "Session completion and restart timing are represented as first-class UX states." },
  { icon: Target, title: "Progress feedback", description: "Reward tiers and loss buffers help users understand current risk." },
  { icon: CheckCircle2, title: "Investor-ready polish", description: "Reusable components make the demo consistent across product surfaces." },
];

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <main>
        <Section id="problem" eyebrow="Problem" title="Skilled traders often get stuck before capital.">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              ["Practice without payoff", "Demo performance rarely converts into income for traders with small starting capital."],
              ["Capital is uneven", "Most funded account products are expensive or optimized for larger balances."],
              ["Trust is fragile", "Users need simple rules, capped outcomes, and a clear session lifecycle."],
            ].map(([title, text]) => (
              <Card key={title} className="shadow-sm">
                <CardContent className="p-5">
                  <h3 className="font-semibold text-primary">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">{text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Section>

        <Section id="solution" eyebrow="Solution" title="A rule-based bridge between deposit and performance.">
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="space-y-4 text-sm leading-7 text-muted">
              <p>
                SkillFund maps a real deposit to a demo trading wallet. The user trades the demo
                wallet only, while session performance determines a predefined reward or deduction
                on the real wallet.
              </p>
              <p>
                The MVP should make every threshold visible before the user starts a session:
                target, loss limit, cooldown, reward cap, and settlement status.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {solutionFeatures.map((feature) => (
                <FeatureCard key={feature.title} icon={feature.icon} title={feature.title} description={feature.description} />
              ))}
            </div>
          </div>
        </Section>

        <Section id="how-it-works" eyebrow="Flow" title="How it works">
          <div className="grid gap-4 md:grid-cols-4">
            {["Deposit money", "Receive demo balance", "Trade a session", "Earn or absorb settlement"].map((step, index) => (
              <div key={step} className="rounded-card border border-border bg-white p-5 shadow-sm">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-white">
                  {index + 1}
                </span>
                <h3 className="mt-5 font-semibold text-primary">{step}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">
                  {index === 0 && "User chooses an amount. Payment is mocked in this frontend."}
                  {index === 1 && "Equivalent demo credit appears for simulated trading."}
                  {index === 2 && "PnL is tracked against session thresholds."}
                  {index === 3 && "Rules determine the next real wallet state."}
                </p>
              </div>
            ))}
          </div>
        </Section>

        <Section id="rewards" eyebrow="Reward model" title="Simple tiers with a capped upside.">
          <div className="grid gap-4 md:grid-cols-3">
            {rewardTiers.map((tier) => (
              <Card key={tier.label} className="shadow-sm">
                <CardContent className="p-5">
                  <p className="text-sm font-medium text-muted">{tier.label}</p>
                  <p className="mt-3 text-3xl font-semibold text-primary">{tier.demoProfitPercent}%</p>
                  <p className="mt-2 text-sm text-muted">Demo profit unlocks {tier.rewardPercent}% of deposit.</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Section>

        <Section id="rules" eyebrow="Session rules" title="The session lifecycle is deliberately finite.">
          <div className="grid gap-4 md:grid-cols-4">
            {sessionRules.map((rule) => (
              <Card key={rule.label} className="shadow-sm">
                <CardContent className="p-5">
                  <p className="text-sm text-muted">{rule.label}</p>
                  <p className="mt-2 text-xl font-semibold text-primary">{rule.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Section>

        <Section id="features" eyebrow="MVP features" title="Built for demos, user testing, and future services.">
          <div className="grid gap-4 md:grid-cols-3">
            {productFeatures.map((feature) => (
              <FeatureCard key={feature.title} icon={feature.icon} title={feature.title} description={feature.description} />
            ))}
          </div>
        </Section>

        <Section id="faq" eyebrow="FAQ" title="Questions users and investors will ask.">
          <FAQAccordion />
        </Section>

        <section className="bg-primary py-16 text-white">
          <div className="app-container flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-medium text-slate-300">Ready for the product walkthrough</p>
              <h2 className="mt-2 text-3xl font-semibold">Explore the SkillFund MVP console.</h2>
            </div>
            <Button asChild size="lg" className="bg-white text-primary hover:bg-slate-100">
              <Link href="/dashboard">Open dashboard</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="py-16">
      <div className="app-container">
        <div className="mb-8 max-w-2xl">
          <p className="text-sm font-semibold uppercase text-success">{eyebrow}</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-normal text-primary">{title}</h2>
        </div>
        {children}
      </div>
    </section>
  );
}
