import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Free Text Tools — Word Counter, Readability Checker & More | ToolNotch',
  description: 'Free online text tools: word counter, character counter, readability checker, reading time calculator, and keyword density checker. No signup required.',
  alternates: { canonical: '/tools/text' },
}

const TOOLS = [
  { href: '/tools/text/word-counter', label: 'Word Counter', desc: 'Count words, characters, sentences, and check readability in real time.' },
  { href: '/tools/text/character-counter', label: 'Character Counter', desc: 'Count characters with and without spaces. Great for Twitter, SMS, and meta descriptions.' },
  { href: '/tools/text/sentence-counter', label: 'Sentence Counter', desc: 'Count sentences and paragraphs in any text.' },
  { href: '/tools/text/readability-checker', label: 'Readability Checker', desc: 'Get Flesch Reading Ease, Flesch-Kincaid Grade, and Gunning Fog scores.' },
  { href: '/tools/text/reading-time-calculator', label: 'Reading Time Calculator', desc: 'Estimate how long it takes to read or speak your text.' },
  { href: '/tools/text/word-frequency-counter', label: 'Word Frequency Counter', desc: 'Find the most frequently used keywords in your text.' },
]

export default function TextToolsHubPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Free Text Tools</h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            Analyze and improve your writing. All tools work in your browser — your text never leaves your device.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TOOLS.map(tool => (
            <Link
              key={tool.href}
              href={tool.href}
              className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-purple-300 transition-all group"
            >
              <h2 className="font-bold text-gray-900 group-hover:text-purple-600 mb-1">{tool.label}</h2>
              <p className="text-sm text-gray-500">{tool.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
