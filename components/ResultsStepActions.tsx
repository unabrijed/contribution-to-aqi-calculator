"use client";

import { Share2 } from "lucide-react";
import type { PPIBand } from "@/data/catalog";
import type { ShareCardControls } from "@/components/ShareCard";
import {
  stickyOutlineBtn,
  stickyPrimaryBtn,
  stickyStack,
  stickyToolbarRow,
} from "@/components/stickyActionStyles";

interface Props {
  score: number;
  band: PPIBand;
  shareControls: ShareCardControls | null;
  onReset: () => void;
  variant: "top" | "bottom";
}

function ScoreSummary({ score, band, compact }: { score: number; band: PPIBand; compact?: boolean }) {
  return (
    <div className="flex min-w-0 flex-1 items-baseline justify-between gap-2">
      <div className="flex items-baseline gap-1.5 min-w-0">
        <span
          className={`font-display font-bold tabular-nums ${compact ? "text-lg sm:text-xl" : "text-xl sm:text-2xl"}`}
          style={{ color: band.color }}
        >
          {score}
        </span>
        <span className="text-2xs sm:text-xs text-ink-500">/ 500</span>
      </div>
      <span
        className="shrink-0 text-2xs sm:text-xs font-display font-semibold truncate max-w-[48%]"
        style={{ color: band.color }}
      >
        {band.label}
      </span>
    </div>
  );
}

export default function ResultsStepActions({
  score,
  band,
  shareControls,
  onReset,
  variant,
}: Props) {
  const exporting = shareControls?.exporting ?? false;
  const shareLabel = shareControls?.shareLabel ?? "Share";
  const onShare = () => shareControls?.share();

  const shareButton = (
    <button
      type="button"
      onClick={onShare}
      disabled={!shareControls || exporting}
      aria-busy={exporting}
      className={stickyPrimaryBtn}
    >
      {exporting ? (
        <span className="truncate">{shareLabel.startsWith("Share") ? "Sharing…" : "Saving…"}</span>
      ) : (
        <>
          <Share2 className="w-3.5 h-3.5 shrink-0 sm:w-4 sm:h-4" aria-hidden />
          <span className="truncate">{shareLabel}</span>
        </>
      )}
    </button>
  );

  if (variant === "top") {
    return (
      <div className={stickyStack}>
        <div className={stickyToolbarRow}>
          <ScoreSummary score={score} band={band} compact />
          {shareButton}
        </div>
      </div>
    );
  }

  return (
    <div className={stickyStack}>
      <ScoreSummary score={score} band={band} compact />
      <div className={stickyToolbarRow}>
        <div className="ml-auto flex shrink-0 items-center gap-2">
          {shareButton}
          <button type="button" onClick={onReset} className={stickyOutlineBtn}>
            Start over
          </button>
        </div>
      </div>
    </div>
  );
}
