import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Currency Converter — Live Exchange Rates',
  description: 'Free currency converter with live exchange rates. Convert between 150+ currencies including USD, EUR, GBP, JPY, and more.',
}

export default function CurrencyConverterPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Currency Converter</h1>
        <p className="text-gray-500">Coming soon</p>
      </div>
    </main>
  )
}
