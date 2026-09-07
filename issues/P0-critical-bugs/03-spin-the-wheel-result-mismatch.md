# P0-03 — Spin the Wheel: displayed result doesn't match actual outcome

- **Status**: NOT OK
- **Repo ref**: `app/[locale]/tools/fun/spin-the-wheel/`
- **Source row**: 27

## Problem
Wheel spin animation lands on a visual position that doesn't match the actual randomly-selected result (the winner shown/announced differs from where the wheel physically stops).

## Acceptance criteria
- [ ] Winning segment computed first, then animation rotation angle derived to land exactly on that segment
- [ ] Verify across different segment counts (uneven segment widths must still land correctly)
- [ ] Dark palette pass on this tool (bundled with this fix per source note)

## Note
Same bug class as `wheel-of-names` (P0-04) — check if they share a spin/rotation component and fix once.
