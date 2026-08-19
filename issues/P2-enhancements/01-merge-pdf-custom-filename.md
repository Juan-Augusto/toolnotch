# P2-01 — Merge PDF: customizable output filename

- **Repo ref**: `app/[locale]/tools/pdf/merge-pdf/` (`page.tsx` + `MergeTool.tsx`, `lib/pdfMerge.ts`)
- **Source row**: 4

## Request
Add an input for the user to set the output filename before download, instead of a fixed default.

## Acceptance criteria
- [ ] Filename input field, sane default (e.g. `merged.pdf`), sanitized (strip path chars, force `.pdf` extension)
- [ ] Same pattern to be reused for JPG to PDF (P2-03) — build as a shared small component if feasible
