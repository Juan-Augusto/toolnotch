import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import SpinWheelClient from '@/app/[locale]/tools/fun/spin-the-wheel/SpinWheelClient'

const mockReplace = jest.fn()

jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}))

jest.mock('@/components/fun/AppSpinWheel', () => {
  const MockSpinWheel = ({
    items,
    spinButtonText,
  }: {
    items: string[]
    spinButtonText?: string
  }) => (
    <div data-testid="spin-wheel">
      <span data-testid="item-count">{items.length}</span>
      <button data-testid="spin-btn">{spinButtonText}</button>
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

describe('SpinWheelClient — i18n & Mode Localization', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams())
    ;(useRouter as jest.Mock).mockReturnValue({ replace: mockReplace })
  })

  test('renders Portuguese names and labels on /pt/tools/fun/wheel-of-names', () => {
    ;(usePathname as jest.Mock).mockReturnValue('/pt/tools/fun/wheel-of-names')

    render(<SpinWheelClient locale="pt" mode="names" />)

    expect(screen.getByRole('heading', { name: /nomes da roleta/i })).toBeInTheDocument()
    expect(screen.getByText(/6 nomes configurados/i)).toBeInTheDocument()

    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement
    expect(textarea.value).toContain('Ana')
    expect(textarea.value).toContain('Bruno')
    expect(textarea.value).toContain('Carlos')
    expect(textarea.placeholder).toContain('Digite um nome por linha')
    expect(screen.getByTestId('spin-btn').textContent).toBe('GIRAR ROLETA')
  })

  test('renders Portuguese options on /pt/tools/fun/spin-the-wheel', () => {
    ;(usePathname as jest.Mock).mockReturnValue('/pt/tools/fun/spin-the-wheel')

    render(<SpinWheelClient locale="pt" mode="options" />)

    expect(screen.getByRole('heading', { name: /opções da roleta/i })).toBeInTheDocument()
    expect(screen.getByText(/6 opções configuradas/i)).toBeInTheDocument()

    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement
    expect(textarea.value).toContain('Opção 1')
    expect(textarea.value).toContain('Opção 2')
    expect(textarea.placeholder).toBe('Digite uma opção por linha...')
  })

  test('renders Spanish names and labels on /es/tools/fun/wheel-of-names', () => {
    ;(usePathname as jest.Mock).mockReturnValue('/es/tools/fun/wheel-of-names')

    render(<SpinWheelClient locale="es" mode="names" />)

    expect(screen.getByRole('heading', { name: /nombres de la ruleta/i })).toBeInTheDocument()
    expect(screen.getByText(/6 nombres configurados/i)).toBeInTheDocument()

    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement
    expect(textarea.value).toContain('Alejandro')
    expect(textarea.value).toContain('Beatriz')
    expect(textarea.placeholder).toContain('Escribe un nombre por línea')
    expect(screen.getByTestId('spin-btn').textContent).toBe('GIRAR RULETA')
  })

  test('resets to localized names when "Padrão" is clicked on wheel-of-names', () => {
    ;(usePathname as jest.Mock).mockReturnValue('/pt/tools/fun/wheel-of-names')

    render(<SpinWheelClient locale="pt" mode="names" />)

    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement
    // Clear first
    const clearBtn = screen.getByRole('button', { name: /limpar/i })
    fireEvent.click(clearBtn)
    expect(textarea.value).toBe('')

    // Click Padrão
    const defaultBtn = screen.getByRole('button', { name: /padrão/i })
    fireEvent.click(defaultBtn)

    expect(textarea.value).toContain('Ana')
    expect(textarea.value).toContain('Fernanda')
  })
})
