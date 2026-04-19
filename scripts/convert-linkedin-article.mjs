#!/usr/bin/env node
/**
 * convert-linkedin-article.mjs
 *
 * Converts a LinkedIn article HTML export to an MDX file.
 *
 * Usage:
 *   node scripts/convert-linkedin-article.mjs <input.html> <output-slug>
 *
 * The output MDX is written to:
 *   data/blog/content/<output-slug>.mdx
 *
 * Uses only Node.js built-ins (no npm packages required).
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ---------------------------------------------------------------------------
// CLI args
// ---------------------------------------------------------------------------
const [,, inputHtml, outputSlug] = process.argv;

if (!inputHtml || !outputSlug) {
  console.error('Usage: node scripts/convert-linkedin-article.mjs <input.html> <output-slug>');
  process.exit(1);
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const outputDir = path.join(repoRoot, 'data', 'blog', 'content');
const outputPath = path.join(outputDir, `${outputSlug}.mdx`);

// ---------------------------------------------------------------------------
// Read source
// ---------------------------------------------------------------------------
const html = fs.readFileSync(path.resolve(inputHtml), 'utf8');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Strip all occurrences of a tag pair, returning inner content. */
function stripTag(str, tag) {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'gi');
  return str.replace(re, '$1');
}

/** Remove a complete tag pair and everything inside it. */
function removeTag(str, tag) {
  const re = new RegExp(`<${tag}[^>]*>[\\s\\S]*?<\\/${tag}>`, 'gi');
  return str.replace(re, '');
}

/** Remove self-closing and void tags. */
function removeVoidTag(str, tag) {
  const re = new RegExp(`<${tag}[^>]*\\/?>`, 'gi');
  return str.replace(re, '');
}

/** Decode common HTML entities. */
function decodeEntities(str) {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/')
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .replace(/&hellip;/g, '…')
    .replace(/&ldquo;/g, '\u201C')
    .replace(/&rdquo;/g, '\u201D')
    .replace(/&lsquo;/g, '\u2018')
    .replace(/&rsquo;/g, '\u2019');
}

// ---------------------------------------------------------------------------
// Step 1: Extract title
// ---------------------------------------------------------------------------
let title = '';

// Try <title> element first
const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
if (titleMatch) {
  title = titleMatch[1].replace(/\s*\|\s*LinkedIn\s*$/i, '').trim();
}

// Fallback: first <h1> text
if (!title) {
  const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (h1Match) {
    title = h1Match[1].replace(/<[^>]+>/g, '').trim();
  }
}

// ---------------------------------------------------------------------------
// Step 2: Extract publication date
// ---------------------------------------------------------------------------
let publishedAt = '';

// Look for .published span: "Published on 2024-07-05 16:30" or "Published January 12, 2024"
const publishedMatch = html.match(/class="published"[^>]*>\s*(?:Published\s+(?:on\s+)?)([\w\s,:-]+)</i)
  || html.match(/Published\s+(?:on\s+)?([\w\s,:-]+\d{4})/i);

if (publishedMatch) {
  const raw = publishedMatch[1].trim();

  // Try ISO-ish format: "2024-07-05 16:30"
  const isoMatch = raw.match(/(\d{4}-\d{2}-\d{2})/);
  if (isoMatch) {
    publishedAt = isoMatch[1];
  } else {
    // Try "July 5, 2024" or "January 12, 2024"
    const longMatch = raw.match(/([A-Za-z]+)\s+(\d{1,2}),?\s+(\d{4})/);
    if (longMatch) {
      const months = {
        january: '01', february: '02', march: '03', april: '04',
        may: '05', june: '06', july: '07', august: '08',
        september: '09', october: '10', november: '11', december: '12',
      };
      const month = months[longMatch[1].toLowerCase()] || '01';
      const day = longMatch[2].padStart(2, '0');
      const year = longMatch[3];
      publishedAt = `${year}-${month}-${day}`;
    }
  }
}

if (!publishedAt) {
  publishedAt = new Date().toISOString().slice(0, 10);
}

// ---------------------------------------------------------------------------
// Step 3: Extract body content (between <body> tags, minus <head>)
// ---------------------------------------------------------------------------
let body = html;

// Remove <head>...</head>
body = removeTag(body, 'head');

