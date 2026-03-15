// SpinWheelClient reads items from the `?items=` URL search param via
// next/navigation's useSearchParams, and pushes updates back to the URL via
// router.replace whenever the textarea changes.
//
// Strategy:
//   - Mock next/navigation (useSearchParams, useRouter, usePathname)
//   - Mock SpinWheel (canvas / requestAnimationFrame not available in jsdom)
//   - Render SpinWheelClient and assert URL-state behaviour

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

const mockReplace = jest.fn()
const mockPathname = '/en/tools/fun/spin-the-wheel'

// next/navigation mock — must be declared before importing the component
jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}))

// SpinWheel uses canvas APIs and requestAnimationFrame which don't exist in
// jsdom, so we replace it with a lightweight stub.
jest.mock('@/components/fun/SpinWheel', () => {
  const MockSpinWheel = ({ items, onResult }: { items: string[]; onResult: (s: string) => void }) => (
    <div data-testid="spin-wheel">
      <span data-testid="item-count">{items.length}</span>
      <button data-testid="trigger-result" onClick={() => onResult(items[0] ?? '')}>
        trigger result
      </button>
    </div>
  )
  MockSpinWheel.displayName = 'MockSpinWheel'
  return MockSpinWheel
})

import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import SpinWheelClient from '@/app/[locale]/tools/fun/spin-the-wheel/SpinWheelClient'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function buildSearchParams(query: Record<string, string> = {}): URLSearchParams {
  return new URLSearchParams(query)
}

function setupNavMocks(itemsParam?: string) {
  const params = buildSearchParams(itemsParam ? { items: itemsParam } : {})
  ;(useSearchParams as jest.Mock).mockReturnValue(params)
  ;(useRouter as jest.Mock).mockReturnValue({ replace: mockReplace })
  ;(usePathname as jest.Mock).mockReturnValue(mockPathname)
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

beforeEach(() => {
  jest.clearAllMocks()
})

describe('SpinWheelClient — URL state initialisation', () => {
  test('renders default items when no ?items param is present', () => {
    setupNavMocks()
    render(<SpinWheelClient />)

    // Default list has 6 items
    expect(screen.getByTestId('item-count').textContent).toBe('6')
  })

  test('reads comma-separated items from ?items URL param', () => {
    const encoded = encodeURIComponent('Red,Green,Blue')
    setupNavMocks(encoded)
    render(<SpinWheelClient />)

    expect(screen.getByTestId('item-count').textContent).toBe('3')
  })

  test('textarea is pre-populated with items from URL param (one per line)', () => {
    const encoded = encodeURIComponent('Alpha,Beta,Gamma')
    setupNavMocks(encoded)
    render(<SpinWheelClient />)

    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement
    // Each comma-separated value becomes a separate line
    expect(textarea.value).toContain('Alpha')
    expect(textarea.value).toContain('Beta')
    expect(textarea.value).toContain('Gamma')
  })

  test('falls back to default items when ?items param is malformed / causes decodeURIComponent to throw', () => {
    // We use a bad percent-sequence that decodeURIComponent would reject.
    // However, because URLSearchParams decodes automatically, the fallback
    // is triggered when the raw string after get() causes our try/catch.
    // Simulate by returning a param value that decodeURIComponent would fail on.
    const params = {
      get: (key: string) => (key === 'items' ? '%ZZ' : null),
    } as unknown as URLSearchParams
    ;(useSearchParams as jest.Mock).mockReturnValue(params)
    ;(useRouter as jest.Mock).mockReturnValue({ replace: mockReplace })
    ;(usePathname as jest.Mock).mockReturnValue(mockPathname)

    render(<SpinWheelClient />)

    // Should fall back to the 6 default items
    expect(screen.getByTestId('item-count').textContent).toBe('6')
  })
})

describe('SpinWheelClient — URL sync on textarea change', () => {
  test('calls router.replace with encoded items when textarea changes', async () => {
    setupNavMocks()
    render(<SpinWheelClient />)

    const textarea = screen.getByRole('textbox')
    fireEvent.change(textarea, { target: { value: 'Dog\nCat\nBird' } })

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalled()
    })

    const lastCall = mockReplace.mock.calls[mockReplace.mock.calls.length - 1]
    const urlArg: string = lastCall[0]
    expect(urlArg).toMatch(/^\S+\?items=/)

    // The encoded items should represent our three choices
    const encoded = new URL(urlArg, 'http://localhost').searchParams.get('items')!
    const decoded = decodeURIComponent(encoded)
    expect(decoded).toContain('Dog')
    expect(decoded).toContain('Cat')
    expect(decoded).toContain('Bird')
  })

  test('calls router.replace with the correct pathname', async () => {
    setupNavMocks()
    render(<SpinWheelClient />)

    const textarea = screen.getByRole('textbox')
    fireEvent.change(textarea, { target: { value: 'X\nY' } })

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalled()
    })

    const urlArg: string = mockReplace.mock.calls[mockReplace.mock.calls.length - 1][0]
    expect(urlArg.startsWith(mockPathname)).toBe(true)
  })

  test('passes scroll:false option to router.replace', async () => {
    setupNavMocks()
    render(<SpinWheelClient />)

    const textarea = screen.getByRole('textbox')
    fireEvent.change(textarea, { target: { value: 'One\nTwo' } })

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalled()
    })

    const optionsArg = mockReplace.mock.calls[mockReplace.mock.calls.length - 1][1]
    expect(optionsArg).toMatchObject({ scroll: false })
  })
})

describe('SpinWheelClient — onResult callback and last winner display', () => {
  test('does not render last-result section initially', () => {
    setupNavMocks()
    render(<SpinWheelClient />)
    expect(screen.queryByText(/last result/i)).not.toBeInTheDocument()
  })

  test('displays the winning item after SpinWheel calls onResult', () => {
    const encoded = encodeURIComponent('Apple,Banana,Cherry')
    setupNavMocks(encoded)
    render(<SpinWheelClient />)

    // Our mock SpinWheel fires onResult(items[0]) when button is clicked
    fireEvent.click(screen.getByTestId('trigger-result'))

    expect(screen.getByText(/last result/i)).toBeInTheDocument()
    expect(screen.getByText('Apple')).toBeInTheDocument()
  })
})

describe('SpinWheelClient — item count display', () => {
  test('reports correct number of items from URL param', () => {
    const encoded = encodeURIComponent('A,B,C,D,E')
    setupNavMocks(encoded)
    render(<SpinWheelClient />)
    expect(screen.getByTestId('item-count').textContent).toBe('5')
  })

  test('blank lines in textarea are not counted as items', () => {
    setupNavMocks()
    render(<SpinWheelClient />)

    const textarea = screen.getByRole('textbox')
    // 3 real items surrounded by blank lines
    fireEvent.change(textarea, { target: { value: '\nFoo\n\nBar\n\nBaz\n' } })

    expect(screen.getByTestId('item-count').textContent).toBe('3')
  })
})
