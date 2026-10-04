import type { Meta, StoryObj } from '@storybook/react';
import AppMenu from '../AppMenu';

const sampleGroups = [
  {
    name: 'IMAGENS',
    items: [
      { name: 'Compressor de imagem', link: '/tools/image-compressor' },
      { name: 'Conversor de imagem', link: '/tools/image-converter' },
    ],
  },
  {
    name: 'PDF',
    items: [
      { name: 'Mesclar PDF', link: '/tools/pdf-merge' },
      { name: 'Dividir pdf', link: '/tools/pdf-split' },
      { name: 'Comprimir pdf', link: '/tools/pdf-compress' },
      { name: 'PDF para JPG', link: '/tools/pdf-to-jpg' },
      { name: 'JPG para PDF', link: '/tools/jpg-to-pdf' },
    ],
  },
  {
    name: 'CONVERSÃO',
    items: [
      { name: 'Conversor de Unidades', link: '/tools/unit-converter' },
      { name: 'Conversor de Moedas', link: '/tools/currency-converter' },
      { name: 'Calculadora de Porcentagem', link: '/tools/percentage-calculator' },
      { name: 'Conversor de Comprimento', link: '/tools/length-converter' },
      { name: 'Conversor de Temperatura', link: '/tools/temperature-converter' },
    ],
  },
];

const meta: Meta<typeof AppMenu> = {
  title: 'UI/AppMenu',
  component: AppMenu,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof AppMenu>;

export const Default: Story = {
  args: {
    group: sampleGroups,
  },
};

export const WithTags: Story = {
  args: {
    group: [
      {
        name: 'IMAGENS',
        tags: ['Popular'],
        items: [
          { name: 'Compressor de imagem', link: '#', tags: ['Novo'] },
          { name: 'Conversor de imagem', link: '#' },
        ],
      },
      {
        name: 'PDF',
        items: [
          { name: 'Mesclar PDF', link: '#' },
          { name: 'Dividir pdf', link: '#', tags: ['Beta'] },
        ],
      },
    ],
  },
};

export const WithClickActions: Story = {
  args: {
    group: [
      {
        name: 'AÇÕES RÁPIDAS',
        items: [
          { name: 'Executar Limpeza', click: () => alert('Ação disparada!') },
          { name: 'Exportar Dados', click: () => alert('Exportando...') },
        ],
      },
    ],
  },
};
