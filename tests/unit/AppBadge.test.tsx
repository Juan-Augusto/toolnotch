import React from 'react';
import { render, screen } from '@testing-library/react';
import AppBadge from '@/components/ui/AppBadge';

describe('AppBadge', () => {
  it('renders children with provided classes', () => {
    const { container } = render(
      <AppBadge bg="bg-green-400" text="text-background">
        Esportes
      </AppBadge>
    );

    const badge = screen.getByText('Esportes');
    expect(badge).toBeInTheDocument();
    const span = container.firstChild as HTMLElement;
    expect(span).toHaveClass('bg-green-400', 'text-background', 'inline-flex', 'items-center', 'font-mono');
  });

  it('renders icon when provided', () => {
    render(
      <AppBadge
        bg="bg-purple-400"
        text="text-background"
        icon={<span data-testid="badge-icon">🧠</span>}
      >
        Personalidade
      </AppBadge>
    );

    expect(screen.getByTestId('badge-icon')).toBeInTheDocument();
    expect(screen.getByText('Personalidade')).toBeInTheDocument();
  });
});
