import type { Metadata } from 'next'
import Link from 'next/link'
import { CATEGORY_LABELS } from '@/data/units'
import { COMMON_PAIRS } from '@/data/conversionPairs'

export const metadata: Metadata = {
  title: 'Unit & Currency Converter Hub | ToolNotch',
  description: 'Convert between 200+ units and 150+ currencies. Length, weight, temperature, area, volume, speed, digital storage, pressure, and live exchange rates.',
}

const CATEGORIES = Object.entries(CATEGORY_LABELS).concat([['currency', 'Currency']])

const FEATURED_PAIRS = COMMON_PAIRS.slice(0, 12)

export default function ConvertHubPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Unit & Currency Converter</h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            Convert between 200+ units and 150+ currencies. Fast, accurate, and free.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-10">
          {CATEGORIES.map(([key, label]) => (
            <Link
              key={key}
              href={key === 'currency' ? '/tools/convert/currency-converter' : `/tools/convert/unit-converter`}
              className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:shadow-md hover:border-blue-300 transition-all group"
            >
              <div className="font-semibold text-gray-800 text-sm group-hover:text-blue-600">{label}</div>
            </Link>
          ))}
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-4">Popular Conversions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {FEATURED_PAIRS.map(pair => (
            <Link
              key={pair.slug}
              href={`/tools/convert/${pair.slug}`}
              className="bg-white border border-gray-200 rounded-lg px-4 py-3 hover:border-blue-300 hover:shadow-sm transition-all text-sm text-gray-700 hover:text-blue-600"
            >
              {pair.title} →
            </Link>
          ))}
        </div>

        <div className="mt-8 flex gap-4 justify-center">
          <Link href="/tools/convert/unit-converter" className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            Unit Converter
          </Link>
          <Link href="/tools/convert/currency-converter" className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors">
            Currency Converter
          </Link>
        </div>
      </div>
    </main>
  )
}
