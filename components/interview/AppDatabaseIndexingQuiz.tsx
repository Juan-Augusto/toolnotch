'use client'

import React from 'react'
import AppInterviewQuiz from './AppInterviewQuiz'
import { getInterviewQuizMeta } from '@/data/interview/interviewMeta'
import { getInterviewQuestions } from '@/data/interview/interviewQuestionsProvider'

export function AppDatabaseIndexingQuiz({ locale }: { locale?: string }) {
  const meta = getInterviewQuizMeta('database-indexing', locale)
  const questions = getInterviewQuestions('database-indexing', locale)

  return (
    <AppInterviewQuiz
      category="backend"
      locale={locale}
      title={meta.title}
      subtitle={meta.subtitle}
      accentColor="#f59e0b"
      secondaryTabTitle={meta.secondaryTabTitle}
      questions={questions}
      levelCards={meta.levelCards}
    />
  )
}
export default AppDatabaseIndexingQuiz
