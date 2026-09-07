# ToolNotch — Issue Tracker (working dir, git-ignored)

Source: `C:\Users\juana\Documents\issues-toolnotch.xlsb.xlsx` (Folha1, 43 rows), imported 2026-08-10.
Repo paths verified against actual `app/[locale]/tools/**` structure, not just CLAUDE.md (found drift — see P3).

## Stated priority
Standardize code, components, and core features first. This tracker is ordered so P0/P1 are pure standardization + broken-core work; feature requests (P2) come after.

## Folder structure
```
issues/
  P0-critical-bugs/        # core functionality broken or unverified — fix before anything else
  P1-standardization/      # cross-cutting design-system / input-standard debt (Surgical Neon rollout gaps)
  P2-enhancements/         # net-new feature requests, scoped per tool
  P3-coverage-gap/         # audit findings — tools that exist in repo but aren't in the source spreadsheet
  issues-master.csv        # flat table, all issues, for import into GitHub/Linear/Jira
```

Each issue file: `NN-slug.md` with ID, title, repo ref(s), priority, description, acceptance criteria, source row.

## Counts
- P0 critical bugs: 6
- P1 standardization: 4 (epics, each covers a batch of tools)
- P2 enhancements: 11
- P3 coverage gap: 1 (audit doc listing 38 undocumented/untracked tool routes)
- **Total: 22 issues** covering all 43 spreadsheet rows (rows marked "None/Design" with no actionable note excluded — see full list in `issues-master.csv` source row column for traceability)

## Key finding — doc drift
CLAUDE.md documents `percentage-calculator` and `age-calculator` under `/tools/math/`. Actual repo has `percentage-calculator` under `/tools/convert/` and only `age-calculator` under `/tools/math/`. Flagged in `P1-standardization/04-claude-md-path-drift.md`. Fix CLAUDE.md or move the route — pick one, don't leave both.

## Key finding — spreadsheet coverage
Spreadsheet tracks 43 tools/sections. Repo has ~90 tool routes total. Untracked ones (never QA'd per this sheet) listed in `P3-coverage-gap/01-untracked-tools-audit.md` — includes all invoice-generator variants beyond UK, all mortgage/loan variants beyond the original 3, resume-builder, qr-code-generator, citation-generator, gpa/grade calculators, bmi/tdee tools, 7 of 8 interview topic pages, and more.
