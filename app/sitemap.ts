import type { MetadataRoute } from 'next'
import { conversionPages } from '@/data/conversionPages'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://yoursite.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return [
    {
      url: `${BASE_URL}/tools/image/image-compressor`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 1.0,
    },
    ...conversionPages.map((page) => ({
      url: `${BASE_URL}/tools/image/${page.slug}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ]
}
