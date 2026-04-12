"use client";

import { useState } from "react";
import type { Selection } from "@/lib/calc";
import LandingScreen   from "@/components/LandingScreen";
import CategoryStep    from "@/components/CategoryStep";
import BrandStep       from "@/components/BrandStep";
import QuantityStep    from "@/components/QuantityStep";
import ResultsScreen   from "@/components/ResultsScreen";
import StepBar         from "@/components/StepBar";

export type Step = "landing" | "category" | "brand" | "quantity" | "results";

export default function Home() {
  const [step, setStep] = useState<Step>("landing");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selections, setSelections] = useState<Selection[]>([]);

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

        {/* Step progress bar (not shown on landing/results) */}
        {step !== "landing" && step !== "results" && (
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
              onNext={() => setStep("results")}
            />
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
      <div className="relative z-10 pb-8 text-center text-xs text-ink-400 max-w-3xl mx-auto px-4">
        for brand suggestions for addition dm <a href="https://instagram.com/unabrijed" target="_blank" rel="noopener noreferrer" className="underline hover:text-ink-200 transition-colors">@unabrijed on instagram</a> or <a href="https://twitter.com/unabrijed" target="_blank" rel="noopener noreferrer" className="underline hover:text-ink-200 transition-colors">twitter</a>.
      </div>
    </main>
  );
}
