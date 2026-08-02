import fs from 'fs/promises'
import path from 'path'
import type { BlogPost } from '@/lib/blogTypes'

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

// Returns null if the file does not exist
export async function getBlogPostSource(slug: string): Promise<MdxBlogPost | null> {
  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`)
  try {
    const raw = await fs.readFile(filePath, 'utf-8')
    const { data, content } = parseFrontmatter(raw)
    const frontmatter = data as unknown as MdxFrontmatter
    frontmatter.readingTimeMinutes = estimateReadingTime(content)
    return { frontmatter, source: content }
  } catch {
    return null
  }
}

export async function getAllMdxSlugs(): Promise<string[]> {
  try {
    const files = await fs.readdir(CONTENT_DIR)
    return files
      .filter((f) => f.endsWith('.mdx'))
      .map((f) => f.replace(/\.mdx$/, ''))
  } catch {
    return []
  }
}

export async function getAllMdxBlogPosts(): Promise<BlogPost[]> {
  try {
    const files = await fs.readdir(CONTENT_DIR)
    const mdxFiles = files.filter((f) => f.endsWith('.mdx'))
    const posts: BlogPost[] = []
    for (const file of mdxFiles) {
      const slug = file.replace(/\.mdx$/, '')
      const result = await getBlogPostSource(slug)
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
        locale: 'en',
        title: fm.title,
        description: fm.description,
        tags: fm.tags,
        linkedinUrl: fm.linkedinUrl,
        relatedToolPath: fm.relatedToolPath,
      })
    }
    return posts.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
  } catch {
    return []
  }
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
