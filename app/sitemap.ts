import type { MetadataRoute } from 'next'
import { conversionPages } from '@/data/conversionPages'
import { COMMON_PAIRS } from '@/data/conversionPairs'
import { PRIORITY_PAIR_SLUGS } from '@/data/conversionPairContent'
import { QUIZ_REGISTRY } from '@/lib/quizRegistry'
import { BLOG_POSTS } from '@/data/blog/index'
import { getAllMdxBlogPosts } from '@/lib/content/blogRepository'

const BASE_URL = (process.env.NEXT_PUBLIC_BASE_URL ?? 'https://toolnotch.com').trim()

/**
 * Stable content-refresh date for routes with no per-item date. Bumped when a
 * WS ships a site-wide change (WS-5 = 2026-09-05). Using a fixed date instead
 * of `new Date()` keeps `<lastmod>` from churning on every deploy.
 */
const SITE_CONTENT_DATE = new Date('2026-09-05T00:00:00Z')

/** Priority conversion pairs stay in the sitemap; the rest are noindex (WS-5 item 10). */
const PRIORITY_PAIR_SET = new Set<string>(PRIORITY_PAIR_SLUGS)

/** Individual quiz routes, generated from the single quiz registry. */
const QUIZ_ROUTES = QUIZ_REGISTRY.map((q) => `/quiz/${q.id}`)

/** World Cup quiz result/tier pages — the only quiz result pages with unique body copy. */
const WC_RESULT_ROUTES = ['legend', 'expert', 'fan', 'rookie'].map(
  (tier) => `/quiz/fifa-world-cup-winners/result/${tier}`,
)

const TRUST_ROUTES = [
  '/about',
  '/privacy',
  '/terms',
  '/contact',
  '/partners',
  '/disclosure',
]

const ALL_ROUTES = [
  // Interview prep
  '/interview',
  '/interview/typescript',
  '/interview/database-design',
  '/interview/database-indexing',
  '/interview/messaging-sqs-kafka',
  '/interview/rabbitmq-concepts',
  '/interview/nodejs-fundamentals',
  '/interview/system-architecture',
  '/interview/vue',
  // Legal / info (moved to TRUST_ROUTES above — rendered at priority 0.6)
  // PDF tools
  '/tools/pdf',
  '/tools/pdf/merge-pdf',
  '/tools/pdf/split-pdf',
  '/tools/pdf/compress-pdf',
  '/tools/pdf/pdf-to-jpg',
  '/tools/pdf/jpg-to-pdf',
  // Convert tools
  '/tools/convert',
  '/tools/convert/unit-converter',
  '/tools/convert/currency-converter',
  // Text tools
  '/tools/text',
  '/tools/text/word-counter',
  '/tools/text/character-counter',
  '/tools/text/sentence-counter',
  '/tools/text/readability-checker',
  '/tools/text/reading-time-calculator',
  '/tools/text/word-frequency-counter',
  '/tools/text/keyword-density-checker',
  // '/tools/text/paraphraser', '/tools/text/summarizer',
  // '/tools/text/plagiarism-checker' — coming-soon stubs, noindex (WS-5 audit).
  // Finance — calculators
  '/tools/finance',
  '/tools/finance/loan-calculator',
  '/tools/finance/mortgage-calculator',
  '/tools/finance/car-loan-calculator',
  '/tools/finance/personal-loan-calculator',
  '/tools/finance/amortization-calculator',
  '/tools/finance/home-affordability-calculator',
  '/tools/finance/refinance-calculator',
  '/tools/finance/student-loan-calculator',
  '/tools/finance/interest-calculator',
  '/tools/finance/30-year-mortgage-calculator',
  '/tools/finance/15-year-mortgage-calculator',
  '/tools/finance/fha-loan-calculator',
  '/tools/finance/va-loan-calculator',
  '/tools/finance/debt-payoff-calculator',
  // Finance — invoice & receipt
  '/tools/finance/invoice-generator',
  '/tools/finance/invoice-generator-uk',
  '/tools/finance/invoice-generator-canada',
  '/tools/finance/invoice-generator-australia',
  '/tools/finance/invoice-generator-for-freelancers',
  '/tools/finance/receipt-generator',
  // '/tools/finance/crypto-portfolio-tracker' — coming-soon stub, noindex (WS-5 audit).
  // Fun tools
  '/tools/fun',
  '/tools/fun/spin-the-wheel',
  '/tools/fun/wheel-of-names',
  '/tools/fun/random-name-picker',
  '/tools/fun/random-team-generator',
  '/tools/fun/yes-or-no-wheel',
  '/tools/fun/coin-flip',
  '/tools/fun/dice-roller',
  '/tools/fun/random-number-generator',
  '/tools/fun/giveaway-picker',
  '/tools/fun/classroom-name-picker',
  '/tools/fun/typing-test',
  // Convert tools — calculators
  '/tools/convert/percentage-calculator',
  // Agile tools
  '/tools/agile',
  '/tools/agile/retro-board',
  '/tools/agile/standup-generator',
  '/tools/agile/planning-poker',
  '/tools/agile/user-story-writer',
  '/tools/agile/sprint-date-calculator',
  // Quizzes hub — individual /quiz/<id> routes are generated from
  // lib/quizRegistry.ts (see QUIZ_ROUTES below), not hand-listed here.
  '/quizzes',
  // Health tools
  '/tools/health',
  '/tools/health/bmi-calculator',
  '/tools/health/tdee-calculator',
  '/tools/health/calorie-deficit-calculator',
  // Education tools
  '/tools/education',
  '/tools/education/gpa-calculator',
  '/tools/education/cumulative-gpa-calculator',
  '/tools/education/grade-calculator',
  '/tools/education/citation-generator',
  // Math tools
  '/tools/math',
  '/tools/math/age-calculator',
  // Utilities
  '/tools/utilities',
  '/tools/utilities/qr-code-generator',
  '/tools/utilities/election-countdown',
  '/tools/utilities/polling-place-finder',
  // Blog
  '/blog',
]

