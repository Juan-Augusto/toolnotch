import Link from 'next/link'
import { COMMON_PAIRS } from '@/data/conversionPairs'
import { getPairContent } from '@/data/conversionPairContent'
import { UnitCategory } from '@/lib/unitTypes'

interface RelatedConversionsProps {
  /** Slug of the page currently being rendered — excluded from the list. */
  currentSlug: string
  category: UnitCategory
  locale: string
  /** Localised <h2> for the section. */
  heading: string
  /** Maximum number of links to render. */
  limit?: number
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
  limit = 6
) {
  const siblings = COMMON_PAIRS.filter(
    (p) => p.category === category && p.slug !== currentSlug
  )

  const current = COMMON_PAIRS.find((p) => p.slug === currentSlug)
  const reverse = current
    ? siblings.find((p) => p.from === current.to && p.to === current.from)
    : undefined

  const rest = siblings
    .filter((p) => p.slug !== reverse?.slug)
    .sort((a, b) => {
      const aLocalised = getPairContent(a.slug, locale) ? 0 : 1
      const bLocalised = getPairContent(b.slug, locale) ? 0 : 1
      return aLocalised - bLocalised
    })

  return [...(reverse ? [reverse] : []), ...rest].slice(0, limit)
}

export default function RelatedConversions({
  currentSlug,
  category,
  locale,
  heading,
  limit = 6,
}: RelatedConversionsProps) {
  const related = selectRelatedPairs(currentSlug, category, locale, limit)
  if (related.length === 0) return null

  const prefix = locale === 'en' ? '' : `/${locale}`

  return (
    <section className="mt-12">
      <h2 className="text-xl font-bold mb-4 section-heading">{heading}</h2>
      <ul className="grid gap-3 sm:grid-cols-2">
        {related.map((pair) => {
          const content = getPairContent(pair.slug, locale)
          return (
            <li key={pair.slug}>
              <Link
                href={`${prefix}/tools/convert/${pair.slug}`}
                className="card-neon-interactive block p-4 text-sm font-medium link-hover"
              >
                {content?.h1 ?? pair.title}
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
