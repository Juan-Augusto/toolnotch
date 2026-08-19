# P0-02 — Invoice Generator UK: PDF generation broken + input overflow

- **Status**: NOT OK
- **Repo ref**: `app/[locale]/tools/finance/invoice-generator-uk/`
- **Source row**: 23

## Problem
Same failure mode as the base invoice generator: PDF export not working, numeric inputs break with many digits.

## Acceptance criteria
- [ ] PDF export works for UK invoice format (VAT fields included)
- [ ] Numeric fields handle large values safely
- [ ] Confirm fix location — if invoice-generator and invoice-generator-uk share a lib/component, fix once and verify both pages, don't duplicate the patch

## Note
See P0-01. Also check `invoice-generator-australia`, `invoice-generator-canada`, `invoice-generator-for-freelancers` (untracked in spreadsheet, listed in P3) — same shared logic likely broken there too.
