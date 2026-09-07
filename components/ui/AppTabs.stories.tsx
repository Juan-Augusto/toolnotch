import type { Meta, StoryObj } from '@storybook/react';
import { AppTabs } from './AppTabs';

const meta: Meta<typeof AppTabs> = {
  title: 'UI/AppTabs',
  component: AppTabs,
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
    withRail: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    renderContent: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof AppTabs>;

export const DefaultSecondary: Story = {
  args: {
    tabs: ['TODOS', 'ESPORTES', 'PERSONALIDADE'],
    defaultValue: 'TODOS',
    color: 'secondary',
  },
};

export const PrimaryColor: Story = {
  args: {
    tabs: ['TODOS', 'ESPORTES', 'PERSONALIDADE'],
    defaultValue: 'TODOS',
    color: 'primary',
  },
};

export const WithBadgesAndContent: Story = {
  args: {
    color: 'secondary',
    tabs: [
      {
        id: 'todos',
        label: 'TODOS',
        badge: 42,
        content: (
          <div className="p-4 rounded border border-border/40 bg-surface text-label font-mono text-xs">
            Exibindo todos os quizzes e ferramentas disponíveis na plataforma.
          </div>
        ),
      },
      {
        id: 'esportes',
        label: 'ESPORTES',
        badge: 12,
        content: (
          <div className="p-4 rounded border border-border/40 bg-surface text-label font-mono text-xs">
            Quizzes sobre futebol, basquete, corrida e esportes olímpicos.
          </div>
        ),
      },
      {
        id: 'personalidade',
        label: 'PERSONALIDADE',
        badge: 8,
        content: (
          <div className="p-4 rounded border border-border/40 bg-surface text-label font-mono text-xs">
            Descubra mais sobre seu estilo de trabalho, raciocínio e perfil.
          </div>
        ),
      },
    ],
    defaultValue: 'todos',
  },
};

export const WithBottomRail: Story = {
  args: {
    tabs: ['TODOS', 'ESPORTES', 'PERSONALIDADE'],
    defaultValue: 'TODOS',
    withRail: true,
  },
};

export const FullWidth: Story = {
  args: {
    tabs: ['TODOS', 'ESPORTES', 'PERSONALIDADE'],
    defaultValue: 'TODOS',
    fullWidth: true,
  },
};
