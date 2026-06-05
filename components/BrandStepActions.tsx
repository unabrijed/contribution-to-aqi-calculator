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
  onPrimary: () => void;
  primaryDisabled: boolean;
  primaryLabel: string;
  primaryLabelShort: string;
  footerSummary: string;
  hint?: string;
  variant: "top" | "bottom";
}

export default function BrandStepActions({
  onBack,
  onPrimary,
  primaryDisabled,
  primaryLabel,
  primaryLabelShort,
  footerSummary,
  hint,
  variant,
}: Props) {
  const hintId = variant === "top" ? "brand-next-hint-top" : "brand-next-hint-bottom";

  const primaryButton = (
    <button
      type="button"
      onClick={onPrimary}
      disabled={primaryDisabled}
      aria-disabled={primaryDisabled}
      aria-describedby={primaryDisabled && hint ? hintId : undefined}
      className={stickyPrimaryBtn}
    >
      <span className="truncate sm:hidden">{primaryLabelShort}</span>
      <span className="truncate hidden sm:inline">{primaryLabel}</span>
    </button>
  );

  if (variant === "top") {
    return (
      <div className={stickyStack}>
        <div className={stickyToolbarRow}>
          <p className={stickyMetaText} aria-live="polite">
            {footerSummary}
          </p>
          {primaryButton}
        </div>
        {primaryDisabled && hint && (
          <p id={hintId} className="text-2xs text-ink-600 sm:text-right">
            {hint}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={stickyStack}>
      <p className={`${stickyMetaText} sm:hidden`} aria-live="polite">
        {footerSummary}
      </p>
      <div className={stickyToolbarRow}>
        <button type="button" onClick={onBack} className={stickySecondaryBtn}>
          ← back
        </button>
        <p className={`${stickyMetaText} hidden sm:block`} aria-live="polite">
          {footerSummary}
        </p>
        <div className="ml-auto shrink-0">{primaryButton}</div>
      </div>
      {primaryDisabled && hint && (
        <p id={hintId} className="sr-only">
          {hint}
        </p>
      )}
    </div>
  );
}
