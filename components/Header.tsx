"use client";

import { ShieldCheck, Wind } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-surface-0/80 backdrop-blur-md">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Left: Brand Identity */}
        <a href="/" className="flex items-center gap-3 cursor-pointer group">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-ember-600 to-ember-400 shadow-sm transition-transform group-hover:scale-105 group-active:scale-95">
            <Wind className="h-4.5 w-4.5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold leading-tight text-ink-100 tracking-tight transition-colors group-hover:text-ember-500">
              AQI Calc
            </span>
            <span className="text-[0.65rem] font-mono uppercase tracking-widest text-ink-400 leading-none mt-0.5">
              Impact Tracker
            </span>
          </div>
        </a>

        {/* Right: Security Badge & Theme */}
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span className="text-xs font-mono font-medium tracking-wide">
              100% Private
            </span>
          </div>
          <ThemeToggle className="ml-2" />
        </div>
      </div>
    </header>
  );
}
