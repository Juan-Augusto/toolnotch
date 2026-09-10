import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import AppInterviewCardItem from './AppInterviewCardItem'
import { INTERVIEW_QUIZZES_DATA, INTERVIEW_I18N_LABELS } from './interviewHubConfig'

const meta: Meta<typeof AppInterviewCardItem> = {
  title: 'Interview/AppInterviewCardItem',
  component: AppInterviewCardItem,
  parameters: {
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj<typeof AppInterviewCardItem>

export const TypeScriptCard: Story = {
  args: {
    quiz: INTERVIEW_QUIZZES_DATA[0],
    currentLocale: 'pt',
    labels: {
      playQuiz: INTERVIEW_I18N_LABELS.pt.playQuiz,
      questionsLabel: INTERVIEW_I18N_LABELS.pt.questionsLabel,
      levelsLabel: INTERVIEW_I18N_LABELS.pt.levelsLabel,
    },
  },
}

export const NodeJsCard: Story = {
  args: {
    quiz: INTERVIEW_QUIZZES_DATA[2],
    currentLocale: 'pt',
    labels: {
      playQuiz: INTERVIEW_I18N_LABELS.pt.playQuiz,
      questionsLabel: INTERVIEW_I18N_LABELS.pt.questionsLabel,
      levelsLabel: INTERVIEW_I18N_LABELS.pt.levelsLabel,
    },
  },
}

export const KafkaCardEnglish: Story = {
  args: {
    quiz: INTERVIEW_QUIZZES_DATA[5],
    currentLocale: 'en',
    labels: {
      playQuiz: INTERVIEW_I18N_LABELS.en.playQuiz,
      questionsLabel: INTERVIEW_I18N_LABELS.en.questionsLabel,
      levelsLabel: INTERVIEW_I18N_LABELS.en.levelsLabel,
    },
  },
}
