import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { ChevronRight, Home } from 'lucide-react'
import AdUnit from '@/components/AdUnit'
import { AD_SLOTS } from '@/lib/adSlots'

interface Props {
  title: string
  description: string
  publishedAt: string
  updatedAt?: string
  readingTime: number
  relatedToolPath?: string
  relatedToolName?: string
  locale: string
  children: React.ReactNode
  showAuthorBio?: boolean
  relatedPosts?: Array<{ slug: string; title: string }>
  /** WS-5: >= 2 contextual tool links per post. Already locale-prefixed. */
  relatedTools?: Array<{ href: string; label: string }>
}

function formatDate(isoDate: string, locale: string): string {
  const date = new Date(isoDate + 'T00:00:00')
  return date.toLocaleDateString(locale === 'pt' ? 'pt-BR' : locale === 'es' ? 'es' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default async function ArticleLayout({
  title,
  description,
  publishedAt,
  updatedAt,
  readingTime,
  relatedToolPath,
  relatedToolName,
  locale,
  children,
  showAuthorBio,
  relatedPosts,
  relatedTools,
}: Props) {
  const t = await getTranslations({ locale, namespace: 'blog' })
  const localizedBlogHref = locale === 'en' ? '/blog' : `/${locale}/blog`
  const minRead = t('minRead', { n: readingTime })
  const relatedToolLabel = relatedToolName ? t('relatedTool', { toolName: relatedToolName }) : ''

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="max-w-3xl mx-auto px-4 py-8">

        {/* Breadcrumb */}
        <nav
          className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mb-8"
          aria-label="Breadcrumb"
        >
          <Link
            href={locale === 'en' ? '/' : `/${locale}`}
            className="flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            <Home size={14} />
            <span>Home</span>
          </Link>
          <ChevronRight size={14} className="text-gray-400 dark:text-gray-600" />
          <Link
            href={localizedBlogHref}
            className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            {t('breadcrumbBlog')}
          </Link>
          <ChevronRight size={14} className="text-gray-400 dark:text-gray-600" />
          <span className="text-gray-700 font-medium dark:text-gray-200 truncate max-w-[200px]">
            {title}
          </span>
        </nav>

        {/* Article header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight mb-3 leading-tight">
            {title}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
            {description}
          </p>
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
            <time dateTime={publishedAt}>
              {formatDate(publishedAt, locale)}
            </time>
            <span aria-hidden>·</span>
            <span>{minRead}</span>
            {updatedAt && (
              <>
                <span aria-hidden>·</span>
                <span>Updated {formatDate(updatedAt, locale)}</span>
              </>
            )}
          </div>
        </header>

        {/* Article body */}
        <article className="prose prose-gray max-w-none dark:prose-invert text-gray-700 dark:text-gray-300 leading-relaxed space-y-6">
          {children}
        </article>

        {/* Author bio — engineering posts only */}
        {showAuthorBio && (
          <div className="mt-10 flex items-start gap-4 border-t border-gray-200 dark:border-gray-700 pt-8">
            <div>
              <p className="font-semibold text-gray-900 dark:text-white text-sm">Juan Soares</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Software Engineer · Node.js & AWS</p>
              <div className="flex gap-3">
                {process.env.NEXT_PUBLIC_AUTHOR_LINKEDIN_URL && (
                  <a
                    href={process.env.NEXT_PUBLIC_AUTHOR_LINKEDIN_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline dark:text-blue-400"
                  >
                    Follow on LinkedIn ↗
                  </a>
                )}
                <a
                  href={locale === 'en' ? '/blog' : `/${locale}/blog`}
                  className="text-xs text-gray-500 hover:underline dark:text-gray-400"
                >
                  ← All articles
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Related tool CTA */}
        {relatedToolPath && relatedToolName && (
          <div className="mt-10 rounded-xl border border-blue-200 bg-blue-50 dark:bg-blue-950/40 dark:border-blue-800 p-5">
            <p className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-1">
              Put it into practice
            </p>
            <Link
              href={relatedToolPath}
              className="text-blue-600 hover:underline font-medium dark:text-blue-400"
            >
              {relatedToolLabel}
            </Link>
          </div>
        )}

        {/* Related tools (WS-5: >= 2 contextual tool links per post) */}
        {relatedTools && relatedTools.length > 0 && (
          <section className="mt-10 pt-8 border-t border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t('relatedToolsHeading')}
            </h2>
            <ul className="space-y-2">
              {relatedTools.map((tool) => (
                <li key={tool.href}>
                  <Link
                    href={tool.href}
                    className="text-blue-600 hover:underline dark:text-blue-400"
                  >
                    {tool.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Related Articles */}
        {relatedPosts && relatedPosts.length > 0 && (
          <section className="mt-10 pt-8 border-t border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Related Articles
            </h2>
            <ul className="space-y-2">
              {relatedPosts.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/blog/${p.slug}`}
                    className="text-blue-600 hover:underline dark:text-blue-400"
                  >
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Ad below article */}
        <div className="mt-8">
          <AdUnit slot={AD_SLOTS.BLOG_ARTICLE_BOTTOM} />
        </div>

      </div>
    </main>
  )
}
