import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AppTabs, { type AppTabItem } from '@/components/AppTabs';

describe('AppTabs', () => {
  beforeAll(() => {
    window.scrollTo = jest.fn();
  });

  it('renders tab list from string array and selects the first tab by default', () => {
    render(<AppTabs tabs={['TODOS', 'ESPORTES', 'PERSONALIDADE']} />);

    const todosTab = screen.getByRole('tab', { name: /TODOS/i });
    const esportesTab = screen.getByRole('tab', { name: /ESPORTES/i });
    const personalTab = screen.getByRole('tab', { name: /PERSONALIDADE/i });

    expect(todosTab).toBeInTheDocument();
    expect(esportesTab).toBeInTheDocument();
    expect(personalTab).toBeInTheDocument();

    expect(todosTab).toHaveAttribute('aria-selected', 'true');
    expect(todosTab).toHaveClass('text-secondary');
    expect(esportesTab).toHaveAttribute('aria-selected', 'false');
    expect(personalTab).toHaveAttribute('aria-selected', 'false');
  });

  it('applies primary color classes when color="primary"', () => {
    render(<AppTabs tabs={['TODOS', 'ESPORTES']} color="primary" />);
    const todosTab = screen.getByRole('tab', { name: /TODOS/i });
    expect(todosTab).toHaveClass('text-primary');
  });

  it('switches active tab when clicked in uncontrolled mode', () => {
    const handleChange = jest.fn();
    render(
      <AppTabs
        tabs={['TODOS', 'ESPORTES', 'PERSONALIDADE']}
        defaultValue="TODOS"
        onChange={handleChange}
      />
    );

    const esportesTab = screen.getByRole('tab', { name: /ESPORTES/i });
    fireEvent.click(esportesTab);

    expect(esportesTab).toHaveAttribute('aria-selected', 'true');
    const todosTab = screen.getByRole('tab', { name: /TODOS/i });
    expect(todosTab).toHaveAttribute('aria-selected', 'false');
    expect(handleChange).toHaveBeenCalledWith('ESPORTES');
  });

  it('operates in controlled mode via value and onChange', () => {
    const handleChange = jest.fn();
    const { rerender } = render(
      <AppTabs
        tabs={['TODOS', 'ESPORTES', 'PERSONALIDADE']}
        value="ESPORTES"
        onChange={handleChange}
      />
    );

    const esportesTab = screen.getByRole('tab', { name: /ESPORTES/i });
    expect(esportesTab).toHaveAttribute('aria-selected', 'true');

    const personalTab = screen.getByRole('tab', { name: /PERSONALIDADE/i });
    fireEvent.click(personalTab);

    expect(handleChange).toHaveBeenCalledWith('PERSONALIDADE');
    // Still esportes until re-rendered with new value
    expect(esportesTab).toHaveAttribute('aria-selected', 'true');

    rerender(
      <AppTabs
        tabs={['TODOS', 'ESPORTES', 'PERSONALIDADE']}
        value="PERSONALIDADE"
        onChange={handleChange}
      />
    );
    expect(personalTab).toHaveAttribute('aria-selected', 'true');
  });

  it('renders badges and tab content when provided', async () => {
    const items: AppTabItem[] = [
      {
        id: 'tab-1',
        label: 'TODOS',
        badge: 42,
        content: <div>Conteúdo de Todos</div>,
      },
      {
        id: 'tab-2',
        label: 'ESPORTES',
        badge: 10,
        content: <div>Conteúdo de Esportes</div>,
      },
    ];

    render(<AppTabs tabs={items} defaultValue="tab-1" />);

    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('Conteúdo de Todos')).toBeInTheDocument();
    expect(screen.queryByText('Conteúdo de Esportes')).not.toBeInTheDocument();

    const esportesTab = screen.getByRole('tab', { name: /ESPORTES/i });
    fireEvent.click(esportesTab);

    await waitFor(() => {
      expect(screen.getByText('Conteúdo de Esportes')).toBeInTheDocument();
    });
  });

  it('does not switch tabs when disabled tab is clicked', () => {
    const handleChange = jest.fn();
    const items: AppTabItem[] = [
      { id: 't1', label: 'HABILITADA' },
      { id: 't2', label: 'DESABILITADA', disabled: true },
    ];

    render(<AppTabs tabs={items} defaultValue="t1" onChange={handleChange} />);

    const disabledTab = screen.getByRole('tab', { name: /DESABILITADA/i });
    expect(disabledTab).toBeDisabled();

    fireEvent.click(disabledTab);
    expect(handleChange).not.toHaveBeenCalled();
    expect(screen.getByRole('tab', { name: /HABILITADA/i })).toHaveAttribute('aria-selected', 'true');
  });

  it('supports keyboard navigation with arrow keys and home/end', () => {
    const handleChange = jest.fn();
    render(
      <AppTabs
        tabs={['TODOS', 'ESPORTES', 'PERSONALIDADE']}
        defaultValue="TODOS"
        onChange={handleChange}
      />
    );

    const todosTab = screen.getByRole('tab', { name: /TODOS/i });

    // Press ArrowRight -> should select ESPORTES
    fireEvent.keyDown(todosTab, { key: 'ArrowRight' });
    expect(handleChange).toHaveBeenCalledWith('ESPORTES');
    expect(screen.getByRole('tab', { name: /ESPORTES/i })).toHaveAttribute('aria-selected', 'true');

    // Press End -> should select PERSONALIDADE
    const esportesTab = screen.getByRole('tab', { name: /ESPORTES/i });
    fireEvent.keyDown(esportesTab, { key: 'End' });
    expect(handleChange).toHaveBeenCalledWith('PERSONALIDADE');
    expect(screen.getByRole('tab', { name: /PERSONALIDADE/i })).toHaveAttribute('aria-selected', 'true');

    // Press Home -> should select TODOS
    const personalTab = screen.getByRole('tab', { name: /PERSONALIDADE/i });
    fireEvent.keyDown(personalTab, { key: 'Home' });
    expect(handleChange).toHaveBeenCalledWith('TODOS');
    expect(screen.getByRole('tab', { name: /TODOS/i })).toHaveAttribute('aria-selected', 'true');
  });
});
