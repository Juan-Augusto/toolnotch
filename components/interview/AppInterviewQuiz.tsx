"use client";

import React, { useState, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import type {
  InterviewQuestion,
  QuizLevel,
  QuizState,
  ExplanationTab,
  UserAnswer,
} from "@/lib/interviewTypes";
import {
  INTERVIEW_CATEGORY_CONFIG,
  type InterviewCategoryKey,
} from "./interviewHubConfig";
import {
  getInterviewQuizLabels,
  type InterviewQuizLabels,
} from "./interviewQuizLabels";
import type { AppTabsChipItem } from "@/components/ui/AppTabsChips";
import AppInterviewStartScreen, {
  type AppInterviewLevelCard,
} from "./AppInterviewStartScreen";
import AppInterviewQuestionScreen from "./AppInterviewQuestionScreen";

// Code splitting: dynamically load the Result & Review screen
const AppInterviewResultScreen = dynamic(
  () => import("./AppInterviewResultScreen"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full p-12 text-center text-label font-mono animate-pulse">
        Loading results...
      </div>
    ),
  },
);

export type { AppInterviewLevelCard };

export interface AppInterviewQuizProps {
  title: string;
  subtitle: string;
  category?: InterviewCategoryKey;
  categoryName?: string;
  badgeBg?: string;
  badgeColor?: string;
  locale?: string;
  accentColor?: string;
  icon?: React.ReactNode;
  questions: InterviewQuestion[];
  levelCards?: AppInterviewLevelCard[];
  secondaryTabTitle?: string;
  backHref?: string;
  backLabel?: string;
}

const DEFAULT_LEVEL_CARDS_BY_LOCALE: Record<
  "pt" | "en" | "es",
  AppInterviewLevelCard[]
> = {
  pt: [
    {
      level: "beginner",
      title: "Iniciante",
      desc: "10 questões sobre sintaxe básica, tipos e conceitos fundamentais.",
      topics: ["Sintaxe", "Tipos", "Estruturas", "Fundamentos"],
    },
    {
      level: "intermediate",
      title: "Intermediário",
      desc: "10 questões sobre cenários reais, generics e performance.",
      topics: ["Generics", "Cenários Reais", "Performance", "APIs"],
    },
    {
      level: "advanced",
      title: "Avançado",
      desc: "10 questões sobre concorrência, internals e casos de borda.",
      topics: ["Internals", "Concorrência", "Casos de Borda", "Escala"],
    },
  ],
  en: [
    {
      level: "beginner",
      title: "Beginner",
      desc: "10 questions on core syntax, foundational types, and key concepts.",
      topics: ["Syntax", "Types", "Structures", "Fundamentals"],
    },
    {
      level: "intermediate",
      title: "Intermediate",
      desc: "10 questions on real-world patterns, generics, and performance.",
      topics: ["Generics", "Real Scenarios", "Performance", "APIs"],
    },
    {
      level: "advanced",
      title: "Advanced",
      desc: "10 questions on concurrency, internals, and tricky edge cases.",
      topics: ["Internals", "Concurrency", "Edge Cases", "Scale"],
    },
  ],
  es: [
    {
      level: "beginner",
      title: "Principiante",
      desc: "10 preguntas sobre sintaxis básica, tipos y conceptos fundamentales.",
      topics: ["Sintaxis", "Tipos", "Estructuras", "Fundamentos"],
    },
    {
      level: "intermediate",
      title: "Intermedio",
      desc: "10 preguntas sobre casos reales, generics y rendimiento.",
      topics: ["Generics", "Casos Reales", "Rendimiento", "APIs"],
    },
    {
      level: "advanced",
      title: "Avanzado",
      desc: "10 preguntas sobre concurrencia, internals y casos límite.",
      topics: ["Internals", "Concurrencia", "Casos Límite", "Escala"],
    },
  ],
};

