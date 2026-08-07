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

        <div className="bg-card rounded-xl border border-gray-200 p-6 mb-10 space-y-4">
          <p className="text-gray-700 leading-relaxed">
            Agile methodology is an approach to software development built around short, iterative cycles called
            sprints, typically one to four weeks long. Instead of planning a full project upfront and delivering
            everything at the end, agile teams work in focused increments, reviewing their progress at the end of
            each sprint and continuously improving how they work together. Core to this approach are regular
            ceremonies — structured meetings with a specific purpose — that keep the team aligned, surface
            problems early, and give everyone a voice in how the product evolves. The result is a working process
            that adapts to change rather than resisting it.
          </p>
          <p className="text-gray-700 leading-relaxed">
            The teams that benefit most from purpose-built agile tools are those who need to run ceremonies
            efficiently without overhead. Software development teams use retrospective boards and standup generators
            to keep their daily rhythms consistent even when working remotely across time zones. Product managers
            and scrum masters use planning poker and user story writers to produce well-formed backlog items that
            developers can pick up and implement without ambiguity. Distributed and remote teams in particular find
            that having a shared, browser-based tool — no login, no account, nothing to install — removes friction
            from ceremonies that can otherwise feel forced or disorganized when working outside a physical office.
          </p>
          <p className="text-gray-700 leading-relaxed">
            This collection covers the five most essential agile ceremony tools. The{' '}
            <strong>Retrospective Board</strong> provides the classic three-column format — Went Well, To Improve,
            and Action Items — with sticky notes, voting, and one-click Markdown export. The{' '}
            <strong>Planning Poker</strong> tool presents Fibonacci estimation cards so each team member can select
            their estimate privately before all cards are revealed simultaneously, preventing anchoring bias. The{' '}
            <strong>Standup Generator</strong> formats a standard Yesterday / Today / Blockers standup into a
            clean, ready-to-paste summary for Slack or Teams. The <strong>User Story Writer</strong> scaffolds the
            &ldquo;As a [role], I want [feature], so that [benefit]&rdquo; format with acceptance criteria so your
            stories are Jira-ready from the start. Finally, the <strong>Sprint Date Calculator</strong> takes a
            start date and sprint length and instantly generates all ceremony dates for the full sprint — planning,
            daily standups, review, and retro.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {TOOLS.map(tool => (
            <Link key={tool.href} href={tool.href}
              className="bg-card rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-violet-300 transition-all group">
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
                  className="bg-card rounded-xl border border-dashed border-gray-200 p-5 opacity-60">
                  <h2 className="font-bold text-gray-700 mb-1">{tool.label}</h2>
                  <p className="text-sm text-gray-400">{tool.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-card rounded-xl border border-gray-200 p-6 mt-4">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Why Run Agile Ceremonies Properly?</h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex gap-2">
              <span className="text-violet-500 font-bold mt-0.5">&#8226;</span>
              <span><strong>Team alignment:</strong> Regular standups and planning sessions ensure every team member knows what everyone else is working on, preventing duplicated effort and keeping the sprint goal front of mind throughout the iteration.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-violet-500 font-bold mt-0.5">&#8226;</span>
              <span><strong>Surfacing blockers early:</strong> A well-run daily standup is one of the fastest ways to identify an impediment before it silently derails progress for days. Naming a blocker out loud — even asynchronously — triggers the team to resolve it together rather than leaving one person stuck alone.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-violet-500 font-bold mt-0.5">&#8226;</span>
              <span><strong>Better sprint planning:</strong> Using planning poker and well-written user stories prevents the two most common sprint failures — overcommitment from optimistic estimates and unclear requirements that cause rework. Good ceremonies create realistic, achievable sprint goals.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-violet-500 font-bold mt-0.5">&#8226;</span>
              <span><strong>Accountability and follow-through:</strong> Retrospective action items recorded in a shared board are far more likely to be completed than verbal promises. The act of writing them down and exporting them to a project management tool creates a visible commitment the whole team can track.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-violet-500 font-bold mt-0.5">&#8226;</span>
              <span><strong>Team morale and psychological safety:</strong> A safe retrospective where every team member can voice frustrations and celebrate wins — without blame — builds the trust that high-performing teams depend on. Teams that skip retros consistently report lower morale and higher turnover over time.</span>
            </li>
          </ul>
        </div>
      </div>
    </main>
  )
}
