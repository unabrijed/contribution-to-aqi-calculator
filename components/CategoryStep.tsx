"use client";

import { useState } from "react";
import { CATEGORIES } from "@/data/catalog";
import { searchByName } from "@/lib/search";
import { useDebouncedValue } from "@/lib/useDebouncedValue";
import { SearchBox, SearchEmptyState } from "@/components/SearchBox";

interface Props {
  selected: string[];
  onChange: (ids: string[]) => void;
  onNext: () => void;
}

export default function CategoryStep({ selected, onChange, onNext }: Props) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search);
  const visibleCategories = searchByName(CATEGORIES, debouncedSearch, cat => cat.label);

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

      <SearchBox
        value={search}
        onChange={setSearch}
        placeholder="Search categories..."
        label="Search smoke categories"
        className="mb-5"
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {visibleCategories.map(cat => {
          const isSelected = selected.includes(cat.id);
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => toggle(cat.id)}
              aria-pressed={isSelected}
              aria-label={`${cat.label}${isSelected ? ", selected" : ""}`}
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
                <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-ember-500 flex items-center justify-center" aria-hidden>
                  <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                    <path d="M1 3l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}

              {/* Icon */}
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3"
                style={{ background: `${cat.accentHex}18`, border: `1px solid ${cat.accentHex}28` }}
                aria-hidden
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

      {visibleCategories.length === 0 && debouncedSearch && (
        <SearchEmptyState query={debouncedSearch} context="categories" />
      )}

      {/* Next */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-ink-500 font-mono">
          {selected.length} selected
        </span>
        <button
          type="button"
          onClick={onNext}
          disabled={selected.length === 0}
          aria-disabled={selected.length === 0}
          aria-describedby={selected.length === 0 ? "cat-next-hint" : undefined}
          className="flex items-center gap-2 px-6 py-3 min-h-[44px] rounded-full bg-ember-500 text-white font-display font-medium text-sm disabled:opacity-30 disabled:cursor-not-allowed hover:bg-ember-600 active:scale-[0.98] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-0)]"
        >
          Next: choose brands →
        </button>
      </div>
      {selected.length === 0 && (
        <p id="cat-next-hint" className="sr-only">Select at least one category to continue.</p>
      )}
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
