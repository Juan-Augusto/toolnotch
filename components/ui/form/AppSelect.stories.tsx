import type { Meta, StoryObj } from '@storybook/react';
import { AppSelect } from './AppSelect';

const sampleOptions = [
  'VALOR 1',
  'VALOR 2',
  'VALOR 3',
];

const meta: Meta<typeof AppSelect> = {
  title: 'UI/Form/AppSelect',
  component: AppSelect,
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
    error: { control: 'text' },
    helperText: { control: 'text' },
    placeholder: { control: 'text' },
    label: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof AppSelect>;

export const Default: Story = {
  args: {
    label: 'SELECT',
    placeholder: 'SELECIONE...',
    options: sampleOptions,
  },
};

export const SelectedAndFocused: Story = {
  args: {
    label: 'SELECT',
    defaultValue: 'ITEM SELECIONADO E FOC...',
    options: [
      'ITEM SELECIONADO E FOC...',
      'VALOR 1',
      'VALOR 2',
      'VALOR 3',
    ],
  },
};

export const Disabled: Story = {
  args: {
    label: 'SELECT',
    placeholder: 'DESABILITADO',
    disabled: true,
    options: sampleOptions,
  },
};

export const WithError: Story = {
  args: {
    label: 'CATEGORIA',
    placeholder: 'SELECIONE UMA CATEGORIA',
    error: 'Este campo é obrigatório.',
    options: sampleOptions,
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'FORMATO',
    placeholder: 'SELECIONE O FORMATO',
    helperText: 'Escolha a extensão de saída desejada.',
    options: sampleOptions,
  },
};
