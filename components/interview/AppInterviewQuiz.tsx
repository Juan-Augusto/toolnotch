"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  Check,
} from "lucide-react";
import type {
  InterviewQuestion,
  QuizLevel,
  QuizState,
  ExplanationTab,
  UserAnswer,
} from "@/lib/interviewTypes";
import AppCard from "@/components/ui/AppCard";
import AppButton from "@/components/ui/AppButton";
import AppBadge from "@/components/ui/AppBadge";
import {
  INTERVIEW_CATEGORY_CONFIG,
  type InterviewCategoryKey,
} from "./interviewHubConfig";
import {
  getInterviewQuizLabels,
  type InterviewQuizLabels,
} from "./interviewQuizLabels";
import AppTabsChips, {
  type AppTabsChipItem,
} from "@/components/ui/AppTabsChips";
import AppTabs, { type AppTabItem } from "@/components/ui/AppTabs";

export interface AppInterviewLevelCard {
  level: QuizLevel;
  title: string;
  desc: string;
  topics: string[];
}

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

type TokenType = "kw" | "ty" | "str" | "cmt" | "num" | "txt";

const KEYWORDS = new Set([
  "const",
  "let",
  "var",
  "function",
  "return",
  "if",
  "else",
  "switch",
  "case",
  "default",
  "for",
  "while",
  "typeof",
  "instanceof",
  "new",
  "class",
  "export",
  "import",
  "from",
  "as",
  "keyof",
  "infer",
  "satisfies",
  "declare",
  "namespace",
  "enum",
  "readonly",
  "abstract",
  "override",
  "async",
  "await",
  "of",
  "in",
  "throw",
  "try",
  "catch",
  "finally",
  "break",
  "continue",
  "do",
  "type",
  "interface",
  "extends",
  "implements",
  "SELECT",
  "FROM",
  "WHERE",
  "JOIN",
  "INNER",
  "LEFT",
  "RIGHT",
  "CREATE",
  "TABLE",
  "ALTER",
  "INDEX",
  "PRIMARY",
  "KEY",
  "FOREIGN",
  "REFERENCES",
  "INSERT",
  "INTO",
  "VALUES",
  "UPDATE",
  "SET",
  "DELETE",
]);

const TYPES = new Set([
  "string",
  "number",
  "boolean",
  "object",
  "symbol",
  "bigint",
  "any",
  "unknown",
  "never",
  "void",
  "null",
  "undefined",
  "true",
  "false",
  "TEXT",
  "VARCHAR",
  "INTEGER",
  "BIGINT",
  "SERIAL",
  "BOOLEAN",
  "TIMESTAMP",
  "UUID",
  "JSONB",
]);

function tokenizeCode(code: string): { type: TokenType; value: string }[] {
  const tokens: { type: TokenType; value: string }[] = [];
  let i = 0;
  while (i < code.length) {
    if (
      (code[i] === "/" && code[i + 1] === "/") ||
      (code[i] === "-" && code[i + 1] === "-")
    ) {
      let j = i;
      while (j < code.length && code[j] !== "\n") j++;
      tokens.push({ type: "cmt", value: code.slice(i, j) });
      i = j;
      continue;
    }
    if (code[i] === "/" && code[i + 1] === "*") {
      let j = i + 2;
      while (j < code.length - 1 && !(code[j] === "*" && code[j + 1] === "/"))
        j++;
      tokens.push({ type: "cmt", value: code.slice(i, j + 2) });
      i = j + 2;
      continue;
    }
    const q = code[i];
    if (q === '"' || q === "'" || q === "`") {
      let j = i + 1;
      while (j < code.length) {
        if (code[j] === "\\") {
          j += 2;
          continue;
        }
        if (code[j] === q) {
          j++;
          break;
        }
        j++;
      }
      tokens.push({ type: "str", value: code.slice(i, j) });
      i = j;
      continue;
    }
    if (/\d/.test(code[i])) {
      let j = i;
      while (j < code.length && /[\d.eExX_a-fA-F]/.test(code[j])) j++;
      tokens.push({ type: "num", value: code.slice(i, j) });
      i = j;
      continue;
    }
    if (/[a-zA-Z_$]/.test(code[i])) {
      let j = i;
      while (j < code.length && /[a-zA-Z0-9_$]/.test(code[j])) j++;
      const word = code.slice(i, j);
      const tokenType = KEYWORDS.has(word)
        ? "kw"
        : TYPES.has(word)
          ? "ty"
          : "txt";
      tokens.push({ type: tokenType, value: word });
      i = j;
      continue;
    }
    tokens.push({ type: "txt", value: code[i] });
    i++;
  }
  return tokens;
}

