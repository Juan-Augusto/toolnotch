import Link from "next/link";
import { ArrowRight } from "lucide-react";
import AppCard from "@/components/ui/AppCard";
import type { ToolCardData, ToolsHubLabels } from "./toolsHubConfig";

export interface AppToolCategoryListCardProps {
  categoryKey: string;
  categoryName: string;
  badgeBg: string;
  tools: ToolCardData[];
  locale: string;
  labels: ToolsHubLabels;
}

export function AppToolCategoryListCard({
  categoryName,
  badgeBg,
  tools,
  locale,
  labels,
}: AppToolCategoryListCardProps) {
  return (
    <AppCard border className="h-full flex flex-col transition-all">
      {/* Category Header */}
      <div className="flex items-center justify-between gap-2.5 pb-3 mb-2 border-b border-b-border/60 select-none">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className={`w-3 h-3 ${badgeBg} rounded-[1px] shrink-0`} />
          <h2 className="text-sm sm:text-base font-bold uppercase text-foreground truncate">
            {categoryName}
          </h2>
        </div>
        <span className="text-xs text-label shrink-0">
          {tools.length} {labels.toolsCount}
        </span>
      </div>

      {/* Tools List */}
      <ul className="space-y-1 divide-y divide-border/60 flex-1 flex flex-col">
        {tools.map((tool) => {
          const toolHref =
            locale === "en" ? tool.path : `/${locale}${tool.path}`;

          return (
            <li key={tool.path} className="pt-1.5 first:pt-0 pb-2">
              <Link
                href={toolHref}
                className="group flex items-center justify-between py-1.5 px-2 -mx-1 rounded-[2px] hover:bg-background/70 transition-colors select-none"
              >
                <span className="text-xs sm:text-sm font-medium text-foreground/90 group-hover:text-secondary transition-colors line-clamp-1">
                  {tool.title}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-label/40 group-hover:text-secondary group-hover:translate-x-1 transition-all shrink-0 ml-2" />
              </Link>
            </li>
          );
        })}
      </ul>
    </AppCard>
  );
}

export default AppToolCategoryListCard;
