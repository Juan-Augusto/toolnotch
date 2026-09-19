"use client";

import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { getAffiliateOffers } from "@/lib/affiliateOffers";
import AppAffiliateLink from "./AppAffiliateLink";

const LOCALE_PREFIX = /^\/(en|pt|es)(?=\/|$)/;

export default function AppAffiliateOffers() {
  const pathname = usePathname() ?? "";
  const bare = pathname.replace(LOCALE_PREFIX, "").replace(/\/$/, "") || "/";
  const offers = getAffiliateOffers(bare);
  const t = useTranslations("affiliate");

  if (offers.length === 0) return null;
  const primary = offers[0];
  const rest = offers.slice(1);

  return (
    <section aria-label={t("label")} className="no-print my-6 sm:my-8 w-full">
      <div className="p-4 sm:p-6 bg-primary text-white dark:text-black rounded-[2px] relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
          <div className="space-y-1.5 max-w-2xl">
            <span className="text-[11px] sm:text-xs font-mono font-medium uppercase tracking-wider text-white/80 dark:text-black/75">
              {t("label")}
            </span>

            <h3 className="text-base sm:text-lg md:text-xl font-bold font-mono text-white dark:text-black">
              {t(`offers.${primary.key}.name`)}
            </h3>

            <p className="text-xs sm:text-sm font-mono text-white/90 dark:text-black/85 leading-relaxed">
              {t(`offers.${primary.key}.blurb`)}
            </p>
          </div>

          <div className="shrink-0 w-full md:w-auto">
            <AppAffiliateLink
              href={primary.href}
              partnerKey={primary.key}
              placement="inline-card"
              className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:py-3 bg-white text-black hover:bg-white/90 dark:bg-black dark:text-white dark:hover:bg-black/90 font-mono font-medium text-xs sm:text-sm uppercase tracking-wide rounded-[2px] transition-all cursor-pointer shadow-sm active:translate-y-0.5"
            >
              <span>{t(`offers.${primary.key}.cta`)}</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </AppAffiliateLink>
          </div>
        </div>

        {rest.length > 0 && (
          <div className="mt-4 pt-3.5 border-t border-white/20 dark:border-black/20 flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="text-xs font-mono font-medium text-white/80 dark:text-black/75">
              {t("alsoRecommended")}:
            </span>
            {rest.map((o) => (
              <AppAffiliateLink
                key={o.key}
                href={o.href}
                partnerKey={o.key}
                placement="inline-card"
                className="text-xs font-mono font-semibold text-white dark:text-black hover:underline flex items-center gap-1 transition-colors"
              >
                <span>{t(`offers.${o.key}.name`)}</span>
                <ArrowRight className="w-3 h-3" />
              </AppAffiliateLink>
            ))}
          </div>
        )}

        <p className="text-[11px] font-mono text-white/70 dark:text-black/60 mt-4 pt-3 border-t border-white/20 dark:border-black/20 leading-relaxed">
          {t("disclosure")}
        </p>
      </div>
    </section>
  );
}
