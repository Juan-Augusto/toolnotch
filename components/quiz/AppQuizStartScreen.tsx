import AppCard from "@/components/ui/AppCard";
import AppBadge from "@/components/ui/AppBadge";
import AppButton from "@/components/ui/AppButton";
import type { QuizLabels } from "./quizLabels";
import type { LucideIcon } from "lucide-react";

export interface AppQuizStartScreenProps {
  title: string;
  description: string;
  categoryName: string;
  CategoryIcon: LucideIcon;
  badgeBg: string;
  badgeColor: string;
  totalQuestions: number;
  estimatedMin: number;
  labels: QuizLabels;
  onStart: () => void;
}

export function AppQuizStartScreen({
  title,
  description,
  categoryName,
  CategoryIcon,
  badgeBg,
  badgeColor,
  totalQuestions,
  estimatedMin,
  labels,
  onStart,
}: AppQuizStartScreenProps) {
  return (
    <AppCard border hover={false} className="p-7 sm:p-10">
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-2.5">
          <AppBadge
            bg={badgeBg}
            text={badgeColor}
            icon={<CategoryIcon className="w-3.5 h-3.5" />}
          >
            {categoryName}
          </AppBadge>

          <span className="text-[11px] text-label uppercase">
            {totalQuestions} {labels.questionsLabel} • ~{estimatedMin}{" "}
            {labels.minLabel}
          </span>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-wider text-foreground mb-2">
            {title}
          </h1>
          <p className="text-label/90 text-sm sm:text-base leading-relaxed max-w-3xl">
            {description}
          </p>
        </div>

        <div className="pt-2">
          <AppButton
            color="primary"
            withArrow
            onClick={onStart}
            className="w-full sm:w-auto text-sm"
          >
            {labels.startQuiz}
          </AppButton>
        </div>
      </div>
    </AppCard>
  );
}

export default AppQuizStartScreen;
