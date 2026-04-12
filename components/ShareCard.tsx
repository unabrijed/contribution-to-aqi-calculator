"use client";

import { useRef, useState } from "react";
import type { PPIBand } from "@/data/catalog";
import type { Selection } from "@/lib/calc";

interface Props {
  score: number;
  band: PPIBand;
  annualG: number;
  selections: Selection[];
}

export default function ShareCard({ score, band, annualG, selections }: Props) {
  const cardRef  = useRef<HTMLDivElement>(null);
  const [saving, setSaving] = useState(false);

  const topBrands = [...selections]
    .sort((a, b) => b.pm25_per_unit * b.qty - a.pm25_per_unit * a.qty)
    .slice(0, 3);

  const annualFmt = annualG >= 1 ? `${annualG.toFixed(1)}g` : `${Math.round(annualG * 1000)}mg`;

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setSaving(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: "#0c0a09",
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

  return (
    <div>
      {/* The card to be exported */}
      <div
        ref={cardRef}
        id="share-card"
        className="w-full rounded-2xl overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #0c0a09 0%, #1c1917 100%)",
          border: `1px solid ${band.color}30`,
          padding: "2rem",
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
        </div>

        {/* Band label */}
        <div
          className="inline-block px-3 py-1 rounded-full text-xs font-mono mb-6"
          style={{ background: `${band.color}18`, border: `1px solid ${band.color}40`, color: band.color }}
        >
          {band.label}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.04)" }}>
            <div className="text-2xs text-ink-500 font-mono mb-0.5">Annual PM2.5</div>
            <div className="text-xl font-mono font-semibold text-ink-100">{annualFmt}</div>
          </div>
          <div className="rounded-xl p-3" style={{ background: "rgba(255,255,255,0.04)" }}>
            <div className="text-2xs text-ink-500 font-mono mb-0.5">Top habit</div>
            <div className="text-sm font-medium text-ink-100 truncate">
              {topBrands[0]?.brandName ?? "—"}
            </div>
          </div>
        </div>

        {/* Brand list */}
        {topBrands.length > 0 && (
          <div className="space-y-1.5 mb-6">
            {topBrands.map(s => (
              <div key={s.brandId} className="flex justify-between text-xs">
                <span className="text-ink-400">{s.brandName} × {s.qty}/day</span>
                <span className="font-mono text-ink-500">
                  {Math.round(s.pm25_per_unit * s.qty * (s.daysPerWeek / 7))}mg/day
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="border-t pt-4" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
          <p className="text-2xs text-ink-600 leading-relaxed">
            This is not a badge of honour — it's a mirror.
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
