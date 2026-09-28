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
import UtilityToolHeader from '../components/UtilityToolHeader'
import UtilityToolContent, {
  type RichContent,
} from '../components/UtilityToolContent'
import AppQrCodeGenerator from '@/components/utilities/AppQrCodeGenerator'

const PATH = '/tools/utilities/qr-code-generator'

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'qrGenerator' })
  const localizedUrl = buildLocalizedUrl(PATH, locale)
  const ogLocale =
    locale === 'pt' ? 'pt_BR' : locale === 'es' ? 'es_ES' : 'en_US'

  const keywords =
    locale === 'pt'
      ? [
          'gerador de qr code',
          'criar qr code gratis',
          'gerador qr code wifi',
          'qr code png',
          'qr code svg',
          'gerar qr code online',
          'qr code sem cadastro',
          'codigo qr personalizado',
        ]
      : locale === 'es'
        ? [
            'generador de codigo qr',
            'crear codigo qr gratis',
            'generador qr wifi',
            'codigo qr png',
            'codigo qr svg',
            'generar qr code online',
            'qr sin registro',
            'codigo qr personalizado',
          ]
        : [
            'qr code generator',
            'free qr code generator',
            'wifi qr code generator',
            'qr code png',
            'qr code svg',
            'generate qr code online',
            'qr code no sign up',
            'custom qr code maker',
          ]

  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    keywords,
    alternates: buildAlternatesForLocale(PATH, locale),
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
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
    category: 'utilities',
  }
}

export default async function QrCodeGeneratorPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'qrGenerator' })
  const faqs = (t.raw('faqs') as FaqItem[]) || []
  const richContent = (t.raw('richContent') as RichContent) || {}

  const homeLabel =
    locale === 'pt' ? 'Início' : locale === 'es' ? 'Inicio' : 'Home'
  const toolsLabel =
    locale === 'pt' ? 'Ferramentas' : locale === 'es' ? 'Herramientas' : 'Tools'
  const utilitiesLabel =
    locale === 'pt' ? 'Utilidades' : locale === 'es' ? 'Utilidades' : 'Utilities'
  const localizedUrl = buildLocalizedUrl(PATH, locale)

  const howToSteps = Array.isArray(richContent.howToUse)
    ? richContent.howToUse.filter(
        (s) => typeof s === 'string' && s.trim().length > 0
      )
    : []

  const howToJsonLd =
    howToSteps.length >= 2 ? howToSchema(t('title'), howToSteps) : null

  const jsonLd = buildJsonLd(
    breadcrumbSchema([
      { name: homeLabel, url: localizedPath('/', locale) },
      { name: toolsLabel, url: localizedPath('/tools', locale) },
      { name: utilitiesLabel, url: localizedPath('/tools', locale) },
      { name: t('title'), url: localizedUrl },
    ]),
    webAppSchema(
      t('title'),
      PATH,
      t('metaDescription'),
      locale,
      'WebApplication'
    ),
    faqSchema(faqs),
    ...(howToJsonLd ? [howToJsonLd] : [])
  )

  return (
    <main className="container min-h-[calc(100vh-180px)] bg-background text-foreground py-3 sm:py-6 md:py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="w-full">
        <UtilityToolHeader
          title={t('title')}
          description={t('description')}
          locale={locale}
        />

        <section aria-label={t('title')} className="w-full">
          <AppQrCodeGenerator locale={locale} />
        </section>

        <UtilityToolContent
          currentToolSlug="qr-code-generator"
          richContent={richContent}
          faqs={faqs}
          locale={locale}
        />
      </div>
    </main>
  )
}
