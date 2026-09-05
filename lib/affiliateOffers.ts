/**
 * Contextual affiliate offers, keyed by bare (locale-stripped) tool path.
 *
 * Rendered by `components/AffiliateOffers.tsx` (inline card under the tool) and
 * `components/AffiliateStickyBar.tsx` (dismissible sticky bar). Each value is a
 * list of partner keys from `lib/affiliatePartners.ts`, which owns the URL and
 * category; copy lives in `messages/*.json` under `affiliate.offers.<key>`.
 *
 * Pure data + a pure helper.
 */

import { AFFILIATE_PARTNERS, type AffiliatePartner } from "./affiliatePartners";

/** Bare tool path -> ordered partner keys to show on that page. */
const OFFERS_BY_PATH: Record<string, string[]> = {
  "/tools/text/paraphraser": ["quillbot-paraphraser", "quillbot-humanizer"],
  "/tools/text/summarizer": ["quillbot-paraphraser"],
  "/tools/text/plagiarism-checker": ["quillbot-detector"],
  "/tools/text/readability-checker": ["quillbot-humanizer"],
};

/** Partners to show on a tool page, in order, or `[]` when the path has none. */
export function getAffiliateOffers(barePath: string): AffiliatePartner[] {
  const keys = OFFERS_BY_PATH[barePath] ?? [];
  return keys
    .map((k) => AFFILIATE_PARTNERS.find((p) => p.key === k))
    .filter((p): p is AffiliatePartner => Boolean(p));
}
