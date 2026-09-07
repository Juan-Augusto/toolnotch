import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Plagiarism Checker — Free Online Plagiarism Detection',
  description: 'Check your text for plagiarism against the web for free. Highlights matching sources with similarity scores.',
  // Coming-soon stub — noindex until it ships real content (WS-5 audit; WS-6 follow-up).
  robots: { index: false },
}

export default function PlagiarismCheckerPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Plagiarism Checker</h1>
        <p className="text-gray-500">Coming soon</p>
      </div>
    </main>
  )
}
