const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://toolnotch.com'

/**
 * Builds the `alternates` object for Next.js Metadata API.
 * English has no URL prefix (localePrefix: 'as-needed').
 * Portuguese gets /pt prefix, Spanish gets /es prefix.
 *
 * Usage in any page.tsx:
 *   export const metadata: Metadata = {
 *     alternates: buildAlternates('/tools/pdf/merge-pdf'),
 *   }
 */
export function buildAlternates(path: string) {
  return {
    canonical: `${BASE_URL}${path}`,
    languages: {
      en: `${BASE_URL}${path}`,
      pt: `${BASE_URL}/pt${path}`,
      es: `${BASE_URL}/es${path}`,
      'x-default': `${BASE_URL}${path}`,
    },
  }
}

/** Prefixes `path` with the locale, except for English which has no prefix. */
export function localizedPath(path: string, locale: string): string {
  return locale === 'en' ? path : `/${locale}${path}`
}

/**
 * Same as `buildAlternates`, but the canonical points at the URL for `locale`
 * rather than always at the English URL.
 *
 * `buildAlternates` declares the English URL canonical on every locale, which
 * tells Google the /pt and /es pages are duplicates of the English one and
 * should not be indexed separately. Use this on any page whose localized
 * versions carry genuinely different content.
 */
export function buildAlternatesForLocale(path: string, locale: string) {
  return {
    canonical: `${BASE_URL}${localizedPath(path, locale)}`,
    languages: {
      en: `${BASE_URL}${path}`,
      pt: `${BASE_URL}/pt${path}`,
      es: `${BASE_URL}/es${path}`,
      'x-default': `${BASE_URL}${path}`,
    },
  }
}

/**
 * Alternates for a page whose path differs per locale — e.g. a blog post with a
 * native-language slug in each language. `pathsByLocale` maps locale to the
 * unprefixed path; the locale prefix is added here.
 */
export function buildAlternatesForPaths(
  pathsByLocale: Record<string, string>,
  locale: string,
) {
  const url = (l: string) => `${BASE_URL}${localizedPath(pathsByLocale[l] ?? pathsByLocale.en, l)}`
  return {
    canonical: url(locale),
    languages: {
      en: url('en'),
      pt: url('pt'),
      es: url('es'),
      'x-default': url('en'),
    },
  }
}
