import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Text Summarizer — Summarize Any Article Free',
  description: 'Free AI summarizer. Paste any article, essay, or document and get a concise summary in seconds. Powered by Claude.',
  // Coming-soon stub — noindex until it ships real content (WS-5 audit; WS-6 follow-up).
  robots: { index: false },
}

export default function SummarizerPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Summarizer</h1>
        <p className="text-gray-500">Coming soon</p>
      </div>
    </main>
  )
}
