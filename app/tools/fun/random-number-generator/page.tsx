import type { Metadata } from 'next'
import ToolWrapper from '@/components/ToolWrapper'
import NumberGenerator from '@/components/fun/NumberGenerator'

export const metadata: Metadata = {
  title: 'Random Number Generator — Generate Numbers Between Any Range | ToolNotch',
  description: 'Free random number generator. Generate one or multiple random numbers between any range. Supports unique numbers, sorting, and batch generation up to 1000.',
}

const faqs = [
  { question: 'How random are the numbers?', answer: 'Numbers are generated using JavaScript\'s Math.random() which produces a uniformly distributed result. For cryptographically secure numbers, use a dedicated tool.' },
  { question: 'Can I generate multiple numbers at once?', answer: 'Yes — set Count to any number between 1 and 1000 to generate multiple results at once.' },
  { question: 'What does "unique numbers" mean?', answer: 'When "allow duplicates" is unchecked, each number appears at most once in the results. Useful for lottery draws or random sampling.' },
  { question: 'What is the maximum range?', answer: 'The tool supports any integer range. For very large ranges, performance remains instant due to JavaScript\'s fast random number generation.' },
]

export default function RandomNumberGeneratorPage() {
  return (
    <ToolWrapper
      title="Random Number Generator"
      description="Generate random numbers between any range. Supports batch generation and unique numbers."
      breadcrumbLabel="Random Number Generator"
      faqs={faqs}
      adSlot="1234567890"
    >
      <NumberGenerator />
    </ToolWrapper>
  )
}
