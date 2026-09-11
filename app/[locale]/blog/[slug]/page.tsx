import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";
import { buildAlternates, buildAlternatesForPaths } from "@/lib/i18nMeta";
import {
  buildJsonLd,
  breadcrumbSchema,
  buildLocalizedUrl,
  authorSchema,
} from "@/lib/schema";
import { BLOG_POSTS } from "@/data/blog/index";
import { findSlugGroup, BLOG_LOCALES } from "@/data/blog/slugTranslations";
import {
  getBlogPostSource,
  getAllMdxSlugs,
  getAllMdxBlogPosts,
  guardDescription,
} from "@/lib/content/blogRepository";
import { AppMdxComponents } from "@/components/blog/AppMdxComponents";
import AppArticleLayout from "@/components/blog/AppArticleLayout";
import AppArticleBody, { type BodyBlock } from "@/components/blog/AppArticleBody";
import { resolveBlogRelated } from "@/lib/relatedContent";
import { localizedPath } from "@/lib/i18nMeta";

async function relatedToolsFor(
  slug: string,
  locale: string,
  category?: string,
) {
  const th = await getTranslations({ locale, namespace: "home" });
  return resolveBlogRelated(slug, category).map((spec) => ({
    href: localizedPath(spec.path ?? "/", locale),
    label: th(`tools.${spec.labelKey}.label`),
  }));
}

const rehypePrettyCodeOptions = {
  theme: {
    dark: "github-dark-dimmed",
    light: "github-light",
  },
  keepBackground: false,
};

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams({
  params,
}: { params?: { locale?: string } } = {}) {
  const existingSlugs = BLOG_POSTS.map((post) => ({ slug: post.slug }));
  const mdxSlugs = await getAllMdxSlugs(params?.locale);
  const mdxParams = mdxSlugs
    .filter((slug) => !BLOG_POSTS.some((p) => p.slug === slug))
    .map((slug) => ({ slug }));
  return [...existingSlugs, ...mdxParams];
}

function mdxAlternates(slug: string, locale: string) {
  const group = findSlugGroup(slug);
  if (!group) return buildAlternates(`/blog/${slug}`);
  const paths = Object.fromEntries(
    BLOG_LOCALES.map((l) => [l, `/blog/${group[l]}`]),
  );
  return buildAlternatesForPaths(paths, locale);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://toolnotch.com";
  const t = await getTranslations({ locale, namespace: "blog" });

  let translatedTitle = "";
  let translatedDesc = "";

  const isLocalizedGroup = Boolean(findSlugGroup(slug));
  if (!isLocalizedGroup && typeof t.has === "function") {
    if (t.has(`posts.${slug}.title`)) translatedTitle = t(`posts.${slug}.title`);
    if (t.has(`posts.${slug}.description`)) translatedDesc = t(`posts.${slug}.description`);
  }

  const mdxResult = await getBlogPostSource(slug, locale);
  if (mdxResult) {
    const { frontmatter: fm } = mdxResult;
    const title = translatedTitle || fm.title;
    const description = translatedDesc || fm.description;

    return {
      title,
      description: guardDescription(description),
      alternates: mdxAlternates(slug, locale),
      openGraph: {
        type: "article",
        publishedTime: fm.publishedAt,
        modifiedTime: fm.updatedAt ?? fm.publishedAt,
        authors: ["Juan Soares"],
        images: [`${BASE_URL}/blog/${slug}/opengraph-image`],
      },
    };
  }

  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) return {};

  const title =
    translatedTitle ||
    (typeof t.has === "function" && t.has(`posts.${slug}.title`)
      ? t(`posts.${slug}.title`)
      : post.title ?? slug);
  const description =
    translatedDesc ||
    (typeof t.has === "function" && t.has(`posts.${slug}.description`)
      ? t(`posts.${slug}.description`)
      : post.description ?? "");
  const path = `/blog/${slug}`;

  return {
    title,
    description: guardDescription(description),
    alternates: buildAlternates(path),
    openGraph: {
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
      authors: ["Juan Soares"],
      images: [`${BASE_URL}/blog/${slug}/opengraph-image`],
    },
  };
}

