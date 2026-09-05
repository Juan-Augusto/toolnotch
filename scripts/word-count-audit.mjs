#!/usr/bin/env node
/**
 * WS-6 — rendered-word-count audit for AdSense readiness.
 *
 * Enumerates every indexable route from the built sitemap (`/sitemap.xml` of a
 * running production server) and reports the *unique* rendered word count per
 * route — text a crawler sees in the raw HTML on the first pass (no JS), inside
 * the page's <main> region, with site chrome (header nav, footer, breadcrumb
 * nav, SiteNavIndex, scripts/styles/SVG) stripped out, and cross-page
 * boilerplate segments (the same sentence appearing on many pages) subtracted.
 *
 * Two numbers per route:
 *   words   — every content word inside <main> after chrome is removed
 *   unique  — words remaining after boilerplate segments (text repeated on
 *             >= BOILERPLATE_RATIO of audited pages) are dropped. This is the
 *             figure the 500-word AdSense threshold is judged against.
 *
 * Locales: audits en + pt + es by default (the whole point of Phase 0 WS-1..4
 * was locale-correct depth, so every locale is measured). Use --locales to
 * narrow.
 *
 * Output: one row per route, sorted ascending by `unique`, plus a summary line
 *   "N routes below 500 words".
 * Exit code: 0 if no indexable route is below the threshold, else 1.
 *
 * Usage:
 *   node scripts/word-count-audit.mjs                     # build first, then: next build && node scripts/word-count-audit.mjs
 *   node scripts/word-count-audit.mjs --base http://localhost:3000   # audit an already-running server
 *   node scripts/word-count-audit.mjs --locales en                   # English only
 *   node scripts/word-count-audit.mjs --threshold 500 --top 40       # show only the 40 thinnest
 *   node scripts/word-count-audit.mjs --out plans/seo/_wordcount.md  # also write a markdown table
 *
 * Re-runnable with no arguments once a production build exists in .next/.
 */

import { spawn, execSync } from 'node:child_process'
import { setTimeout as sleep } from 'node:timers/promises'
import { writeFileSync } from 'node:fs'

// ---------------------------------------------------------------------------
// args
// ---------------------------------------------------------------------------
const args = process.argv.slice(2)
const getArg = (name, fallback = null) => {
  const i = args.indexOf(`--${name}`)
  return i !== -1 && args[i + 1] ? args[i + 1] : fallback
}
const PORT = Number(getArg('port', '4187'))
const EXTERNAL_BASE = getArg('base', null)
const BASE = EXTERNAL_BASE ?? `http://localhost:${PORT}`
const LOCALES = getArg('locales', 'en,pt,es').split(',').map((s) => s.trim()).filter(Boolean)
const THRESHOLD = Number(getArg('threshold', '500'))
const TOP = getArg('top', null) ? Number(getArg('top', null)) : null
const OUT = getArg('out', null)
const CONCURRENCY = Number(getArg('concurrency', '8'))

/** A text segment counts as boilerplate once it shows up on this share of pages. */
const BOILERPLATE_RATIO = 0.25
/** Segments shorter than this many words are never treated as unique content. */
const MIN_SEGMENT_WORDS = 4

// ---------------------------------------------------------------------------
// html -> text
// ---------------------------------------------------------------------------
const ENTITIES = {
  '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'", '&apos;': "'",
  '&nbsp;': ' ', '&mdash;': '—', '&ndash;': '–', '&hellip;': '…', '&rsquo;': '’',
  '&lsquo;': '‘', '&ldquo;': '“', '&rdquo;': '”', '&times;': '×', '&divide;': '÷',
}
function decodeEntities(s) {
  return s
    .replace(/&#(\d+);/g, (_, d) => {
      try { return String.fromCodePoint(Number(d)) } catch { return ' ' }
    })
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => {
      try { return String.fromCodePoint(parseInt(h, 16)) } catch { return ' ' }
    })
    .replace(/&[a-z]+;/gi, (m) => ENTITIES[m.toLowerCase()] ?? ' ')
}

