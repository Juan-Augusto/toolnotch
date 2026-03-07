import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Word Counter — Count Words, Characters & Readability',
  description: 'Free online word counter. Count words, characters, sentences, and get Flesch readability scores in real time. No sign-up required.',
}

export default function WordCounterPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Word Counter</h1>
        <p className="text-gray-500">Coming soon</p>
      </div>
    </main>
  )
}
