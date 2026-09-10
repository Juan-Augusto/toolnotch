import React from "react";
import AppCard from "@/components/ui/AppCard";
import AppButton from "@/components/ui/AppButton";
import AppBadge from "@/components/ui/AppBadge";
import AppTabsChips, { type AppTabsChipItem } from "@/components/ui/AppTabsChips";
import type { QuizLevel } from "@/lib/interviewTypes";
import type { InterviewQuizLabels } from "./interviewQuizLabels";

export interface AppInterviewLevelCard {
  level: QuizLevel;
  title: string;
  desc: string;
  topics: string[];
}

export interface AppInterviewStartScreenProps {
  title: string;
  subtitle: string;
  badgeBg?: string;
  badgeColor?: string;
  badgeIcon?: React.ReactNode;
  displayCategoryName: string;
  totalQuestions: number;
  estimatedMinutes: number;
  selectedLevel: "all" | QuizLevel;
  onSelectLevel: (level: "all" | QuizLevel) => void;
  levelTabItems: AppTabsChipItem[];
  selectedLevelCard: AppInterviewLevelCard | null;
  displayTopics: string[];
  labels: InterviewQuizLabels;
  onStart: (level: "all" | QuizLevel) => void;
}

export function AppInterviewStartScreen({
  title,
  subtitle,
  badgeBg,
  badgeColor,
  badgeIcon,
  displayCategoryName,
  totalQuestions,
  estimatedMinutes,
  selectedLevel,
  onSelectLevel,
  levelTabItems,
  selectedLevelCard,
  displayTopics,
  labels,
  onStart,
}: AppInterviewStartScreenProps) {
  return (
    <div className="w-full mx-auto select-none">
      <AppCard border hover={false} className="p-7 sm:p-10">
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-2.5">
            <AppBadge bg={badgeBg} text={badgeColor} icon={badgeIcon}>
              {displayCategoryName}
            </AppBadge>

            <span className="text-[11px] text-label uppercase font-semibold">
              {labels.questionsSummary(totalQuestions, estimatedMinutes)}
            </span>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-bold! uppercase text-foreground">
              {title}
            </h1>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase text-label block">
              {labels.selectLevel}
            </span>
            <AppTabsChips
              items={levelTabItems}
              value={selectedLevel}
              onChange={(id) => onSelectLevel(id as "all" | QuizLevel)}
            />
          </div>

          <div className="p-4 bg-tertiary/30 border-dashed-5 rounded-[2px] space-y-3">
            <p className="text-label/90 leading-relaxed">
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
              onClick={() => onStart(selectedLevel)}
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

export default AppInterviewStartScreen;
