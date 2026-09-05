"use client";

import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { getAffiliateOffers } from "@/lib/affiliateOffers";

/**
 * Contextual affiliate panel rendered inside ToolWrapper (below RelatedContent,
 * above the FAQ). Self-deriving from the pathname like RelatedContent, so no
 * per-page wiring is needed. Renders nothing when the current tool has no
 * mapped offers. Links are `sponsored nofollow` and the panel carries a
 * visible affiliate disclosure.
 */

const LOCALE_PREFIX = /^\/(pt|es)(?=\/|$)/;

export default function AffiliateOffers() {
  const pathname = usePathname() ?? "";
  const bare = pathname.replace(LOCALE_PREFIX, "");
  const offers = getAffiliateOffers(bare);
  const t = useTranslations("affiliate");

  if (offers.length === 0) return null;

  return (
    <div
      className="mt-12 animate-fade-in-up no-print"
      style={{ color: "var(--text-secondary)", animationDelay: "160ms" }}
    >
      <p
        className="text-xs font-bold mb-3 uppercase tracking-widest"
        style={{ color: "var(--neon)" }}
      >
        {t("label")}
      </p>
      <ul className="space-y-3">
        {offers.map((o) => (
          <li key={o.key} className="leading-relaxed">
            <a
              href={o.href}
              target="_blank"
              rel="sponsored nofollow noopener"
              className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
            >
              {t(`offers.${o.key}.cta`)} &rarr;
            </a>
            <span
              className="block text-xs mt-0.5"
              style={{ color: "var(--text-muted)" }}
            >
              {t(`offers.${o.key}.blurb`)}
            </span>
          </li>
        ))}
      </ul>
      <p className="text-xs mt-3" style={{ color: "var(--text-muted)" }}>
        {t("disclosure")}
      </p>
    </div>
  );
}
