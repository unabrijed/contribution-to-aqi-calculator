"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle({ className }: { className?: string }) {
  const { setTheme, theme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "dark" || theme === "system" ? "light" : "dark")}
      className={`p-2 flex items-center justify-center rounded-full bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors border border-[var(--border)] hover:border-[var(--border-hover)] ${className || ""}`}
      aria-label="Toggle theme"
    >
      <Sun className="h-5 w-5 dark:hidden" />
      <Moon className="h-5 w-5 hidden dark:block" />
    </button>
  );
}
