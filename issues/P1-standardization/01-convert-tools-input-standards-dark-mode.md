# P1-01 — Convert tools: input standards + dark mode text clarity

- **Status**: OK (functional), standardization debt
- **Repo refs**:
  - `app/[locale]/tools/convert/unit-converter/`
  - `app/[locale]/tools/convert/percentage-calculator/`
  - `app/[locale]/tools/convert/[slug]/` (unit conversion pages — includes Meters↔Feet, Celsius↔Fahrenheit, Kilograms↔Pounds; config in `data/units.ts`, `lib/units.ts`, `lib/unitTypes.ts`)
- **Source rows**: 9, 10, 11, 12, 13

## Problem
Two related complaints across all convert-category tools:
1. No consistent input standards (formatting, min/max, decimal handling likely differs tool to tool)
2. Text clarity in dark mode is poor — likely not using the `input-neon` / `label-neon` classes from the Surgical Neon design system consistently

## Acceptance criteria
- [ ] Audit each tool's form inputs against `input-neon` / `label-neon` (see `app/globals.css`, reference at `/[locale]/design-system`)
- [ ] Define one shared input-standard spec (number formatting, placeholder style, error state) and apply to all 3 tools + the `[slug]` programmatic pages
- [ ] Since `[slug]` pages are generated from `data/units.ts`, fix the shared component once — don't patch per generated page
- [ ] Contrast-check dark mode text against WCAG AA at minimum

## Note
This is the same root cause across 5 spreadsheet rows (unit-converter, percentage-calculator, and 3 unit-conversion slugs) — one epic, not 5 tickets.
