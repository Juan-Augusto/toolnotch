import createMiddleware from 'next-intl/middleware'
import { locales, defaultLocale } from './i18n'

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed', // EN = no prefix; PT/ES get /pt/ and /es/
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|pdf.worker.min.mjs|robots.txt|sitemap.xml|ads.txt).*)'],
}
