# P1-04 — CLAUDE.md documents wrong route for percentage-calculator

- **Status**: doc drift, not from source spreadsheet — found during this audit
- **Repo refs**: `CLAUDE.md` vs `app/[locale]/tools/convert/percentage-calculator/`

## Problem
`CLAUDE.md` lists `percentage-calculator` and `age-calculator` under `/tools/math/`. Actual repo has:
- `percentage-calculator` → `/tools/convert/percentage-calculator/` (not math)
- `age-calculator` → `/tools/math/age-calculator/` (matches doc)

Since CLAUDE.md instructions are treated as authoritative by any agent (human or AI) working in this repo, this drift will cause wrong-path assumptions on future work.

## Acceptance criteria
- [ ] PO/eng decision: is `convert/percentage-calculator` the correct permanent location, or should it move to `math/` to match docs?
- [ ] Update whichever is wrong — either move the route (with redirect + sitemap update) or fix the CLAUDE.md table
- [ ] Do a one-time full pass diffing CLAUDE.md's documented folder structure against actual `app/[locale]/tools/**` — this was the only drift found in a spot check, but the check wasn't exhaustive
