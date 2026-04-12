"use client";

import { useMemo, useRef, useState } from "react";
import { calculate, projections, benchmarkEquiv } from "@/lib/calc";
import { getPPIBand, calcPPI, BENCHMARKS } from "@/data/catalog";
import type { Selection } from "@/lib/calc";
import ShareCard from "@/components/ShareCard";
import SuggestForm from "@/components/SuggestForm";

interface Props {
  selections: Selection[];
  onReset: () => void;
}

export default function ResultsScreen({ selections, onReset }: Props) {
  const result = useMemo(() => calculate(selections), [selections]);
  const band    = getPPIBand(result.ppi_score);
  const projs   = projections(result.annual_pm25_g);

  const annualG  = result.annual_pm25_g;
  const annualGFmt = annualG >= 1 ? `${annualG.toFixed(1)}g` : `${Math.round(annualG * 1000)}mg`;

  return (
    <div className="animate-in">

      {/* Disclaimer */}
      <div className="flex gap-3 p-4 rounded-xl bg-ember-950/40 border border-ember-900/60 mb-8">
        <div className="w-5 h-5 rounded-full bg-ember-600 flex items-center justify-center flex-shrink-0 mt-0.5">
          <span className="text-white text-2xs font-bold">!</span>
        </div>
        <p className="text-xs text-ink-400 leading-relaxed">
          <span className="text-ember-400 font-medium">We do not support or encourage smoking.</span>{" "}
          This data exists to show what your habits cost. Not just your lungs, but the air everyone around you breathes.
          If you want to quit, please speak to a medical professional.
        </p>
      </div>

      {/* ── Share card at top ──────────────────────────── */}
      <div className="mb-8 animate-in">
        <ShareCard
          score={result.ppi_score}
          band={band}
          annualG={annualG}
          selections={selections}
        />
      </div>

      {/* ── PPI Score ───────────────────────────── */}
      <div className="bg-[var(--surface-1)] border border-[var(--border)] rounded-2xl p-6 mb-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">

          {/* Gauge SVG */}
          <div className="flex-shrink-0">
            <GaugeSVG score={result.ppi_score} color={band.color} />
          </div>

          {/* Score details */}
          <div>
            <div className="text-2xs font-mono text-ink-500 uppercase tracking-widest mb-1">
              Personal Pollution Index
            </div>
            <div className="flex items-baseline gap-3 mb-1">
              <span
                className="text-6xl font-display font-bold tabular-nums leading-none"
                style={{ color: band.color }}
              >
                {result.ppi_score}
              </span>
              <span className="text-lg font-display font-medium" style={{ color: band.color }}>
                / 500
              </span>
            </div>
            <div className="text-base font-display font-semibold text-ink-200 mb-2" style={{ color: band.color }}>
              {band.label}
            </div>
            <p className="text-sm text-ink-400 max-w-xs leading-relaxed">{band.desc}</p>
          </div>
        </div>
      </div>

      {/* ── Stats row ───────────────────────────── */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { label: "Daily PM2.5",  val: result.daily_pm25_mg >= 1000 ? `${(result.daily_pm25_mg/1000).toFixed(2)}g` : `${Math.round(result.daily_pm25_mg)}mg` },
          { label: "Annual total", val: annualGFmt },
          { label: "Annual (mg)",  val: `${Math.round(annualG * 1000).toLocaleString()}mg` },
        ].map(({ label, val }) => (
          <div key={label} className="bg-[var(--surface-2)] rounded-xl p-4">
            <div className="text-2xs text-ink-500 font-mono mb-1">{label}</div>
            <div className="text-lg font-mono font-medium text-ink-100 tabular-nums">{val}</div>
          </div>
        ))}
      </div>

      {/* ── Breakdown ────────────────────────────── */}
      {result.breakdown.length > 1 && (
        <div className="bg-[var(--surface-1)] border border-[var(--border)] rounded-2xl p-5 mb-4">
          <div className="text-xs font-mono text-ink-500 mb-3">Breakdown by brand</div>
          <div className="space-y-2">
            {result.breakdown.map(row => (
              <div key={row.brandId}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-ink-300">{row.brandName}</span>
                  <span className="font-mono text-ink-400 tabular-nums">
                    {row.annual_g >= 1 ? `${row.annual_g.toFixed(1)}g` : `${Math.round(row.annual_g * 1000)}mg`}/yr
                    <span className="text-ink-600 ml-1">({Math.round(row.share_pct)}%)</span>
                  </span>
                </div>
                <div className="h-1 rounded-full bg-[var(--surface-3)] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${row.share_pct}%`, background: "#e85d26" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Equivalents ─────────────────────────── */}
      <h3 className="text-xs font-mono text-ink-500 uppercase tracking-widest mb-3 mt-6">
        Your year = …
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
        {BENCHMARKS.map(bm => {
          const equiv = benchmarkEquiv(annualG, bm.rate_mg_per_unit);
          return (
            <div
              key={bm.id}
              className="bg-[var(--surface-1)] border border-[var(--border)] rounded-xl p-4"
            >
              <div className="text-2xl mb-2">{bm.emoji}</div>
              <div className="text-xl font-mono font-semibold text-ink-100 tabular-nums">
                {equiv.toLocaleString()}
              </div>
              <div className="text-xs text-ink-400">{bm.unit}</div>
              <div className="text-xs font-medium text-ink-300 mt-0.5">{bm.label}</div>
              <div className="text-2xs text-ink-600">{bm.sublabel}</div>
            </div>
          );
        })}
      </div>

      {/* ── Projections ──────────────────────────── */}
      <h3 className="text-xs font-mono text-ink-500 uppercase tracking-widest mb-3">
        If you keep this up…
      </h3>
      <div className="grid grid-cols-4 gap-2 mb-8">
        {projs.map(({ years, total_g }) => {
          const sc = calcPPI(total_g);
          const bd = getPPIBand(sc);
          return (
            <div
              key={years}
              className="bg-[var(--surface-1)] border border-[var(--border)] rounded-xl p-3 text-center"
            >
              <div className="text-2xs text-ink-500 font-mono mb-1">{years}yr</div>
              <div className="text-sm font-mono font-semibold tabular-nums text-ink-100">
                {total_g >= 1000 ? `${(total_g / 1000).toFixed(1)}kg` : `${total_g.toFixed(0)}g`}
              </div>
              <div className="text-2xs font-mono mt-1" style={{ color: bd.color }}>{bd.label}</div>
            </div>
          );
        })}
      </div>

      {/* Lung accumulation callout */}
      <div className="p-5 rounded-2xl border mb-8" style={{ borderColor: `${band.color}30`, background: `${band.color}08` }}>
        <div className="text-xs font-mono mb-1" style={{ color: band.color }}>Lung absorption estimate</div>
        <p className="text-sm text-ink-300 leading-relaxed">
          Your airways have absorbed approximately{" "}
          <span className="font-mono font-medium text-ink-100">{annualGFmt}</span> of fine particulate this year.
          Unlike the air outside, your lungs hold it.{" "}
          PM2.5 particles under 2.5 micrometres penetrate deep into alveoli and enter the bloodstream.
        </p>
      </div>

      {/* Sharecard moved to top */}

      {/* ── Suggest a source ────────────────────── */}
      <SuggestForm />

      {/* Start over */}
      <div className="mt-10 pt-8 border-t border-[var(--border)] flex justify-center">
        <button
          onClick={onReset}
          className="text-sm text-ink-500 hover:text-ink-300 transition-colors"
        >
          ← start over
        </button>
      </div>
    </div>
  );
}

// ── Gauge SVG ──────────────────────────────────────────────────────────────
function GaugeSVG({ score, color }: { score: number; color: string }) {
  const R = 52, cx = 64, cy = 60;
  const total  = Math.PI * R;
  const filled = (score / 500) * total;
  const BANDS  = ["#22c55e","#84cc16","#eab308","#f97316","#ef4444","#991b1b"];
  const step   = total / BANDS.length;

  return (
    <svg width="128" height="80" viewBox="0 0 128 80" aria-label={`PPI gauge showing score ${score} out of 500`}>
      {/* track */}
      <path
        d={`M ${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + R} ${cy}`}
        fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8"
      />
      {/* coloured segments */}
      {BANDS.map((c, i) => {
        const start = i * step;
        const end   = start + step;
        const [x1, y1] = polarPt(cx, cy, R, start, total);
        const [x2, y2] = polarPt(cx, cy, R, end, total);
        return (
          <path
            key={i}
            d={`M ${x1} ${y1} A ${R} ${R} 0 0 1 ${x2} ${y2}`}
            fill="none" stroke={c} strokeWidth="8" strokeOpacity="0.25"
          />
        );
      })}
      {/* fill */}
      <path
        d={`M ${cx - R} ${cy} A ${R} ${R} 0 0 1 ${cx + R} ${cy}`}
        fill="none"
        stroke={color}
        strokeWidth="8"
        strokeDasharray={`${filled} ${total}`}
        strokeLinecap="round"
        style={{ transition: "stroke-dasharray 1s cubic-bezier(0.16,1,0.3,1)" }}
      />
      {/* needle */}
      {(() => {
        const [nx, ny] = polarPt(cx, cy, R - 8, (score / 500) * total, total);
        return (
          <>
            <line x1={cx} y1={cy} x2={nx} y2={ny} stroke={color} strokeWidth="2" strokeLinecap="round"/>
            <circle cx={cx} cy={cy} r="4" fill={color}/>
          </>
        );
      })()}
    </svg>
  );
}

function polarPt(cx: number, cy: number, r: number, pos: number, total: number): [number, number] {
  const angle = Math.PI - (pos / total) * Math.PI;
  return [cx + r * Math.cos(angle), cy - r * Math.sin(angle)];
}
