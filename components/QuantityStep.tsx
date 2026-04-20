"use client";

import { useState } from "react";
import { CATEGORIES } from "@/data/catalog";
import { searchByName } from "@/lib/search";
import { useDebouncedValue } from "@/lib/useDebouncedValue";
import type { Selection } from "@/lib/calc";

interface Props {
  selections: Selection[];
  onChange: (s: Selection[]) => void;
  onBack: () => void;
  onNext: () => void;
}

export default function QuantityStep({ selections, onChange, onBack, onNext }: Props) {
  const [search, setSearch] = useState("");
  const [reviewedBrandIds, setReviewedBrandIds] = useState<string[]>([]);
  const debouncedSearch = useDebouncedValue(search);
  const visibleSelections = searchByName(selections, debouncedSearch, s => s.brandName);
  const needsReview = selections.length > 1;
  const reviewedCount = selections.filter(s => reviewedBrandIds.includes(s.brandId)).length;
  const allReviewed = !needsReview || reviewedCount === selections.length;

  const update = (brandId: string, patch: Partial<Selection>) => {
    markReviewed(brandId);
    onChange(selections.map(s => s.brandId === brandId ? { ...s, ...patch } : s));
  };

  const markReviewed = (brandId: string) => {
    setReviewedBrandIds(ids => ids.includes(brandId) ? ids : [...ids, brandId]);
  };

  const totalDailyMg = selections.reduce((acc, s) => {
    const eff = s.daysPerWeek / 7;
    return acc + s.pm25_per_unit * s.qty * eff;
  }, 0);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl font-display font-bold text-ink-50 mb-2">Daily intake</h2>
        <p className="text-ink-400 text-sm">
          Review each selected brand. Set how much you use on days you consume it, and how regular that habit is in a typical week.
        </p>
      </div>

      {needsReview && (
        <div className="mb-5 rounded-2xl border border-ember-500/20 bg-ember-500/10 p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-medium text-ink-100">
                Confirm every selected item
              </div>
              <p className="mt-1 text-xs leading-relaxed text-ink-500">
                You picked multiple brands/categories. Update the quantity and regularity for each one, or tap “Looks right” if the defaults are correct.
              </p>
            </div>
            <div className="shrink-0 rounded-full bg-[var(--surface-1)] px-3 py-1.5 text-xs font-mono text-ember-400">
              {reviewedCount}/{selections.length} reviewed
            </div>
          </div>
        </div>
      )}

      <SearchBox
        value={search}
        onChange={setSearch}
        placeholder="Search selected brands..."
        className="mb-5"
      />

      <div className="space-y-3 mb-8">
        {visibleSelections.map((s, index) => {
          const cat = CATEGORIES.find(c => c.id === s.categoryId);
          const co  = cat?.companies.find(co => co.brands.some(b => b.id === s.brandId));
          const isReviewed = reviewedBrandIds.includes(s.brandId);
          return (
            <div
              key={s.brandId}
              className={[
                "bg-[var(--surface-1)] border rounded-2xl p-5 transition-all",
                needsReview && !isReviewed
                  ? "border-ember-500/30"
                  : "border-[var(--border)]",
              ].join(" ")}
            >
              {/* Brand header */}
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-2xs font-mono font-medium flex-shrink-0"
                    style={{
                      background: `${co?.accentColor ?? "#e85d26"}18`,
                      border: `1px solid ${co?.accentColor ?? "#e85d26"}35`,
                      color: co?.accentColor ?? "#e85d26",
                    }}
                  >
                    {co?.logoInitials ?? "?"}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-ink-100">{s.brandName}</div>
                    <div className="text-2xs text-ink-500 font-mono">{s.variant} · {s.categoryLabel}</div>
                  </div>
                </div>
                <div className="text-right">
                  {needsReview && (
                    <div className={[
                      "mb-1 text-2xs font-mono",
                      isReviewed ? "text-green-500" : "text-ember-400",
                    ].join(" ")}>
                      {isReviewed ? "reviewed" : `review ${index + 1}/${selections.length}`}
                    </div>
                  )}
                  <div className="text-xs font-mono text-ember-400">
                    {Math.round(s.pm25_per_unit * s.qty * (s.daysPerWeek / 7))} mg/day
                  </div>
                </div>
              </div>

              {/* Quantity row */}
              <div className="mb-5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] p-3">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-medium text-ink-300">Amount on a use day</div>
                    <div className="text-2xs text-ink-600">{cat?.unitLabel}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => update(s.brandId, { qty: Math.max(0.5, s.qty - (s.qty > 1 ? 1 : 0.5)) })}
                      className="w-8 h-8 rounded-full bg-[var(--surface-3)] border border-[var(--border)] text-ink-300 hover:bg-[var(--surface-2)] hover:text-ink-100 transition-all text-lg leading-none flex items-center justify-center"
                    >
                      −
                    </button>
                    <span className="w-10 text-center text-base font-mono font-medium text-ink-100 tabular-nums">
                      {s.qty % 1 === 0 ? s.qty : s.qty.toFixed(1)}
                    </span>
                    <button
                      onClick={() => update(s.brandId, { qty: s.qty + 1 })}
                      className="w-8 h-8 rounded-full bg-[var(--surface-3)] border border-[var(--border)] text-ink-300 hover:bg-[var(--surface-2)] hover:text-ink-100 transition-all text-lg leading-none flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Consumption regularity */}
              <div className="mb-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] p-3">
                <div className="mb-3 flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs font-medium text-ink-300">Consumption regularity</div>
                    <div className="mt-0.5 text-2xs leading-relaxed text-ink-600">
                      In a typical week, on how many days do you use this?
                    </div>
                  </div>
                  <span className="shrink-0 rounded-full bg-[var(--surface-1)] px-2.5 py-1 text-2xs font-mono text-ink-300">
                    {formatRegularity(s.daysPerWeek)}
                  </span>
                </div>
                <div className="grid grid-cols-7 gap-1.5">
                  {[1, 2, 3, 4, 5, 6, 7].map(dayCount => (
                    <button
                      key={dayCount}
                      onClick={() => update(s.brandId, { daysPerWeek: dayCount })}
                      className={[
                        "rounded-lg border px-1 py-2 text-center transition-all",
                        s.daysPerWeek === dayCount
                          ? "border-ember-500/60 bg-ember-500/15 text-ember-400"
                          : "border-[var(--border)] bg-[var(--surface-1)] text-ink-500 hover:border-[var(--border-hover)] hover:text-ink-300",
                      ].join(" ")}
                      aria-label={`${dayCount} ${dayCount === 1 ? "day" : "days"} per week`}
                    >
                      <span className="block text-sm font-mono">{dayCount}</span>
                      <span className="block text-[9px] leading-none">{dayCount === 7 ? "daily" : "days"}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Indoor toggle */}
              <button
                onClick={() => update(s.brandId, { isIndoor: !s.isIndoor })}
                className={[
                  "flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs border transition-all duration-200 w-full",
                  s.isIndoor
                    ? "bg-ember-950/60 border-ember-700/50 text-ember-300"
                    : "bg-[var(--surface-2)] border-[var(--border)] text-ink-500 hover:border-[var(--border-hover)]",
                ].join(" ")}
              >
                <div
                  className={[
                    "w-7 h-4 rounded-full flex items-center px-0.5 transition-all duration-300",
                    s.isIndoor ? "bg-ember-500 justify-end" : "bg-[var(--surface-3)] justify-start",
                  ].join(" ")}
                >
                  <div className="w-3 h-3 rounded-full bg-white" />
                </div>
                <div className="text-xs text-ink-500 max-w-[200px] leading-snug">
                  {s.isIndoor
                    ? "Smoked indoors: 3.5x PM2.5 impact on others"
                    : "Smoked outdoors: tap to change"}
                </div>
              </button>

              {needsReview && !isReviewed && (
                <button
                  onClick={() => markReviewed(s.brandId)}
                  className="mt-3 w-full rounded-lg border border-ember-500/30 bg-ember-500/10 px-3 py-2 text-xs font-medium text-ember-400 transition-all hover:bg-ember-500/15"
                >
                  Looks right — confirm this item
                </button>
              )}
            </div>
          );
        })}
      </div>

      {visibleSelections.length === 0 && (
        <div className="mb-8 rounded-2xl border border-[var(--border)] bg-[var(--surface-1)] p-6 text-center text-sm text-ink-500">
          No selected brands match “{debouncedSearch}”.
        </div>
      )}

      {/* Running daily total */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] mb-6">
        <span className="text-sm text-ink-400">Estimated daily PM2.5</span>
        <span className="text-lg font-mono font-medium text-ember-400">
          {totalDailyMg >= 1000
            ? `${(totalDailyMg / 1000).toFixed(2)}g`
            : `${Math.round(totalDailyMg)}mg`
          }
        </span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="text-sm text-ink-500 hover:text-ink-300 transition-colors">
          ← back
        </button>
        <button
          onClick={onNext}
          disabled={!allReviewed}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-ember-500 text-white font-display font-medium text-sm hover:bg-ember-600 active:scale-[0.98] transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-ember-500"
        >
          {allReviewed ? "Calculate my impact →" : `Review ${selections.length - reviewedCount} more →`}
        </button>
      </div>
    </div>
  );
}

function formatRegularity(daysPerWeek: number): string {
  if (daysPerWeek === 7) return "Daily";
  if (daysPerWeek === 1) return "1 day/week";
  return `${daysPerWeek} days/week`;
}


function SearchBox({ value, onChange, placeholder, className = "" }: { value: string; onChange: (value: string) => void; placeholder: string; className?: string }) {
  return (
    <div className={["relative", className].join(" ")}>
      <input
        type="search"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-1)] px-4 py-3 pl-10 text-sm text-ink-100 placeholder:text-ink-600 outline-none transition-all focus:border-ember-500/60 focus:ring-2 focus:ring-ember-500/10"
      />
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-600">⌕</span>
    </div>
  );
}
