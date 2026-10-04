'use client'

import React from 'react'
import AppInterviewQuiz from './AppInterviewQuiz'
import { getInterviewQuizMeta } from '@/data/interview/interviewMeta'
import { getInterviewQuestions } from '@/data/interview/interviewQuestionsProvider'

export function AppRabbitMQConceptsQuiz({ locale }: { locale?: string }) {
  const meta = getInterviewQuizMeta('rabbitmq-concepts', locale)
  const questions = getInterviewQuestions('rabbitmq-concepts', locale)

  return (
    <AppInterviewQuiz
      category="distributed"
      locale={locale}
      title={meta.title}
      subtitle={meta.subtitle}
      accentColor="#ff6600"
      secondaryTabTitle={meta.secondaryTabTitle}
      questions={questions}
      levelCards={meta.levelCards}
    />
  )
}
export default AppRabbitMQConceptsQuiz
