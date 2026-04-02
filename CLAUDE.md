# ToolNotch — Monorepo Claude Context

## What This Repo Is
This is the single Next.js monorepo for **toolnotch.com** — all free online tools live here.
One Vercel project, one domain, one deployment. Do NOT create separate repos for new tool categories.

## Domain: toolnotch.com
- Vercel project: toolnotch (connected to this repo)
- All tools are routes under this one project
- One GA4 property (G-S4FLQ2B972), one AdSense account (ca-pub-6392082764157185)

## Stack
- Framework: Next.js 16 (App Router, TypeScript)
- Styling: Tailwind CSS v4
- Hosting: Vercel (free tier)
- Analytics: Google Analytics 4 (via NEXT_PUBLIC_GA_ID env var)
- Ads: Google AdSense (via NEXT_PUBLIC_ADSENSE_CLIENT env var)

## Key Commands
```bash
npm run dev                          # localhost:3000
npm run build                        # production build — run before every deploy
npm run lint
npm run test                         # all unit + integration tests (Jest)
npm run test:unit                    # unit tests only
npm run test:integration             # integration tests only
npm run test:e2e                     # E2E tests (Playwright — requires dev server)
npm run test:e2e:update-snapshots    # regenerate visual regression baselines
```

## Testing Infrastructure
- **Unit / Integration**: Jest + `@swc/jest` + `@testing-library/react` — runs in `tests/unit/` and `tests/integration/`
- **E2E**: Playwright — runs in `tests/e2e/`; Playwright spins up `npm run dev` automatically
- **Pre-commit hook** (husky): runs `lint → test:unit → test:integration` on every commit. E2E is CI-only (too slow for pre-commit).
- **Test setup**: `tests/setup.ts` — imports `@testing-library/jest-dom` and clears `localStorage`/`sessionStorage` before each test. All tests inherit this automatically.
- **Parallelism**: Jest runs test files in parallel workers by default. Playwright uses `fullyParallel: true` with isolated browser contexts per worker (no localStorage conflicts).

## Environment Variables
```
# .env.local (never commit this file)
NEXT_PUBLIC_GA_ID=G-S4FLQ2B972
NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-6392082764157185
NEXT_PUBLIC_BASE_URL=https://toolnotch.com
```
Same vars must be set in Vercel project settings → Environment Variables.

