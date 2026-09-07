"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { getAffiliateOffers } from "@/lib/affiliateOffers";
import AppAffiliateLink from "./AppAffiliateLink";

const LOCALE_PREFIX = /^\/(pt|es)(?=\/|$)/;

function wasDismissed(key: string): boolean {
  try {
    return sessionStorage.getItem(key) === "0";
  } catch {
    return false;
  }
}

export default function AppAffiliateStickyBar() {
  const pathname = usePathname() ?? "";
  const bare = pathname.replace(LOCALE_PREFIX, "");
  const offers = getAffiliateOffers(bare);
  const t = useTranslations("affiliate");
  const storageKey = `aff-bar:${bare}`;
  const [dismissed, setDismissed] = useState(() => wasDismissed(storageKey));

  if (offers.length === 0 || dismissed) return null;
  const o = offers[0];

  const dismiss = () => {
    try {
      sessionStorage.setItem(storageKey, "0");
    } catch {
      /* sessionStorage unavailable — dismiss for this render only */
    }
    setDismissed(true);
  };

  return (
    <>
      <div className="h-16 no-print" aria-hidden />
      <div
        className="fixed inset-x-0 bottom-0 z-40 no-print border-t backdrop-blur-sm"
        style={{
          borderColor: "var(--base-border)",
          background: "var(--base-card)",
        }}
      >
        <div className="max-w-4xl mx-auto px-4 py-2.5 flex items-center gap-3">
          <p
            className="flex-1 min-w-0 text-xs sm:text-sm truncate"
            style={{ color: "var(--text-secondary)" }}
          >
            <span
              className="font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              {t(`offers.${o.key}.name`)}
            </span>
            <span className="hidden sm:inline">
              {" — "}
              {t(`offers.${o.key}.blurb`)}
            </span>
          </p>
          <AppAffiliateLink
            href={o.href}
            partnerKey={o.key}
            placement="sticky-bar"
            className="shrink-0 inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs sm:text-sm font-semibold"
            style={{
              background: "var(--neon-dim)",
              color: "var(--neon)",
              border: "1px solid var(--neon-border)",
            }}
          >
            {t(`offers.${o.key}.cta`)} &rarr;
          </AppAffiliateLink>
          <button
            type="button"
            onClick={dismiss}
            aria-label={t("dismiss")}
            className="shrink-0 p-1 text-xl leading-none"
            style={{ color: "var(--text-muted)" }}
          >
            &times;
          </button>
        </div>
      </div>
    </>
  );
}
