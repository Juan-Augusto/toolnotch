"use client";

import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { getAffiliateOffers } from "@/lib/affiliateOffers";
import AffiliateLink from "./AffiliateLink";

/**
 * Prominent contextual affiliate card, rendered inside ToolWrapper directly
 * below the tool itself (before the long-form rich content) so it sits near
 * the page focus. Self-derives the current tool from the pathname; renders
 * nothing when the tool has no mapped offer. Links are `sponsored nofollow`
 * and the card carries a visible affiliate disclosure.
 */

const LOCALE_PREFIX = /^\/(pt|es)(?=\/|$)/;

export default function AffiliateOffers() {
  const pathname = usePathname() ?? "";
  const bare = pathname.replace(LOCALE_PREFIX, "");
  const offers = getAffiliateOffers(bare);
  const t = useTranslations("affiliate");

  if (offers.length === 0) return null;
  const primary = offers[0];
  const rest = offers.slice(1);

  return (
    <div className="mt-6 card-neon p-5 no-print">
      <p
        className="text-[10px] font-bold mb-2 uppercase tracking-widest"
        style={{ color: "var(--neon)" }}
      >
        {t("label")}
      </p>
      <p
        className="text-base font-semibold"
        style={{ color: "var(--text-primary)" }}
      >
        {t(`offers.${primary.key}.name`)}
      </p>
      <p
        className="text-sm mt-1 mb-4 leading-relaxed"
        style={{ color: "var(--text-secondary)" }}
      >
        {t(`offers.${primary.key}.blurb`)}
      </p>
      <AffiliateLink
        href={primary.href}
        partnerKey={primary.key}
        placement="inline-card"
        className="btn-neon"
      >
        {t(`offers.${primary.key}.cta`)} &rarr;
      </AffiliateLink>
      {rest.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1">
          {rest.map((o) => (
            <AffiliateLink
              key={o.key}
              href={o.href}
              partnerKey={o.key}
              placement="inline-card"
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
            >
              {t(`offers.${o.key}.cta`)} &rarr;
            </AffiliateLink>
          ))}
        </div>
      )}
      <p className="text-[11px] mt-3" style={{ color: "var(--text-muted)" }}>
        {t("disclosure")}
      </p>
    </div>
  );
}
