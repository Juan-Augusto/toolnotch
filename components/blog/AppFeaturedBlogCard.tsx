import Link from "next/link";
import { Sparkles, Clock, Calendar } from "lucide-react";
import AppCard from "@/components/ui/AppCard";
import AppBadge from "@/components/ui/AppBadge";
import AppButton from "@/components/ui/AppButton";
import {
  BLOG_CATEGORY_CONFIG,
  type BlogCardData,
  type BlogHubLabels,
} from "./blogHubConfig";

export interface AppFeaturedBlogCardProps {
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
        month: "long",
        day: "numeric",
      },
    );
  } catch {
    return isoDate;
  }
}

export function AppFeaturedBlogCard({
  post,
  locale,
  labels,
}: AppFeaturedBlogCardProps) {
  const catConfig = BLOG_CATEGORY_CONFIG[post.category];
  const CategoryIcon = catConfig?.icon;
  const categoryName =
    catConfig?.name[locale] || catConfig?.name.en || post.category;

  const postHref =
    locale === "en" ? `/blog/${post.slug}` : `/${locale}/blog/${post.slug}`;

  return (
    <section className="mb-10 sm:mb-12" aria-label={labels.featured}>
      <Link href={postHref} className="block group select-none">
        <AppCard border hover className="p-6 sm:p-9 transition-all">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-3.5 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2.5">
                <AppBadge
                  bg="bg-primary"
                  text="text-background"
                  icon={<Sparkles className="w-3.5 h-3.5" />}
                >
                  {labels.featured}
                </AppBadge>

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

                <div className="flex items-center gap-3 text-sm text-label">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(post.publishedAt, locale)}
                  </span>
                  <span>|</span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {labels.minRead(post.readingTimeMinutes)}
                  </span>
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground uppercase group-hover:text-secondary transition-colors leading-snug">
                {post.title}
              </h2>

              <p className="text-label text-sm sm:text-base leading-relaxed max-w-2xl">
                {post.description}
              </p>

              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {post.tags.slice(0, 4).map((tag) => (
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

            <div className="shrink-0 pt-2 lg:pt-0 w-full sm:w-auto">
              <AppButton
                color="primary"
                withArrow
                small
                className="w-full sm:w-auto"
              >
                {labels.readArticle}
              </AppButton>
            </div>
          </div>
        </AppCard>
      </Link>
    </section>
  );
}

export default AppFeaturedBlogCard;
