"use client";

import { usePathname } from "next/navigation";
import { pickWiseCreative } from "@/lib/wiseCreatives";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

interface Props {
  /** Stable id for this placement, e.g. "currency-converter-inline". Used to
   *  pick a consistent creative and to tag the GA4 click event. */
  placement: string;
  className?: string;
}

/**
 * Standalone Wise affiliate banner (prf.hn, camref:1101l6t7M2).
 *
 * Self-contained: Tailwind only, no imports from ToolWrapper / AdUnit /
 * AffiliateOffers. It only reads `lib/wiseCreatives.ts`. This is so
 * it can be dropped into or pulled out of any page.tsx without touching a
 * file the frontend redesign is also editing.
 *
 * Usage: import directly into a specific tool's page.tsx, e.g.
 *   <WiseBanner placement="currency-converter-inline" />
 * Do NOT wire this into ToolWrapper — keep placement decisions per-page.
 */
export default function WiseBanner({ placement, className = "" }: Props) {
  const pathname = usePathname() ?? "";
  const creative = pickWiseCreative(`${placement}:${pathname}`);

  const handleClick = () => {
    try {
      window.gtag?.("event", "affiliate_click", {
        partner: "wise",
        placement,
        creative: creative.creativeRef,
        page_path: pathname,
      });
    } catch {
      /* gtag not loaded — never block navigation on analytics */
    }
  };

  return (
    <aside
      className={`wise-banner mx-auto w-full max-w-4xl text-center ${className}`}
      aria-label="Sponsored"
    >
      <p className="mb-1.5 text-[10px] font-bold font-mono uppercase tracking-[0.08em] text-label">
        Sponsored
      </p>
      <a
        href={creative.href}
        target="_blank"
        rel="sponsored noopener noreferrer"
        onClick={handleClick}
        className="inline-block max-w-full"
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- remote affiliate creative */}
        <img
          src={creative.img}
          width={creative.width}
          height={creative.height}
          alt="Wise — send and receive money abroad with the real exchange rate"
          loading="lazy"
          className="h-auto max-w-full rounded-[2px]"
        />
      </a>
    </aside>
  );
}
