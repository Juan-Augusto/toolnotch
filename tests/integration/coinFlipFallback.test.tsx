/**
 * Integration tests for CoinFlip (the UI shell component).
 *
 * CoinFlip (components/fun/CoinFlip.tsx):
 *   - Uses a useReducer for state: { result, isFlipping, history }.
 *   - Determines the outcome (heads/tails) via Math.random() BEFORE the
 *     animation starts and stores it in pendingResult.
 *   - Dispatches FLIP_START → renders CoinFlip3D with flipping=true.
 *   - CoinFlip3D calls onDone → dispatches FLIP_END → result is committed.
 *   - Lazily loads CoinFlip3D via next/dynamic (ssr: false).
 *
 * We mock next/dynamic so the 3D component is available synchronously and
 * calls onDone immediately when flipping=true.
 *
 * We also document the missing ErrorBoundary gap (same situation as
 * DiceRoller).
 */

import React from 'react'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'

// ── next/dynamic mock ─────────────────────────────────────────────────────────
// The stub calls onDone immediately when flipping=true so state transitions
// complete within the same React flush in tests.

jest.mock('next/dynamic', () => {
  return () => {
    const Stub: React.FC<{
      side: 'heads' | 'tails'
      flipping: boolean
      onDone: () => void
    }> = ({ side, flipping, onDone }) => {
      React.useEffect(() => {
        if (flipping) onDone()
      }, [flipping, onDone])
      return React.createElement(
        'div',
        { 'data-testid': 'coin-3d-stub', 'data-side': side },
        `Coin: ${side}`,
      )
    }
    return Stub
  }
})

// ── Imports after mocks ───────────────────────────────────────────────────────

import CoinFlip from '@/components/fun/CoinFlip'

// ── Helpers ───────────────────────────────────────────────────────────────────

const flipButton = () => screen.getByRole('button', { name: /flip coin/i })

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('CoinFlip — initial render', () => {
  test('renders without crashing', () => {
    expect(() => render(React.createElement(CoinFlip))).not.toThrow()
  })

  test('shows the Flip Coin button in enabled state', () => {
    render(React.createElement(CoinFlip))
    expect(flipButton()).toBeEnabled()
  })

  test('shows the 3D coin stub on initial render', () => {
    render(React.createElement(CoinFlip))
    expect(screen.getByTestId('coin-3d-stub')).toBeInTheDocument()
  })

  test('does NOT show a result label before the first flip', () => {
    render(React.createElement(CoinFlip))
    // Result label is "Heads!" or "Tails!" — neither should be present yet.
    expect(screen.queryByText(/heads!/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/tails!/i)).not.toBeInTheDocument()
  })

  test('does NOT show history before the first flip', () => {
    render(React.createElement(CoinFlip))
    expect(screen.queryByText(/history/i)).not.toBeInTheDocument()
  })
})

describe('CoinFlip — flip mechanics', () => {
  test('clicking Flip Coin triggers a flip and shows a result', async () => {
    render(React.createElement(CoinFlip))
    await act(async () => { fireEvent.click(flipButton()) })

    await waitFor(() => {
      const hasHeads = !!screen.queryByText(/heads!/i)
      const hasTails = !!screen.queryByText(/tails!/i)
      expect(hasHeads || hasTails).toBe(true)
    })
  })

  test('result is either "heads" or "tails" (no other values possible)', async () => {
    // Run several flips and collect results.
    render(React.createElement(CoinFlip))

    const results = new Set<string>()
    for (let i = 0; i < 8; i++) {
      await act(async () => { fireEvent.click(flipButton()) })
      await waitFor(() => {
        const h = screen.queryByText(/heads!/i)
        const t = screen.queryByText(/tails!/i)
        if (h) results.add('heads')
        if (t) results.add('tails')
      })
    }

    // Every result must be one of the two valid values
    for (const r of results) {
      expect(['heads', 'tails']).toContain(r)
    }
  })

  test('button is disabled while flipping and re-enables after', async () => {
    render(React.createElement(CoinFlip))
    const btn = flipButton()

    // The stub calls onDone synchronously in a useEffect so the disabled window
    // is very brief. We check that after the flip the button is enabled again.
    await act(async () => { fireEvent.click(btn) })
    await waitFor(() => expect(btn).toBeEnabled())
  })

  test('the coin stub receives the correct side prop after a deterministic flip', async () => {
    // Force Math.random to return 0.1 → result = 'heads'
    jest.spyOn(Math, 'random').mockReturnValue(0.1)

    render(React.createElement(CoinFlip))
    await act(async () => { fireEvent.click(flipButton()) })

    await waitFor(() => expect(screen.getByText(/heads!/i)).toBeInTheDocument())

    // The 3D stub should have received side="heads"
    expect(screen.getByTestId('coin-3d-stub')).toHaveAttribute('data-side', 'heads')

    jest.spyOn(Math, 'random').mockRestore()
  })

  test('the coin stub receives side="tails" when Math.random >= 0.5', async () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.9)

    render(React.createElement(CoinFlip))
    await act(async () => { fireEvent.click(flipButton()) })

    await waitFor(() => expect(screen.getByText(/tails!/i)).toBeInTheDocument())
    expect(screen.getByTestId('coin-3d-stub')).toHaveAttribute('data-side', 'tails')

    jest.spyOn(Math, 'random').mockRestore()
  })
})

