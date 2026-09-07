import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Paraphraser — Rewrite Text Free Online',
  description: 'Free AI paraphraser powered by Claude. Rewrite text in formal, casual, creative, or academic tone. 500 words/day free.',
  // Coming-soon stub — noindex until it ships real content (WS-5 audit; WS-6 follow-up).
  robots: { index: false },
}

export default function ParaphraserPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Paraphraser</h1>
        <p className="text-gray-500">Coming soon</p>
      </div>
    </main>
  )
}
