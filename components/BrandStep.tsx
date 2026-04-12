"use client";

import { useState } from "react";
import { CATEGORIES, type Brand, type Company, type Category } from "@/data/catalog";
import type { Selection } from "@/lib/calc";

interface Props {
  categoryIds: string[];
  selections: Selection[];
  onChange: (s: Selection[]) => void;
  onBack: () => void;
  onNext: () => void;
}

export default function BrandStep({ categoryIds, selections, onChange, onBack, onNext }: Props) {
  const [activeTab, setActiveTab] = useState(categoryIds[0]);
  const categories = CATEGORIES.filter(c => categoryIds.includes(c.id));

  const isSelected = (brandId: string) => selections.some(s => s.brandId === brandId);

  const toggleBrand = (brand: Brand, company: Company, category: Category) => {
    if (isSelected(brand.id)) {
      onChange(selections.filter(s => s.brandId !== brand.id));
    } else {
      const newSel: Selection = {
        brandId: brand.id,
        categoryId: category.id,
        pm25_per_unit: brand.pm25,
        qty: 1,
        daysPerWeek: 7,
        isIndoor: false,
        brandName: brand.name,
        companyLabel: company.label,
        categoryLabel: category.label,
        variant: brand.variant,
      };
      onChange([...selections, newSel]);
    }
  };

  const activeCat = categories.find(c => c.id === activeTab)!;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-3xl font-display font-bold text-ink-50 mb-2">Choose your brands</h2>
        <p className="text-ink-400 text-sm">Grouped by manufacturer. Select all that you use.</p>
      </div>

      {/* Category tabs */}
      {categories.length > 1 && (
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={[
                "flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-mono whitespace-nowrap transition-all duration-200 border",
                activeTab === cat.id
                  ? "bg-ember-500/20 border-ember-500/50 text-ember-300"
                  : "bg-[var(--surface-2)] border-[var(--border)] text-ink-400 hover:border-[var(--border-hover)]",
              ].join(" ")}
            >
              <span>{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>
      )}

      {/* Companies + brands */}
      <div className="space-y-6 mb-8">
        {activeCat.companies.map(company => (
          <div key={company.id}>
            {/* Company header */}
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-2xs font-mono font-medium"
                style={{
                  background: `${company.accentColor}18`,
                  border: `1px solid ${company.accentColor}35`,
                  color: company.accentColor,
                }}
              >
                {company.logoInitials}
              </div>
              <div>
                <div className="text-sm font-medium text-ink-200">{company.label}</div>
                <div className="text-2xs text-ink-600 font-mono">{company.country}</div>
              </div>
            </div>

            {/* Brand cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {company.brands.map(brand => {
                const sel = isSelected(brand.id);
                return (
                  <button
                    key={brand.id}
                    onClick={() => toggleBrand(brand, company, activeCat)}
                    className={[
                      "relative text-left p-4 rounded-xl border transition-all duration-200 group",
                      sel
                        ? "bg-ember-950/50 border-ember-600/60"
                        : "bg-[var(--surface-1)] border-[var(--border)] hover:border-[var(--border-hover)] hover:bg-[var(--surface-2)]",
                    ].join(" ")}
                  >
                    {/* Selection indicator */}
                    {sel && (
                      <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-ember-500 flex items-center justify-center flex-shrink-0">
                        <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                          <path d="M1 3l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    )}

                    {/* Brand info */}
                    <div className="pr-6">
                      <div className="text-sm font-medium text-ink-100 mb-0.5">{brand.name}</div>
                      <div className="text-xs text-ink-500 mb-2">{brand.variant}</div>

                      {/* PM2.5 bar */}
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1 rounded-full bg-[var(--surface-3)] overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${Math.min(100, (brand.pm25 / 500) * 100)}%`,
                              background: getPm25Color(brand.pm25),
                            }}
                          />
                        </div>
                        <span className="text-2xs font-mono text-ink-400 tabular-nums w-16 text-right">
                          {brand.pm25 >= 1000
                            ? `${(brand.pm25 / 1000).toFixed(1)}g`
                            : `${brand.pm25}mg`
                          } PM2.5
                        </span>
                      </div>

                      {/* Tar / nicotine pills */}
                      <div className="flex gap-1.5 mt-2">
                        {brand.tar_mg !== null && (
                          <span className="text-2xs px-1.5 py-0.5 rounded bg-ink-800/80 text-ink-400 font-mono">
                            {brand.tar_mg}mg tar
                          </span>
                        )}
                        {brand.nicotine_mg !== null && (
                          <span className="text-2xs px-1.5 py-0.5 rounded bg-ink-800/80 text-ink-400 font-mono">
                            {brand.nicotine_mg}mg nic
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Note tooltip area */}
                    {brand.notes && (
                      <p className={[
                        "text-2xs text-ink-500 mt-2 leading-relaxed transition-all duration-200",
                        sel ? "block" : "hidden group-hover:block",
                      ].join(" ")}>
                        {brand.notes}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-sm text-ink-500 hover:text-ink-300 transition-colors"
        >
          ← back
        </button>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-ink-500">
            {selections.length} brand{selections.length !== 1 ? "s" : ""} selected
          </span>
          <button
            onClick={onNext}
            disabled={selections.length === 0}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-ember-500 text-white font-display font-medium text-sm disabled:opacity-30 disabled:cursor-not-allowed hover:bg-ember-600 active:scale-[0.98] transition-all"
          >
            Set quantities →
          </button>
        </div>
      </div>
    </div>
  );
}

function getPm25Color(pm25: number): string {
  if (pm25 <  20)  return "#22c55e";
  if (pm25 <  50)  return "#eab308";
  if (pm25 < 100)  return "#f97316";
  return "#ef4444";
}
