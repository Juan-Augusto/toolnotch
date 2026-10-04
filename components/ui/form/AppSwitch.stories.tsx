import type { Meta, StoryObj } from '@storybook/react';
import { AppSwitch } from './AppSwitch';

const meta: Meta<typeof AppSwitch> = {
  title: 'UI/Form/AppSwitch',
  component: AppSwitch,
  tags: ['autodocs'],
  argTypes: {
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    labelPosition: {
      control: 'radio',
      options: ['left', 'right'],
    },
    error: { control: 'text' },
    helperText: { control: 'text' },
    label: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof AppSwitch>;

export const Off: Story = {
  args: {
    label: 'SWITCH',
    defaultChecked: false,
  },
};

export const On: Story = {
  args: {
    label: 'SWITCH',
    defaultChecked: true,
  },
};

export const LeftLabel: Story = {
  args: {
    label: 'SWITCH',
    labelPosition: 'left',
    defaultChecked: true,
  },
};

export const DisabledOff: Story = {
  args: {
    label: 'SWITCH',
    disabled: true,
    defaultChecked: false,
  },
};

export const DisabledOn: Story = {
  args: {
    label: 'SWITCH',
    disabled: true,
    defaultChecked: true,
  },
};

export const WithError: Story = {
  args: {
    label: 'ATIVAR MODO TURBO',
    error: 'Recurso indisponível no momento.',
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'SINCRONIZAÇÃO AUTOMÁTICA',
    helperText: 'Atualiza dados em segundo plano a cada 5 minutos.',
    defaultChecked: true,
  },
};
