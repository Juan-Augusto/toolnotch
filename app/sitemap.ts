import type { MetadataRoute } from 'next'
import { conversionPages } from '@/data/conversionPages'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://toolnotch.com'

const PDF_ROUTES = [
  '/tools/pdf/merge-pdf',
  '/tools/pdf/split-pdf',
  '/tools/pdf/compress-pdf',
  '/tools/pdf/pdf-to-jpg',
  '/tools/pdf/jpg-to-pdf',
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
    // PDF tools
    ...PDF_ROUTES.map((path) => ({
      url: `${BASE_URL}${path}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    })),
  ]
}
