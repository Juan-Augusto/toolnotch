"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Share2,
  Copy,
  Check,
  Download,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  Clock,
  ExternalLink,
  Award,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import confetti from "canvas-confetti";

import AppCard from "@/components/ui/AppCard";
import AppBadge from "@/components/ui/AppBadge";
import AppButton from "@/components/ui/AppButton";
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

export interface AppQuizProps {
  quiz: AnyQuiz;
  locale?: string;
  className?: string;
  autoStart?: boolean;
  onComplete?: (result: QuizResult | TriviaResult) => void;
}

const QUIZ_LABELS = {
  pt: {
    badge: "QUIZ INTERATIVO",
    triviaBadge: "TRIVIA",
    personalityBadge: "PERSONALIDADE",
    questionsLabel: "perguntas",
    minLabel: "min",
    startQuiz: "COMEÇAR QUIZ",
    questionOf: "PERGUNTA",
    of: "DE",
    completed: "CONCLUÍDO",
    previous: "ANTERIOR",
    next: "PRÓXIMA",
    correct: "CORRETO",
    incorrect: "INCORRETO",
    explanation: "EXPLICAÇÃO",
    source: "Fonte",
    resultBadge: "SEU RESULTADO",
    scoreBadge: "PONTUAÇÃO FINAL",
    traits: "CARACTERÍSTICAS",
    shareTitle: "COMPARTILHAR RESULTADO",
    shareWhatsApp: "WhatsApp",
    shareTwitter: "X / Twitter",
    shareCopy: "Copiar Link",
    shareNative: "Compartilhar",
    copied: "Copiado!",
    downloadCard: "Baixar Card (Story)",
    downloading: "Gerando...",
    retake: "JOGAR NOVAMENTE",
    moreQuizzes: "EXPLORAR OUTROS QUIZZES",
    perks: ["100% GRATUITO", "SEM CADASTRO", "RESULTADO INSTANTÂNEO"],
    hits: "acertos",
    brandFooter: "toolnotch.com • Quizzes & Ferramentas Gratuitas",
  },
  en: {
    badge: "INTERACTIVE QUIZ",
    triviaBadge: "TRIVIA",
    personalityBadge: "PERSONALITY",
    questionsLabel: "questions",
    minLabel: "min",
    startQuiz: "START QUIZ",
    questionOf: "QUESTION",
    of: "OF",
    completed: "COMPLETED",
    previous: "PREVIOUS",
    next: "NEXT",
    correct: "CORRECT",
    incorrect: "INCORRECT",
    explanation: "EXPLANATION",
    source: "Source",
    resultBadge: "YOUR RESULT",
    scoreBadge: "FINAL SCORE",
    traits: "TRAITS",
    shareTitle: "SHARE RESULT",
    shareWhatsApp: "WhatsApp",
    shareTwitter: "X / Twitter",
    shareCopy: "Copy Link",
    shareNative: "Share",
    copied: "Copied!",
    downloadCard: "Download Card (Story)",
    downloading: "Generating...",
    retake: "RETAKE QUIZ",
    moreQuizzes: "EXPLORE MORE QUIZZES",
    perks: ["100% FREE", "NO SIGN-UP", "INSTANT RESULTS"],
    hits: "correct",
    brandFooter: "toolnotch.com • Free Quizzes & Tools",
  },
  es: {
    badge: "QUIZ INTERACTIVO",
    triviaBadge: "TRIVIA",
    personalityBadge: "PERSONALIDAD",
    questionsLabel: "preguntas",
    minLabel: "min",
    startQuiz: "COMENZAR QUIZ",
    questionOf: "PREGUNTA",
    of: "DE",
    completed: "COMPLETADO",
    previous: "ANTERIOR",
    next: "SIGUIENTE",
    correct: "CORRECTO",
    incorrect: "INCORRECTO",
    explanation: "EXPLICACIÓN",
    source: "Fuente",
    resultBadge: "TU RESULTADO",
    scoreBadge: "PUNTUACIÓN FINAL",
    traits: "CARACTERÍSTICAS",
    shareTitle: "COMPARTIR RESULTADO",
    shareWhatsApp: "WhatsApp",
    shareTwitter: "X / Twitter",
    shareCopy: "Copiar Enlace",
    shareNative: "Compartir",
    copied: "¡Copiado!",
    downloadCard: "Descargar Card (Story)",
    downloading: "Generando...",
    retake: "REPETIR QUIZ",
    moreQuizzes: "EXPLORAR MÁS QUIZZES",
    perks: ["100% GRATIS", "SIN REGISTRO", "RESULTADO INSTANTÁNEO"],
    hits: "aciertos",
    brandFooter: "toolnotch.com • Quizzes & Herramientas Gratuitas",
  },
};

