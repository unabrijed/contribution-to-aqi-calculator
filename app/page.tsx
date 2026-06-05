"use client";

import { useEffect, useState } from "react";
import { FaInstagram, FaTwitter } from "react-icons/fa";
import { Wind } from "lucide-react";
import type { Selection } from "@/lib/calc";
import LandingScreen   from "@/components/LandingScreen";
import CategoryStep    from "@/components/CategoryStep";
import BrandStep       from "@/components/BrandStep";
import QuantityStep    from "@/components/QuantityStep";
import ResultsScreen   from "@/components/ResultsScreen";
import StepBar         from "@/components/StepBar";
import LoadingScreen   from "@/components/LoadingScreen";

export type Step = "landing" | "category" | "brand" | "quantity" | "loading" | "results";

export default function Home() {
  const [step, setStep] = useState<Step>("landing");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selections, setSelections] = useState<Selection[]>([]);

  useEffect(() => {
    setSelections(prev => prev.filter(s => selectedCategories.includes(s.categoryId)));
  }, [selectedCategories]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [step]);

  const currentStepIndex = ["category", "brand", "quantity", "results"].indexOf(step);

  return (
    <main className="min-h-screen bg-[var(--surface-0)] relative">
      {/* Ambient top glow */}
      <div
        aria-hidden
        className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[320px]"
        style={{
          background: "radial-gradient(ellipse at 50% 0%, rgba(232,93,38,0.08) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-12">

        {/* Step progress bar (not shown on landing/loading/results) */}
        {step !== "landing" && step !== "results" && step !== "loading" && (
          <StepBar current={currentStepIndex} total={3} />
        )}

        {/* Step content */}
        <div className="animate-in">
          {step === "landing" && (
            <LandingScreen onStart={() => setStep("category")} />
          )}

          {step === "category" && (
            <CategoryStep
              selected={selectedCategories}
              onChange={setSelectedCategories}
              onNext={() => setStep("brand")}
            />
          )}

          {step === "brand" && (
            <BrandStep
              categoryIds={selectedCategories}
              selections={selections}
              onChange={setSelections}
              onBack={() => setStep("category")}
              onNext={() => setStep("quantity")}
            />
          )}

          {step === "quantity" && (
            <QuantityStep
              selections={selections}
              onChange={setSelections}
              onBack={() => setStep("brand")}
              onNext={() => setStep("loading")}
            />
          )}

          {step === "loading" && (
            <LoadingScreen onComplete={() => setStep("results")} />
          )}

          {step === "results" && (
            <ResultsScreen
              selections={selections}
              onReset={() => {
                setSelections([]);
                setSelectedCategories([]);
                setStep("landing");
              }}
            />
          )}
        </div>

      </div>
      
      {/* Global Footer for suggestions */}
      <div className="relative z-10 pb-12 pt-8 text-center max-w-3xl mx-auto px-4 flex flex-col items-center justify-center gap-3">
        <p className="text-sm sm:text-base font-medium text-ink-300">
          Have a brand suggestion to add?
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-1">
          <div
            aria-hidden
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-ember-600 to-ember-400 text-white shadow-sm"
          >
            <Wind className="h-5 w-5" />
          </div>
          <a
            href="https://instagram.com/unabrijed"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-[var(--surface-1)] border border-[var(--border)] text-ink-200 hover:text-ember-500 hover:border-ember-500/30 transition-all duration-300 shadow-sm hover:shadow-md"
          >
            <FaInstagram className="h-4 w-4 sm:h-4.5 sm:w-4.5 transition-transform group-hover:scale-110" />
            <span className="text-sm font-mono tracking-wide font-medium">Instagram</span>
          </a>
          <span className="hidden sm:inline text-ink-600 font-mono text-xs font-medium px-1">OR</span>
          <a
            href="https://twitter.com/unabrijed"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-[var(--surface-1)] border border-[var(--border)] text-ink-200 hover:text-ember-500 hover:border-ember-500/30 transition-all duration-300 shadow-sm hover:shadow-md"
          >
            <FaTwitter className="h-4 w-4 sm:h-4.5 sm:w-4.5 transition-transform group-hover:scale-110" />
            <span className="text-sm font-mono tracking-wide font-medium">Twitter</span>
          </a>
        </div>
      </div>
    </main>
  );
}
