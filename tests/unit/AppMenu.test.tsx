import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AppMenu, { type MenuGroup } from '@/components/AppMenu';

const mockGroups: MenuGroup[] = [
  {
    name: 'IMAGENS',
    tags: ['HOT'],
    items: [
      { name: 'Compressor de imagem', link: '/tools/compressor' },
      { name: 'Conversor de imagem', link: '/tools/converter', tags: ['NOVO'] },
    ],
  },
  {
    name: 'PDF',
    items: [
      { name: 'Mesclar PDF', link: '/tools/merge' },
      { name: 'Dividir pdf', click: jest.fn() },
    ],
  },
];

describe('AppMenu', () => {
  beforeAll(() => {
    window.scrollTo = jest.fn();
  });

  it('renders all groups and starts with all groups open', () => {
    render(<AppMenu group={mockGroups} />);

    expect(screen.getByText('IMAGENS')).toBeInTheDocument();
    expect(screen.getByText('PDF')).toBeInTheDocument();

    expect(screen.getByText('Compressor de imagem')).toBeInTheDocument();
    expect(screen.getByText('Conversor de imagem')).toBeInTheDocument();
    expect(screen.getByText('Mesclar PDF')).toBeInTheDocument();
    expect(screen.getByText('Dividir pdf')).toBeInTheDocument();
  });

  it('collapses and expands a group when clicking its header', async () => {
    render(<AppMenu group={mockGroups} />);

    expect(screen.getByText('Compressor de imagem')).toBeInTheDocument();

    const imagensHeader = screen.getByRole('button', { name: /IMAGENS/i });
    fireEvent.click(imagensHeader);

    await waitFor(() => {
      expect(screen.queryByText('Compressor de imagem')).not.toBeInTheDocument();
      expect(screen.queryByText('Conversor de imagem')).not.toBeInTheDocument();
    });

    expect(screen.getByText('Mesclar PDF')).toBeInTheDocument();

    fireEvent.click(imagensHeader);
    await waitFor(() => {
      expect(screen.getByText('Compressor de imagem')).toBeInTheDocument();
    });
  });

  it('triggers item click handler when item is clicked', () => {
    const handleClick = jest.fn();
    const groups: MenuGroup[] = [
      {
        name: 'AÇÕES',
        items: [{ name: 'Ação Teste', click: handleClick }],
      },
    ];

    render(<AppMenu group={groups} />);
    const itemBtn = screen.getByRole('button', { name: 'Ação Teste' });
    fireEvent.click(itemBtn);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders links for items with link property', () => {
    render(<AppMenu group={mockGroups} />);

    const link = screen.getByRole('link', { name: 'Compressor de imagem' });
    expect(link).toHaveAttribute('href', '/tools/compressor');
  });

  it('renders tags for group and items when provided', () => {
    render(<AppMenu group={mockGroups} />);

    expect(screen.getByText('HOT')).toBeInTheDocument();
    expect(screen.getByText('NOVO')).toBeInTheDocument();
  });

  it('supports single group passed as group prop or array as groups prop', () => {
    const { rerender } = render(<AppMenu group={mockGroups[0]} />);
    expect(screen.getByText('IMAGENS')).toBeInTheDocument();
    expect(screen.queryByText('PDF')).not.toBeInTheDocument();

    rerender(<AppMenu groups={mockGroups} />);
    expect(screen.getByText('IMAGENS')).toBeInTheDocument();
    expect(screen.getByText('PDF')).toBeInTheDocument();
  });

  it('renders search input when search is true and filters items', () => {
    render(<AppMenu groups={mockGroups} search searchPlaceholder="Pesquisar ferramentas..." />);

    const searchInput = screen.getByPlaceholderText('Pesquisar ferramentas...');
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveClass('bg-transparent', 'border-0');

    fireEvent.change(searchInput, { target: { value: 'Compressor' } });

    expect(screen.getByText('Compressor de imagem')).toBeInTheDocument();
    expect(screen.queryByText('Conversor de imagem')).not.toBeInTheDocument();
    expect(screen.queryByText('Mesclar PDF')).not.toBeInTheDocument();
  });

  it('displays empty state when search finds no results', () => {
    render(<AppMenu groups={mockGroups} search />);

    const searchInput = screen.getByPlaceholderText('Pesquisar...');
    fireEvent.change(searchInput, { target: { value: 'Inexistente XYZ' } });

    expect(screen.getByText('Nenhum resultado')).toBeInTheDocument();
    expect(screen.queryByText('Compressor de imagem')).not.toBeInTheDocument();
  });
});
