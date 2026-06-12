"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FinalCta() {
    return (
        <section className="skillfund-finalCta relative py-24">
            <div className="app-container">
                <div className="mx-auto max-w-3xl text-center">
                    <h2 className="skillfund-finalTitle">READY TO PUT YOUR TRADING SKILL TO WORK?</h2>
                    <p className="mt-4 text-lg leading-8 text-slate-300">
                        Join a new generation of performance-driven traders.
                    </p>
                    <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                        <Button asChild size="lg" className="magnetic bg-white text-[#050505] hover:bg-white/90">
                            <Link href="/deposit">
                                Start Trading <ArrowRight className="h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}

