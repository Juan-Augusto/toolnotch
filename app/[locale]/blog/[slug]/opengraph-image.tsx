import { ImageResponse } from 'next/og'
import fs from 'fs/promises'
import path from 'path'
import { getBlogPostSource } from '@/lib/content/blogRepository'
import { BLOG_POSTS } from '@/data/blog/index'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const CATEGORY_COLORS: Record<string, string> = {
  finance: '#16a34a',
  health: '#dc2626',
  education: '#7c3aed',
  text: '#d97706',
  productivity: '#0284c7',
  engineering: '#475569',
}

const FALLBACK_COLOR = '#2563eb'

function accentColor(category: string): string {
  return CATEGORY_COLORS[category] ?? FALLBACK_COLOR
}

export default async function Image({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { slug, locale } = await params

  let title = ''
  let category = 'finance'

  // 1. Try MDX source first (has frontmatter.title directly)
  const mdxPost = await getBlogPostSource(slug, locale)
  if (mdxPost) {
    title = mdxPost.frontmatter.title
    category = mdxPost.frontmatter.category
  } else {
    // 2. Fall back to BLOG_POSTS registry — title lives in messages/en.json
    const post = BLOG_POSTS.find((p) => p.slug === slug)
    if (post) {
      category = post.category
      // Load title from messages/en.json using titleKey (e.g. "blog.posts.{slug}.title")
      try {
        const messagesPath = path.join(process.cwd(), 'messages', 'en.json')
        const raw = await fs.readFile(messagesPath, 'utf-8')
        const messages = JSON.parse(raw) as Record<string, unknown>
        // Navigate nested keys: blog → posts → slug → title
        const blogSection = messages['blog'] as Record<string, unknown> | undefined
        const postsSection = blogSection?.['posts'] as Record<string, unknown> | undefined
        const postSection = postsSection?.[slug] as Record<string, unknown> | undefined
        title = (postSection?.['title'] as string) ?? slug
      } catch {
        title = slug
      }
    } else {
      title = slug
    }
  }

  const accent = accentColor(category)
  const categoryLabel = category.charAt(0).toUpperCase() + category.slice(1)

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: '#0f172a',
          position: 'relative',
        }}
      >
        {/* Category-colored accent bar — top-left, 80px wide, 6px tall */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '80px',
            height: '6px',
            background: accent,
          }}
        />

        {/* Main content area — vertically centered */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            flex: 1,
            padding: '0 80px',
          }}
        >
          <div
            style={{
              color: '#ffffff',
              fontSize: '52px',
              fontWeight: 700,
              maxWidth: '900px',
              lineHeight: 1.2,
            }}
          >
            {title}
          </div>
        </div>

        {/* Footer row */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0 80px 48px',
          }}
        >
          <div
            style={{
              color: '#94a3b8',
              fontSize: '28px',
            }}
          >
            toolnotch.com
          </div>
          <div
            style={{
              color: accent,
              fontSize: '28px',
              fontWeight: 600,
            }}
          >
            {categoryLabel}
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
