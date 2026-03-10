import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Crypto Portfolio Tracker — Track Your Holdings Free',
  description: 'Track your crypto and stock portfolio with live prices, P&L, and allocation charts. Free account required.',
}

export default function CryptoPortfolioTrackerPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Crypto Portfolio Tracker</h1>
        <p className="text-gray-500">Coming soon</p>
      </div>
    </main>
  )
}
