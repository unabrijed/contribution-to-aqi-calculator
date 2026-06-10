"use client";

import Image from "next/image";
import { ExternalLink } from "lucide-react";

const PRODUCT_URL =
  "https://order.shoonyastore.com/finished-products/893ab858-cc13-43ff-998a-bd1da53f27a0";

interface Props {
  /** inline = portrait card (landing shelf); editorial = full-width media card (results) */
  variant?: "inline" | "editorial";
}

const ARIA_LABEL =
  "View the 3D printed Marlboro cigarette box on Shoonya Store — opens in new tab";

const linkBase =
  "group rounded-2xl border border-[var(--border)] bg-[var(--surface-1)] overflow-hidden hover:border-ember-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-ember-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-0)]";

function InlineProductCard() {
  return (
    <a
      href={PRODUCT_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ARIA_LABEL}
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
            A 3D-printed cigarette box, made with unusual care.
          </p>
        </div>

        <div className="mt-4 flex items-center gap-1.5 text-ember-600 dark:text-ember-400 group-hover:text-ember-500 dark:group-hover:text-ember-300 transition-colors">
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

function EditorialProductCard() {
  return (
    <a
      href={PRODUCT_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ARIA_LABEL}
      className={`${linkBase} flex flex-col sm:flex-row w-full`}
    >
      <div className="relative w-full sm:w-44 md:w-52 shrink-0 aspect-[4/3] sm:aspect-auto sm:self-stretch bg-[var(--surface-2)] overflow-hidden">
        <Image
          src="/marlboro-box.jpeg"
          alt=""
          fill
          sizes="(max-width: 640px) 100vw, 13rem"
          className="object-cover object-center group-hover:scale-[1.03] transition-transform duration-500"
        />
      </div>

      <div className="flex flex-1 flex-col justify-center gap-2 p-5 sm:p-6">
        <p className="text-2xs font-mono text-ink-600 uppercase tracking-widest">
          Shoonya Store
        </p>
        <h3
          id="shoonya-product-title"
          className="text-base font-display font-semibold text-ink-100 leading-snug"
        >
          Marlboro 3D Printed Cigarette Box
        </h3>
        <p className="text-sm text-ink-400 leading-relaxed max-w-md">
          A 3D-printed cigarette box, made with unusual care — for those who
          smoke with intent.
        </p>
        <div className="mt-1 inline-flex items-center gap-1.5 text-ember-600 dark:text-ember-400 group-hover:text-ember-500 dark:group-hover:text-ember-300 transition-colors">
          <span className="text-sm font-semibold">View on Shoonya Store</span>
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
  if (variant === "editorial") return <EditorialProductCard />;
  return <InlineProductCard />;
}
