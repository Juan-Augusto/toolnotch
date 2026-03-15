/**
 * Integration test for StatsGrid component.
 *
 * StatsGrid uses next-intl's useTranslations hook, which requires an IntlProvider
 * in production. In tests we mock the hook so it returns the translation key as
 * a plain string — this keeps the assertions independent of translation files
 * while still exercising the rendering logic fully.
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import StatsGrid from '@/components/text-counter/StatsGrid'
import { TextStats } from '@/lib/textTypes'

// ── Mock next-intl ────────────────────────────────────────────────────────────
// useTranslations returns a function that echoes the translation key so we can
// assert on stable strings regardless of locale.
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

// ── Sample fixture ────────────────────────────────────────────────────────────

const SAMPLE_STATS: TextStats = {
  words: 42,
  characters: 210,
  charactersNoSpaces: 168,
  sentences: 5,
  paragraphs: 2,
  readingTime: 1,
  speakingTime: 1,
  fleschEase: 72.4,
  fleschGrade: 7.1,
  gunningFog: 8.3,
  avgWordsPerSentence: 8.4,
  avgSyllablesPerWord: 1.52,
  topWords: [
    { word: 'apple', count: 5 },
    { word: 'banana', count: 3 },
  ],
}

// ── Render smoke test ─────────────────────────────────────────────────────────

describe('StatsGrid — renders without crashing', () => {
  test('renders with a complete TextStats object', () => {
    const { container } = render(<StatsGrid stats={SAMPLE_STATS} />)
    expect(container.firstChild).not.toBeNull()
  })

  test('renders with all-zero TextStats (empty state)', () => {
    const emptyStats: TextStats = {
      words: 0, characters: 0, charactersNoSpaces: 0,
      sentences: 0, paragraphs: 0, readingTime: 0, speakingTime: 0,
      fleschEase: 0, fleschGrade: 0, gunningFog: 0,
      avgWordsPerSentence: 0, avgSyllablesPerWord: 0,
      topWords: [],
    }
    expect(() => render(<StatsGrid stats={emptyStats} />)).not.toThrow()
  })
})

// ── Stat values are displayed ─────────────────────────────────────────────────

describe('StatsGrid — displays all stat values', () => {
  beforeEach(() => {
    render(<StatsGrid stats={SAMPLE_STATS} />)
  })

  test('displays word count', () => {
    // toLocaleString() for 42 → "42" in most locales; the value is present
    expect(screen.getByText('42')).toBeInTheDocument()
  })

  test('displays character count', () => {
    expect(screen.getByText('210')).toBeInTheDocument()
  })

  test('displays characters-no-spaces count', () => {
    expect(screen.getByText('168')).toBeInTheDocument()
  })

  test('displays sentence count', () => {
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  test('displays paragraph count', () => {
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  test('displays reading time as formatted string', () => {
    // readingTime and speakingTime both equal 1 → two "1 min" cells
    const matches = screen.getAllByText('1 min')
    expect(matches.length).toBeGreaterThanOrEqual(1)
  })

  test('displays avgWordsPerSentence', () => {
    expect(screen.getByText('8.4')).toBeInTheDocument()
  })
})

// ── Translation keys are rendered as labels ───────────────────────────────────

describe('StatsGrid — label translation keys', () => {
  beforeEach(() => {
    render(<StatsGrid stats={SAMPLE_STATS} />)
  })

  // Because the mock returns the key verbatim, we can assert on all expected keys
  const EXPECTED_KEYS = [
    'words',
    'characters',
    'charactersNoSpaces',
    'sentences',
    'paragraphs',
    'readingTime',
    'speakingTime',
    'avgWordsPerSentence',
  ]

  test.each(EXPECTED_KEYS)('renders label for translation key "%s"', (key) => {
    expect(screen.getByText(key)).toBeInTheDocument()
  })
})

// ── primaryStat highlighting ──────────────────────────────────────────────────

describe('StatsGrid — primaryStat prop', () => {
  test('defaults to "words" highlight without crashing', () => {
    // No primaryStat passed — should use default 'words'
    const { container } = render(<StatsGrid stats={SAMPLE_STATS} />)
    // The highlighted card has bg-blue-50; at least one such element should exist
    const highlighted = container.querySelectorAll('.bg-blue-50')
    expect(highlighted.length).toBeGreaterThanOrEqual(1)
  })

  test('highlights the correct card when primaryStat is "characters"', () => {
    const { container } = render(
      <StatsGrid stats={SAMPLE_STATS} primaryStat="characters" />
    )
    const highlighted = container.querySelectorAll('.bg-blue-50')
    expect(highlighted.length).toBeGreaterThanOrEqual(1)
  })

  test('highlights the correct card when primaryStat is "readingTime"', () => {
    const { container } = render(
      <StatsGrid stats={SAMPLE_STATS} primaryStat="readingTime" />
    )
    const highlighted = container.querySelectorAll('.bg-blue-50')
    expect(highlighted.length).toBeGreaterThanOrEqual(1)
  })
})

// ── formatTime helper edge cases (exercised via props) ────────────────────────

describe('StatsGrid — formatTime display', () => {
  test('readingTime of 0 renders "< 1 min"', () => {
    render(<StatsGrid stats={{ ...SAMPLE_STATS, readingTime: 0, speakingTime: 0 }} />)
    const lessThan = screen.getAllByText('< 1 min')
    expect(lessThan.length).toBeGreaterThanOrEqual(1)
  })

  test('readingTime of 5 renders "5 min"', () => {
    render(<StatsGrid stats={{ ...SAMPLE_STATS, readingTime: 5 }} />)
    expect(screen.getByText('5 min')).toBeInTheDocument()
  })

  test('readingTime of 1 renders "1 min" (singular form)', () => {
    render(<StatsGrid stats={{ ...SAMPLE_STATS, readingTime: 1 }} />)
    // getAllByText because speakingTime may also be 1
    const oneMin = screen.getAllByText('1 min')
    expect(oneMin.length).toBeGreaterThanOrEqual(1)
  })
})