const OPTION_LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H"];

/**
 * Fisher-Yates shuffle to randomize an array without mutating original
 */
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
  const labels = QUIZ_LABELS[currentLocale] || QUIZ_LABELS.en;
  const isTrivia = isTriviaQuiz(quiz);

  const [quizState, setQuizState] = useState<"idle" | "active" | "complete">(
    autoStart ? "active" : "idle"
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [personalityResult, setPersonalityResult] = useState<QuizResult | null>(null);
  const [triviaResult, setTriviaResult] = useState<TriviaResult | null>(null);

  // Trivia state
  const [triviaRevealed, setTriviaRevealed] = useState<boolean>(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Randomized options map (persists stably while on a question)
  const [shuffledOptionsMap, setShuffledOptionsMap] = useState<
    Record<string, (Option | TriviaOption)[]>
  >({});

  // Sharing feedback states
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState<boolean>(false);
  const resultCardRef = useRef<HTMLDivElement>(null);

  const totalQuestions = quiz.questions.length;
  const currentQuestion = quiz.questions[currentQuestionIndex];
  const estimatedMin = Math.max(1, Math.round(totalQuestions * 0.4));

  // Initialize randomized options map
  const randomizeAllOptions = useCallback(() => {
    const newMap: Record<string, (Option | TriviaOption)[]> = {};
    quiz.questions.forEach((q) => {
      newMap[q.id] = shuffleArray(q.options);
    });
    setShuffledOptionsMap(newMap);
  }, [quiz.questions]);

  // Initial options randomization
  useEffect(() => {
    randomizeAllOptions();
  }, [randomizeAllOptions]);

  // Clean timer on unmount
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
    [clearTimer]
  );

  // Confetti trigger on completion
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

  // Handle Start Quiz
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
        triviaQuiz.questions[0]?.timeLimitSeconds ?? triviaQuiz.timeLimitSeconds;
      if (limit) startTimer(limit);
    }
  };

  // Handle Retake Quiz
  const handleRetake = () => {
    handleStart();
  };

  // Advance to next question or complete
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
    [quiz, isTrivia, clearTimer, triggerConfetti, onComplete]
  );

  // Auto-advance trivia when timer hits 0
  useEffect(() => {
    if (isTrivia && timeRemaining === 0 && quizState === "active" && !triviaRevealed) {
      const q = quiz.questions[currentQuestionIndex];
      handleSelectOption("__timeout__");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRemaining, isTrivia, quizState, triviaRevealed]);

  // Handle Option Select
  const handleSelectOption = (optionId: string) => {
    if (triviaRevealed) return;

    const questionId = currentQuestion.id;
    const updatedAnswers = { ...selectedAnswers, [questionId]: optionId };
    setSelectedAnswers(updatedAnswers);

    if (isTrivia) {
      clearTimer();
      setTriviaRevealed(true);

      setTimeout(() => {
        setTriviaRevealed(false);
        if (currentQuestionIndex + 1 >= totalQuestions) {
          finalizeQuiz(updatedAnswers);
        } else {
          const nextIndex = currentQuestionIndex + 1;
          setCurrentQuestionIndex(nextIndex);
          const triviaQuiz = quiz as TriviaQuiz;
          const limit =
            triviaQuiz.questions[nextIndex]?.timeLimitSeconds ??
            triviaQuiz.timeLimitSeconds;
          if (limit) startTimer(limit);
        }
      }, 1200);
    } else {
      // Personality quiz: immediate advance
      if (currentQuestionIndex + 1 >= totalQuestions) {
        finalizeQuiz(updatedAnswers);
      } else {
        setCurrentQuestionIndex((prev) => prev + 1);
      }
    }
  };

  // Previous question (for personality quiz)
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0 && !triviaRevealed) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  // Options for current question (shuffled or fallback)
  const currentOptions = useMemo(() => {
    if (!currentQuestion) return [];
    return shuffledOptionsMap[currentQuestion.id] || currentQuestion.options;
  }, [currentQuestion, shuffledOptionsMap]);

  // Share message
  const shareMessage = useMemo(() => {
    if (isTrivia && triviaResult) {
      return (
        triviaResult.tier.shareText ||
        `Fiz o quiz "${quiz.title}" e acertei ${triviaResult.score} de ${triviaResult.total}! Teste seus conhecimentos no Toolnotch:`
      );
    }
    if (personalityResult) {
      return (
        personalityResult.shareText ||
        `Meu resultado no quiz "${quiz.title}" foi: ${personalityResult.title}! Descubra o seu no Toolnotch:`
      );
    }
    return `Confira o quiz "${quiz.title}" no Toolnotch:`;
  }, [isTrivia, triviaResult, personalityResult, quiz.title]);

  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  // Social share handlers
  const handleShareWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(
      `${shareMessage} ${currentUrl}`
    )}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleShareTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      shareMessage
    )}&url=${encodeURIComponent(currentUrl)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleCopyLink = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(currentUrl);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      }
    } catch (e) {
      console.error("Could not copy link", e);
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: quiz.title,
          text: shareMessage,
          url: currentUrl,
        });
      } catch (err) {
        // User cancelled or share not supported
      }
    } else {
      handleCopyLink();
    }
  };

  const handleDownloadCard = async () => {
    if (!resultCardRef.current) return;
    try {
      setIsGeneratingImage(true);
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(resultCardRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
      });
      const link = document.createElement("a");
      link.download = `${quiz.id}-resultado.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Error generating card image", err);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // Progress calculations
  const progressPercent = totalQuestions > 0
    ? Math.round(((currentQuestionIndex) / totalQuestions) * 100)
    : 0;

  return (
    <div className={`w-full max-w-3xl mx-auto select-none ${className}`}>
      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 1. START / IDLE SCREEN                                              */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {quizState === "idle" && (
        <AppCard border hover={false} className="p-7 sm:p-10">
          <div className="space-y-6">
            {/* Top Badges */}
            <div className="flex flex-wrap items-center gap-2.5">
              <AppBadge
                bg="bg-primary"
                text="text-background"
                icon={<Sparkles className="w-3.5 h-3.5" />}
              >
                {isTrivia ? labels.triviaBadge : labels.personalityBadge}
              </AppBadge>

              <span className="text-[11px] font-mono text-label uppercase">
                {totalQuestions} {labels.questionsLabel} • ~{estimatedMin}{" "}
                {labels.minLabel}
              </span>
            </div>

            {/* Quiz Title */}
            <div>
              <div className="flex items-center gap-2.5 mb-2 select-none">
                <span className="font-mono text-xl sm:text-2xl font-bold text-primary">
                  ///
                </span>
                <h1 className="font-mono text-2xl sm:text-3xl font-bold uppercase tracking-wider text-foreground">
                  {quiz.title}
                </h1>
              </div>
              <p className="text-label/90 text-sm sm:text-base leading-relaxed max-w-2xl font-mono">
                {quiz.description}
              </p>
            </div>

            {/* Perks badges */}
            <div className="flex flex-wrap gap-2 pt-2">
              {labels.perks.map((perk) => (
                <span
                  key={perk}
                  className="font-mono text-[11px] text-label/80 bg-tertiary/60 border border-dashed border-border/50 px-2.5 py-1 rounded-[2px]"
                >
                  ✓ {perk}
                </span>
              ))}
            </div>

            {/* Start Button */}
            <div className="pt-4">
              <AppButton
                color="primary"
                withArrow
                onClick={handleStart}
                className="w-full sm:w-auto text-sm"
              >
                {labels.startQuiz}
              </AppButton>
            </div>
          </div>
        </AppCard>
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 2. ACTIVE QUESTION SCREEN                                           */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {quizState === "active" && currentQuestion && (
        <div className="space-y-6">
          {/* Progress Header */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="text-foreground font-bold tracking-wider">
                {labels.questionOf}{" "}
                <span className="text-primary font-bold">
                  {String(currentQuestionIndex + 1).padStart(2, "0")}
                </span>{" "}
                <span className="text-label">
                  / {String(totalQuestions).padStart(2, "0")}
                </span>
              </span>

              <div className="flex items-center gap-3">
                {isTrivia && timeRemaining !== null && (
                  <span
                    className={`inline-flex items-center gap-1 font-mono text-xs px-2 py-0.5 rounded-[2px] ${
                      timeRemaining <= 5
                        ? "bg-red-500/20 text-red-500 font-bold animate-pulse"
                        : "bg-tertiary text-label"
                    }`}
                  >
                    <Clock className="w-3 h-3" />
                    {timeRemaining}s
                  </span>
                )}
                <span className="text-label tracking-wider">
                  {progressPercent}% {labels.completed}
                </span>
              </div>
            </div>

            {/* Progress Bar with Toolnotch cyber aesthetic */}
            <div className="w-full h-2 rounded-[2px] bg-tertiary/60 border border-border/50 overflow-hidden relative">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{
                  width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%`,
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* Question Card */}
          <AnimatePresence initial={false}>
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              <AppCard border hover={false} className="p-6 sm:p-8">
                {/* Question Prompt */}
                <div className="mb-6">
                  <span className="font-mono text-xs text-primary font-bold tracking-wider uppercase block mb-1">
                    /// {labels.questionOf} {currentQuestionIndex + 1}
                  </span>
                  <h2 className="font-mono text-lg sm:text-xl font-bold text-foreground leading-snug uppercase">
                    {currentQuestion.text}
                  </h2>
                </div>

                {/* Randomized Options */}
                <div className="space-y-3">
                  {currentOptions.map((option, index) => {
                    const isSelected =
                      selectedAnswers[currentQuestion.id] === option.id;

                    let optionBorder =
                      "border-border/60 hover:border-primary/80 bg-tertiary/30 hover:bg-tertiary/60 text-foreground";

                    if (isTrivia && triviaRevealed) {
                      const triviaQ = currentQuestion as unknown as {
                        correctAnswerId: string;
                      };
                      const isCorrect = option.id === triviaQ.correctAnswerId;

                      if (isSelected && isCorrect) {
                        optionBorder =
                          "border-green-500 bg-green-500/15 text-green-400 font-bold";
                      } else if (isSelected && !isCorrect) {
                        optionBorder =
                          "border-red-500 bg-red-500/15 text-red-400 font-bold";
                      } else if (!isSelected && isCorrect) {
                        optionBorder =
                          "border-green-500/80 bg-green-500/5 text-green-400";
                      } else {
                        optionBorder =
                          "border-border/30 bg-tertiary/10 text-label/50 opacity-60";
                      }
                    } else if (isSelected) {
                      optionBorder =
                        "border-primary bg-primary/10 text-primary font-bold";
                    }

                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => handleSelectOption(option.id)}
                        disabled={triviaRevealed}
                        className={`w-full text-left p-4 rounded-[2px] border transition-all duration-150 flex items-center justify-between gap-3.5 cursor-pointer disabled:cursor-not-allowed group ${optionBorder}`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span
                            className={`w-7 h-7 shrink-0 font-mono text-xs font-bold rounded-[2px] flex items-center justify-center border transition-colors ${
                              isSelected
                                ? "bg-primary text-background border-primary"
                                : "bg-tertiary/70 text-label border-border/60 group-hover:border-primary group-hover:text-foreground"
                            }`}
                          >
                            {OPTION_LETTERS[index] || index + 1}
                          </span>
                          <span className="font-mono text-xs sm:text-sm font-medium tracking-wide break-words">
                            {option.text}
                          </span>
                        </div>

                        {/* Trivia status indicator icons */}
                        {isTrivia && triviaRevealed && (
                          <div className="shrink-0">
                            {option.id ===
                              (currentQuestion as unknown as {
                                correctAnswerId: string;
                              }).correctAnswerId && (
                              <CheckCircle2 className="w-5 h-5 text-green-400" />
                            )}
                            {isSelected &&
                              option.id !==
                                (currentQuestion as unknown as {
                                  correctAnswerId: string;
                                }).correctAnswerId && (
                                <XCircle className="w-5 h-5 text-red-400" />
                              )}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Trivia Explanation box */}
                {isTrivia &&
                  triviaRevealed &&
                  (currentQuestion as unknown as { explanation?: string })
                    .explanation && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-5 p-4 bg-tertiary/40 border border-dashed border-border/60 rounded-[2px]"
                    >
                      <span className="font-mono text-[11px] font-bold text-primary uppercase block mb-1">
                        /// {labels.explanation}
                      </span>
                      <p className="font-mono text-xs text-foreground/90 leading-relaxed">
                        {
                          (currentQuestion as unknown as { explanation?: string })
                            .explanation
                        }
                      </p>
                      {(currentQuestion as unknown as { source?: { name: string; url: string } }).source && (
                        <a
                          href={
                            (currentQuestion as unknown as { source: { url: string } })
                              .source.url
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-mono text-[11px] text-label hover:text-primary mt-2 transition-colors"
                        >
                          {labels.source}:{" "}
                          {
                            (currentQuestion as unknown as { source: { name: string } })
                              .source.name
                          }
                          <ExternalLink className="w-3 h-3 ml-0.5" />
                        </a>
                      )}
                    </motion.div>
                  )}

                {/* Back button (for personality quiz) */}
                {!isTrivia && currentQuestionIndex > 0 && (
                  <div className="mt-6 pt-4 border-t border-dashed border-border/40 flex justify-start">
                    <button
                      type="button"
                      onClick={handlePreviousQuestion}
                      className="font-mono text-xs text-label hover:text-foreground flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      {labels.previous}
                    </button>
                  </div>
                )}
              </AppCard>
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 3. COMPLETE / RESULT SCREEN                                         */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {quizState === "complete" && (
        <div className="space-y-8">
          {/* Card to be downloaded/exported */}
          <div ref={resultCardRef} className="rounded-[2px]">
            <AppCard
              border
              hover={false}
              className="p-7 sm:p-10 text-center relative overflow-hidden"
            >
              {/* Top Result Tag */}
              <div className="inline-flex items-center gap-2 mb-4">
                <AppBadge
                  bg="bg-primary"
                  text="text-background"
                  icon={<Award className="w-3.5 h-3.5" />}
                >
                  {isTrivia ? labels.scoreBadge : labels.resultBadge}
                </AppBadge>
              </div>

              {/* Trivia Score Breakdown */}
              {isTrivia && triviaResult && (
                <div className="mb-6">
                  <div className="font-mono text-4xl sm:text-5xl font-black text-foreground tracking-tight mb-2">
                    {triviaResult.score}{" "}
                    <span className="text-xl sm:text-2xl text-label font-normal">
                      / {triviaResult.total}
                    </span>
                  </div>
                  <div className="font-mono text-sm text-primary font-bold uppercase tracking-wider">
                    {triviaResult.percent}% {labels.hits} • {triviaResult.tier.label}
                  </div>
                </div>
              )}

              {/* Title and Description */}
              <div className="max-w-xl mx-auto space-y-3 mb-6">
                <h2 className="font-mono text-2xl sm:text-3xl font-bold uppercase tracking-wider text-foreground">
                  {isTrivia && triviaResult
                    ? triviaResult.tier.label
                    : personalityResult?.title}
                </h2>
                <p className="font-mono text-xs sm:text-sm text-label/90 leading-relaxed">
                  {isTrivia && triviaResult
                    ? triviaResult.tier.description
                    : personalityResult?.description}
                </p>
              </div>

              {/* Personality Traits Badges */}
              {!isTrivia &&
                personalityResult?.traits &&
                personalityResult.traits.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-2 mb-6">
                    {personalityResult.traits.map((trait) => (
                      <AppBadge
                        key={trait}
                        bg="bg-tertiary"
                        text="text-foreground"
                        className="border border-border/50 text-xs"
                      >
                        #{trait}
                      </AppBadge>
                    ))}
                  </div>
                )}

              {/* Branding footer inside card for social media shares */}
              <div className="pt-6 border-t border-dashed border-border/40 font-mono text-[11px] text-label/70 uppercase tracking-wider">
                {labels.brandFooter}
              </div>
            </AppCard>
          </div>

          {/* Share & Actions Section */}
          <AppCard border hover={false} className="p-6 sm:p-7">
            <div className="space-y-4">
              <div className="flex items-center gap-2 select-none">
                <Share2 className="w-4 h-4 text-primary" />
                <span className="font-mono text-xs sm:text-sm font-bold tracking-wider uppercase text-foreground">
                  {labels.shareTitle}
                </span>
              </div>

              {/* Share Buttons Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {/* WhatsApp */}
                <button
                  type="button"
                  onClick={handleShareWhatsApp}
                  className="font-mono text-xs font-bold uppercase tracking-wider py-2.5 px-3 rounded-[2px] bg-green-500/10 text-green-400 border border-green-500/30 hover:bg-green-500/20 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {labels.shareWhatsApp}
                </button>

                {/* Twitter / X */}
                <button
                  type="button"
                  onClick={handleShareTwitter}
                  className="font-mono text-xs font-bold uppercase tracking-wider py-2.5 px-3 rounded-[2px] bg-tertiary border border-border/60 text-foreground hover:bg-tertiary/70 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {labels.shareTwitter}
                </button>

                {/* Copy Link */}
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="font-mono text-xs font-bold uppercase tracking-wider py-2.5 px-3 rounded-[2px] bg-tertiary border border-border/60 text-foreground hover:bg-tertiary/70 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-primary" />
                      {labels.copied}
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-label" />
                      {labels.shareCopy}
                    </>
                  )}
                </button>

                {/* Download Story Card */}
                <button
                  type="button"
                  onClick={handleDownloadCard}
                  disabled={isGeneratingImage}
                  className="font-mono text-xs font-bold uppercase tracking-wider py-2.5 px-3 rounded-[2px] bg-secondary/15 border border-secondary/40 text-secondary hover:bg-secondary/25 transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Download className="w-3.5 h-3.5" />
                  {isGeneratingImage ? labels.downloading : labels.downloadCard}
                </button>
              </div>

              {/* Native share on mobile */}
              {typeof navigator !== "undefined" && "share" in navigator && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleNativeShare}
                    className="w-full font-mono text-xs font-bold uppercase tracking-wider py-2 rounded-[2px] bg-tertiary/40 border border-dashed border-border/60 text-label hover:text-foreground transition-colors cursor-pointer"
                  >
                    {labels.shareNative}
                  </button>
                </div>
              )}
            </div>
          </AppCard>

          {/* Action Buttons: Retake or Explore More */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <AppButton
              color="secondary"
              small
              onClick={handleRetake}
              className="w-full sm:w-auto"
            >
              <RotateCcw className="w-4 h-4 mr-1.5" />
              {labels.retake}
            </AppButton>

            <Link href={`/${currentLocale}/quizzes`} className="w-full sm:w-auto">
              <AppButton
                color="primary"
                withArrow
                small
                className="w-full sm:w-auto"
              >
                {labels.moreQuizzes}
              </AppButton>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default AppQuiz;
