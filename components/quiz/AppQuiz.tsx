"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { Sparkles } from "lucide-react";
import confetti from "canvas-confetti";
import {
  Quiz,
  TriviaQuiz,
  AnyQuiz,
  Option,
  TriviaOption,
  QuizResult,
  isTriviaQuiz,
} from "@/lib/quizTypes";
import { calculateResult } from "@/lib/quizEngine";
import { TriviaResult, calculateTriviaResult } from "@/lib/triviaEngine";
import { QUIZ_REGISTRY } from "@/lib/quizRegistry";
import { CATEGORY_CONFIG } from "./quizzesHubConfig";
import { QUIZ_LABELS, getQuizLabels, type QuizLabels } from "./quizLabels";
import { AppQuizStartScreen } from "./AppQuizStartScreen";
import { AppQuizQuestionScreen } from "./AppQuizQuestionScreen";
import { AppQuizResultScreen } from "./AppQuizResultScreen";

export { QUIZ_LABELS, getQuizLabels };
export type { QuizLabels };

export interface AppQuizProps {
  quiz: AnyQuiz;
  locale?: string;
  className?: string;
  autoStart?: boolean;
  onComplete?: (result: QuizResult | TriviaResult) => void;
}

function shuffleArray<T>(array: readonly T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function AppQuiz({
  quiz,
  locale = "pt",
  className = "",
  autoStart = false,
  onComplete,
}: AppQuizProps) {
  const currentLocale = locale === "pt" || locale === "es" ? locale : "en";
  const labels = getQuizLabels(currentLocale);
  const isTrivia = isTriviaQuiz(quiz);

  const quizMeta = QUIZ_REGISTRY.find((q) => q.id === quiz.id);
  const categoryKey =
    ("category" in quiz && typeof quiz.category === "string"
      ? quiz.category
      : undefined) ||
    quizMeta?.category ||
    (isTrivia ? "sports" : "personality");

  const catConfig = CATEGORY_CONFIG[categoryKey];
  const categoryName =
    catConfig?.name[currentLocale] ||
    catConfig?.name.en ||
    (isTrivia ? labels.triviaBadge : labels.personalityBadge);
  const CategoryIcon = catConfig?.icon || Sparkles;
  const badgeBg = catConfig?.badgeBg || "bg-primary";
  const badgeColor = catConfig?.badgeColor || "text-background";

  const [quizState, setQuizState] = useState<"idle" | "active" | "complete">(
    autoStart ? "active" : "idle",
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, string>
  >({});
  const [personalityResult, setPersonalityResult] = useState<QuizResult | null>(
    null,
  );
  const [triviaResult, setTriviaResult] = useState<TriviaResult | null>(null);

  const [triviaRevealed, setTriviaRevealed] = useState<boolean>(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [shuffledOptionsMap, setShuffledOptionsMap] = useState<
    Record<string, (Option | TriviaOption)[]>
  >({});

  const totalQuestions = quiz.questions.length;
  const currentQuestion = quiz.questions[currentQuestionIndex];
  const estimatedMin = Math.max(1, Math.round(totalQuestions * 0.4));

  const randomizeAllOptions = useCallback(() => {
    const newMap: Record<string, (Option | TriviaOption)[]> = {};
    quiz.questions.forEach((q) => {
      newMap[q.id] = shuffleArray(q.options);
    });
    setShuffledOptionsMap(newMap);
  }, [quiz.questions]);

  useEffect(() => {
    randomizeAllOptions();
  }, [randomizeAllOptions]);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  const startTimer = useCallback(
    (seconds: number) => {
      clearTimer();
      setTimeRemaining(seconds);
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev === null || prev <= 1) {
            clearTimer();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    },
    [clearTimer],
  );

  const triggerConfetti = useCallback(() => {
    if (typeof window === "undefined") return;
    const prefersReducedMotion =
      typeof window.matchMedia === "function"
        ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
        : false;
    if (prefersReducedMotion) return;

    confetti({
      particleCount: 130,
      spread: 75,
      origin: { y: 0.55 },
      colors: ["#c3e652", "#5ce4dd", "#e86298", "#ffffff"],
    });
  }, []);

  const finalizeQuiz = useCallback(
    (finalAnswers: Record<string, string>) => {
      clearTimer();
      setQuizState("complete");
      triggerConfetti();

      if (isTrivia) {
        const tResult = calculateTriviaResult(quiz as TriviaQuiz, finalAnswers);
        setTriviaResult(tResult);
        onComplete?.(tResult);
      } else {
        const pResult = calculateResult(quiz as Quiz, finalAnswers);
        setPersonalityResult(pResult);
        onComplete?.(pResult);
      }
    },
    [quiz, isTrivia, clearTimer, triggerConfetti, onComplete],
  );

  const handleStart = () => {
    randomizeAllOptions();
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    setPersonalityResult(null);
    setTriviaResult(null);
    setTriviaRevealed(false);
    setQuizState("active");

    if (isTrivia) {
      const triviaQuiz = quiz as TriviaQuiz;
      const limit =
        triviaQuiz.questions[0]?.timeLimitSeconds ??
        triviaQuiz.timeLimitSeconds;
      if (limit) startTimer(limit);
    }
  };

  useEffect(() => {
    if (
      isTrivia &&
      timeRemaining === 0 &&
      quizState === "active" &&
      !triviaRevealed
    ) {
      clearTimer();
      const questionId = currentQuestion?.id;
      if (questionId) {
        setSelectedAnswers((prev) => ({
          ...prev,
          [questionId]: "__timeout__",
        }));
        setTriviaRevealed(true);
      }
    }
  }, [
    timeRemaining,
    isTrivia,
    quizState,
    triviaRevealed,
    currentQuestion?.id,
    clearTimer,
  ]);

  const handleSelectOption = (optionId: string) => {
    if (isTrivia && triviaRevealed) return;

    const questionId = currentQuestion.id;
    const updatedAnswers = { ...selectedAnswers, [questionId]: optionId };
    setSelectedAnswers(updatedAnswers);

    if (isTrivia) {
      clearTimer();
      setTriviaRevealed(true);
    }
  };

  const handleNextQuestion = () => {
    if (!currentQuestion) return;
    const hasAnswer = Boolean(selectedAnswers[currentQuestion.id]);
    if (!hasAnswer) return;

    if (currentQuestionIndex + 1 >= totalQuestions) {
      finalizeQuiz(selectedAnswers);
    } else {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);

      if (isTrivia) {
        const nextQ = quiz.questions[nextIndex];
        const nextAlreadyAnswered = Boolean(selectedAnswers[nextQ?.id]);
        setTriviaRevealed(nextAlreadyAnswered);

        if (!nextAlreadyAnswered) {
          const triviaQuiz = quiz as TriviaQuiz;
          const limit =
            triviaQuiz.questions[nextIndex]?.timeLimitSeconds ??
            triviaQuiz.timeLimitSeconds;
          if (limit) startTimer(limit);
        }
      }
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      const prevIndex = currentQuestionIndex - 1;
      setCurrentQuestionIndex(prevIndex);

      if (isTrivia) {
        clearTimer();
        const prevQ = quiz.questions[prevIndex];
        const prevAlreadyAnswered = Boolean(selectedAnswers[prevQ?.id]);
        setTriviaRevealed(prevAlreadyAnswered);
      }
    }
  };

  const currentOptions = useMemo(() => {
    if (!currentQuestion) return [];
    return shuffledOptionsMap[currentQuestion.id] || currentQuestion.options;
  }, [currentQuestion, shuffledOptionsMap]);

  return (
    <div className={`w-full mx-auto select-none ${className}`}>
      {quizState === "idle" && (
        <AppQuizStartScreen
          title={quiz.title}
          description={quiz.description}
          categoryName={categoryName}
          CategoryIcon={CategoryIcon}
          badgeBg={badgeBg}
          badgeColor={badgeColor}
          totalQuestions={totalQuestions}
          estimatedMin={estimatedMin}
          labels={labels}
          onStart={handleStart}
        />
      )}

      {quizState === "active" && currentQuestion && (
        <AppQuizQuestionScreen
          question={currentQuestion}
          questionIndex={currentQuestionIndex}
          totalQuestions={totalQuestions}
          options={currentOptions}
          selectedAnswerId={selectedAnswers[currentQuestion.id]}
          isTrivia={isTrivia}
          triviaRevealed={triviaRevealed}
          timeRemaining={timeRemaining}
          labels={labels}
          onSelectOption={handleSelectOption}
          onPrevious={handlePreviousQuestion}
          onNext={handleNextQuestion}
        />
      )}

      {quizState === "complete" && (
        <AppQuizResultScreen
          quizId={quiz.id}
          quizTitle={quiz.title}
          isTrivia={isTrivia}
          triviaResult={triviaResult}
          personalityResult={personalityResult}
          currentLocale={currentLocale}
          labels={labels}
          onRetake={handleStart}
        />
      )}
    </div>
  );
}

export default AppQuiz;
