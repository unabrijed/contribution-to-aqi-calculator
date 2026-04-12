"use client";

import { CATEGORIES } from "@/data/catalog";
import type { Selection } from "@/lib/calc";

interface Props {
  selections: Selection[];
  onChange: (s: Selection[]) => void;
  onBack: () => void;
  onNext: () => void;
}

export default function QuantityStep({ selections, onChange, onBack, onNext }: Props) {

  const update = (brandId: string, patch: Partial<Selection>) => {
    onChange(selections.map(s => s.brandId === brandId ? { ...s, ...patch } : s));
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
          Set your average per day and how often during the week.
        </p>
      </div>

      <div className="space-y-3 mb-8">
        {selections.map(s => {
          const cat = CATEGORIES.find(c => c.id === s.categoryId);
          const co  = cat?.companies.find(co => co.brands.some(b => b.id === s.brandId));
          return (
            <div
              key={s.brandId}
              className="bg-[var(--surface-1)] border border-[var(--border)] rounded-2xl p-5"
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
                  <div className="text-xs font-mono text-ember-400">
                    {Math.round(s.pm25_per_unit * s.qty * (s.daysPerWeek / 7))} mg/day
                  </div>
                </div>
              </div>

              {/* Quantity row */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-ink-400">{cat?.unitLabel}</span>
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

              {/* Days per week slider */}
              <div className="mb-4">
                <div className="flex justify-between text-2xs font-mono text-ink-500 mb-1.5">
                  <span>Days per week</span>
                  <span className="text-ink-300">{s.daysPerWeek === 7 ? "daily" : `${s.daysPerWeek}×/wk`}</span>
                </div>
                <input
                  type="range"
                  min={1} max={7} step={1}
                  value={s.daysPerWeek}
                  onChange={e => update(s.brandId, { daysPerWeek: +e.target.value })}
                  className="w-full accent-ember-500"
                />
                <div className="flex justify-between text-2xs text-ink-700 font-mono mt-1">
                  <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span>
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
            </div>
          );
        })}
      </div>

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
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-ember-500 text-white font-display font-medium text-sm hover:bg-ember-600 active:scale-[0.98] transition-all"
        >
          Calculate my impact →
        </button>
      </div>
    </div>
  );
}
