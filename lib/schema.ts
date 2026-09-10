import { AnyQuiz, isTriviaQuiz, isTriviaQuestion } from '@/lib/quizTypes'
import type { InterviewQuestion } from '@/lib/interviewTypes'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://toolnotch.com'

export interface FaqItem {
  question: string
  answer: string
}

/**
 * Builds a fully-qualified URL for the given path, prefixed with the locale
 * when it is not the default English locale.
 * English has no URL prefix (localePrefix: 'as-needed').
 */
export function buildLocalizedUrl(path: string, locale: string): string {
  const prefix = locale === 'en' ? '' : `/${locale}`
  return `${BASE_URL}${prefix}${path}`
}

/** Maps next-intl locale codes to BCP-47 language tags for JSON-LD inLanguage. */
const LANG_MAP: Record<string, string> = {
  en: 'en',
  pt: 'pt-BR',
  es: 'es',
}

export function webAppSchema(
  name: string,
  url: string,
  description: string,
  locale = 'en',
  category = 'UtilitiesApplication'
) {
  return {
    '@type': 'WebApplication',
    name,
    url: buildLocalizedUrl(url, locale),
    description,
    inLanguage: LANG_MAP[locale] ?? locale,
    applicationCategory: category,
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  }
}

export function faqSchema(faqs: FaqItem[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  }
}

export function howToSchema(name: string, steps: string[]) {
  return {
    '@type': 'HowTo',
    name,
    step: steps.map((text, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      text,
    })),
  }
}

export function eventSchema(
  name: string,
  startDate: string,
  url: string,
  locale = 'en',
  description?: string,
) {
  return {
    '@type': 'Event',
    name,
    startDate,
    eventAttendanceMode: 'https://schema.org/MixedEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location: { '@type': 'Country', name: 'Brazil' },
    url: buildLocalizedUrl(url, locale),
    ...(description ? { description } : {}),
  }
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map(({ name, url }, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name,
      item: `${BASE_URL}${url}`,
    })),
  }
}

export function authorSchema() {
  return {
    '@type': 'Person',
    name: 'Juan Soares',
    url: 'https://www.linkedin.com/in/juan--ximenes',
    sameAs: [
      'https://www.linkedin.com/in/juan--ximenes',
      'https://github.com/Juan-Augusto',
    ],
  }
}

export function quizDetailSchema(
  quiz: AnyQuiz,
  url: string,
  locale = 'en',
  about?: string,
) {
  const isTrivia = isTriviaQuiz(quiz)
  return {
    '@type': 'Quiz' as const,
    name: quiz.title,
    url,
    description: quiz.description,
    inLanguage: LANG_MAP[locale] ?? locale,
    educationalUse: 'Assessment',
    ...(about ? { about: { '@type': 'Thing', name: about } } : {}),
    hasPart: quiz.questions.map((q) => {
      if (isTrivia && isTriviaQuestion(q)) {
        const correctOpt = q.options.find((o) => o.id === q.correctAnswerId)
        const otherOpts = q.options.filter((o) => o.id !== q.correctAnswerId)
        return {
          '@type': 'Question',
          name: q.text,
          ...(correctOpt
            ? { acceptedAnswer: { '@type': 'Answer', text: correctOpt.text } }
            : {}),
          suggestedAnswer: otherOpts.map((o) => ({
            '@type': 'Answer',
            text: o.text,
          })),
        }
      }
      return {
        '@type': 'Question',
        name: q.text,
        suggestedAnswer: q.options.map((o) => ({
          '@type': 'Answer',
          text: o.text,
        })),
      }
    }),
  }
}

export function interviewQuizSchema({
  title,
  description,
  url,
  locale = 'en',
  about,
  questions = [],
}: {
  title: string
  description: string
  url: string
  locale?: string
  about?: string
  questions?: InterviewQuestion[]
}) {
  return {
    '@type': 'Quiz' as const,
    name: title,
    url,
    description,
    inLanguage: LANG_MAP[locale] ?? locale,
    educationalLevel: ['Beginner', 'Intermediate', 'Advanced'],
    learningResourceType: 'Practice quiz',
    ...(about ? { about: { '@type': 'Thing', name: about } } : {}),
    hasPart: questions.map((q) => {
      const acceptedText = q.options[q.correctIndex] ?? ''
      const distractors = q.options.filter((_, idx) => idx !== q.correctIndex)
      return {
        '@type': 'Question',
        eduQuestionType: 'Multiple choice',
        name: q.question,
        text: q.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: acceptedText,
          ...(q.explanation
            ? {
                comment: {
                  '@type': 'Comment',
                  text: q.explanation,
                },
              }
            : {}),
        },
        suggestedAnswer: distractors.map((optText) => ({
          '@type': 'Answer',
          text: optText,
        })),
      }
    }),
  }
}

export function buildJsonLd(...schemas: object[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': schemas,
  }
}
