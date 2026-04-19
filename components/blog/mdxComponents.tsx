import type { MDXComponents } from 'mdx/types'

// Custom callout box for tips/warnings in articles
function Callout({ type = 'info', children }: { type?: 'tip' | 'warning' | 'info'; children: React.ReactNode }) {
  const styles = {
    tip:     'border-l-4 border-green-400 bg-green-50 dark:bg-green-950/30 dark:border-green-600',
    warning: 'border-l-4 border-yellow-400 bg-yellow-50 dark:bg-yellow-950/30 dark:border-yellow-600',
    info:    'border-l-4 border-blue-400 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-600',
  }
  return (
    <div className={`px-4 py-3 rounded-r-lg my-4 text-sm leading-relaxed ${styles[type]}`}>
      {children}
    </div>
  )
}

export const mdxComponents: MDXComponents = {
  Callout,
  // rehype-pretty-code handles pre/code — no override needed here
  // h2, h3 get default prose styles from ArticleLayout's `prose` class
}
