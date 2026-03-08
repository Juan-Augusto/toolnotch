import type { MetadataRoute } from 'next'
import { conversionPages } from '@/data/conversionPages'
import { COMMON_PAIRS } from '@/data/conversionPairs'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://toolnotch.com'

const ALL_ROUTES = [
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
  // Quizzes
  '/quizzes',
  '/quiz/what-career-suits-you',
  '/quiz/which-programming-language-are-you',
  '/quiz/am-i-introverted-or-extroverted',
  '/quiz/what-type-of-traveler-are-you',
  '/quiz/which-decade-do-you-belong-in',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return [
    {
      url: BASE_URL,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/tools/image/image-compressor`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    ...conversionPages.map((page) => ({
      url: `${BASE_URL}/tools/image/${page.slug}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    ...COMMON_PAIRS.map((pair) => ({
      url: `${BASE_URL}/tools/convert/${pair.slug}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    ...ALL_ROUTES.map((path) => ({
      url: `${BASE_URL}${path}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ]
}
