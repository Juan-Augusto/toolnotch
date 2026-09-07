# P2-02 — Split PDF: page range should be optional, currently errors

- **Repo ref**: `app/[locale]/tools/pdf/split-pdf/` (`page.tsx` + `SplitTool.tsx`, `lib/pdfSplit.ts`)
- **Source row**: 5

## Problem
Page range field is documented/intended as optional, but leaving it empty triggers an error instead of falling back to a sane default (e.g. split every page, or split in half).

## Acceptance criteria
- [ ] Empty page-range input no longer throws — define and implement the default behavior
- [ ] Validation error only fires for genuinely invalid input (e.g. malformed range, out-of-bounds page), not for empty/optional field
