/**
 * Flat, server-renderable catalogue of the indexable tools + quizzes.
 *
 * WS-5 uses it for two things:
 *   1. `components/SiteNavIndex.tsx` — the site-wide crawl-depth floor
 *      (a compact <nav> in the footer linking every entry here).
 *   2. `lib/relatedContent.ts` — the category-sibling fallback so every tool
 *      page can always surface >= 2 contextual related-tool links.
 *
 * `labelKey` always points at an EXISTING key in the `home` message
 * namespace (`home.tools.<key>.label`), so no new translations are needed and
 * anchor text stays locale-correct in en/pt/es. Entries are intentionally
 * limited to routes that already have a `home.tools.*` label.
 *
 * Pure data — no imports — so it is safe to pull into the Jest CJS runtime.
 */

export type CatalogKind = 'tool' | 'quiz' | 'blog'

export interface CatalogEntry {
  /** Locale-agnostic path, e.g. `/tools/health/bmi-calculator`. */
  path: string
  /** Key under the `home` namespace: `home.tools.<labelKey>.label`. */
  labelKey: string
  /** Grouping bucket. Tools use their route segment; quizzes use `quizzes`. */
  category:
    | 'image'
    | 'pdf'
    | 'convert'
    | 'text'
    | 'finance'
    | 'fun'
    | 'agile'
    | 'education'
    | 'health'
    | 'math'
    | 'utilities'
    | 'interview'
    | 'quizzes'
    | 'blog'
  kind: CatalogKind
}

