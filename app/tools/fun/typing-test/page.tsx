import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Typing Speed Test — Check Your WPM Online Free',
  description: 'Free typing speed test. Measure your WPM and accuracy. Supports 15s, 30s, 60s, and 120s modes. Track personal bests.',
}

export default function TypingTestPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Typing Speed Test</h1>
        <p className="text-gray-500">Coming soon</p>
      </div>
    </main>
  )
}
