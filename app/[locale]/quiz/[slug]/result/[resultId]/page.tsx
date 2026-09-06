import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { isTriviaQuiz } from '@/lib/quizTypes'
import { QUIZ_REGISTRY, NOINDEX_QUIZ_IDS, NOINDEX_RESULT_QUIZ_IDS } from '@/lib/quizRegistry'
import { getQuizBySlug, getQuizResultIds } from '@/lib/content/quizRepository'
import { buildJsonLd, breadcrumbSchema } from '@/lib/schema'
import { buildAlternates } from '@/lib/i18nMeta'
import { getQuizDepthContent } from '@/components/quiz/QuizDepth'

const TRIVIA_TIER_IDS = ['legend', 'expert', 'fan', 'rookie'] as const

// ── Static params ─────────────────────────────────────────────────────────────
export async function generateStaticParams() {
  const params: { locale: string; slug: string; resultId: string }[] = []
  for (const q of QUIZ_REGISTRY) {
    if (q.type === 'trivia') {
      // Trivia quizzes: generate params for each locale + each tier
      for (const locale of q.locales) {
        for (const tierId of TRIVIA_TIER_IDS) {
          params.push({ locale, slug: q.id, resultId: tierId })
        }
      }
      continue
    }
    // Personality quizzes: generate params from results in English JSON
    const resultIds = await getQuizResultIds(q.id)
    for (const resultId of resultIds) {
      for (const locale of ['en', 'pt', 'es']) {
        params.push({ locale, slug: q.id, resultId })
      }
    }
  }
  return params
}

// ── Metadata ──────────────────────────────────────────────────────────────────
export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string; resultId: string }> }): Promise<Metadata> {
  const { locale, slug, resultId } = await params
  const quiz = await getQuizBySlug(slug, locale)
  if (!quiz) return {}

  const noindexMeta = NOINDEX_QUIZ_IDS.has(slug) || NOINDEX_RESULT_QUIZ_IDS.has(slug)
    ? { robots: { index: false, follow: true } as const }
    : {}

  if (isTriviaQuiz(quiz)) {
    const tier = quiz.tiers.find(t => t.id === resultId)
    if (!tier) return {}
    return {
      title: `${tier.label} — ${quiz.title} | ToolNotch`,
      description: tier.description.slice(0, 155),
      alternates: buildAlternates(`/quiz/${slug}/result/${resultId}`),
      openGraph: {
        title: `${tier.label} — ${quiz.title}`,
        description: tier.description.slice(0, 155),
        url: `/quiz/${slug}/result/${resultId}`,
      },
      twitter: { card: 'summary_large_image' },
      ...noindexMeta,
    }
  }

  const result = quiz.results.find(r => r.id === resultId)
  if (!result) return {}
  return {
    title: `I got "${result.title}" on ${quiz.title} | ToolNotch`,
    description: result.description.slice(0, 155),
    alternates: { canonical: `/quiz/${slug}/result/${resultId}` },
    openGraph: {
      title: `I got "${result.title}" — ${quiz.title}`,
      description: result.description.slice(0, 155),
      url: `/quiz/${slug}/result/${resultId}`,
    },
    twitter: { card: 'summary_large_image' },
    ...noindexMeta,
  }
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function QuizResultPage({ params }: { params: Promise<{ locale: string; slug: string; resultId: string }> }) {
  const { locale, slug, resultId } = await params
  const quiz = await getQuizBySlug(slug, locale)
  if (!quiz) notFound()

  // ── Trivia result ────────────────────────────────────────────────────────
  if (isTriviaQuiz(quiz)) {
    const tier = quiz.tiers.find(t => t.id === resultId)
    if (!tier) notFound()

    const depth = await getQuizDepthContent(slug, locale)
    const tierDepth = depth?.results?.[resultId]

    const jsonLd = buildJsonLd(
      {
        '@type': 'Article',
        headline: `${tier.label} — ${quiz.title} Result`,
        description: tier.description.slice(0, 155),
        url: `${process.env.NEXT_PUBLIC_BASE_URL ?? 'https://toolnotch.com'}/quiz/${slug}/result/${resultId}`,
      },
      breadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Quizzes', url: '/quizzes' },
        { name: quiz.title, url: `/quiz/${slug}` },
        { name: tier.label, url: `/quiz/${slug}/result/${resultId}` },
      ]),
    )

    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <div className="max-w-2xl mx-auto px-4 py-10">
            <div className="bg-card rounded-2xl shadow-sm border border-gray-200 dark:bg-card dark:border-gray-700 p-8 mb-8">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">{quiz.title}</div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{tier.label}</h1>
              <p className="text-gray-600 leading-relaxed dark:text-gray-400 mb-6">{tier.description}</p>
              {tierDepth && (
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{tierDepth.heading}</h2>
                  <div className="space-y-4">
                    {tierDepth.body.map((paragraph, i) => (
                      <p key={i} className="text-gray-600 leading-relaxed dark:text-gray-400">{paragraph}</p>
                    ))}
                  </div>
                </div>
              )}
              <Link
                href={`/quiz/${slug}`}
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 dark:hover:bg-blue-500 transition-colors"
              >
                Take this quiz →
              </Link>
            </div>
            <div className="text-center">
              <Link href="/quizzes" className="text-sm text-blue-600 hover:underline dark:text-blue-400">
                Browse all quizzes →
              </Link>
            </div>
          </div>
        </main>
      </>
    )
  }

  // ── Personality result ───────────────────────────────────────────────────
  const result = quiz.results.find(r => r.id === resultId)
  if (!result) notFound()

  const jsonLd = buildJsonLd(
    {
      '@type': 'Article',
      headline: `${result.title} — ${quiz.title} Result`,
      description: result.description.slice(0, 155),
      url: `${process.env.NEXT_PUBLIC_BASE_URL ?? 'https://toolnotch.com'}/quiz/${slug}/result/${resultId}`,
    },
    breadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Quizzes', url: '/quizzes' },
      { name: quiz.title, url: `/quiz/${slug}` },
      { name: result.title, url: `/quiz/${slug}/result/${resultId}` },
    ]),
  )

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-2xl mx-auto px-4 py-10">
          {/* Result detail — indexable content */}
          <div className="bg-card rounded-2xl shadow-sm border border-gray-200 dark:bg-card dark:border-gray-700 p-8 mb-8">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">{quiz.title}</div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{result.title}</h1>
            <p className="text-gray-600 leading-relaxed dark:text-gray-400 mb-6">{result.description}</p>
            {result.traits.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {result.traits.map(trait => (
                  <span key={trait} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium dark:bg-purple-900/30 dark:text-purple-400">
                    {trait}
                  </span>
                ))}
              </div>
            )}
            <Link
              href={`/quiz/${slug}`}
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 dark:hover:bg-blue-500 transition-colors"
            >
              Take this quiz →
            </Link>
          </div>

          {/* Other quizzes */}
          <div className="text-center">
            <Link href="/quizzes" className="text-sm text-blue-600 hover:underline dark:text-blue-400">
              Browse all quizzes →
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
