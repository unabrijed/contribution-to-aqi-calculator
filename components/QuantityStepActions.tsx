"use client";

import {
  stickyMetaText,
  stickyPrimaryBtn,
  stickySecondaryBtn,
  stickyStack,
  stickyToolbarRow,
} from "@/components/stickyActionStyles";

interface Props {
  onBack: () => void;
  onNext: () => void;
  allReviewed: boolean;
  remaining: number;
  totalDailyMg: number;
  variant: "top" | "bottom";
}

function formatDailyMg(mg: number) {
  return mg >= 1000 ? `${(mg / 1000).toFixed(2)}g` : `${Math.round(mg)}mg`;
}

function PrimaryLabels({ allReviewed, remaining }: { allReviewed: boolean; remaining: number }) {
  if (allReviewed) {
    return { short: "Calculate →", full: "Calculate my impact →" };
  }
  return {
    short: `Review ${remaining} →`,
    full: `Review ${remaining} more →`,
  };
}

export default function QuantityStepActions({
  onBack,
  onNext,
  allReviewed,
  remaining,
  totalDailyMg,
  variant,
}: Props) {
  const dailyLabel = formatDailyMg(totalDailyMg);
  const hintId = "quantity-next-hint";
  const labels = PrimaryLabels({ allReviewed, remaining });

  const dailyMeta = (
    <span className="shrink-0 font-mono text-2xs sm:text-xs font-medium text-ember-400 tabular-nums" aria-live="polite">
      {dailyLabel}/day
    </span>
  );

  const primaryButton = (
    <button
      type="button"
      onClick={onNext}
      disabled={!allReviewed}
      aria-disabled={!allReviewed}
      aria-describedby={!allReviewed ? hintId : undefined}
      className={stickyPrimaryBtn}
    >
      <span className="truncate sm:hidden">{labels.short}</span>
      <span className="truncate hidden sm:inline">{labels.full}</span>
    </button>
  );

  if (variant === "top") {
    return (
      <div className={stickyStack}>
        <div className={stickyToolbarRow}>
          <span className={`${stickyMetaText} !font-sans text-ink-500`}>Daily PM2.5</span>
          {dailyMeta}
          {primaryButton}
        </div>
        {!allReviewed && (
          <p className="text-2xs text-ink-600 sm:text-right">
            Confirm each item below or tap &ldquo;Looks right&rdquo;
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={stickyStack}>
      <div className={`${stickyToolbarRow} sm:hidden`}>
        <span className="text-2xs text-ink-500">Daily PM2.5</span>
        {dailyMeta}
      </div>
      <div className={stickyToolbarRow}>
        <button type="button" onClick={onBack} className={stickySecondaryBtn}>
          ← back
        </button>
        <span className="hidden sm:inline text-2xs text-ink-500">PM2.5</span>
        <span className="hidden sm:inline shrink-0 font-mono text-xs font-medium text-ember-400 tabular-nums">
          {dailyLabel}
        </span>
        <div className="ml-auto shrink-0">{primaryButton}</div>
      </div>
      {!allReviewed && (
        <p id={hintId} className="sr-only">
          Confirm quantity and regularity for {remaining} more selected{" "}
          {remaining === 1 ? "item" : "items"} to continue.
        </p>
      )}
    </div>
  );
}
