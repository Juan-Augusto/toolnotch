/**
 * Integration tests for ConversionWidget
 *
 * Mocks:
 *  - next-intl's useTranslations (returns the translation key as a plain string)
 *  - QuickReferenceTable (renders nothing — not under test here)
 *  - global.fetch (not needed by this widget, but prevents accidental network calls)
 */

import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// ---------------------------------------------------------------------------
// Module mocks — must be declared before the component import
// ---------------------------------------------------------------------------

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

jest.mock('@/components/converter/QuickReferenceTable', () => {
  const QuickReferenceTableMock = () => null
  QuickReferenceTableMock.displayName = 'QuickReferenceTableMock'
  return QuickReferenceTableMock
})

// ---------------------------------------------------------------------------
// Component under test
// ---------------------------------------------------------------------------

import ConversionWidget from '@/components/converter/ConversionWidget'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

beforeEach(() => {
  global.fetch = jest.fn()
})

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('ConversionWidget', () => {
  describe('initial render', () => {
    it('renders the From and To labels', () => {
      render(<ConversionWidget category="length" />)
      // Labels come from the translation mock which returns the key string
      expect(screen.getByText('from')).toBeInTheDocument()
      expect(screen.getByText('to')).toBeInTheDocument()
    })

    it('renders with the numeric input pre-filled with "1"', () => {
      render(<ConversionWidget category="length" />)
      const input = screen.getByRole('spinbutton')
      expect(input).toHaveValue(1)
    })

    it('renders two <select> dropdowns for from/to units', () => {
      render(<ConversionWidget category="length" />)
      const selects = screen.getAllByRole('combobox')
      expect(selects).toHaveLength(2)
    })

    it('respects defaultFrom and defaultTo props', () => {
      render(<ConversionWidget category="length" defaultFrom="kilometer" defaultTo="mile" />)
      const selects = screen.getAllByRole<HTMLSelectElement>('combobox')
      expect(selects[0].value).toBe('kilometer')
      expect(selects[1].value).toBe('mile')
    })

    it('shows a non-empty initial result for a valid category', () => {
      render(<ConversionWidget category="length" defaultFrom="meter" defaultTo="foot" />)
      // The result div shows the formatted conversion; should not be '—'
      expect(screen.queryByText('—')).not.toBeInTheDocument()
    })

    it('renders the swap button', () => {
      render(<ConversionWidget category="length" />)
      const swapBtn = screen.getByTitle('swap')
      expect(swapBtn).toBeInTheDocument()
    })
  })

  describe('changing the input value', () => {
    it('updates the displayed result when the user types a new number', async () => {
      const user = userEvent.setup()
      render(<ConversionWidget category="length" defaultFrom="meter" defaultTo="foot" />)

      const input = screen.getByRole('spinbutton')
      // 1 meter → ~3.28084 feet (initial state)
      const initialResult = screen.getAllByText(/\d/)[0].textContent

      await user.clear(input)
      await user.type(input, '2')

      // After typing "2", the result div should show a different (larger) value
      const updatedResult = screen.getAllByText(/\d/)[0].textContent
      // The result text somewhere on the page should have changed
      const resultDiv = input
        .closest('.space-y-4')!
        .querySelector('.bg-blue-50')!
      expect(resultDiv.textContent).not.toBe(initialResult)
    })

    it('shows "—" in the result area when the input is cleared', async () => {
      const user = userEvent.setup()
      render(<ConversionWidget category="length" defaultFrom="meter" defaultTo="foot" />)

      const input = screen.getByRole('spinbutton')
      await user.clear(input)

      // The result div placeholder text when no valid number is present
      expect(screen.getByText('—')).toBeInTheDocument()
    })

    it('fireEvent: direct change event updates the output', () => {
      render(<ConversionWidget category="weight" defaultFrom="kilogram" defaultTo="pound" />)
      const input = screen.getByRole('spinbutton')

      fireEvent.change(input, { target: { value: '10' } })

      // 10 kg ≈ 22.046 lb — the result div should contain a non-dash value
      expect(screen.queryByText('—')).not.toBeInTheDocument()
    })
  })

  describe('swap button', () => {
    it('swaps the from and to selects when clicked', () => {
      render(<ConversionWidget category="length" defaultFrom="meter" defaultTo="foot" />)
      const selects = screen.getAllByRole<HTMLSelectElement>('combobox')
      const fromBefore = selects[0].value
      const toBefore = selects[1].value

      const swapBtn = screen.getByTitle('swap')
      fireEvent.click(swapBtn)

      const selectsAfter = screen.getAllByRole<HTMLSelectElement>('combobox')
      expect(selectsAfter[0].value).toBe(toBefore)
      expect(selectsAfter[1].value).toBe(fromBefore)
    })

    it('places the current result into the input after swap', () => {
      render(<ConversionWidget category="length" defaultFrom="meter" defaultTo="foot" />)

      // Get the result before swapping
      const resultDiv = document
        .querySelector('.bg-blue-50')!
      const resultBeforeSwap = resultDiv.textContent

      const swapBtn = screen.getByTitle('swap')
      fireEvent.click(swapBtn)

      const input = screen.getByRole('spinbutton') as HTMLInputElement
      expect(input.value).toBe(resultBeforeSwap)
    })
  })

  describe('temperature category', () => {
    it('renders temperature unit options', () => {
      render(<ConversionWidget category="temperature" />)
      const selects = screen.getAllByRole<HTMLSelectElement>('combobox')
      // The first select should have celsius as an option
      const options = Array.from(selects[0].options).map(o => o.value)
      expect(options).toContain('celsius')
      expect(options).toContain('fahrenheit')
      expect(options).toContain('kelvin')
    })

    it('converts 100 celsius to 212 fahrenheit', () => {
      render(
        <ConversionWidget
          category="temperature"
          defaultFrom="celsius"
          defaultTo="fahrenheit"
        />
      )

      const input = screen.getByRole('spinbutton')
      fireEvent.change(input, { target: { value: '100' } })

      const resultDiv = document.querySelector('.bg-blue-50')!
      expect(resultDiv.textContent).toBe('212')
    })
  })

  describe('changing unit selectors', () => {
    it('updates the result when the "from" unit is changed', () => {
      render(<ConversionWidget category="length" defaultFrom="meter" defaultTo="foot" />)

      const selects = screen.getAllByRole('combobox')
      const resultBefore = document.querySelector('.bg-blue-50')!.textContent

      fireEvent.change(selects[0], { target: { value: 'kilometer' } })

      const resultAfter = document.querySelector('.bg-blue-50')!.textContent
      expect(resultAfter).not.toBe(resultBefore)
    })

    it('updates the result when the "to" unit is changed', () => {
      render(<ConversionWidget category="length" defaultFrom="meter" defaultTo="foot" />)

      const selects = screen.getAllByRole('combobox')
      const resultBefore = document.querySelector('.bg-blue-50')!.textContent

      fireEvent.change(selects[1], { target: { value: 'inch' } })

      const resultAfter = document.querySelector('.bg-blue-50')!.textContent
      expect(resultAfter).not.toBe(resultBefore)
    })
  })
})
