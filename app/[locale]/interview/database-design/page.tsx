import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { buildAlternates } from '@/lib/i18nMeta'
import { buildJsonLd, faqSchema, breadcrumbSchema } from '@/lib/schema'
import { DatabaseDesignQuiz } from '@/components/interview/DatabaseDesignQuiz'
import { getFlag } from '@/lib/featureFlags'

const PATH = '/interview/database-design'
const TITLE = 'Database Design Interview Quiz — Beginner to Advanced | ToolNotch'
const DESCRIPTION =
  'Test your database design knowledge with 30 in-depth interview questions across Beginner, Intermediate, and Advanced levels. Covers normalization, ACID, CAP theorem, sharding, CQRS, Event Sourcing, and distributed transaction patterns. Every answer explains why it is correct, shows the DDL or query plan impact, and gives the industry best practice.'

const jsonLd = buildJsonLd(
  {
    '@type': 'Quiz',
    name: 'Database Design Interview Quiz',
    description: DESCRIPTION,
    url: 'https://toolnotch.com/interview/database-design',
    educationalLevel: ['Beginner', 'Intermediate', 'Advanced'],
    about: {
      '@type': 'Thing',
      name: 'Database Design',
      description: 'The discipline of structuring data for correctness, performance, and scalability in relational and distributed databases.',
    },
    teaches: [
      'Primary Keys', 'Foreign Keys', 'Normalization', 'ACID Properties',
      'CAP Theorem', 'Transaction Isolation Levels', 'Sharding', 'Replication',
      'Event Sourcing', 'CQRS', 'Saga Pattern', 'Optimistic Locking', 'Two-Phase Commit',
    ],
  },
  faqSchema([
    {
      question: 'How many database design quiz questions are there?',
      answer: 'There are 30 questions in total — 10 Beginner, 10 Intermediate, and 10 Advanced. Each level is shuffled on every playthrough so you get a fresh experience each time.',
    },
    {
      question: 'What topics does the database design quiz cover?',
      answer: 'The quiz covers primary and foreign keys, normalization (1NF, 2NF, 3NF), ACID properties, NULL semantics, the CAP theorem, transaction isolation levels, sharding strategies, synchronous vs asynchronous replication, Event Sourcing, CQRS, optimistic vs pessimistic locking, Two-Phase Commit, and the Saga pattern.',
    },
    {
      question: 'Does the quiz show SQL or DDL examples?',
      answer: 'Yes. Most questions include a "Query Plan / DDL" tab that shows the relevant CREATE TABLE, ALTER TABLE, or SQL query that demonstrates the concept in practice — similar to how the TypeScript quiz shows compiled JavaScript output.',
    },
    {
      question: 'Is this quiz suitable for backend interview preparation?',
      answer: 'Yes. The questions are drawn from PostgreSQL documentation, Designing Data-Intensive Applications (DDIA), and common senior backend engineer interview topics. Each answer includes a best-practice note explaining what experienced engineers do in production.',
    },
    {
      question: 'Can I use keyboard shortcuts in the quiz?',
      answer: 'Yes. Press 1–4 to select an answer, Enter or → to advance to the next question, and Tab to cycle through the explanation tabs (Why This Answer / Query Plan / Best Practice).',
    },
    {
      question: 'Do I need to sign up to take the quiz?',
      answer: 'No. The database design quiz is completely free with no account, login, or download required. Everything runs client-side in your browser.',
    },
  ]),
  breadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Interview Prep', url: '/interview' },
    { name: 'Database Design Quiz', url: PATH },
  ]),
)

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: buildAlternates(PATH),
  keywords: [
    'database design interview questions',
    'database design quiz',
    'SQL interview prep',
    'normalization quiz',
    'CAP theorem explained',
    'ACID properties quiz',
    'sharding vs partitioning',
    'CQRS event sourcing',
    'saga pattern interview',
    'PostgreSQL interview questions',
    'backend engineer interview prep',
  ],
  openGraph: {
    title: 'Database Design Interview Quiz | ToolNotch',
    description: '30 questions — Beginner to Advanced. See DDL/SQL examples and industry best practices on every answer.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Database Design Interview Quiz — 30 Questions | ToolNotch',
    description: 'Test your database design knowledge. Covers normalization, CAP theorem, sharding, CQRS, Saga, and more.',
  },
}

interface Props {
  params: Promise<{ locale: string }>
}

export default async function DatabaseDesignQuizPage({ params }: Props) {
  const { locale } = await params
  if (!await getFlag('interview-database-design')) redirect(`/${locale}/interview`)
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <DatabaseDesignQuiz />
    </>
  )
}
