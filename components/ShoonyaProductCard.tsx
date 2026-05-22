"use client";

import Image from "next/image";
import { ExternalLink } from "lucide-react";

const PRODUCT_URL =
  "https://order.shoonyastore.com/finished-products/893ab858-cc13-43ff-998a-bd1da53f27a0";

export default function ShoonyaProductCard() {
  return (
    <a
      href={PRODUCT_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="View Marlboro 3D Printed Cigarette Box on Shoonya Store — opens in new tab"
      className="group flex rounded-2xl border border-[var(--border)] bg-[var(--surface-1)] overflow-hidden hover:border-ember-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-ember-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-0)]"
    >
      {/* ── 70% — product photo ─────────────────── */}
      <div className="relative w-[70%] bg-[var(--surface-2)] overflow-hidden" style={{ minHeight: "320px" }}>
        <Image
          src="/marlboro-box.jpeg"
          alt="Marlboro 3D Printed Cigarette Box"
          fill
          sizes="(max-width: 768px) 70vw, 560px"
          className="object-cover object-center group-hover:scale-[1.03] transition-transform duration-500"
          priority
        />
        {/* subtle gradient overlay so right edge blends into the card */}
        <div
          aria-hidden
          className="absolute inset-y-0 right-0 w-12 pointer-events-none"
          style={{
            background: "linear-gradient(to right, transparent, var(--surface-1))",
          }}
        />
      </div>

      {/* ── 30% — text + CTA ────────────────────── */}
      <div className="flex flex-col justify-between p-4 sm:p-5 w-[30%]">
        <div>
          <p className="text-2xs font-mono text-ink-600 uppercase tracking-widest mb-2">
            Shoonya Store
          </p>
          <h3 className="text-sm font-display font-semibold text-ink-100 leading-snug mb-2">
            Marlboro 3D Printed Cigarette Box
          </h3>
          <p className="text-xs text-ink-500 leading-relaxed hidden sm:block">
            Luxury 3D printed cigarette box for those who smoke with intent.
          </p>
        </div>

        <div className="mt-4 flex items-center gap-1.5 text-ember-400 group-hover:text-ember-300 transition-colors">
          <span className="text-xs font-semibold">View</span>
          <ExternalLink
            className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden
          />
        </div>
      </div>
    </a>
  );
}
