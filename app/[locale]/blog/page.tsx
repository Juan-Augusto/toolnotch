import type { Metadata } from 'next'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { buildAlternates } from '@/lib/i18nMeta'
import { buildJsonLd, breadcrumbSchema } from '@/lib/schema'
import { BLOG_POSTS } from '@/data/blog/index'
import { getAllMdxBlogPosts } from '@/lib/content/blogRepository'
import BlogCard from '@/components/blog/BlogCard'
import AdUnit from '@/components/AdUnit'
import { AD_SLOTS } from '@/lib/adSlots'

const PATH = '/blog'

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'blog' })
  return {
    title: t('indexTitle'),
    description: t('indexDescription'),
    alternates: buildAlternates(PATH),
  }
}

export default async function BlogIndexPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'blog' })

  const mdxPosts = await getAllMdxBlogPosts()
  // A post registered in BLOG_POSTS may also have an MDX file — keep the first (registered) entry.
  const seen = new Set<string>()
  const allPosts = [...BLOG_POSTS, ...mdxPosts].filter((p) => {
    if (seen.has(p.slug)) return false
    seen.add(p.slug)
    return true
  })
  allPosts.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))

  const jsonLd = buildJsonLd(
    breadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: t('breadcrumbBlog'), url: PATH },
    ]),
  )

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 py-12">

          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <Link
                href={locale === 'en' ? '/' : `/${locale}`}
                className="text-sm text-blue-600 hover:underline dark:text-blue-400"
              >
                Home
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {t('breadcrumbBlog')}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
              {t('indexTitle')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl">
              {t('indexDescription')}
            </p>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl mt-4">
              {t('indexIntro')}
            </p>
            <div className="mt-6 max-w-2xl">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {t('indexGuideHeading')}
              </h2>
              <ul className="list-disc pl-5 space-y-1.5 text-gray-600 dark:text-gray-400 leading-relaxed">
                {Object.values(t.raw('indexCategoryBlurbs') as Record<string, string>).map(
                  (blurb, i) => (
                    <li key={i}>{blurb}</li>
                  ),
                )}
              </ul>
            </div>
          </div>

          {/* Ad above grid */}
          <div className="mb-8">
            <AdUnit slot={AD_SLOTS.BLOG_INDEX_TOP} />
          </div>

          {/* Blog post grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {allPosts.map((post) => (
              <BlogCard key={post.slug} post={post} locale={locale} />
            ))}
          </div>

        </div>
      </main>
    </>
  )
}
