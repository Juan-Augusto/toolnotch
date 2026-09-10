'use client'

import React from 'react'
import AppInterviewQuiz from './AppInterviewQuiz'
import { getInterviewQuizMeta } from '@/data/interview/interviewMeta'
import { getInterviewQuestions } from '@/data/interview/interviewQuestionsProvider'

export function AppTypeScriptQuiz({ locale }: { locale?: string }) {
  const meta = getInterviewQuizMeta('typescript', locale)
  const questions = getInterviewQuestions('typescript', locale)

  return (
    <AppInterviewQuiz
      category="frontend"
      locale={locale}
      title={meta.title}
      subtitle={meta.subtitle}
      accentColor="#3178c6"
      secondaryTabTitle={meta.secondaryTabTitle}
      questions={questions}
      levelCards={meta.levelCards}
    />
  )
}
export default AppTypeScriptQuiz
