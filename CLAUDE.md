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
npm run dev       # localhost:3000
npm run build     # production build — run before every deploy
npm run lint
```

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
    /convert/                        # ← NEXT: unit & currency converter (project 04)
    /text/                           # ← NEXT: word counter, paraphraser, etc. (projects 06–09)
    /finance/                        # ← NEXT: loan calculator, invoice, portfolio (projects 10–12)
    /fun/                            # ← NEXT: typing test, random generators (projects 14–15)
  /quiz/                             # ← NEXT: quiz site (project 13)

/components
  /AdUnit.tsx                        # Shared ad unit — uses NEXT_PUBLIC_ADSENSE_CLIENT env var
  /FaqSection.tsx                    # Shared FAQ accordion
  /ToolWrapper.tsx                   # Shared tool page layout (breadcrumb + header + ad + FAQ)
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

/data
  /conversionPages.ts                # Image programmatic SEO config (slug + metadata per format pair)
  /faq/
    /image-compressor.json

/public
  /pdf.worker.min.mjs                # pdfjs-dist worker (required for PDF rendering)
```

## Adding a New Tool — Checklist
1. Create `/app/tools/[category]/[tool-name]/page.tsx` (server component — exports metadata)
2. Create `/app/tools/[category]/[tool-name]/[ToolName]Tool.tsx` (client component — the UI)
3. Add any lib logic to `/lib/`
4. Use `<ToolWrapper>` from `@/components/ToolWrapper` for consistent layout
5. Use `<AdUnit>` from `@/components/AdUnit` for ads
6. Add the route to `/app/sitemap.ts`
7. Update `progress.txt` in the relevant project folder under `C:\Users\juana\projects\`

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

## Do Not
- Do not create a new Vercel project for a new tool — add it as a route here
- Do not commit .env.local — it contains real API keys
- Do not import pdfjs-dist at module level — dynamic import only (it's large)
- Do not add inline styles — Tailwind only
