/**
 * Slug translations for blog posts that exist as a separate MDX file per locale.
 *
 * Legacy posts live flat in `data/blog/content/*.mdx` and are served (in English)
 * at every locale. Posts listed here instead live in `data/blog/content/{locale}/`
 * and get a native-language slug per locale, so `/pt/blog/como-calcular-gpa` and
 * `/blog/how-to-calculate-gpa` are the same article in two languages.
 *
 * Each entry is one translation *group*: a stable group id mapped to its slug in
 * every locale. This is the single source of truth used for hreflang alternates
 * and for the sitemap.
 */

export type BlogLocale = 'en' | 'pt' | 'es'

export const BLOG_LOCALES: BlogLocale[] = ['en', 'pt', 'es']

export type SlugsByLocale = Record<BlogLocale, string>

export const BLOG_SLUG_GROUPS: Record<string, SlugsByLocale> = {
  'gpa-how-to': {
    en: 'how-to-calculate-gpa',
    pt: 'como-calcular-gpa',
    es: 'como-calcular-el-gpa',
  },
  'gpa-brazilian-grades': {
    en: 'convert-brazilian-grades-to-gpa',
    pt: 'converter-notas-brasileiras-para-gpa',
    es: 'convertir-notas-brasilenas-a-gpa',
  },
  'gpa-us-admissions': {
    en: 'gpa-needed-for-us-universities',
    pt: 'gpa-para-aplicar-universidade-eua',
    es: 'gpa-para-estudiar-en-estados-unidos',
  },
}

/** Every localized slug, flattened — used by generateStaticParams and the sitemap. */
export const LOCALIZED_BLOG_SLUGS: SlugsByLocale[] = Object.values(BLOG_SLUG_GROUPS)

/** Returns the group id a slug belongs to, or null when the slug is a legacy flat post. */
export function findSlugGroup(slug: string): SlugsByLocale | null {
  for (const group of LOCALIZED_BLOG_SLUGS) {
    if (BLOG_LOCALES.some((l) => group[l] === slug)) return group
  }
  return null
}

/**
 * Returns the slug for the same article in `locale`.
 * Falls back to the input slug for legacy posts that share one slug across locales.
 */
export function translateSlug(slug: string, locale: string): string {
  const group = findSlugGroup(slug)
  if (!group) return slug
  return group[(locale as BlogLocale)] ?? slug
}

/** True when `slug` is the correct slug for `locale` (or a legacy shared slug). */
export function slugBelongsToLocale(slug: string, locale: string): boolean {
  const group = findSlugGroup(slug)
  if (!group) return true
  return group[(locale as BlogLocale)] === slug
}

/** The slugs of localized posts that should be listed on `/{locale}/blog`. */
export function localizedSlugsFor(locale: string): string[] {
  const l = locale as BlogLocale
  return LOCALIZED_BLOG_SLUGS.map((group) => group[l]).filter(Boolean)
}
