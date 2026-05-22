"use client";

interface Props { current: number; total: number; }

const LABELS = ["Category", "Brand", "Quantity"];

export default function StepBar({ current, total }: Props) {
  return (
    <nav aria-label="Progress" className="mb-10">
      <div
        role="progressbar"
        aria-valuenow={current + 1}
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuetext={`Step ${current + 1} of ${total}: ${LABELS[current]}`}
        className="flex items-center gap-4"
      >
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <div
              className={[
                "h-[3px] rounded-full transition-all duration-500",
                i < current  ? "bg-ember-700 w-8"
                : i === current ? "bg-ember-500 w-12"
                : "bg-[var(--surface-3)] w-8",
              ].join(" ")}
              aria-hidden
            />
            <span
              className={[
                "text-xs font-mono transition-colors duration-300",
                i === current ? "text-ink-200" : "text-ink-600",
              ].join(" ")}
              aria-hidden
            >
              {LABELS[i]}
            </span>
          </div>
        ))}
      </div>
    </nav>
  );
}
