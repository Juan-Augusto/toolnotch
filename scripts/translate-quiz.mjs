#!/usr/bin/env node
/**
 * translate-quiz.mjs
 *
 * Translates quiz JSON files using a local Ollama model.
 * Diffs en/ against target locale directories and translates missing files.
 *
 * Usage:
 *   node scripts/translate-quiz.mjs [options]
 *
 * Options:
 *   --locale es,pt       Comma-separated target locales (default: es,pt)
 *   --quiz <slug>        Translate a specific quiz only
 *   --model <name>       Ollama model (default: qwen3:8b)
 *   --chunk-size <n>     Strings per Ollama call (default: 20)
 *   --dry-run            Print what would be written without writing
 *   --force              Re-translate even if output file already exists
 *   --debug              Print raw Ollama responses to stderr
 *
 * Env:
 *   OLLAMA_URL           Ollama base URL (default: http://localhost:11434)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT       = path.resolve(__dirname, '..');
const QUIZZES_DIR = path.join(ROOT, 'data', 'quizzes');
const OLLAMA_URL = process.env.OLLAMA_URL ?? 'http://localhost:11434';

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

const args       = process.argv.slice(2);
const getArg     = (flag) => { const i = args.indexOf(flag); return i !== -1 ? args[i + 1] : null; };
const hasFlag    = (flag) => args.includes(flag);

const localesArg = getArg('--locale') ?? 'es,pt';
const quizSlug   = getArg('--quiz');
const model      = getArg('--model') ?? 'qwen3:8b';
const chunkSize  = parseInt(getArg('--chunk-size') ?? '20', 10);
const dryRun     = hasFlag('--dry-run');
const force      = hasFlag('--force');
const debug      = hasFlag('--debug');
const LOCALES    = localesArg.split(',').map(l => l.trim());

const LOCALE_NAMES = {
  es: 'Spanish (Latin American)',
  pt: 'Portuguese (Brazilian)',
  fr: 'French',
  de: 'German',
  it: 'Italian',
};

// ---------------------------------------------------------------------------
// Flatten quiz text into a keyed map — avoids sending nested JSON to the model
// ---------------------------------------------------------------------------

function flattenTexts(quiz) {
  const map = {};

  map['__title'] = quiz.title;
  map['__description'] = quiz.description;

  for (const q of quiz.questions) {
    map[`q:${q.id}:text`] = q.text;
    for (const o of q.options) {
      map[`q:${q.id}:o:${o.id}:text`] = o.text;
    }
  }

  if (quiz.tiers) {
    for (const t of quiz.tiers) {
      map[`tier:${t.id}:label`] = t.label;
      map[`tier:${t.id}:description`] = t.description;
      map[`tier:${t.id}:shareText`] = t.shareText;
    }
  }

  if (quiz.results) {
    for (const r of quiz.results) {
      map[`result:${r.id}:title`] = r.title;
      map[`result:${r.id}:description`] = r.description;
      map[`result:${r.id}:shareText`] = r.shareText;
      if (r.traits) {
        r.traits.forEach((trait, i) => {
          map[`result:${r.id}:trait:${i}`] = trait;
        });
      }
    }
  }

  return map;
}

function applyTranslations(original, translated) {
  const get = (key) => translated[key] ?? flattenTexts(original)[key];

  return {
    ...original,
    title: get('__title'),
    description: get('__description'),
    questions: original.questions.map(q => ({
      ...q,
      text: get(`q:${q.id}:text`),
      options: q.options.map(o => ({
        ...o,
        text: get(`q:${q.id}:o:${o.id}:text`),
      })),
    })),
    ...(original.tiers && {
      tiers: original.tiers.map(t => ({
        ...t,
        label: get(`tier:${t.id}:label`),
        description: get(`tier:${t.id}:description`),
        shareText: get(`tier:${t.id}:shareText`),
      })),
    }),
    ...(original.results && {
      results: original.results.map(r => ({
        ...r,
        title: get(`result:${r.id}:title`),
        description: get(`result:${r.id}:description`),
        shareText: get(`result:${r.id}:shareText`),
        ...(r.traits && {
          traits: r.traits.map((_, i) => get(`result:${r.id}:trait:${i}`)),
        }),
      })),
    }),
  };
}

// ---------------------------------------------------------------------------
// Ollama: translate a flat { key: "english text" } object
// Returns { key: "translated text" }
// ---------------------------------------------------------------------------

async function translateChunk(chunk, localeName) {
  const inputJson = JSON.stringify(chunk, null, 2);

  const prompt = [
    `/no_think`,
    `Translate the string values in this JSON object from English to ${localeName}.`,
    `Rules: keep keys exactly as-is, only change string values, return valid JSON only.`,
    ``,
    `Input:`,
    `\`\`\`json`,
    inputJson,
    `\`\`\``,
    ``,
    `Output (JSON only, no explanation):`,
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

  const data = await response.json();
  const raw = data.response ?? '';

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
// Per-quiz translation — chunks the flat map and merges results
// ---------------------------------------------------------------------------

async function translateQuiz(slug, locale) {
  const srcPath  = path.join(QUIZZES_DIR, 'en', `${slug}.json`);
  const destPath = path.join(QUIZZES_DIR, locale, `${slug}.json`);

  if (!fs.existsSync(srcPath)) throw new Error(`Source not found: ${srcPath}`);

  const original   = JSON.parse(fs.readFileSync(srcPath, 'utf-8'));
  const flatMap    = flattenTexts(original);
  const entries    = Object.entries(flatMap);
  const localeName = LOCALE_NAMES[locale] ?? locale;

  process.stdout.write(`  [${locale}] "${original.title}" (${entries.length} strings, ${Math.ceil(entries.length / chunkSize)} chunks) ... `);

  const translatedMap = {};

  for (let i = 0; i < entries.length; i += chunkSize) {
    const chunkEntries = entries.slice(i, i + chunkSize);
    const chunkObj     = Object.fromEntries(chunkEntries);
    const result       = await translateChunk(chunkObj, localeName);

    // merge — fall back to original if key missing from response
    for (const [k] of chunkEntries) {
      translatedMap[k] = result[k] ?? chunkObj[k];
    }
  }

  const output = applyTranslations(original, translatedMap);

  if (dryRun) {
    console.log(`(dry-run)`);
    if (debug) console.log(JSON.stringify(output, null, 2).slice(0, 500));
    return;
  }

  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  fs.writeFileSync(destPath, JSON.stringify(output, null, 2) + '\n');
  console.log(`done → ${path.relative(ROOT, destPath)}`);
}

// ---------------------------------------------------------------------------
// Missing-file detection
// ---------------------------------------------------------------------------

function findMissingSlugs(locale) {
  const enDir     = path.join(QUIZZES_DIR, 'en');
  const localeDir = path.join(QUIZZES_DIR, locale);

  const enSlugs = fs.readdirSync(enDir)
    .filter(f => f.endsWith('.json'))
    .map(f => f.replace('.json', ''));

  const existing = fs.existsSync(localeDir)
    ? new Set(fs.readdirSync(localeDir).map(f => f.replace('.json', '')))
    : new Set();

  return force ? enSlugs : enSlugs.filter(s => !existing.has(s));
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
  console.log();

  let done = 0;
  let fail = 0;

  for (const locale of LOCALES) {
    const slugs = quizSlug ? [quizSlug] : findMissingSlugs(locale);

    if (slugs.length === 0) {
      console.log(`[${locale}] Nothing missing. Use --force to re-translate.\n`);
      continue;
    }

    console.log(`[${locale}] ${slugs.length} to translate: ${slugs.join(', ')}\n`);

    for (const slug of slugs) {
      try {
        await translateQuiz(slug, locale);
        done++;
      } catch (err) {
        console.error(`  ✗ ${slug} (${locale}): ${err.message}`);
        fail++;
      }
    }

    console.log();
  }

  console.log(`Done. ${done} translated, ${fail} failed.`);
  if (fail > 0) process.exit(1);
}

main();
