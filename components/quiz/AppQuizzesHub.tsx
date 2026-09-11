"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import AppButton from "@/components/ui/AppButton";
import AppTabsChips from "@/components/ui/AppTabsChips";
import AppInput from "@/components/AppInput";
import AppQuizCardItem from "./AppQuizCardItem";
import AppFeaturedQuizCard from "./AppFeaturedQuizCard";
import {
  CATEGORY_CONFIG,
  DEFAULT_CATEGORY_KEYS,
  I18N_LABELS,
  type AppQuizzesHubProps,
} from "./quizzesHubConfig";

export type { QuizCardData, AppQuizzesHubProps } from "./quizzesHubConfig";

export function AppQuizzesHub({ quizzes, locale = "pt" }: AppQuizzesHubProps) {
  const currentLocale = locale === "pt" || locale === "es" ? locale : "en";
  const labels = I18N_LABELS[currentLocale] || I18N_LABELS.en;

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      setSearchQuery("");
      const input = document.getElementById(
        "quizzes-search-input",
      ) as HTMLInputElement | null;
      input?.blur();
    }
  };

  const groupedCategories = useMemo(() => {
    return DEFAULT_CATEGORY_KEYS.map((key) => {
      const config = CATEGORY_CONFIG[key];
      const categoryQuizzes = quizzes.filter((q) => q.category === key);
      return {
        id: key,
        name: config.name[currentLocale] || config.name.en,
        badgeBg: config.badgeBg,
        icon: config.icon,
        quizzes: categoryQuizzes,
      };
    }).filter((group) => group.quizzes.length > 0);
  }, [quizzes, currentLocale]);

  const filteredQuizzes = useMemo(() => {
    let list = quizzes;
    if (selectedCategory !== "all") {
      list = list.filter((q) => q.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (quiz) =>
          quiz.title.toLowerCase().includes(q) ||
          quiz.description.toLowerCase().includes(q),
      );
    }
    return [...list].sort((a, b) => {
      const orderA = DEFAULT_CATEGORY_KEYS.indexOf(a.category);
      const orderB = DEFAULT_CATEGORY_KEYS.indexOf(b.category);
      return (orderA === -1 ? 99 : orderA) - (orderB === -1 ? 99 : orderB);
    });
  }, [quizzes, selectedCategory, searchQuery]);

  const featuredQuiz = useMemo(() => {
    if (
      quizzes.length <= 3 ||
      selectedCategory !== "all" ||
      searchQuery.trim()
    ) {
      return null;
    }
    return (
      quizzes.find((q) => q.id === "what-is-your-political-profile") ||
      quizzes.find((q) => q.id === "fifa-world-cup-winners") ||
      quizzes.find((q) => q.id === "what-is-your-love-language") ||
      quizzes[0] ||
      null
    );
  }, [quizzes, selectedCategory, searchQuery]);

  const tabItems = useMemo(() => {
    const allItem = {
      id: "all",
      label: labels.allCategories,
      count: quizzes.length,
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
  }, [labels.allCategories, quizzes.length, groupedCategories]);

  return (
    <div className="w-full text-foreground pb-12">
      <div className="w-full pt-4 pb-8">
        <header className="mb-10 md:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-3xl font-bold text-foreground uppercase mb-2.5">
            {labels.heading}
          </h1>

          <p className=" text-label/90 max-w-2xl leading-relaxed">
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
            data-testid="quizzes-search-container"
            className="relative shrink-0 w-full sm:w-64 md:w-72 self-start lg:self-center"
          >
            <AppInput
              id="quizzes-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={labels.searchPlaceholder}
              containerClassName="w-full"
              className={`h-10 pl-9 ${searchQuery ? "pr-9" : "pr-3"}`}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-label pointer-events-none z-10" />

            {searchQuery && (
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  setSearchQuery("");
                  const input = document.getElementById(
                    "quizzes-search-input",
                  ) as HTMLInputElement | null;
                  input?.focus();
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-label hover:text-foreground transition-colors cursor-pointer"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {featuredQuiz && (
          <AppFeaturedQuizCard
            quiz={featuredQuiz}
            currentLocale={currentLocale}
            labels={labels}
          />
        )}

        {selectedCategory === "all" && !searchQuery ? (
          <div className="space-y-16">
            {groupedCategories.map((group) => (
              <section key={group.id} id={`category-${group.id}`}>
                <div className="flex items-center justify-between gap-3 mb-6 pb-2.5 border-b-dashed-5 select-none">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-3 h-3 ${group.badgeBg} rounded-[1px]`}
                    />
                    <h2 className="text-sm sm:text-base font-bold uppercase  text-foreground">
                      {group.name}
                    </h2>
                  </div>
                  <span className="text-xs text-label">
                    {group.quizzes.length} {labels.quizzesCount}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {group.quizzes.map((quiz) => (
                    <AppQuizCardItem
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredQuizzes.map((quiz) => (
                  <AppQuizCardItem
                    key={quiz.id}
                    quiz={quiz}
                    currentLocale={currentLocale}
                    labels={labels}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 border-dashed-5 border-border/50 rounded-[2px] bg-tertiary/20">
                <p className="text-sm text-label mb-4">
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

export default AppQuizzesHub;
