"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "dark" || theme === "system" ? "light" : "dark")}
      className="p-2 rounded-full bg-surface-2 text-text-muted hover:text-text-main transition-colors border border-border hover:border-border-hover absolute top-4 right-4 z-50"
      aria-label="Toggle theme"
    >
      <Sun className="h-5 w-5 dark:hidden" />
      <Moon className="h-5 w-5 hidden dark:block" />
    </button>
  );
}
