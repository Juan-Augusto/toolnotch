/**
 * Contextual affiliate offers, keyed by bare (locale-stripped) tool path.
 *
 * Rendered by `components/AffiliateOffers.tsx` inside `ToolWrapper`, below the
 * contextual internal links and above the FAQ. Links carry
 * `rel="sponsored nofollow"` and the panel shows a visible disclosure line.
 * All human-readable copy lives in `messages/*.json` under the `affiliate`
 * namespace (`affiliate.offers.<key>`); this file holds only the routing.
 *
 * Pure data + a pure helper — no framework imports.
 */

export interface AffiliateOffer {
  /** i18n key under `affiliate.offers` */
  key: string;
  /** affiliate tracking URL */
  href: string;
}

const OFFERS: Record<string, AffiliateOffer[]> = {
  "/tools/text/paraphraser": [
    { key: "quillbot-paraphraser", href: "https://try.quillbot.com/qcgmri4yh6ck" },
    { key: "quillbot-humanizer", href: "https://try.quillbot.com/88b200eba182" },
  ],
  "/tools/text/summarizer": [
    { key: "quillbot-paraphraser", href: "https://try.quillbot.com/qcgmri4yh6ck" },
  ],
  "/tools/text/plagiarism-checker": [
    { key: "quillbot-detector", href: "https://try.quillbot.com/Juan-j7hk690xoig5" },
  ],
  "/tools/text/readability-checker": [
    { key: "quillbot-humanizer", href: "https://try.quillbot.com/88b200eba182" },
  ],
};

/** Offers to show on a tool page, or `[]` when the path has none. */
export function getAffiliateOffers(barePath: string): AffiliateOffer[] {
  return OFFERS[barePath] ?? [];
}
