import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { buildAlternates } from '@/lib/i18nMeta'
import { buildJsonLd, faqSchema, breadcrumbSchema } from '@/lib/schema'
import { DatabaseIndexingQuiz } from '@/components/interview/DatabaseIndexingQuiz'
import { getFlag } from '@/lib/featureFlags'

const PATH = '/interview/database-indexing'
const TITLE = 'Database Indexing Interview Quiz — Beginner to Advanced | ToolNotch'
const DESCRIPTION =
  'Test your database indexing knowledge with 30 in-depth interview questions across Beginner, Intermediate, and Advanced levels. Covers B-Tree internals, composite and covering indexes, partial indexes, VACUUM, GIN/GiST/BRIN types, and production PostgreSQL tuning. Every answer explains why it is correct, shows the EXPLAIN output or DDL, and gives the industry best practice.'

const jsonLd = buildJsonLd(
  {
    '@type': 'Quiz',
    name: 'Database Indexing Interview Quiz',
    description: DESCRIPTION,
    url: 'https://toolnotch.com/interview/database-indexing',
    educationalLevel: ['Beginner', 'Intermediate', 'Advanced'],
    about: {
      '@type': 'Thing',
      name: 'Database Indexing',
      description: 'The discipline of designing and maintaining index structures to accelerate query performance in relational databases.',
    },
    teaches: [
      'B-Tree Index', 'Hash Index', 'Composite Index', 'Covering Index',
      'Partial Index', 'Function-Based Index', 'GIN Index', 'GiST Index',
      'BRIN Index', 'VACUUM', 'MVCC', 'Bitmap Scan', 'CREATE INDEX CONCURRENTLY',
      'Index Selectivity', 'pg_stat_user_indexes',
    ],
  },
  faqSchema([
    {
      question: 'How many database indexing quiz questions are there?',
      answer: 'There are 30 questions in total — 10 Beginner, 10 Intermediate, and 10 Advanced. Each level is shuffled on every playthrough so you get a fresh experience each time.',
    },
    {
      question: 'What topics does the database indexing quiz cover?',
      answer: 'The quiz covers what an index is, the read/write cost tradeoff, primary and secondary indexes, full table scans, the EXPLAIN command, B-Tree traversal, hash vs B-Tree indexes, composite and covering indexes, partial indexes, function-based indexes, VACUUM and table bloat, GiST/GIN/BRIN index types, CREATE INDEX CONCURRENTLY, MVCC dead tuples, bitmap scans, and pg_stat_user_indexes monitoring.',
    },
    {
      question: 'Does the quiz show EXPLAIN output or SQL DDL?',
      answer: 'Yes. Most questions include a "Query Plan / DDL" tab that shows the relevant CREATE INDEX statement, EXPLAIN ANALYZE output, or SQL query that demonstrates the concept in practice — similar to how the TypeScript quiz shows compiled JavaScript output.',
    },
    {
      question: 'Is this quiz suitable for PostgreSQL interview preparation?',
      answer: 'Yes. The questions are drawn from the PostgreSQL documentation, Use The Index Luke (use-the-index-luke.com), and Designing Data-Intensive Applications (DDIA). They cover topics commonly asked in senior backend engineer and database engineer interviews.',
    },
    {
      question: 'Can I use keyboard shortcuts in the quiz?',
      answer: 'Yes. Press 1–4 to select an answer, Enter or → to advance to the next question, and Tab to cycle through the explanation tabs (Why This Answer / Query Plan / Best Practice).',
    },
    {
      question: 'Do I need to sign up to take the quiz?',
      answer: 'No. The database indexing quiz is completely free with no account, login, or download required. Everything runs client-side in your browser.',
    },
  ]),
  breadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Interview Prep', url: '/interview' },
    { name: 'Database Indexing Quiz', url: PATH },
  ]),
)

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: buildAlternates(PATH),
  keywords: [
    'database indexing interview questions',
    'database index quiz',
    'B-Tree index explained',
    'PostgreSQL index types',
    'covering index interview',
    'composite index leading column',
    'GIN GiST BRIN index',
    'CREATE INDEX CONCURRENTLY',
    'VACUUM PostgreSQL',
    'pg_stat_user_indexes',
    'backend engineer interview prep',
  ],
  openGraph: {
    title: 'Database Indexing Interview Quiz | ToolNotch',
    description: '30 questions — Beginner to Advanced. See EXPLAIN output and index DDL on every answer.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Database Indexing Interview Quiz — 30 Questions | ToolNotch',
    description: 'Test your indexing knowledge. Covers B-Tree, covering indexes, GIN/GiST/BRIN, VACUUM, and more.',
  },
}

interface Props {
  params: Promise<{ locale: string }>
}

export default async function DatabaseIndexingQuizPage({ params }: Props) {
  const { locale } = await params
  if (!await getFlag('interview-database-indexing')) redirect(`/${locale}/interview`)
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <DatabaseIndexingQuiz />
    </>
  )
}
