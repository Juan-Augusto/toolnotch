import fs from 'node:fs'
import path from 'node:path'
import { PRIORITY_PAIR_SLUGS, getPairContent } from '@/data/conversionPairContent'
import { QUIZ_REGISTRY } from '@/lib/quizRegistry'

/**
 * WS-5 item 9 — cross-slug snippet uniqueness.
 *
 * Search engines collapse (and devalue) pages whose meta descriptions or
 * titles are byte-identical, and a description that is only a from/to token
 * swap of its neighbour reads as templated boilerplate. This guards both:
 *
 *  - conversion-pair `metaDescription`s are unique per locale, and stay
 *    unique after the unit names + numbers are stripped (structural variance,
 *    not just "inches" -> "centimeters");
 *  - trivia quiz tier `<title>`s (`"<tier> — <quiz> | ToolNotch"`) are unique
 *    across every tier of every quiz.
 */

const LOCALES = ['en', 'pt', 'es'] as const

describe('conversion-pair metaDescription uniqueness', () => {
  describe.each(LOCALES)('locale %s', (locale) => {
    const rows = PRIORITY_PAIR_SLUGS.map((slug) => {
      const c = getPairContent(slug, locale)!
      return { slug, content: c }
    })

    it('every metaDescription is byte-distinct across slugs', () => {
      const seen = new Map<string, string>()
      for (const { slug, content } of rows) {
        const prev = seen.get(content.metaDescription)
        expect(prev).toBeUndefined()
        seen.set(content.metaDescription, slug)
      }
    })

    it('every metaDescription stays <= 160 characters', () => {
      for (const { content } of rows) {
        expect(content.metaDescription.length).toBeLessThanOrEqual(160)
      }
    })

    it('descriptions differ structurally, not just by a unit-token swap', () => {
      // Strip digits and the from/to unit labels, then require the remaining
      // sentence skeletons to still be unique.
      const skeletons = rows.map(({ content }) => {
        const strip = [content.fromLabel, content.toLabel]
          .join(' ')
          .toLowerCase()
          .split(/[^\p{L}]+/u)
          .filter((w) => w.length > 2)
        let s = content.metaDescription.toLowerCase()
        for (const w of strip) s = s.split(w).join(' ')
        return s.replace(/[0-9]+/g, ' ').replace(/[^\p{L}\s]/gu, ' ').replace(/\s+/g, ' ').trim()
      })
      expect(new Set(skeletons).size).toBe(skeletons.length)
    })
  })
})

describe('quiz tier title uniqueness', () => {
  const quizzesDir = path.join(process.cwd(), 'data', 'quizzes')

  function loadEnQuiz(slug: string): { title: string; tiers?: { id: string; label: string }[] } {
    for (const p of [
      path.join(quizzesDir, 'en', `${slug}.json`),
      path.join(quizzesDir, `${slug}.json`),
    ]) {
      if (fs.existsSync(p)) return JSON.parse(fs.readFileSync(p, 'utf8'))
    }
    throw new Error(`quiz JSON not found for ${slug}`)
  }

  const triviaSlugs = QUIZ_REGISTRY.filter((q) => q.type === 'trivia').map((q) => q.id)

  it('covers at least the known trivia quizzes', () => {
    expect(triviaSlugs.length).toBeGreaterThanOrEqual(6)
  })

  it('every "<tier> — <quiz> | ToolNotch" title is byte-distinct', () => {
    const titles: string[] = []
    for (const slug of triviaSlugs) {
      const quiz = loadEnQuiz(slug)
      const tiers = quiz.tiers ?? []
      expect(tiers.length).toBeGreaterThan(0)
      // tier labels are distinct within a quiz
      expect(new Set(tiers.map((t) => t.label)).size).toBe(tiers.length)
      for (const tier of tiers) {
        titles.push(`${tier.label} — ${quiz.title} | ToolNotch`)
      }
    }
    expect(new Set(titles).size).toBe(titles.length)
  })
})
