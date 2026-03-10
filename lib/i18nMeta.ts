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
