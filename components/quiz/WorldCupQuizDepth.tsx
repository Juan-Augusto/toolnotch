import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import type { FaqItem } from '@/lib/schema'

// ── Types ────────────────────────────────────────────────────────────────────
interface WinnerRow {
  year: string
  host: string
  winner: string
  runnerUp: string
  score: string
}

interface RelatedLink {
  label: string
  href: string
  desc: string
}

export interface QuizDepthContent {
  metaTitle: string
  metaDescription: string
  introHeading: string
  intro: string[]
  tableHeading: string
  tableNote: string
  tableCols: { year: string; host: string; winner: string; runnerUp: string; score: string }
  rows: WinnerRow[]
  faqHeading: string
  faqs: FaqItem[]
  relatedHeading: string
  related: { worldCup: RelatedLink; footballClub: RelatedLink; championsLeague: RelatedLink }
}

/** Quiz slugs that have a rich `quizDepth.<key>` content block in the message files. */
export const QUIZ_DEPTH_KEYS: Record<string, string> = {
  'fifa-world-cup-winners': 'fifaWorldCupWinners',
}

/** Loads the locale-correct depth content for a quiz slug, or null when the slug has none. */
export async function getQuizDepthContent(
  slug: string,
  locale: string,
): Promise<QuizDepthContent | null> {
  const key = QUIZ_DEPTH_KEYS[slug]
  if (!key) return null
  const t = await getTranslations({ locale, namespace: `quizDepth.${key}` })
  return {
    metaTitle: t('metaTitle'),
    metaDescription: t('metaDescription'),
    introHeading: t('introHeading'),
    intro: t.raw('intro') as string[],
    tableHeading: t('tableHeading'),
    tableNote: t('tableNote'),
    tableCols: t.raw('tableCols') as QuizDepthContent['tableCols'],
    rows: t.raw('rows') as WinnerRow[],
    faqHeading: t('faqHeading'),
    faqs: t.raw('faqs') as FaqItem[],
    relatedHeading: t('relatedHeading'),
    related: t.raw('related') as QuizDepthContent['related'],
  }
}

// ── Component ────────────────────────────────────────────────────────────────
interface Props {
  content: QuizDepthContent
  currentSlug: string
}

/**
 * Server-rendered SEO depth block shown below the quiz player: intro prose,
 * a winners-by-year table, a topic FAQ, and a football cross-link cluster.
 * No H1 here — the quiz player renders the page H1.
 */
export default function WorldCupQuizDepth({ content, currentSlug }: Props) {
  const relatedLinks = [
    content.related.worldCup,
    content.related.footballClub,
    content.related.championsLeague,
  ]

  return (
    <section className="max-w-2xl mx-auto px-4 pb-14 space-y-12">
      {/* Intro */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {content.introHeading}
        </h2>
        <div className="space-y-4">
          {content.intro.map((paragraph, i) => (
            <p key={i} className="text-gray-600 leading-relaxed dark:text-gray-400">
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      {/* Winners-by-year table */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {content.tableHeading}
        </h2>
        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
              <tr>
                <th scope="col" className="px-4 py-2.5 font-semibold">{content.tableCols.year}</th>
                <th scope="col" className="px-4 py-2.5 font-semibold">{content.tableCols.host}</th>
                <th scope="col" className="px-4 py-2.5 font-semibold">{content.tableCols.winner}</th>
                <th scope="col" className="px-4 py-2.5 font-semibold">{content.tableCols.runnerUp}</th>
                <th scope="col" className="px-4 py-2.5 font-semibold">{content.tableCols.score}</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 dark:text-gray-400">
              {content.rows.map((row) => (
                <tr
                  key={row.year}
                  className="border-t border-gray-200 dark:border-gray-700 even:bg-gray-50/60 dark:even:bg-gray-800/40"
                >
                  <th scope="row" className="px-4 py-2.5 font-medium text-gray-900 dark:text-gray-200">
                    {row.year}
                  </th>
                  <td className="px-4 py-2.5">{row.host}</td>
                  <td className="px-4 py-2.5 font-medium text-gray-900 dark:text-gray-200">{row.winner}</td>
                  <td className="px-4 py-2.5">{row.runnerUp}</td>
                  <td className="px-4 py-2.5 whitespace-nowrap">{row.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">{content.tableNote}</p>
      </div>

      {/* Topic FAQ */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {content.faqHeading}
        </h2>
        <div className="space-y-2">
          {content.faqs.map((faq, i) => (
            <details
              key={i}
              className="group rounded-xl border border-gray-200 bg-card px-5 py-3.5 dark:border-gray-700 dark:bg-card"
            >
              <summary className="cursor-pointer list-none font-medium text-sm text-gray-900 marker:content-none dark:text-white">
                {faq.question}
              </summary>
              <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>

      {/* Football cross-link cluster */}
      <nav aria-label={content.relatedHeading}>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {content.relatedHeading}
        </h2>
        <ul className="grid gap-3 sm:grid-cols-3">
          {relatedLinks.map((link) => {
            const isCurrent = link.href.endsWith(`/${currentSlug}`)
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={isCurrent ? 'page' : undefined}
                  className={`flex h-full flex-col rounded-xl border p-4 transition-colors ${
                    isCurrent
                      ? 'border-blue-300 bg-blue-50/60 dark:border-blue-700 dark:bg-blue-900/20'
                      : 'border-gray-200 bg-card hover:border-blue-300 hover:bg-blue-50/40 dark:border-gray-700 dark:bg-card dark:hover:border-blue-600'
                  }`}
                >
                  <span className="font-semibold text-sm text-gray-900 dark:text-white">
                    {link.label}
                  </span>
                  <span className="mt-1 text-xs text-gray-500 dark:text-gray-400">{link.desc}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </section>
  )
}
