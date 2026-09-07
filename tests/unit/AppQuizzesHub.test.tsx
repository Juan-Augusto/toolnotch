import React from 'react';
import { render, screen } from '@testing-library/react';
import AppQuizzesHub, { type QuizCardData } from '@/components/quiz/AppQuizzesHub';

const mockQuizzes: QuizCardData[] = [
  {
    id: 'fifa-world-cup-winners',
    title: 'FIFA World Cup Winners',
    description: 'Test your knowledge about World Cup champions.',
    category: 'sports',
    questionCount: 10,
  },
  {
    id: 'what-is-your-love-language',
    title: 'What Is Your Love Language?',
    description: 'Discover how you express and receive love.',
    category: 'personality',
    questionCount: 8,
  },
  {
    id: 'nodejs-fundamentals',
    title: 'Node.js Fundamentals',
    description: 'Test your backend JavaScript core knowledge.',
    category: 'backend',
    questionCount: 12,
  },
];

describe('AppQuizzesHub', () => {
  it('renders sidebar menu and all categories', () => {
    render(<AppQuizzesHub quizzes={mockQuizzes} locale="pt" />);

    expect(screen.getByText('TODOS OS QUIZZES')).toBeInTheDocument();
    expect(screen.getAllByText('ESPORTES').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('PERSONALIDADE').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('BACKEND').length).toBeGreaterThanOrEqual(1);
  });

  it('renders quiz cards with links and descriptions', () => {
    render(<AppQuizzesHub quizzes={mockQuizzes} locale="pt" />);

    expect(
      screen.getAllByText('FIFA World Cup Winners').length
    ).toBeGreaterThanOrEqual(1);
    expect(
      screen.getByText('Test your knowledge about World Cup champions.')
    ).toBeInTheDocument();

    const quizLinks = screen.getAllByRole('link', {
      name: /FIFA World Cup Winners/i,
    });
    expect(
      quizLinks.some((link) =>
        link.getAttribute('href')?.includes('/quiz/fifa-world-cup-winners')
      )
    ).toBe(true);
  });

  it('renders English headings and category names when locale is en', () => {
    render(<AppQuizzesHub quizzes={mockQuizzes} locale="en" />);

    expect(screen.getByText('ALL QUIZZES')).toBeInTheDocument();
    expect(screen.getAllByText('SPORTS').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('PERSONALITY').length).toBeGreaterThanOrEqual(1);
  });
});
