import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Unit & Currency Converter — ToolNotch',
  description: 'Convert between 200+ units and 150+ currencies. Length, weight, temperature, area, volume, speed, and more. Free online converter.',
}

export default function ConvertHubPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Unit &amp; Currency Converter</h1>
        <p className="text-gray-500">Coming soon</p>
      </div>
    </main>
  )
}
