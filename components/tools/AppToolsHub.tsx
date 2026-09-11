"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, X, LayoutGrid, List, ArrowRight } from "lucide-react";
import AppButton from "@/components/ui/AppButton";
import AppTabsChips, {
  type AppTabsChipItem,
} from "@/components/ui/AppTabsChips";
import AppInput from "@/components/AppInput";
import AppToolCardItem from "./AppToolCardItem";
import AppToolCategoryListCard from "./AppToolCategoryListCard";
import AppFeaturedToolCard from "./AppFeaturedToolCard";
import {
  TOOL_CATEGORY_CONFIG,
  DEFAULT_TOOL_CATEGORY_KEYS,
  getToolsHubLabels,
  type ToolCardData,
  type ToolCategoryKey,
  type ToolsHubLabels,
} from "./toolsHubConfig";

export interface AppToolsHubProps {
  tools: ToolCardData[];
  locale?: string;
  labels?: ToolsHubLabels;
}

export function AppToolsHub({
  tools,
  locale = "pt",
  labels: customLabels,
}: AppToolsHubProps) {
  const labels = customLabels || getToolsHubLabels(locale);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [viewMode, setViewMode] = useState<"cards" | "list">("cards");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      setSearchQuery("");
      const input = document.getElementById(
        "tools-search-input",
      ) as HTMLInputElement | null;
      input?.blur();
    }
  };

  const categoryCounts = useMemo(() => {
    const counts: Partial<Record<ToolCategoryKey, number>> = {};
    for (const tool of tools) {
      counts[tool.category] = (counts[tool.category] || 0) + 1;
    }
    return counts;
  }, [tools]);

  const activeCategories = useMemo(() => {
    return DEFAULT_TOOL_CATEGORY_KEYS.filter(
      (cat) => (categoryCounts[cat] || 0) > 0,
    );
  }, [categoryCounts]);

  const tabItems: AppTabsChipItem[] = useMemo(() => {
    const allItem: AppTabsChipItem = {
      id: "all",
      label: labels.allCategories,
      count: tools.length,
    };

    const catItems: AppTabsChipItem[] = activeCategories.map((catKey) => {
      const config = TOOL_CATEGORY_CONFIG[catKey];
      const Icon = config.icon;
      return {
        id: catKey,
        label: config.name[locale] || config.name.en || catKey,
        count: categoryCounts[catKey] || 0,
        icon: <Icon className="w-3.5 h-3.5" />,
      };
    });

    return [allItem, ...catItems];
  }, [
    activeCategories,
    categoryCounts,
    labels.allCategories,
    locale,
    tools.length,
  ]);

  const filteredTools = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return tools.filter((tool) => {
      const matchesCat =
        selectedCategory === "all" || tool.category === selectedCategory;
      if (!matchesCat) return false;
      if (!query) return true;

      const titleMatch = tool.title.toLowerCase().includes(query);
      const descMatch = tool.description.toLowerCase().includes(query);
      const catConfig = TOOL_CATEGORY_CONFIG[tool.category];
      const catName = (
        catConfig?.name[locale] ||
        catConfig?.name.en ||
        tool.category
      ).toLowerCase();
      const catMatch = catName.includes(query);

      return titleMatch || descMatch || catMatch;
    });
  }, [tools, searchQuery, selectedCategory, locale]);

  const featuredTool = useMemo(() => {
    if (selectedCategory !== "all" || searchQuery.trim() !== "") {
      return null;
    }
    return (
      tools.find((t) => t.featured) ||
      tools.find((t) => t.path === "/tools/image/image-compressor") ||
      tools.find((t) => t.path === "/tools/pdf/merge-pdf") ||
      tools[0] ||
      null
    );
  }, [tools, selectedCategory, searchQuery]);

  const groupedCategorySections = useMemo(() => {
    if (selectedCategory !== "all" || searchQuery.trim() !== "") {
      return null;
    }

    return activeCategories
      .map((catKey) => {
        const catTools = tools.filter(
          (t) =>
            t.category === catKey &&
            (!featuredTool || t.path !== featuredTool.path),
        );
        const config = TOOL_CATEGORY_CONFIG[catKey];
        return {
          key: catKey,
          name: config.name[locale] || config.name.en || catKey,
          badgeBg: config.badgeBg,
          tools: catTools,
        };
      })
      .filter((group) => group.tools.length > 0);
  }, [
    activeCategories,
    featuredTool,
    locale,
    searchQuery,
    selectedCategory,
    tools,
  ]);

  const allCategoriesList = useMemo(() => {
    return activeCategories
      .map((catKey) => {
        const catTools = tools.filter((t) => t.category === catKey);
        const config = TOOL_CATEGORY_CONFIG[catKey];
        return {
          key: catKey,
          name: config.name[locale] || config.name.en || catKey,
          badgeBg: config.badgeBg,
          tools: catTools,
        };
      })
      .filter((group) => group.tools.length > 0);
  }, [activeCategories, locale, tools]);

  const matchingCategoriesList = useMemo(() => {
    if (selectedCategory === "all" && searchQuery.trim() === "") {
      return allCategoriesList;
    }
    return activeCategories
      .map((catKey) => {
        const catTools = filteredTools.filter((t) => t.category === catKey);
        const config = TOOL_CATEGORY_CONFIG[catKey];
        return {
          key: catKey,
          name: config?.name[locale] || config?.name.en || catKey,
          badgeBg: config?.badgeBg || "bg-primary",
          tools: catTools,
        };
      })
      .filter((group) => group.tools.length > 0);
  }, [
    activeCategories,
    allCategoriesList,
    filteredTools,
    locale,
    searchQuery,
    selectedCategory,
  ]);

  const handleResetFilters = () => {
    setSelectedCategory("all");
    setSearchQuery("");
  };

  return (
    <div className="w-full text-foreground pb-12">
      <div className="w-full pt-4 pb-8">
        <header className="mb-10 md:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-3xl font-bold text-foreground uppercase mb-2.5">
            {labels.heading}
          </h1>

          <p className="text-label/90 max-w-2xl leading-relaxed">
            {labels.subtitle}
          </p>
        </header>

        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-6 pb-6 border-b-dashed-5">
          <AppTabsChips
            items={tabItems}
            value={selectedCategory}
            onChange={setSelectedCategory}
            className="w-full lg:w-auto"
          />

          <div
            data-testid="tools-search-container"
            className="relative shrink-0 w-full sm:w-64 md:w-72 self-start lg:self-center"
          >
            <AppInput
              id="tools-search-input"
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
                    "tools-search-input",
                  ) as HTMLInputElement | null;
                  input?.focus();
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-label hover:text-foreground transition-colors cursor-pointer"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Sub-toolbar: contagem à esquerda, seletor de layout discreto à direita */}
        <div className="flex items-center justify-between gap-4 mb-8 select-none">
          <span className="text-xs font-medium uppercase text-label">
            {filteredTools.length} {labels.toolsCount}
            {selectedCategory !== "all" && (
              <>
                {" "}
                •{" "}
                {TOOL_CATEGORY_CONFIG[selectedCategory as ToolCategoryKey]
                  ?.name[locale] || selectedCategory}
              </>
            )}
          </span>

          <div
            role="group"
            aria-label="Layout view mode"
            className="flex items-center gap-1 p-0.5 border border-border bg-tertiary rounded-[2px]"
          >
            <button
              type="button"
              data-testid="view-mode-cards"
              onClick={() => setViewMode("cards")}
              aria-pressed={viewMode === "cards"}
              title={labels.viewCards}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium uppercase rounded-[2px] transition-all cursor-pointer ${
                viewMode === "cards"
                  ? "bg-primary dark:bg-secondary text-background"
                  : "text-label hover:text-foreground hover:bg-background/40"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5 shrink-0" />
              <span>{labels.viewCards}</span>
            </button>

            <button
              type="button"
              data-testid="view-mode-list"
              onClick={() => setViewMode("list")}
              aria-pressed={viewMode === "list"}
              title={labels.viewList}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium uppercase rounded-[2px] transition-all cursor-pointer ${
                viewMode === "list"
                  ? "bg-primary dark:bg-secondary text-background"
                  : "text-label hover:text-foreground hover:bg-background/40"
              }`}
            >
              <List className="w-3.5 h-3.5 shrink-0" />
              <span>{labels.viewList}</span>
            </button>
          </div>
        </div>

        {/* View Mode: Cards */}
        {viewMode === "cards" ? (
          <>
            {featuredTool && (
              <AppFeaturedToolCard
                tool={featuredTool}
                locale={locale}
                labels={labels}
              />
            )}

            {groupedCategorySections ? (
              <div className="space-y-16">
                {groupedCategorySections.map((group) => (
                  <section key={group.key} aria-label={group.name}>
                    <div className="flex items-center justify-between gap-3 mb-6 pb-2.5 border-b-dashed-5 select-none">
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`w-3 h-3 ${group.badgeBg} rounded-[1px]`}
                        />
                        <h2 className="text-sm sm:text-base font-bold uppercase text-foreground">
                          {group.name}
                        </h2>
                      </div>
                      <span className="text-xs text-label">
                        {group.tools.length} {labels.toolsCount}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {group.tools.map((tool) => (
                        <AppToolCardItem
                          key={tool.path}
                          tool={tool}
                          locale={locale}
                          labels={labels}
                        />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            ) : (
              <div>
                {filteredTools.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredTools.map((tool) => (
                      <AppToolCardItem
                        key={tool.path}
                        tool={tool}
                        locale={locale}
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
                      color="primary"
                      small
                      onClick={handleResetFilters}
                    >
                      {labels.clearFilters}
                    </AppButton>
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          /* View Mode: Lista (3 colunas por categoria) */
          <div>
            {filteredTools.length === 0 ? (
              <div className="text-center py-20 border-dashed-5 border-border/50 rounded-[2px] bg-tertiary/20">
                <p className="text-sm text-label mb-4">{labels.noResults}</p>
                <AppButton color="primary" small onClick={handleResetFilters}>
                  {labels.clearFilters}
                </AppButton>
              </div>
            ) : selectedCategory !== "all" && !searchQuery ? (
              /* Categoria única selecionada: ferramentas distribuídas em 3 colunas de linhas compactas */
              <div className="space-y-6">
                <div className="flex items-center justify-between gap-3 mb-6 pb-2.5 border-b-dashed-5 select-none">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-3 h-3 ${
                        TOOL_CATEGORY_CONFIG[
                          selectedCategory as ToolCategoryKey
                        ]?.badgeBg || "bg-primary"
                      } rounded-[1px]`}
                    />
                    <h2 className="text-sm sm:text-base font-bold uppercase text-foreground">
                      {TOOL_CATEGORY_CONFIG[selectedCategory as ToolCategoryKey]
                        ?.name[locale] || selectedCategory}
                    </h2>
                  </div>
                  <span className="text-xs text-label">
                    {filteredTools.length} {labels.toolsCount}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {filteredTools.map((tool) => {
                    const toolHref =
                      locale === "en" ? tool.path : `/${locale}${tool.path}`;
                    return (
                      <Link
                        key={tool.path}
                        href={toolHref}
                        className="group flex items-center justify-between p-3.5 rounded-[2px] border border-border bg-tertiary hover:border-foreground/20 hover:bg-tertiary/70 transition-all select-none"
                      >
                        <div className="min-w-0 pr-3">
                          <div className="text-xs sm:text-sm font-semibold uppercase text-foreground group-hover:text-secondary transition-colors truncate">
                            {tool.title}
                          </div>
                          <div className="text-xs text-label/80 line-clamp-1 mt-0.5">
                            {tool.description}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-label group-hover:text-secondary group-hover:translate-x-1 transition-all shrink-0" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* Todas as categorias ou busca: grid de 3 colunas (coluna 1 PDF, coluna 2 Imagem, coluna 3 Conversores...) */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {matchingCategoriesList.map((group) => (
                  <AppToolCategoryListCard
                    key={group.key}
                    categoryKey={group.key}
                    categoryName={group.name}
                    badgeBg={group.badgeBg}
                    tools={group.tools}
                    locale={locale}
                    labels={labels}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AppToolsHub;
