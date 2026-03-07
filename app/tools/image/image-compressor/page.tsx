import type { Metadata } from 'next'
import ImageCompressorClient from './ImageCompressorClient'
import AdUnit from '@/components/image/AdUnit'
import faqData from '@/data/faq/image-compressor.json'

export const metadata: Metadata = {
  title: 'Compress Image Online Free — No Signup Required',
  description:
    'Reduce image file size by up to 90% instantly in your browser. Supports JPG, PNG, WebP, AVIF. No upload to server — 100% private.',
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      name: 'Image Compressor',
      description:
        'Free online image compression tool. Compress JPG, PNG, WebP, AVIF instantly in your browser with no upload.',
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Any',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    },
    {
      '@type': 'FAQPage',
      mainEntity: faqData.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a },
      })),
    },
  ],
}

export default function ImageCompressorPage() {
  return (
    <main className="min-h-screen bg-zinc-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-zinc-900 mb-2">
          Compress Image Online Free
        </h1>
        <p className="text-zinc-500 mb-8">
          No upload to server. Runs entirely in your browser — 100% private.
        </p>

        <AdUnit slot="1234567890" className="mb-6 h-24" />

        <ImageCompressorClient />

        <AdUnit slot="0987654321" className="mt-6 h-24" />

        <section className="mt-16">
          <h2 className="text-xl font-semibold text-zinc-800 mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqData.map((item, i) => (
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
