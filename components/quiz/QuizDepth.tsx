import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import type { FaqItem } from '@/lib/schema'

// ── Types ────────────────────────────────────────────────────────────────────
export interface QuizDepthTable {
  heading: string
  note?: string
  cols: string[]
  rows: string[][]
}

export interface QuizDepthRelated {
  label: string
  href: string
  desc: string
}

export interface QuizDepthResult {
  heading: string
  body: string[]
}

export interface QuizDepthContent {
  metaTitle: string
  metaDescription: string
  about?: string
  introHeading: string
  intro: string[]
  table?: QuizDepthTable
  faqHeading: string
  faqs: FaqItem[]
  relatedHeading: string
  related: QuizDepthRelated[]
  results?: Record<string, QuizDepthResult>
}

/** Quiz slugs that have a rich `quizDepth.<key>` content block in the message files. */
export const QUIZ_DEPTH_KEYS: Record<string, string> = {
  'fifa-world-cup-winners': 'fifaWorldCupWinners',
  'which-football-club-are-you': 'whichFootballClub',
  'champions-league-trivia': 'championsLeagueTrivia',
  'formula-1-trivia': 'formula1Trivia',
  'which-f1-driver-are-you': 'whichF1Driver',
  'what-is-your-love-language': 'whatIsYourLoveLanguage',
}

/** Loads the locale-correct depth content for a quiz slug, or null when the slug has none. */
export async function getQuizDepthContent(
  slug: string,
  locale: string,
): Promise<QuizDepthContent | null> {
  const key = QUIZ_DEPTH_KEYS[slug]
  if (!key) return null
  const t = await getTranslations({ locale, namespace: `quizDepth.${key}` })

  const localePrefix = locale === 'en' ? '' : `/${locale}`
  const related = (t.raw('related') as QuizDepthRelated[]).map((link) => ({
    ...link,
    href: link.href.startsWith('/') ? `${localePrefix}${link.href}` : link.href,
  }))

  const content: QuizDepthContent = {
    metaTitle: t('metaTitle'),
    metaDescription: t('metaDescription'),
    introHeading: t('introHeading'),
    intro: t.raw('intro') as string[],
    faqHeading: t('faqHeading'),
    faqs: t.raw('faqs') as FaqItem[],
    relatedHeading: t('relatedHeading'),
    related,
  }

  if (t.has('about')) content.about = t('about')
  if (t.has('table')) content.table = t.raw('table') as QuizDepthTable
  if (t.has('results')) {
    content.results = t.raw('results') as Record<string, QuizDepthResult>
  }

  return content
}

// ── Component ────────────────────────────────────────────────────────────────
interface Props {
  content: QuizDepthContent
  currentSlug: string
}

/**
 * Server-rendered SEO depth block shown below the quiz player: intro prose,
 * an optional generic data table, a topic FAQ, and a cross-link cluster.
 * No H1 here — the quiz player renders the page H1.
 */
export default function QuizDepth({ content, currentSlug }: Props) {
  const { table } = content

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

      {/* Optional data table */}
      {table && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {table.heading}
          </h2>
          <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                <tr>
                  {table.cols.map((col) => (
                    <th key={col} scope="col" className="px-4 py-2.5 font-semibold">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-gray-600 dark:text-gray-400">
                {table.rows.map((row, ri) => (
                  <tr
                    key={ri}
                    className="border-t border-gray-200 dark:border-gray-700 even:bg-gray-50/60 dark:even:bg-gray-800/40"
                  >
                    {row.map((cell, ci) =>
                      ci === 0 ? (
                        <th
                          key={ci}
                          scope="row"
                          className="px-4 py-2.5 font-medium text-gray-900 dark:text-gray-200"
                        >
                          {cell}
                        </th>
                      ) : (
                        <td key={ci} className="px-4 py-2.5 whitespace-nowrap">
                          {cell}
                        </td>
                      ),
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {table.note && (
            <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">{table.note}</p>
          )}
        </div>
      )}

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

      {/* Cross-link cluster */}
      <nav aria-label={content.relatedHeading}>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {content.relatedHeading}
        </h2>
        <ul className="grid gap-3 sm:grid-cols-3">
          {content.related.map((link) => {
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
