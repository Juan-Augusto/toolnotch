"use client";

import React, { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import AppButton from "@/components/ui/AppButton";
import AppTabsChips, { type AppTabsChipItem } from "@/components/ui/AppTabsChips";
import AppBadge from "@/components/ui/AppBadge";
import AppInput from "@/components/AppInput";
import AppBlogCardItem from "./AppBlogCardItem";
import AppFeaturedBlogCard from "./AppFeaturedBlogCard";
import {
  BLOG_CATEGORY_CONFIG,
  DEFAULT_BLOG_CATEGORY_KEYS,
  BLOG_I18N_LABELS,
  type BlogCardData,
  type BlogCategoryKey,
  type BlogHubLabels,
} from "./blogHubConfig";

export interface AppBlogHubProps {
  posts: BlogCardData[];
  locale?: string;
}

export function AppBlogHub({ posts, locale = "pt" }: AppBlogHubProps) {
  const currentLocale = locale === "pt" || locale === "es" ? locale : "en";
  const labels: BlogHubLabels =
    BLOG_I18N_LABELS[currentLocale] || BLOG_I18N_LABELS.en;

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      setSearchQuery("");
      const input = document.getElementById(
        "blog-search-input",
      ) as HTMLInputElement | null;
      input?.blur();
    }
  };

  const categoryCounts = useMemo(() => {
    const counts: Partial<Record<BlogCategoryKey, number>> = {};
    for (const post of posts) {
      counts[post.category] = (counts[post.category] || 0) + 1;
    }
    return counts;
  }, [posts]);

  const activeCategoryKeys = useMemo(() => {
    return DEFAULT_BLOG_CATEGORY_KEYS.filter(
      (key) => (categoryCounts[key] || 0) > 0,
    );
  }, [categoryCounts]);

  const tabItems: AppTabsChipItem[] = useMemo(() => {
    const allItem: AppTabsChipItem = {
      id: "all",
      label: labels.allCategories,
      count: posts.length,
    };

    const catItems: AppTabsChipItem[] = activeCategoryKeys.map((key) => {
      const config = BLOG_CATEGORY_CONFIG[key];
      const Icon = config.icon;
      return {
        id: key,
        label: config.name[currentLocale] || config.name.en || key,
        count: categoryCounts[key] || 0,
        icon: <Icon className="w-3.5 h-3.5" />,
      };
    });

    return [allItem, ...catItems];
  }, [labels.allCategories, posts.length, activeCategoryKeys, currentLocale, categoryCounts]);

  const filteredPosts = useMemo(() => {
    let list = posts;

    if (selectedCategory !== "all") {
      list = list.filter((p) => p.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((p) => {
        const titleMatch = p.title.toLowerCase().includes(q);
        const descMatch = p.description.toLowerCase().includes(q);
        const tagMatch = p.tags?.some((t) => t.toLowerCase().includes(q));
        const catName = (
          BLOG_CATEGORY_CONFIG[p.category]?.name[currentLocale] || ""
        ).toLowerCase();
        const catMatch = catName.includes(q);
        return titleMatch || descMatch || tagMatch || catMatch;
      });
    }

    return list;
  }, [posts, selectedCategory, searchQuery, currentLocale]);

  const featuredPost = useMemo(() => {
    if (
      posts.length <= 1 ||
      selectedCategory !== "all" ||
      searchQuery.trim()
    ) {
      return null;
    }
    return posts[0] ?? null;
  }, [posts, selectedCategory, searchQuery]);

  const gridPosts = useMemo(() => {
    if (featuredPost) {
      return filteredPosts.filter((p) => p.slug !== featuredPost.slug);
    }
    return filteredPosts;
  }, [filteredPosts, featuredPost]);

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

        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-8 pb-6 border-b-dashed-5">
          <AppTabsChips
            items={tabItems}
            value={selectedCategory}
            onChange={setSelectedCategory}
            className="w-full lg:w-auto"
          />

          <div
            data-testid="blog-search-container"
            className="relative shrink-0 w-full sm:w-64 md:w-72 self-start lg:self-center"
          >
            <AppInput
              id="blog-search-input"
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
                    "blog-search-input",
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

        {featuredPost && (
          <AppFeaturedBlogCard
            post={featuredPost}
            locale={currentLocale}
            labels={labels}
          />
        )}

        {gridPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {gridPosts.map((post) => (
              <AppBlogCardItem
                key={post.slug}
                post={post}
                locale={currentLocale}
                labels={labels}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border border-dashed border-border/50 rounded-[2px] bg-tertiary/20">
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
    </div>
  );
}

export default AppBlogHub;
