"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TrustStrip } from "@/components/layout/navbar";

export function HeroSection() {
  return (
    <section className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-primary text-white">
      <div className="absolute inset-0 opacity-35">
        <div className="grid h-full grid-cols-6 grid-rows-6">
          {Array.from({ length: 36 }).map((_, index) => (
            <span key={index} className="border border-white/10" />
          ))}
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(to_top,#0f172a,transparent)]" />
      <div className="app-container relative flex min-h-[calc(100vh-4rem)] flex-col justify-center py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-sm text-slate-200">
            <ShieldCheck className="h-4 w-4 text-success" />
            Transparent session rules. Simulated trading MVP.
          </div>
          <h1 className="text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">SkillFund</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            A skill-based capital growth platform where small deposits unlock demo trading sessions,
            and predefined performance rules determine real wallet rewards or deductions.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="bg-white text-primary hover:bg-slate-100">
              <Link href="/dashboard">
                View MVP dashboard <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="border-white/20 bg-white/10 text-white hover:bg-white/15">
              <Link href="/terminal">Open terminal</Link>
            </Button>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mt-12 max-w-5xl rounded-card border border-white/15 bg-white/10 p-4 shadow-2xl backdrop-blur"
        >
          <div className="grid gap-4 md:grid-cols-[1fr_320px]">
            <div className="min-h-64 rounded-xl bg-slate-950 p-4">
              <div className="mb-4 flex items-center justify-between text-sm">
                <span className="text-slate-300">EUR/USD · Demo feed</span>
                <span className="text-success">+5.40% session</span>
              </div>
              <div className="flex h-48 items-end gap-2">
                {[38, 44, 41, 52, 58, 63, 57, 69, 75, 71, 82, 89, 86, 94].map((height, index) => (
                  <span
                    key={index}
                    className={index % 5 === 0 ? "w-full rounded-t bg-red-400" : "w-full rounded-t bg-green-400"}
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
            </div>
            <div className="grid gap-3">
              {[
                ["Real wallet", "₹8,750"],
                ["Demo wallet", "$105.40"],
                ["Next reward tier", "+10% demo profit"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl border border-white/15 bg-white/10 p-4">
                  <p className="text-sm text-slate-300">{label}</p>
                  <p className="mt-1 text-2xl font-semibold">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
        <div className="mt-8">
          <TrustStrip inverted />
        </div>
      </div>
    </section>
  );
}
