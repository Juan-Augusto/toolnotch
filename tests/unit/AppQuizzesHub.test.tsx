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

  it('renders sports category before personality category in chips and sections', () => {
    render(<AppQuizzesHub quizzes={mockQuizzes} locale="pt" />);

    const tabs = screen.getAllByRole('tab');
    const tabTexts = tabs.map((t) => t.textContent || '');
    const sportsTabIndex = tabTexts.findIndex((t) => t.includes('ESPORTES'));
    const personalityTabIndex = tabTexts.findIndex((t) => t.includes('PERSONALIDADE'));

    expect(sportsTabIndex).toBeGreaterThanOrEqual(0);
    expect(personalityTabIndex).toBeGreaterThanOrEqual(0);
    expect(sportsTabIndex).toBeLessThan(personalityTabIndex);
  });

  it('renders featured quiz when more than 3 quizzes are provided', () => {
    const extendedQuizzes: QuizCardData[] = [
      ...mockQuizzes,
      {
        id: 'formula-1-trivia',
        title: 'Formula 1 Trivia',
        description: 'Test your racing knowledge.',
        category: 'sports',
        questionCount: 15,
      },
    ];

    render(<AppQuizzesHub quizzes={extendedQuizzes} locale="pt" />);

    expect(screen.getByText('EM DESTAQUE')).toBeInTheDocument();
    expect(screen.getByText('COMEÇAR QUIZ')).toBeInTheDocument();
  });

  it('renders political profile quiz as featured quiz when present', () => {
    const extendedQuizzes: QuizCardData[] = [
      ...mockQuizzes,
      {
        id: 'what-is-your-political-profile',
        title: 'Qual é o seu perfil político?',
        description: 'Descubra onde você se posiciona.',
        category: 'personality',
        questionCount: 15,
      },
    ];

    render(<AppQuizzesHub quizzes={extendedQuizzes} locale="pt" />);

    expect(screen.getByText('EM DESTAQUE')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: 'Qual é o seu perfil político?' })
    ).toBeInTheDocument();
  });

  it('filters quizzes using flat search input', async () => {
    const { fireEvent } = await import('@testing-library/react');
    render(<AppQuizzesHub quizzes={mockQuizzes} locale="pt" />);

    const searchInput = screen.getByPlaceholderText('pesquisar...');
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveClass('bg-transparent', 'border-0');

    fireEvent.change(searchInput, { target: { value: 'FIFA' } });
    expect(screen.getByText('FIFA World Cup Winners')).toBeInTheDocument();
    expect(screen.queryByText('Node.js Fundamentals')).not.toBeInTheDocument();

    const clearButton = screen.getByLabelText('Clear search');
    fireEvent.click(clearButton);
    expect(screen.getByText('Node.js Fundamentals')).toBeInTheDocument();
  });

  it('expands search input and displays esc badge when focused, and collapses on Escape key', async () => {
    const { fireEvent } = await import('@testing-library/react');
    render(<AppQuizzesHub quizzes={mockQuizzes} locale="pt" />);

    const container = screen.getByTestId('quizzes-search-container');
    expect(container).toHaveClass('w-40', 'sm:w-44');
    expect(screen.queryByText('esc')).not.toBeInTheDocument();

    const searchInput = screen.getByPlaceholderText('pesquisar...');
    fireEvent.focus(searchInput);

    expect(container).toHaveClass('w-full', 'sm:w-72', 'lg:w-80');
    expect(screen.getByText('esc')).toBeInTheDocument();

    fireEvent.keyDown(searchInput, { key: 'Escape', code: 'Escape' });

    expect(container).toHaveClass('w-40', 'sm:w-44');
    expect(screen.queryByText('esc')).not.toBeInTheDocument();
  });

  it('collapses search input and clears search query when esc badge is clicked', async () => {
    const { fireEvent } = await import('@testing-library/react');
    render(<AppQuizzesHub quizzes={mockQuizzes} locale="pt" />);

    const container = screen.getByTestId('quizzes-search-container');
    const searchInput = screen.getByPlaceholderText('pesquisar...');

    fireEvent.change(searchInput, { target: { value: 'FIFA' } });
    expect(container).toHaveClass('w-full', 'sm:w-72', 'lg:w-80');

    const escBadge = screen.getByText('esc');
    expect(escBadge).toBeInTheDocument();

    fireEvent.click(escBadge);

    expect(searchInput).toHaveValue('');
    expect(container).toHaveClass('w-40', 'sm:w-44');
    expect(screen.queryByText('esc')).not.toBeInTheDocument();
    expect(screen.getByText('Node.js Fundamentals')).toBeInTheDocument();
  });
});
