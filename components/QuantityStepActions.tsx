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
  totalDailyMg: number;
  variant: "top" | "bottom";
}

function formatDailyMg(mg: number) {
  return mg >= 1000 ? `${(mg / 1000).toFixed(2)}g` : `${Math.round(mg)}mg`;
}

export default function QuantityStepActions({
  onBack,
  onNext,
  totalDailyMg,
  variant,
}: Props) {
  const dailyLabel = formatDailyMg(totalDailyMg);

  const dailyMeta = (
    <span className="shrink-0 font-mono text-2xs sm:text-xs font-medium text-ember-400 tabular-nums" aria-live="polite">
      {dailyLabel}/day
    </span>
  );

  const primaryButton = (
    <button type="button" onClick={onNext} className={stickyPrimaryBtn}>
      <span className="truncate sm:hidden">Calculate →</span>
      <span className="truncate hidden sm:inline">Calculate my impact →</span>
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
    </div>
  );
}
