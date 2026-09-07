import type { Meta, StoryObj } from '@storybook/react';
import { AppCheckbox } from './AppCheckbox';

const meta: Meta<typeof AppCheckbox> = {
  title: 'UI/Form/AppCheckbox',
  component: AppCheckbox,
  tags: ['autodocs'],
  argTypes: {
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    indeterminate: { control: 'boolean' },
    error: { control: 'text' },
    helperText: { control: 'text' },
    label: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof AppCheckbox>;

export const Unchecked: Story = {
  args: {
    label: 'CHECKBOX',
    defaultChecked: false,
  },
};

export const Checked: Story = {
  args: {
    label: 'CHECKBOX',
    defaultChecked: true,
  },
};

export const Indeterminate: Story = {
  args: {
    label: 'CHECKBOX',
    indeterminate: true,
  },
};

export const DisabledUnchecked: Story = {
  args: {
    label: 'CHECKBOX',
    disabled: true,
    defaultChecked: false,
  },
};

export const DisabledChecked: Story = {
  args: {
    label: 'CHECKBOX',
    disabled: true,
    defaultChecked: true,
  },
};

export const WithError: Story = {
  args: {
    label: 'TERMOS DE USO',
    error: 'Você deve aceitar os termos.',
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'NOTIFICAÇÕES',
    helperText: 'Receba alertas sobre novas ferramentas.',
  },
};