/** Pull the <main> region (fall back to <body>) so site header/footer are excluded. */
function extractMain(html) {
  const mainStart = html.search(/<main[\s>]/i)
  if (mainStart !== -1) {
    const lastClose = html.lastIndexOf('</main>')
    if (lastClose > mainStart) return html.slice(mainStart, lastClose)
  }
  const bodyStart = html.search(/<body[\s>]/i)
  if (bodyStart !== -1) {
    const lastClose = html.lastIndexOf('</body>')
    if (lastClose > bodyStart) return html.slice(bodyStart, lastClose)
  }
  return html
}

function stripChrome(fragment) {
  return fragment
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<svg[\s\S]*?<\/svg>/gi, ' ')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<template[\s\S]*?<\/template>/gi, ' ')
    // breadcrumb / in-content nav lists are chrome, not content
    .replace(/<nav[\s\S]*?<\/nav>/gi, ' ')
}

/** Sentinel inserted where a block-level element closes, so text can be split back into element-sized chunks for cross-page dedup. */
const SEG = '␟'
const BLOCK_CLOSE = /<\/(p|li|h[1-6]|section|article|div|td|th|tr|dd|dt|blockquote|figcaption|button)>/gi

function htmlToText(fragment) {
  const noChrome = stripChrome(fragment)
  const withMarks = noChrome.replace(BLOCK_CLOSE, SEG)
  const text = decodeEntities(withMarks.replace(/<[^>]+>/g, ' '))
  // collapse runs of whitespace but keep the segment sentinel
  return text.replace(new RegExp(`[^\\S${SEG}]+`, 'g'), ' ').replace(/ *␟+ */g, SEG).trim()
}

/** A "word" = token containing at least one letter or digit. */
function countWords(text) {
  return text.replace(/␟/g, ' ').split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length
}

/**
 * Split visible text into comparable segments for cross-page dedup: first on
 * the block-close sentinel, then each chunk on sentence boundaries.
 */
function toSegments(text) {
  return text
    .split(SEG)
    .flatMap((chunk) => chunk.split(/(?<=[.!?…])\s+/u))
    .map((s) => s.trim().toLowerCase().replace(/\s+/g, ' '))
    .filter((s) => countWords(s) >= MIN_SEGMENT_WORDS)
}

