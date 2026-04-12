"use client";

import { CATEGORIES } from "@/data/catalog";

interface Props {
  selected: string[];
  onChange: (ids: string[]) => void;
  onNext: () => void;
}

export default function CategoryStep({ selected, onChange, onNext }: Props) {
  const toggle = (id: string) => {
    onChange(
      selected.includes(id) ? selected.filter(s => s !== id) : [...selected, id]
    );
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-display font-bold text-ink-50 mb-2">
          Pick your poisons
        </h2>
        <p className="text-ink-400 text-sm">
          Select everything that applies. Multiple categories allowed.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {CATEGORIES.map(cat => {
          const isSelected = selected.includes(cat.id);
          return (
            <button
              key={cat.id}
              onClick={() => toggle(cat.id)}
              className={[
                "cat-card group relative text-left p-4 rounded-2xl border transition-all duration-200",
                "bg-[var(--surface-1)]",
                isSelected
                  ? "selected border-ember-500/70"
                  : "border-[var(--border)] hover:border-[var(--border-hover)]",
              ].join(" ")}
            >
              {/* Selection indicator */}
              {isSelected && (
                <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-ember-500 flex items-center justify-center">
                  <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                    <path d="M1 3l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}

              {/* Icon */}
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3"
                style={{ background: `${cat.accentHex}18`, border: `1px solid ${cat.accentHex}28` }}
              >
                {cat.icon}
              </div>

              {/* Label */}
              <div className="text-sm font-medium text-ink-100 leading-tight mb-1">
                {cat.label}
              </div>

              {/* PM2.5 range */}
              <div className="text-2xs font-mono text-ink-500">
                {getPM25Range(cat.id)}
              </div>
            </button>
          );
        })}
      </div>

      {/* Next */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-ink-500 font-mono">
          {selected.length} selected
        </span>
        <button
          onClick={onNext}
          disabled={selected.length === 0}
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-ember-500 text-white font-display font-medium text-sm disabled:opacity-30 disabled:cursor-not-allowed hover:bg-ember-600 active:scale-[0.98] transition-all duration-200"
        >
          Next: choose brands →
        </button>
      </div>
    </div>
  );
}

function getPM25Range(catId: string): string {
  const cat = CATEGORIES.find(c => c.id === catId);
  if (!cat) return "";
  const all = cat.companies.flatMap(co => co.brands.map(b => b.pm25));
  const mn = Math.min(...all), mx = Math.max(...all);
  return mn === mx ? `${mn} mg/use` : `${mn}–${mx} mg/use`;
}
