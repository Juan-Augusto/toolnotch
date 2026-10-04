'use client'

import React from 'react'
import AppInterviewQuiz from './AppInterviewQuiz'
import { getInterviewQuizMeta } from '@/data/interview/interviewMeta'
import { getInterviewQuestions } from '@/data/interview/interviewQuestionsProvider'

export function AppMessagingSqsKafkaQuiz({ locale }: { locale?: string }) {
  const meta = getInterviewQuizMeta('messaging-sqs-kafka', locale)
  const questions = getInterviewQuestions('messaging-sqs-kafka', locale)

  return (
    <AppInterviewQuiz
      category="distributed"
      locale={locale}
      title={meta.title}
      subtitle={meta.subtitle}
      accentColor="#ff9900"
      secondaryTabTitle={meta.secondaryTabTitle}
      questions={questions}
      levelCards={meta.levelCards}
    />
  )
}
export default AppMessagingSqsKafkaQuiz
