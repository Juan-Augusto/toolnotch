import type { Metadata } from 'next'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { buildAlternates } from '@/lib/i18nMeta'
import { buildJsonLd, breadcrumbSchema } from '@/lib/schema'

const PATH = '/about'

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'about' })
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: buildAlternates(PATH),
    openGraph: { title: t('metaTitle'), url: PATH },
  }
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'about' })

  const jsonLd = buildJsonLd(
    breadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: t('title'), url: PATH },
    ]),
    {
      '@type': 'Organization',
      name: 'ToolNotch',
      url: 'https://toolnotch.com',
      founder: { '@type': 'Person', name: 'Juan Soares' },
      sameAs: ['https://github.com/Juan-Augusto'],
    },
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
          <p className="text-lg text-gray-500 dark:text-gray-400 mb-10">{t('subtitle')}</p>

          <div className="space-y-10 text-gray-700 dark:text-gray-300 leading-relaxed">

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                {t('whyTitle')}
              </h2>
              <p className="mb-4">{t('whyP1')}</p>
              <p className="mb-4">{t('whyP2')}</p>
              <p>{t('whyP3')}</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                {t('believeTitle')}
              </h2>
              <p className="mb-4">{t('believeP1')}</p>
              <p>{t('believeP2')}</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                {t('whoTitle')}
              </h2>
              <p className="mb-4">{t('whoP1')}</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                {t('toolsTitle')}
              </h2>
              <p className="mb-4">{t('toolsP1')}</p>
              <p>{t('toolsP2')}</p>
            </section>

          </div>
        </div>
      </main>
    </>
  )
}
