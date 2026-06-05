"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import ShoonyaProductCard from "@/components/ShoonyaProductCard";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function ShoonyaProductPopup({ open, onClose }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Shoonya Store product offer"
    >
      <button
        type="button"
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close product offer"
      />
      <div className="relative z-[1] flex flex-col items-center">
        <button
          type="button"
          onClick={onClose}
          className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 z-10 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-[var(--surface-1)] border border-[var(--border)] text-ink-400 shadow-lg hover:text-ink-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember-400"
          aria-label="Close"
        >
          <X className="h-4 w-4" aria-hidden />
        </button>
        <ShoonyaProductCard variant="popup" />
      </div>
    </div>,
    document.body,
  );
}
