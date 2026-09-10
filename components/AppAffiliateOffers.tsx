"use client";

import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { getAffiliateOffers } from "@/lib/affiliateOffers";
import AppAffiliateLink from "./AppAffiliateLink";

const LOCALE_PREFIX = /^\/(pt|es)(?=\/|$)/;

export default function AppAffiliateOffers() {
  const pathname = usePathname() ?? "";
  const bare = pathname.replace(LOCALE_PREFIX, "");
  const offers = getAffiliateOffers(bare);
  const t = useTranslations("affiliate");

  if (offers.length === 0) return null;
  const primary = offers[0];
  const rest = offers.slice(1);

  return (
    <div className="mt-6  p-5 no-print">
      <p
        className="text-[10px] font-bold mb-2 uppercase st"
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
      <AppAffiliateLink
        href={primary.href}
        partnerKey={primary.key}
        placement="inline-card"
        className="btn-neon"
      >
        {t(`offers.${primary.key}.cta`)} &rarr;
      </AppAffiliateLink>
      {rest.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1">
          {rest.map((o) => (
            <AppAffiliateLink
              key={o.key}
              href={o.href}
              partnerKey={o.key}
              placement="inline-card"
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
            >
              {t(`offers.${o.key}.cta`)} &rarr;
            </AppAffiliateLink>
          ))}
        </div>
      )}
      <p className="text-[11px] mt-3" style={{ color: "var(--text-muted)" }}>
        {t("disclosure")}
      </p>
    </div>
  );
}
