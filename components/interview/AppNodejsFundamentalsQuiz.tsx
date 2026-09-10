'use client'

import React from 'react'
import AppInterviewQuiz from './AppInterviewQuiz'
import { getInterviewQuizMeta } from '@/data/interview/interviewMeta'
import { getInterviewQuestions } from '@/data/interview/interviewQuestionsProvider'

export function AppNodejsFundamentalsQuiz({ locale }: { locale?: string }) {
  const meta = getInterviewQuizMeta('nodejs-fundamentals', locale)
  const questions = getInterviewQuestions('nodejs-fundamentals', locale)

  return (
    <AppInterviewQuiz
      category="backend"
      locale={locale}
      title={meta.title}
      subtitle={meta.subtitle}
      accentColor="#68a063"
      secondaryTabTitle={meta.secondaryTabTitle}
      questions={questions}
      levelCards={meta.levelCards}
    />
  )
}
export default AppNodejsFundamentalsQuiz
