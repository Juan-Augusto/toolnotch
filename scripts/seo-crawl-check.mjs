#!/usr/bin/env node
/**
 * WS-5 item 7 — crawlability check.
 *
 * Serves the existing production build (`next start`) and fetches one URL per
 * route type WITHOUT executing any JavaScript (a plain `fetch` = what a
 * crawler sees on first pass). For each URL it verifies the raw HTML contains:
 *
 *   - an <h1>
 *   - >= 100 words of body copy
 *   - the internal-link block (footer SiteNavIndex + contextual RelatedContent)
 *   - a FAQ section, when the route type is expected to have one
 *
 * Prints a pass/fail table and exits non-zero if any check fails. If content
 * only appears after hydration the row fails here — that is a finding to
 * report, NOT something this script tries to fix.
 *
 * Usage:  node scripts/seo-crawl-check.mjs [--port 4123] [--base http://host]
 *   --base skips spawning a server and checks a URL that is already running.
 */

import { spawn, execSync } from 'node:child_process'
import { setTimeout as sleep } from 'node:timers/promises'

const args = process.argv.slice(2)
const portArg = args.indexOf('--port')
const baseArg = args.indexOf('--base')
const PORT = portArg !== -1 ? Number(args[portArg + 1]) : 4123
const EXTERNAL_BASE = baseArg !== -1 ? args[baseArg + 1] : null
const BASE = EXTERNAL_BASE ?? `http://localhost:${PORT}`

/** One representative URL per route type. `faq: true` means a FAQ block is expected. */
const TARGETS = [
  { type: 'home', path: '/', faq: false, links: true },
  { type: 'tool (calculator)', path: '/tools/health/bmi-calculator', faq: true, links: true },
  { type: 'tool (conversion, priority)', path: '/tools/convert/inches-to-centimeters', faq: true, links: true },
  { type: 'tool (localized /pt)', path: '/pt/tools/education/gpa-calculator', faq: true, links: true },
  { type: 'blog (MDX)', path: '/blog/how-to-calculate-gpa', faq: false, links: true },
  { type: 'blog (i18n)', path: '/blog/word-count-guide', faq: false, links: true },
  { type: 'quiz (depth)', path: '/quiz/fifa-world-cup-winners', faq: true, links: true },
  { type: 'quiz (basic)', path: '/quiz/what-career-suits-you', faq: false, links: true },
]

function stripToText(html) {
  const body = html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ')
  return body.replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/gi, ' ').replace(/\s+/g, ' ').trim()
}

function checkOne(html) {
  const h1 = /<h1[\s>]/i.test(html)
  const words = stripToText(html).split(/\s+/).filter(Boolean).length
  // Internal links: count distinct root-relative hrefs (nav + related + breadcrumb).
  const hrefs = new Set([...html.matchAll(/href="(\/[^"#]*)"/g)].map((m) => m[1]))
  const internalLinks = hrefs.size
  const faq =
    /faq/i.test(html) &&
    (/<summary/i.test(html) || /itemtype="https:\/\/schema\.org\/FAQPage"/i.test(html) || /"@type":"FAQPage"/.test(html))
  return { h1, words, internalLinks, faq }
}

async function fetchHtml(url) {
  const res = await fetch(url, { headers: { 'user-agent': 'ToolNotch-SEO-crawl-check' } })
  const html = await res.text()
  return { status: res.status, html }
}

async function waitForServer() {
  for (let i = 0; i < 60; i++) {
    try {
      const res = await fetch(BASE + '/', { headers: { 'user-agent': 'probe' } })
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
    if (process.platform === 'win32') {
      execSync(`taskkill /pid ${proc.pid} /T /F`, { stdio: 'ignore' })
    } else {
      process.kill(-proc.pid, 'SIGTERM')
    }
  } catch {
    try {
      proc.kill('SIGKILL')
    } catch {
      /* already gone */
    }
  }
}

async function main() {
  let server = null
  if (!EXTERNAL_BASE) {
    server = spawn('npx', ['next', 'start', '-p', String(PORT)], {
      cwd: process.cwd(),
      stdio: 'ignore',
      shell: true,
      env: { ...process.env, NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL ?? 'https://toolnotch.com' },
    })
    const up = await waitForServer()
    if (!up) {
      console.error('server did not come up on', BASE)
      killTree(server)
      process.exit(2)
    }
  }

  const rows = []
  let failed = 0
  for (const t of TARGETS) {
    try {
      const { status, html } = await fetchHtml(BASE + t.path)
      const c = checkOne(html)
      const okH1 = c.h1
      const okWords = c.words >= 100
      const okLinks = !t.links || c.internalLinks >= 10
      const okFaq = !t.faq || c.faq
      const pass = status === 200 && okH1 && okWords && okLinks && okFaq
      if (!pass) failed++
      rows.push({
        type: t.type,
        path: t.path,
        status,
        h1: okH1 ? 'yes' : 'NO',
        words: `${c.words}${okWords ? '' : ' (<100!)'}`,
        links: `${c.internalLinks}${okLinks ? '' : ' (<10!)'}`,
        faq: t.faq ? (okFaq ? 'yes' : 'NO') : 'n/a',
        result: pass ? 'PASS' : 'FAIL',
      })
    } catch (err) {
      failed++
      rows.push({ type: t.type, path: t.path, status: 'ERR', h1: '-', words: '-', links: '-', faq: '-', result: `FAIL (${err.message})` })
    }
  }

  console.table(rows)
  killTree(server)
  console.log(failed === 0 ? '\nAll route types crawlable without JS.' : `\n${failed} route type(s) failed — see table.`)
  process.exit(failed === 0 ? 0 : 1)
}

main()
