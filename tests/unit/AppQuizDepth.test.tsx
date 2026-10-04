import React from 'react'
import { render, screen } from '@testing-library/react'

jest.mock('next-intl/server', () => ({
  getTranslations: jest.fn(),
}))

import AppQuizDepth, { type QuizDepthContent } from '@/components/quiz/AppQuizDepth'

const mockContent: QuizDepthContent = {
  metaTitle: 'Quiz Campeões',
  metaDescription: 'Meta description',
  introHeading: 'Sobre o Quiz dos Campeões',
  intro: [
    'A Copa do Mundo coroa um campeão a cada quatro anos.',
    'Este quiz percorre as edições históricas.',
  ],
  table: {
    heading: 'Todos os Campeões da Copa do Mundo (1930–2022)',
    note: 'pên. = pênaltis',
    cols: ['Ano', 'Sede', 'Campeão', 'Vice', 'Placar da final'],
    rows: [
      ['1930', 'Uruguai', 'Uruguai', 'Argentina', '4–2'],
      ['1958', 'Suécia', 'Brasil', 'Suécia', '5–2'],
      ['2022', 'Catar', 'Argentina', 'França', '3–3 (4–2 pên.)'],
    ],
  },
  faqHeading: 'Perguntas Frequentes da Copa',
  faqs: [
    {
      question: 'Quem mais venceu a Copa do Mundo da FIFA?',
      answer: 'O Brasil venceu cinco vezes.',
    },
  ],
  relatedHeading: 'Mais quizzes de futebol',
  related: [
    {
      label: 'Quiz da Champions League',
      href: '/pt/quiz/champions-league-trivia',
      desc: 'Teste seus conhecimentos',
    },
    {
      label: 'Quiz dos Campeões',
      href: '/pt/quiz/fifa-world-cup-winners',
      desc: 'Adivinhe os campeões',
    },
  ],
}

describe('AppQuizDepth', () => {
  it('renders intro heading and all intro paragraphs', () => {
    render(<AppQuizDepth content={mockContent} currentSlug="fifa-world-cup-winners" />)

    expect(screen.getByText('Sobre o Quiz dos Campeões')).toBeInTheDocument()
    expect(screen.getByText(/A Copa do Mundo coroa um campeão/i)).toBeInTheDocument()
    expect(screen.getByText(/Este quiz percorre as edições históricas/i)).toBeInTheDocument()
  })

  it('renders the data table with cols and rows', () => {
    render(<AppQuizDepth content={mockContent} currentSlug="fifa-world-cup-winners" />)

    expect(screen.getByText('Todos os Campeões da Copa do Mundo (1930–2022)')).toBeInTheDocument()
    expect(screen.getByText('Placar da final')).toBeInTheDocument()
    expect(screen.getByText('1930')).toBeInTheDocument()
    expect(screen.getByText('Brasil')).toBeInTheDocument()
    expect(screen.getByText('3–3 (4–2 pên.)')).toBeInTheDocument()
    expect(screen.getByText(/pên\. = pênaltis/i)).toBeInTheDocument()
  })

  it('renders FAQ section and accordion items', () => {
    render(<AppQuizDepth content={mockContent} currentSlug="fifa-world-cup-winners" />)

    expect(screen.getByText('Perguntas Frequentes da Copa')).toBeInTheDocument()
    expect(screen.getByText('Quem mais venceu a Copa do Mundo da FIFA?')).toBeInTheDocument()
    expect(screen.getByText('O Brasil venceu cinco vezes.')).toBeInTheDocument()
  })

  it('renders related quizzes and flags the current quiz as active', () => {
    render(<AppQuizDepth content={mockContent} currentSlug="fifa-world-cup-winners" />)

    expect(screen.getByText('Mais quizzes de futebol')).toBeInTheDocument()
    expect(screen.getByText('Quiz da Champions League')).toBeInTheDocument()

    const currentBadge = screen.getByText('ATUAL')
    expect(currentBadge).toBeInTheDocument()
  })

  it('renders properly when table is omitted', () => {
    const withoutTable: QuizDepthContent = {
      ...mockContent,
      table: undefined,
    }
    render(<AppQuizDepth content={withoutTable} currentSlug="other-quiz" />)

    expect(screen.getByText('Sobre o Quiz dos Campeões')).toBeInTheDocument()
    expect(screen.queryByText('Todos os Campeões da Copa do Mundo (1930–2022)')).not.toBeInTheDocument()
  })
})
