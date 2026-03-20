import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { buildAlternates } from '@/lib/i18nMeta'
import Link from 'next/link'

interface Props { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'site' })
  return {
    title: 'Free Agile & Scrum Tools — Sprint Retro, Planning Poker | ToolNotch',
    description: 'Free agile ceremony tools: retrospective board, planning poker, user story writer, standup generator and more. No login, runs in your browser.',
    alternates: buildAlternates('/tools/agile'),
  }
}

const TOOLS = [
  { href: '/tools/agile/retro-board', label: 'Retrospective Board', desc: '3-column sprint retro board — Went Well, To Improve, Action Items.' },
  { href: '/tools/agile/standup-generator', label: 'Standup Generator', desc: 'Yesterday / Today / Blockers → formatted summary ready to paste.' },
  { href: '/tools/agile/planning-poker', label: 'Planning Poker', desc: 'Fibonacci card estimations — pick your card, reveal all at once.' },
  { href: '/tools/agile/user-story-writer', label: 'User Story Writer', desc: 'As a [role], I want [feature], so that [benefit] — with acceptance criteria.' },
  { href: '/tools/agile/sprint-date-calculator', label: 'Sprint Date Calculator', desc: 'Input start date + sprint length → all ceremony dates.' },
]

const COMING_SOON: { label: string; desc: string }[] = []

export default async function AgileToolsHubPage({ params }: Props) {
  await params
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Agile & Scrum Tools</h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            Free ceremony tools for sprints and agile teams. No login, no signup — everything runs in your browser.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {TOOLS.map(tool => (
            <Link key={tool.href} href={tool.href}
              className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-violet-300 transition-all group">
              <h2 className="font-bold text-gray-900 group-hover:text-violet-600 mb-1">{tool.label}</h2>
              <p className="text-sm text-gray-500">{tool.desc}</p>
            </Link>
          ))}
        </div>

        {COMING_SOON.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-500 mb-4 uppercase tracking-wide text-sm">Coming soon</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {COMING_SOON.map(tool => (
                <div key={tool.label}
                  className="bg-white rounded-xl border border-dashed border-gray-200 p-5 opacity-60">
                  <h2 className="font-bold text-gray-700 mb-1">{tool.label}</h2>
                  <p className="text-sm text-gray-400">{tool.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
