import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mortgage Calculator — Monthly Payment Estimator',
  description: 'Free mortgage calculator. Estimate your monthly mortgage payment, total interest paid, and full amortization schedule.',
}

export default function MortgageCalculatorPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mortgage Calculator</h1>
        <p className="text-gray-500">Coming soon</p>
      </div>
    </main>
  )
}
