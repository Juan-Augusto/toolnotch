import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AppTabsChips, { type AppTabsChipItem } from '@/components/ui/AppTabsChips';

const mockItems: AppTabsChipItem[] = [
  { id: 'all', label: 'TODOS', count: 21 },
  { id: 'sports', label: 'ESPORTES', count: 5 },
  { id: 'personality', label: 'PERSONALIDADE', count: 9 },
];

describe('AppTabsChips', () => {
  it('renders all tab items with labels and counts', () => {
    render(
      <AppTabsChips
        items={mockItems}
        value="all"
        onChange={jest.fn()}
      />
    );

    expect(screen.getByText('TODOS')).toBeInTheDocument();
    expect(screen.getByText('(21)')).toBeInTheDocument();
    expect(screen.getByText('ESPORTES')).toBeInTheDocument();
    expect(screen.getByText('(5)')).toBeInTheDocument();
    expect(screen.getByText('PERSONALIDADE')).toBeInTheDocument();
    expect(screen.getByText('(9)')).toBeInTheDocument();
  });

  it('marks active tab with aria-selected="true"', () => {
    render(
      <AppTabsChips
        items={mockItems}
        value="sports"
        onChange={jest.fn()}
      />
    );

    const sportsTab = screen.getByRole('tab', { name: /ESPORTES/i });
    const allTab = screen.getByRole('tab', { name: /TODOS/i });

    expect(sportsTab).toHaveAttribute('aria-selected', 'true');
    expect(allTab).toHaveAttribute('aria-selected', 'false');
  });

  it('calls onChange when a tab is clicked', () => {
    const handleChange = jest.fn();
    render(
      <AppTabsChips
        items={mockItems}
        value="all"
        onChange={handleChange}
      />
    );

    fireEvent.click(screen.getByRole('tab', { name: /ESPORTES/i }));
    expect(handleChange).toHaveBeenCalledWith('sports');
  });

  it('supports keyboard navigation with arrow keys', () => {
    const handleChange = jest.fn();
    render(
      <AppTabsChips
        items={mockItems}
        value="all"
        onChange={handleChange}
      />
    );

    const allTab = screen.getByRole('tab', { name: /TODOS/i });
    fireEvent.keyDown(allTab, { key: 'ArrowRight' });
    expect(handleChange).toHaveBeenCalledWith('sports');
  });
});
