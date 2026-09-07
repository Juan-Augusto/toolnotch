import fs from 'fs/promises'
import path from 'path'
import type { BlogPost } from '@/lib/blogTypes'
import { BLOG_LOCALES } from '@/data/blog/slugTranslations'

const CONTENT_DIR = path.join(process.cwd(), 'data', 'blog', 'content')

export interface MdxFrontmatter {
  title: string
  description: string
  slug: string
  publishedAt: string
  updatedAt?: string
  category: string
  tags: string[]
  readingTimeMinutes: number
  linkedinUrl?: string
  relatedToolPath?: string
  relatedToolName?: string
}

export interface MdxBlogPost {
  frontmatter: MdxFrontmatter
  source: string  // raw MDX string, passed to MDXRemote
}

/**
 * Resolution order for a post's MDX file:
 *   1. `data/blog/content/{locale}/{slug}.mdx` — a post translated per locale
 *   2. `data/blog/content/{slug}.mdx`          — a legacy post shared by all locales
 *
 * A localized slug therefore resolves only under its own locale: requesting the
 * Portuguese slug under `/en` finds neither file and the caller renders a 404.
 */
function candidatePaths(slug: string, locale: string): string[] {
  return [
    path.join(CONTENT_DIR, locale, `${slug}.mdx`),
    path.join(CONTENT_DIR, `${slug}.mdx`),
  ]
}

// Returns null if the file does not exist
export async function getBlogPostSource(
  slug: string,
  locale = 'en',
): Promise<MdxBlogPost | null> {
  for (const filePath of candidatePaths(slug, locale)) {
    try {
      const raw = await fs.readFile(filePath, 'utf-8')
      const { data, content } = parseFrontmatter(raw)
      const frontmatter = data as unknown as MdxFrontmatter
      frontmatter.readingTimeMinutes = estimateReadingTime(content)
      return { frontmatter, source: content }
    } catch {
      // try the next candidate
    }
  }
  return null
}

/** Slug list for one directory, ignoring a missing directory. */
async function slugsInDir(dir: string): Promise<string[]> {
  try {
    const files = await fs.readdir(dir, { withFileTypes: true })
    return files
      .filter((f) => f.isFile() && f.name.endsWith('.mdx'))
      .map((f) => f.name.replace(/\.mdx$/, ''))
  } catch {
    return []
  }
}

/**
 * Slugs that render at `/{locale}/blog/{slug}`.
 * With no locale, returns every slug across every locale (superset).
 */
export async function getAllMdxSlugs(locale?: string): Promise<string[]> {
  const flat = await slugsInDir(CONTENT_DIR)
  const localeDirs = locale ? [locale] : BLOG_LOCALES
  const localized = (
    await Promise.all(localeDirs.map((l) => slugsInDir(path.join(CONTENT_DIR, l))))
  ).flat()
  return Array.from(new Set([...flat, ...localized]))
}

export async function getAllMdxBlogPosts(locale = 'en'): Promise<BlogPost[]> {
  const slugs = await getAllMdxSlugs(locale)
  const posts: BlogPost[] = []
  for (const slug of slugs) {
    const result = await getBlogPostSource(slug, locale)
    if (!result) continue
    const fm = result.frontmatter
    posts.push({
      slug,
      titleKey: '',
      descriptionKey: '',
      publishedAt: fm.publishedAt,
      updatedAt: fm.updatedAt,
      category: fm.category as BlogPost['category'],
      readingTimeMinutes: fm.readingTimeMinutes,
      locale: locale as BlogPost['locale'],
      title: fm.title,
      description: fm.description,
      tags: fm.tags,
      linkedinUrl: fm.linkedinUrl,
      relatedToolPath: fm.relatedToolPath,
    })
  }
  return posts.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
}

export function estimateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length
  return Math.max(1, Math.round(words / 200))
}

export function guardDescription(desc: string): string {
  if (process.env.NODE_ENV !== 'production' && desc.length > 160) {
    console.warn(`[SEO] Description too long (${desc.length} chars): "${desc.slice(0, 60)}..."`)
  }
  return desc.slice(0, 160)
}

// Minimal frontmatter parser — no external dependency needed
// Parses ---\nkey: value\n--- blocks
function parseFrontmatter(raw: string): { data: Record<string, unknown>; content: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/)
  if (!match) return { data: {}, content: raw }
  const data: Record<string, unknown> = {}
  for (const line of match[1].split('\n')) {
    const colon = line.indexOf(':')
    if (colon === -1) continue
    const key = line.slice(0, colon).trim()
    let val: unknown = line.slice(colon + 1).trim()
    // Parse quoted strings
    if (typeof val === 'string' && val.startsWith('"') && val.endsWith('"')) {
      val = val.slice(1, -1)
    }
    // Parse arrays like: ["a", "b"]
    if (typeof val === 'string' && val.startsWith('[')) {
      try { val = JSON.parse(val) } catch { /* keep as string */ }
    }
    // Parse numbers
    if (typeof val === 'string' && /^\d+$/.test(val)) {
      val = parseInt(val, 10)
    }
    data[key] = val
  }
  return { data, content: match[2] }
}