function robotsNoindex(html) {
  const m = html.match(/<meta[^>]+name=["']robots["'][^>]*>/i)
  if (!m) return false
  return /noindex/i.test(m[0])
}

function hasH1(html) {
  return /<h1[\s>]/i.test(html)
}

// ---------------------------------------------------------------------------
// server lifecycle
// ---------------------------------------------------------------------------
async function waitForServer(url) {
  for (let i = 0; i < 90; i++) {
    try {
      const res = await fetch(url + '/', { headers: { 'user-agent': 'probe' } })
      if (res.status < 500) return true
    } catch {
      /* not up yet */
    }
    await sleep(1000)
  }
  return false
}

function killTree(proc) {
  if (!proc || proc.pid == null) return
  try {
    if (process.platform === 'win32') execSync(`taskkill /pid ${proc.pid} /T /F`, { stdio: 'ignore' })
    else process.kill(-proc.pid, 'SIGTERM')
  } catch {
    try { proc.kill('SIGKILL') } catch { /* already gone */ }
  }
}

// ---------------------------------------------------------------------------
// sitemap -> route paths
// ---------------------------------------------------------------------------
async function getSitemapPaths() {
  const res = await fetch(BASE + '/sitemap.xml', { headers: { 'user-agent': 'ToolNotch-wordcount-audit' } })
  if (!res.ok) throw new Error(`sitemap.xml returned ${res.status}`)
  const xml = await res.text()
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim())
  const paths = new Set()
  for (const loc of locs) {
    let path
    try {
      path = new URL(loc).pathname
    } catch {
      path = loc
    }
    // sitemap emits English (unprefixed) URLs; strip any accidental locale prefix
    path = path.replace(/^\/(pt|es)(?=\/|$)/, '') || '/'
    paths.add(path)
  }
  return [...paths].sort()
}

function localizedPath(path, locale) {
  if (locale === 'en') return path
  return path === '/' ? `/${locale}` : `/${locale}${path}`
}

// ---------------------------------------------------------------------------
// fetch + analyse
// ---------------------------------------------------------------------------
/** Root-relative <a href> targets on the page (no hash, no query, no mailto). */
function internalLinks(html) {
  const out = new Set()
  for (const m of html.matchAll(/<a\b[^>]*\shref=["'](\/[^"'#?]*)["']/gi)) {
    let href = m[1].replace(/\/+$/, '') || '/'
    if (/\.[a-z0-9]{2,4}$/i.test(href)) continue // asset link (.png/.txt/.xml…)
    out.add(href)
  }
  return [...out]
}

async function analyse(path, locale) {
  const url = BASE + localizedPath(path, locale)
  try {
    const res = await fetch(url, { headers: { 'user-agent': 'ToolNotch-wordcount-audit' } })
    const html = await res.text()
    const main = extractMain(html)
    const text = htmlToText(main)
    return {
      path,
      locale,
      status: res.status,
      noindex: robotsNoindex(html),
      h1: hasH1(html),
      words: countWords(text),
      segments: toSegments(text),
      links: res.status === 200 ? internalLinks(html) : [],
      error: null,
    }
  } catch (err) {
    return { path, locale, status: 'ERR', noindex: false, h1: false, words: 0, segments: [], links: [], error: err.message }
  }
}

async function checkStatus(path) {
  try {
    let res = await fetch(BASE + path, { method: 'GET', redirect: 'manual', headers: { 'user-agent': 'ToolNotch-linkcheck' } })
    return res.status
  } catch (err) {
    return `ERR ${err.message}`
  }
}

async function mapPool(items, fn, concurrency) {
  const out = new Array(items.length)
  let idx = 0
  const workers = Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (idx < items.length) {
      const cur = idx++
      out[cur] = await fn(items[cur], cur)
    }
  })
  await Promise.all(workers)
  return out
}