// Remove <style> blocks (in case they're in body)
body = removeTag(body, 'style');

// Remove <script> blocks
body = removeTag(body, 'script');

// Get everything inside <body>
const bodyMatch = body.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
if (bodyMatch) {
  body = bodyMatch[1];
}

// Remove the very first <img> (banner image) before the h1
body = body.replace(/^\s*<img[^>]*>\s*/i, '');

// Remove the h1 (title) itself — we put it in frontmatter
body = body.replace(/<h1[^>]*>[\s\S]*?<\/h1>/i, '');

// Remove .created and .published date paragraphs
body = body.replace(/<p[^>]*class="created"[^>]*>[\s\S]*?<\/p>/gi, '');
body = body.replace(/<p[^>]*class="published"[^>]*>[\s\S]*?<\/p>/gi, '');

// ---------------------------------------------------------------------------
// Step 4: Convert HTML to Markdown
// ---------------------------------------------------------------------------

/**
 * Convert a single list item's inner HTML to Markdown inline text.
 * Handles nested <p> tags inside <li>.
 */
function liInnerToMd(inner) {
  // Strip wrapping <p> tags inside list items
  inner = inner.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, '$1');
  return inlineToMd(inner).trim();
}

/**
 * Convert inline HTML elements to Markdown.
 */
function inlineToMd(str) {
  // Strong / bold
  str = str.replace(/<strong[^>]*>([\s\S]*?)<\/strong>/gi, '**$1**');
  str = str.replace(/<b[^>]*>([\s\S]*?)<\/b>/gi, '**$1**');

  // Em / italic
  str = str.replace(/<em[^>]*>([\s\S]*?)<\/em>/gi, '_$1_');
  str = str.replace(/<i[^>]*>([\s\S]*?)<\/i>/gi, '_$1_');

  // Inline code
  str = str.replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, '`$1`');

  // Links — strip linkedin.com hrefs
  str = str.replace(/<a\s+[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, (_, href, text) => {
    const cleanText = text.replace(/<[^>]+>/g, '').trim();
    if (href.includes('linkedin.com')) {
      return cleanText;
    }
    return `[${cleanText}](${href})`;
  });

  // Images → comment
  str = str.replace(/<img[^>]*>/gi, '{/* image removed */}');

  // figcaption → skip
  str = str.replace(/<figcaption[^>]*>[\s\S]*?<\/figcaption>/gi, '');

  // figure → strip tag, keep content
  str = str.replace(/<figure[^>]*>([\s\S]*?)<\/figure>/gi, '$1');

  // Strip any remaining tags (keep inner text)
  str = str.replace(/<[^>]+>/g, '');

  return str;
}

/**
 * Detect language hint from code content.
 */
