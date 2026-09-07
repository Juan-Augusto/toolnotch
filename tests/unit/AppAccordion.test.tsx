import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { AppAccordion } from '@/components/ui/AppAccordion';

describe('AppAccordion', () => {
  it('renders single group and displays content by default', () => {
    render(
      <AppAccordion
        group={{
          name: 'ACCORDION/DROPDOWN',
          content: <div>Conteúdo de teste</div>,
        }}
      />
    );

    expect(screen.getByText('ACCORDION/DROPDOWN')).toBeInTheDocument();
    expect(screen.getByText('Conteúdo de teste')).toBeInTheDocument();

    const button = screen.getByRole('button', { name: /ACCORDION\/DROPDOWN/i });
    expect(button).toHaveAttribute('aria-expanded', 'true');
  });

  it('toggles content visibility when header button is clicked', () => {
    render(
      <AppAccordion
        group={{
          name: 'ITEM 1',
          content: <div>Conteúdo Secreto</div>,
          defaultOpen: true,
        }}
      />
    );

    expect(screen.getByText('Conteúdo Secreto')).toBeInTheDocument();

    const button = screen.getByRole('button', { name: /ITEM 1/i });
    fireEvent.click(button);

    expect(screen.queryByText('Conteúdo Secreto')).not.toBeInTheDocument();
    expect(button).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(button);
    expect(screen.getByText('Conteúdo Secreto')).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-expanded', 'true');
  });

  it('handles multiple groups independently by default', () => {
    render(
      <AppAccordion
        groups={[
          {
            name: 'GRUPO 1',
            content: <div>Conteúdo 1</div>,
            defaultOpen: true,
          },
          {
            name: 'GRUPO 2',
            content: <div>Conteúdo 2</div>,
            defaultOpen: false,
          },
        ]}
      />
    );

    expect(screen.getByText('Conteúdo 1')).toBeInTheDocument();
    expect(screen.queryByText('Conteúdo 2')).not.toBeInTheDocument();

    const button2 = screen.getByRole('button', { name: /GRUPO 2/i });
    fireEvent.click(button2);

    expect(screen.getByText('Conteúdo 1')).toBeInTheDocument();
    expect(screen.getByText('Conteúdo 2')).toBeInTheDocument();
  });

  it('closes other items when allowMultiple is false', () => {
    render(
      <AppAccordion
        allowMultiple={false}
        groups={[
          {
            name: 'GRUPO A',
            content: <div>Conteúdo A</div>,
            defaultOpen: true,
          },
          {
            name: 'GRUPO B',
            content: <div>Conteúdo B</div>,
            defaultOpen: false,
          },
        ]}
      />
    );

    expect(screen.getByText('Conteúdo A')).toBeInTheDocument();
    expect(screen.queryByText('Conteúdo B')).not.toBeInTheDocument();

    const buttonB = screen.getByRole('button', { name: /GRUPO B/i });
    fireEvent.click(buttonB);

    expect(screen.queryByText('Conteúdo A')).not.toBeInTheDocument();
    expect(screen.getByText('Conteúdo B')).toBeInTheDocument();
  });

  it('accepts array of groups through group prop', () => {
    render(
      <AppAccordion
        group={[
          { name: 'G1', content: <div>C1</div> },
          { name: 'G2', content: <div>C2</div> },
        ]}
        defaultOpenAll={true}
      />
    );

    expect(screen.getByText('G1')).toBeInTheDocument();
    expect(screen.getByText('C1')).toBeInTheDocument();
    expect(screen.getByText('G2')).toBeInTheDocument();
    expect(screen.getByText('C2')).toBeInTheDocument();
  });
});
