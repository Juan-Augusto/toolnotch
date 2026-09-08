import Link from "next/link";
import { Sparkles } from "lucide-react";
import AppCard from "@/components/ui/AppCard";
import AppBadge from "@/components/ui/AppBadge";
import AppButton from "@/components/ui/AppButton";
import {
  CATEGORY_CONFIG,
  type QuizCardData,
  type QuizzesHubLabels,
} from "./quizzesHubConfig";

export interface AppFeaturedQuizCardProps {
  quiz: QuizCardData;
  currentLocale: string;
  labels: QuizzesHubLabels;
}

export function AppFeaturedQuizCard({
  quiz,
  currentLocale,
  labels,
}: AppFeaturedQuizCardProps) {
  const categoryConfig = CATEGORY_CONFIG[quiz.category];
  const categoryName =
    categoryConfig?.name[currentLocale] || categoryConfig?.name.en || "";
  const CategoryIcon = categoryConfig?.icon;
  const estimatedMin = Math.max(2, Math.round(quiz.questionCount * 0.4));

  return (
    <section className="mb-14" aria-label="Featured Quiz">
      <Link href={`/quiz/${quiz.id}`} className="block group select-none">
        <AppCard
          border
          hover
          className="p-7 sm:p-9 transition-all hover:border-secondary"
        >
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-3.5 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2.5">
                <AppBadge
                  bg="bg-primary"
                  text="text-background"
                  icon={<Sparkles className="w-3.5 h-3.5" />}
                >
                  {labels.featured}
                </AppBadge>

                {categoryName && (
                  <AppBadge
                    bg={categoryConfig?.badgeBg}
                    text={categoryConfig?.badgeColor}
                    icon={
                      CategoryIcon && (
                        <CategoryIcon className="w-3.5 h-3.5 shrink-0" />
                      )
                    }
                  >
                    {categoryName}
                  </AppBadge>
                )}

                <span className="text-[11px] text-label/80 uppercase">
                  {quiz.questionCount > 0
                    ? `${quiz.questionCount} ${labels.questionsLabel} • ~${estimatedMin} ${labels.minLabel}`
                    : `~3 ${labels.minLabel}`}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl tracking-wide font-bold text-foreground uppercase group-hover:text-secondary transition-colors">
                {quiz.title}
              </h2>

              <p className="text-label leading-relaxed max-w-2xl">
                {quiz.description}
              </p>
            </div>

            <div className="shrink-0 pt-2 lg:pt-0 w-full sm:w-auto">
              <AppButton
                color="primary"
                withArrow
                small
                className="w-full sm:w-auto group-hover:scale-[1.02] transition-transform"
              >
                {labels.startQuiz}
              </AppButton>
            </div>
          </div>
        </AppCard>
      </Link>
    </section>
  );
}

export default AppFeaturedQuizCard;