function detectLanguage(code) {
  if (/require\(|module\.exports|fs\.|http\.|\.listen\(/.test(code)) return 'javascript';
  if (/import\s+\w|export\s+(default|const|function)/.test(code)) return 'javascript';
  if (/console\.log|setTimeout|setInterval|Promise|async|await/.test(code)) return 'javascript';
  if (/<\?php/.test(code)) return 'php';
  if (/def\s+\w+\(|import\s+\w+\n|print\(/.test(code)) return 'python';
  if (/SELECT|INSERT|UPDATE|DELETE|FROM|WHERE/i.test(code)) return 'sql';
  if (/^\s*\{[\s\S]*\}$/.test(code.trim())) return 'json';
  if (/^#!\/bin\/bash|^#!\/bin\/sh/.test(code)) return 'bash';
  return 'javascript'; // default for Node.js article
}

function htmlToMarkdown(html) {
  let md = html;

  // Pre/code blocks first (before stripping other tags)
  md = md.replace(/<pre[^>]*>\s*<code[^>]*>([\s\S]*?)<\/code>\s*<\/pre>/gi, (_, code) => {
    const decoded = decodeEntities(code.replace(/<[^>]+>/g, ''));
    const lang = detectLanguage(decoded);
    return `\n\n\`\`\`${lang}\n${decoded.trim()}\n\`\`\`\n\n`;
  });

  // Standalone <pre> without <code>
  md = md.replace(/<pre[^>]*>([\s\S]*?)<\/pre>/gi, (_, code) => {
    const decoded = decodeEntities(code.replace(/<[^>]+>/g, ''));
    if (!decoded.trim()) return '';
    const lang = detectLanguage(decoded);
    return `\n\n\`\`\`${lang}\n${decoded.trim()}\n\`\`\`\n\n`;
  });

  // Headings (h2 and h3 only — h1 is title, already removed)
  md = md.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, (_, inner) => `\n\n## ${inlineToMd(inner).trim()}\n\n`);
  md = md.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, (_, inner) => `\n\n### ${inlineToMd(inner).trim()}\n\n`);
  md = md.replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, (_, inner) => `\n\n#### ${inlineToMd(inner).trim()}\n\n`);

  // Ordered lists
  md = md.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (_, inner) => {
    let idx = 0;
    const items = inner.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (__, liInner) => {
      idx++;
      return `${idx}. ${liInnerToMd(liInner)}\n`;
    });
    return `\n\n${items.trim()}\n\n`;
  });

  // Unordered lists
  md = md.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (_, inner) => {
    const items = inner.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (__, liInner) => {
      return `- ${liInnerToMd(liInner)}\n`;
    });
    return `\n\n${items.trim()}\n\n`;
  });

  // Blockquote
  md = md.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (_, inner) => {
    const text = inlineToMd(inner).trim().split('\n').map(l => `> ${l}`).join('\n');
    return `\n\n${text}\n\n`;
  });

  // Horizontal rule
  md = md.replace(/<hr\s*\/?>/gi, '\n\n---\n\n');

  // Paragraphs
  md = md.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, (_, inner) => {
    const text = inlineToMd(inner).trim();
    if (!text) return '';
    return `\n\n${text}\n\n`;
  });

  // Divs — strip tag, keep content
  md = md.replace(/<div[^>]*>([\s\S]*?)<\/div>/gi, '$1');

  // Apply inline conversions to any remaining content
  md = inlineToMd(md);

  // Collapse excessive blank lines (more than 2 newlines → 2)
  md = md.replace(/\n{3,}/g, '\n\n');

  // Decode entities
  md = decodeEntities(md);

  return md.trim();
}

const markdownBody = htmlToMarkdown(body);

// ---------------------------------------------------------------------------
// Step 5: Promote first h3 headings to h2 (since no h2 exists in this article)
// In this article all section headings are h3 — promote them all to h2.
// ---------------------------------------------------------------------------
// Actually we'll do this selectively: if there are NO ## headings but there are ### headings,
// promote all ### to ##.
const hasH2 = /^## /m.test(markdownBody);
const hasH3 = /^### /m.test(markdownBody);
let finalBody = markdownBody;
if (!hasH2 && hasH3) {
  finalBody = markdownBody.replace(/^### /gm, '## ');
}

// ---------------------------------------------------------------------------
// Step 6: Calculate reading time
// ---------------------------------------------------------------------------
const wordCount = finalBody.split(/\s+/).filter(Boolean).length;
const readingTimeMinutes = Math.ceil(wordCount / 200);

// ---------------------------------------------------------------------------
// Step 7: LinkedIn URL from slug
// ---------------------------------------------------------------------------
const linkedinUrl = `https://www.linkedin.com/pulse/${outputSlug}`;

// ---------------------------------------------------------------------------
// Step 8: Write MDX file
// ---------------------------------------------------------------------------
fs.mkdirSync(outputDir, { recursive: true });

const frontmatter = `---
title: "${title.replace(/"/g, '\\"')}"
slug: "${outputSlug}"
publishedAt: "${publishedAt}"
description: ""
category: "engineering"
tags: []
readingTimeMinutes: ${readingTimeMinutes}
linkedinUrl: "${linkedinUrl}"
---`;

const mdx = `${frontmatter}\n\n${finalBody}\n`;

fs.writeFileSync(outputPath, mdx, 'utf8');

console.log(`✓ Converted: ${path.relative(repoRoot, outputPath)}`);
console.log(`  Title    : ${title}`);
console.log(`  Published: ${publishedAt}`);
console.log(`  Words    : ${wordCount}`);
console.log(`  Read time: ${readingTimeMinutes} min`);
console.log(`  Output   : ${outputPath}`);
