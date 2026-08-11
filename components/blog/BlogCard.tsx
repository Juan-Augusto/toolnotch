import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import type { BlogPost } from '@/lib/blogTypes'

interface Props {
  post: BlogPost
  locale: string
}

const categoryColorMap: Record<BlogPost['category'], string> = {
  finance:      'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  health:       'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  text:         'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  education:    'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  productivity: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  engineering:  'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
}

function formatDate(isoDate: string, locale: string): string {
  const date = new Date(isoDate + 'T00:00:00')
  return date.toLocaleDateString(locale === 'pt' ? 'pt-BR' : locale === 'es' ? 'es' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default async function BlogCard({ post, locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'blog' })

  const title = post.title ?? t(`posts.${post.slug}.title`)
  const description = post.description ?? t(`posts.${post.slug}.description`)
  const categoryLabel = t(`categories.${post.category}`)
  const readArticle = t('readArticle')
  const minRead = t('minRead', { n: post.readingTimeMinutes })

  return (
    <Link
      href={`/${locale === 'en' ? '' : locale + '/'}blog/${post.slug}`}
      className="block bg-card border border-gray-200 rounded-xl p-5 hover:border-gray-300 hover:shadow-sm transition-all group dark:bg-card dark:border-gray-700 dark:hover:border-gray-600"
    >
      <div className="flex items-center gap-2 mb-3">
        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${categoryColorMap[post.category]}`}>
          {categoryLabel}
        </span>
      </div>

      <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors text-sm leading-snug mb-2 dark:text-white dark:group-hover:text-blue-400">
        {title}
      </p>

      <p className="text-xs text-gray-500 leading-relaxed mb-4 dark:text-gray-400">
        {description}
      </p>

      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400 dark:text-gray-500">
          {formatDate(post.publishedAt, locale)} · {minRead}
        </span>
        <span className="text-xs font-medium text-blue-600 group-hover:underline dark:text-blue-400">
          {readArticle}
        </span>
      </div>
    </Link>
  )
}
