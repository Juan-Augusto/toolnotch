import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Loan Calculator — Monthly Payment & Amortization',
  description: 'Free loan calculator. Calculate monthly payments, total interest, and see a full amortization schedule for any loan.',
}

export default function LoanCalculatorPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Loan Calculator</h1>
        <p className="text-gray-500">Coming soon</p>
      </div>
    </main>
  )
}
