import type { Metadata } from 'next'
import { buildAlternates } from '@/lib/i18nMeta'
import { buildJsonLd, faqSchema, breadcrumbSchema } from '@/lib/schema'
import { TypeScriptQuiz } from '@/components/interview/TypeScriptQuiz'

const PATH = '/interview/typescript'
const TITLE = 'TypeScript Interview Quiz — Beginner to Advanced | ToolNotch'
const DESCRIPTION =
  'Test your TypeScript knowledge with 30 in-depth interview questions across Beginner, Intermediate, and Advanced levels. Every answer explains why it is correct, what TypeScript compiles to in JavaScript, and the industry best practice.'

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
  faqSchema([
    {
      question: 'How many TypeScript quiz questions are there?',
      answer: 'There are 30 questions in total — 10 Beginner, 10 Intermediate, and 10 Advanced. Each level is shuffled on every playthrough so you get a fresh order each time.',
    },
    {
      question: 'What topics does the TypeScript quiz cover?',
      answer: 'The quiz covers type inference, any vs unknown, interfaces vs type aliases, optional properties, generics, keyof and indexed access types, mapped types, conditional types, the infer keyword, discriminated unions, template literal types, variadic tuples, satisfies, NoInfer, const type parameters, and module augmentation.',
    },
    {
      question: 'Does the quiz show compiled JavaScript output?',
      answer: 'Yes. Every question includes a "Compiled JS" tab that shows exactly what TypeScript emits after erasing all type annotations. This helps you understand which TypeScript constructs have runtime cost and which are purely compile-time.',
    },
    {
      question: 'Is this quiz suitable for TypeScript interview preparation?',
      answer: 'Yes. The questions are drawn from the official TypeScript Handbook and common senior engineer interview topics. Each answer includes an industry best-practice note so you not only learn the correct answer but also how professional teams apply it.',
    },
    {
      question: 'Can I use keyboard shortcuts in the quiz?',
      answer: 'Yes. Press 1–4 to select an option, Enter or → to advance to the next question, and Tab to cycle through the explanation tabs (Why This Answer / Compiled JS / Best Practice).',
    },
    {
      question: 'Do I need to create an account to take the quiz?',
      answer: 'No. The TypeScript quiz is completely free with no account, login, or download required. Everything runs client-side in your browser.',
    },
  ]),
  breadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Interview Prep', url: '/interview' },
    { name: 'TypeScript Quiz', url: PATH },
  ]),
)

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
  await params
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TypeScriptQuiz />
    </>
  )
}
