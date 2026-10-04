import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'

const mockReplace = jest.fn()
const mockPathname = '/en/tools/fun/spin-the-wheel'

jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}))

jest.mock('@/components/fun/AppSpinWheel', () => {
  const MockSpinWheel = ({ items, onResult }: { items: string[]; onResult: (s: string) => void }) => (
    <div data-testid="spin-wheel">
      <span data-testid="item-count">{items.length}</span>
      <button data-testid="trigger-result" onClick={() => onResult(items[0] ?? '')}>
        trigger result
      </button>
    </div>
  )
  MockSpinWheel.displayName = 'MockSpinWheel'
  return {
    __esModule: true,
    default: MockSpinWheel,
    getWheelItemColor: () => '#2563EB',
    SPIN_WHEEL_COLORS: ['#2563EB', '#10B981'],
  }
})

import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import SpinWheelClient from '@/app/[locale]/tools/fun/spin-the-wheel/SpinWheelClient'

function buildSearchParams(query: Record<string, string> = {}): URLSearchParams {
  return new URLSearchParams(query)
}

function setupNavMocks(itemsParam?: string) {
  const params = buildSearchParams(itemsParam ? { items: itemsParam } : {})
  ;(useSearchParams as jest.Mock).mockReturnValue(params)
  ;(useRouter as jest.Mock).mockReturnValue({ replace: mockReplace })
  ;(usePathname as jest.Mock).mockReturnValue(mockPathname)
}

beforeEach(() => {
  jest.clearAllMocks()
})

describe('SpinWheelClient — List (1 by 1) mode', () => {
  test('allows toggling between text mode and list mode', () => {
    setupNavMocks()
    render(<SpinWheelClient />)

    // Initially in text mode: textarea is present
    expect(screen.getByRole('textbox')).toBeInstanceOf(HTMLTextAreaElement)

    // Toggle to list mode
    const listModeBtn = screen.getByRole('radio', { name: /list \(1 by 1\)/i })
    fireEvent.click(listModeBtn)

    // In list mode: input is present
    expect(screen.getByRole('textbox')).toBeInstanceOf(HTMLInputElement)
    // All 6 default items rendered
    expect(screen.getByText('Option 1')).toBeInTheDocument()
    expect(screen.getByText('Option 6')).toBeInTheDocument()
  })

  test('adds a new item 1 by 1 and updates URL', async () => {
    setupNavMocks()
    render(<SpinWheelClient />)

    // Switch to list mode
    fireEvent.click(screen.getByRole('radio', { name: /list \(1 by 1\)/i }))

    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'Lucky Prize' } })

    const addBtn = screen.getByRole('button', { name: /add/i })
    fireEvent.click(addBtn)

    expect(screen.getByText('Lucky Prize')).toBeInTheDocument()
    expect(screen.getByTestId('item-count').textContent).toBe('7')

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalled()
    })
    const lastCall = mockReplace.mock.calls[mockReplace.mock.calls.length - 1][0]
    expect(lastCall).toContain(encodeURIComponent('Lucky Prize'))
  })

  test('removes an item from list mode and updates URL', async () => {
    setupNavMocks()
    render(<SpinWheelClient />)

    // Switch to list mode
    fireEvent.click(screen.getByRole('radio', { name: /list \(1 by 1\)/i }))

    expect(screen.getByText('Option 1')).toBeInTheDocument()
    const removeBtn = screen.getByRole('button', { name: /remove option 1/i })
    fireEvent.click(removeBtn)

    expect(screen.queryByText('Option 1')).not.toBeInTheDocument()
    expect(screen.getByTestId('item-count').textContent).toBe('5')

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalled()
    })
  })

  test('clears and resets options in list mode', async () => {
    setupNavMocks()
    render(<SpinWheelClient />)

    // Switch to list mode
    fireEvent.click(screen.getByRole('radio', { name: /list \(1 by 1\)/i }))

    // Click clear
    const clearBtn = screen.getByRole('button', { name: /clear/i })
    fireEvent.click(clearBtn)
    expect(screen.getByTestId('item-count').textContent).toBe('0')

    // Click default / reset
    const defaultBtn = screen.getByRole('button', { name: /default/i })
    fireEvent.click(defaultBtn)
    expect(screen.getByTestId('item-count').textContent).toBe('6')
  })
})
