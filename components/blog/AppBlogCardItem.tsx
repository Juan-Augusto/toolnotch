import Link from "next/link";
import { ArrowRight, Clock, Calendar } from "lucide-react";
import AppCard from "@/components/ui/AppCard";
import AppBadge from "@/components/ui/AppBadge";
import {
  BLOG_CATEGORY_CONFIG,
  type BlogCardData,
  type BlogHubLabels,
} from "./blogHubConfig";

export interface AppBlogCardItemProps {
  post: BlogCardData;
  locale: string;
  labels: BlogHubLabels;
}

function formatDate(isoDate: string, locale: string): string {
  try {
    const date = new Date(isoDate + "T00:00:00");
    return date.toLocaleDateString(
      locale === "pt" ? "pt-BR" : locale === "es" ? "es-ES" : "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      },
    );
  } catch {
    return isoDate;
  }
}

export function AppBlogCardItem({
  post,
  locale,
  labels,
}: AppBlogCardItemProps) {
  const catConfig = BLOG_CATEGORY_CONFIG[post.category];
  const CategoryIcon = catConfig?.icon;
  const categoryName =
    catConfig?.name[locale] || catConfig?.name.en || post.category;

  const postHref =
    locale === "en" ? `/blog/${post.slug}` : `/${locale}/blog/${post.slug}`;

  return (
    <Link href={postHref} className="block group h-full select-none">
      <AppCard
        withCornerAccents={false}
        hover
        border
        className="h-full flex flex-col justify-between !p-6 sm:!p-7 transition-all"
      >
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <AppBadge
              bg={catConfig?.badgeBg}
              text={catConfig?.badgeColor}
              icon={
                CategoryIcon && (
                  <CategoryIcon className="w-3.5 h-3.5 shrink-0" />
                )
              }
              className="whitespace-nowrap"
            >
              {categoryName}
            </AppBadge>

            <div className="flex items-center gap-1.5 text-xs text-label">
              <Clock className="w-3 h-3 shrink-0" />
              <span>{labels.minRead(post.readingTimeMinutes)}</span>
            </div>
          </div>

          <h3 className="uppercase text-base sm:text-lg font-bold text-foreground group-hover:text-secondary transition-colors leading-snug mb-2.5">
            {post.title}
          </h3>

          <p className="text-label/85 text-xs sm:text-sm leading-relaxed line-clamp-3 mb-4">
            {post.description}
          </p>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-0.5 rounded-[2px] bg-foreground/5 text-label"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="mt-4 pt-4 text-xs border-t border-border/40 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-label">
            <Calendar className="w-3 h-3 shrink-0" />
            <span>{formatDate(post.publishedAt, locale)}</span>
          </div>

          <div className="flex items-center gap-1 font-semibold tracking-wide uppercase text-label group-hover:text-secondary transition-colors shrink-0">
            <span>{labels.readArticle}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </AppCard>
    </Link>
  );
}

export default AppBlogCardItem;
