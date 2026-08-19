# P0-06 — Planning Poker: needs shared/multiplayer session support

- **Status**: ?? (unclear/needs refinement per source)
- **Repo ref**: `app/[locale]/tools/agile/planning-poker/`
- **Source row**: 39

## Problem
Tool currently has no shared session — planning poker is inherently multiplayer (team votes simultaneously, reveals together). Without a shared session it doesn't do its core job. Marked `??` because scope/feasibility needs a decision, not just a bug fix.

## Decision needed before scoping
This tool has no backend/DB in this repo (all other tools are pure client-side calculators — see CLAUDE.md "Do not call external APIs for calculator tools"). A shared session requires either:
- A lightweight realtime backend (e.g. a serverless websocket/Firebase/Supabase — new infra decision, out of pattern for this repo)
- Or a peer-to-peer approach (WebRTC) with no backend

## Acceptance criteria
- [ ] PO decision: is shared session in scope for this tool, or do we reposition it as single-user (e.g. private estimation) and drop the "shared" framing?
- [ ] If in scope: pick infra approach and confirm it doesn't break the "one Vercel project, no external API" pattern for calculators (this isn't a calculator, so may be an intentional exception — document it)