const TOKEN_COLORS: Record<TokenType, string> = {
  kw: "text-purple-400",
  ty: "text-blue-400",
  str: "text-emerald-400",
  cmt: "text-slate-500 italic",
  num: "text-amber-400",
  txt: "text-slate-200",
};

function HighlightedCode({ code }: { code: string }) {
  const tokens = tokenizeCode(code);
  return (
    <pre className="bg-[#0f172a] text-slate-200 rounded-[2px] p-4 overflow-x-auto  font-mono leading-relaxed border border-slate-800">
      <code>
        {tokens.map((tok, index) => (
          <span key={index} className={TOKEN_COLORS[tok.type]}>
            {tok.value}
          </span>
        ))}
      </code>
    </pre>
  );
}

const LEVEL_BADGE_CLASSES: Record<"all" | QuizLevel, string> = {
  all: "text-primary border-primary/30 bg-primary/10",
  beginner: "text-emerald-500 border-emerald-500/30 bg-emerald-500/10",
  intermediate: "text-amber-500 border-amber-500/30 bg-amber-500/10",
  advanced: "text-rose-500 border-rose-500/30 bg-rose-500/10",
};

const DEFAULT_LEVEL_CARDS_BY_LOCALE: Record<"pt" | "en" | "es", AppInterviewLevelCard[]> = {
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

const OPTION_LETTERS = ["A", "B", "C", "D"];

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
    options: indices.map((idx) => q.options[idx]) as [string, string, string, string],
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
  accentColor = "#22d3ee",
  icon,
  questions,
  levelCards,
  secondaryTabTitle,
  backHref = "/interview",
}: AppInterviewQuizProps) {
  const [state, setState] = useState<QuizState>(INITIAL_QUIZ_STATE);
  const [selectedLevel, setSelectedLevel] = useState<"all" | QuizLevel>("all");

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
        questions: randomized.length > 0 ? randomized : questions.slice(0, 10).map(shuffleQuestionOptions),
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

  const cycleTab = useCallback(() => {
    setState((prev) => {
      const current = prev.questions[prev.currentIndex];
      const available: ExplanationTab[] = ["why"];
      if (current?.compiledJS) available.push("compiled");
      if (current?.bestPractice) available.push("best");
      const currentIndex = available.indexOf(prev.activeTab);
      return {
        ...prev,
        activeTab: available[(currentIndex + 1) % available.length] || "why",
      };
    });
  }, []);

  useEffect(() => {
    if (state.screen !== "quiz") return;
    const keyHandler = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;
      if (["1", "2", "3", "4"].includes(e.key) && !state.answered) {
        handleAnswer(parseInt(e.key, 10) - 1);
      }
      if ((e.key === "Enter" || e.key === "ArrowRight") && state.answered) {
        e.preventDefault();
        handleNext();
      }
      if (e.key === "Tab" && state.answered) {
        e.preventDefault();
        cycleTab();
      }
    };
    window.addEventListener("keydown", keyHandler);
    return () => window.removeEventListener("keydown", keyHandler);
  }, [state.screen, state.answered, handleAnswer, handleNext, cycleTab]);

  const currentLocaleKey =
    locale === "pt" || locale === "es" || locale === "en" ? locale : "pt";
  const labels = getInterviewQuizLabels(currentLocaleKey);
  const resolvedSecondaryTabTitle = secondaryTabTitle || labels.defaultSecondaryTab;

  const resolvedLevelCards = useMemo(() => {
    return levelCards && levelCards.length > 0
      ? levelCards
      : DEFAULT_LEVEL_CARDS_BY_LOCALE[currentLocaleKey] || DEFAULT_LEVEL_CARDS_BY_LOCALE.en;
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

  if (state.screen === "home") {
    const estimatedMinutes = Math.max(5, Math.round(questions.length * 0.4));

    return (
      <div className="w-full mx-auto select-none">
        <AppCard border hover={false} className="p-7 sm:p-10">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-2.5">
              <AppBadge bg={badgeBg} text={badgeColor} icon={badgeIcon}>
                {displayCategoryName}
              </AppBadge>

              <span className="text-[11px] text-label uppercase font-semibold">
                {labels.questionsSummary(questions.length, estimatedMinutes)}
              </span>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-bold! uppercase  text-foreground">
                {title}
              </h1>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase  text-label block">
                {labels.selectLevel}
              </span>
              <AppTabsChips
                items={levelTabItems}
                value={selectedLevel}
                onChange={(id) => setSelectedLevel(id as "all" | QuizLevel)}
              />
            </div>

            <div className="p-4 bg-tertiary/30 border-dashed-5 rounded-[2px] space-y-3">
              <p className=" text-label/90 leading-relaxed">
                {selectedLevelCard ? selectedLevelCard.desc : subtitle}
              </p>
              {displayTopics.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1 text-sm">
                  {displayTopics.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 rounded-[2px] bg-foreground/5 text-foreground/90"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-2">
              <AppButton
                color="secondary"
                withArrow
                onClick={() => startQuiz(selectedLevel)}
                className="w-full sm:w-auto text-sm"
              >
                {labels.startQuiz}
              </AppButton>
            </div>
          </div>
        </AppCard>
      </div>
    );
  }

  if (state.screen === "quiz") {
    const currentQ = state.questions[state.currentIndex];
    const totalQuestions = state.questions.length;
    const progressPercent =
      totalQuestions > 0
        ? Math.round(((state.currentIndex + 1) / totalQuestions) * 100)
        : 0;
    const isLastQuestion = state.currentIndex === totalQuestions - 1;
    const levelLabel = state.level
      ? labels.levelLabels[state.level]
      : labels.levelLabels.all;
    const chosenAnswerIndex = state.answered
      ? state.userAnswers[state.currentIndex]?.chosenIndex
      : undefined;

    const quizTabs: AppTabItem[] = [
      {
        id: "why",
        label: labels.explanation,
        content: (
          <div className="space-y-2">
            <p className=" text-foreground/90 leading-relaxed">
              {currentQ.explanation}
            </p>
            {currentQ.source && (
              <p className="text-[11px] text-label pt-1">
                {labels.reference} {currentQ.source}
              </p>
            )}
          </div>
        ),
      },
    ];

    if (currentQ.compiledJS) {
      quizTabs.push({
        id: "compiled",
        label: resolvedSecondaryTabTitle,
        content: (
          <div>
            <HighlightedCode code={currentQ.compiledJS} />
          </div>
        ),
      });
    }

    if (currentQ.bestPractice) {
      quizTabs.push({
        id: "best",
        label: labels.bestPractice,
        content: (
          <div>
            <p className=" text-foreground/90 leading-relaxed">
              {currentQ.bestPractice}
            </p>
          </div>
        ),
      });
    }

    return (
      <div className="space-y-6 select-none">
        <div className="space-y-2.5">
          <div className="flex items-center justify-between font-semibold">
            <span className="text-foreground text-sm uppercase">
              {labels.question}{" "}
              <span className="text-secondary">
                {String(state.currentIndex + 1).padStart(2, "0")}
              </span>{" "}
              <span>/ {String(totalQuestions).padStart(2, "0")}</span>
            </span>

            <div className="flex items-center gap-3 text-xs tracking-wide">
              <span className="text-primary uppercase">
                {progressPercent}% {labels.completed}
              </span>
              <span className="uppercase px-2 py-1 rounded-[2px] bg-foreground/5">
                {levelLabel}
              </span>
            </div>
          </div>

          <div className="w-full h-2 rounded-[2px] bg-tertiary/60 border border-border overflow-hidden relative">
            <div
              className="h-full bg-primary transition-all duration-300 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <AppCard
          border
          hover={false}
          withCornerAccents={false}
          className="p-6 sm:p-8"
        >
          <div className="mb-6">
            <span className="text-xs text-label font-semibold tracking-wide  uppercase block mb-2">
              {labels.questionNumTopic(state.currentIndex + 1, currentQ.topic)}
            </span>
            <h2 className=" font-bold rounded-sm text-lg sm:text-xl  text-foreground leading-snug">
              {currentQ.question}
            </h2>
          </div>

          {currentQ.code && (
            <div className="mb-6">
              <HighlightedCode code={currentQ.code} />
            </div>
          )}

          <div className="space-y-3">
            {currentQ.options.map((optionText, optIndex) => {
              const isSelected = chosenAnswerIndex === optIndex;
              const isAnswered = state.answered;
              const isCorrect = optIndex === currentQ.correctIndex;

              let optionBorder =
                "border-border hover:bg-foreground/5 text-label";
              if (isAnswered) {
                if (isCorrect) {
                  optionBorder =
                    "border-emerald-600 bg-emerald-600/85 text-white dark:border-emerald-400 dark:bg-emerald-400/90 dark:text-black font-bold";
                } else if (isSelected && !isCorrect) {
                  optionBorder =
                    "border-red-600 bg-red-600/85 text-white dark:border-red-400 dark:bg-red-400/90 dark:text-black font-bold";
                } else {
                  optionBorder =
                    "border-border/30 bg-tertiary/10 text-label/40 opacity-50";
                }
              }

              return (
                <button
                  key={optIndex}
                  type="button"
                  disabled={state.answered}
                  onClick={() => handleAnswer(optIndex)}
                  className={`w-full text-left p-4 rounded-[2px] border transition-all duration-150 flex items-center justify-between gap-3.5 cursor-pointer disabled:cursor-default group ${optionBorder}`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`w-7 h-7 shrink-0 text-xs font-bold rounded-[2px] flex items-center justify-center border transition-colors ${
                        isAnswered && isCorrect
                          ? "bg-white text-emerald-700 border-white dark:bg-black dark:text-emerald-400 dark:border-black"
                          : isAnswered && isSelected && !isCorrect
                            ? "bg-white text-red-700 border-white dark:bg-black dark:text-red-400 dark:border-black"
                            : isSelected
                              ? "bg-secondary text-background border-background/50 dark:border-black/50"
                              : "bg-tertiary/70 text-label border-border group-hover:border-secondary group-hover:text-foreground"
                      }`}
                    >
                      {OPTION_LETTERS[optIndex] || optIndex + 1}
                    </span>
                    <span className=" font-medium break-words">
                      {optionText}
                    </span>
                  </div>

                  {isAnswered && (
                    <div className="shrink-0">
                      {isCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-white dark:text-black" />
                      )}
                      {isSelected && !isCorrect && (
                        <XCircle className="w-5 h-5 text-white dark:text-black" />
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {state.answered && (
            <div className="mt-5 p-4 border-dashed-5 rounded-[2px">
              <AppTabs
                tabs={quizTabs}
                value={state.activeTab}
                onChange={(tabId) =>
                  setState((prev) => ({
                    ...prev,
                    activeTab: tabId as ExplanationTab,
                  }))
                }
                color="primary"
                withRail
              />
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-dashed border-border/40 flex items-center justify-between gap-3">
            <AppButton
              type="button"
              color="tertiary"
              onClick={handlePrevious}
              disabled={state.currentIndex === 0}
              small
            >
              <span className="inline-flex items-center gap-1.5">
                <ArrowLeft className="w-3.5 h-3.5" />
                {labels.previous}
              </span>
            </AppButton>

            <AppButton
              type="button"
              color="primary"
              withArrow={!isLastQuestion}
              onClick={handleNext}
              disabled={!state.answered}
            >
              <span className="inline-flex items-center gap-1.5">
                {isLastQuestion && <Check className="w-3.5 h-3.5 mr-0.5" />}
                {isLastQuestion ? labels.viewResults : labels.next}
              </span>
            </AppButton>
          </div>
        </AppCard>
      </div>
    );
  }

  const totalQuestions = state.questions.length;
  const correctCount = state.userAnswers.filter((a) => a.correct).length;
  const scoreRatio =
    totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const levelLabel = state.level
    ? labels.levelLabels[state.level]
    : labels.levelLabels.all;

  let evaluation = labels.evaluations.high;
  if (scoreRatio < 50) {
    evaluation = labels.evaluations.low;
  } else if (scoreRatio < 80) {
    evaluation = labels.evaluations.mid;
  }

  return (
    <div className="space-y-6 select-none">
      <AppCard
        border
        hover={false}
        withCornerAccents={false}
        className="p-7 sm:p-10"
      >
        <div className="flex items-center justify-between gap-3 mb-6 pb-4 border-b border-border/50">
          <span className="text-xs font-semibold uppercase">
            {labels.resultBadge}
          </span>
          <span className="text-[11px] text-label uppercase">
            {title} | {levelLabel}
          </span>
        </div>

        <div className="mb-6">
          <div className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight mb-2">
            {correctCount}{" "}
            <span className="text-xl sm:text-2xl text-label font-normal">
              / {totalQuestions}
            </span>
          </div>
          <div className="text-xs text-secondary font-semibold uppercase ">
            {labels.scoreSummary(scoreRatio, evaluation.title)}
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold uppercase  text-foreground">
            {evaluation.title}
          </h2>
          <p className=" text-label/90 leading-relaxed max-w-3xl">
            {evaluation.desc}
          </p>
        </div>

        <div className="pt-6 border-t border-border/50 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <AppButton
              color="secondary"
              small
              onClick={() => startQuiz(state.level ?? "all")}
              className="w-full sm:w-auto whitespace-nowrap"
            >
              <RotateCcw className="w-3.5 h-3.5 shrink-0 mr-1.5" />
              {labels.retake}
            </AppButton>

            <AppButton
              color="tertiary"
              small
              onClick={() => setState(INITIAL_QUIZ_STATE)}
              className="w-full sm:w-auto whitespace-nowrap"
            >
              {labels.chooseLevel}
            </AppButton>

            <Link href={backHref} className="w-full sm:w-auto">
              <AppButton
                color="primary"
                withArrow
                small
                className="w-full sm:w-auto whitespace-nowrap"
              >
                {labels.otherDrills}
              </AppButton>
            </Link>
          </div>
        </div>
      </AppCard>

      <div className="space-y-4 pt-4">
        <h3 className="text-sm font-bold uppercase  text-foreground">
          {labels.reviewHeading}
        </h3>

        <div className="space-y-3">
          {state.questions.map((q, qIndex) => {
            const ans = state.userAnswers[qIndex];
            const isPassed = ans?.correct;
            return (
              <AppCard
                key={q.id}
                border
                hover={false}
                withCornerAccents={false}
                className="p-5"
              >
                <div className="flex items-start gap-3.5">
                  <div className="shrink-0 mt-0.5">
                    {isPassed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                  </div>

                  <div className="space-y-2 min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold uppercase text-label">
                        {labels.questionNumTopic(qIndex + 1, q.topic)}
                      </span>
                      <span
                        className={`text-[11px] uppercase font-semibold px-2 py-0.5 rounded-[2px] ${
                          isPassed
                            ? "bg-emerald-600 dark:bg-emerald-500 text-white dark:text-black border border-emerald-500/30"
                            : "bg-red-500 dark:bg-red-400 text-white dark:text-black border border-red-500/30"
                        }`}
                      >
                        {isPassed ? labels.correct : labels.incorrect}
                      </span>
                    </div>

                    <p className="text-sm bg-foreground/3 p-3 font-medium text-foreground leading-snug">
                      {q.question}
                    </p>

                    {!isPassed && ans && (
                      <div className=" space-y-1 pt-1 text-sm">
                        <p className="text-red-700 dark:text-red-400 bg-red-400/10 p-3 font-medium">
                          {labels.yourAnswer} {q.options[ans.chosenIndex]}
                        </p>
                        <p className="text-emerald-700 dark:text-emerald-500 p-3 bg-emerald-400/10 font-medium">
                          {labels.correctAnswer} {q.options[q.correctIndex]}
                        </p>
                      </div>
                    )}

                    <p className=" text-label/90 leading-relaxed pt-1 text-sm">
                      {q.explanation}
                    </p>
                  </div>
                </div>
              </AppCard>
            );
          })}
        </div>
      </div>
    </div>
  );
}
