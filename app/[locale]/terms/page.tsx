import type { Metadata } from 'next'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { buildAlternates } from '@/lib/i18nMeta'
import { buildJsonLd, breadcrumbSchema } from '@/lib/schema'

const PATH = '/terms'

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'terms' })
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: buildAlternates(PATH),
    openGraph: { title: t('metaTitle'), url: PATH },
  }
}

export default async function TermsPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'terms' })

  const jsonLd = buildJsonLd(
    breadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: t('title'), url: PATH },
    ]),
  )

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <div className="mb-8">
            <Link href="/" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
              ← {t('backHome')}
            </Link>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mb-3">{t('title')}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-10">{t('lastUpdated')}</p>

          <div className="space-y-10 text-gray-700 dark:text-gray-300 leading-relaxed">

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                {t('s1Title')}
              </h2>
              <p className="mb-4">{t('s1P1')}</p>
              <p>{t('s1P2')}</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                {t('s2Title')}
              </h2>
              <p className="mb-4">{t('s2P1')}</p>
              <p>{t('s2P2')}</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                {t('s3Title')}
              </h2>
              <p className="mb-4">{t('s3P1')}</p>
              <p>{t('s3P2')}</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                {t('s4Title')}
              </h2>
              <p className="mb-4">{t('s4P1')}</p>
              <p>{t('s4P2')}</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                {t('s5Title')}
              </h2>
              <p>{t('s5P1')}</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                {t('s6Title')}
              </h2>
              <p>{t('s6P1')}</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                {t('s7Title')}
              </h2>
              <p>{t('s7P1')}</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                {t('s8Title')}
              </h2>
              <p>{t('s8P1')}</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                {t('s9Title')}
              </h2>
              <p>
                {t('s9P1')}{' '}
                <Link href="/contact" className="text-blue-600 dark:text-blue-400 hover:underline">
                  {t('s9ContactLink')}
                </Link>
                .
              </p>
            </section>

          </div>
        </div>
      </main>
    </>
  )
}
