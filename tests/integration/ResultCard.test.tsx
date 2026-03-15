import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ResultCard from '@/components/quiz/ResultCard'
import { Quiz, QuizResult } from '@/lib/quizTypes'

// ─── Mock next-intl ──────────────────────────────────────────────────────────

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const map: Record<string, string> = {
      results: 'Your result',
      share: 'Share',
      restart: 'Retake Quiz',
    }
    return map[key] ?? key
  },
}))

// ─── Mock framer-motion ──────────────────────────────────────────────────────
// Framer Motion animations are irrelevant in jsdom and can cause warnings.
// Replace all animated components with plain HTML equivalents.

jest.mock('framer-motion', () => {
  const actual = jest.requireActual<typeof import('framer-motion')>('framer-motion')
  return {
    ...actual,
    motion: new Proxy(
      {},
      {
        get: (_: unknown, tag: string) =>
          // eslint-disable-next-line react/display-name
          React.forwardRef(({ children, ...props }: React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode }, ref: React.Ref<HTMLElement>) =>
            React.createElement(tag, { ...props, ref }, children),
          ),
      },
    ),
  }
})

// ─── Mock canvas-confetti ────────────────────────────────────────────────────

const mockConfetti = jest.fn()

jest.mock('canvas-confetti', () => ({
  __esModule: true,
  default: (...args: unknown[]) => mockConfetti(...args),
}))

// ─── Fixtures ────────────────────────────────────────────────────────────────

const RESULT: QuizResult = {
  id: 'creative',
  title: 'Creative Career',
  description: 'Your results point strongly toward a creative career.',
  image: '/images/results/creative.jpg',
  traits: ['Imaginative', 'Original', 'Expressive'],
  shareText: "I'm suited for a Creative Career! I took the career quiz on ToolNotch.",
}

const QUIZ: Quiz = {
  id: 'what-career-suits-you',
  title: 'What Career Suits You?',
  description: 'A career quiz.',
  image: '/images/quizzes/cover.jpg',
  questions: [],
  results: [RESULT],
}

// Helper to configure window.matchMedia return value before each render
function mockMatchMedia(prefersReducedMotion: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query: string) => ({
      matches: query === '(prefers-reduced-motion: reduce)' ? prefersReducedMotion : false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  })
}

// ─── Tests ───────────────────────────────────────────────────────────────────

beforeEach(() => {
  mockConfetti.mockClear()
  // Default: motion is NOT reduced (confetti should fire on first mount)
  mockMatchMedia(false)
})

describe('ResultCard', () => {
  describe('content rendering', () => {
    it('renders the result title', () => {
      render(<ResultCard result={RESULT} quiz={QUIZ} onRetake={jest.fn()} />)

      expect(screen.getByText('Creative Career')).toBeInTheDocument()
    })

    it('renders the result description', () => {
      render(<ResultCard result={RESULT} quiz={QUIZ} onRetake={jest.fn()} />)

      expect(
        screen.getByText('Your results point strongly toward a creative career.'),
      ).toBeInTheDocument()
    })

    it('renders each trait badge', () => {
      render(<ResultCard result={RESULT} quiz={QUIZ} onRetake={jest.fn()} />)

      expect(screen.getByText('Imaginative')).toBeInTheDocument()
      expect(screen.getByText('Original')).toBeInTheDocument()
      expect(screen.getByText('Expressive')).toBeInTheDocument()
    })

    it('renders no trait badges when traits array is empty', () => {
      const resultNoTraits: QuizResult = { ...RESULT, traits: [] }

      render(<ResultCard result={resultNoTraits} quiz={QUIZ} onRetake={jest.fn()} />)

      // The traits we know about should not be present
      expect(screen.queryByText('Imaginative')).not.toBeInTheDocument()
    })
  })

  describe('share controls', () => {
    it('renders the Twitter / X share link', () => {
      render(<ResultCard result={RESULT} quiz={QUIZ} onRetake={jest.fn()} />)

      const twitterLink = screen.getByRole('link', { name: 'Twitter / X' })
      expect(twitterLink).toBeInTheDocument()
      expect(twitterLink).toHaveAttribute('href', expect.stringContaining('twitter.com'))
    })

    it('renders the WhatsApp share link', () => {
      render(<ResultCard result={RESULT} quiz={QUIZ} onRetake={jest.fn()} />)

      const whatsappLink = screen.getByRole('link', { name: 'WhatsApp' })
      expect(whatsappLink).toBeInTheDocument()
      expect(whatsappLink).toHaveAttribute('href', expect.stringContaining('wa.me'))
    })

    it('renders the Copy Link button', () => {
      render(<ResultCard result={RESULT} quiz={QUIZ} onRetake={jest.fn()} />)

      expect(screen.getByRole('button', { name: 'Copy Link' })).toBeInTheDocument()
    })
  })

  describe('retake button', () => {
    it('renders the retake / restart button', () => {
      render(<ResultCard result={RESULT} quiz={QUIZ} onRetake={jest.fn()} />)

      expect(screen.getByRole('button', { name: 'Retake Quiz' })).toBeInTheDocument()
    })

    it('calls onRetake when the retake button is clicked', async () => {
      const user = userEvent.setup()
      const onRetake = jest.fn()

      render(<ResultCard result={RESULT} quiz={QUIZ} onRetake={onRetake} />)

      await user.click(screen.getByRole('button', { name: 'Retake Quiz' }))

      expect(onRetake).toHaveBeenCalledTimes(1)
    })
  })

  describe('confetti behaviour', () => {
    it('does NOT call canvas-confetti when prefers-reduced-motion is reduce', () => {
      mockMatchMedia(true) // user has requested reduced motion

      render(<ResultCard result={RESULT} quiz={QUIZ} onRetake={jest.fn()} />)

      expect(mockConfetti).not.toHaveBeenCalled()
    })

    it('does NOT call confetti a second time for the same quiz+result (sessionStorage guard)', () => {
      mockMatchMedia(false)

      // Pre-populate the sessionStorage key that ResultCard sets after the first fire
      const sessionKey = `confetti_shown_${QUIZ.id}_${RESULT.id}`
      sessionStorage.setItem(sessionKey, '1')

      render(<ResultCard result={RESULT} quiz={QUIZ} onRetake={jest.fn()} />)

      expect(mockConfetti).not.toHaveBeenCalled()
    })

    it('calls canvas-confetti once on first mount when motion is not reduced', () => {
      mockMatchMedia(false)
      // sessionStorage is cleared by the global beforeEach in tests/setup.ts

      render(<ResultCard result={RESULT} quiz={QUIZ} onRetake={jest.fn()} />)

      expect(mockConfetti).toHaveBeenCalledTimes(1)
    })

    it('calls confetti with expected options when firing', () => {
      mockMatchMedia(false)

      render(<ResultCard result={RESULT} quiz={QUIZ} onRetake={jest.fn()} />)

      expect(mockConfetti).toHaveBeenCalledWith(
        expect.objectContaining({
          particleCount: expect.any(Number),
          spread: expect.any(Number),
        }),
      )
    })
  })
})