## Folder Structure
```
/app
  /page.tsx                          # Tools hub homepage
  /layout.tsx                        # Global layout — GA + AdSense scripts live here
  /sitemap.ts                        # Add every new tool route here
  /robots.ts
  /tools/
    /image/
      /image-compressor/             # Tool page (server) + ImageCompressorClient.tsx (client)
      /[slug]/page.tsx               # Programmatic SEO pages for image conversions
    /pdf/
      /merge-pdf/                    # page.tsx + MergeTool.tsx
      /split-pdf/                    # page.tsx + SplitTool.tsx
      /compress-pdf/                 # page.tsx + CompressTool.tsx
      /pdf-to-jpg/                   # page.tsx + PdfToJpgTool.tsx
      /jpg-to-pdf/                   # page.tsx + JpgToPdfTool.tsx
    /convert/                        # unit & currency converter (project 04)
    /text/                           # word counter, paraphraser, etc. (projects 06–09)
    /finance/                        # loan calculator, invoice, portfolio (projects 10–12)
    /fun/                            # typing test, random generators (projects 14–15)
    /education/                      # GPA calculator, grade calculator, citation generator (projects 17, 24)
      /gpa-calculator/               # page.tsx + components/education/GpaCalculator.tsx
      /cumulative-gpa-calculator/    # page.tsx
      /grade-calculator/             # page.tsx + GradeCalculator.tsx
      /citation-generator/           # page.tsx + CitationGenerator.tsx (APA/MLA/Chicago/ABNT)
    /health/                         # BMI calculator, TDEE calculator (project 18)
      /bmi-calculator/               # page.tsx + components/health/BmiCalculator.tsx
      /tdee-calculator/              # page.tsx + TdeeCalculator.tsx
      /calorie-deficit-calculator/   # page.tsx (TdeeCalculator in deficit mode)
    /math/                           # Percentage calculator, age calculator (projects 19, 23)
      /percentage-calculator/        # page.tsx + components/math/PercentageCalculator.tsx
      /age-calculator/               # page.tsx + AgeCalculator.tsx
    /utilities/                      # QR code generator (project 20)
      /qr-code-generator/            # page.tsx + components/utilities/QrCodeGenerator.tsx
  /quiz/                             # Quiz player — /quiz/[slug]
  /quizzes/                          # Quiz hub — /quizzes (category tabs: Sports | Personality)

/components
  /AdUnit.tsx                        # Shared ad unit — uses NEXT_PUBLIC_ADSENSE_CLIENT env var
  /FaqSection.tsx                    # Shared FAQ accordion
  /ToolWrapper.tsx                   # Shared tool page layout (breadcrumb + header + ad + FAQ)
  /quiz/
    QuizPlayer.tsx                   # Personality quiz state machine UI
    QuestionCard.tsx                 # Single question + options
    ResultCard.tsx                   # Personality result + confetti + share
    TriviaPlayer.tsx                 # Trivia quiz UI (right/wrong feedback, score)
    TriviaResultCard.tsx             # Trivia result: score % + tier badge + share
  /education/                        # Education tool components (projects 17, 24)
    GpaCalculator.tsx                # GPA calculator — semester + cumulative modes
    GradeCalculator.tsx              # "What grade do I need?" calculator
    GradeScaleSelector.tsx           # US 4.0 / PT 0–20 / ES 0–10 toggle
    CourseRow.tsx                    # Single course row: name + grade + credits
    CitationGenerator.tsx            # Citation generator — APA/MLA/Chicago/ABNT
    CitationForm.tsx                 # Dynamic form fields per source type
    CitationOutput.tsx               # Formatted citation + copy button
  /health/                           # Health tool components (project 18)
    BmiCalculator.tsx                # BMI calculator with gauge visualization
    TdeeCalculator.tsx               # TDEE + calorie goal table
    UnitToggle.tsx                   # Metric ↔ Imperial toggle (converts values in place)
    BmiGauge.tsx                     # Color-coded BMI range bar
  /math/                             # Math tool components (projects 19, 23)
    PercentageCalculator.tsx         # 3 modes: X% of Y, X is what % of Y, % change
    AgeCalculator.tsx                # Exact age + birthday countdown + future age
    AgeResultCard.tsx                # Age display card
  /utilities/                        # Utility tool components (project 20)
    QrCodeGenerator.tsx              # QR code generator shell
    QrTypeSelector.tsx               # URL | Text | Email | Phone | WiFi tabs
    QrPreview.tsx                    # Canvas preview + size selector + download
  /image/                            # Image-tool-specific components
    AdUnit.tsx                       # (legacy — prefer /components/AdUnit.tsx for new tools)
    ComparisonView.tsx
    DownloadButton.tsx
    DropZone.tsx
    FormatSelector.tsx

/lib
  /imageConversion.ts                # Image compress/convert pure functions
  /imageTypes.ts
  /pdfMerge.ts                       # PDF merge
  /pdfSplit.ts                       # PDF split
  /pdfCompress.ts                    # PDF compress
  /pdfToImage.ts                     # PDF → image (pdfjs-dist)
  /imageToPdf.ts                     # Image → PDF
  /pdfTypes.ts                       # Shared PDF interfaces
  /quizTypes.ts                      # Quiz + TriviaQuiz interfaces (see Quiz section below)
  /quizEngine.ts                     # calculateResult() for personality quizzes
  /triviaEngine.ts                   # calculateTriviaResult() → {score, total, percent, tier}
  /quizRegistry.ts                   # Central registry of all quizzes (type, category, locales)
  /gpaTypes.ts                       # GradeScale, CourseEntry, GpaResult (project 17)
  /gpaMath.ts                        # calculateGpa(), calculateCumulative(), calculateGradeNeeded()
  /healthTypes.ts                    # BmiInput, BmiResult, TdeeInput, TdeeResult (project 18)
  /healthMath.ts                     # calculateBmi(), calculateTdee(), convertUnits()
  /percentTypes.ts                   # PercentResult, PercentChangeResult (project 19)
  /percentMath.ts                    # percentOf(), whatPercent(), percentChange()
  /qrTypes.ts                        # QrType, QrInput, QrConfig (project 20)
  /qrGenerator.ts                    # buildQrString(), generateQrCanvas(), generateQrSvg()
  /ageTypes.ts                       # AgeResult, BirthdayCountdown (project 23)
  /ageMath.ts                        # calculateAge(), nextBirthday(), futureAge()
  /citationTypes.ts                  # CitationFormat, SourceType, CitationInput (project 24)
  /citationFormatter.ts              # formatApa(), formatMla(), formatChicago(), formatAbnt()

/hooks
  /useQuiz.ts                        # State machine for personality quizzes
  /useTriviaQuiz.ts                  # State machine for trivia quizzes (optional timer support)

/data
  /conversionPages.ts                # Image programmatic SEO config (slug + metadata per format pair)
  /faq/
    /image-compressor.json
  /quizzes/
    # Personality quizzes — English only, flat (legacy location)
    what-career-suits-you.json
    which-programming-language-are-you.json
    am-i-introverted-or-extroverted.json
    what-type-of-traveler-are-you.json
    which-decade-do-you-belong-in.json
    # Sports quizzes — per-locale subdirectories
    /en/
      fifa-world-cup-winners.json
      which-football-club-are-you.json
      champions-league-trivia.json
      formula-1-trivia.json            # project 22
      which-f1-driver-are-you.json     # project 22
      what-is-your-love-language.json  # project 21
    /pt/
      fifa-world-cup-winners.json
      which-football-club-are-you.json
      champions-league-trivia.json
      formula-1-trivia.json            # project 22
      which-f1-driver-are-you.json     # project 22
      what-is-your-love-language.json  # project 21
    /es/
      fifa-world-cup-winners.json
      which-football-club-are-you.json
      champions-league-trivia.json
      formula-1-trivia.json            # project 22
      which-f1-driver-are-you.json     # project 22
      what-is-your-love-language.json  # project 21

/public
  /pdf.worker.min.mjs                # pdfjs-dist worker (required for PDF rendering)
```

