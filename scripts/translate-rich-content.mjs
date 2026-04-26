#!/usr/bin/env node
/**
 * translate-rich-content.mjs
 *
 * Translates richContent blocks in messages/en.json into pt.json and es.json
 * using a local Ollama model. Diffs missing keys automatically.
 *
 * Usage:
 *   node scripts/translate-rich-content.mjs [options]
 *
 * Options:
 *   --locale es,pt          Target locales (default: es,pt)
 *   --namespaces a.b,c.d    Only translate specific dot-path namespaces
 *   --model <name>          Ollama model (default: qwen3:8b)
 *   --chunk-size <n>        Strings per Ollama call (default: 15)
 *   --dry-run               Print what would change, don't write
 *   --force                 Re-translate even if key already exists
 *   --debug                 Print raw Ollama responses to stderr
 *
 * Env:
 *   OLLAMA_URL              Ollama base URL (default: http://localhost:11434)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname  = path.dirname(fileURLToPath(import.meta.url));
const ROOT       = path.resolve(__dirname, '..');
const MSG_DIR    = path.join(ROOT, 'messages');
const OLLAMA_URL = process.env.OLLAMA_URL ?? 'http://localhost:11434';

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

const args      = process.argv.slice(2);
const getArg    = (flag) => { const i = args.indexOf(flag); return i !== -1 ? args[i + 1] : null; };
const hasFlag   = (flag) => args.includes(flag);

const localesArg   = getArg('--locale') ?? 'es,pt';
const namespacesArg = getArg('--namespaces');
const model        = getArg('--model') ?? 'qwen3:8b';
const chunkSize    = parseInt(getArg('--chunk-size') ?? '15', 10);
const dryRun       = hasFlag('--dry-run');
const force        = hasFlag('--force');
const debug        = hasFlag('--debug');
const LOCALES      = localesArg.split(',').map(l => l.trim());

const NAMESPACE_FILTER = namespacesArg
  ? new Set(namespacesArg.split(',').map(s => s.trim()))
  : null;

const LOCALE_NAMES = {
  es: 'Latin American Spanish (es-LA)',
  pt: 'Brazilian Portuguese (pt-BR)',
};

// Terms that must NOT be translated
const KEEP_ENGLISH = [
  'APR', 'BMI', 'TDEE', 'GPA', 'PDF', 'QR', 'APA', 'MLA', 'ABNT', 'FHA', 'VA',
  'FICA', 'API', 'JSON', 'HTTP', 'Scrum', 'Agile', 'Sprint', 'Fibonacci', 'PMI',
  'PITI', 'ARM', 'CD', 'ETF', 'TF-IDF', 'LCP', 'ATS', 'INVEST', 'WebP', 'JPEG',
  'PNG', 'SVG', 'CSPRNG', 'PRNG', 'DPI', 'ABN', 'GST', 'HST', 'PST', 'VAT',
  'HMRC', 'PAYG', 'ToolNotch',
];

// ---------------------------------------------------------------------------
// Nested object utilities
// ---------------------------------------------------------------------------

function getAt(obj, dotPath) {
  return dotPath.split('.').reduce((cur, key) => cur?.[key], obj);
}

function setAt(obj, dotPath, value) {
  const keys = dotPath.split('.');
  let cur = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    if (cur[keys[i]] == null || typeof cur[keys[i]] !== 'object') {
      cur[keys[i]] = {};
    }
    cur = cur[keys[i]];
  }
  cur[keys[keys.length - 1]] = value;
}

// ---------------------------------------------------------------------------
// Walk en.json and collect all richContent dot-paths
// ---------------------------------------------------------------------------

function findRichContentPaths(obj, prefix = '') {
  const paths = [];
  if (obj === null || typeof obj !== 'object') return paths;

  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (key === 'richContent' && value && typeof value === 'object' && value.whatIs) {
      paths.push(fullKey);
    } else if (typeof value === 'object' && !Array.isArray(value)) {
      paths.push(...findRichContentPaths(value, fullKey));
    }
  }
  return paths;
}

// ---------------------------------------------------------------------------
// Flatten / unflatten richContent for Ollama
// { whatIs, howToUse[], whyItMatters, proTip } → flat string map
// ---------------------------------------------------------------------------

function flattenRichContent(rc) {
  const map = {};
  if (rc.whatIs)        map['whatIs']       = rc.whatIs;
  if (rc.whyItMatters)  map['whyItMatters'] = rc.whyItMatters;
  if (rc.proTip)        map['proTip']       = rc.proTip;
  if (Array.isArray(rc.howToUse)) {
    rc.howToUse.forEach((step, i) => { map[`howToUse.${i}`] = step; });
  }
  return map;
}

function unflattenRichContent(original, translated) {
  const out = { ...original };
  if (translated['whatIs'])       out.whatIs       = translated['whatIs'];
  if (translated['whyItMatters']) out.whyItMatters = translated['whyItMatters'];
  if (translated['proTip'])       out.proTip       = translated['proTip'];
  if (Array.isArray(original.howToUse)) {
    out.howToUse = original.howToUse.map((_, i) =>
      translated[`howToUse.${i}`] ?? original.howToUse[i]
    );
  }
  return out;
}

// ---------------------------------------------------------------------------
// Ollama: translate a flat { key: text } map
// ---------------------------------------------------------------------------

async function translateChunk(chunk, localeName) {
  const inputJson = JSON.stringify(chunk, null, 2);
  const keepList  = KEEP_ENGLISH.join(', ');

  const prompt = [
    `/no_think`,
    `Translate the JSON string values below from English to ${localeName}.`,
    `Rules:`,
    `- Keep JSON keys exactly as-is`,
    `- Only change the string values`,
    `- Do NOT translate these technical terms (keep in English): ${keepList}`,
    `- Translate naturally — not word for word`,
    `- Return valid JSON only, no explanation`,
    ``,
    `Input:`,
    `\`\`\`json`,
    inputJson,
    `\`\`\``,
    ``,
    `Output (JSON only):`,
  ].join('\n');

  const response = await fetch(`${OLLAMA_URL}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      prompt,
      stream: false,
      options: { temperature: 0.1 },
    }),
    signal: AbortSignal.timeout(120_000),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Ollama ${response.status}: ${body.slice(0, 200)}`);
  }

  const data    = await response.json();
  const raw     = data.response ?? '';

  if (debug) console.error('\n--- RAW ---\n', raw.slice(0, 800), '\n---\n');

  const cleaned = raw
    .replace(/<think>[\s\S]*?<\/think>/g, '')
    .replace(/```(?:json)?\n?/g, '')
    .trim();

  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error(`No JSON in response. Raw: ${raw.slice(0, 150)}`);

  return JSON.parse(jsonMatch[0]);
}

// ---------------------------------------------------------------------------
// Translate one richContent block with chunking + fallback
// ---------------------------------------------------------------------------

async function translateRichContent(rcObj, localeName) {
  const flat    = flattenRichContent(rcObj);
  const entries = Object.entries(flat);
  const result  = {};

  for (let i = 0; i < entries.length; i += chunkSize) {
    const slice   = entries.slice(i, i + chunkSize);
    const chunkIn = Object.fromEntries(slice);
    const chunkOut = await translateChunk(chunkIn, localeName);

    for (const [k] of slice) {
      result[k] = chunkOut[k] ?? chunkIn[k]; // fallback to EN on missing key
    }
  }

  return unflattenRichContent(rcObj, result);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log(`Model      : ${model}`);
  console.log(`Locales    : ${LOCALES.join(', ')}`);
  console.log(`Chunk size : ${chunkSize}`);
  console.log(`Dry run    : ${dryRun}`);
  console.log(`Force      : ${force}`);
  if (NAMESPACE_FILTER) console.log(`Namespaces : ${[...NAMESPACE_FILTER].join(', ')}`);
  console.log();

  const enPath  = path.join(MSG_DIR, 'en.json');
  const enData  = JSON.parse(fs.readFileSync(enPath, 'utf-8'));

  // Find all richContent paths in en.json
  let allPaths = findRichContentPaths(enData);

  if (NAMESPACE_FILTER) {
    allPaths = allPaths.filter(p => NAMESPACE_FILTER.has(p));
  }

  if (allPaths.length === 0) {
    console.log('No richContent blocks found matching filter. Done.');
    return;
  }

  console.log(`Found ${allPaths.length} richContent block(s) in en.json.\n`);

  let totalDone = 0;
  let totalFail = 0;

  for (const locale of LOCALES) {
    const localePath = path.join(MSG_DIR, `${locale}.json`);
    const localeData = JSON.parse(fs.readFileSync(localePath, 'utf-8'));
    const localeName = LOCALE_NAMES[locale] ?? locale;
    let localeModified = false;

    console.log(`\n── ${locale.toUpperCase()} (${localeName}) ──`);

    for (const rcPath of allPaths) {
      const enRc     = getAt(enData, rcPath);
      const existing = getAt(localeData, rcPath);

      if (existing && !force) {
        console.log(`  ✓ ${rcPath} — already exists, skipping`);
        continue;
      }

      const label = rcPath.replace('.richContent', '');
      process.stdout.write(`  ↻ ${label} ... `);

      try {
        const translated = await translateRichContent(enRc, localeName);

        if (dryRun) {
          console.log(`(dry-run)`);
          if (debug) console.log(JSON.stringify(translated, null, 2).slice(0, 300));
        } else {
          setAt(localeData, rcPath, translated);
          localeModified = true;
          console.log(`done`);
        }

        totalDone++;
      } catch (err) {
        console.error(`\n  ✗ ${rcPath} (${locale}): ${err.message}`);
        totalFail++;
      }
    }

    if (!dryRun && localeModified) {
      fs.writeFileSync(localePath, JSON.stringify(localeData, null, 2) + '\n');
      console.log(`\n  → Wrote ${localePath}`);
    }
  }

  console.log(`\nDone. ${totalDone} translated, ${totalFail} failed.`);
  if (totalFail > 0) process.exit(1);
}

main();
