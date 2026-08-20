# P2-07 — Yes or No Wheel: enhance spin animation + randomness

- **Repo ref**: `app/[locale]/tools/fun/yes-or-no-wheel/`
- **Source row**: 33

## Request
Improve spin animation and randomness quality.

## Note — check against P0-03/P0-04 before scoping
`spin-the-wheel` and `wheel-of-names` have a confirmed bug where the displayed result doesn't match the actual outcome (see P0-03, P0-04). This tool's note is worded as an enhancement ("enhance randomness") rather than a bug, but if it shares the same wheel/spin component, verify it doesn't have the same landing-position bug before treating this as cosmetic-only work.

## Acceptance criteria
- [ ] Confirm result-landing accuracy first (see note above)
- [ ] Improve spin animation
- [ ] If randomness is currently low-entropy (e.g. `Math.random()` seeded oddly or biased), fix the RNG
