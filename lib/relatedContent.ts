/**
 * WS-5 item 1 — contextual internal-linking map.
 *
 * A typed map from a tool/blog path to the related tools + blog posts that
 * belong next to it. `components/RelatedContent.tsx` renders it as real
 * server-reachable `<a href>` links with descriptive, locale-correct anchor
 * text; `resolveToolRelated()` guarantees the WS-5 minimum (>= 2 related
 * tools + >= 1 blog post) for EVERY tool path, falling back to catalogue
 * siblings in the same category when a path has no bespoke entry.
 *
 * Anchor labels are resolved from EXISTING message keys only:
 *   - `homeTools`  -> `home.tools.<key>.label`
 *   - `blogPosts`  -> `blog.posts.<slug>.title`
 * so nothing new has to be translated and every anchor is en/pt/es correct.
 *
 * Pure data + pure helpers — no framework imports — safe for the Jest runtime.
 */

import { TOOL_CATALOG, catalogByCategory, type CatalogEntry } from '@/lib/toolCatalog'

export type LabelNs = 'homeTools' | 'blogPosts'

/** A resolved anchor: which translator + key to use, and how to build the href. */
export interface RelatedLinkSpec {
  /** Locale-agnostic path for tools; ignored for slug-group posts. */
  path?: string
  /** Legacy flat blog slug (same in every locale). */
  postSlug?: string
  /** Translation-group id for a post with a native slug per locale (see slugTranslations). */
  postGroup?: 'gpa-how-to' | 'gpa-brazilian-grades' | 'gpa-us-admissions'
  labelNs: LabelNs
  labelKey: string
}

/** Post shorthand -> RelatedLinkSpec. */
const POST: Record<string, RelatedLinkSpec> = {
  'mortgage-payment': { postSlug: 'how-to-calculate-mortgage-payment', labelNs: 'blogPosts', labelKey: 'how-to-calculate-mortgage-payment' },
  'bmi-body-fat': { postSlug: 'bmi-vs-body-fat-percentage', labelNs: 'blogPosts', labelKey: 'bmi-vs-body-fat-percentage' },
  'cite-apa': { postSlug: 'how-to-cite-website-apa', labelNs: 'blogPosts', labelKey: 'how-to-cite-website-apa' },
  'word-count': { postSlug: 'word-count-guide', labelNs: 'blogPosts', labelKey: 'word-count-guide' },
  'typing-speed': { postSlug: 'average-typing-speed', labelNs: 'blogPosts', labelKey: 'average-typing-speed' },
  'gpa-how-to': { postGroup: 'gpa-how-to', labelNs: 'homeTools', labelKey: 'gpaGuide' },
  'gpa-brazil': { postGroup: 'gpa-brazilian-grades', labelNs: 'homeTools', labelKey: 'gpaBrazilGuide' },
  'gpa-usa': { postGroup: 'gpa-us-admissions', labelNs: 'homeTools', labelKey: 'gpaUsaGuide' },
}

function tool(path: string): RelatedLinkSpec {
  const entry = TOOL_CATALOG.find((e) => e.path === path)
  return {
    path,
    labelNs: 'homeTools',
    labelKey: entry?.labelKey ?? path.split('/').pop() ?? path,
  }
}

export interface ResolvedRelated {
  tools: RelatedLinkSpec[]
  posts: RelatedLinkSpec[]
}

