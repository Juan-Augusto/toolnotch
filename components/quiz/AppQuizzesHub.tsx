"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import AppButton from "@/components/ui/AppButton";
import AppTabsChips from "@/components/ui/AppTabsChips";
import AppBadge from "@/components/ui/AppBadge";
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
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const isExpanded = isFocused || Boolean(searchQuery);

  const handleCollapse = () => {
    setIsFocused(false);
    setSearchQuery("");
    const input = document.getElementById(
      "quizzes-search-input",
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
    <div className="w-full min-h-screen bg-background text-foreground pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <header className="mb-10 md:mb-12">
          <div className="flex items-center gap-3 mb-2.5 select-none">
            <span className="font-mono text-2xl sm:text-3xl font-bold text-primary">
              ///
            </span>
            <h1 className="font-mono text-2xl tracking-wide sm:text-3xl md:text-3xl font-bold text-foreground uppercase">
              {labels.heading}
            </h1>
          </div>

          <p className="font-mono text-xs sm:text-sm text-label/90 max-w-2xl leading-relaxed">
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
            className={`relative transition-all duration-300 ease-in-out border rounded-[2px] bg-tertiary/40 border-border/60 hover:border-border focus-within:border-border shrink-0 self-start lg:self-center ${
              isExpanded ? "w-full sm:w-72 lg:w-80" : "w-40 sm:w-44"
            }`}
          >
            <AppInput
              id="quizzes-search-input"
              flat
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={handleKeyDown}
              placeholder={labels.searchPlaceholder}
              containerClassName="w-full"
              className={`h-10 text-xs sm:text-sm pl-9 transition-[padding] duration-200 ${
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
                        "quizzes-search-input",
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
                    <h2 className="font-mono text-sm sm:text-base font-bold uppercase tracking-wider text-foreground">
                      {group.name}
                    </h2>
                  </div>
                  <span className="font-mono text-xs text-label">
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
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

export default AppQuizzesHub;
