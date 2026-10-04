'use client'

import React from 'react'
import AppInterviewQuiz from './AppInterviewQuiz'
import { getInterviewQuizMeta } from '@/data/interview/interviewMeta'
import { getInterviewQuestions } from '@/data/interview/interviewQuestionsProvider'

export function AppVueQuiz({ locale }: { locale?: string }) {
  const meta = getInterviewQuizMeta('vue', locale)
  const questions = getInterviewQuestions('vue', locale)

  return (
    <AppInterviewQuiz
      category="frontend"
      locale={locale}
      title={meta.title}
      subtitle={meta.subtitle}
      accentColor="#41b883"
      secondaryTabTitle={meta.secondaryTabTitle}
      questions={questions}
      levelCards={meta.levelCards}
    />
  )
}
export default AppVueQuiz
