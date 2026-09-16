import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildAlternatesForLocale } from "@/lib/i18nMeta";
import {
  buildJsonLd,
  breadcrumbSchema,
  buildLocalizedUrl,
} from "@/lib/schema";
import { BLOG_POSTS } from "@/data/blog/index";
import { getAllMdxBlogPosts } from "@/lib/content/blogRepository";
import { translateSlug, findSlugGroup } from "@/data/blog/slugTranslations";
import AppBreadcrumb from "@/components/AppBreadcrumb";
import AppBlogHub from "@/components/blog/AppBlogHub";
import AppBlogDepth from "@/components/blog/AppBlogDepth";
import AppAdUnit from "@/components/AppAdUnit";
import { AD_SLOTS } from "@/lib/adSlots";
import type { BlogCardData } from "@/components/blog/blogHubConfig";

const PATH = "/blog";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });
  const localizedUrl = buildLocalizedUrl(PATH, locale);
  const ogLocale =
    locale === "pt" ? "pt_BR" : locale === "es" ? "es_ES" : "en_US";

  const keywordsByLocale = {
    pt: [
      "blog toolnotch",
      "guias de calculadoras",
      "tutoriais de ferramentas",
      "matemática de financiamento",
      "dicas de produtividade",
      "artigos de engenharia de software",
    ],
    es: [
      "blog toolnotch",
      "guías de calculadoras",
      "tutoriales de herramientas",
      "matemáticas financieras",
      "consejos de productividad",
      "artículos de ingeniería",
    ],
    en: [
      "toolnotch blog",
      "calculator guides",
      "free tool tutorials",
      "mortgage math explained",
      "developer guides",
      "productivity tools tips",
    ],
  };

  const title = t("indexTitle");
  const description = t("indexDescription");

  return {
    title,
    description,
    keywords: keywordsByLocale[locale as keyof typeof keywordsByLocale] ?? keywordsByLocale.en,
    alternates: buildAlternatesForLocale(PATH, locale),
    openGraph: {
      title,
      description,
      url: localizedUrl,
      siteName: "ToolNotch",
      locale: ogLocale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function BlogIndexPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });

  const mdxPosts = await getAllMdxBlogPosts(locale);
  const seen = new Set<string>();
  const allPosts = [...BLOG_POSTS, ...mdxPosts].filter((p) => {
    if (seen.has(p.slug)) return false;
    seen.add(p.slug);
    return true;
  });
  allPosts.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

  const blogCards: BlogCardData[] = allPosts.map((post) => {
    let title = "";
    let description = "";

    const isLocalizedGroup = Boolean(findSlugGroup(post.slug));
    if (!isLocalizedGroup && typeof t.has === "function") {
      if (t.has(`posts.${post.slug}.title`)) {
        title = t(`posts.${post.slug}.title`);
      }
      if (t.has(`posts.${post.slug}.description`)) {
        description = t(`posts.${post.slug}.description`);
      }
    }

    if (!title) {
      title = post.title || post.slug;
    }

    if (!description) {
      description = post.description || "";
    }

    const translatedSlug = translateSlug(post.slug, locale);

    return {
      slug: translatedSlug,
      title,
      description,
      category: post.category,
      publishedAt: post.publishedAt,
      updatedAt: post.updatedAt,
      readingTimeMinutes: post.readingTimeMinutes,
      tags: post.tags,
      relatedToolPath: post.relatedToolPath,
    };
  });

  const localizedUrl = buildLocalizedUrl(PATH, locale);
  const homeLabel =
    locale === "pt" ? "Início" : locale === "es" ? "Inicio" : "Home";
  const prefix = locale === "en" ? "" : `/${locale}`;

  const jsonLd = buildJsonLd(
    breadcrumbSchema([
      { name: homeLabel, url: prefix || "/" },
      { name: t("breadcrumbBlog"), url: localizedUrl },
    ]),
    {
      "@type": "ItemList",
      name: t("indexTitle"),
      description: t("indexDescription"),
      url: localizedUrl,
      numberOfItems: blogCards.length,
      itemListElement: blogCards.map((post, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        name: post.title,
        url: buildLocalizedUrl(`/blog/${post.slug}`, locale),
      })),
    },
  );

  const categoryBlurbs = t.raw("indexCategoryBlurbs") as Record<string, string>;

  return (
    <main className="container min-h-[calc(100vh-180px)] bg-background text-foreground py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="w-full pb-2">
        <AppBreadcrumb
          items={[
            { label: homeLabel, href: prefix || "/" },
            { label: t("breadcrumbBlog"), current: true },
          ]}
        />
      </div>

      <AppBlogHub posts={blogCards} locale={locale} />

      <div className="my-8">
        <AppAdUnit slot={AD_SLOTS.BLOG_INDEX_TOP} />
      </div>

      <AppBlogDepth
        guideHeading={t("indexGuideHeading")}
        categoryBlurbs={categoryBlurbs}
        introText={t("indexIntro")}
        locale={locale}
      />
    </main>
  );
}
