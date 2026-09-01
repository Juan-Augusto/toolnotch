# P0-04 — Wheel of Names: displayed result doesn't match actual outcome

- **Status**: NOT OK
- **Repo ref**: `app/[locale]/tools/fun/wheel-of-names/`
- **Source row**: 34

## Problem
Same as spin-the-wheel (P0-03): the wheel's visual stopping point doesn't reflect the actual selected winner.

## Acceptance criteria
- [ ] Winning name computed first, animation rotation derived to land exactly on it
- [ ] Verify with varying list lengths and duplicate-name entries
- [ ] Dark palette pass on this tool (bundled with this fix per source note)

## Note
Fix alongside P0-03 if there's a shared wheel/spin component — same root cause is likely.
