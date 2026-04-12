"use client";

interface Props { onStart: () => void; }

export default function LandingScreen({ onStart }: Props) {
  return (
    <div className="py-8">
      {/* Disclaimer pill */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-ember-800/60 bg-ember-950/40 mb-10">
        <span className="w-1.5 h-1.5 rounded-full bg-ember-500 animate-pulse" />
        <span className="text-xs font-mono text-ember-400 tracking-wide">
          We do not support or encourage smoking
        </span>
      </div>

      {/* Hero */}
      <h1 className="text-5xl sm:text-6xl font-display font-bold leading-[1.05] tracking-tight text-ink-50 mb-6">
        How much air<br />
        <span className="text-ember-500">do you poison?</span>
      </h1>

      <p className="text-lg text-ink-400 max-w-lg leading-relaxed mb-10">
        Select your smoke sources, set your daily intake, and see your real annual PM2.5 contribution —
        then compare it to cars, trucks, and chimneys.
      </p>

      {/* Stat pills */}
      <div className="flex flex-wrap gap-3 mb-12">
        {[
          { val: "70+",  label: "brands tracked" },
          { val: "8",    label: "smoke categories" },
          { val: "PM2.5",label: "based on WHO data" },
        ].map(({ val, label }) => (
          <div
            key={val}
            className="flex items-baseline gap-2 px-4 py-2 rounded-full bg-[var(--surface-2)] border border-[var(--border)]"
          >
            <span className="text-sm font-mono font-medium text-ink-100">{val}</span>
            <span className="text-xs text-ink-500">{label}</span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <button
        onClick={onStart}
        className="group flex items-center gap-3 px-7 py-4 rounded-full bg-ember-500 text-white font-display font-semibold text-base hover:bg-ember-600 active:scale-[0.98] transition-all duration-200"
      >
        Start calculating
        <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
      </button>

      {/* Fine print */}
      <p className="mt-8 text-xs text-ink-600 max-w-md leading-relaxed">
        All PM2.5 figures are estimates based on WHO TobLabNet, ICMR 2019, and peer-reviewed combustion data.
        This tool is for awareness only. If you want to quit, please speak to a medical professional.
      </p>
    </div>
  );
}
