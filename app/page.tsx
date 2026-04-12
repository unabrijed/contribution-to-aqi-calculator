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
    <main className="min-h-screen bg-[var(--surface-0)]">
      {/* Ambient top glow */}
      <div
        aria-hidden
        className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[320px]"
        style={{
          background: "radial-gradient(ellipse at 50% 0%, rgba(232,93,38,0.08) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-12">

        {/* Logo mark */}
        <div className="flex items-center gap-3 mb-12">
          <div className="w-7 h-7 rounded-full border border-ember-500/40 flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-ember-500" />
          </div>
          <span className="text-xs font-mono text-ink-400 tracking-widest uppercase">
            AQI Contribution
          </span>
        </div>

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
    </main>
  );
}
