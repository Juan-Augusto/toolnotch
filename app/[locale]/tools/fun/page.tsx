import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { buildAlternates } from '@/lib/i18nMeta'
import Link from 'next/link'

interface Props { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'site' })
  return {
    title: 'Free Fun & Random Tools — Spin Wheel, Coin Flip, Dice Roller | ToolNotch',
    description: 'Free random decision tools: spin the wheel, random name picker, team generator, coin flip, dice roller, and more. Instant results, no signup.',
    alternates: buildAlternates('/tools/fun'),
  }
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

export default async function FunToolsHubPage({ params }: Props) {
  await params
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Fun & Random Tools</h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            Random decision makers and generators. All free, instant, no signup required.
          </p>
        </div>

        <div className="bg-card rounded-xl border border-gray-200 p-6 mb-10 space-y-4">
          <p className="text-gray-700 leading-relaxed">
            Fun and randomization tools are used by a surprisingly wide range of people in everyday situations.
            Teachers reach for a random name picker to call on students fairly without appearing to favour anyone.
            Event organizers spin a wheel to assign prizes or tasks at company team-building days. Families use a
            dice roller or coin flip to settle disputes during board game night. Content creators let a random
            number generator or spin wheel decide which topic to tackle next when they are stuck for ideas. Whether
            you need a neutral referee for a friendly argument or a quick way to add excitement to a group activity,
            random decision tools remove the awkwardness of choosing and make the result feel undeniably fair.
          </p>
          <p className="text-gray-700 leading-relaxed">
            The real value of random selection tools comes down to two things: eliminating bias and making group
            decisions enjoyable. When a human picks manually, even with the best intentions, others in the group
            can perceive favouritism. A visibly random result — a spinning wheel slowing to a stop, a coin tumbling
            through the air, a dice result appearing on screen — removes that perception entirely. It also adds a
            moment of shared anticipation that turns an ordinary decision into a small event. Giveaway organizers
            appreciate this transparency too: a random winner picked live on a stream or in front of an audience
            is far more credible than a name quietly selected off-screen.
          </p>
          <p className="text-gray-700 leading-relaxed">
            This collection brings together eight tools covering the most common randomization needs. The{' '}
            <strong>Spin the Wheel</strong> tool lets you add any custom options and generates a shareable URL so
            your wheel is ready the next time you need it. <strong>Coin Flip</strong> provides a quick heads-or-tails
            result with a 3D animation and flip history. <strong>Dice Roller</strong> supports all standard RPG dice
            plus custom notation like 3d6+5, making it ideal for D&amp;D sessions. The{' '}
            <strong>Random Name Picker</strong> lets you paste a list of names and pick winners one at a time,
            removing each picked name from the pool. The <strong>Random Number Generator</strong> can produce
            single or batch results in any range, with or without duplicates. The{' '}
            <strong>Random Team Generator</strong> fairly distributes a list of names into balanced groups in
            seconds. The <strong>Yes or No Wheel</strong> is the fastest way to break a deadlock on any binary
            decision. All tools are completely free, work instantly in your browser, and require no account or signup.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {TOOLS.map(tool => (
            <Link key={tool.href} href={tool.href}
              className="bg-card rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-orange-300 transition-all group">
              <h2 className="font-bold text-gray-900 group-hover:text-orange-600 mb-1">{tool.label}</h2>
              <p className="text-sm text-gray-500">{tool.desc}</p>
            </Link>
          ))}
        </div>

        <div className="bg-card rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Popular Uses for Randomization Tools</h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex gap-2">
              <span className="text-orange-500 font-bold mt-0.5">&#8226;</span>
              <span><strong>Classroom activities:</strong> Teachers use random name pickers and spin wheels to call on students fairly, assign reading partners, and pick teams for class projects — ensuring every student has an equal chance to participate.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-orange-500 font-bold mt-0.5">&#8226;</span>
              <span><strong>Sports team selection:</strong> Coaches and PE teachers use the team generator to split players into balanced groups quickly, removing any appearance of bias in the selection process and saving time before practice.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-orange-500 font-bold mt-0.5">&#8226;</span>
              <span><strong>Giveaways and prize draws:</strong> Brands, streamers, and event hosts use the random name picker or giveaway picker to select winners transparently from a list of entrants — the instant, unambiguous result builds trust with the audience.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-orange-500 font-bold mt-0.5">&#8226;</span>
              <span><strong>Party games and social events:</strong> Spin the wheel or the dice roller adds an element of chance to party games, drinking games, truth-or-dare prompts, and icebreaker challenges — turning a simple decision into an entertaining moment.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-orange-500 font-bold mt-0.5">&#8226;</span>
              <span><strong>Content creation decisions:</strong> Bloggers, YouTubers, and social media creators use random tools to choose their next topic from a shortlist, decide which product to review, or pick a challenge format — beating creative block with a single spin.</span>
            </li>
          </ul>
        </div>
      </div>
    </main>
  )
}
