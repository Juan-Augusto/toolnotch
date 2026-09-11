import React from "react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import {
  ArrowRight,
  Clock,
  Calendar,
  RefreshCw,
  ExternalLink,
  ArrowLeft,
} from "lucide-react";
import AppBreadcrumb from "@/components/AppBreadcrumb";
import AppCard from "@/components/ui/AppCard";
import AppBadge from "@/components/ui/AppBadge";
import AppButton from "@/components/ui/AppButton";
import AppAdUnit from "@/components/AppAdUnit";
import { AD_SLOTS } from "@/lib/adSlots";
import { BLOG_CATEGORY_CONFIG, type BlogCategoryKey } from "./blogHubConfig";

interface Props {
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  readingTime: number;
  category?: string;
  slug?: string;
  relatedToolPath?: string;
  relatedToolName?: string;
  locale: string;
  children: React.ReactNode;
  showAuthorBio?: boolean;
  relatedPosts?: Array<{ slug: string; title: string }>;
  relatedTools?: Array<{ href: string; label: string }>;
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

export default async function AppArticleLayout({
  title,
  description,
  publishedAt,
  updatedAt,
  readingTime,
  category,
  slug,
  relatedToolPath,
  relatedToolName,
  locale,
  children,
  showAuthorBio = true,
  relatedPosts,
  relatedTools,
}: Props) {
  const t = await getTranslations({ locale, namespace: "blog" });
  const prefix = locale === "en" ? "" : `/${locale}`;
  const localizedBlogHref = locale === "en" ? "/blog" : `/${locale}/blog`;
  const homeLabel =
    locale === "pt" ? "Início" : locale === "es" ? "Inicio" : "Home";
  const blogLabel = t("breadcrumbBlog") || "Blog";
  const minRead = t("minRead", { n: readingTime });

  const catConfig = category
    ? BLOG_CATEGORY_CONFIG[category as BlogCategoryKey]
    : undefined;
  const CategoryIcon = catConfig?.icon;
  const categoryName =
    catConfig?.name[locale] || catConfig?.name.en || category || "";

  const labels = {
    backToBlog: t("backToBlog"),
    allArticles: t("allArticles"),
    putIntoPractice: t("putIntoPractice"),
    tryTool: t("tryTool"),
    tryToolDescription: t("tryToolDescription"),
    relatedToolsHeading: t("relatedToolsHeading"),
    relatedArticlesHeading: t("relatedArticlesHeading"),
    authorRole: t("authorRole"),
    authorBio: t("authorBio"),
    readArticle: t("readArticle"),
  };

  const breadcrumbItems = [
    { label: homeLabel, href: prefix || "/" },
    { label: blogLabel, href: localizedBlogHref },
    {
      label: title,
      href: slug ? `${prefix}/blog/${slug}` : localizedBlogHref,
      current: true,
    },
  ];

  const displayRelatedTools = (relatedTools || []).filter((tool) => {
    if (!relatedToolPath) return true;
    const cleanTool = tool.href.replace(/^\/(?:pt|es)/, "").replace(/\/$/, "");
    const cleanRelated = relatedToolPath
      .replace(/^\/(?:pt|es)/, "")
      .replace(/\/$/, "");
    return cleanTool !== cleanRelated;
  });

  return (
    <main className="min-h-[calc(100vh-180px)] bg-background text-foreground py-8">
      <div className="w-full pb-2 container">
        <AppBreadcrumb items={breadcrumbItems} />
      </div>

      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-12">
        <header className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {catConfig && (
              <AppBadge
                bg={catConfig.badgeBg}
                text={catConfig.badgeColor}
                icon={
                  CategoryIcon && (
                    <CategoryIcon className="w-3.5 h-3.5 shrink-0" />
                  )
                }
              >
                {categoryName}
              </AppBadge>
            )}

            <div className="flex items-center gap-1.5  text-sm text-label">
              <Clock className="w-3.5 h-3.5 shrink-0" />
              <span>{minRead}</span>
            </div>

            <div className="flex items-center gap-1.5 text-sm text-label">
              <Calendar className="w-3.5 h-3.5 shrink-0" />
              <time dateTime={publishedAt}>
                {formatDate(publishedAt, locale)}
              </time>
            </div>

            {updatedAt && (
              <div className="flex items-center gap-1.5 text-sm text-label/80">
                <RefreshCw className="w-3 h-3 shrink-0" />
                <span>
                  {t("updatedOn", { date: formatDate(updatedAt, locale) })}
                </span>
              </div>
            )}
          </div>

          <h1 className=" text-2xl sm:text-3xl md:text-4xl font-bold uppercase text-foreground leading-tight tracking-tight mb-3">
            {title}
          </h1>

          <p className=" text-xs sm:text-sm md:text-base text-label/90 leading-relaxed max-w-3xl">
            {description}
          </p>

          <div className="border-b-dashed-5 mt-6" />
        </header>

        <article className="w-full max-w-none">{children}</article>

        {relatedToolPath && (
          <section className="mt-12 not-prose">
            <AppCard
              border
              hover
              withCornerAccents
              className="p-6 sm:p-8 transition-all"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-2">
                  <AppBadge bg="bg-primary" text="text-background">
                    {labels.putIntoPractice}
                  </AppBadge>
                  {relatedToolName && (
                    <h3 className=" text-base sm:text-lg font-bold uppercase text-foreground">
                      {relatedToolName}
                    </h3>
                  )}
                  <p className=" text-xs sm:text-sm text-label/90 max-w-xl">
                    {labels.tryToolDescription}
                  </p>
                </div>
                <Link href={relatedToolPath} className="shrink-0">
                  <AppButton color="primary">
                    <span>{labels.tryTool}</span>
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </AppButton>
                </Link>
              </div>
            </AppCard>
          </section>
        )}

        {displayRelatedTools.length > 0 && (
          <section className="mt-12 pt-8 border-t-dashed-5 not-prose">
            <h2 className=" text-base sm:text-lg font-bold uppercase text-foreground mb-4">
              {labels.relatedToolsHeading}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {displayRelatedTools.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="group select-none"
                >
                  <AppCard
                    border
                    hover
                    className="p-4 sm:p-5 flex items-center justify-between transition-all"
                  >
                    <span className=" text-xs sm:text-sm font-bold uppercase text-foreground group-hover:text-primary transition-colors">
                      {tool.label}
                    </span>
                    <ArrowRight className="w-4 h-4 text-label group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0 ml-2" />
                  </AppCard>
                </Link>
              ))}
            </div>
          </section>
        )}

