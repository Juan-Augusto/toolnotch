/**
 * Master registry of affiliate partners.
 *
 * The single source of truth for every partner link on the site — the on-page
 * panels (`lib/affiliateOffers.ts` maps a tool path to a subset of these keys),
 * the navbar "Our Partners" dropdown, and the `/partners` page all read from
 * here. Add a row to grow the programme; add its copy under `affiliate.offers`
 * in `messages/{en,pt,es}.json` (name / blurb / cta), key parity enforced.
 *
 * Pure data — no framework imports.
 */

export type PartnerCategory = "writing" | "study" | "finance" | "productivity";

export interface AffiliatePartner {
  /** i18n key under `affiliate.offers` — shared with the on-page panels. */
  key: string;
  /** Brand name, for grouping / display. */
  brand: string;
  /** Affiliate tracking URL. */
  href: string;
  category: PartnerCategory;
}

export const AFFILIATE_PARTNERS: AffiliatePartner[] = [
  {
    key: "quillbot-paraphraser",
    brand: "QuillBot",
    href: "https://try.quillbot.com/qcgmri4yh6ck",
    category: "writing",
  },
  {
    key: "quillbot-humanizer",
    brand: "QuillBot",
    href: "https://try.quillbot.com/88b200eba182",
    category: "writing",
  },
  {
    key: "quillbot-detector",
    brand: "QuillBot",
    href: "https://try.quillbot.com/Juan-j7hk690xoig5",
    category: "writing",
  },
];

/** Category display order on the /partners page and dropdown. */
export const PARTNER_CATEGORY_ORDER: PartnerCategory[] = [
  "writing",
  "study",
  "finance",
  "productivity",
];

/** Partners grouped by category, preserving `PARTNER_CATEGORY_ORDER`. */
export function partnersByCategory(): [PartnerCategory, AffiliatePartner[]][] {
  return PARTNER_CATEGORY_ORDER.map(
    (cat) =>
      [cat, AFFILIATE_PARTNERS.filter((p) => p.category === cat)] as [
        PartnerCategory,
        AffiliatePartner[],
      ],
  ).filter(([, list]) => list.length > 0);
}

/** Look up a partner by its i18n key. */
export function partnerByKey(key: string): AffiliatePartner | undefined {
  return AFFILIATE_PARTNERS.find((p) => p.key === key);
}
