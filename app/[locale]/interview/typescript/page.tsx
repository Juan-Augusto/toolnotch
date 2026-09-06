import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { buildAlternates } from '@/lib/i18nMeta'
import { buildJsonLd, faqSchema, breadcrumbSchema, type FaqItem } from '@/lib/schema'
import { TypeScriptQuiz } from '@/components/interview/TypeScriptQuiz'
import InterviewDepth from '@/components/interview/InterviewDepth'

const PATH = '/interview/typescript'
const TITLE = 'TypeScript Interview Quiz — Beginner to Advanced | ToolNotch'
const DESCRIPTION =
  'Test your TypeScript knowledge with 30 in-depth interview questions across Beginner, Intermediate, and Advanced levels. Every answer explains why it is correct, what TypeScript compiles to in JavaScript, and the industry best practice.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: buildAlternates(PATH),
  keywords: [
    'TypeScript interview questions',
    'TypeScript quiz',
    'TypeScript interview prep',
    'TypeScript generics quiz',
    'TypeScript conditional types',
    'TypeScript mapped types',
    'TypeScript type system',
    'TypeScript beginner to advanced',
    'TypeScript compiled JavaScript',
    'TypeScript best practices',
  ],
  openGraph: {
    title: 'TypeScript Deep-Dive Interview Quiz | ToolNotch',
    description: '30 questions — Beginner to Advanced. See compiled JS output and industry best practices on every answer.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TypeScript Interview Quiz — 30 Questions | ToolNotch',
    description: 'Test your TypeScript knowledge. Covers generics, conditional types, mapped types, satisfies, NoInfer and more.',
  },
}

interface Props {
  params: Promise<{ locale: string }>
}

export default async function TypeScriptQuizPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'interview.typescript' })

  const depthFaqs = t.raw('faqs') as FaqItem[]
  const depthSections = [
    { heading: t('coversHeading'), body: t.raw('covers') as string[] },
    { heading: t('levelsHeading'), body: t.raw('levels') as string[] },
  ]
  const depthLists = [
    { heading: t('topicsHeading'), items: t.raw('topics') as string[] },
    { heading: t('howHeading'), ordered: true, items: t.raw('how') as string[] },
  ]

  const jsonLd = buildJsonLd(
    {
      '@type': 'Quiz',
      name: 'TypeScript Deep-Dive Interview Quiz',
      description: DESCRIPTION,
      url: 'https://toolnotch.com/interview/typescript',
      educationalLevel: ['Beginner', 'Intermediate', 'Advanced'],
      about: {
        '@type': 'Thing',
        name: 'TypeScript',
        description: 'A strongly typed programming language that builds on JavaScript.',
      },
      teaches: [
        'Type Inference', 'Generics', 'Conditional Types', 'Mapped Types',
        'Discriminated Unions', 'Template Literal Types', 'Type Predicates',
        'Variadic Tuples', 'infer keyword', 'satisfies operator',
      ],
    },
    faqSchema(depthFaqs),
    breadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Interview Prep', url: '/interview' },
      { name: 'TypeScript Quiz', url: PATH },
    ]),
  )

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TypeScriptQuiz />
      <InterviewDepth
        sections={depthSections}
        lists={depthLists}
        faqHeading={t('faqHeading')}
        faqs={depthFaqs}
      />
    </>
  )
}