export const TOOL_CATALOG: CatalogEntry[] = [
  // Image
  { path: '/tools/image/image-compressor', labelKey: 'imageCompressor', category: 'image', kind: 'tool' },
  { path: '/tools/image/convert-png-to-webp', labelKey: 'imageConverter', category: 'image', kind: 'tool' },
  // PDF
  { path: '/tools/pdf/merge-pdf', labelKey: 'mergePdf', category: 'pdf', kind: 'tool' },
  { path: '/tools/pdf/split-pdf', labelKey: 'splitPdf', category: 'pdf', kind: 'tool' },
  { path: '/tools/pdf/compress-pdf', labelKey: 'compressPdf', category: 'pdf', kind: 'tool' },
  { path: '/tools/pdf/pdf-to-jpg', labelKey: 'pdfToJpg', category: 'pdf', kind: 'tool' },
  { path: '/tools/pdf/jpg-to-pdf', labelKey: 'jpgToPdf', category: 'pdf', kind: 'tool' },
  // Convert
  { path: '/tools/convert/unit-converter', labelKey: 'unitConverter', category: 'convert', kind: 'tool' },
  { path: '/tools/convert/currency-converter', labelKey: 'currencyConverter', category: 'convert', kind: 'tool' },
  { path: '/tools/convert/percentage-calculator', labelKey: 'percentageCalculator', category: 'convert', kind: 'tool' },
  { path: '/tools/convert/length-converter', labelKey: 'metersToFeet', category: 'convert', kind: 'tool' },
  { path: '/tools/convert/temperature-converter', labelKey: 'celsiusToFahrenheit', category: 'convert', kind: 'tool' },
  { path: '/tools/convert/weight-converter', labelKey: 'kgToPounds', category: 'convert', kind: 'tool' },
  // Text
  { path: '/tools/text/word-counter', labelKey: 'wordCounter', category: 'text', kind: 'tool' },
  { path: '/tools/text/character-counter', labelKey: 'characterCounter', category: 'text', kind: 'tool' },
  { path: '/tools/text/sentence-counter', labelKey: 'sentenceCounter', category: 'text', kind: 'tool' },
  { path: '/tools/text/readability-checker', labelKey: 'readabilityChecker', category: 'text', kind: 'tool' },
  { path: '/tools/text/reading-time-calculator', labelKey: 'readingTimeCalculator', category: 'text', kind: 'tool' },
  { path: '/tools/text/word-frequency-counter', labelKey: 'wordFrequencyCounter', category: 'text', kind: 'tool' },
  { path: '/tools/text/keyword-density-checker', labelKey: 'keywordDensityChecker', category: 'text', kind: 'tool' },
  { path: '/tools/text/paraphraser', labelKey: 'paraphraser', category: 'text', kind: 'tool' },
  { path: '/tools/text/summarizer', labelKey: 'summarizer', category: 'text', kind: 'tool' },
  { path: '/tools/text/plagiarism-checker', labelKey: 'plagiarismChecker', category: 'text', kind: 'tool' },
  // Finance
  { path: '/tools/finance/loan-calculator', labelKey: 'loanCalculator', category: 'finance', kind: 'tool' },
  { path: '/tools/finance/mortgage-calculator', labelKey: 'mortgageCalculator', category: 'finance', kind: 'tool' },
  { path: '/tools/finance/car-loan-calculator', labelKey: 'carLoanCalculator', category: 'finance', kind: 'tool' },
  { path: '/tools/finance/personal-loan-calculator', labelKey: 'personalLoanCalculator', category: 'finance', kind: 'tool' },
  { path: '/tools/finance/amortization-calculator', labelKey: 'amortizationCalculator', category: 'finance', kind: 'tool' },
  { path: '/tools/finance/home-affordability-calculator', labelKey: 'homeAffordability', category: 'finance', kind: 'tool' },
  { path: '/tools/finance/refinance-calculator', labelKey: 'refinanceCalculator', category: 'finance', kind: 'tool' },
  { path: '/tools/finance/student-loan-calculator', labelKey: 'studentLoanCalculator', category: 'finance', kind: 'tool' },
  { path: '/tools/finance/interest-calculator', labelKey: 'interestCalculator', category: 'finance', kind: 'tool' },
  { path: '/tools/finance/debt-payoff-calculator', labelKey: 'debtPayoffCalculator', category: 'finance', kind: 'tool' },
  { path: '/tools/finance/30-year-mortgage-calculator', labelKey: 'mortgage30Calculator', category: 'finance', kind: 'tool' },
  { path: '/tools/finance/15-year-mortgage-calculator', labelKey: 'mortgage15Calculator', category: 'finance', kind: 'tool' },
  { path: '/tools/finance/fha-loan-calculator', labelKey: 'fhaLoanCalculator', category: 'finance', kind: 'tool' },
  { path: '/tools/finance/va-loan-calculator', labelKey: 'vaLoanCalculator', category: 'finance', kind: 'tool' },
  { path: '/tools/finance/invoice-generator', labelKey: 'invoiceGenerator', category: 'finance', kind: 'tool' },
  { path: '/tools/finance/invoice-generator-uk', labelKey: 'invoiceGeneratorUk', category: 'finance', kind: 'tool' },
  { path: '/tools/finance/invoice-generator-canada', labelKey: 'invoiceGeneratorCanada', category: 'finance', kind: 'tool' },
  { path: '/tools/finance/invoice-generator-australia', labelKey: 'invoiceGeneratorAustralia', category: 'finance', kind: 'tool' },
  { path: '/tools/finance/invoice-generator-for-freelancers', labelKey: 'invoiceGeneratorFreelancers', category: 'finance', kind: 'tool' },
  { path: '/tools/finance/receipt-generator', labelKey: 'receiptGenerator', category: 'finance', kind: 'tool' },
  { path: '/tools/finance/crypto-portfolio-tracker', labelKey: 'cryptoPortfolioTracker', category: 'finance', kind: 'tool' },
  // Fun
  { path: '/tools/fun/spin-the-wheel', labelKey: 'spinTheWheel', category: 'fun', kind: 'tool' },
  { path: '/tools/fun/wheel-of-names', labelKey: 'wheelOfNames', category: 'fun', kind: 'tool' },
  { path: '/tools/fun/random-name-picker', labelKey: 'randomNamePicker', category: 'fun', kind: 'tool' },
  { path: '/tools/fun/random-team-generator', labelKey: 'teamGenerator', category: 'fun', kind: 'tool' },
  { path: '/tools/fun/yes-or-no-wheel', labelKey: 'yesOrNoWheel', category: 'fun', kind: 'tool' },
  { path: '/tools/fun/coin-flip', labelKey: 'coinFlip', category: 'fun', kind: 'tool' },
  { path: '/tools/fun/dice-roller', labelKey: 'diceRoller', category: 'fun', kind: 'tool' },
  { path: '/tools/fun/random-number-generator', labelKey: 'numberGenerator', category: 'fun', kind: 'tool' },
  { path: '/tools/fun/giveaway-picker', labelKey: 'giveawayPicker', category: 'fun', kind: 'tool' },
  { path: '/tools/fun/classroom-name-picker', labelKey: 'classroomNamePicker', category: 'fun', kind: 'tool' },
  { path: '/tools/fun/typing-test', labelKey: 'typingTest', category: 'fun', kind: 'tool' },
  // Agile
  { path: '/tools/agile/retro-board', labelKey: 'retroBoard', category: 'agile', kind: 'tool' },
  { path: '/tools/agile/standup-generator', labelKey: 'standupGenerator', category: 'agile', kind: 'tool' },
  { path: '/tools/agile/planning-poker', labelKey: 'planningPoker', category: 'agile', kind: 'tool' },
  { path: '/tools/agile/user-story-writer', labelKey: 'userStoryWriter', category: 'agile', kind: 'tool' },
  { path: '/tools/agile/sprint-date-calculator', labelKey: 'sprintDateCalculator', category: 'agile', kind: 'tool' },
  // Education
  { path: '/tools/education/gpa-calculator', labelKey: 'gpaCalculator', category: 'education', kind: 'tool' },
  { path: '/tools/education/cumulative-gpa-calculator', labelKey: 'cumulativeGpaCalculator', category: 'education', kind: 'tool' },
  { path: '/tools/education/grade-calculator', labelKey: 'gradeCalculator', category: 'education', kind: 'tool' },
  { path: '/tools/education/citation-generator', labelKey: 'citationGenerator', category: 'education', kind: 'tool' },
  // Health
  { path: '/tools/health/bmi-calculator', labelKey: 'bmiCalculator', category: 'health', kind: 'tool' },
  { path: '/tools/health/tdee-calculator', labelKey: 'tdeeCalculator', category: 'health', kind: 'tool' },
  { path: '/tools/health/calorie-deficit-calculator', labelKey: 'calorieDeficitCalculator', category: 'health', kind: 'tool' },
  // Math
  { path: '/tools/math/age-calculator', labelKey: 'ageCalculator', category: 'math', kind: 'tool' },
  // Utilities
  { path: '/tools/utilities/qr-code-generator', labelKey: 'qrCodeGenerator', category: 'utilities', kind: 'tool' },
  // Interview
  { path: '/interview', labelKey: 'interviewHub', category: 'interview', kind: 'tool' },
  { path: '/interview/typescript', labelKey: 'typescriptQuiz', category: 'interview', kind: 'tool' },
  // Quizzes
  { path: '/quizzes', labelKey: 'allQuizzes', category: 'quizzes', kind: 'quiz' },
  { path: '/quiz/which-programming-language-are-you', labelKey: 'programmingLanguageQuiz', category: 'quizzes', kind: 'quiz' },
  { path: '/quiz/am-i-introverted-or-extroverted', labelKey: 'introvertExtrovertQuiz', category: 'quizzes', kind: 'quiz' },
  { path: '/quiz/what-career-suits-you', labelKey: 'careerQuiz', category: 'quizzes', kind: 'quiz' },
  { path: '/quiz/what-type-of-traveler-are-you', labelKey: 'travelerQuiz', category: 'quizzes', kind: 'quiz' },
  { path: '/quiz/fifa-world-cup-winners', labelKey: 'worldCupQuiz', category: 'quizzes', kind: 'quiz' },
  { path: '/quiz/which-football-club-are-you', labelKey: 'footballClubQuiz', category: 'quizzes', kind: 'quiz' },
  { path: '/quiz/champions-league-trivia', labelKey: 'championsLeagueQuiz', category: 'quizzes', kind: 'quiz' },
  { path: '/quiz/what-is-your-love-language', labelKey: 'loveLangaugeQuiz', category: 'quizzes', kind: 'quiz' },
  { path: '/quiz/formula-1-trivia', labelKey: 'formula1TriviaQuiz', category: 'quizzes', kind: 'quiz' },
  { path: '/quiz/which-f1-driver-are-you', labelKey: 'f1DriverQuiz', category: 'quizzes', kind: 'quiz' },
  { path: '/quiz/what-is-your-political-profile', labelKey: 'politicalProfileQuiz', category: 'quizzes', kind: 'quiz' },
  { path: '/quiz/political-echo-chamber-quiz', labelKey: 'echoChamberQuiz', category: 'quizzes', kind: 'quiz' },
  { path: '/quiz/fake-news-or-fact', labelKey: 'fakeNewsQuiz', category: 'quizzes', kind: 'quiz' },
]

