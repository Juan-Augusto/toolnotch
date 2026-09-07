import type { Meta, StoryObj } from '@storybook/react';
import { AppInput } from './AppInput';
import { CurrencyFormatter } from '@/utils/formatters/currency';
import { DateFormatter } from '@/utils/formatters/date';

const meta: Meta<typeof AppInput> = {
  title: 'UI/Form/AppInput',
  component: AppInput,
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
type Story = StoryObj<typeof AppInput>;

export const Normal: Story = {
  args: {
    label: 'LABEL',
    placeholder: 'PLACEHOLDER',
  },
};

export const FocusedOrTyping: Story = {
  args: {
    label: 'LABEL',
    defaultValue: 'DIGITANDO',
  },
};

export const Disabled: Story = {
  args: {
    label: 'LABEL',
    placeholder: 'DESABILITADO',
    disabled: true,
  },
};

export const WithError: Story = {
  args: {
    label: 'E-MAIL',
    defaultValue: 'contato@invalido',
    error: 'Insira um endereço de e-mail válido.',
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'NOME DE USUÁRIO',
    placeholder: 'DIGITE SEU NICK',
    helperText: 'Apenas caracteres alfanuméricos são permitidos.',
  },
};

export const WithCurrencyFormatter: Story = {
  args: {
    label: 'VALOR EM REAIS',
    placeholder: 'R$ 0,00',
    formatter: CurrencyFormatter.BRL,
  },
};

export const WithUSDFormatter: Story = {
  args: {
    label: 'AMOUNT IN USD',
    placeholder: '$0.00',
    formatter: CurrencyFormatter.USD,
  },
};

export const WithDateFormatter: Story = {
  args: {
    label: 'DATA DE NASCIMENTO',
    placeholder: 'DD/MM/AAAA',
    formatter: DateFormatter.PT_BR,
  },
};
