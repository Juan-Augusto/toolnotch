import type { Meta, StoryObj } from '@storybook/react';
import { AppTextarea } from './AppTextarea';

const meta: Meta<typeof AppTextarea> = {
  title: 'UI/Form/AppTextarea',
  component: AppTextarea,
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
    error: { control: 'text' },
    helperText: { control: 'text' },
    placeholder: { control: 'text' },
    label: { control: 'text' },
    rows: { control: 'number' },
  },
};

export default meta;
type Story = StoryObj<typeof AppTextarea>;

export const Normal: Story = {
  args: {
    label: 'MENSAGEM',
    placeholder: 'DIGITE SEU TEXTO AQUI...',
    rows: 4,
  },
};

export const WithDefaultValue: Story = {
  args: {
    label: 'NOTAS',
    defaultValue: 'Conteúdo padrão do textarea para edição.',
    rows: 5,
  },
};

export const Disabled: Story = {
  args: {
    label: 'CAMPO DESABILITADO',
    placeholder: 'NÃO É POSSÍVEL EDITAR',
    disabled: true,
    rows: 3,
  },
};

export const WithError: Story = {
  args: {
    label: 'DESCRIÇÃO',
    defaultValue: 'Texto muito curto',
    error: 'A descrição precisa ter pelo menos 50 caracteres.',
    rows: 4,
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'COMENTÁRIO',
    placeholder: 'ESCREVA SEU COMENTÁRIO...',
    helperText: 'Máximo de 500 caracteres.',
    rows: 4,
  },
};
