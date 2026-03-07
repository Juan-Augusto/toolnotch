import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { conversionPages } from '@/data/conversionPages'
import ImageCompressorClient from '../image-compressor/ImageCompressorClient'
import AdUnit from '@/components/image/AdUnit'

interface Props {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return conversionPages.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const page = conversionPages.find((p) => p.slug === slug)
  if (!page) return {}
  return {
    title: page.metaTitle,
    description: page.metaDescription,
  }
}

export default async function SlugPage({ params }: Props) {
  const { slug } = await params
  const page = conversionPages.find((p) => p.slug === slug)
  if (!page) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: page.h1,
        description: page.metaDescription,
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'Any',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      },
      {
        '@type': 'FAQPage',
        mainEntity: page.faq.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a },
        })),
      },
    ],
  }

  return (
    <main className="min-h-screen bg-zinc-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-zinc-900 mb-2">{page.h1}</h1>
        <p className="text-zinc-500 mb-8">
          No upload to server. Runs entirely in your browser — 100% private.
        </p>

        <AdUnit slot="1234567890" className="mb-6 h-24" />

        <ImageCompressorClient defaultFormat={page.defaultFormat} />

        <AdUnit slot="0987654321" className="mt-6 h-24" />

        <section className="mt-16">
          <h2 className="text-xl font-semibold text-zinc-800 mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {page.faq.map((item, i) => (
              <div key={i} className="bg-white rounded-xl p-5 border border-zinc-100">
                <h3 className="font-medium text-zinc-900 mb-2">{item.q}</h3>
                <p className="text-zinc-600 text-sm leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
