import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Unit Converter — Convert Length, Weight, Temperature & More',
  description: 'Free online unit converter. Convert meters to feet, kg to lbs, Celsius to Fahrenheit, and 200+ more unit pairs instantly.',
}

export default function UnitConverterPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Unit Converter</h1>
        <p className="text-gray-500">Coming soon</p>
      </div>
    </main>
  )
}
