import React from "react";
import AppCard from "@/components/ui/AppCard";
import AppBadge from "@/components/ui/AppBadge";
import { BLOG_CATEGORY_CONFIG, type BlogCategoryKey } from "./blogHubConfig";

export interface AppBlogDepthProps {
  introTitle?: string;
  introText?: string;
  guideHeading: string;
  categoryBlurbs: Record<string, string>;
  locale: string;
}

export function AppBlogDepth({
  introTitle,
  introText,
  guideHeading,
  categoryBlurbs,
  locale,
}: AppBlogDepthProps) {
  const blurbsEntries = Object.entries(categoryBlurbs);

  return (
    <section className="w-full pt-12 pb-16 space-y-12 border-t-dashed-5">
      {introText && (
        <div className="space-y-3">
          {introTitle && (
            <h2 className="text-lg sm:text-xl font-bold uppercase text-foreground">
              {introTitle}
            </h2>
          )}
          <p className="text-xs sm:text-sm text-label/90 leading-relaxed max-w-3xl">
            {introText}
          </p>
        </div>
      )}

      <div className="space-y-6">
        <h2 className="text-lg sm:text-xl font-bold uppercase text-foreground">
          {guideHeading}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {blurbsEntries.map(([catKey, blurbText]) => {
            const config = BLOG_CATEGORY_CONFIG[catKey as BlogCategoryKey];
            const CategoryIcon = config?.icon;
            const categoryName =
              config?.name[locale] || config?.name.en || catKey;

            return (
              <AppCard
                key={catKey}
                border
                hover={false}
                className="p-5 space-y-2.5"
              >
                <div className="flex items-center gap-2">
                  <AppBadge
                    bg={config?.badgeBg}
                    text={config?.badgeColor}
                    icon={
                      CategoryIcon && (
                        <CategoryIcon className="w-3.5 h-3.5 shrink-0" />
                      )
                    }
                  >
                    {categoryName}
                  </AppBadge>
                </div>
                <p className="text-xs sm:text-sm text-label/90 leading-relaxed">
                  {blurbText}
                </p>
              </AppCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default AppBlogDepth;
