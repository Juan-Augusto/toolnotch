# P3-01 — Tools in repo, not in source spreadsheet (never QA-tracked)

The source spreadsheet (`issues-toolnotch.xlsb.xlsx`) covers 43 tools/sections. The repo has ~90 tool routes under `app/[locale]/tools/` plus 8 interview pages. Everything below has no recorded status — never confirmed OK or NOT OK anywhere.

## Recommended action
Run the same OK / NOT OK / needs-improvement pass on this list before or alongside the tracked backlog, prioritizing by traffic/revenue if analytics data exists (GA4 property `G-S4FLQ2B972`). Don't assume "untracked = working" — the tracked list already showed 2 tools completely broken (invoice generators) and 2 with a randomness bug (wheels); untracked tools are equally likely to have unknown issues.

## Finance (`app/[locale]/tools/finance/`) — 13 untracked
- `15-year-mortgage-calculator`
- `30-year-mortgage-calculator`
- `crypto-portfolio-tracker`
- `debt-payoff-calculator`
- `fha-loan-calculator`
- `interest-calculator`
- `invoice-generator-australia` — **check first, likely shares broken PDF logic with P0-01/P0-02**
- `invoice-generator-canada` — **check first, same as above**
- `invoice-generator-for-freelancers` — **check first, same as above**
- `personal-loan-calculator`
- `receipt-generator` — likely also does PDF export, check against P0-01 root cause
- `refinance-calculator`
- `va-loan-calculator`

## Convert (`app/[locale]/tools/convert/`) — 1 untracked
- `currency-converter`

## Education (`app/[locale]/tools/education/`) — 4 untracked, entire category
- `citation-generator`
- `cumulative-gpa-calculator`
- `gpa-calculator`
- `grade-calculator`

## Health (`app/[locale]/tools/health/`) — 3 untracked, entire category
- `bmi-calculator`
- `calorie-deficit-calculator`
- `tdee-calculator`

## Math (`app/[locale]/tools/math/`) — 1 untracked
- `age-calculator`

## Text (`app/[locale]/tools/text/`) — 4 untracked
- `keyword-density-checker`
- `plagiarism-checker`
- `sentence-counter`
- `summarizer`

## Utilities (`app/[locale]/tools/utilities/`) — 1 untracked, entire category
- `qr-code-generator`

## Resume (`app/[locale]/tools/resume/`) — 1 untracked, entire category
- `resume-builder` — likely also does PDF export, check against P0-01 root cause

## Fun (`app/[locale]/tools/fun/`) — 3 untracked
- `classroom-name-picker`
- `giveaway-picker`
- `typing-test`

## Interview (`app/[locale]/interview/`) — 7 of 8 untracked
Only `typescript` was in the spreadsheet.
- `database-design`
- `database-indexing`
- `messaging-sqs-kafka`
- `nodejs-fundamentals`
- `rabbitmq-concepts`
- `system-architecture`
- `vue`
All 7 likely need the same breadcrumb fix as P2-09 (typescript) if the hub-level nav pattern is missing site-wide.

## Total: 38 untracked tool/content routes
