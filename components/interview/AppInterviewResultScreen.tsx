import Link from "next/link";
import { CheckCircle2, XCircle, RotateCcw } from "lucide-react";
import type {
  InterviewQuestion,
  QuizLevel,
  UserAnswer,
} from "@/lib/interviewTypes";
import AppCard from "@/components/ui/AppCard";
import AppButton from "@/components/ui/AppButton";
import type { InterviewQuizLabels } from "./interviewQuizLabels";

export interface AppInterviewResultScreenProps {
  title: string;
  level: QuizLevel | null;
  questions: InterviewQuestion[];
  userAnswers: UserAnswer[];
  labels: InterviewQuizLabels;
  backHref?: string;
  onRetake: () => void;
  onChooseLevel: () => void;
}

export function AppInterviewResultScreen({
  title,
  level,
  questions,
  userAnswers,
  labels,
  backHref = "/interview",
  onRetake,
  onChooseLevel,
}: AppInterviewResultScreenProps) {
  const totalQuestions = questions.length;
  const correctCount = userAnswers.filter((a) => a.correct).length;
  const scoreRatio =
    totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const levelLabel = level ? labels.levelLabels[level] : labels.levelLabels.all;

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
          <div className="text-xs text-secondary font-semibold uppercase">
            {labels.scoreSummary(scoreRatio, evaluation.title)}
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold uppercase text-foreground">
            {evaluation.title}
          </h2>
          <p className="text-label/90 leading-relaxed max-w-3xl">
            {evaluation.desc}
          </p>
        </div>

        <div className="pt-6 border-t border-border/50 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <AppButton
              color="secondary"
              small
              onClick={onRetake}
              className="w-full sm:w-auto whitespace-nowrap"
            >
              <RotateCcw className="w-3.5 h-3.5 shrink-0 mr-1.5" />
              {labels.retake}
            </AppButton>

            <AppButton
              color="tertiary"
              small
              onClick={onChooseLevel}
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
        <h3 className="text-sm font-bold uppercase text-foreground">
          {labels.reviewHeading}
        </h3>

        <div className="space-y-3">
          {questions.map((q, qIndex) => {
            const ans = userAnswers[qIndex];
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
                      <div className="space-y-1 pt-1 text-sm">
                        <p className="text-red-700 dark:text-red-400 bg-red-400/10 p-3 font-medium">
                          {labels.yourAnswer} {q.options[ans.chosenIndex]}
                        </p>
                        <p className="text-emerald-700 dark:text-emerald-500 p-3 bg-emerald-400/10 font-medium">
                          {labels.correctAnswer} {q.options[q.correctIndex]}
                        </p>
                      </div>
                    )}

                    <p className="text-label/90 leading-relaxed pt-1 text-sm">
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

export default AppInterviewResultScreen;
