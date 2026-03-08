import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Quiz } from '@/lib/quizTypes'
import QuizPlayer from '@/components/quiz/QuizPlayer'
import careerQuizRaw from '@/data/quizzes/what-career-suits-you.json'
import programmingQuizRaw from '@/data/quizzes/which-programming-language-are-you.json'
import introvertQuizRaw from '@/data/quizzes/am-i-introverted-or-extroverted.json'
import travelerQuizRaw from '@/data/quizzes/what-type-of-traveler-are-you.json'
import decadeQuizRaw from '@/data/quizzes/which-decade-do-you-belong-in.json'
import { buildJsonLd, breadcrumbSchema } from '@/lib/schema'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ALL_QUIZZES = [careerQuizRaw, programmingQuizRaw, introvertQuizRaw, travelerQuizRaw, decadeQuizRaw] as any[] as Quiz[]

export function generateStaticParams() {
  return ALL_QUIZZES.flatMap(quiz =>
    quiz.results.map(result => ({ slug: quiz.id, resultId: result.id }))
  )
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; resultId: string }> }): Promise<Metadata> {
  const { slug, resultId } = await params
  const quiz = ALL_QUIZZES.find(q => q.id === slug)
  if (!quiz) return {}
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
  }
}

export default async function QuizResultPage({ params }: { params: Promise<{ slug: string; resultId: string }> }) {
  const { slug, resultId } = await params
  const quiz = ALL_QUIZZES.find(q => q.id === slug)
  if (!quiz) notFound()
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
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 py-10">
          {/* Result detail — indexable content */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
            <div className="text-sm text-gray-500 mb-1">{quiz.title}</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{result.title}</h1>
            <p className="text-gray-600 leading-relaxed mb-6">{result.description}</p>
            {result.traits.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {result.traits.map(trait => (
                  <span key={trait} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                    {trait}
                  </span>
                ))}
              </div>
            )}
            <Link
              href={`/quiz/${slug}`}
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              Take this quiz →
            </Link>
          </div>

          {/* Other quizzes */}
          <div className="text-center">
            <Link href="/quizzes" className="text-sm text-blue-600 hover:underline">
              Browse all personality quizzes →
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
