import { motion } from "framer-motion";
import {
  Clock,
  ArrowLeft,
  Check,
  ExternalLink,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import AppCard from "@/components/ui/AppCard";
import AppButton from "@/components/ui/AppButton";
import {
  Question,
  TriviaQuestion,
  Option,
  TriviaOption,
  isTriviaQuestion,
} from "@/lib/quizTypes";
import type { QuizLabels } from "./quizLabels";

const OPTION_LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H"];

export interface AppQuizQuestionScreenProps {
  question: Question | TriviaQuestion;
  questionIndex: number;
  totalQuestions: number;
  options: (Option | TriviaOption)[];
  selectedAnswerId?: string;
  isTrivia: boolean;
  triviaRevealed: boolean;
  timeRemaining: number | null;
  labels: QuizLabels;
  onSelectOption: (optionId: string) => void;
  onPrevious: () => void;
  onNext: () => void;
}

export function AppQuizQuestionScreen({
  question,
  questionIndex,
  totalQuestions,
  options,
  selectedAnswerId,
  isTrivia,
  triviaRevealed,
  timeRemaining,
  labels,
  onSelectOption,
  onPrevious,
  onNext,
}: AppQuizQuestionScreenProps) {
  const isTriviaQ = isTriviaQuestion(question);
  const isLastQuestion = questionIndex === totalQuestions - 1;
  const hasCurrentAnswer = Boolean(selectedAnswerId);

  const progressPercent =
    totalQuestions > 0
      ? Math.round((questionIndex / totalQuestions) * 100)
      : 0;

  return (
    <div className="space-y-6">
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-foreground font-bold tracking-wider">
            {labels.questionOf}{" "}
            <span className="text-primary font-bold">
              {String(questionIndex + 1).padStart(2, "0")}
            </span>{" "}
            <span className="text-label">
              / {String(totalQuestions).padStart(2, "0")}
            </span>
          </span>

          <div className="flex items-center gap-3">
            {isTrivia && timeRemaining !== null && (
              <span
                className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-[2px] ${
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

        <div className="w-full h-2 rounded-[2px] bg-tertiary/60 border border-border overflow-hidden relative">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{
              width: `${((questionIndex + 1) / totalQuestions) * 100}%`,
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
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
          <span className="text-xs text-primary font-bold tracking-wider uppercase block mb-1">
            {labels.questionOf} {questionIndex + 1}
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-foreground leading-snug uppercase">
            {question.text}
          </h2>
        </div>

        <div className="space-y-3">
          {options.map((option, index) => {
            const isSelected = selectedAnswerId === option.id;
            const isTriviaAnswerRevealed = isTrivia && triviaRevealed;
            const correctAnswerId = isTriviaQ ? question.correctAnswerId : null;
            const isCorrect = isTrivia && option.id === correctAnswerId;

            let optionBorder = "border-border hover:bg-foreground/5 text-label";

            if (isTriviaAnswerRevealed) {
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
            } else if (isSelected) {
              optionBorder =
                "border-secondary/70 bg-secondary/80 text-white dark:bg-secondary/90 dark:text-black font-bold";
            }

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => onSelectOption(option.id)}
                disabled={triviaRevealed}
                className={`w-full text-left p-4 rounded-[2px] border transition-all duration-150 flex items-center justify-between gap-3.5 cursor-pointer disabled:cursor-not-allowed group ${optionBorder}`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`w-7 h-7 shrink-0 text-xs font-bold rounded-[2px] flex items-center justify-center border transition-colors ${
                      isTriviaAnswerRevealed && isCorrect
                        ? "bg-white text-emerald-700 border-white dark:bg-black dark:text-emerald-400 dark:border-black"
                        : isTriviaAnswerRevealed && isSelected && !isCorrect
                          ? "bg-white text-red-700 border-white dark:bg-black dark:text-red-400 dark:border-black"
                          : isSelected
                            ? "bg-secondary text-background border-background/50 dark:border-black/50"
                            : "bg-tertiary/70 text-label border-border group-hover:border-secondary group-hover:text-foreground"
                    }`}
                  >
                    {OPTION_LETTERS[index] || index + 1}
                  </span>
                  <span className="text-xs sm:text-sm font-medium break-words">
                    {option.text}
                  </span>
                </div>

                {isTriviaAnswerRevealed && (
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

        {isTrivia && triviaRevealed && isTriviaQ && question.explanation && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-5 p-4 bg-tertiary/40 border border-dashed border-border/60 rounded-[2px]"
          >
            <span className="text-[11px] font-bold text-primary uppercase block mb-1">
              {labels.explanation}
            </span>
            <p className="text-xs text-foreground/90 leading-relaxed">
              {question.explanation}
            </p>
            {question.source && (
              <a
                href={question.source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] text-label hover:text-primary mt-2 transition-colors"
              >
                {labels.source}: {question.source.name}
                <ExternalLink className="w-3 h-3 ml-0.5" />
              </a>
            )}
          </motion.div>
        )}

        <div className="mt-6 pt-4 border-t border-dashed border-border/40 flex items-center justify-between gap-3">
          <AppButton
            type="button"
            color="tertiary"
            onClick={onPrevious}
            disabled={questionIndex === 0}
            small
            className="text-xs"
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
            onClick={onNext}
            disabled={!hasCurrentAnswer}
            small
            className="text-xs"
          >
            <span className="inline-flex items-center gap-1.5">
              {isLastQuestion && <Check className="w-3.5 h-3.5 mr-0.5" />}
              {isLastQuestion ? labels.finish : labels.next}
            </span>
          </AppButton>
        </div>
      </AppCard>
    </div>
  );
}

export default AppQuizQuestionScreen;
