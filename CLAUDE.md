# Image Compressor / Converter — Claude Context

## Project Overview
Client-side image compression and format conversion tool. No backend required.
All processing runs in the browser via Canvas API and `browser-image-compression`.

## Stack
- Framework: Next.js (App Router, TypeScript)
- Libraries: `browser-image-compression`, Canvas API (native)
- Styling: Tailwind CSS
- Hosting: Vercel (free tier)
- Ads: Google AdSense

## Key Commands
```bash
npm run dev       # Start dev server on localhost:3000
npm run build     # Production build
npm run test      # Run unit tests
npm run lint      # ESLint check
```

## Folder Structure
```
/app
  /tools/image/
    /image-compressor/page.tsx   # Main tool page
    /[slug]/page.tsx             # Programmatic SEO pages
/components/image/
  DropZone.tsx
  FormatSelector.tsx
  ComparisonView.tsx
  DownloadButton.tsx
/lib/
  imageConversion.ts             # Core logic — pure functions only
  imageTypes.ts                  # Shared TypeScript interfaces
/data/
  faq/image-compressor.json
  conversionPages.ts             # Slug → unit pair config for generateStaticParams
```

## Core Interfaces
```ts
// lib/imageTypes.ts
interface ImageJob {
  file: File
  format: 'jpg' | 'png' | 'webp' | 'avif'
  quality: number        // 1–100
  maxWidth?: number
  maxHeight?: number
}
interface ConversionResult {
  blob: Blob
  originalSize: number
  compressedSize: number
  savings: number        // percentage
}
```

## Agent Responsibilities
| Agent | Owns |
|---|---|
| Core Logic | `/lib/imageConversion.ts` — pure functions, unit tested |
| UI Components | `/components/image/*.tsx` — no business logic |
| SEO & Pages | `/app/tools/image/*/page.tsx` — metadata + schema |
| Content | `/data/faq/*.json` — FAQ copy |
| Integration | Main page.tsx wiring all together |
| DevOps | `vercel.json`, CI workflow |

## Conventions
- All conversion functions are pure (no React, no side effects)
- Components receive typed props — no direct localStorage access in components
- Each programmatic page must have unique h1, meta description, and FAQ
- Canvas operations must be wrapped in try/catch — browser support varies
- `browser-image-compression` options: `{ maxSizeMB, maxWidthOrHeight, useWebWorker: true }`

## SEO Targets
- Primary: `compress image online free`
- Programmatic pages: `/tools/image/convert-png-to-webp`, `/tools/image/compress-jpg-online`, etc.
- Schema: WebApplication + FAQPage JSON-LD on every page

## Programmatic Pages Config
Defined in `/data/conversionPages.ts` — array of `{ slug, fromFormat, toFormat, h1, meta, faq[] }`.
`generateStaticParams()` reads this array. Adding a new page = add one object to the array.

## Do Not
- Do not call the conversion functions directly from event handlers — always go through the Integration layer
- Do not add inline styles — use Tailwind classes only
- Do not store processed images in localStorage (too large) — use `createObjectURL` and revoke on unmount
