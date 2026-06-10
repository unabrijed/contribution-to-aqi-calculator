"use client";

import { useEffect, useState } from "react";
import { CATEGORIES, type Brand, type Company, type Category } from "@/data/catalog";
import type { Selection } from "@/lib/calc";
import { searchByName } from "@/lib/search";
import { useDebouncedValue } from "@/lib/useDebouncedValue";
import { SearchBox, SearchEmptyState, IndoorOutdoorFact } from "@/components/SearchBox";
import StickyActionBar, { STICKY_BAR_SCROLL_PADDING } from "@/components/StickyActionBar";
import BrandStepActions from "@/components/BrandStepActions";

interface Props {
  categoryIds: string[];
  selections: Selection[];
  onChange: (s: Selection[]) => void;
  onBack: () => void;
  onNext: () => void;
}

function buildDefaultIndoorMap(categoryIds: string[]): Record<string, boolean> {
  const map: Record<string, boolean> = {};
  for (const id of categoryIds) {
    const cat = CATEGORIES.find(c => c.id === id);
    map[id] = cat?.defaultIsIndoor ?? false;
  }
  return map;
}

function selectionCountForCategory(selections: Selection[], categoryId: string): number {
  return selections.filter(s => s.categoryId === categoryId).length;
}

export default function BrandStep({ categoryIds, selections, onChange, onBack, onNext }: Props) {
  const [activeTab, setActiveTab] = useState(categoryIds[0] ?? "");
  const [search, setSearch] = useState("");
  const [categoryIndoor, setCategoryIndoor] = useState<Record<string, boolean>>(() =>
    buildDefaultIndoorMap(categoryIds),
  );
  const debouncedSearch = useDebouncedValue(search);
  const categories = CATEGORIES.filter(c => categoryIds.includes(c.id));

  const categoryKey = categoryIds.join(",");

  useEffect(() => {
    setCategoryIndoor(buildDefaultIndoorMap(categoryIds));
    setActiveTab(prev => (categoryIds.includes(prev) ? prev : (categoryIds[0] ?? "")));
  }, [categoryKey]);

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
        isIndoor: categoryIndoor[category.id] ?? category.defaultIsIndoor,
        brandName: brand.name,
        companyLabel: company.label,
        categoryLabel: category.label,
        variant: brand.variant,
      };
      onChange([...selections, newSel]);
    }
  };

  const setIndoorForCategory = (catId: string, indoor: boolean) => {
    setCategoryIndoor(prev => ({ ...prev, [catId]: indoor }));
    onChange(selections.map(s => (s.categoryId === catId ? { ...s, isIndoor: indoor } : s)));
  };

  const applyMasterIndoor = (indoor: boolean) => {
    setCategoryIndoor(
      Object.fromEntries(categoryIds.map(id => [id, indoor])) as Record<string, boolean>,
    );
    onChange(selections.map(s => ({ ...s, isIndoor: indoor })));
  };

  const allOutdoor = categoryIds.length > 0 && categoryIds.every(id => categoryIndoor[id] === false);
  const allIndoor = categoryIds.length > 0 && categoryIds.every(id => categoryIndoor[id] === true);
  const masterMixed = categoryIds.length > 0 && !allOutdoor && !allIndoor;

  const activeCat = categories.find(c => c.id === activeTab)!;
  const visibleCompanies = debouncedSearch.trim()
    ? activeCat.companies
        .map(company => ({
          ...company,
          brands: searchByName(company.brands, debouncedSearch, brand => brand.name),
        }))
        .filter(company => company.brands.length > 0)
    : activeCat.companies;

  const activeCategoryCount = selectionCountForCategory(selections, activeTab);
  const firstIncompleteId =
    categoryIds.find(id => selectionCountForCategory(selections, id) === 0) ?? null;
  const categoriesComplete = firstIncompleteId === null;

  const nextIncompleteLabel =
    firstIncompleteId != null ? categories.find(c => c.id === firstIncompleteId)?.label : null;

  const primaryDisabled = activeCategoryCount === 0;
  const primaryLabel = categoriesComplete
    ? "Set quantities →"
    : `Next: ${nextIncompleteLabel ?? "category"} →`;

  const primaryLabelShort = categoriesComplete
    ? "Quantities →"
    : "Next →";

  const handlePrimary = () => {
    if (categoriesComplete) onNext();
    else if (firstIncompleteId) setActiveTab(firstIncompleteId);
  };

  const footerSummary =
    categories.length > 1
      ? categoryIds
          .map(id => {
            const cat = categories.find(c => c.id === id);
            const n = selectionCountForCategory(selections, id);
            const short = cat?.label ?? id;
            return n > 0 ? `${short} ✓` : `${short} — pick 1+`;
          })
          .join(" · ")
      : `${selections.length} brand${selections.length !== 1 ? "s" : ""} selected`;

  const masterLabel = allOutdoor
    ? "All outdoor"
    : allIndoor
    ? "All indoor"
    : "Mixed";

  const primaryHint = primaryDisabled
    ? `Pick at least one brand in ${activeCat.label} to continue.`
    : undefined;

  const actionProps = {
    onBack,
    onPrimary: handlePrimary,
    primaryDisabled,
    primaryLabel,
    primaryLabelShort,
    footerSummary,
    hint: primaryHint,
  };

  return (
    <div className={STICKY_BAR_SCROLL_PADDING}>
      <div className="mb-6">
        <h2 className="text-3xl font-display font-bold text-ink-50 mb-2">Choose your brands</h2>
        <p className="text-ink-400 text-sm">
          Pick at least one brand per category.
        </p>
      </div>

      {/* Master indoor/outdoor toggle */}
      <div className="mb-5 rounded-2xl border border-[var(--border)] bg-[var(--surface-1)] p-4">
        <div className="mb-2 text-xs font-medium text-ink-300">All categories — usual setting</div>
        <div
          role="group"
          aria-label="Default indoor/outdoor setting for all categories"
          className="flex flex-wrap items-center gap-2"
        >
          <div className="flex rounded-full border border-[var(--border)] bg-[var(--surface-2)] p-0.5">
            <button
              type="button"
              onClick={() => applyMasterIndoor(false)}
              aria-pressed={allOutdoor && !masterMixed}
              className={[
                "rounded-full px-3 py-1.5 text-2xs font-mono transition-all min-h-[32px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember-400 focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--surface-2)]",
                allOutdoor && !masterMixed
                  ? "bg-ember-500/25 text-ember-300"
                  : "text-ink-500 hover:text-ink-300",
              ].join(" ")}
            >
              Outdoor
            </button>
            <button
              type="button"
              onClick={() => applyMasterIndoor(true)}
              aria-pressed={allIndoor && !masterMixed}
              className={[
                "rounded-full px-3 py-1.5 text-2xs font-mono transition-all min-h-[32px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember-400 focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--surface-2)]",
                allIndoor && !masterMixed
                  ? "bg-ember-500/25 text-ember-300"
                  : "text-ink-500 hover:text-ink-300",
              ].join(" ")}
            >
              Indoor
            </button>
          </div>
          {masterMixed && (
            <span className="text-2xs font-mono text-ink-600">Mixed — tap to align all</span>
          )}
          <span className="sr-only">Currently: {masterLabel}</span>
        </div>
        <IndoorOutdoorFact />
      </div>

      <StickyActionBar position="top">
        <BrandStepActions {...actionProps} variant="top" />
      </StickyActionBar>

      {/* Category tabs */}
      {categories.length > 1 && (
        <div
          role="tablist"
          aria-label="Smoke categories"
          className="flex gap-2 mb-3 overflow-x-auto pb-1"
        >
          {categories.map(cat => {
            const n = selectionCountForCategory(selections, cat.id);
            const done = n >= 1;
            const isActive = activeTab === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`tab-panel-${cat.id}`}
                id={`tab-${cat.id}`}
                onClick={() => setActiveTab(cat.id)}
                className={[
                  "flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-mono whitespace-nowrap transition-all duration-200 border min-h-[36px]",
                  isActive
                    ? "bg-ember-500/20 border-ember-500/50 text-ember-300"
                    : "bg-[var(--surface-2)] border-[var(--border)] text-ink-400 hover:border-[var(--border-hover)]",
                  !done ? "border-amber-600/40" : "",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-0)]",
                ].join(" ")}
              >
                <span aria-hidden>{cat.icon}</span>
                <span>{cat.label}</span>
                <span
                  className={[
                    "text-[10px] font-mono",
                    done ? "text-green-500/90" : "text-amber-500/90",
                  ].join(" ")}
                  aria-hidden
                >
                  {done ? "✓" : "!"}
                </span>
                <span className="sr-only">{done ? ", done" : ", needs a selection"}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Per-category indoor/outdoor toggle */}
      <div
        id={`tab-panel-${activeTab}`}
        role="tabpanel"
        aria-labelledby={`tab-${activeTab}`}
      >
        <div className="mb-6 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-2xs text-ink-500">
              <span className="font-medium text-ink-300">{activeCat.label}</span>
              {" — usual for this category:"}
            </span>
            <div
              role="group"
              aria-label={`Usual setting for ${activeCat.label}`}
              className="flex rounded-full border border-[var(--border)] bg-[var(--surface-1)] p-0.5"
            >
              <button
                type="button"
                onClick={() => setIndoorForCategory(activeTab, false)}
                aria-pressed={!(categoryIndoor[activeTab] ?? false)}
                className={[
                  "rounded-full px-2.5 py-1 text-2xs font-mono transition-all min-h-[28px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember-400 focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--surface-1)]",
                  !(categoryIndoor[activeTab] ?? false)
                    ? "bg-ember-500/20 text-ember-300"
                    : "text-ink-500 hover:text-ink-300",
                ].join(" ")}
              >
                Outdoor
              </button>
              <button
                type="button"
                onClick={() => setIndoorForCategory(activeTab, true)}
                aria-pressed={categoryIndoor[activeTab] ?? false}
                className={[
                  "rounded-full px-2.5 py-1 text-2xs font-mono transition-all min-h-[28px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember-400 focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--surface-1)]",
                  categoryIndoor[activeTab]
                    ? "bg-ember-500/20 text-ember-300"
                    : "text-ink-500 hover:text-ink-300",
                ].join(" ")}
              >
                Indoor
              </button>
            </div>
          </div>
          <IndoorOutdoorFact />
        </div>

        <SearchBox
          value={search}
          onChange={setSearch}
          placeholder={`Search ${activeCat.label.toLowerCase()} brands...`}
          label={`Search brands in ${activeCat.label}`}
          className="mb-5"
        />

        {/* Companies + brands */}
        <div className="space-y-6 mb-8">
          {visibleCompanies.map(company => (
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
                  aria-hidden
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
                      type="button"
                      onClick={() => toggleBrand(brand, company, activeCat)}
                      aria-pressed={sel}
                      aria-label={`${brand.name}${brand.variant ? `, ${brand.variant}` : ""} — ${brand.pm25}mg PM2.5 per use${sel ? ", selected" : ""}`}
                      className={[
                        "relative text-left p-4 rounded-xl border transition-all duration-200 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-0)]",
                        sel
                          ? "bg-[var(--ember-soft-bg)] border-ember-500/60"
                          : "bg-[var(--surface-1)] border-[var(--border)] hover:border-[var(--border-hover)] hover:bg-[var(--surface-2)]",
                      ].join(" ")}
                    >
                      {/* Selection indicator */}
                      {sel && (
                        <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-ember-500 flex items-center justify-center flex-shrink-0" aria-hidden>
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
                          <div className="flex-1 h-1 rounded-full bg-[var(--surface-3)] overflow-hidden" aria-hidden>
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
                        <div className="flex gap-1.5 mt-2" aria-hidden>
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

                      {/* Note */}
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

        {visibleCompanies.length === 0 && debouncedSearch && (
          <SearchEmptyState query={debouncedSearch} context="brands" />
        )}
      </div>

      <StickyActionBar position="bottom">
        <BrandStepActions {...actionProps} variant="bottom" />
      </StickyActionBar>
    </div>
  );
}

function getPm25Color(pm25: number): string {
  if (pm25 <  20)  return "#22c55e";
  if (pm25 <  50)  return "#eab308";
  if (pm25 < 100)  return "#f97316";
  return "#ef4444";
}