/** Bespoke clusters. Everything not listed falls back to catalogue siblings. */
const TOOL_MAP: Record<string, { tools: string[]; posts: (keyof typeof POST)[] }> = {
  // ── Conversion (WS-2) ──────────────────────────────────────────────────
  '/tools/convert/unit-converter': {
    tools: ['/tools/convert/length-converter', '/tools/convert/weight-converter', '/tools/convert/temperature-converter'],
    posts: ['word-count'],
  },
  '/tools/convert/length-converter': {
    tools: ['/tools/convert/unit-converter', '/tools/convert/weight-converter', '/tools/convert/temperature-converter'],
    posts: ['word-count'],
  },
  // ── Education / GPA (WS-1) ─────────────────────────────────────────────
  '/tools/education/gpa-calculator': {
    tools: ['/tools/education/cumulative-gpa-calculator', '/tools/education/grade-calculator', '/tools/education/citation-generator'],
    posts: ['gpa-how-to', 'gpa-brazil', 'gpa-usa'],
  },
  '/tools/education/cumulative-gpa-calculator': {
    tools: ['/tools/education/gpa-calculator', '/tools/education/grade-calculator', '/tools/education/citation-generator'],
    posts: ['gpa-how-to', 'gpa-usa'],
  },
  '/tools/education/grade-calculator': {
    tools: ['/tools/education/gpa-calculator', '/tools/education/cumulative-gpa-calculator', '/tools/education/citation-generator'],
    posts: ['gpa-how-to'],
  },
  '/tools/education/citation-generator': {
    tools: ['/tools/education/gpa-calculator', '/tools/education/grade-calculator', '/tools/text/word-counter'],
    posts: ['cite-apa'],
  },
  // ── Text tools (WS-4) ─────────────────────────────────────────────────
  '/tools/text/keyword-density-checker': {
    tools: ['/tools/text/word-frequency-counter', '/tools/text/word-counter', '/tools/text/readability-checker'],
    posts: ['word-count'],
  },
  '/tools/text/word-frequency-counter': {
    tools: ['/tools/text/keyword-density-checker', '/tools/text/word-counter', '/tools/text/character-counter'],
    posts: ['word-count'],
  },
  '/tools/text/word-counter': {
    tools: ['/tools/text/character-counter', '/tools/text/reading-time-calculator', '/tools/text/word-frequency-counter'],
    posts: ['word-count'],
  },
  '/tools/text/reading-time-calculator': {
    tools: ['/tools/text/word-counter', '/tools/text/readability-checker', '/tools/text/character-counter'],
    posts: ['word-count'],
  },
  '/tools/text/readability-checker': {
    tools: ['/tools/text/word-counter', '/tools/text/reading-time-calculator', '/tools/text/keyword-density-checker'],
    posts: ['word-count'],
  },
  // ── Fun / wheel (WS-4) ────────────────────────────────────────────────
  '/tools/fun/wheel-of-names': {
    tools: ['/tools/fun/random-name-picker', '/tools/fun/random-team-generator', '/tools/fun/spin-the-wheel'],
    posts: ['typing-speed'],
  },
  '/tools/fun/random-name-picker': {
    tools: ['/tools/fun/wheel-of-names', '/tools/fun/random-team-generator', '/tools/fun/spin-the-wheel'],
    posts: ['typing-speed'],
  },
  // ── Finance ──────────────────────────────────────────────────────────
  '/tools/finance/mortgage-calculator': {
    tools: ['/tools/finance/loan-calculator', '/tools/finance/amortization-calculator', '/tools/finance/home-affordability-calculator'],
    posts: ['mortgage-payment'],
  },
  '/tools/finance/loan-calculator': {
    tools: ['/tools/finance/mortgage-calculator', '/tools/finance/car-loan-calculator', '/tools/finance/amortization-calculator'],
    posts: ['mortgage-payment'],
  },
  // ── Health ───────────────────────────────────────────────────────────
  '/tools/health/bmi-calculator': {
    tools: ['/tools/health/tdee-calculator', '/tools/health/calorie-deficit-calculator', '/tools/math/age-calculator'],
    posts: ['bmi-body-fat'],
  },
  '/tools/health/tdee-calculator': {
    tools: ['/tools/health/bmi-calculator', '/tools/health/calorie-deficit-calculator', '/tools/math/age-calculator'],
    posts: ['bmi-body-fat'],
  },
  // ── Fun / typing ─────────────────────────────────────────────────────
  '/tools/fun/typing-test': {
    tools: ['/tools/text/word-counter', '/tools/text/reading-time-calculator', '/tools/fun/random-name-picker'],
    posts: ['typing-speed'],
  },
}

/** Default blog post for a category with no bespoke cluster. */
const CATEGORY_DEFAULT_POST: Record<string, keyof typeof POST> = {
  text: 'word-count',
  finance: 'mortgage-payment',
  health: 'bmi-body-fat',
  education: 'gpa-how-to',
  fun: 'typing-speed',
  convert: 'word-count',
  math: 'word-count',
  image: 'word-count',
  pdf: 'word-count',
  agile: 'typing-speed',
}

