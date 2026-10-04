import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import AppInterviewHub from './AppInterviewHub'

const meta: Meta<typeof AppInterviewHub> = {
  title: 'Interview/AppInterviewHub',
  component: AppInterviewHub,
  parameters: {
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj<typeof AppInterviewHub>

export const DefaultPortuguese: Story = {
  args: {
    locale: 'pt',
  },
}

export const English: Story = {
  args: {
    locale: 'en',
  },
}

export const Spanish: Story = {
  args: {
    locale: 'es',
  },
}
