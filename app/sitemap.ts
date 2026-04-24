import type { MetadataRoute } from 'next'
import { conversionPages } from '@/data/conversionPages'
import { COMMON_PAIRS } from '@/data/conversionPairs'
import { BLOG_POSTS } from '@/data/blog/index'
import { getAllMdxBlogPosts } from '@/lib/blogContent'

const BASE_URL = (process.env.NEXT_PUBLIC_BASE_URL ?? 'https://toolnotch.com').trim()

const TRUST_ROUTES = [
  '/about',
  '/privacy',
  '/terms',
  '/contact',
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
  '/tools/text/paraphraser',
  '/tools/text/summarizer',
  '/tools/text/plagiarism-checker',
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
  '/tools/finance/crypto-portfolio-tracker',
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
  // Quizzes
  '/quizzes',
  '/quiz/what-career-suits-you',
  '/quiz/which-programming-language-are-you',
  '/quiz/am-i-introverted-or-extroverted',
  '/quiz/what-type-of-traveler-are-you',
  '/quiz/which-decade-do-you-belong-in',
  // Sports quizzes
  '/quiz/fifa-world-cup-winners',
  '/quiz/which-football-club-are-you',
  '/quiz/champions-league-trivia',
  '/quiz/what-is-your-love-language',
  '/quiz/formula-1-trivia',
  '/quiz/which-f1-driver-are-you',
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
  // Blog
  '/blog',
]

/**
 * Builds a sitemap entry with locale alternates for hreflang.
 * English has no URL prefix (localePrefix: 'as-needed').
 */
function urlWithAlternates(path: string, priority = 0.8) {
  return {
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority,
    alternates: {
      languages: {
        en: `${BASE_URL}${path}`,
        pt: `${BASE_URL}/pt${path}`,
        es: `${BASE_URL}/es${path}`,
      },
    },
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const mdxPosts = await getAllMdxBlogPosts()

  const mdxBlogEntries: MetadataRoute.Sitemap = mdxPosts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt ?? post.publishedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
    alternates: {
      languages: {
        en: `${BASE_URL}/blog/${post.slug}`,
        pt: `${BASE_URL}/pt/blog/${post.slug}`,
        es: `${BASE_URL}/es/blog/${post.slug}`,
        'x-default': `${BASE_URL}/blog/${post.slug}`,
      },
    },
  }))

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
      alternates: {
        languages: {
          en: BASE_URL,
          pt: `${BASE_URL}/pt`,
          es: `${BASE_URL}/es`,
        },
      },
    },
    urlWithAlternates('/tools/image/image-compressor', 0.9),
    ...conversionPages.map((page) =>
      urlWithAlternates(`/tools/image/${page.slug}`)
    ),
    ...COMMON_PAIRS.map((pair) =>
      urlWithAlternates(`/tools/convert/${pair.slug}`)
    ),
    ...TRUST_ROUTES.map((path) => urlWithAlternates(path, 0.6)),
    ...ALL_ROUTES.map((path) => urlWithAlternates(path)),
    ...BLOG_POSTS.map((post) => urlWithAlternates(`/blog/${post.slug}`, 0.8)),
    ...mdxBlogEntries,
    // Backend Engineering quizzes
    ...[
      '/quiz/nodejs-fundamentals',
      '/quiz/database-design',
      '/quiz/database-indexing',
      '/quiz/messaging-sqs-kafka',
      '/quiz/rabbitmq-concepts',
      '/quiz/system-architecture',
    ].map((path) => urlWithAlternates(path, 0.7)),
  ]
}