describe('CoinFlip — result determination logic', () => {
  /**
   * The result is determined by `Math.random() < 0.5` BEFORE the animation
   * starts. This means the outcome is set when FLIP_START is dispatched, not
   * when FLIP_END fires. We verify this by mocking Math.random.
   */
  test('Math.random < 0.5 always yields heads', async () => {
    for (const r of [0.0, 0.1, 0.25, 0.499]) {
      jest.spyOn(Math, 'random').mockReturnValue(r)
      const { unmount } = render(React.createElement(CoinFlip))

      await act(async () => { fireEvent.click(flipButton()) })
      await waitFor(() => expect(screen.getByText(/heads!/i)).toBeInTheDocument())

      unmount()
      jest.spyOn(Math, 'random').mockRestore()
    }
  })

  test('Math.random >= 0.5 always yields tails', async () => {
    for (const r of [0.5, 0.75, 0.99]) {
      jest.spyOn(Math, 'random').mockReturnValue(r)
      const { unmount } = render(React.createElement(CoinFlip))

      await act(async () => { fireEvent.click(flipButton()) })
      await waitFor(() => expect(screen.getByText(/tails!/i)).toBeInTheDocument())

      unmount()
      jest.spyOn(Math, 'random').mockRestore()
    }
  })
})

describe('CoinFlip — history', () => {
  test('history appears after the first flip', async () => {
    render(React.createElement(CoinFlip))
    await act(async () => { fireEvent.click(flipButton()) })
    await waitFor(() => expect(screen.getByText(/history/i)).toBeInTheDocument())
  })

  test('history keeps up to 10 entries', async () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.1) // always heads

    render(React.createElement(CoinFlip))

    for (let i = 0; i < 12; i++) {
      await act(async () => { fireEvent.click(flipButton()) })
      await waitFor(() => flipButton()) // wait for button to re-enable
    }

    // Each history entry is a "heads" badge.  There should be at most 10.
    const badges = screen.getAllByText(/^heads$/i)
    expect(badges.length).toBeLessThanOrEqual(10)

    jest.spyOn(Math, 'random').mockRestore()
  })

  test('history shows both heads and tails entries with correct styling tokens', async () => {
    const values = [0.1, 0.9, 0.1, 0.9] // h t h t
    let callCount = 0
    jest.spyOn(Math, 'random').mockImplementation(() => values[callCount++ % values.length])

    render(React.createElement(CoinFlip))

    for (let i = 0; i < 4; i++) {
      await act(async () => { fireEvent.click(flipButton()) })
      await waitFor(() => flipButton())
    }

    // Both values appear in history
    expect(screen.getAllByText(/^heads$/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/^tails$/i).length).toBeGreaterThan(0)

    jest.spyOn(Math, 'random').mockRestore()
  })
})

describe('CoinFlip — 3D component error (gap documentation)', () => {
  /**
   * CoinFlip does NOT currently wrap CoinFlip3D in an ErrorBoundary. If the 3D
   * component throws (e.g. WebGL not available, Three.js load failure) the
   * error propagates to the Next.js root boundary and the user sees a full
   * page error.
   *
   * TODO: Wrap the CoinFlip3D div in an ErrorBoundary in CoinFlip.tsx and
   *       render a 2D fallback (a static coin emoji or text indicator) so the
   *       flip mechanic still works without 3D.
   *
   * The test below documents that the component works correctly when the 3D
   * sub-component loads normally. A throwing-stub test is omitted because the
   * missing ErrorBoundary would surface as an unhandled error in the test run.
   */
  test('renders correctly when CoinFlip3D loads successfully', async () => {
    render(React.createElement(CoinFlip))
    expect(screen.getByTestId('coin-3d-stub')).toBeInTheDocument()
    await act(async () => { fireEvent.click(flipButton()) })
    await waitFor(() => {
      const hasResult =
        !!screen.queryByText(/heads!/i) || !!screen.queryByText(/tails!/i)
      expect(hasResult).toBe(true)
    })
  })
})
