import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import AppFaqSection, { type FaqItem } from '@/components/AppFaqSection'

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    if (key === 'heading') return 'Frequently Asked Questions'
    return key
  },
}))

describe('AppFaqSection', () => {
  it('returns null when faqs is undefined', () => {
    const { container } = render(<AppFaqSection />)
    expect(container.firstChild).toBeNull()
  })

  it('returns null when faqs is empty array', () => {
    const { container } = render(<AppFaqSection faqs={[]} />)
    expect(container.firstChild).toBeNull()
  })

  it('returns null when faqs is null or non-array', () => {
    const { container } = render(
      <AppFaqSection faqs={null as unknown as FaqItem[]} />
    )
    expect(container.firstChild).toBeNull()
  })

  it('returns null when faqs contains only invalid/empty items', () => {
    const { container } = render(
      <AppFaqSection
        faqs={[
          { question: '', answer: '' },
          null as unknown as FaqItem,
          { question: '   ', answer: 'Valid answer' },
        ]}
      />
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders FAQs and toggles open/close on button click', () => {
    const testFaqs: FaqItem[] = [
      { question: 'What is ToolNotch?', answer: 'ToolNotch is a collection of online utilities.' },
      { question: 'Is it free?', answer: 'Yes, 100% free to use.' },
    ]

    render(<AppFaqSection faqs={testFaqs} />)

    expect(screen.getByText('Frequently Asked Questions')).toBeInTheDocument()
    expect(screen.getByText('What is ToolNotch?')).toBeInTheDocument()
    expect(screen.getByText('Is it free?')).toBeInTheDocument()

    const firstButton = screen.getByRole('button', { name: /What is ToolNotch\?/i })
    expect(firstButton).toHaveAttribute('aria-expanded', 'false')

    // Click to open
    fireEvent.click(firstButton)
    expect(firstButton).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText('ToolNotch is a collection of online utilities.')).toBeInTheDocument()

    // Click again to close
    fireEvent.click(firstButton)
    expect(firstButton).toHaveAttribute('aria-expanded', 'false')
  })
})