export default async function BlogArticlePage({ params }: Props) {
  const { locale, slug } = await params;
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://toolnotch.com";
  const t = await getTranslations({ locale, namespace: "blog" });

  let translatedTitle = "";
  let translatedDesc = "";
  let translatedToolName = "";
  let translatedBody: BodyBlock[] | null = null;

  const isLocalizedGroup = Boolean(findSlugGroup(slug));
  if (!isLocalizedGroup && typeof t.has === "function") {
    if (t.has(`posts.${slug}.title`)) translatedTitle = t(`posts.${slug}.title`);
    if (t.has(`posts.${slug}.description`)) translatedDesc = t(`posts.${slug}.description`);
    if (t.has(`posts.${slug}.relatedToolName`)) translatedToolName = t(`posts.${slug}.relatedToolName`);
    if (t.has(`posts.${slug}.body`)) {
      const rawBody = t.raw(`posts.${slug}.body`) as BodyBlock[] | undefined;
      if (Array.isArray(rawBody) && rawBody.length > 0) {
        translatedBody = rawBody;
      }
    }
  }

  const homeLabel =
    locale === "pt" ? "Início" : locale === "es" ? "Inicio" : "Home";
  const blogLabel = t("breadcrumbBlog") || "Blog";

  const mdxResult = await getBlogPostSource(slug, locale);
  if (mdxResult) {
    const { frontmatter: fm, source } = mdxResult;
    const path = `/blog/${slug}`;
    const currentCategory = fm.category as string | undefined;

    const title = translatedTitle || fm.title;
    const description = translatedDesc || fm.description;
    const relatedToolName = translatedToolName || fm.relatedToolName;

    const mdxSiblings = (await getAllMdxBlogPosts(locale))
      .filter((p) => p.slug !== slug && p.category === currentCategory)
      .map((p) => ({ slug: p.slug, title: p.title ?? p.slug }));
    const legacySiblings = BLOG_POSTS.filter(
      (p) => p.slug !== slug && p.category === currentCategory,
    ).map((p) => {
      let sibTitle = p.title;
      if (!sibTitle && typeof t.has === "function" && t.has(`posts.${p.slug}.title`)) {
        sibTitle = t(`posts.${p.slug}.title`);
      }
      return { slug: p.slug, title: sibTitle || p.slug };
    });
    const relatedPosts = [...mdxSiblings, ...legacySiblings].slice(0, 3);

    const jsonLd = buildJsonLd(
      {
        "@type": "BlogPosting",
        headline: title,
        description: description,
        image: {
          "@type": "ImageObject",
          url: `${BASE_URL}/blog/${slug}/opengraph-image`,
          width: 1200,
          height: 630,
        },
        author: authorSchema(),
        publisher: {
          "@type": "Organization",
          name: "ToolNotch",
          url: buildLocalizedUrl("/", "en"),
        },
        datePublished: fm.publishedAt,
        dateModified: fm.updatedAt ?? fm.publishedAt,
        url: buildLocalizedUrl(path, locale),
        inLanguage: locale === "pt" ? "pt-BR" : locale,
      },
      breadcrumbSchema([
        { name: homeLabel, url: "/" },
        { name: blogLabel, url: "/blog" },
        { name: title, url: path },
      ]),
    );

    const isSharedSlug = !findSlugGroup(slug);
    const shouldUseTranslatedBody = locale !== "en" && isSharedSlug && translatedBody;

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <AppArticleLayout
          title={title}
          description={description}
          publishedAt={fm.publishedAt}
          updatedAt={fm.updatedAt}
          readingTime={fm.readingTimeMinutes}
          category={currentCategory}
          slug={slug}
          relatedToolPath={fm.relatedToolPath}
          relatedToolName={relatedToolName}
          locale={locale}
          showAuthorBio={true}
          relatedPosts={relatedPosts}
          relatedTools={await relatedToolsFor(slug, locale, currentCategory)}
        >
          {shouldUseTranslatedBody && translatedBody ? (
            <AppArticleBody
              blocks={translatedBody}
              putIntoPracticeLabel={t("putIntoPractice")}
              tryToolLabel={t("tryTool")}
            />
          ) : (
            <MDXRemote
              source={source}
              components={AppMdxComponents}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkGfm],
                  rehypePlugins: [
                    [rehypePrettyCode as any, rehypePrettyCodeOptions],
                  ],
                },
              }}
            />
          )}
        </AppArticleLayout>
      </>
    );
  }

  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) notFound();

  const title =
    translatedTitle ||
    (typeof t.has === "function" && t.has(`posts.${slug}.title`)
      ? t(`posts.${slug}.title`)
      : post.title ?? slug);
  const description =
    translatedDesc ||
    (typeof t.has === "function" && t.has(`posts.${slug}.description`)
      ? t(`posts.${slug}.description`)
      : post.description ?? "");
  const relatedToolName =
    translatedToolName ||
    (typeof t.has === "function" && t.has(`posts.${slug}.relatedToolName`)
      ? t(`posts.${slug}.relatedToolName`)
      : "");
  const path = `/blog/${slug}`;

  const relatedPosts = BLOG_POSTS.filter(
    (p) => p.slug !== slug && p.category === post.category,
  )
    .slice(0, 3)
    .map((p) => {
      let sibTitle = p.title;
      if (!sibTitle && typeof t.has === "function" && t.has(`posts.${p.slug}.title`)) {
        sibTitle = t(`posts.${p.slug}.title`);
      }
      return { slug: p.slug, title: sibTitle || p.slug };
    });

  const jsonLd = buildJsonLd(
    {
      "@type": "BlogPosting",
      headline: title,
      description,
      image: {
        "@type": "ImageObject",
        url: `${BASE_URL}/blog/${slug}/opengraph-image`,
        width: 1200,
        height: 630,
      },
      author: authorSchema(),
      publisher: {
        "@type": "Organization",
        name: "ToolNotch",
        url: buildLocalizedUrl("/", "en"),
      },
      datePublished: post.publishedAt,
      dateModified: post.updatedAt ?? post.publishedAt,
      url: buildLocalizedUrl(path, locale),
      inLanguage: locale === "pt" ? "pt-BR" : locale,
    },
    breadcrumbSchema([
      { name: homeLabel, url: "/" },
      { name: blogLabel, url: "/blog" },
      { name: title, url: path },
    ]),
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AppArticleLayout
        title={title}
        description={description}
        publishedAt={post.publishedAt}
        updatedAt={post.updatedAt}
        readingTime={post.readingTimeMinutes}
        category={post.category}
        slug={slug}
        relatedToolPath={post.relatedToolPath}
        relatedToolName={relatedToolName}
        locale={locale}
        showAuthorBio={true}
        relatedPosts={relatedPosts}
        relatedTools={await relatedToolsFor(slug, locale, post.category)}
      >
        {translatedBody ? (
          <AppArticleBody
            blocks={translatedBody}
            putIntoPracticeLabel={t("putIntoPractice")}
            tryToolLabel={t("tryTool")}
          />
        ) : (
          <p className="text-label/70 italic text-sm">
            Article content coming soon.
          </p>
        )}
      </AppArticleLayout>
    </>
  );
}
