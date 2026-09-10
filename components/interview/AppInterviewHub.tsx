"use client";

import React, { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import AppButton from "@/components/ui/AppButton";
import AppTabsChips from "@/components/ui/AppTabsChips";
import AppBadge from "@/components/ui/AppBadge";
import AppInput from "@/components/AppInput";
import AppInterviewCardItem from "./AppInterviewCardItem";
import {
  DEFAULT_INTERVIEW_CATEGORY_KEYS,
  INTERVIEW_CATEGORY_CONFIG,
  INTERVIEW_QUIZZES_DATA,
  INTERVIEW_I18N_LABELS,
  type InterviewCategoryKey,
} from "./interviewHubConfig";

interface Props {
  locale?: string;
}

export default function AppInterviewHub({ locale = "pt" }: Props) {
  const currentLocale = locale === "pt" || locale === "es" ? locale : "en";
  const labels =
    INTERVIEW_I18N_LABELS[currentLocale] || INTERVIEW_I18N_LABELS.en;

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const isExpanded = isFocused || Boolean(searchQuery);

  const handleCollapse = () => {
    setIsFocused(false);
    setSearchQuery("");
    const input = document.getElementById(
      "interview-search-input",
    ) as HTMLInputElement | null;
    input?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      handleCollapse();
    }
  };

  const groupedCategories = useMemo(() => {
    return DEFAULT_INTERVIEW_CATEGORY_KEYS.map((key) => {
      const config = INTERVIEW_CATEGORY_CONFIG[key];
      const categoryQuizzes = INTERVIEW_QUIZZES_DATA.filter(
        (q) => q.category === key,
      );
      return {
        id: key,
        name: config.name[currentLocale] || config.name.en,
        badgeBg: config.badgeBg,
        icon: config.icon,
        quizzes: categoryQuizzes,
      };
    }).filter((group) => group.quizzes.length > 0);
  }, [currentLocale]);

  const filteredQuizzes = useMemo(() => {
    let list = INTERVIEW_QUIZZES_DATA;
    if (selectedCategory !== "all") {
      list = list.filter((q) => q.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((quiz) => {
        const titleMatch = quiz.title.toLowerCase().includes(q);
        const desc = (
          quiz.description[currentLocale] ||
          quiz.description.en ||
          ""
        ).toLowerCase();
        const descMatch = desc.includes(q);
        return titleMatch || descMatch;
      });
    }
    return [...list].sort((a, b) => {
      const orderA = DEFAULT_INTERVIEW_CATEGORY_KEYS.indexOf(a.category);
      const orderB = DEFAULT_INTERVIEW_CATEGORY_KEYS.indexOf(b.category);
      return (orderA === -1 ? 99 : orderA) - (orderB === -1 ? 99 : orderB);
    });
  }, [selectedCategory, searchQuery, currentLocale]);

  const tabItems = useMemo(() => {
    const allItem = {
      id: "all",
      label: labels.allCategories,
      count: INTERVIEW_QUIZZES_DATA.length,
    };
    const categoryItems = groupedCategories.map((group) => {
      const Icon = group.icon;
      return {
        id: group.id,
        label: group.name,
        count: group.quizzes.length,
        icon: <Icon className="w-3.5 h-3.5" />,
      };
    });
    return [allItem, ...categoryItems];
  }, [labels.allCategories, groupedCategories]);

  return (
    <div className="w-full text-foreground pb-12">
      <div className="w-full pt-4 pb-8">
        <header className="mb-10 md:mb-12">
          <h1 className="font-mono text-2xl  sm:text-3xl md:text-3xl font-bold text-foreground uppercase mb-2.5">
            {labels.heading}
          </h1>

          <p className="font-mono  text-label/90 max-w-2xl leading-relaxed">
            {labels.subtitle}
          </p>
        </header>

        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-10 pb-6 border-b-dashed-5">
          <AppTabsChips
            items={tabItems}
            value={selectedCategory}
            onChange={setSelectedCategory}
            className="w-full lg:w-auto"
          />

          <div
            data-testid="interview-search-container"
            className={`relative transition-all duration-300 ease-in-out border rounded-[2px] bg-tertiary border-border hover:border-foreground/30 focus-within:border-secondary focus-within:ring-1 focus-within:ring-secondary/20 shrink-0 self-start lg:self-center ${
              isExpanded ? "w-full sm:w-72 lg:w-80" : "w-40 sm:w-44"
            }`}
          >
            <AppInput
              id="interview-search-input"
              flat
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={handleKeyDown}
              placeholder={labels.searchPlaceholder}
              containerClassName="w-full"
              className={`h-10  pl-9 transition-[padding] duration-200 ${
                isExpanded ? (searchQuery ? "pr-16" : "pr-12") : "pr-3"
              }`}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-label pointer-events-none z-10" />

            {isExpanded && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5 z-10">
                {searchQuery && (
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      setSearchQuery("");
                      const input = document.getElementById(
                        "interview-search-input",
                      ) as HTMLInputElement | null;
                      input?.focus();
                    }}
                    className="p-1 text-label hover:text-foreground transition-colors cursor-pointer"
                    aria-label="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                <AppBadge
                  bg="bg-tertiary"
                  text="text-label"
                  className="text-[10px] px-1.5 py-0.5 font-mono select-none cursor-pointer border border-border/40 hover:text-foreground hover:border-border transition-colors leading-none"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCollapse();
                  }}
                  title="ESC"
                >
                  esc
                </AppBadge>
              </div>
            )}
          </div>
        </div>

        {selectedCategory === "all" && !searchQuery ? (
          <div className="space-y-16">
            {groupedCategories.map((group) => (
              <section key={group.id} id={`category-${group.id}`}>
                <div className="flex items-center justify-between gap-3 mb-6 pb-2.5 border-b-dashed-5 select-none">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-3 h-3 ${group.badgeBg} rounded-[1px]`}
                    />
                    <h2 className="font-mono text-sm sm:text-base font-bold uppercase  text-foreground">
                      {group.name}
                    </h2>
                  </div>
                  <span className="font-mono text-xs text-label">
                    {group.quizzes.length} {labels.quizzesCount}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {group.quizzes.map((quiz) => (
                    <AppInterviewCardItem
                      key={quiz.id}
                      quiz={quiz}
                      currentLocale={currentLocale}
                      labels={labels}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div>
            {filteredQuizzes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                {filteredQuizzes.map((quiz) => (
                  <AppInterviewCardItem
                    key={quiz.id}
                    quiz={quiz}
                    currentLocale={currentLocale}
                    labels={labels}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 border border-dashed border-border/50 rounded-[2px] bg-tertiary/20">
                <p className="font-mono text-sm text-label mb-4">
                  {labels.noResults}
                </p>
                <AppButton
                  color="tertiary"
                  small
                  onClick={() => {
                    setSelectedCategory("all");
                    setSearchQuery("");
                  }}
                >
                  {labels.clearFilters}
                </AppButton>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
