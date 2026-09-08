import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { locales } from '@/i18n'
import { isTriviaQuiz } from '@/lib/quizTypes'
import { QUIZ_REGISTRY, NOINDEX_QUIZ_IDS } from '@/lib/quizRegistry'
import { getQuizBySlug } from '@/lib/content/quizRepository'
import { buildAlternates } from '@/lib/i18nMeta'
import {
  buildJsonLd,
  breadcrumbSchema,
  faqSchema,
  buildLocalizedUrl,
} from '@/lib/schema'
import AppQuiz from '@/components/quiz/AppQuiz'
import AppQuizDepth, { getQuizDepthContent } from '@/components/quiz/AppQuizDepth'
import AppRelatedQuizzes from '@/components/quiz/AppRelatedQuizzes'

// ── Static params ─────────────────────────────────────────────────────────────
export function generateStaticParams() {
  return QUIZ_REGISTRY.flatMap(q =>
    locales.map(locale => ({ locale, slug: q.id }))
  )
}

// ── Metadata ──────────────────────────────────────────────────────────────────
export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params
  const quiz = await getQuizBySlug(slug, locale)
  if (!quiz) return {}

  const depth = await getQuizDepthContent(slug, locale)
  const title = depth ? `${depth.metaTitle} | ToolNotch` : `${quiz.title} | ToolNotch`
  const description = depth ? depth.metaDescription : quiz.description

  return {
    title,
    description,
    alternates: buildAlternates(`/quiz/${slug}`),
    openGraph: { title, description },
    ...(NOINDEX_QUIZ_IDS.has(slug) ? { robots: { index: false, follow: true } } : {}),
  }
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function QuizPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params
  const quiz = await getQuizBySlug(slug, locale)
  if (!quiz) notFound()

  const depth = await getQuizDepthContent(slug, locale)

  // Every quiz page carries exactly one primary entity (`Quiz`) + a
  // `BreadcrumbList`; the WS-3 depth pages add a topic `FAQPage` on top.
  const breadcrumb = breadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Quizzes', url: '/quizzes' },
    { name: quiz.title, url: `/quiz/${slug}` },
  ])
  const quizEntity = {
    '@type': 'Quiz' as const,
    name: quiz.title,
    url: buildLocalizedUrl(`/quiz/${slug}`, locale),
    description: depth ? depth.metaDescription : quiz.description,
    educationalUse: 'Assessment',
    ...(depth?.about ? { about: { '@type': 'Thing', name: depth.about } } : {}),
  }
  const jsonLd = depth
    ? buildJsonLd(quizEntity, faqSchema(depth.faqs), breadcrumb)
    : buildJsonLd(quizEntity, breadcrumb)

  return (
    <main className="min-h-screen bg-background text-foreground pb-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 md:py-16">
        <AppQuiz quiz={quiz} locale={locale} />
      </div>

      {depth && <AppQuizDepth content={depth} currentSlug={slug} />}
      {!depth && <AppRelatedQuizzes slug={slug} locale={locale} />}
    </main>
  )
}
