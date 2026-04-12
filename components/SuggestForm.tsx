"use client";

import { useState } from "react";
import { CATEGORIES } from "@/data/catalog";

type FormState = "idle" | "open" | "sending" | "done" | "error";

export default function SuggestForm() {
  const [state, setState] = useState<FormState>("idle");
  const [form, setForm] = useState({ name: "", category: "", description: "", tar: "", nicotine: "" });

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("sending");
    try {
      const res = await fetch("/api/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setState(res.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  };

  if (state === "idle") return (
    <div className="bg-[var(--surface-1)] border border-[var(--border)] rounded-2xl p-5">
      <div className="text-sm font-display font-medium text-ink-200 mb-1">Missing a source?</div>
      <p className="text-xs text-ink-500 mb-4">Know a smoke source we haven't covered? Submit it and we'll research and add it.</p>
      <button onClick={() => setState("open")} className="text-xs font-mono text-ember-400 hover:text-ember-300 transition-colors">
        + suggest a brand or product →
      </button>
    </div>
  );

  if (state === "done") return (
    <div className="bg-[var(--surface-1)] border border-[var(--border)] rounded-2xl p-5 flex items-center gap-3">
      <div className="w-5 h-5 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center flex-shrink-0">
        <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
          <path d="M1 3.5l2.5 2.5L8 1" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <span className="text-sm text-ink-300">Suggestion received — we'll review and add it. Thank you.</span>
    </div>
  );

  const ic = "w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-xl px-3.5 py-2.5 text-sm text-ink-100 placeholder:text-ink-600 focus:outline-none focus:border-ember-700/60 transition-colors";

  return (
    <div className="bg-[var(--surface-1)] border border-[var(--border)] rounded-2xl p-5">
      <div className="text-sm font-display font-medium text-ink-200 mb-1">Suggest a brand or product</div>
      <p className="text-xs text-ink-500 mb-5 leading-relaxed">Even a rough description helps. Know the tar/nicotine numbers? Even better.</p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input className={ic} placeholder="Product or brand name *" value={form.name} onChange={set("name")} required />
          <select className={ic} value={form.category} onChange={set("category")} required>
            <option value="">Category *</option>
            {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
            <option value="other">Other / unsure</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <input className={ic} placeholder="Tar (mg)" type="number" min="0" step="0.1" value={form.tar} onChange={set("tar")} />
          <input className={ic} placeholder="Nicotine (mg)" type="number" min="0" step="0.01" value={form.nicotine} onChange={set("nicotine")} />
        </div>
        <textarea className={ic + " resize-none"} rows={3} placeholder="Describe it: what it is, how it's used, where it's common…" value={form.description} onChange={set("description")} />
        {state === "error" && <p className="text-xs text-red-400 font-mono">Something went wrong — please try again.</p>}
        <div className="flex items-center gap-4 pt-1">
          <button type="button" onClick={() => setState("idle")} className="text-xs text-ink-600 hover:text-ink-400 transition-colors">cancel</button>
          <button type="submit" disabled={!form.name || !form.category || state === "sending"}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--surface-3)] border border-[var(--border-hover)] text-sm text-ink-200 hover:text-ink-100 hover:border-ink-400 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] transition-all">
            {state === "sending" ? "Sending…" : "Submit suggestion"}
          </button>
        </div>
      </form>
    </div>
  );
}