// ---------------------------------------------------------------------------
// main
// ---------------------------------------------------------------------------
async function main() {
  let server = null
  if (!EXTERNAL_BASE) {
    server = spawn('npx', ['next', 'start', '-p', String(PORT)], {
      cwd: process.cwd(),
      stdio: 'ignore',
      shell: true,
      env: { ...process.env, NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL ?? 'https://toolnotch.com' },
    })
    process.on('exit', () => killTree(server))
    if (!(await waitForServer(BASE))) {
      console.error(`server did not come up on ${BASE} — run "npm run build" first`)
      killTree(server)
      process.exit(2)
    }
  }

  const paths = await getSitemapPaths()
  console.error(`sitemap: ${paths.length} indexable routes × ${LOCALES.length} locale(s) = ${paths.length * LOCALES.length} URLs`)

  const jobs = []
  for (const locale of LOCALES) for (const path of paths) jobs.push({ path, locale })

  const results = await mapPool(jobs, ({ path, locale }) => analyse(path, locale), CONCURRENCY)

  // Cross-page boilerplate is computed PER LOCALE (chrome strings are
  // translated, so a segment only ever repeats within its own language) and
  // then unioned: any text segment appearing on >= BOILERPLATE_RATIO of a
  // locale's OK pages is treated as chrome, not unique content.
  const okResults = results.filter((r) => r.status === 200)
  const boilerplate = new Set()
  let boilerCutoffNote = []
  for (const locale of LOCALES) {
    const pages = okResults.filter((r) => r.locale === locale)
    if (pages.length === 0) continue
    const segFreq = new Map()
    for (const r of pages) {
      for (const seg of new Set(r.segments)) segFreq.set(seg, (segFreq.get(seg) ?? 0) + 1)
    }
    const cutoff = Math.max(3, Math.ceil(pages.length * BOILERPLATE_RATIO))
    for (const [seg, n] of segFreq) if (n >= cutoff) boilerplate.add(seg)
    boilerCutoffNote.push(`${locale}>=${cutoff}/${pages.length}`)
  }

  for (const r of results) {
    const uniqueSegs = r.segments.filter((s) => !boilerplate.has(s))
    r.unique = countWords(uniqueSegs.join(' '))
  }

  const rows = results
    .map((r) => ({
      route: localizedPath(r.path, r.locale),
      status: r.status,
      h1: r.status === 200 ? (r.h1 ? 'y' : 'NO') : '-',
      words: r.words,
      unique: r.unique ?? 0,
      noindex: r.noindex ? 'noindex' : '',
      flag: r.status === 200 && !r.noindex && (r.unique ?? 0) < THRESHOLD ? `< ${THRESHOLD}` : '',
    }))
    .sort((a, b) => a.unique - b.unique || String(a.route).localeCompare(String(b.route)))

  const shown = TOP ? rows.slice(0, TOP) : rows
  console.table(shown)

  const belowThreshold = rows.filter((r) => r.flag)
  const brokenStatus = rows.filter((r) => r.status !== 200)
  const missingH1 = rows.filter((r) => r.h1 === 'NO')

  console.log('')
  console.log(`boilerplate segments filtered: ${boilerplate.size} (per-locale cutoff ${boilerCutoffNote.join(', ')})`)
  if (brokenStatus.length) {
    console.log(`non-200 routes: ${brokenStatus.length}`)
    for (const r of brokenStatus) console.log(`   ${r.status}  ${r.route}`)
  }
  if (missingH1.length) {
    console.log(`routes with no <h1> in raw HTML: ${missingH1.length}`)
    for (const r of missingH1) console.log(`   ${r.route}`)
  }
  // ---- internal link integrity -------------------------------------------
  // Every distinct root-relative <a href> seen across every audited page,
  // minus the ones we already fetched, GET-checked (redirects NOT followed so
  // a 3xx on an internal link is surfaced as a finding).
  const fetched = new Map()
  for (const r of results) fetched.set(localizedPath(r.path, r.locale).replace(/\/+$/, '') || '/', r.status)
  const linkTargets = new Set()
  for (const r of results) for (const href of r.links ?? []) linkTargets.add(href)
  const toProbe = [...linkTargets].filter((h) => !fetched.has(h)).sort()
  const probed = await mapPool(toProbe, async (href) => ({ href, status: await checkStatus(href) }), CONCURRENCY)
  const brokenLinks = [
    ...[...fetched.entries()].filter(([, s]) => s !== 200 && s !== 'ERR').map(([href, status]) => ({ href, status, src: 'sitemap route' })),
    ...probed.filter((p) => p.status !== 200).map((p) => ({ ...p, src: 'on-page link' })),
  ]

  console.log('')
  console.log(`internal links: ${linkTargets.size} distinct targets across all pages; ${toProbe.length} not in the audited set were probed`)
  if (brokenLinks.length) {
    console.log(`broken / redirecting internal links: ${brokenLinks.length}`)
    for (const b of brokenLinks) console.log(`   ${String(b.status).padStart(3)}  ${b.href}   (${b.src})`)
  } else {
    console.log('broken / redirecting internal links: 0')
  }

  console.log('')
  console.log(`${belowThreshold.length} routes below ${THRESHOLD} words`)
  for (const r of belowThreshold) console.log(`   ${r.unique.toString().padStart(4)}  ${r.route}`)

  if (OUT) {
    const md = [
      `| # | Route | Status | H1 | Words (main) | Unique | Note |`,
      `|--:|---|--:|:--:|--:|--:|---|`,
      ...rows.map((r, i) => `| ${i + 1} | \`${r.route}\` | ${r.status} | ${r.h1} | ${r.words} | ${r.unique} | ${r.noindex || r.flag} |`),
      '',
      `**${belowThreshold.length} routes below ${THRESHOLD} words** (indexable only). ${boilerplate.size} boilerplate segments filtered. ${brokenLinks.length} broken/redirecting internal links.`,
      '',
    ].join('\n')
    writeFileSync(OUT, md)
    console.log(`\nwrote ${OUT}`)
  }

  killTree(server)
  process.exit(belowThreshold.length === 0 && brokenStatus.length === 0 && brokenLinks.length === 0 ? 0 : 1)
}

main()
