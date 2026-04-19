import type { Metadata } from 'next'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { buildAlternates } from '@/lib/i18nMeta'
import { buildJsonLd, breadcrumbSchema } from '@/lib/schema'

const PATH = '/contact'

const jsonLd = buildJsonLd(
  breadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Contact', url: '/contact' },
  ]),
)

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'contact' })
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: buildAlternates(PATH),
  }
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'contact' })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-2xl mx-auto px-4 py-12">

          <div className="mb-8">
            <Link href="/" className="text-sm text-blue-600 hover:underline dark:text-blue-400">
              ← {t('backHome')}
            </Link>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {t('heading')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-10">
            {t('intro')}
          </p>

          {/* Email CTA */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
              {t('emailLabel')}
            </p>
            <a
              href="mailto:contact@toolnotch.com"
              className="text-xl font-semibold text-blue-600 hover:underline dark:text-blue-400"
            >
              contact@toolnotch.com
            </a>
          </div>

          {/* Categories */}
          <div className="space-y-4 mb-10">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
              <h2 className="font-semibold text-gray-900 dark:text-white mb-1">
                {t('categories.bugs.title')}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('categories.bugs.description')}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
              <h2 className="font-semibold text-gray-900 dark:text-white mb-1">
                {t('categories.features.title')}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('categories.features.description')}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
              <h2 className="font-semibold text-gray-900 dark:text-white mb-1">
                {t('categories.business.title')}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('categories.business.description')}
              </p>
            </div>
          </div>

          {/* Response time */}
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t('responseTime')}
          </p>

        </div>
      </main>
    </>
  )
}