/** Ordered category buckets for the footer nav index. Keys map to `home.categories.*`. */
export const CATALOG_CATEGORY_ORDER: { category: CatalogEntry['category']; labelKey: string }[] = [
  { category: 'image', labelKey: 'imageTools' },
  { category: 'pdf', labelKey: 'pdfTools' },
  { category: 'convert', labelKey: 'converterTools' },
  { category: 'text', labelKey: 'textTools' },
  { category: 'finance', labelKey: 'financeTools' },
  { category: 'fun', labelKey: 'funAndRandom' },
  { category: 'agile', labelKey: 'agileTools' },
  { category: 'education', labelKey: 'educationTools' },
  { category: 'health', labelKey: 'healthTools' },
  { category: 'math', labelKey: 'mathTools' },
  { category: 'utilities', labelKey: 'utilityTools' },
  { category: 'interview', labelKey: 'interviewPrep' },
  { category: 'quizzes', labelKey: 'quizzes' },
]

/** Entries in one category, in declaration order. */
export function catalogByCategory(category: CatalogEntry['category']): CatalogEntry[] {
  return TOOL_CATALOG.filter((e) => e.category === category)
}

/** Look up a catalog entry by its locale-agnostic path. */
export function catalogEntry(path: string): CatalogEntry | undefined {
  return TOOL_CATALOG.find((e) => e.path === path)
}
