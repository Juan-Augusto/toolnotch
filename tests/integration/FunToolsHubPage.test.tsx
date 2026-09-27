import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import FunToolsHubPage, { generateMetadata } from '@/app/[locale]/tools/fun/page'

describe('FunToolsHubPage (/tools/fun)', () => {
  test('renders all 11 fun and random tools in Portuguese', async () => {
    const page = await FunToolsHubPage({
      params: Promise.resolve({ locale: 'pt' }),
    })
    render(page)

    // Heading
    expect(
      screen.getByRole('heading', { level: 1, name: /ferramentas de diversão e sorteios online/i })
    ).toBeInTheDocument()

    // Breadcrumb
    expect(screen.getByText('Diversão & Aleatório')).toBeInTheDocument()

    // All 11 tools present
    expect(screen.getByRole('heading', { level: 3, name: /girar a roleta/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: /wheel of names/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: /roleta sim ou não/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: /cara ou coroa/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: /rolador de dados/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: /sorteador de nomes/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: /sorteador escolar/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: /sorteador de prêmios/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: /gerador de números/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: /gerador de equipes/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: /teste de digitação/i })).toBeInTheDocument()

    // FAQs
    expect(
      screen.getByText(/as ferramentas de sorteio e diversão são realmente gratuitas\?/i)
    ).toBeInTheDocument()
  })

  test('renders in English when locale is en', async () => {
    const page = await FunToolsHubPage({
      params: Promise.resolve({ locale: 'en' }),
    })
    render(page)

    expect(
      screen.getByRole('heading', { level: 1, name: /free fun & random decision tools/i })
    ).toBeInTheDocument()

    expect(screen.getByRole('heading', { level: 3, name: /spin the wheel/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: /coin flip/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: /dice roller/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: /typing speed test/i })).toBeInTheDocument()
  })

  test('generates localized metadata correctly', async () => {
    const metaPt = await generateMetadata({
      params: Promise.resolve({ locale: 'pt' }),
    })
    expect(metaPt.title).toContain('Ferramentas de Diversão e Sorteios')

    const metaEn = await generateMetadata({
      params: Promise.resolve({ locale: 'en' }),
    })
    expect(metaEn.title).toContain('Free Fun & Random Tools')
  })
})
