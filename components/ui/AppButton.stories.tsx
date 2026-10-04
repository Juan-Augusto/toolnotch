import type { Meta, StoryObj } from '@storybook/react';
import AppButton from './AppButton';

const meta: Meta<typeof AppButton> = {
  title: 'UI/AppButton',
  component: AppButton,
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'tertiary'],
    },
    withArrow: { control: 'boolean' },
    small: { control: 'boolean' },
    disabled: { control: 'boolean' },
    rounded: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof AppButton>;

export const Primary: Story = {
  args: {
    children: 'Acessar',
    color: 'primary',
    withArrow: true,
  },
};

export const Secondary: Story = {
  args: {
    children: 'Confirmar',
    color: 'secondary',
    withArrow: true,
  },
};

export const Tertiary: Story = {
  args: {
    children: 'Cancelar',
    color: 'tertiary',
  },
};

export const Small: Story = {
  args: {
    children: 'Acessar',
    color: 'primary',
    small: true,
    withArrow: true,
  },
};

export const Disabled: Story = {
  args: {
    children: 'Indisponível',
    color: 'primary',
    disabled: true,
  },
};
