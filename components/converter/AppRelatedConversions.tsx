import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AppCard } from "@/components/ui";
import { COMMON_PAIRS } from "@/data/conversionPairs";
import { getPairContent } from "@/data/conversionPairContent";
import { getLocalizedPairTitle } from "@/lib/conversionPairHelper";
import { UnitCategory } from "@/lib/unitTypes";

interface RelatedConversionsProps {
  /** Slug of the page currently being rendered — excluded from the list. */
  currentSlug: string;
  category: UnitCategory;
  locale: string;
  /** Localised <h2> for the section. */
  heading: string;
  /** Maximum number of links to render. */
  limit?: number;
}

/**
 * Picks up to `limit` sibling conversions in the same category.
 *
 * The reverse pair (e.g. centimeters-to-inches from inches-to-centimeters) is
 * always surfaced first because it is what most visitors actually want next;
 * the remaining slots are filled with other pairs from the same category, and
 * pairs that have localised content are preferred so the anchor text is in
 * the reader's language.
 */
export function selectRelatedPairs(
  currentSlug: string,
  category: UnitCategory,
  locale: string,
  limit = 6,
) {
  const siblings = COMMON_PAIRS.filter(
    (p) => p.category === category && p.slug !== currentSlug,
  );

  const current = COMMON_PAIRS.find((p) => p.slug === currentSlug);
  const reverse = current
    ? siblings.find((p) => p.from === current.to && p.to === current.from)
    : undefined;

  const rest = siblings
    .filter((p) => p.slug !== reverse?.slug)
    .sort((a, b) => {
      const aLocalised = getPairContent(a.slug, locale) ? 0 : 1;
      const bLocalised = getPairContent(b.slug, locale) ? 0 : 1;
      return aLocalised - bLocalised;
    });

  return [...(reverse ? [reverse] : []), ...rest].slice(0, limit);
}

export default function AppRelatedConversions({
  currentSlug,
  category,
  locale,
  heading,
  limit = 6,
}: RelatedConversionsProps) {
  const related = selectRelatedPairs(currentSlug, category, locale, limit);
  if (related.length === 0) return null;

  const prefix = locale === "en" ? "" : `/${locale}`;

  return (
    <section aria-labelledby="related-conversions-heading" className="mt-8 sm:mt-12 font-mono">
      <h2
        id="related-conversions-heading"
        className="text-base sm:text-lg md:text-xl font-bold uppercase text-foreground mb-3 sm:mb-4 md:mb-6"
      >
        {heading}
      </h2>
      <ul className="grid gap-3 sm:grid-cols-2">
        {related.map((pair) => {
          return (
            <li key={pair.slug}>
              <Link
                href={`${prefix}/tools/convert/${pair.slug}`}
                className="group block h-full"
              >
                <AppCard
                  border
                  cornerAccents={false}
                  className="p-3.5 sm:p-4 bg-tertiary group-hover:border-primary/60 transition-colors flex items-center justify-between h-full"
                >
                  <span className="text-xs sm:text-sm font-bold uppercase text-foreground group-hover:text-primary transition-colors">
                    {getLocalizedPairTitle(pair, locale)}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-primary group-hover:translate-x-0.5 transition-transform shrink-0 ml-2" />
                </AppCard>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
