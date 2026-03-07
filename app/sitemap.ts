import type { MetadataRoute } from 'next'
import { conversionPages } from '@/data/conversionPages'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://toolnotch.com'

const ALL_ROUTES = [
  // PDF tools
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
  '/tools/text/word-counter',
  '/tools/text/character-counter',
  '/tools/text/paraphraser',
  '/tools/text/summarizer',
  '/tools/text/plagiarism-checker',
  // Resume
  '/tools/resume/resume-builder',
  // Finance tools
  '/tools/finance/loan-calculator',
  '/tools/finance/mortgage-calculator',
  '/tools/finance/invoice-generator',
  '/tools/finance/crypto-portfolio-tracker',
  // Fun tools
  '/tools/fun/spin-the-wheel',
  '/tools/fun/random-name-picker',
  '/tools/fun/coin-flip',
  '/tools/fun/dice-roller',
  '/tools/fun/typing-test',
  // Quizzes
  '/quizzes',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return [
    // Homepage
    {
      url: BASE_URL,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    // Image tools
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
    // All other tools
    ...ALL_ROUTES.map((path) => ({
      url: `${BASE_URL}${path}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ]
}
