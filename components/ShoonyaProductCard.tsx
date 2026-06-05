"use client";

import Image from "next/image";
import { ExternalLink } from "lucide-react";

const PRODUCT_URL =
  "https://order.shoonyastore.com/finished-products/893ab858-cc13-43ff-998a-bd1da53f27a0";

interface Props {
  /** popup = compact row in modal; inline = portrait card on results after dismiss */
  variant?: "popup" | "inline";
}

const linkBase =
  "group rounded-2xl border border-[var(--border)] bg-[var(--surface-1)] overflow-hidden hover:border-ember-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-ember-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-0)]";

function PopupProductCard() {
  return (
    <a
      href={PRODUCT_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="View Marlboro 3D Printed Cigarette Box on Shoonya Store — opens in new tab"
      className={`${linkBase} flex w-full max-w-[min(100%,20rem)] sm:max-w-sm items-center gap-3 p-3 sm:gap-4 sm:p-3.5`}
    >
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-[var(--surface-2)] sm:h-[4.5rem] sm:w-[4.5rem]">
        <Image
          src="/marlboro-box.jpeg"
          alt=""
          fill
          sizes="72px"
          className="object-cover object-center"
          priority
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-mono uppercase tracking-widest text-ink-600">Shoonya Store</p>
        <p id="shoonya-product-title" className="truncate text-sm font-display font-semibold text-ink-100">
          Marlboro 3D Printed Cigarette Box
        </p>
      </div>

      <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-ember-500 px-3 py-2 text-xs font-semibold text-white group-hover:bg-ember-600 transition-colors sm:px-4">
        View
        <ExternalLink className="h-3.5 w-3.5" aria-hidden />
      </span>
    </a>
  );
}

function InlineProductCard() {
  return (
    <a
      href={PRODUCT_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="View Marlboro 3D Printed Cigarette Box on Shoonya Store — opens in new tab"
      className={`${linkBase} flex flex-col w-full max-w-[280px] aspect-[3/4]`}
    >
      <div className="relative flex-[1.15] min-h-0 w-full bg-[var(--surface-2)] overflow-hidden">
        <Image
          src="/marlboro-box.jpeg"
          alt=""
          fill
          sizes="280px"
          className="object-cover object-center group-hover:scale-[1.03] transition-transform duration-500"
        />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-16 pointer-events-none"
          style={{
            background: "linear-gradient(to top, var(--surface-1), transparent)",
          }}
        />
      </div>

      <div className="flex flex-col justify-between flex-1 p-4 sm:p-5">
        <div>
          <p className="text-2xs font-mono text-ink-600 uppercase tracking-widest mb-2">
            Shoonya Store
          </p>
          <h3
            id="shoonya-product-title"
            className="text-sm font-display font-semibold text-ink-100 leading-snug mb-2"
          >
            Marlboro 3D Printed Cigarette Box
          </h3>
          <p className="text-xs text-ink-500 leading-relaxed">
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

export default function ShoonyaProductCard({ variant = "inline" }: Props) {
  if (variant === "popup") return <PopupProductCard />;
  return <InlineProductCard />;
}
