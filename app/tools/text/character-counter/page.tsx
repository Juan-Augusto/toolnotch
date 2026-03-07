import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Character Counter — Count Characters Online Free',
  description: 'Count characters with and without spaces instantly. Great for Twitter, SMS, meta descriptions, and more.',
}

export default function CharacterCounterPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Character Counter</h1>
        <p className="text-gray-500">Coming soon</p>
      </div>
    </main>
  )
}