## Adding a New Tool — Checklist
1. Create `/app/[locale]/tools/[category]/[tool-name]/page.tsx` (server component — exports metadata + `buildAlternates`)
2. Create `/components/[category]/[ToolName].tsx` (client component — `'use client'`, all interactivity here)
3. Add lib logic to `/lib/[toolName]Types.ts` + `/lib/[toolName]Math.ts` (or similar)
4. Add i18n keys to `messages/en.json`, `messages/pt.json`, `messages/es.json` under a matching namespace
5. Use `<ToolWrapper>` from `@/components/ToolWrapper` for consistent layout
6. Use `<AdUnit>` from `@/components/AdUnit` for ads (above FAQ only — never mid-tool)
7. Add the route to `/app/sitemap.ts` (with `alternates.languages` for hreflang)
8. Update `progress.txt` in the relevant plan folder under `plans/`

## New Tool Categories (Roadmap)
| Category | Route prefix | Plan |
|---|---|---|
| Education | `/tools/education/` | plans/17-gpa-calculator/, plans/24-citation-generator/ |
| Health | `/tools/health/` | plans/18-bmi-tdee-calculator/ |
| Math | `/tools/math/` | plans/19-percentage-calculator/, plans/23-age-calculator/ |
| Utilities | `/tools/utilities/` | plans/20-qr-code-generator/ |

## i18n Agent Pattern (for new tools)
Every new tool requires an **i18n Agent** that adds keys to all three message files simultaneously:
- `messages/en.json` — English (primary)
- `messages/pt.json` — Portuguese Brazil (pt-BR)
- `messages/es.json` — Spanish Latin America (es-LA)
Keys go under a namespace matching the tool category (e.g. `education.gpa`, `health.bmi`, `math.percentage`).
The i18n Agent runs in **Batch 1** in parallel with the Math Engine and UI agents.

