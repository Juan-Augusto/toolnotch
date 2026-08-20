# P0-01 — Invoice Generator: PDF generation broken + input overflow

- **Status**: NOT OK
- **Repo ref**: `app/[locale]/tools/finance/invoice-generator/`
- **Source row**: 22

## Problem
PDF generation does not work. Inputs break when many digits are entered (likely no max-length/format guard on numeric fields, or a layout overflow in the PDF template).

## Acceptance criteria
- [ ] PDF export produces a valid, downloadable file for a standard invoice
- [ ] Numeric fields (amounts, quantities, totals) handle large values without breaking layout or state
- [ ] Add input validation/formatting (currency mask or max digit guard) consistent with other finance tools

## Note
Same root cause likely affects `invoice-generator-uk` (P0-02) and possibly the untracked variants (`invoice-generator-australia`, `invoice-generator-canada`, `invoice-generator-for-freelancers` — see P3). Fix the shared PDF-generation logic once if these share a lib module, not per-page.
