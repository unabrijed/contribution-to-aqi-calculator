"use client";

interface Props { current: number; total: number; }

const LABELS = ["Category", "Brand", "Quantity"];

export default function StepBar({ current, total }: Props) {
  return (
    <div className="flex items-center gap-4 mb-10">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="flex items-center gap-2">
          <div
            className={[
              "h-[3px] rounded-full transition-all duration-500",
              i < current  ? "bg-ember-700 w-8"
              : i === current ? "bg-ember-500 w-12"
              : "bg-[var(--surface-3)] w-8",
            ].join(" ")}
          />
          <span
            className={[
              "text-xs font-mono transition-colors duration-300",
              i === current ? "text-ink-200" : "text-ink-600",
            ].join(" ")}
          >
            {LABELS[i]}
          </span>
        </div>
      ))}
    </div>
  );
}
