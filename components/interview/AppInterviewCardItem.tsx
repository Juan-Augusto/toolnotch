"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import AppCard from "@/components/ui/AppCard";
import AppBadge from "@/components/ui/AppBadge";
import {
  INTERVIEW_CATEGORY_CONFIG,
  type InterviewCardData,
} from "./interviewHubConfig";

export interface AppInterviewCardItemProps {
  quiz: InterviewCardData;
  currentLocale: string;
  labels: {
    playQuiz: string;
    questionsLabel: string;
    levelsLabel: string;
  };
}

export function AppInterviewCardItem({
  quiz,
  currentLocale,
  labels,
}: AppInterviewCardItemProps) {
  const config = INTERVIEW_CATEGORY_CONFIG[quiz.category];
  const categoryName = config?.name[currentLocale] || config?.name.en || "";
  const Icon = config?.icon;

  const quizHref =
    currentLocale === "en"
      ? `/interview/${quiz.slug}`
      : `/${currentLocale}/interview/${quiz.slug}`;

  const description =
    quiz.description[currentLocale] || quiz.description.en || "";

  return (
    <Link href={quizHref} className="block group h-full select-none">
      <AppCard
        withCornerAccents={false}
        hover
        border
        className="h-full flex flex-col justify-between !p-6 sm:!p-7 transition-all"
      >
        <div>
          <div className="mb-4">
            <AppBadge
              bg={config?.badgeBg}
              text={config?.badgeColor}
              icon={Icon && <Icon className="w-4 h-4 shrink-0" />}
              className="whitespace-nowrap"
            >
              {categoryName}
            </AppBadge>
          </div>

          <h3 className="uppercase text-base sm:text-lg font-bold  text-foreground group-hover:text-secondary transition-colors leading-snug mb-2.5">
            {quiz.title}
          </h3>

          <p className=" text-label/85 leading-relaxed line-clamp-2">
            {description}
          </p>
        </div>

        <div className="mt-6 pt-4 border-t border-border/40 flex items-center justify-between gap-3">
          <span className="font-mono text-[11px] text-label/80 uppercase whitespace-nowrap">
            {quiz.questionCount} {labels.questionsLabel} • 3{" "}
            {labels.levelsLabel}
          </span>
          <div className="flex items-center gap-1 font-mono text-[11px] font-bold uppercase  text-label group-hover:text-secondary transition-colors shrink-0">
            <span>{labels.playQuiz}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-all" />
          </div>
        </div>
      </AppCard>
    </Link>
  );
}

export default AppInterviewCardItem;
