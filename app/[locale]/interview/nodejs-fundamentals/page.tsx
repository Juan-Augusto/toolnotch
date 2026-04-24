import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { buildAlternates } from '@/lib/i18nMeta'
import { buildJsonLd, faqSchema, breadcrumbSchema } from '@/lib/schema'
import { NodejsFundamentalsQuiz } from '@/components/interview/NodejsFundamentalsQuiz'
import { getFlag } from '@/lib/featureFlags'

const PATH = '/interview/nodejs-fundamentals'
const TITLE = 'Node.js Fundamentals Interview Quiz — Beginner to Advanced | ToolNotch'
const DESCRIPTION =
  'Test your Node.js knowledge with 30 in-depth interview questions across Beginner, Intermediate, and Advanced levels. Covers the event loop, libuv phases, streams, garbage collection, V8 internals, CPU profiling, and memory leak detection. Every answer explains why it is correct, shows runtime output, and gives the production best practice.'

const jsonLd = buildJsonLd(
  {
    '@type': 'Quiz',
    name: 'Node.js Fundamentals Interview Quiz',
    description: DESCRIPTION,
    url: 'https://toolnotch.com/interview/nodejs-fundamentals',
    educationalLevel: ['Beginner', 'Intermediate', 'Advanced'],
    about: {
      '@type': 'Thing',
      name: 'Node.js',
      description: 'A JavaScript runtime built on the V8 engine with a non-blocking, event-driven architecture.',
    },
    teaches: [
      'Event Loop', 'libuv Phases', 'process.nextTick', 'setImmediate',
      'Streams', 'Backpressure', 'Cluster Module', 'Worker Threads',
      'V8 Heap', 'Garbage Collection', 'Memory Leaks', 'CPU Profiling',
      'Hidden Classes', 'PM2', '--max-old-space-size',
    ],
  },
  faqSchema([
    {
      question: 'How many Node.js quiz questions are there?',
      answer: 'There are 30 questions in total — 10 Beginner, 10 Intermediate, and 10 Advanced. Each level is shuffled on every playthrough so you get a fresh experience each time.',
    },
    {
      question: 'What topics does the Node.js quiz cover?',
      answer: 'The quiz covers the single-threaded model, require() module caching, callbacks and the error-first convention, process.env, the fs module, npm scripts, event loop phases (timers, poll, check), setImmediate vs process.nextTick, streams and backpressure, the cluster module, V8 heap structure, EventEmitter, V8 garbage collection algorithms, CPU profiling, memory leak patterns, the --max-old-space-size flag, hidden classes, and PM2.',
    },
    {
      question: 'Does the quiz show runtime output examples?',
      answer: 'Yes. Most questions include a "Runtime Output" tab that shows Node.js code snippets with their console output or execution order — so you can see exactly what the runtime produces for event loop ordering, stream behaviour, and V8 optimisations.',
    },
    {
      question: 'Is this quiz suitable for backend Node.js interview preparation?',
      answer: 'Yes. The questions are drawn from the Node.js documentation, the V8 engineering blog, and common senior backend engineer interview topics. Each answer includes a best-practice note explaining what experienced engineers do in production.',
    },
    {
      question: 'Can I use keyboard shortcuts in the quiz?',
      answer: 'Yes. Press 1–4 to select an answer, Enter or → to advance to the next question, and Tab to cycle through the explanation tabs (Why This Answer / Runtime Output / Best Practice).',
    },
    {
      question: 'Do I need to sign up to take the quiz?',
      answer: 'No. The Node.js quiz is completely free with no account, login, or download required. Everything runs client-side in your browser.',
    },
  ]),
  breadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Interview Prep', url: '/interview' },
    { name: 'Node.js Fundamentals Quiz', url: PATH },
  ]),
)

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: buildAlternates(PATH),
  keywords: [
    'Node.js interview questions',
    'Node.js fundamentals quiz',
    'event loop interview questions',
    'Node.js streams explained',
    'V8 garbage collection',
    'Node.js memory leak',
    'CPU profiling Node.js',
    'process.nextTick vs setImmediate',
    'Node.js cluster module',
    'backend engineer interview prep',
  ],
  openGraph: {
    title: 'Node.js Fundamentals Interview Quiz | ToolNotch',
    description: '30 questions — Beginner to Advanced. See runtime output and V8 internals on every answer.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Node.js Fundamentals Interview Quiz — 30 Questions | ToolNotch',
    description: 'Test your Node.js knowledge. Covers the event loop, streams, V8 GC, memory leaks, and more.',
  },
}

interface Props {
  params: Promise<{ locale: string }>
}

export default async function NodejsFundamentalsQuizPage({ params }: Props) {
  const { locale } = await params
  if (!await getFlag('interview-nodejs-fundamentals')) redirect(`/${locale}/interview`)
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <NodejsFundamentalsQuiz />
    </>
  )
}