## Shared Components
- `ToolWrapper` — wraps every tool page: breadcrumb, h1, description, privacy badge, top ad, tool content, FAQ
- `AdUnit` — renders AdSense unit or a placeholder when NEXT_PUBLIC_ADSENSE_CLIENT is not set
- `FaqSection` — collapsible FAQ accordion, used inside ToolWrapper

## Pattern: Server + Client Split
Every tool page uses this pattern to allow metadata export (server) while keeping interactivity (client):
```
/tools/pdf/merge-pdf/
  page.tsx          ← 'use server' (implicit), exports metadata, renders <MergeTool />
  MergeTool.tsx     ← 'use client', all useState/useEffect/event handlers here
```

## Conventions
- Never hardcode GA_ID or ADSENSE_CLIENT — always read from env vars
- All tool imports use `@/` alias (tsconfig paths: `"@/*": ["./*"]`)
- pdfjs-dist worker path: `/pdf.worker.min.mjs` (served from /public)
- New tools in /components/image/ sub-folder are image-specific; shared tools go in /components/ root
- sitemap.ts must be updated every time a new tool route is added

## Quiz Platform

### Two quiz types
| Type | Schema | Engine | Hook | Result |
|---|---|---|---|---|
| `personality` | `Quiz` (scores per option) | `quizEngine.ts` | `useQuiz.ts` | `QuizResult` — named result with description + traits |
| `trivia` | `TriviaQuiz` (correctAnswerId per question) | `triviaEngine.ts` | `useTriviaQuiz.ts` | `TriviaScoreTier` — % score + tier label (Legend/Expert/Fan/Rookie) |

### Quiz data conventions
- **Personality quizzes** (English-only): `data/quizzes/{slug}.json`
- **Sports/translated quizzes**: `data/quizzes/{locale}/{slug}.json` — one file per locale
- Fallback: if locale file not found, load `data/quizzes/{slug}.json` (English)
- `quizRegistry.ts` is the single source of truth for all quiz slugs, types, categories, locales

### Adding a new quiz
1. Write JSON file(s) in `data/quizzes/` (flat for EN-only, locale subdirs for multilingual)
2. Add entry to `lib/quizRegistry.ts`
3. Add quiz links to `app/[locale]/page.tsx` (homepage Quizzes section)
4. Add routes to `app/sitemap.ts`
5. No component changes needed — engine handles any valid JSON

### SEO for quizzes
- Every quiz page exports `metadata` with keyword-rich `title` + `description`
- JSON-LD: `Quiz` schema type + `breadcrumbSchema` + `faqSchema` (topic FAQs)
- `buildAlternates()` on every quiz page for hreflang (en/pt/es)
- Result/tier pages at `/quiz/[slug]/result/[resultId]` are indexable — 80–120 words of body text
- OG image generated per result via `opengraph-image.tsx`
- Trivia tier page title pattern: "[Score Tier] — [Quiz Title] | ToolNotch"

### Score tiers (trivia quizzes)
| % | EN | PT | ES |
|---|---|---|---|
| 80–100 | Legend | Lenda | Leyenda |
| 60–79 | Expert | Especialista | Experto |
| 40–59 | Fan | Fã | Fanático |
| 0–39 | Rookie | Iniciante | Novato |

## Do Not
- Do not create a new Vercel project for a new tool — add it as a route here
- Do not commit .env.local — it contains real API keys
- Do not import pdfjs-dist at module level — dynamic import only (it's large)
- Do not add inline styles — Tailwind only
- Do not modify existing `Quiz`, `Question`, `Option`, `QuizResult` interfaces — only extend alongside them
- Do not show ads during the quiz question flow — only on hub page and result/tier pages
- Do not hardcode quiz content in components — all content from JSON files
- Do not add a tool without also adding i18n keys for EN + PT + ES
- Do not use non-locale routes for new tools — all new tools go under `/app/[locale]/tools/`
- Do not call external APIs for calculator tools — all math is pure TypeScript, client-side
- Do not add ABNT citation format to EN or ES locales — ABNT is PT-only
