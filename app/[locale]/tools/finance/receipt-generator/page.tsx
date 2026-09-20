import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { buildAlternatesForLocale, localizedPath } from '@/lib/i18nMeta'
import {
  buildJsonLd,
  webAppSchema,
  faqSchema,
  howToSchema,
  breadcrumbSchema,
  buildLocalizedUrl,
} from '@/lib/schema'
import type { FaqItem } from '@/components/AppFaqSection'
import FinanceToolHeader from '../components/FinanceToolHeader'
import FinanceToolContent, { type RichContent } from '../components/FinanceToolContent'
import InvoiceBuilder from '../invoice-generator/InvoiceBuilder'

const SLUG = 'receipt-generator'
const PATH = `/tools/finance/${SLUG}`

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'finance.invoiceGenerator.receiptGenerator' })
  const localizedUrl = buildLocalizedUrl(PATH, locale)
  const ogLocale =
    locale === 'pt' ? 'pt_BR' : locale === 'es' ? 'es_ES' : 'en_US'

  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: buildAlternatesForLocale(PATH, locale),
    openGraph: {
      title: `${t('title')} | ToolNotch`,
      description: t('metaDescription'),
      url: localizedUrl,
      siteName: 'ToolNotch',
      locale: ogLocale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${t('title')} | ToolNotch`,
      description: t('metaDescription'),
    },
  }
}

export default async function ReceiptGeneratorPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'finance.invoiceGenerator.receiptGenerator' })
  const faqs = (t.raw('faqs') as FaqItem[]) || []
  const richContent = (t.raw('richContent') as RichContent) || {}

  const homeLabel =
    locale === 'pt' ? 'Início' : locale === 'es' ? 'Inicio' : 'Home'
  const toolsLabel =
    locale === 'pt' ? 'Ferramentas' : locale === 'es' ? 'Herramientas' : 'Tools'
  const financeLabel =
    locale === 'pt' ? 'Finanças' : locale === 'es' ? 'Finanzas' : 'Finance'
  const localizedUrl = buildLocalizedUrl(PATH, locale)

  const howToSteps = Array.isArray(richContent?.howToUse)
    ? richContent.howToUse.filter(
        (s) => typeof s === 'string' && s.trim().length > 0,
      )
    : []

  const howToJsonLd =
    howToSteps.length >= 2 ? howToSchema(t('title'), howToSteps) : null

  const jsonLd = buildJsonLd(
    breadcrumbSchema([
      { name: homeLabel, url: localizedPath('/', locale) },
      { name: toolsLabel, url: localizedPath('/tools', locale) },
      { name: financeLabel, url: localizedPath('/tools/finance', locale) },
      { name: t('title'), url: localizedUrl },
    ]),
    webAppSchema(
      t('title'),
      PATH,
      t('metaDescription'),
      locale,
      'BusinessApplication',
    ),
    faqSchema(faqs),
    ...(howToJsonLd ? [howToJsonLd] : []),
  )

  return (
    <main className="container min-h-[calc(100vh-180px)] bg-background text-foreground py-3 sm:py-6 md:py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="w-full">
        <FinanceToolHeader
          title={t('title')}
          description={t('description')}
          locale={locale}
        />

        <div className="w-full mb-10">
          <InvoiceBuilder />
        </div>

        <FinanceToolContent
          currentToolSlug={SLUG}
          richContent={richContent}
          faqs={faqs}
          locale={locale}
        />
      </div>
    </main>
  )
}
