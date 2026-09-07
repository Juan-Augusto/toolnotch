import React from 'react';
import { render, screen } from '@testing-library/react';
import AppTip from '@/components/ui/AppTip';

describe('AppTip', () => {
  it('renders title and description', () => {
    render(
      <AppTip
        title="DICA PROFISSIONAL"
        description="Sempre compare empréstimos pelo CET."
      />
    );

    expect(screen.getByText('DICA PROFISSIONAL')).toBeInTheDocument();
    expect(
      screen.getByText('Sempre compare empréstimos pelo CET.')
    ).toBeInTheDocument();
  });

  it('renders children as content when description is not provided', () => {
    render(
      <AppTip title="ATENÇÃO">
        <span>Conteúdo passado via children.</span>
      </AppTip>
    );

    expect(screen.getByText('ATENÇÃO')).toBeInTheDocument();
    expect(
      screen.getByText('Conteúdo passado via children.')
    ).toBeInTheDocument();
  });

  it('renders custom icon when provided', () => {
    render(
      <AppTip
        title="CUSTOM ICON"
        icon={<span data-testid="custom-icon">⚡</span>}
        description="Descrição de teste"
      />
    );

    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('applies custom className and attributes', () => {
    const { container } = render(
      <AppTip
        title="TITULO"
        description="TEXTO"
        className="my-custom-tip"
        data-testid="tip-box"
      />
    );

    const box = screen.getByTestId('tip-box');
    expect(box).toHaveClass('my-custom-tip');
    expect(box).toHaveClass('border-dashed-5-primary', 'bg-primary/5');
  });
});
