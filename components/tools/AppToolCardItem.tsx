import Link from "next/link";
import { ArrowRight } from "lucide-react";
import AppCard from "@/components/ui/AppCard";
import AppBadge from "@/components/ui/AppBadge";
import {
  TOOL_CATEGORY_CONFIG,
  type ToolCardData,
  type ToolsHubLabels,
} from "./toolsHubConfig";

export interface AppToolCardItemProps {
  tool: ToolCardData;
  locale: string;
  labels: ToolsHubLabels;
}

export function AppToolCardItem({
  tool,
  locale,
  labels,
}: AppToolCardItemProps) {
  const catConfig = TOOL_CATEGORY_CONFIG[tool.category];
  const CategoryIcon = catConfig?.icon;
  const categoryName =
    catConfig?.name[locale] || catConfig?.name.en || tool.category;

  const toolHref = locale === "en" ? tool.path : `/${locale}${tool.path}`;

  return (
    <Link href={toolHref} className="block group h-full select-none">
      <AppCard
        hover
        border
        className="h-full flex flex-col justify-between p-3.5 sm:p-5 md:p-6 transition-all"
      >
        <div>
          <div className="flex items-center justify-between gap-2 mb-2 sm:mb-3.5">
            <AppBadge
              bg={catConfig?.badgeBg}
              text={catConfig?.badgeColor}
              icon={
                CategoryIcon && (
                  <CategoryIcon className="w-3.5 h-3.5 shrink-0" />
                )
              }
              className="whitespace-nowrap shrink-0"
            >
              {categoryName}
            </AppBadge>
          </div>

          <h3 className="uppercase text-sm sm:text-base font-bold text-foreground group-hover:text-secondary transition-colors leading-snug mb-1.5 sm:mb-2">
            {tool.title}
          </h3>

          <p className="text-xs sm:text-sm text-label/85 leading-relaxed line-clamp-2">
            {tool.description}
          </p>
        </div>

        <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-border/40 flex items-center justify-between gap-3">
          <span className="text-[11px] sm:text-xs text-label/80 uppercase font-medium">
            {categoryName}
          </span>

          <div className="flex items-center gap-1 text-[11px] sm:text-xs font-semibold uppercase text-label group-hover:text-secondary transition-colors shrink-0">
            <span>{labels.useTool}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </AppCard>
    </Link>
  );
}

export default AppToolCardItem;
