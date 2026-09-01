import {
  PAIR_CONTENT,
  PRIORITY_PAIR_SLUGS,
  getPairContent,
  type PairContent,
} from '@/data/conversionPairContent'

// Mirrors `locales` in i18n.ts. Imported literally rather than from '@/i18n',
// which pulls next-intl's ESM server entrypoint into the Jest CJS runtime.
const LOCALES = ['en', 'pt', 'es'] as const

function wordCount(content: PairContent): number {
  const prose = [
    content.intro,
    content.about,
    content.formulaNote,
    content.proTip,
    ...content.scenarios.flatMap(s => [s.title, s.text]),
  ].join(' ')
  return prose.split(/\s+/).filter(Boolean).length
}

describe('PAIR_CONTENT — coverage', () => {
  it('covers every priority slug', () => {
    for (const slug of PRIORITY_PAIR_SLUGS) {
      expect(PAIR_CONTENT[slug]).toBeDefined()
    }
  })

  it('has no content for slugs outside the priority list', () => {
    expect(Object.keys(PAIR_CONTENT).sort()).toEqual([...PRIORITY_PAIR_SLUGS].sort())
  })
})

describe.each(PRIORITY_PAIR_SLUGS)('%s', (slug) => {
  describe.each(LOCALES)('locale %s', (locale) => {
    const content = getPairContent(slug, locale)!

    it('exists', () => {
      expect(content).toBeTruthy()
    })

    it('has a non-empty h1, metaTitle and intro', () => {
      expect(content.h1.trim().length).toBeGreaterThan(0)
      expect(content.metaTitle.trim().length).toBeGreaterThan(0)
      expect(content.intro.trim().length).toBeGreaterThan(0)
    })

    it('does not repeat the brand suffix applied by the layout template', () => {
      // app/[locale]/layout.tsx sets `template: '%s | ToolNotch'`.
      expect(content.metaTitle).not.toMatch(/ToolNotch/)
    })

    it('has a meta title short enough to survive SERP truncation', () => {
      // 60 chars here + " | ToolNotch" (12) from the template = 72.
      expect(content.metaTitle.length).toBeLessThanOrEqual(60)
    })

    it('has a meta description of at most 160 characters', () => {
      expect(content.metaDescription.length).toBeLessThanOrEqual(160)
      expect(content.metaDescription.length).toBeGreaterThan(50)
    })

    it('has at least 250 words of unique body prose', () => {
      expect(wordCount(content)).toBeGreaterThanOrEqual(250)
    })

    it('has two or three real-world scenarios', () => {
      expect(content.scenarios.length).toBeGreaterThanOrEqual(2)
      expect(content.scenarios.length).toBeLessThanOrEqual(3)
      for (const scenario of content.scenarios) {
        expect(scenario.title.trim().length).toBeGreaterThan(0)
        expect(scenario.text.trim().length).toBeGreaterThan(0)
      }
    })

    it('has a formula and localised unit labels', () => {
      expect(content.formula.trim().length).toBeGreaterThan(0)
      expect(content.fromLabel.trim().length).toBeGreaterThan(0)
      expect(content.toLabel.trim().length).toBeGreaterThan(0)
    })
  })
})

// ---------------------------------------------------------------------------
// The whole point of WS-2: /pt and /es must not serve the English strings.
// ---------------------------------------------------------------------------

describe('PAIR_CONTENT — locales are genuinely different', () => {
  for (const slug of PRIORITY_PAIR_SLUGS) {
    it(`${slug} has distinct h1 / metaTitle / body per locale`, () => {
      const en = getPairContent(slug, 'en')!
      const pt = getPairContent(slug, 'pt')!
      const es = getPairContent(slug, 'es')!

      expect(pt.h1).not.toBe(en.h1)
      expect(es.h1).not.toBe(en.h1)
      expect(pt.metaTitle).not.toBe(en.metaTitle)
      expect(es.metaTitle).not.toBe(en.metaTitle)
      expect(pt.metaDescription).not.toBe(en.metaDescription)
      expect(es.metaDescription).not.toBe(en.metaDescription)
      expect(pt.about).not.toBe(en.about)
      expect(es.about).not.toBe(en.about)
      expect(pt.about).not.toBe(es.about)
    })
  }
})

// ---------------------------------------------------------------------------
// Content must be unique per pair, not boilerplate shared across pairs.
// ---------------------------------------------------------------------------

describe('PAIR_CONTENT — no boilerplate reuse across pairs', () => {
  for (const locale of LOCALES) {
    it(`${locale}: every pair has a unique "about" paragraph`, () => {
      const abouts = PRIORITY_PAIR_SLUGS.map(s => getPairContent(s, locale)!.about)
      expect(new Set(abouts).size).toBe(abouts.length)
    })

    it(`${locale}: every pair has a unique intro and pro tip`, () => {
      const intros = PRIORITY_PAIR_SLUGS.map(s => getPairContent(s, locale)!.intro)
      const tips = PRIORITY_PAIR_SLUGS.map(s => getPairContent(s, locale)!.proTip)
      expect(new Set(intros).size).toBe(intros.length)
      expect(new Set(tips).size).toBe(tips.length)
    })

    it(`${locale}: every pair has a unique metaTitle`, () => {
      const titles = PRIORITY_PAIR_SLUGS.map(s => getPairContent(s, locale)!.metaTitle)
      expect(new Set(titles).size).toBe(titles.length)
    })
  }
})

describe('getPairContent — fallback behaviour', () => {
  it('returns null for a pair that has not been localised', () => {
    expect(getPairContent('celsius-to-fahrenheit', 'pt')).toBeNull()
  })

  it('returns null for an unknown slug', () => {
    expect(getPairContent('not-a-real-pair', 'en')).toBeNull()
  })

  it('falls back to English for an unsupported locale', () => {
    expect(getPairContent('inches-to-centimeters', 'fr')).toBe(
      PAIR_CONTENT['inches-to-centimeters'].en
    )
  })
})
