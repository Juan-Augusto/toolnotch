import createMiddleware from 'next-intl/middleware'
import type { NextRequest } from 'next/server'
import { locales, defaultLocale } from './i18n'
import { isBlockedBot } from './lib/blockedBots'

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed', // EN = no prefix; PT/ES get /pt/ and /es/
})

export default function proxy(request: NextRequest) {
  if (isBlockedBot(request.headers.get('user-agent'))) {
    return new Response('Blocked', { status: 403 })
  }
  return intlMiddleware(request)
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|pdf.worker.min.mjs|robots.txt|sitemap.xml|ads.txt).*)'],
}
