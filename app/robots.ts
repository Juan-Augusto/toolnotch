import type { MetadataRoute } from 'next'
import { BLOCKED_BOTS } from '@/lib/blockedBots'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://toolnotch.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: '/api/',
      },
      // Also asked politely here; proxy.ts enforces with a 403.
      { userAgent: [...BLOCKED_BOTS], disallow: '/' },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}
