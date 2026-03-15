import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import QuestionCard from '@/components/quiz/QuestionCard'
import { Question } from '@/lib/quizTypes'

// ─── Mock next-intl ──────────────────────────────────────────────────────────
// QuestionCard calls useTranslations('quiz') and renders t('question', { current, total })
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string, params?: Record<string, unknown>) => {
    if (key === 'question' && params) {
      return `Question ${params.current} of ${params.total}`
    }
    return key
  },
}))

// ─── Fixture ─────────────────────────────────────────────────────────────────

const QUESTION: Question = {
  id: 'q1',
  text: 'What motivates you most at work?',
  options: [
    { id: 'q1a', text: 'Creating something beautiful', scores: { creative: 3 } },
    { id: 'q1b', text: 'Solving logical problems', scores: { analytical: 3 } },
    { id: 'q1c', text: 'Leading a team', scores: { leadership: 3 } },
  ],
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('QuestionCard', () => {
  it('renders the question text', () => {
    render(
      <QuestionCard
        question={QUESTION}
        onAnswer={jest.fn()}
        questionNumber={1}
        total={5}
      />,
    )

    expect(screen.getByText('What motivates you most at work?')).toBeInTheDocument()
  })

  it('renders the question counter label via the translation', () => {
    render(
      <QuestionCard
        question={QUESTION}
        onAnswer={jest.fn()}
        questionNumber={3}
        total={10}
      />,
    )

    expect(screen.getByText('Question 3 of 10')).toBeInTheDocument()
  })

  it('renders all answer options as buttons', () => {
    render(
      <QuestionCard
        question={QUESTION}
        onAnswer={jest.fn()}
        questionNumber={1}
        total={5}
      />,
    )

    expect(screen.getByRole('button', { name: 'Creating something beautiful' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Solving logical problems' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Leading a team' })).toBeInTheDocument()
  })

  it('renders exactly as many option buttons as there are options', () => {
    render(
      <QuestionCard
        question={QUESTION}
        onAnswer={jest.fn()}
        questionNumber={1}
        total={5}
      />,
    )

    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(QUESTION.options.length)
  })

  it('calls onAnswer with the correct option id when an option is clicked', async () => {
    const user = userEvent.setup()
    const onAnswer = jest.fn()

    render(
      <QuestionCard
        question={QUESTION}
        onAnswer={onAnswer}
        questionNumber={1}
        total={5}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Solving logical problems' }))

    expect(onAnswer).toHaveBeenCalledTimes(1)
    expect(onAnswer).toHaveBeenCalledWith('q1b')
  })

  it('calls onAnswer with the right id regardless of which option is clicked', async () => {
    const user = userEvent.setup()
    const onAnswer = jest.fn()

    render(
      <QuestionCard
        question={QUESTION}
        onAnswer={onAnswer}
        questionNumber={1}
        total={5}
      />,
    )

    await user.click(screen.getByRole('button', { name: 'Leading a team' }))

    expect(onAnswer).toHaveBeenCalledWith('q1c')
  })

  it('applies selected styling to the currently selected option', () => {
    render(
      <QuestionCard
        question={QUESTION}
        selectedOption="q1a"
        onAnswer={jest.fn()}
        questionNumber={1}
        total={5}
      />,
    )

    const selectedButton = screen.getByRole('button', { name: 'Creating something beautiful' })
    // The selected variant uses the 'border-blue-500' Tailwind class
    expect(selectedButton.className).toContain('border-blue-500')
  })

  it('does not apply selected styling to unselected options', () => {
    render(
      <QuestionCard
        question={QUESTION}
        selectedOption="q1a"
        onAnswer={jest.fn()}
        questionNumber={1}
        total={5}
      />,
    )

    const unselectedButton = screen.getByRole('button', { name: 'Solving logical problems' })
    expect(unselectedButton.className).not.toContain('border-blue-500')
  })
})
