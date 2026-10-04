"use client";

import AppQuizzesHub, { type QuizCardData } from "./AppQuizzesHub";

export type { QuizCardData };

export interface QuizCategoryFilterProps {
  quizzes: QuizCardData[];
  locale?: string;
}

export function AppQuizCategoryFilter({ quizzes, locale }: QuizCategoryFilterProps) {
  return <AppQuizzesHub quizzes={quizzes} locale={locale} />;
}

export default AppQuizCategoryFilter;
