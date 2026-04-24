import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { buildAlternates } from '@/lib/i18nMeta'
import { buildJsonLd, faqSchema, breadcrumbSchema } from '@/lib/schema'
import { RabbitMQConceptsQuiz } from '@/components/interview/RabbitMQConceptsQuiz'
import { getFlag } from '@/lib/featureFlags'

const PATH = '/interview/rabbitmq-concepts'
const TITLE = 'RabbitMQ Interview Quiz — Beginner to Advanced | ToolNotch'
const DESCRIPTION =
  'Test your RabbitMQ knowledge with 30 in-depth interview questions across Beginner, Intermediate, and Advanced levels. Covers AMQP exchange types, routing keys, binding keys, quorum queues, clustering, Raft consensus, and production monitoring. Every answer explains the broker behaviour and gives the production best practice.'

const jsonLd = buildJsonLd(
  {
    '@type': 'Quiz',
    name: 'RabbitMQ Concepts Interview Quiz',
    description: DESCRIPTION,
    url: 'https://toolnotch.com/interview/rabbitmq-concepts',
    educationalLevel: ['Beginner', 'Intermediate', 'Advanced'],
    about: {
      '@type': 'Thing',
      name: 'RabbitMQ',
      description: 'An open-source AMQP message broker used for asynchronous messaging, event-driven architectures, and distributed task queues.',
    },
    teaches: [
      'AMQP Protocol', 'Direct Exchange', 'Fanout Exchange', 'Topic Exchange',
      'Headers Exchange', 'Routing Keys', 'Binding Keys', 'Quorum Queues',
      'Dead Letter Exchange', 'Publisher Confirms', 'RabbitMQ Clustering', 'Raft Consensus',
    ],
  },
  faqSchema([
    {
      question: 'How many RabbitMQ quiz questions are there?',
      answer: 'There are 30 questions in total — 10 Beginner, 10 Intermediate, and 10 Advanced. Each level is shuffled on every playthrough so you get a fresh experience each time.',
    },
    {
      question: 'What topics does the RabbitMQ quiz cover?',
      answer: 'The quiz covers the full RabbitMQ knowledge stack: AMQP 0-9-1 basics (exchanges, queues, bindings, acknowledgements, prefetch), exchange types (direct, fanout, topic, headers), the difference between routing keys and binding keys, dead letter exchanges, message TTL, publisher confirms, the Shovel and Federation plugins, quorum queues with Raft consensus, cluster disc vs RAM nodes, consistent hash exchange, channel multiplexing, flow control, lazy queues, and key production monitoring metrics.',
    },
    {
      question: 'What is the Broker Behaviour tab?',
      answer: 'After answering each question, the "Broker Behaviour" tab shows what RabbitMQ actually does for that concept — management CLI output, rabbitmqadmin commands, HTTP API calls, AMQP frame diagrams, or annotated configuration snippets. It is the equivalent of seeing compiled JavaScript output in a TypeScript quiz, but for the RabbitMQ broker.',
    },
    {
      question: 'Can I use keyboard shortcuts in the quiz?',
      answer: 'Yes. Press 1–4 to select an answer, Enter or → to advance to the next question, and Tab to cycle through the explanation tabs (Why This Answer / Broker Behaviour / Best Practice).',
    },
    {
      question: 'Is this quiz suitable for backend interview preparation?',
      answer: 'Yes. The questions are drawn from the official RabbitMQ documentation, the AMQP 0-9-1 specification, and common senior backend engineer interview topics. Each answer includes a best-practice note explaining what experienced engineers do in production environments.',
    },
    {
      question: 'Do I need to sign up to take the quiz?',
      answer: 'No. The RabbitMQ quiz is completely free with no account, login, or download required. Everything runs client-side in your browser.',
    },
  ]),
  breadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Interview Prep', url: '/interview' },
    { name: 'RabbitMQ Quiz', url: PATH },
  ]),
)

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: buildAlternates(PATH),
  keywords: [
    'RabbitMQ interview questions',
    'AMQP quiz',
    'exchange types quiz',
    'RabbitMQ routing key',
    'quorum queues explained',
    'RabbitMQ clustering',
    'backend interview prep',
    'RabbitMQ dead letter exchange',
    'publisher confirms RabbitMQ',
    'AMQP 0-9-1 tutorial',
    'RabbitMQ Raft consensus',
    'message broker interview questions',
  ],
  openGraph: {
    title: 'RabbitMQ Interview Quiz | ToolNotch',
    description: '30 questions — Beginner to Advanced. See broker behaviour and production best practices on every answer.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RabbitMQ Interview Quiz — 30 Questions | ToolNotch',
    description: 'Test your RabbitMQ knowledge. Covers AMQP exchange types, quorum queues, Raft consensus, clustering, and production monitoring.',
  },
}

interface Props {
  params: Promise<{ locale: string }>
}

export default async function RabbitMQConceptsQuizPage({ params }: Props) {
  const { locale } = await params
  if (!await getFlag('interview-rabbitmq-concepts')) redirect(`/${locale}/interview`)
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <RabbitMQConceptsQuiz />
    </>
  )
}
