# P1-03 — Finance calculators: non-US market support + dark palette + table row hover

- **Status**: OK (functional), standardization + scope debt
- **Repo refs**:
  - `app/[locale]/tools/finance/loan-calculator/`
  - `app/[locale]/tools/finance/mortgage-calculator/`
  - `app/[locale]/tools/finance/car-loan-calculator/`
  - `app/[locale]/tools/finance/home-affordability-calculator/`
  - `app/[locale]/tools/finance/amortization-calculator/`
  - `app/[locale]/tools/finance/student-loan-calculator/`
- **Source rows**: 19, 20, 21, 24, 25, 26

## Problem
Two bundled issues across all 6 finance calculators:
1. Logic/assumptions are US-market-only (currency, tax conventions, loan terms) — doesn't serve PT/ES locales meaningfully despite the site being trilingual
2. Dark palette needs improvement, specifically amortization/breakdown table row hover state

## Acceptance criteria
- [ ] PO decision: what does "expand to more contexts" mean concretely — currency selector, region-specific loan term presets, or just copy/labeling? Scope this before dev work starts, this is the biggest open-ended item in the whole sheet
- [ ] Table row hover state added/fixed consistently (likely a shared table component — check for reuse across these 6 tools before patching each)
- [ ] Dark palette pass per `/[locale]/design-system` tokens

## Note
This is the largest-scope item in the sheet — recommend splitting into a scoping spike (decision) + implementation ticket once scope is confirmed, rather than starting build work off the current vague note.
