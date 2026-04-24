import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Syne } from 'next/font/google'
import Script from 'next/script'
import { cookies } from 'next/headers'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { locales } from '@/i18n'
import ThemeProvider from '@/components/ThemeProvider'
import DarkModeToggle from '@/components/DarkModeToggle'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import Footer from '@/components/Footer'
import '../globals.css'

const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? ''
const ADSENSE_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? ''

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

const syne = Syne({
  variable: '--font-syne',
  subsets: ['latin'],
  weight: ['700', '800'],
  display: 'swap',
})

const siteSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      name: 'ToolNotch',
      url: process.env.NEXT_PUBLIC_BASE_URL ?? 'https://toolnotch.com',
      description: 'Free online tools — compress images, merge PDFs, convert units, calculate loans, generate invoices, and more.',
    },
    {
      '@type': 'Organization',
      name: 'ToolNotch',
      url: process.env.NEXT_PUBLIC_BASE_URL ?? 'https://toolnotch.com',
    },
  ],
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'site' })
  return {
    title: { default: t('title'), template: '%s | ToolNotch' },
    description: t('description'),
    metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL ?? 'https://toolnotch.com'),
    verification: {
      google: 'KZPRFQz0pmw9A9PZwfQAY28HraEVlFVLOasRo26sD9k',
    },
    openGraph: {
      siteName: 'ToolNotch',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
    },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!locales.includes(locale as typeof locales[number])) notFound()
  const messages = await getMessages()
  const cookieStore = await cookies()
  const isDark = cookieStore.get('theme')?.value === 'dark'
  return (
    <html lang={locale} className={isDark ? 'dark' : ''} suppressHydrationWarning>
      <head>
        {/* Blocking script: reads localStorage before first paint to prevent theme flash on navigation */}
        <script dangerouslySetInnerHTML={{ __html: `
          try {
            var t = localStorage.getItem('theme');
            var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            var isDark = t === 'dark' || (!t && prefersDark);
            if (isDark) {
              document.documentElement.classList.add('dark');
            } else {
              document.documentElement.classList.remove('dark');
            }
            // Sync cookie so server renders correct class on next navigation
            if (!document.cookie.includes('theme=')) {
              document.cookie = 'theme=' + (isDark ? 'dark' : 'light') + '; path=/; max-age=31536000; SameSite=Lax';
            }
          } catch(e) {}
        ` }} />
        <meta name="theme-color" content="#2563eb" />
        {ADSENSE_ID && <meta name="google-adsense-account" content={ADSENSE_ID} />}
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteSchema) }}
        />
      </head>
      <body className={`${plusJakartaSans.variable} ${syne.variable} antialiased`}>
        <ThemeProvider>
          <NextIntlClientProvider messages={messages}>
            {children}
            <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2">
              <LanguageSwitcher />
              <DarkModeToggle />
            </div>
          </NextIntlClientProvider>
        </ThemeProvider>
        {ADSENSE_ID && (
          <Script
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_ID}`}
            strategy="afterInteractive"
            crossOrigin="anonymous"
          />
        )}
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}');
              `}
            </Script>
          </>
        )}
        <Footer locale={locale} />
      </body>
    </html>
  )
}
