import type { Metadata } from 'next'
import ToolWrapper from '@/components/ToolWrapper'
import CurrencyConverterClient from './CurrencyConverterClient'
import { buildJsonLd, webAppSchema, faqSchema, breadcrumbSchema } from '@/lib/schema'

export const metadata: Metadata = {
  title: 'Currency Converter — Live Exchange Rates | ToolNotch',
  description: 'Free live currency converter. Convert between 150+ currencies with real-time exchange rates. Rates cached for 1 hour. No sign-up required.',
  alternates: { canonical: '/tools/convert/currency-converter' },
  openGraph: { title: 'Currency Converter — Live Rates for 150+ Currencies | ToolNotch', url: '/tools/convert/currency-converter' },
}

const faqs = [
  { question: 'Where do the exchange rates come from?', answer: 'Exchange rates are fetched from open.er-api.com, a free public API. Rates are refreshed approximately every hour.' },
  { question: 'How current are the rates?', answer: 'Rates are updated approximately every hour and cached in your browser for 1 hour. A warning is shown if cached rates may be stale.' },
  { question: 'How many currencies are supported?', answer: 'Over 150 currencies from around the world, including all major currencies and many emerging market currencies.' },
  { question: 'Can I use this for financial transactions?', answer: 'This tool is for reference only. For financial transactions, always use your bank or broker\'s official rates, which include fees and spreads.' },
]

const jsonLd = buildJsonLd(
  webAppSchema('Currency Converter', '/tools/convert/currency-converter', 'Convert between 150+ currencies with live exchange rates from open.er-api.com. Rates cached for 1 hour in your browser.', 'FinanceApplication'),
  faqSchema(faqs),
  breadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Converter', url: '/tools/convert' }, { name: 'Currency Converter', url: '/tools/convert/currency-converter' }]),
)

export default function CurrencyConverterPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolWrapper
        title="Currency Converter"
        description="Convert between 150+ currencies with live exchange rates. Rates updated hourly."
        breadcrumbLabel="Currency Converter"
        faqs={faqs}
        adSlot="1234567890"
      >
        <CurrencyConverterClient />
      </ToolWrapper>
    </>
  )
}
