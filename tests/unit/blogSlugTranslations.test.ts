import fs from 'fs'
import path from 'path'
import {
  BLOG_LOCALES,
  BLOG_SLUG_GROUPS,
  LOCALIZED_BLOG_SLUGS,
  findSlugGroup,
  translateSlug,
  localizedSlugsFor,
} from '@/data/blog/slugTranslations'

const CONTENT_DIR = path.join(process.cwd(), 'data', 'blog', 'content')

describe('blog slug translations', () => {
  it('defines every locale for every group', () => {
    for (const [group, slugs] of Object.entries(BLOG_SLUG_GROUPS)) {
      for (const locale of BLOG_LOCALES) {
        expect(typeof slugs[locale]).toBe('string')
        expect(slugs[locale].length).toBeGreaterThan(0)
      }
      // A slug must not repeat across locales — that would collapse the group.
      const unique = new Set(BLOG_LOCALES.map((l) => slugs[l]))
      expect(unique.size).toBe(BLOG_LOCALES.length)
      expect(group).toBeTruthy()
    }
  })

  it('keeps every slug globally unique', () => {
    const all = LOCALIZED_BLOG_SLUGS.flatMap((g) => BLOG_LOCALES.map((l) => g[l]))
    expect(new Set(all).size).toBe(all.length)
  })

  it('translates a slug to its sibling in another locale', () => {
    expect(translateSlug('como-calcular-gpa', 'en')).toBe('how-to-calculate-gpa')
    expect(translateSlug('how-to-calculate-gpa', 'pt')).toBe('como-calcular-gpa')
    expect(translateSlug('how-to-calculate-gpa', 'es')).toBe('como-calcular-el-gpa')
  })

  it('leaves legacy shared-slug posts untouched', () => {
    expect(findSlugGroup('word-count-guide')).toBeNull()
    expect(translateSlug('word-count-guide', 'pt')).toBe('word-count-guide')
  })

  it('lists the localized slugs for each locale', () => {
    for (const locale of BLOG_LOCALES) {
      expect(localizedSlugsFor(locale)).toHaveLength(LOCALIZED_BLOG_SLUGS.length)
    }
  })
})

describe('localized MDX files on disk', () => {
  it('has a file for every slug in the translation map', () => {
    for (const locale of BLOG_LOCALES) {
      for (const slug of localizedSlugsFor(locale)) {
        const file = path.join(CONTENT_DIR, locale, `${slug}.mdx`)
        expect(fs.existsSync(file)).toBe(true)
      }
    }
  })

  it('has a translation-map entry for every localized MDX file', () => {
    for (const locale of BLOG_LOCALES) {
      const dir = path.join(CONTENT_DIR, locale)
      if (!fs.existsSync(dir)) continue
      for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.mdx'))) {
        const slug = file.replace(/\.mdx$/, '')
        expect(findSlugGroup(slug)).not.toBeNull()
      }
    }
  })

  it('keeps frontmatter valid: slug matches filename, description <= 160 chars', () => {
    for (const locale of BLOG_LOCALES) {
      const dir = path.join(CONTENT_DIR, locale)
      if (!fs.existsSync(dir)) continue
      for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.mdx'))) {
        const raw = fs.readFileSync(path.join(dir, file), 'utf8')
        const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/)
        expect(match).not.toBeNull()

        const fm: Record<string, string> = {}
        for (const line of match![1].split('\n')) {
          const colon = line.indexOf(':')
          if (colon === -1) continue
          let value = line.slice(colon + 1).trim()
          if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1)
          fm[line.slice(0, colon).trim()] = value
        }

        expect(fm.slug).toBe(file.replace(/\.mdx$/, ''))
        expect(fm.description.length).toBeLessThanOrEqual(160)
        expect(fm.updatedAt).toBeTruthy()
        expect(fm.category).toBeTruthy()
      }
    }
  })
})
