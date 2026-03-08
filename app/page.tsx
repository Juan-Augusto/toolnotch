import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ToolNotch — Free Online Tools',
  description:
    'Free online tools: compress images, merge PDFs, convert units, calculate loans, generate invoices, and more. No signup, no upload, 100% private.',
}

const TOOLS = [
  {
    category: 'Image Tools',
    color: 'blue',
    items: [
      { href: '/tools/image/image-compressor', label: 'Image Compressor', desc: 'Compress JPG, PNG, WebP, AVIF' },
      { href: '/tools/image/convert-png-to-webp', label: 'Image Converter', desc: 'Convert between formats' },
    ],
  },
  {
    category: 'PDF Tools',
    color: 'red',
    items: [
      { href: '/tools/pdf/merge-pdf', label: 'Merge PDF', desc: 'Combine multiple PDFs into one' },
      { href: '/tools/pdf/split-pdf', label: 'Split PDF', desc: 'Split PDF by page range' },
      { href: '/tools/pdf/compress-pdf', label: 'Compress PDF', desc: 'Reduce PDF file size' },
      { href: '/tools/pdf/pdf-to-jpg', label: 'PDF to JPG', desc: 'Convert PDF pages to images' },
      { href: '/tools/pdf/jpg-to-pdf', label: 'JPG to PDF', desc: 'Convert images to PDF' },
    ],
  },
  {
    category: 'Converter Tools',
    color: 'indigo',
    items: [
      { href: '/tools/convert/unit-converter', label: 'Unit Converter', desc: 'Length, weight, temperature & 200+ more' },
      { href: '/tools/convert/currency-converter', label: 'Currency Converter', desc: 'Live rates for 150+ currencies' },
      { href: '/tools/convert/meters-to-feet', label: 'Meters to Feet', desc: 'Quick length conversion' },
      { href: '/tools/convert/celsius-to-fahrenheit', label: 'Celsius to Fahrenheit', desc: 'Quick temperature conversion' },
      { href: '/tools/convert/kilograms-to-pounds', label: 'Kg to Pounds', desc: 'Quick weight conversion' },
    ],
  },
  {
    category: 'Text Tools',
    color: 'purple',
    items: [
      { href: '/tools/text/word-counter', label: 'Word Counter', desc: 'Count words, characters & readability' },
      { href: '/tools/text/character-counter', label: 'Character Counter', desc: 'Count characters with/without spaces' },
      { href: '/tools/text/readability-checker', label: 'Readability Checker', desc: 'Flesch, Kincaid & Gunning Fog scores' },
      { href: '/tools/text/reading-time-calculator', label: 'Reading Time Calculator', desc: 'Estimate reading & speaking time' },
      { href: '/tools/text/word-frequency-counter', label: 'Word Frequency Counter', desc: 'Find most-used keywords in text' },
    ],
  },
  {
    category: 'Finance Tools',
    color: 'green',
    items: [
      { href: '/tools/finance/loan-calculator', label: 'Loan Calculator', desc: 'Monthly payment & amortization schedule' },
      { href: '/tools/finance/mortgage-calculator', label: 'Mortgage Calculator', desc: 'Calculate mortgage payments' },
      { href: '/tools/finance/car-loan-calculator', label: 'Car Loan Calculator', desc: 'Auto loan monthly payment' },
      { href: '/tools/finance/invoice-generator', label: 'Invoice Generator', desc: 'Free professional invoices — PDF ready' },
      { href: '/tools/finance/invoice-generator-uk', label: 'UK Invoice Generator', desc: 'GBP invoices with VAT pre-set' },
      { href: '/tools/finance/home-affordability-calculator', label: 'Home Affordability', desc: 'How much house can you afford?' },
      { href: '/tools/finance/amortization-calculator', label: 'Amortization Calculator', desc: 'Full payment schedule breakdown' },
      { href: '/tools/finance/student-loan-calculator', label: 'Student Loan Calculator', desc: 'Student loan repayment calculator' },
    ],
  },
  {
    category: 'Fun & Random',
    color: 'orange',
    items: [
      { href: '/tools/fun/spin-the-wheel', label: 'Spin the Wheel', desc: 'Random decision maker — add your options' },
      { href: '/tools/fun/random-name-picker', label: 'Random Name Picker', desc: 'Pick a winner from your list' },
      { href: '/tools/fun/random-team-generator', label: 'Team Generator', desc: 'Split names into balanced teams' },
      { href: '/tools/fun/coin-flip', label: 'Coin Flip', desc: 'Virtual heads or tails' },
      { href: '/tools/fun/dice-roller', label: 'Dice Roller', desc: 'Roll d6, d20, 3d6+5 and more' },
      { href: '/tools/fun/random-number-generator', label: 'Number Generator', desc: 'Random numbers in any range' },
      { href: '/tools/fun/yes-or-no-wheel', label: 'Yes or No Wheel', desc: 'Let the wheel decide' },
      { href: '/tools/fun/wheel-of-names', label: 'Wheel of Names', desc: 'Free Wheel of Names alternative' },
    ],
  },
  {
    category: 'Quizzes',
    color: 'pink',
    items: [
      { href: '/quizzes', label: 'All Quizzes', desc: 'Browse all personality quizzes' },
      { href: '/quiz/which-programming-language-are-you', label: 'Which Programming Language Are You?', desc: 'Python, JavaScript, Rust, Go, or Java?' },
      { href: '/quiz/am-i-introverted-or-extroverted', label: 'Introvert or Extrovert?', desc: 'Find out where you fall on the spectrum' },
      { href: '/quiz/what-career-suits-you', label: 'What Career Suits You?', desc: 'Discover your ideal career path' },
      { href: '/quiz/what-type-of-traveler-are-you', label: 'What Type of Traveler Are You?', desc: 'Adventurer, explorer, beach lover?' },
    ],
  },
]

