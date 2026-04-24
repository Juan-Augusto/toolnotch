import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { buildAlternates } from '@/lib/i18nMeta'
import { buildJsonLd, faqSchema, breadcrumbSchema } from '@/lib/schema'
import { MessagingSqsKafkaQuiz } from '@/components/interview/MessagingSqsKafkaQuiz'
import { getFlag } from '@/lib/featureFlags'

const PATH = '/interview/messaging-sqs-kafka'
const TITLE = 'SQS & Kafka Interview Quiz — Beginner to Advanced | ToolNotch'
const DESCRIPTION =
  'Test your SQS and Kafka knowledge with 30 in-depth interview questions across Beginner, Intermediate, and Advanced levels. Covers message queues, partitions, offsets, delivery semantics, consumer groups, exactly-once semantics, and advanced streaming patterns. Every answer explains the message flow and gives the production best practice.'

const jsonLd = buildJsonLd(
  {
    '@type': 'Quiz',
    name: 'SQS & Kafka Messaging Interview Quiz',
    description: DESCRIPTION,
    url: 'https://toolnotch.com/interview/messaging-sqs-kafka',
    educationalLevel: ['Beginner', 'Intermediate', 'Advanced'],
    about: {
      '@type': 'Thing',
      name: 'Message Queues and Event Streaming',
      description: 'The discipline of building reliable, scalable asynchronous communication between distributed services using message brokers such as Amazon SQS and Apache Kafka.',
    },
    teaches: [
      'SQS', 'Apache Kafka', 'Message Queues', 'Consumer Groups',
      'Partitions', 'Offsets', 'Dead Letter Queue', 'Visibility Timeout',
      'Exactly-Once Semantics', 'Kafka Streams', 'Transactional Outbox', 'Schema Registry',
    ],
  },
  faqSchema([
    {
      question: 'How many SQS and Kafka quiz questions are there?',
      answer: 'There are 30 questions in total — 10 Beginner, 10 Intermediate, and 10 Advanced. Each level is shuffled on every playthrough so you get a fresh experience each time.',
    },
    {
      question: 'What topics does the SQS & Kafka quiz cover?',
      answer: 'The quiz covers message queue fundamentals, the producer/consumer model, SQS Standard vs FIFO queues, at-least-once delivery, Dead Letter Queues, Apache Kafka topics and partitions, consumer groups, visibility timeout, long polling, Kafka offsets, consumer group rebalancing, ISR and replication factor, exactly-once semantics, SNS vs SQS vs EventBridge, log compaction, Kafka log segment internals, hot partitions, back-pressure, Kafka Streams vs Flink, SQS FIFO throughput limits, schema registry, consumer lag monitoring, the transactional outbox pattern, Kafka Connect, and cross-region replication.',
    },
    {
      question: 'What is the Message Flow tab?',
      answer: 'The Message Flow tab appears after you answer each question. It shows AWS CLI commands, Kafka shell commands, or annotated code snippets that demonstrate exactly what happens inside the broker or queue when the concept is applied — similar to how the TypeScript quiz shows compiled JavaScript output.',
    },
    {
      question: 'Can I use keyboard shortcuts in the quiz?',
      answer: 'Yes. Press 1–4 to select an answer, Enter or → to advance to the next question, and Tab to cycle through the explanation tabs (Why This Answer / Message Flow / Best Practice).',
    },
    {
      question: 'Is this quiz suitable for backend interview preparation?',
      answer: 'Yes. The questions are drawn from AWS documentation, the Apache Kafka documentation, and Designing Data-Intensive Applications (DDIA). They cover the depth expected in senior backend engineer and platform engineer interviews at companies that use event-driven architectures. Each answer includes a production best-practice note.',
    },
    {
      question: 'Do I need to sign up to take the quiz?',
      answer: 'No. The SQS & Kafka quiz is completely free with no account, login, or download required. Everything runs client-side in your browser.',
    },
  ]),
  breadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Interview Prep', url: '/interview' },
    { name: 'SQS & Kafka Quiz', url: PATH },
  ]),
)

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: buildAlternates(PATH),
  keywords: [
    'SQS interview questions',
    'Kafka quiz',
    'message queue interview prep',
    'Kafka partitions explained',
    'consumer group rebalancing',
    'exactly-once semantics',
    'AWS SQS vs Kafka',
    'dead letter queue explained',
    'Kafka visibility timeout',
    'Apache Kafka interview questions',
    'SQS FIFO queue',
    'Kafka consumer lag',
  ],
  openGraph: {
    title: 'SQS & Kafka Interview Quiz | ToolNotch',
    description: '30 questions — Beginner to Advanced. See message flow examples and production best practices on every answer.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SQS & Kafka Interview Quiz — 30 Questions | ToolNotch',
    description: 'Test your SQS and Kafka knowledge. Covers partitions, offsets, consumer groups, exactly-once semantics, DLQs, and more.',
  },
}

interface Props {
  params: Promise<{ locale: string }>
}

export default async function MessagingSqsKafkaQuizPage({ params }: Props) {
  const { locale } = await params
  if (!await getFlag('interview-messaging-sqs-kafka')) redirect(`/${locale}/interview`)
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <MessagingSqsKafkaQuiz />
    </>
  )
}
