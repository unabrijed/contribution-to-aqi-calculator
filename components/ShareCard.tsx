"use client";

import { useRef, useState } from "react";
import { BENCHMARKS, type PPIBand } from "@/data/catalog";
import { benchmarkEquiv, type Selection } from "@/lib/calc";
import { useTheme } from "next-themes";

interface Props {
  score: number;
  band: PPIBand;
  annualG: number;
  selections: Selection[];
}

export default function ShareCard({ score, band, annualG, selections }: Props) {
  const cardRef  = useRef<HTMLDivElement>(null);
  const [saving, setSaving] = useState(false);
  const { theme, systemTheme } = useTheme();

  // "Pick a value from lower suggestions" - default to something impressive like petrol car
  const defaultBmId = BENCHMARKS.find(b => b.id === "petrol_car")?.id || BENCHMARKS[0].id;
  const [selectedBmId, setSelectedBmId] = useState<string>(defaultBmId);

  const topBrands = [...selections]
    .sort((a, b) => b.pm25_per_unit * b.qty - a.pm25_per_unit * a.qty)
    .slice(0, 3);

  const annualFmt = annualG >= 1 ? `${annualG.toFixed(1)}g` : `${Math.round(annualG * 1000)}mg`;

  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";
  const cardGradient = isDark
    ? "linear-gradient(135deg, #0c0a09 0%, #1c1917 100%)"
    : "linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)";
  const cardBgColor = isDark ? "#0c0a09" : "#ffffff";

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setSaving(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: cardBgColor,
        useCORS: true,
      });
      const url = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = `my-aqi-score-${score}.png`;
      a.click();
    } finally {
      setSaving(false);
    }
  };

  const selectedBm = BENCHMARKS.find(b => b.id === selectedBmId) || BENCHMARKS[0];
  const equivVal = benchmarkEquiv(annualG, selectedBm.rate_mg_per_unit);

  return (
    <div>
      {/* Selector for equivalent */}
      <div className="mb-4">
        <label className="text-xs text-[var(--text-muted)] font-mono uppercase tracking-widest mb-2 block">
          Card highlight metric
        </label>
        <div className="flex flex-wrap gap-2">
          {BENCHMARKS.map(bm => (
            <button
              key={bm.id}
              onClick={() => setSelectedBmId(bm.id)}
              className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                bm.id === selectedBmId 
                  ? "border-[var(--ember)] bg-[var(--ember)]/10 text-ember-600 dark:text-ember-400" 
                  : "border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-[var(--border-hover)]"
              }`}
            >
              {bm.emoji} {bm.label}
            </button>
          ))}
        </div>
      </div>

      {/* The card to be exported */}
      <div
        ref={cardRef}
        id="share-card"
        className="w-full rounded-2xl overflow-hidden relative"
        style={{
          background: cardGradient,
          border: `1px solid ${band.color}30`,
          padding: "2rem",
          color: "inherit",
          fontFamily: "var(--font-display)",
        }}
      >
        {/* Top disclaimer */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: band.color }} />
          <span className="text-2xs font-mono tracking-widest uppercase" style={{ color: band.color }}>
            AQI Contribution · Awareness only
          </span>
        </div>

        {/* Score */}
        <div className="mb-6">
          <div
            className="text-8xl font-display font-bold tabular-nums leading-none mb-1"
            style={{ color: band.color }}
          >
            {score}
          </div>
          <div className="text-sm font-mono text-ink-400">Personal Pollution Index / 500</div>
          <div className="text-2xs font-mono text-ink-500 mt-2 max-w-[18rem] leading-relaxed">
            Yearly totals from your daily habits—PPI, PM2.5, and comparisons below are all on a 12‑month basis.
          </div>
        </div>

        {/* Band label */}
        <div
          className="inline-block px-3 py-1 rounded-full text-xs font-mono mb-6"
          style={{ background: `${band.color}18`, border: `1px solid ${band.color}40`, color: band.color }}
        >
          {band.label}
        </div>

        {/* Custom Headline */}
        <div className="mb-6">
          <div className="text-sm font-mono text-[var(--text-muted)] mb-1">
            Over one year, my habit is equivalent to…
          </div>
          <div className="text-2xl sm:text-3xl font-display font-semibold text-[var(--text-main)] leading-tight">
            {equivVal.toLocaleString()} {selectedBm.unit} of a {selectedBm.label.toLowerCase()} {selectedBm.emoji}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6 items-start">
          <div className="rounded-xl p-3 bg-[var(--surface-3)] min-w-0">
            <div className="text-2xs text-[var(--text-muted)] font-mono mb-0.5">Annual PM2.5 (from daily)</div>
            <div className="text-xl font-mono font-semibold text-[var(--text-main)]">{annualFmt}</div>
          </div>
          <div className="rounded-xl p-3 bg-[var(--surface-3)] min-w-0">
            <div className="text-2xs text-[var(--text-muted)] font-mono mb-0.5">Top habit</div>
            <div className="text-sm font-medium text-[var(--text-main)] break-words leading-snug">
              {topBrands[0]?.brandName ?? "-"}
            </div>
          </div>
        </div>

        {/* Brand list */}
        {topBrands.length > 0 && (
          <div className="space-y-1.5 mb-6">
            {topBrands.map(s => (
              <div key={s.brandId} className="flex justify-between gap-3 text-xs items-start">
                <span className="text-[var(--text-muted)] min-w-0 flex-1 break-words leading-snug">
                  {s.brandName} × {s.qty}/day
                </span>
                <span className="font-mono text-[var(--text-main)] shrink-0 text-right tabular-nums">
                  {Math.round(s.pm25_per_unit * s.qty * (s.daysPerWeek / 7))}mg/day
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-[var(--border)] pt-4">
          <p className="text-2xs text-[var(--text-muted)] leading-relaxed">
            This is not a badge of honour, it&apos;s a mirror.
            Based on WHO TobLabNet & ICMR data. We do not support smoking.
          </p>
        </div>
      </div>

      {/* Download button */}
      <button
        onClick={handleDownload}
        disabled={saving}
        className="mt-4 flex items-center gap-2 px-5 py-2.5 rounded-full bg-ember-500 text-white text-sm font-medium hover:bg-ember-600 disabled:opacity-50 transition-all active:scale-[0.98]"
      >
        {saving ? "Saving…" : "↓ Download card"}
      </button>
    </div>
  );
}
