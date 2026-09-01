export interface BlogPost {
  slug: string
  titleKey: string          // i18n key under 'blog.posts.[slug].title'
  descriptionKey: string
  publishedAt: string       // ISO date string '2026-04-10'
  updatedAt?: string
  category: 'finance' | 'health' | 'text' | 'education' | 'productivity' | 'engineering' | 'fun'
  relatedToolPath?: string  // e.g. '/tools/finance/mortgage-calculator'
  relatedToolNameKey?: string
  readingTimeMinutes: number
  locale: 'en' | 'all'
  // MDX-sourced fields (engineering posts only)
  title?: string            // if present, BlogCard uses this instead of calling t()
  description?: string      // same
  tags?: string[]
  linkedinUrl?: string
}
