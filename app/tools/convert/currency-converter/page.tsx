import type { Metadata } from 'next'
import ToolWrapper from '@/components/ToolWrapper'
import CurrencyConverterClient from './CurrencyConverterClient'

export const metadata: Metadata = {
  title: 'Currency Converter — Live Exchange Rates | ToolNotch',
  description: 'Free live currency converter. Convert between 150+ currencies with real-time exchange rates. Rates cached for 1 hour. No sign-up required.',
}

const faqs = [
  { question: 'Where do the exchange rates come from?', answer: 'Exchange rates are fetched from open.er-api.com, a free public API. Rates are refreshed hourly.' },
  { question: 'How current are the rates?', answer: 'Rates are updated approximately every hour and cached in your browser. A warning is shown if cached rates may be stale.' },
  { question: 'How many currencies are supported?', answer: 'Over 150 currencies from around the world, including all major currencies and many emerging market currencies.' },
  { question: 'Can I use this for financial decisions?', answer: 'This tool is for reference only. For financial transactions, always use your bank or broker\'s official rates, which include fees and spreads.' },
]

export default function CurrencyConverterPage() {
  return (
    <ToolWrapper
      title="Currency Converter"
      description="Convert between 150+ currencies with live exchange rates. Rates updated hourly."
      breadcrumbLabel="Currency Converter"
      faqs={faqs}
      adSlot="1234567890"
    >
      <CurrencyConverterClient />
    </ToolWrapper>
  )
}
