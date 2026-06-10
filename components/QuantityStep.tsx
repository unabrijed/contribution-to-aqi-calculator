"use client";

import { useState } from "react";
import { CATEGORIES } from "@/data/catalog";
import { searchByName } from "@/lib/search";
import { useDebouncedValue } from "@/lib/useDebouncedValue";
import type { Selection } from "@/lib/calc";
import { SearchBox, SearchEmptyState, IndoorOutdoorFact } from "@/components/SearchBox";
import StickyActionBar, { STICKY_BAR_SCROLL_PADDING } from "@/components/StickyActionBar";
import QuantityStepActions from "@/components/QuantityStepActions";

interface Props {
  selections: Selection[];
  onChange: (s: Selection[]) => void;
  onBack: () => void;
  onNext: () => void;
}

const FREQUENCY_OPTIONS = [
  { label: "Every day", days: 7 },
  { label: "Most days", days: 5 },
  { label: "A few days", days: 3 },
  { label: "Rarely", days: 1 },
] as const;

export default function QuantityStep({ selections, onChange, onBack, onNext }: Props) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search);
  const visibleSelections = searchByName(selections, debouncedSearch, s => s.brandName);

  const update = (brandId: string, patch: Partial<Selection>) => {
    onChange(selections.map(s => s.brandId === brandId ? { ...s, ...patch } : s));
  };

  const totalDailyMg = selections.reduce((acc, s) => {
    const eff = s.daysPerWeek / 7;
    return acc + s.pm25_per_unit * s.qty * eff;
  }, 0);

  const actionProps = { onBack, onNext, totalDailyMg };

  return (
    <div className={STICKY_BAR_SCROLL_PADDING}>
      <div className="mb-6">
        <h2 className="text-3xl font-display font-bold text-ink-50 mb-2">How much do you smoke?</h2>
        <p className="text-ink-400 text-sm">
          For each brand you picked, set how many and how often. We&rsquo;ve pre-filled a guess — adjust what doesn&rsquo;t fit.
        </p>
      </div>

      <StickyActionBar position="top">
        <QuantityStepActions {...actionProps} variant="top" />
      </StickyActionBar>

      <SearchBox
        value={search}
        onChange={setSearch}
        placeholder="Search selected brands..."
        label="Search your selected brands"
        className="mb-5"
      />

      <div className="space-y-3 mb-8">
        {visibleSelections.map(s => {
          const cat = CATEGORIES.find(c => c.id === s.categoryId);
          const co  = cat?.companies.find(co => co.brands.some(b => b.id === s.brandId));
          const unitNoun = (cat?.unitLabel.split("/")[0] ?? "uses").trim();
          const perWeek = s.qty * s.daysPerWeek;
          const perWeekFmt = perWeek % 1 === 0 ? perWeek : perWeek.toFixed(1);
          const activeDays = nearestFrequency(s.daysPerWeek);
          return (
            <div
              key={s.brandId}
              className="bg-[var(--surface-1)] border border-[var(--border)] rounded-2xl p-5 transition-all"
            >
              {/* Brand header */}
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-2xs font-mono font-medium flex-shrink-0"
                  style={{
                    background: `${co?.accentColor ?? "#e85d26"}18`,
                    border: `1px solid ${co?.accentColor ?? "#e85d26"}35`,
                    color: co?.accentColor ?? "#e85d26",
                  }}
                  aria-hidden
                >
                  {co?.logoInitials ?? "?"}
                </div>
                <div>
                  <div className="text-sm font-medium text-ink-100">{s.brandName}</div>
                  <div className="text-2xs text-ink-500 font-mono">{s.variant} · {s.categoryLabel}</div>
                </div>
              </div>

              {/* How many a day */}
              <div className="mb-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] p-3">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-medium text-ink-300">How many a day?</div>
                    <div className="text-2xs text-ink-600">{unitNoun}</div>
                  </div>
                  <div className="flex items-center gap-3" role="group" aria-label={`Amount per day for ${s.brandName}`}>
                    <button
                      type="button"
                      onClick={() => update(s.brandId, { qty: Math.max(0.5, s.qty - (s.qty > 1 ? 1 : 0.5)) })}
                      aria-label={`Decrease amount for ${s.brandName}`}
                      className="w-10 h-10 rounded-full bg-[var(--surface-3)] border border-[var(--border)] text-ink-300 hover:bg-[var(--surface-2)] hover:text-ink-100 transition-all text-lg leading-none flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember-400"
                    >
                      −
                    </button>
                    <span className="w-10 text-center text-base font-mono font-medium text-ink-100 tabular-nums" aria-live="polite" aria-label={`${s.qty % 1 === 0 ? s.qty : s.qty.toFixed(1)} per day`}>
                      {s.qty % 1 === 0 ? s.qty : s.qty.toFixed(1)}
                    </span>
                    <button
                      type="button"
                      onClick={() => update(s.brandId, { qty: s.qty + 1 })}
                      aria-label={`Increase amount for ${s.brandName}`}
                      className="w-10 h-10 rounded-full bg-[var(--surface-3)] border border-[var(--border)] text-ink-300 hover:bg-[var(--surface-2)] hover:text-ink-100 transition-all text-lg leading-none flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember-400"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* How often */}
              <div className="mb-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] p-3">
                <div className="mb-3 text-xs font-medium text-ink-300">How often?</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5" role="group" aria-label={`How often for ${s.brandName}`}>
                  {FREQUENCY_OPTIONS.map(opt => {
                    const active = activeDays === opt.days;
                    return (
                      <button
                        key={opt.days}
                        type="button"
                        onClick={() => update(s.brandId, { daysPerWeek: opt.days })}
                        aria-pressed={active}
                        aria-label={`${opt.label} (${opt.days} ${opt.days === 1 ? "day" : "days"} a week)`}
                        className={[
                          "rounded-lg border px-2 py-2 text-center transition-all min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember-400",
                          active
                            ? "border-ember-500/60 bg-ember-500/15 text-ember-600 dark:text-ember-400"
                            : "border-[var(--border)] bg-[var(--surface-1)] text-ink-500 hover:border-[var(--border-hover)] hover:text-ink-300",
                        ].join(" ")}
                      >
                        <span className="block text-xs font-medium">{opt.label}</span>
                        <span className="block text-[9px] leading-none mt-0.5 font-mono opacity-70" aria-hidden>
                          {opt.days === 7 ? "7 days" : `${opt.days} days/wk`}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Indoor toggle */}
              <div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={s.isIndoor}
                  aria-label={`Smoking location for ${s.brandName}: currently ${s.isIndoor ? "indoors" : "outdoors"}. Toggle to change.`}
                  onClick={() => update(s.brandId, { isIndoor: !s.isIndoor })}
                  className={[
                    "flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs border transition-all duration-200 w-full min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember-400",
                    s.isIndoor
                      ? "bg-[var(--ember-soft-bg)] border-ember-500/50 text-ember-600 dark:text-ember-300"
                      : "bg-[var(--surface-2)] border-[var(--border)] text-ink-500 hover:border-[var(--border-hover)]",
                  ].join(" ")}
                >
                  <div
                    className={[
                      "w-7 h-4 rounded-full flex items-center px-0.5 transition-all duration-300 shrink-0",
                      s.isIndoor ? "bg-ember-500 justify-end" : "bg-[var(--surface-3)] justify-start",
                    ].join(" ")}
                    aria-hidden
                  >
                    <div className="w-3 h-3 rounded-full bg-white" />
                  </div>
                  <span className="text-xs">
                    {s.isIndoor
                      ? "Smoked indoors"
                      : "Smoked outdoors — tap to change"}
                  </span>
                </button>
                <IndoorOutdoorFact />
              </div>

              {/* Human summary */}
              <p className="mt-4 text-xs text-ink-500">
                That&rsquo;s about{" "}
                <span className="font-mono font-medium text-ink-200 tabular-nums">{perWeekFmt}</span>{" "}
                {unitNoun} a week.
              </p>
            </div>
          );
        })}
      </div>

      {visibleSelections.length === 0 && debouncedSearch && (
        <SearchEmptyState query={debouncedSearch} context="selections" />
      )}

      <StickyActionBar position="bottom">
        <QuantityStepActions {...actionProps} variant="bottom" />
      </StickyActionBar>
    </div>
  );
}

function nearestFrequency(daysPerWeek: number): number {
  let best: number = FREQUENCY_OPTIONS[0].days;
  for (const opt of FREQUENCY_OPTIONS) {
    if (Math.abs(opt.days - daysPerWeek) < Math.abs(best - daysPerWeek)) best = opt.days;
  }
  return best;
}