const INITIAL_QUIZ_STATE: QuizState = {
  screen: "home",
  level: null,
  questions: [],
  currentIndex: 0,
  answered: false,
  userAnswers: [],
  activeTab: "why",
};

export function shuffleQuestionOptions(q: InterviewQuestion): InterviewQuestion {
  if (!q.options || q.options.length !== 4) return q;
  const indices = [0, 1, 2, 3];
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  const newCorrectIndex = indices.indexOf(q.correctIndex);
  return {
    ...q,
    options: indices.map((idx) => q.options[idx]) as [
      string,
      string,
      string,
      string,
    ],
    correctIndex: (newCorrectIndex >= 0 ? newCorrectIndex : 0) as 0 | 1 | 2 | 3,
  };
}

export default function AppInterviewQuiz({
  title,
  subtitle,
  category,
  categoryName,
  badgeBg: badgeBgProp,
  badgeColor: badgeColorProp,
  locale = "pt",
  icon,
  questions,
  levelCards,
  secondaryTabTitle,
  backHref = "/interview",
}: AppInterviewQuizProps) {
  const [state, setState] = useState<QuizState>(INITIAL_QUIZ_STATE);
  const [selectedLevel, setSelectedLevel] = useState<"all" | QuizLevel>("all");

  const currentLocaleKey =
    locale === "pt" || locale === "es" || locale === "en" ? locale : "pt";
  const labels: InterviewQuizLabels = getInterviewQuizLabels(currentLocaleKey);
  const resolvedSecondaryTabTitle =
    secondaryTabTitle || labels.defaultSecondaryTab;

  const resolvedLevelCards = useMemo(() => {
    return levelCards && levelCards.length > 0
      ? levelCards
      : DEFAULT_LEVEL_CARDS_BY_LOCALE[currentLocaleKey] ||
          DEFAULT_LEVEL_CARDS_BY_LOCALE.en;
  }, [levelCards, currentLocaleKey]);

  const selectedLevelCard = useMemo(() => {
    if (selectedLevel === "all") return null;
    return resolvedLevelCards.find((c) => c.level === selectedLevel) ?? null;
  }, [selectedLevel, resolvedLevelCards]);

  const displayTopics = useMemo(() => {
    if (selectedLevelCard && selectedLevelCard.topics.length > 0) {
      return selectedLevelCard.topics;
    }
    const all = new Set<string>();
    resolvedLevelCards.forEach((c) => c.topics.forEach((t) => all.add(t)));
    return Array.from(all).slice(0, 6);
  }, [selectedLevelCard, resolvedLevelCards]);

  const resolvedCategory: InterviewCategoryKey = useMemo(() => {
    if (category) return category;
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes("typescript") || lowerTitle.includes("vue"))
      return "frontend";
    if (
      lowerTitle.includes("kafka") ||
      lowerTitle.includes("rabbitmq") ||
      lowerTitle.includes("architecture") ||
      lowerTitle.includes("sqs")
    )
      return "distributed";
    return "backend";
  }, [category, title]);

  const catConfig = INTERVIEW_CATEGORY_CONFIG[resolvedCategory];
  const CategoryIcon = catConfig.icon;
  const badgeBg = badgeBgProp || catConfig.badgeBg;
  const badgeColor = badgeColorProp || catConfig.badgeColor;
  const displayCategoryName =
    categoryName || catConfig.name[currentLocaleKey] || catConfig.name.pt;
  const badgeIcon = icon || <CategoryIcon className="w-3.5 h-3.5" />;

  const levelTabItems: AppTabsChipItem[] = useMemo(() => {
    return (["all", "beginner", "intermediate", "advanced"] as const).map(
      (lvl) => ({
        id: lvl,
        label: labels.levelLabels[lvl],
        count: lvl === "all" ? questions.length : 10,
      }),
    );
  }, [questions.length, labels.levelLabels]);

  const startQuiz = useCallback(
    (level: "all" | QuizLevel) => {
      let pool: InterviewQuestion[] = [];
      if (level === "all") {
        pool = questions;
      } else {
        const levelKey = level[0];
        pool = questions.filter((q) => q.id[0] === levelKey);
        if (pool.length === 0) pool = questions;
      }
      const prepared = pool.map(shuffleQuestionOptions);
      const randomized = [...prepared].sort(() => Math.random() - 0.5);
      setState({
        screen: "quiz",
        level: level === "all" ? null : level,
        questions:
          randomized.length > 0
            ? randomized
            : questions.slice(0, 10).map(shuffleQuestionOptions),
        currentIndex: 0,
        answered: false,
        userAnswers: [],
        activeTab: "why",
      });
    },
    [questions],
  );

  const handleAnswer = useCallback((chosenIndex: number) => {
    setState((prev) => {
      if (prev.answered) return prev;
      const currentQuestion = prev.questions[prev.currentIndex];
      const isCorrect = chosenIndex === currentQuestion.correctIndex;
      const newAnswer: UserAnswer = {
        questionIndex: prev.currentIndex,
        chosenIndex,
        correct: isCorrect,
      };
      return {
        ...prev,
        answered: true,
        userAnswers: [...prev.userAnswers, newAnswer],
      };
    });
  }, []);

  const handleNext = useCallback(() => {
    setState((prev) => {
      if (!prev.answered) return prev;
      const isLast = prev.currentIndex === prev.questions.length - 1;
      if (isLast) return { ...prev, screen: "results" };
      return {
        ...prev,
        currentIndex: prev.currentIndex + 1,
        answered: false,
        activeTab: "why",
      };
    });
  }, []);

  const handlePrevious = useCallback(() => {
    setState((prev) => {
      if (prev.currentIndex <= 0) return prev;
      return {
        ...prev,
        currentIndex: prev.currentIndex - 1,
        answered: true,
        activeTab: "why",
      };
    });
  }, []);

  const handleChangeTab = useCallback((tab: ExplanationTab) => {
    setState((prev) => ({ ...prev, activeTab: tab }));
  }, []);

  if (state.screen === "home") {
    const estimatedMinutes = Math.max(5, Math.round(questions.length * 0.4));
    return (
      <AppInterviewStartScreen
        title={title}
        subtitle={subtitle}
        badgeBg={badgeBg}
        badgeColor={badgeColor}
        badgeIcon={badgeIcon}
        displayCategoryName={displayCategoryName}
        totalQuestions={questions.length}
        estimatedMinutes={estimatedMinutes}
        selectedLevel={selectedLevel}
        onSelectLevel={setSelectedLevel}
        levelTabItems={levelTabItems}
        selectedLevelCard={selectedLevelCard}
        displayTopics={displayTopics}
        labels={labels}
        onStart={startQuiz}
      />
    );
  }

  if (state.screen === "quiz") {
    const currentQ = state.questions[state.currentIndex];
    return (
      <AppInterviewQuestionScreen
        currentQuestion={currentQ}
        currentIndex={state.currentIndex}
        totalQuestions={state.questions.length}
        level={state.level}
        answered={state.answered}
        userAnswer={state.userAnswers[state.currentIndex]}
        activeTab={state.activeTab}
        onChangeTab={handleChangeTab}
        secondaryTabTitle={resolvedSecondaryTabTitle}
        labels={labels}
        onAnswer={handleAnswer}
        onNext={handleNext}
        onPrevious={handlePrevious}
      />
    );
  }

  return (
    <AppInterviewResultScreen
      title={title}
      level={state.level}
      questions={state.questions}
      userAnswers={state.userAnswers}
      labels={labels}
      backHref={backHref}
      onRetake={() => startQuiz(state.level ?? "all")}
      onChooseLevel={() => setState(INITIAL_QUIZ_STATE)}
    />
  );
}
