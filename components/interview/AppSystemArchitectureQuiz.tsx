'use client'

import React from 'react'
import AppInterviewQuiz from './AppInterviewQuiz'
import { getInterviewQuizMeta } from '@/data/interview/interviewMeta'
import { getInterviewQuestions } from '@/data/interview/interviewQuestionsProvider'

export function AppSystemArchitectureQuiz({ locale }: { locale?: string }) {
  const meta = getInterviewQuizMeta('system-architecture', locale)
  const questions = getInterviewQuestions('system-architecture', locale)

  return (
    <AppInterviewQuiz
      category="distributed"
      locale={locale}
      title={meta.title}
      subtitle={meta.subtitle}
      accentColor="#8b5cf6"
      secondaryTabTitle={meta.secondaryTabTitle}
      questions={questions}
      levelCards={meta.levelCards}
    />
  )
}
export default AppSystemArchitectureQuiz
