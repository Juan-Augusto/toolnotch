import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import AppNumberGenerator from '@/components/fun/AppNumberGenerator'

describe('AppNumberGenerator Component', () => {
  test('renders in Portuguese when locale="pt"', () => {
    render(<AppNumberGenerator locale="pt" />)

    expect(screen.getByText('Mínimo')).toBeInTheDocument()
    expect(screen.getByText('Máximo')).toBeInTheDocument()
    expect(screen.getByText('Quantidade')).toBeInTheDocument()
    expect(screen.getByText('Permitir duplicados')).toBeInTheDocument()
    expect(screen.getByText('Ordenar resultados')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /gerar números/i })).toBeInTheDocument()
  })

  test('renders in Spanish when locale="es"', () => {
    render(<AppNumberGenerator locale="es" />)

    expect(screen.getByText('Mínimo')).toBeInTheDocument()
    expect(screen.getByText('Máximo')).toBeInTheDocument()
    expect(screen.getByText('Cantidad')).toBeInTheDocument()
    expect(screen.getByText('Permitir duplicados')).toBeInTheDocument()
    expect(screen.getByText('Ordenar resultados')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /generar números/i })).toBeInTheDocument()
  })

  test('renders in English when locale="en"', () => {
    render(<AppNumberGenerator locale="en" />)

    expect(screen.getByText('Min')).toBeInTheDocument()
    expect(screen.getByText('Max')).toBeInTheDocument()
    expect(screen.getByText('Count')).toBeInTheDocument()
    expect(screen.getByText('Allow duplicates')).toBeInTheDocument()
    expect(screen.getByText('Sort results')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /generate/i })).toBeInTheDocument()
  })

  test('validates min < max and displays localized error in Portuguese', () => {
    render(<AppNumberGenerator locale="pt" />)

    // Set min to 100 and max to 10
    const inputs = screen.getAllByRole('spinbutton')
    const minInput = inputs[0]
    const maxInput = inputs[1]

    fireEvent.change(minInput, { target: { value: '100' } })
    fireEvent.change(maxInput, { target: { value: '10' } })

    const generateBtn = screen.getByRole('button', { name: /gerar números/i })
    fireEvent.click(generateBtn)

    expect(screen.getByText(/o valor mínimo deve ser menor que o máximo/i)).toBeInTheDocument()
  })

  test('generates numbers successfully and displays count and copy button in Portuguese', () => {
    render(<AppNumberGenerator locale="pt" />)

    const generateBtn = screen.getByRole('button', { name: /gerar números/i })
    fireEvent.click(generateBtn)

    expect(screen.getByText(/1 número gerado/i)).toBeInTheDocument()
    expect(screen.getByText(/copiar todos/i)).toBeInTheDocument()
  })
})
