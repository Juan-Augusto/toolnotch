import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { MDXRemote } from 'next-mdx-remote/rsc'
import rehypePrettyCode from 'rehype-pretty-code'
import { buildAlternates } from '@/lib/i18nMeta'
import { buildJsonLd, breadcrumbSchema, buildLocalizedUrl, authorSchema } from '@/lib/schema'
import { BLOG_POSTS } from '@/data/blog/index'
import { getBlogPostSource, getAllMdxSlugs, guardDescription } from '@/lib/content/blogRepository'
import { mdxComponents } from '@/components/blog/mdxComponents'
import ArticleLayout from '@/components/blog/ArticleLayout'

// rehype-pretty-code options — dual theme for dark mode
const rehypePrettyCodeOptions = {
  theme: {
    dark: 'github-dark-dimmed',
    light: 'github-light',
  },
  keepBackground: false,
}

interface Props {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateStaticParams() {
  const existingSlugs = BLOG_POSTS.map((post) => ({ slug: post.slug }))
  const mdxSlugs = await getAllMdxSlugs()
  const mdxParams = mdxSlugs
    .filter((slug) => !BLOG_POSTS.some((p) => p.slug === slug))
    .map((slug) => ({ slug }))
  return [...existingSlugs, ...mdxParams]
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://toolnotch.com'

  // MDX-sourced post takes priority
  const mdxResult = await getBlogPostSource(slug)
  if (mdxResult) {
    const { frontmatter: fm } = mdxResult
    const path = `/blog/${slug}`
    return {
      title: fm.title,
      description: guardDescription(fm.description),
      alternates: buildAlternates(path),
      openGraph: {
        type: 'article',
        publishedTime: fm.publishedAt,
        modifiedTime: fm.updatedAt ?? fm.publishedAt,
        authors: ['Juan Soares'],
        images: [`${BASE_URL}/blog/${slug}/opengraph-image`],
      },
    }
  }

  // Fall back to i18n-based post
  const post = BLOG_POSTS.find((p) => p.slug === slug)
  if (!post) return {}

  const t = await getTranslations({ locale, namespace: 'blog' })
  const title = t(`posts.${slug}.title`)
  const description = t(`posts.${slug}.description`)
  const path = `/blog/${slug}`

  return {
    title,
    description: guardDescription(description),
    alternates: buildAlternates(path),
    openGraph: {
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
      authors: ['Juan Soares'],
      images: [`${BASE_URL}/blog/${slug}/opengraph-image`],
    },
  }
}

export default async function BlogArticlePage({ params }: Props) {
  const { locale, slug } = await params
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://toolnotch.com'

  // --- MDX path ---
  const mdxResult = await getBlogPostSource(slug)
  if (mdxResult) {
    const { frontmatter: fm, source } = mdxResult
    const path = `/blog/${slug}`
    const currentCategory = fm.category as string | undefined
    const relatedPosts = BLOG_POSTS
      .filter((p) => p.slug !== slug && p.category === currentCategory)
      .slice(0, 3)
      .map((p) => ({ slug: p.slug, title: p.title ?? p.titleKey }))

    const jsonLd = buildJsonLd(
      {
        '@type': 'BlogPosting',
        headline: fm.title,
        description: fm.description,
        image: {
          '@type': 'ImageObject',
          url: `${BASE_URL}/blog/${slug}/opengraph-image`,
          width: 1200,
          height: 630,
        },
        author: authorSchema(),
        publisher: {
          '@type': 'Organization',
          name: 'ToolNotch',
          url: buildLocalizedUrl('/', 'en'),
        },
        datePublished: fm.publishedAt,
        dateModified: fm.updatedAt ?? fm.publishedAt,
        url: buildLocalizedUrl(path, locale),
        inLanguage: locale === 'pt' ? 'pt-BR' : locale,
      },
      breadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'Blog', url: '/blog' },
        { name: fm.title, url: path },
      ]),
    )

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ArticleLayout
          title={fm.title}
          description={fm.description}
          publishedAt={fm.publishedAt}
          updatedAt={fm.updatedAt}
          readingTime={fm.readingTimeMinutes}
          relatedToolPath={fm.relatedToolPath}
          relatedToolName={fm.relatedToolName}
          locale={locale}
          showAuthorBio={true}
          relatedPosts={relatedPosts}
        >
          <MDXRemote
            source={source}
            components={mdxComponents}
            options={{
              mdxOptions: {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                rehypePlugins: [[rehypePrettyCode as any, rehypePrettyCodeOptions]],
              },
            }}
          />
        </ArticleLayout>
      </>
    )
  }

  // --- i18n / "coming soon" path (existing posts) ---
  const post = BLOG_POSTS.find((p) => p.slug === slug)
  if (!post) notFound()

  const relatedPosts = BLOG_POSTS
    .filter((p) => p.slug !== slug && p.category === post.category)
    .slice(0, 3)
    .map((p) => ({ slug: p.slug, title: p.title ?? p.titleKey }))

  const t = await getTranslations({ locale, namespace: 'blog' })
  const title = t(`posts.${slug}.title`)
  const description = t(`posts.${slug}.description`)
  const relatedToolName = t(`posts.${slug}.relatedToolName`)
  const path = `/blog/${slug}`

  const jsonLd = buildJsonLd(
    {
      '@type': 'BlogPosting',
      headline: title,
      description,
      image: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/blog/${slug}/opengraph-image`,
        width: 1200,
        height: 630,
      },
      author: authorSchema(),
      publisher: {
        '@type': 'Organization',
        name: 'ToolNotch',
        url: buildLocalizedUrl('/', 'en'),
      },
      datePublished: post.publishedAt,
      dateModified: post.updatedAt ?? post.publishedAt,
      url: buildLocalizedUrl(path, locale),
      inLanguage: locale === 'pt' ? 'pt-BR' : locale,
    },
    breadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: t('breadcrumbBlog'), url: '/blog' },
      { name: title, url: path },
    ]),
  )

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ArticleLayout
        title={title}
        description={description}
        publishedAt={post.publishedAt}
        updatedAt={post.updatedAt}
        readingTime={post.readingTimeMinutes}
        relatedToolPath={post.relatedToolPath}
        relatedToolName={relatedToolName}
        locale={locale}
        relatedPosts={relatedPosts}
      >
        <p className="text-gray-500 dark:text-gray-400 italic">
          Article content coming soon.
        </p>
      </ArticleLayout>
    </>
  )
}