        {relatedPosts && relatedPosts.length > 0 && (
          <section className="mt-12 pt-8 border-t-dashed-5 not-prose">
            <h2 className=" text-base sm:text-lg font-bold uppercase text-foreground mb-4">
              {labels.relatedArticlesHeading}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedPosts.map((p) => {
                const postHref =
                  locale === "en"
                    ? `/blog/${p.slug}`
                    : `/${locale}/blog/${p.slug}`;
                return (
                  <Link
                    key={p.slug}
                    href={postHref}
                    className="group select-none h-full"
                  >
                    <AppCard
                      border
                      hover
                      className="h-full p-5 flex flex-col justify-between space-y-4 transition-all"
                    >
                      <h3 className=" text-xs sm:text-sm font-bold uppercase text-foreground group-hover:text-secondary transition-colors line-clamp-2 leading-snug">
                        {p.title}
                      </h3>
                      <div className="flex items-center justify-between pt-3 border-t border-border/40  text-xs text-label">
                        <span className="group-hover:text-primary transition-colors">
                          {labels.readArticle}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform shrink-0" />
                      </div>
                    </AppCard>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {showAuthorBio && (
          <section className="mt-12 pt-8 border-t-dashed-5 not-prose">
            <AppCard border hover={false} className="p-6 sm:p-8 bg-tertiary/20">
              <div className="flex flex-col sm:flex-row items-start  gap-5">
                <div className="w-12 h-12 mt-1 rounded-[2px] bg-purple-500 text-background font-semibold text-base flex items-center justify-center shrink-0 select-none">
                  J
                </div>
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className=" text-sm sm:text-base font-semibold uppercase text-foreground">
                      Juan Soares
                    </span>
                    <AppBadge
                      bg="bg-tertiary"
                      text="text-label"
                      className="border border-border"
                    >
                      {labels.authorRole}
                    </AppBadge>
                  </div>
                  <p className=" text-xs sm:text-sm text-label/90 leading-relaxed max-w-2xl">
                    {labels.authorBio}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    {process.env.NEXT_PUBLIC_AUTHOR_LINKEDIN_URL && (
                      <a
                        href={process.env.NEXT_PUBLIC_AUTHOR_LINKEDIN_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className=" text-xs text-secondary hover:text-primary transition-colors flex items-center gap-1"
                      >
                        <span>LinkedIn</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    <Link
                      href={localizedBlogHref}
                      className="flex items-center gap-2 text-sm text-label hover:text-foreground transition-colors"
                    >
                      <ArrowLeft size={15} /> {labels.allArticles}
                    </Link>
                  </div>
                </div>
              </div>
            </AppCard>
          </section>
        )}

        <div className="mt-8 not-prose">
          <AppAdUnit slot={AD_SLOTS.BLOG_ARTICLE_BOTTOM} />
        </div>
      </div>
    </main>
  );
}
