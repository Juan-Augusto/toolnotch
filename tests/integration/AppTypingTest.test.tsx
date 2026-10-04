import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import AppTypingTest from '@/components/fun/AppTypingTest'

describe('AppTypingTest Component', () => {
  test('renders in Portuguese when locale="pt" with w-full width', () => {
    const { container } = render(<AppTypingTest locale="pt" />)

    // Verify Portuguese labels
    expect(screen.getByText(/tempo:/i)).toBeInTheDocument()
    expect(screen.getByText(/tentar novamente/i)).toBeInTheDocument()
    expect(screen.getByText(/outro texto/i)).toBeInTheDocument()

    // Verify container class w-full
    const rootDiv = container.firstChild as HTMLElement
    expect(rootDiv).toHaveClass('w-full')
  })

  test('renders in English when locale="en"', () => {
    const { container } = render(<AppTypingTest locale="en" />)

    expect(screen.getByText(/time:/i)).toBeInTheDocument()
    expect(screen.getByText(/try again/i)).toBeInTheDocument()
    expect(screen.getByText(/next passage/i)).toBeInTheDocument()

    const rootDiv = container.firstChild as HTMLElement
    expect(rootDiv).toHaveClass('w-full')
  })
})
