"use client";

import type { ReactNode } from "react";

const BAR_INNER = "max-w-3xl mx-auto px-4 sm:px-6";
const BAR_SURFACE =
  "border-[var(--border)] bg-[var(--surface-0)]/95 backdrop-blur-md supports-[backdrop-filter]:bg-[var(--surface-0)]/85";

interface Props {
  position: "top" | "bottom";
  children: ReactNode;
  /** Extra classes on the inner content row */
  className?: string;
}

/**
 * Viewport-aware action chrome. Bottom bars are fixed to the screen;
 * top bars stick under the site header while scrolling.
 */
export default function StickyActionBar({ position, children, className = "" }: Props) {
  if (position === "bottom") {
    return (
      <div
        className={`fixed bottom-0 inset-x-0 z-40 border-t ${BAR_SURFACE}`}
        style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
      >
        <div className={`${BAR_INNER} py-2 sm:py-2.5 ${className}`}>{children}</div>
      </div>
    );
  }

  return (
    <div
      className={`sticky top-16 z-30 -mx-4 sm:-mx-6 mb-4 border-b ${BAR_SURFACE} shadow-sm`}
    >
      <div className={`${BAR_INNER} py-2 sm:py-2.5 ${className}`}>{children}</div>
    </div>
  );
}

/** Bottom padding so fixed bars do not cover content */
export const STICKY_BAR_SCROLL_PADDING = "pb-24 sm:pb-28";
