/** Shared sizing for sticky step action bars — compact, touch-friendly, not full-bleed */

export const stickyPrimaryBtn =
  "inline-flex max-w-[min(100%,13.5rem)] sm:max-w-none items-center justify-center gap-1 rounded-full bg-ember-500 px-3 py-1.5 min-h-9 text-xs font-display font-medium text-white whitespace-nowrap hover:bg-ember-600 active:scale-[0.98] transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-ember-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-0)] sm:min-h-10 sm:px-4 sm:py-2 sm:text-sm";

export const stickySecondaryBtn =
  "inline-flex shrink-0 items-center justify-center min-h-9 px-2 text-xs text-ink-500 hover:text-ink-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember-400 focus-visible:rounded sm:min-h-10 sm:text-sm";

export const stickyOutlineBtn =
  "inline-flex shrink-0 items-center justify-center min-h-9 rounded-full border border-[var(--border)] px-3 text-xs text-ink-400 hover:text-ink-200 hover:border-[var(--border-hover)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember-400 sm:min-h-10 sm:px-3.5 sm:text-sm";

export const stickyMetaText =
  "min-w-0 flex-1 text-2xs sm:text-xs font-mono text-ink-500 leading-snug line-clamp-2 sm:line-clamp-1";

export const stickyToolbarRow =
  "flex items-center gap-2 sm:gap-3";

export const stickyStack =
  "flex flex-col gap-1.5 sm:gap-2";
