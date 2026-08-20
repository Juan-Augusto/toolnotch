# P2-04 — Random Team Generator: enforce minimum team size logic

- **Repo ref**: `app/[locale]/tools/fun/random-team-generator/`
- **Source row**: 29

## Request
Team count should scale to participant count — don't let the user pick more teams than makes sense for the number of participants (e.g. 10 people into 15 teams).

## Acceptance criteria
- [ ] Define minimum participants-per-team rule (PO to confirm — suggest minimum 1, but likely want 2+)
- [ ] UI caps/clamps team-count input based on current participant count, with a clear message when clamped
