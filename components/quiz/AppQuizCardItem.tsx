import Link from "next/link";
import { ArrowRight } from "lucide-react";
import AppCard from "@/components/ui/AppCard";
import AppBadge from "@/components/ui/AppBadge";
import {
  CATEGORY_CONFIG,
  type QuizCardData,
  type QuizzesHubLabels,
} from "./quizzesHubConfig";

export interface AppQuizCardItemProps {
  quiz: QuizCardData;
  currentLocale: string;
  labels: QuizzesHubLabels;
}

export function AppQuizCardItem({
  quiz,
  currentLocale,
  labels,
}: AppQuizCardItemProps) {
  const config = CATEGORY_CONFIG[quiz.category];
  const categoryName = config?.name[currentLocale] || config?.name.en || "";
  const estimatedMin = Math.max(2, Math.round((quiz.questionCount || 8) * 0.4));
  const Icon = config?.icon;

  return (
    <Link href={`/quiz/${quiz.id}`} className="block group h-full select-none">
      <AppCard
        withCornerAccents={false}
        hover
        className="h-full flex flex-col justify-between !p-6 sm:!p-7 transition-all"
      >
        <div>
          <div className="flex items-center justify-between gap-2 mb-4">
            <AppBadge
              bg={config?.badgeBg}
              text={config?.badgeColor}
              icon={Icon && <Icon className="w-4 h-4 shrink-0" />}
            >
              {categoryName}
            </AppBadge>

            <span className="font-mono text-[11px] text-label/80 uppercase">
              {quiz.questionCount > 0
                ? `${quiz.questionCount} ${labels.questionsLabel} • ~${estimatedMin} ${labels.minLabel}`
                : `~${estimatedMin} ${labels.minLabel}`}
            </span>
          </div>

          <h3 className="uppercase text-base sm:text-lg font-bold tracking-wide text-foreground group-hover:text-secondary transition-colors leading-snug mb-2.5">
            {quiz.title}
          </h3>

          <p className="text-xs sm:text-sm text-label/85 leading-relaxed line-clamp-2">
            {quiz.description}
          </p>
        </div>

        <div className="mt-6 pt-4 border-t border-border/40 flex items-center justify-between">
          <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-label group-hover:text-secondary transition-colors">
            {labels.playQuiz}
          </span>
          <ArrowRight className="w-4 h-4 text-label group-hover:text-secondary group-hover:translate-x-1 transition-all" />
        </div>
      </AppCard>
    </Link>
  );
}

export default AppQuizCardItem;