const colorMap: Record<string, string> = {
  blue:   'bg-blue-50 border-blue-200 text-blue-700',
  red:    'bg-red-50 border-red-200 text-red-700',
  indigo: 'bg-indigo-50 border-indigo-200 text-indigo-700',
  purple: 'bg-purple-50 border-purple-200 text-purple-700',
  green:  'bg-green-50 border-green-200 text-green-700',
  orange: 'bg-orange-50 border-orange-200 text-orange-700',
  pink:   'bg-pink-50 border-pink-200 text-pink-700',
}

const badgeMap: Record<string, string> = {
  blue:   'bg-blue-100 text-blue-600',
  red:    'bg-red-100 text-red-600',
  indigo: 'bg-indigo-100 text-indigo-600',
  purple: 'bg-purple-100 text-purple-600',
  green:  'bg-green-100 text-green-600',
  orange: 'bg-orange-100 text-orange-600',
  pink:   'bg-pink-100 text-pink-600',
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-14">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">ToolNotch</h1>
          <p className="text-lg text-gray-500">
            Free online tools — no signup, no upload, 100% private
          </p>
        </div>

        <div className="space-y-10">
          {TOOLS.map((group) => (
            <section key={group.category}>
              <div className="flex items-center gap-2 mb-4">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${colorMap[group.color]}`}>
                  {group.category}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {group.items.map((tool) => (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    className="block bg-white border border-gray-200 rounded-xl p-4 hover:border-gray-300 hover:shadow-sm transition-all group"
                  >
                    <div className="flex items-start gap-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full mt-0.5 flex-shrink-0 ${badgeMap[group.color]}`}>
                        Free
                      </span>
                      <div>
                        <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors text-sm">
                          {tool.label}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">{tool.desc}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>

        <p className="text-center text-xs text-gray-400 mt-16">
          More tools coming soon
        </p>
      </div>
    </main>
  )
}
