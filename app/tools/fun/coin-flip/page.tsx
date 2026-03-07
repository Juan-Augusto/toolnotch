import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Coin Flip — Flip a Virtual Coin Online',
  description: 'Flip a virtual coin online. Heads or tails — instant random result with a satisfying flip animation.',
}

export default function CoinFlipPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Coin Flip</h1>
        <p className="text-gray-500">Coming soon</p>
      </div>
    </main>
  )
}
