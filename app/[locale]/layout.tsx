import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import Script from 'next/script'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { locales } from '@/i18n'
import ThemeProvider from '@/components/ThemeProvider'
import DarkModeToggle from '@/components/DarkModeToggle'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import '../globals.css'

const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? ''
const ADSENSE_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? ''

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
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
  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#2563eb" />
        {ADSENSE_ID && <meta name="google-adsense-account" content={ADSENSE_ID} />}
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteSchema) }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
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
      </body>
    </html>
  )
}
