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

  const remaining = selections.length - reviewedCount;

  const actionProps = {
    onBack,
    onNext,
    allReviewed,
    remaining,
    totalDailyMg,
  };

  return (
    <div className={STICKY_BAR_SCROLL_PADDING}>
      <div className="mb-6">
        <h2 className="text-3xl font-display font-bold text-ink-50 mb-2">Daily intake</h2>
        <p className="text-ink-400 text-sm">
          Review each selected brand. Set how much you use on days you consume it, and how regular that habit is in a typical week.
        </p>
      </div>

      {needsReview && (
        <div className="mb-5 rounded-2xl border border-ember-500/20 bg-ember-500/10 p-4" role="status">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-medium text-ink-100">
                Confirm every selected item
              </div>
              <p className="mt-1 text-xs leading-relaxed text-ink-500">
                You picked multiple brands/categories. Update the quantity and regularity for each one, or tap &ldquo;Looks right&rdquo; if the defaults are correct.
              </p>
            </div>
            <div className="shrink-0 rounded-full bg-[var(--surface-1)] px-3 py-1.5 text-xs font-mono text-ember-400" aria-live="polite">
              {reviewedCount}/{selections.length} reviewed
            </div>
          </div>
        </div>
      )}

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
                    aria-hidden
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
                    ].join(" ")} aria-live="polite">
                      {isReviewed ? "reviewed" : `review ${index + 1}/${selections.length}`}
                    </div>
                  )}
                  <div className="text-xs font-mono text-ember-400" aria-label={`${Math.round(s.pm25_per_unit * s.qty * (s.daysPerWeek / 7))} milligrams PM2.5 per day`}>
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
                  <div className="flex items-center gap-3" role="group" aria-label={`Quantity for ${s.brandName}`}>
                    <button
                      type="button"
                      onClick={() => update(s.brandId, { qty: Math.max(0.5, s.qty - (s.qty > 1 ? 1 : 0.5)) })}
                      aria-label={`Decrease quantity for ${s.brandName}`}
                      className="w-10 h-10 rounded-full bg-[var(--surface-3)] border border-[var(--border)] text-ink-300 hover:bg-[var(--surface-2)] hover:text-ink-100 transition-all text-lg leading-none flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember-400"
                    >
                      −
                    </button>
                    <span className="w-10 text-center text-base font-mono font-medium text-ink-100 tabular-nums" aria-live="polite" aria-label={`Current quantity: ${s.qty % 1 === 0 ? s.qty : s.qty.toFixed(1)}`}>
                      {s.qty % 1 === 0 ? s.qty : s.qty.toFixed(1)}
                    </span>
                    <button
                      type="button"
                      onClick={() => update(s.brandId, { qty: s.qty + 1 })}
                      aria-label={`Increase quantity for ${s.brandName}`}
                      className="w-10 h-10 rounded-full bg-[var(--surface-3)] border border-[var(--border)] text-ink-300 hover:bg-[var(--surface-2)] hover:text-ink-100 transition-all text-lg leading-none flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember-400"
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
                  <span className="shrink-0 rounded-full bg-[var(--surface-1)] px-2.5 py-1 text-2xs font-mono text-ink-300" aria-live="polite">
                    {formatRegularity(s.daysPerWeek)}
                  </span>
                </div>
                <div className="grid grid-cols-7 gap-1.5" role="group" aria-label={`Days per week for ${s.brandName}`}>
                  {[1, 2, 3, 4, 5, 6, 7].map(dayCount => (
                    <button
                      key={dayCount}
                      type="button"
                      onClick={() => update(s.brandId, { daysPerWeek: dayCount })}
                      aria-pressed={s.daysPerWeek === dayCount}
                      aria-label={`${dayCount} ${dayCount === 1 ? "day" : "days"} per week`}
                      className={[
                        "rounded-lg border px-1 py-2 text-center transition-all min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember-400",
                        s.daysPerWeek === dayCount
                          ? "border-ember-500/60 bg-ember-500/15 text-ember-400"
                          : "border-[var(--border)] bg-[var(--surface-1)] text-ink-500 hover:border-[var(--border-hover)] hover:text-ink-300",
                      ].join(" ")}
                    >
                      <span className="block text-sm font-mono">{dayCount}</span>
                      <span className="block text-[9px] leading-none" aria-hidden>{dayCount === 7 ? "daily" : "days"}</span>
                    </button>
                  ))}
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
                      ? "bg-ember-950/60 border-ember-700/50 text-ember-300"
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

              {needsReview && !isReviewed && (
                <button
                  type="button"
                  onClick={() => markReviewed(s.brandId)}
                  aria-label={`Confirm ${s.brandName} details look right`}
                  className="mt-3 w-full min-h-[44px] rounded-lg border border-ember-500/30 bg-ember-500/10 px-3 py-2 text-xs font-medium text-ember-400 transition-all hover:bg-ember-500/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember-400"
                >
                  Looks right — confirm this item
                </button>
              )}
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

function formatRegularity(daysPerWeek: number): string {
  if (daysPerWeek === 7) return "Daily";
  if (daysPerWeek === 1) return "1 day/week";
  return `${daysPerWeek} days/week`;
}
