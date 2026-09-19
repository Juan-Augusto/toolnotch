"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { ArrowRight, X } from "lucide-react";
import { getAffiliateOffers } from "@/lib/affiliateOffers";
import AppAffiliateLink from "./AppAffiliateLink";

const LOCALE_PREFIX = /^\/(en|pt|es)(?=\/|$)/;

export default function AppAffiliateStickyBar() {
  const pathname = usePathname() ?? "";
  const bare = pathname.replace(LOCALE_PREFIX, "").replace(/\/$/, "") || "/";
  const offers = getAffiliateOffers(bare);
  const t = useTranslations("affiliate");

  const [dismissed, setDismissed] = useState(false);

  // Clear legacy sessionStorage flags from previous tests so the bar is not stuck hidden
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        sessionStorage.removeItem(`aff-bar:${bare}`);
        sessionStorage.removeItem("aff-bar:/tools/text/word-counter");
      }
    } catch {
      // ignore
    }
  }, [bare]);

  // Reset dismissed state on navigation
  useEffect(() => {
    setDismissed(false);
  }, [pathname]);

  if (offers.length === 0 || dismissed) return null;
  const o = offers[0];

  const dismiss = () => {
    setDismissed(true);
  };

  return (
    <>
      <div className="h-14 sm:h-16 no-print" aria-hidden />
      <aside
        role="complementary"
        aria-label={t("label")}
        className="fixed inset-x-0 bottom-0 z-50 no-print border-t border-border bg-background/95 backdrop-blur-md shadow-2xl py-2.5 sm:py-3"
      >
        <div className="container flex items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
            <span className="text-[11px] sm:text-xs font-mono font-medium uppercase tracking-wider text-label shrink-0 hidden xs:inline">
              {t("label")}:
            </span>

            <div className="min-w-0 flex-1 truncate">
              <span className="font-mono font-bold text-xs sm:text-sm text-foreground">
                {t(`offers.${o.key}.name`)}
              </span>
              <span className="hidden md:inline font-mono text-xs text-label ml-2">
                — {t(`offers.${o.key}.blurb`)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <AppAffiliateLink
              href={o.href}
              partnerKey={o.key}
              placement="sticky-bar"
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 bg-primary text-white dark:text-black hover:opacity-90 font-mono font-medium text-xs rounded-[2px] transition-all cursor-pointer shadow-sm active:translate-y-0.5"
            >
              <span>{t(`offers.${o.key}.cta`)}</span>
              <ArrowRight className="w-3.5 h-3.5 shrink-0" />
            </AppAffiliateLink>

            <button
              type="button"
              onClick={dismiss}
              aria-label={t("dismiss")}
              title={t("dismiss")}
              className="p-1 sm:p-1.5 text-label hover:text-foreground hover:bg-tertiary rounded-[2px] transition-colors cursor-pointer flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
