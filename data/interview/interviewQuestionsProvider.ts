import type { InterviewQuestion } from '@/lib/interviewTypes'

import { TYPESCRIPT_QUESTIONS } from './typescript-questions'
import { TYPESCRIPT_QUESTIONS_PT } from './typescript-questions-pt'
import { TYPESCRIPT_QUESTIONS_ES } from './typescript-questions-es'

import { VUE_QUESTIONS } from './vue-questions'
import { VUE_QUESTIONS_PT } from './vue-questions-pt'
import { VUE_QUESTIONS_ES } from './vue-questions-es'

import { DATABASE_DESIGN_QUESTIONS } from './database-design-questions'
import { DATABASE_DESIGN_QUESTIONS_PT } from './database-design-questions-pt'
import { DATABASE_DESIGN_QUESTIONS_ES } from './database-design-questions-es'

import { DATABASE_INDEXING_QUESTIONS } from './database-indexing-questions'
import { DATABASE_INDEXING_QUESTIONS_PT } from './database-indexing-questions-pt'
import { DATABASE_INDEXING_QUESTIONS_ES } from './database-indexing-questions-es'

import { MESSAGING_SQS_KAFKA_QUESTIONS } from './messaging-sqs-kafka-questions'
import { MESSAGING_SQS_KAFKA_QUESTIONS_PT } from './messaging-sqs-kafka-questions-pt'
import { MESSAGING_SQS_KAFKA_QUESTIONS_ES } from './messaging-sqs-kafka-questions-es'

import { NODEJS_FUNDAMENTALS_QUESTIONS } from './nodejs-fundamentals-questions'
import { NODEJS_FUNDAMENTALS_QUESTIONS_PT } from './nodejs-fundamentals-questions-pt'
import { NODEJS_FUNDAMENTALS_QUESTIONS_ES } from './nodejs-fundamentals-questions-es'

import { RABBITMQ_CONCEPTS_QUESTIONS } from './rabbitmq-concepts-questions'
import { RABBITMQ_CONCEPTS_QUESTIONS_PT } from './rabbitmq-concepts-questions-pt'
import { RABBITMQ_CONCEPTS_QUESTIONS_ES } from './rabbitmq-concepts-questions-es'

import { SYSTEM_ARCHITECTURE_QUESTIONS } from './system-architecture-questions'
import { SYSTEM_ARCHITECTURE_QUESTIONS_PT } from './system-architecture-questions-pt'
import { SYSTEM_ARCHITECTURE_QUESTIONS_ES } from './system-architecture-questions-es'

type SlugMap = Record<string, Record<'en' | 'pt' | 'es', InterviewQuestion[]>>

const QUESTIONS_MAP: SlugMap = {
  typescript: {
    en: TYPESCRIPT_QUESTIONS,
    pt: TYPESCRIPT_QUESTIONS_PT,
    es: TYPESCRIPT_QUESTIONS_ES,
  },
  vue: {
    en: VUE_QUESTIONS,
    pt: VUE_QUESTIONS_PT,
    es: VUE_QUESTIONS_ES,
  },
  'database-design': {
    en: DATABASE_DESIGN_QUESTIONS,
    pt: DATABASE_DESIGN_QUESTIONS_PT,
    es: DATABASE_DESIGN_QUESTIONS_ES,
  },
  'database-indexing': {
    en: DATABASE_INDEXING_QUESTIONS,
    pt: DATABASE_INDEXING_QUESTIONS_PT,
    es: DATABASE_INDEXING_QUESTIONS_ES,
  },
  'messaging-sqs-kafka': {
    en: MESSAGING_SQS_KAFKA_QUESTIONS,
    pt: MESSAGING_SQS_KAFKA_QUESTIONS_PT,
    es: MESSAGING_SQS_KAFKA_QUESTIONS_ES,
  },
  'nodejs-fundamentals': {
    en: NODEJS_FUNDAMENTALS_QUESTIONS,
    pt: NODEJS_FUNDAMENTALS_QUESTIONS_PT,
    es: NODEJS_FUNDAMENTALS_QUESTIONS_ES,
  },
  'rabbitmq-concepts': {
    en: RABBITMQ_CONCEPTS_QUESTIONS,
    pt: RABBITMQ_CONCEPTS_QUESTIONS_PT,
    es: RABBITMQ_CONCEPTS_QUESTIONS_ES,
  },
  'system-architecture': {
    en: SYSTEM_ARCHITECTURE_QUESTIONS,
    pt: SYSTEM_ARCHITECTURE_QUESTIONS_PT,
    es: SYSTEM_ARCHITECTURE_QUESTIONS_ES,
  },
}

export function getInterviewQuestions(slug: string, locale?: string): InterviewQuestion[] {
  const normalizedLocale: 'en' | 'pt' | 'es' =
    locale === 'pt' ? 'pt' : locale === 'es' ? 'es' : 'en'

  const topicEntry = QUESTIONS_MAP[slug]
  if (!topicEntry) {
    return []
  }

  return topicEntry[normalizedLocale] || topicEntry.en
}