function categoryOf(path: string): string {
  const m = path.match(/^\/tools\/([^/]+)\//)
  return m ? m[1] : ''
}

/**
 * Related tools + posts for a tool page. Always returns >= 2 tool links and
 * >= 1 post link (the WS-5 minimum), padding from catalogue siblings.
 */
export function resolveToolRelated(rawPath: string): ResolvedRelated {
  const path = rawPath.replace(/\/$/, '')
  const bespoke = TOOL_MAP[path]
  const cat = categoryOf(path)

  const toolPaths: string[] = []
  if (bespoke) toolPaths.push(...bespoke.tools)
  // Pad with same-category catalogue siblings.
  for (const sib of siblingPool(path, cat)) {
    if (toolPaths.length >= 4) break
    if (sib !== path && !toolPaths.includes(sib)) toolPaths.push(sib)
  }
  // Last-resort pad from the whole catalogue (keeps the >= 2 guarantee).
  for (const e of TOOL_CATALOG) {
    if (toolPaths.length >= 2) break
    if (e.path !== path && !toolPaths.includes(e.path)) toolPaths.push(e.path)
  }

  const postKeys: (keyof typeof POST)[] = bespoke
    ? [...bespoke.posts]
    : [CATEGORY_DEFAULT_POST[cat] ?? 'word-count']
  if (postKeys.length === 0) postKeys.push('word-count')

  return {
    tools: toolPaths.slice(0, 4).map(tool),
    posts: [...new Set(postKeys)].map((k) => POST[k]),
  }
}

const KNOWN_BUCKETS = [
  'image', 'pdf', 'convert', 'text', 'finance', 'fun', 'agile',
  'education', 'health', 'math', 'utilities', 'interview',
] as const

function siblingPool(path: string, cat: string): string[] {
  if (!(KNOWN_BUCKETS as readonly string[]).includes(cat)) return []
  return catalogByCategory(cat as CatalogEntry['category'])
    .map((e) => e.path)
    .filter((p) => p !== path)
}

/**
 * Related tools + sibling posts for a blog post. `siblingSlugs` are the
 * same-category posts the page already computed; this only adds the >= 2
 * tool links WS-5 requires.
 */
export function resolveBlogRelated(slug: string, category?: string): RelatedLinkSpec[] {
  const map: Record<string, string[]> = {
    'how-to-calculate-mortgage-payment': ['/tools/finance/mortgage-calculator', '/tools/finance/loan-calculator', '/tools/finance/amortization-calculator'],
    'bmi-vs-body-fat-percentage': ['/tools/health/bmi-calculator', '/tools/health/tdee-calculator', '/tools/math/age-calculator'],
    'how-to-cite-website-apa': ['/tools/education/citation-generator', '/tools/education/gpa-calculator', '/tools/text/word-counter'],
    'word-count-guide': ['/tools/text/word-counter', '/tools/text/character-counter', '/tools/text/reading-time-calculator'],
    'average-typing-speed': ['/tools/fun/typing-test', '/tools/text/word-counter', '/tools/text/reading-time-calculator'],
    'wheel-of-names-alternatives': ['/tools/fun/wheel-of-names', '/tools/fun/random-name-picker', '/tools/fun/random-team-generator'],
    'how-to-calculate-gpa': ['/tools/education/gpa-calculator', '/tools/education/cumulative-gpa-calculator', '/tools/education/grade-calculator'],
    'como-calcular-gpa': ['/tools/education/gpa-calculator', '/tools/education/cumulative-gpa-calculator', '/tools/education/grade-calculator'],
    'como-calcular-el-gpa': ['/tools/education/gpa-calculator', '/tools/education/cumulative-gpa-calculator', '/tools/education/grade-calculator'],
    'convert-brazilian-grades-to-gpa': ['/tools/education/gpa-calculator', '/tools/education/grade-calculator', '/tools/education/citation-generator'],
    'converter-notas-brasileiras-para-gpa': ['/tools/education/gpa-calculator', '/tools/education/grade-calculator', '/tools/education/citation-generator'],
    'convertir-notas-brasilenas-a-gpa': ['/tools/education/gpa-calculator', '/tools/education/grade-calculator', '/tools/education/citation-generator'],
    'gpa-needed-for-us-universities': ['/tools/education/gpa-calculator', '/tools/education/cumulative-gpa-calculator', '/tools/education/citation-generator'],
    'gpa-para-aplicar-universidade-eua': ['/tools/education/gpa-calculator', '/tools/education/cumulative-gpa-calculator', '/tools/education/citation-generator'],
    'gpa-para-estudiar-en-estados-unidos': ['/tools/education/gpa-calculator', '/tools/education/cumulative-gpa-calculator', '/tools/education/citation-generator'],
  }
  const byCategory: Record<string, string[]> = {
    finance: ['/tools/finance/loan-calculator', '/tools/finance/mortgage-calculator', '/tools/finance/amortization-calculator'],
    health: ['/tools/health/bmi-calculator', '/tools/health/tdee-calculator', '/tools/math/age-calculator'],
    education: ['/tools/education/gpa-calculator', '/tools/education/grade-calculator', '/tools/education/citation-generator'],
    text: ['/tools/text/word-counter', '/tools/text/character-counter', '/tools/text/readability-checker'],
    fun: ['/tools/fun/wheel-of-names', '/tools/fun/random-name-picker', '/tools/fun/spin-the-wheel'],
    productivity: ['/tools/fun/typing-test', '/tools/text/word-counter', '/tools/text/reading-time-calculator'],
  }
  const paths = map[slug] ?? byCategory[category ?? ''] ?? ['/tools/text/word-counter', '/tools/convert/unit-converter']
  return paths.slice(0, 3).map(tool)
}
