import Link from "next/link";
import { Sparkles } from "lucide-react";
import AppCard from "@/components/ui/AppCard";
import AppBadge from "@/components/ui/AppBadge";
import AppButton from "@/components/ui/AppButton";
import {
  TOOL_CATEGORY_CONFIG,
  type ToolCardData,
  type ToolsHubLabels,
} from "./toolsHubConfig";

export interface AppFeaturedToolCardProps {
  tool: ToolCardData;
  locale: string;
  labels: ToolsHubLabels;
}

export function AppFeaturedToolCard({
  tool,
  locale,
  labels,
}: AppFeaturedToolCardProps) {
  const catConfig = TOOL_CATEGORY_CONFIG[tool.category];
  const CategoryIcon = catConfig?.icon;
  const categoryName =
    catConfig?.name[locale] || catConfig?.name.en || tool.category;

  const toolHref = locale === "en" ? tool.path : `/${locale}${tool.path}`;

  return (
    <section className="mb-8 sm:mb-12 md:mb-14" aria-label={labels.featured}>
      <Link href={toolHref} className="block group select-none">
        <AppCard border hover className="p-3.5 sm:p-6 md:p-8 transition-all">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 sm:gap-6">
            <div className="space-y-2 sm:space-y-3.5 max-w-3xl">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2.5">
                <AppBadge
                  bg="bg-primary"
                  text="text-background"
                  icon={<Sparkles className="w-3.5 h-3.5" />}
                >
                  {labels.featured}
                </AppBadge>

                {catConfig && (
                  <AppBadge
                    bg={catConfig?.badgeBg}
                    text={catConfig?.badgeColor}
                    icon={
                      CategoryIcon && (
                        <CategoryIcon className="w-3.5 h-3.5 shrink-0" />
                      )
                    }
                  >
                    {categoryName}
                  </AppBadge>
                )}
              </div>

              <h2 className="text-lg sm:text-2xl md:text-3xl font-bold text-foreground uppercase group-hover:text-secondary transition-colors leading-snug">
                {tool.title}
              </h2>

              <p className="text-xs sm:text-sm text-label leading-relaxed max-w-2xl">
                {tool.description}
              </p>
            </div>

            <div className="shrink-0 pt-2 lg:pt-0 w-full sm:w-auto">
              <AppButton
                color="primary"
                withArrow
                small
                className="w-full sm:w-auto"
              >
                {labels.useTool}
              </AppButton>
            </div>
          </div>
        </AppCard>
      </Link>
    </section>
  );
}

export default AppFeaturedToolCard;
