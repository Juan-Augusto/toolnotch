import { useEffect, useCallback } from "react";
import { ArrowLeft, CheckCircle2, XCircle, Check } from "lucide-react";
import type {
  InterviewQuestion,
  QuizLevel,
  ExplanationTab,
  UserAnswer,
} from "@/lib/interviewTypes";
import AppCard from "@/components/ui/AppCard";
import AppButton from "@/components/ui/AppButton";
import AppTabs, { type AppTabItem } from "@/components/ui/AppTabs";
import AppInterviewCodeSnippet from "./AppInterviewCodeSnippet";
import type { InterviewQuizLabels } from "./interviewQuizLabels";

const OPTION_LETTERS = ["A", "B", "C", "D"];

export interface AppInterviewQuestionScreenProps {
  currentQuestion: InterviewQuestion;
  currentIndex: number;
  totalQuestions: number;
  level: QuizLevel | null;
  answered: boolean;
  userAnswer?: UserAnswer;
  activeTab: ExplanationTab;
  onChangeTab: (tab: ExplanationTab) => void;
  secondaryTabTitle: string;
  labels: InterviewQuizLabels;
  onAnswer: (chosenIndex: number) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export function AppInterviewQuestionScreen({
  currentQuestion,
  currentIndex,
  totalQuestions,
  level,
  answered,
  userAnswer,
  activeTab,
  onChangeTab,
  secondaryTabTitle,
  labels,
  onAnswer,
  onNext,
  onPrevious,
}: AppInterviewQuestionScreenProps) {
  const progressPercent =
    totalQuestions > 0
      ? Math.round(((currentIndex + 1) / totalQuestions) * 100)
      : 0;
  const isLastQuestion = currentIndex === totalQuestions - 1;
  const levelLabel = level ? labels.levelLabels[level] : labels.levelLabels.all;
  const chosenAnswerIndex = answered ? userAnswer?.chosenIndex : undefined;

  const cycleTab = useCallback(() => {
    const available: ExplanationTab[] = ["why"];
    if (currentQuestion?.compiledJS) available.push("compiled");
    if (currentQuestion?.bestPractice) available.push("best");
    const currentIdx = available.indexOf(activeTab);
    onChangeTab(available[(currentIdx + 1) % available.length] || "why");
  }, [currentQuestion, activeTab, onChangeTab]);

  useEffect(() => {
    const keyHandler = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;
      if (["1", "2", "3", "4"].includes(e.key) && !answered) {
        onAnswer(parseInt(e.key, 10) - 1);
      }
      if ((e.key === "Enter" || e.key === "ArrowRight") && answered) {
        e.preventDefault();
        onNext();
      }
      if (e.key === "Tab" && answered) {
        e.preventDefault();
        cycleTab();
      }
    };
    window.addEventListener("keydown", keyHandler);
    return () => window.removeEventListener("keydown", keyHandler);
  }, [answered, onAnswer, onNext, cycleTab]);

  const quizTabs: AppTabItem[] = [
    {
      id: "why",
      label: labels.explanation,
      content: (
        <div className="space-y-2">
          <p className="text-foreground/90 leading-relaxed">
            {currentQuestion.explanation}
          </p>
          {currentQuestion.source && (
            <p className="text-[11px] text-label pt-1">
              {labels.reference} {currentQuestion.source}
            </p>
          )}
        </div>
      ),
    },
  ];

  if (currentQuestion.compiledJS) {
    quizTabs.push({
      id: "compiled",
      label: secondaryTabTitle,
      content: (
        <div>
          <AppInterviewCodeSnippet code={currentQuestion.compiledJS} />
        </div>
      ),
    });
  }

  if (currentQuestion.bestPractice) {
    quizTabs.push({
      id: "best",
      label: labels.bestPractice,
      content: (
        <div>
          <p className="text-foreground/90 leading-relaxed">
            {currentQuestion.bestPractice}
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
              {String(currentIndex + 1).padStart(2, "0")}
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
          <span className="text-xs text-label font-semibold tracking-wide uppercase block mb-2">
            {labels.questionNumTopic(currentIndex + 1, currentQuestion.topic)}
          </span>
          <h2 className="font-bold rounded-sm text-lg sm:text-xl text-foreground leading-snug">
            {currentQuestion.question}
          </h2>
        </div>

        {currentQuestion.code && (
          <div className="mb-6">
            <AppInterviewCodeSnippet code={currentQuestion.code} />
          </div>
        )}

        <div className="space-y-3">
          {currentQuestion.options.map((optionText, optIndex) => {
            const isSelected = chosenAnswerIndex === optIndex;
            const isCorrect = optIndex === currentQuestion.correctIndex;

            let optionBorder = "border-border hover:bg-foreground/5 text-label";
            if (answered) {
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
                disabled={answered}
                onClick={() => onAnswer(optIndex)}
                className={`w-full text-left p-4 rounded-[2px] border transition-all duration-150 flex items-center justify-between gap-3.5 cursor-pointer disabled:cursor-default group ${optionBorder}`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`w-7 h-7 shrink-0 text-xs font-bold rounded-[2px] flex items-center justify-center border transition-colors ${
                      answered && isCorrect
                        ? "bg-white text-emerald-700 border-white dark:bg-black dark:text-emerald-400 dark:border-black"
                        : answered && isSelected && !isCorrect
                          ? "bg-white text-red-700 border-white dark:bg-black dark:text-red-400 dark:border-black"
                          : isSelected
                            ? "bg-secondary text-background border-background/50 dark:border-black/50"
                            : "bg-tertiary/70 text-label border-border group-hover:border-secondary group-hover:text-foreground"
                    }`}
                  >
                    {OPTION_LETTERS[optIndex] || optIndex + 1}
                  </span>
                  <span className="font-medium break-words">{optionText}</span>
                </div>

                {answered && (
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

        {answered && (
          <div className="mt-5 p-4 border-dashed-5 rounded-[2px]">
            <AppTabs
              tabs={quizTabs}
              value={activeTab}
              onChange={(tabId) => onChangeTab(tabId as ExplanationTab)}
              color="primary"
              withRail
            />
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-dashed border-border/40 flex items-center justify-between gap-3">
          <AppButton
            type="button"
            color="tertiary"
            onClick={onPrevious}
            disabled={currentIndex === 0}
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
            onClick={onNext}
            disabled={!answered}
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

export default AppInterviewQuestionScreen;
