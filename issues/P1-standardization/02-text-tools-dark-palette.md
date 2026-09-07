# P1-02 — Text tools: dark color palette cleanup

- **Status**: OK (functional), standardization debt
- **Repo refs**:
  - `app/[locale]/tools/text/word-counter/`
  - `app/[locale]/tools/text/character-counter/`
  - `app/[locale]/tools/text/readability-checker/`
  - `app/[locale]/tools/text/word-frequency-counter/`
- **Source rows**: 14, 15, 16, 18

## Problem
Dark color palette needs improvement across all 4 text tools — likely predates the Surgical Neon rollout (`app/globals.css`, see design system memory) or was only partially applied.

## Acceptance criteria
- [ ] Audit each tool against the current `card-neon` / `input-neon` / `text-glow` tokens
- [ ] Bring all 4 in line with the `/[locale]/design-system` reference page — no bespoke colors outside the token set
- [ ] Visual regression snapshot update (`npm run test:e2e:update-snapshots`) after changes

## Note
`reading-time-calculator` is in the same `text/` category but is P0 (core functionality unverified) — do that one separately, don't fold it into this palette pass.
