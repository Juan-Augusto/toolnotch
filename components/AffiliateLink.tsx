"use client";

import { usePathname } from "next/navigation";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export type AffiliatePlacement =
  | "inline-card"
  | "sticky-bar"
  | "nav-dropdown"
  | "partners-page";

interface Props {
  href: string;
  /** i18n key of the partner (from lib/affiliatePartners.ts) — sent to GA4 */
  partnerKey: string;
  placement: AffiliatePlacement;
  className?: string;
  style?: React.CSSProperties;
  /** extra click handler (runs after tracking) — e.g. to close a menu */
  onClick?: () => void;
  children: React.ReactNode;
}

/**
 * Outbound affiliate link. Always `sponsored nofollow noopener`, opens a new
 * tab, and fires a best-effort GA4 `affiliate_click` event (never blocks
 * navigation) so we can see which placement converts. Mirrors the outbound
 * tracking in components/utilities/PollingPlaceOutboundLink.tsx.
 */
export default function AffiliateLink({
  href,
  partnerKey,
  placement,
  className,
  style,
  onClick,
  children,
}: Props) {
  const pathname = usePathname() ?? "";

  const handleClick = () => {
    try {
      window.gtag?.("event", "affiliate_click", {
        partner: partnerKey,
        placement,
        page_path: pathname,
      });
    } catch {
      /* gtag not loaded — never block navigation on analytics */
    }
    onClick?.();
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="sponsored nofollow noopener"
      onClick={handleClick}
      className={className}
      style={style}
    >
      {children}
    </a>
  );
}
