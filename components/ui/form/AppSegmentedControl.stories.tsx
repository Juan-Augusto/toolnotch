import type { Meta, StoryObj } from '@storybook/react';
import { AppSegmentedControl } from './AppSegmentedControl';

const meta: Meta<typeof AppSegmentedControl> = {
  title: 'Form/AppSegmentedControl',
  component: AppSegmentedControl,
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: 'select',
      options: ['secondary', 'primary'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    withDashedBorder: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof AppSegmentedControl>;

export const DefaultYears: Story = {
  args: {
    options: [
      { label: '1 ANO', value: 1 },
      { label: '5 ANOS', value: 5 },
      { label: '10 ANOS', value: 10 },
    ],
    defaultValue: 10,
    color: 'secondary',
    withDashedBorder: true,
  },
};

export const WithLabelAndHelper: Story = {
  args: {
    label: 'PERÍODO DO INVESTIMENTO',
    options: [
      { label: '1 ANO', value: '1y' },
      { label: '5 ANOS', value: '5y' },
      { label: '10 ANOS', value: '10y' },
      { label: '20 ANOS', value: '20y' },
    ],
    defaultValue: '10y',
    helperText: 'Selecione o horizonte de tempo para a simulação.',
    color: 'secondary',
  },
};

export const PrimaryColor: Story = {
  args: {
    label: 'TIPO DE PLANO',
    options: [
      { label: 'MENSAL', value: 'monthly' },
      { label: 'SEMESTRAL', value: 'semiannual' },
      { label: 'ANUAL', value: 'annual' },
    ],
    defaultValue: 'annual',
    color: 'primary',
  },
};

export const WithoutDashedBorder: Story = {
  args: {
    options: [
      { label: '1 ANO', value: 1 },
      { label: '5 ANOS', value: 5 },
      { label: '10 ANOS', value: 10 },
    ],
    defaultValue: 5,
    withDashedBorder: false,
  },
};

export const WithDisabledOption: Story = {
  args: {
    label: 'DISPONIBILIDADE',
    options: [
      { label: '24 HORAS', value: '24h' },
      { label: '7 DIAS', value: '7d' },
      { label: '30 DIAS', value: '30d', disabled: true },
    ],
    defaultValue: '7d',
  },
};