/**
 * Builds a sitemap entry with locale alternates for hreflang.
 * English has no URL prefix (localePrefix: 'as-needed').
 */
function urlWithAlternates(path: string, priority = 0.8, lastModified: Date = SITE_CONTENT_DATE) {
  return {
    url: `${BASE_URL}${path}`,
    lastModified,
    changeFrequency: 'monthly' as const,
    priority,
    alternates: {
      languages: {
        en: `${BASE_URL}${path}`,
        pt: `${BASE_URL}/pt${path}`,
        es: `${BASE_URL}/es${path}`,
        'x-default': `${BASE_URL}${path}`,
      },
    },
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const mdxPosts = await getAllMdxBlogPosts()

  // Skip MDX posts already emitted via the BLOG_POSTS loop below to avoid duplicate <url> entries.
  const registeredBlogSlugs = new Set(BLOG_POSTS.map((post) => post.slug))

  const mdxBlogEntries: MetadataRoute.Sitemap = mdxPosts
    .filter((post) => !registeredBlogSlugs.has(post.slug))
    .map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt ?? post.publishedAt ?? SITE_CONTENT_DATE),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
    alternates: {
      languages: {
        en: `${BASE_URL}/blog/${post.slug}`,
        pt: `${BASE_URL}/pt/blog/${post.slug}`,
        es: `${BASE_URL}/es/blog/${post.slug}`,
        'x-default': `${BASE_URL}/blog/${post.slug}`,
      },
    }
  }))

  return [
    {
      url: BASE_URL,
      lastModified: SITE_CONTENT_DATE,
      changeFrequency: 'weekly',
      priority: 1.0,
      alternates: {
        languages: {
          en: BASE_URL,
          pt: `${BASE_URL}/pt`,
          es: `${BASE_URL}/es`,
          'x-default': BASE_URL,
        },
      },
    },
    urlWithAlternates('/tools/image/image-compressor', 0.9),
    ...conversionPages.map((page) =>
      urlWithAlternates(`/tools/image/${page.slug}`)
    ),
    // Conversion pairs: only the WS-2 priority slugs are indexable. The rest
    // emit `robots: { index: false }` and are excluded here (WS-5 item 10).
    ...COMMON_PAIRS
      .filter((pair) => PRIORITY_PAIR_SET.has(pair.slug))
      .map((pair) => urlWithAlternates(`/tools/convert/${pair.slug}`)),
    ...TRUST_ROUTES.map((path) => urlWithAlternates(path, 0.6)),
    ...ALL_ROUTES.map((path) => urlWithAlternates(path)),
    // Quizzes — generated from lib/quizRegistry.ts (single source of truth).
    ...QUIZ_ROUTES.map((path) => urlWithAlternates(path, 0.7)),
    ...WC_RESULT_ROUTES.map((path) => urlWithAlternates(path, 0.6)),
    ...BLOG_POSTS.map((post) =>
      urlWithAlternates(
        `/blog/${post.slug}`,
        0.8,
        new Date(post.updatedAt ?? post.publishedAt ?? SITE_CONTENT_DATE),
      ),
    ),
    ...mdxBlogEntries,
  ]
}
