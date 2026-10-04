import React from 'react'
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'

// Mock framer-motion useAnimate & motion
jest.mock('framer-motion', () => {
  const actual = jest.requireActual('framer-motion')
  return {
    ...actual,
    useAnimate: () => [{ current: null }, jest.fn().mockResolvedValue(undefined)],
  }
})

// Mock canvas-confetti
jest.mock('canvas-confetti', () => jest.fn())

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn().mockReturnValue('/pt/tools/fun/random-name-picker'),
}))

import AppNamePicker from '@/components/fun/AppNamePicker'

describe('AppNamePicker Component', () => {
  test('renders in Portuguese by default when locale="pt"', () => {
    render(<AppNamePicker locale="pt" />)

    expect(screen.getByText('Lista de Nomes')).toBeInTheDocument()
    expect(screen.getByText(/0 nomes configurados/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sortear nome/i })).toBeInTheDocument()
    expect(
      screen.getByText(/remover nomes sorteados \(sorteio sem repetição\)/i)
    ).toBeInTheDocument()
  })

  test('loads sample names and allows picking a winner', async () => {
    render(<AppNamePicker locale="pt" />)

    // Click sample names
    const sampleBtn = screen.getByRole('button', { name: /exemplo/i })
    fireEvent.click(sampleBtn)

    expect(screen.getByText(/6 nomes configurados/i)).toBeInTheDocument()

    // Click pick
    const pickBtn = screen.getByRole('button', { name: /sortear nome/i })
    await act(async () => {
      fireEvent.click(pickBtn)
    })

    // Winner badge should appear
    await waitFor(() => {
      expect(screen.getByText('Vencedor Sorteado!')).toBeInTheDocument()
    })
  })

  test('toggles to list mode (1 por 1), adds and removes names', () => {
    render(<AppNamePicker locale="pt" />)

    // Switch to list mode
    const listRadio = screen.getByRole('radio', { name: /lista \(1 por 1\)/i })
    fireEvent.click(listRadio)

    // Input is rendered
    const input = screen.getByPlaceholderText(/digite um nome.../i)
    fireEvent.change(input, { target: { value: 'Lucas' } })

    const addBtn = screen.getByRole('button', { name: /adicionar/i })
    fireEvent.click(addBtn)

    expect(screen.getByText('Lucas')).toBeInTheDocument()
    expect(screen.getByText(/1 nome configurado/i)).toBeInTheDocument()

    // Remove Lucas
    const removeBtn = screen.getByRole('button', { name: /remover lucas/i })
    fireEvent.click(removeBtn)

    expect(screen.queryByText('Lucas')).not.toBeInTheDocument()
    expect(screen.getByText(/0 nomes configurados/i)).toBeInTheDocument()
  })

  test('renders in English when locale is en', () => {
    render(<AppNamePicker locale="en" />)

    expect(screen.getByText('Name List')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /pick name/i })).toBeInTheDocument()
    expect(
      screen.getByText(/remove picked names \(pick without replacement\)/i)
    ).toBeInTheDocument()
  })
})
