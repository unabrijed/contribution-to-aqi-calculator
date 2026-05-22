"use client";

import { useId } from "react";
import { Search } from "lucide-react";
import { FaInstagram, FaTwitter } from "react-icons/fa";

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  label: string;
  className?: string;
}

export function SearchBox({ value, onChange, placeholder, label, className = "" }: SearchBoxProps) {
  const id = useId();
  return (
    <div className={["relative", className].join(" ")}>
      <label htmlFor={id} className="sr-only">{label}</label>
      <Search
        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-500"
        aria-hidden
      />
      <input
        id={id}
        type="search"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        className="w-full rounded-2xl border-2 border-[var(--border)] bg-[var(--surface-1)] px-4 py-3 pl-10 text-sm text-ink-100 placeholder:text-ink-500 outline-none transition-all focus:border-ember-500 focus:ring-2 focus:ring-ember-500/20 hover:border-[var(--border-hover)]"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute right-3.5 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full flex items-center justify-center text-ink-500 hover:text-ink-300 hover:bg-[var(--surface-3)] transition-all text-xs"
        >
          ✕
        </button>
      )}
    </div>
  );
}

interface SearchEmptyStateProps {
  query: string;
  context?: "categories" | "brands" | "selections";
}

export function SearchEmptyState({ query, context = "brands" }: SearchEmptyStateProps) {
  return (
    <div className="mb-8 rounded-2xl border border-[var(--border)] bg-[var(--surface-1)] p-6 text-center">
      <p className="text-sm font-medium text-ink-300 mb-1">
        No {context} match &ldquo;{query}&rdquo;
      </p>
      <p className="text-xs text-ink-500 mb-4 leading-relaxed">
        Can&apos;t find your brand? Suggest it and we&apos;ll add it →
      </p>
      <div className="flex items-center justify-center gap-3 flex-wrap">
        <a
          href="https://instagram.com/unabrijed"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-[var(--border)] bg-[var(--surface-2)] text-ink-400 hover:text-ember-400 hover:border-ember-500/40 text-xs font-medium transition-all duration-200"
        >
          <FaInstagram className="h-3.5 w-3.5" aria-hidden />
          Instagram
        </a>
        <a
          href="https://twitter.com/unabrijed"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-[var(--border)] bg-[var(--surface-2)] text-ink-400 hover:text-ember-400 hover:border-ember-500/40 text-xs font-medium transition-all duration-200"
        >
          <FaTwitter className="h-3.5 w-3.5" aria-hidden />
          Twitter
        </a>
      </div>
    </div>
  );
}

export function IndoorOutdoorFact() {
  return (
    <p className="mt-2 flex items-start gap-1.5 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] px-3 py-2 text-2xs text-ink-500 leading-relaxed">
      <span aria-hidden className="mt-0.5 shrink-0">☁</span>
      <span>
        Indoor smoking exposes you to{" "}
        <strong className="text-ember-400 font-semibold">3.5×</strong>{" "}
        more PM2.5 than outdoors — it lingers in enclosed air
      </span>
    </p>
  );
}
