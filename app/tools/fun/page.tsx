import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Free Fun & Random Tools — Spin Wheel, Coin Flip, Dice Roller | ToolNotch',
  description: 'Free random decision tools: spin the wheel, random name picker, team generator, coin flip, dice roller, and more. Instant results, no signup.',
  alternates: { canonical: '/tools/fun' },
}

const TOOLS = [
  { href: '/tools/fun/spin-the-wheel', label: 'Spin the Wheel', desc: 'Custom spin wheel for random decisions. Share via URL.' },
  { href: '/tools/fun/wheel-of-names', label: 'Wheel of Names', desc: 'Free Wheel of Names alternative — no account required.' },
  { href: '/tools/fun/random-name-picker', label: 'Random Name Picker', desc: 'Pick a random winner from your list. Supports giveaways.' },
  { href: '/tools/fun/random-team-generator', label: 'Team Generator', desc: 'Split names into randomly balanced teams.' },
  { href: '/tools/fun/yes-or-no-wheel', label: 'Yes or No Wheel', desc: 'Spin the wheel for a random yes or no decision.' },
  { href: '/tools/fun/coin-flip', label: 'Coin Flip', desc: 'Virtual heads or tails coin flip with 3D animation.' },
  { href: '/tools/fun/dice-roller', label: 'Dice Roller', desc: 'Roll d6, d20, d100 or any custom dice notation.' },
  { href: '/tools/fun/random-number-generator', label: 'Random Number Generator', desc: 'Generate random numbers in any range, in batches.' },
]

export default function FunToolsHubPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Fun & Random Tools</h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            Random decision makers and generators. All free, instant, no signup required.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TOOLS.map(tool => (
            <Link key={tool.href} href={tool.href}
              className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-orange-300 transition-all group">
              <h2 className="font-bold text-gray-900 group-hover:text-orange-600 mb-1">{tool.label}</h2>
              <p className="text-sm text-gray-500">{tool.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
