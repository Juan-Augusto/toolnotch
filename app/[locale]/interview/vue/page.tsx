import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { buildAlternates } from '@/lib/i18nMeta'
import { buildJsonLd, faqSchema, breadcrumbSchema } from '@/lib/schema'
import { VueQuiz } from '@/components/interview/VueQuiz'
import { getFlag } from '@/lib/featureFlags'

const PATH = '/interview/vue'
const TITLE = 'Vue.js Interview Quiz — Beginner to Advanced | ToolNotch'
const DESCRIPTION =
  'Test your Vue.js knowledge with 30 in-depth interview questions across Beginner, Intermediate, and Advanced levels. Covers template syntax, the Composition API, reactivity internals, Pinia, SSR hydration, and compiler optimizations. Every answer explains why it is correct, shows example code, and gives the production best practice.'

const jsonLd = buildJsonLd(
  {
    '@type': 'Quiz',
    name: 'Vue.js Interview Quiz',
    description: DESCRIPTION,
    url: 'https://toolnotch.com/interview/vue',
    educationalLevel: ['Beginner', 'Intermediate', 'Advanced'],
    about: {
      '@type': 'Thing',
      name: 'Vue.js',
      description: 'A progressive JavaScript framework for building user interfaces, built around a reactive, component-based architecture.',
    },
    teaches: [
      'Composition API', 'ref vs reactive', 'computed vs watch', 'watchEffect',
      'provide/inject', 'Slots', 'Lifecycle Hooks', 'Custom v-model', 'Teleport',
      'KeepAlive', 'Reactivity Internals', 'Composables', 'Suspense', 'Render Functions',
      'Custom Directives', 'Vue Router Guards', 'Pinia', 'SSR Hydration', 'Patch Flags',
    ],
  },
  faqSchema([
    {
      question: 'How many Vue.js quiz questions are there?',
      answer: 'There are 30 questions in total — 10 Beginner, 10 Intermediate, and 10 Advanced. Each level is shuffled on every playthrough so you get a fresh experience each time.',
    },
    {
      question: 'What topics does the Vue.js quiz cover?',
      answer: 'The quiz covers createApp and template interpolation, v-bind/v-on shorthand, v-if vs v-show, v-for and :key, ref() and computed(), props and emit(), Single-File Components, ref vs reactive, computed vs watch, watchEffect, the Composition vs Options API, provide/inject, slots, lifecycle hooks, custom v-model, Teleport, KeepAlive, Vue 3 reactivity internals, composables, Suspense, render functions, custom directives, Vue Router navigation guards, Pinia, shallowRef, SSR hydration mismatches, and compiler patch flags.',
    },
    {
      question: 'Does the quiz show example code for every answer?',
      answer: 'Yes. Most questions include an "Example Code" tab with real Vue and JavaScript snippets demonstrating the concept in context — component code, composables, and reactivity behavior.',
    },
    {
      question: 'Is this quiz suitable for frontend Vue.js interview preparation?',
      answer: 'Yes. The questions are drawn from the official Vue.js documentation, the Pinia and Vue Router documentation, and common frontend engineer interview topics. Each answer includes a best-practice note explaining what experienced engineers do in production.',
    },
    {
      question: 'Can I use keyboard shortcuts in the quiz?',
      answer: 'Yes. Press 1–4 to select an answer, Enter or → to advance to the next question, and Tab to cycle through the explanation tabs (Why This Answer / Example Code / Best Practice).',
    },
    {
      question: 'Do I need to sign up to take the quiz?',
      answer: 'No. The Vue.js quiz is completely free with no account, login, or download required. Everything runs client-side in your browser.',
    },
  ]),
  breadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Interview Prep', url: '/interview' },
    { name: 'Vue.js Quiz', url: PATH },
  ]),
)

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: buildAlternates(PATH),
  keywords: [
    'Vue.js interview questions',
    'Vue 3 quiz',
    'Composition API interview questions',
    'Vue reactivity explained',
    'Pinia vs Vuex',
    'Vue SSR hydration',
    'Vue Router navigation guards',
    'Vue custom directives',
    'Vue composables',
    'frontend engineer interview prep',
  ],
  openGraph: {
    title: 'Vue.js Interview Quiz | ToolNotch',
    description: '30 questions — Beginner to Advanced. See example code and reactivity internals on every answer.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vue.js Interview Quiz — 30 Questions | ToolNotch',
    description: 'Test your Vue.js knowledge. Covers the Composition API, reactivity internals, Pinia, SSR, and more.',
  },
}

interface Props {
  params: Promise<{ locale: string }>
}

export default async function VueQuizPage({ params }: Props) {
  const { locale } = await params
  if (!await getFlag('interview-vue')) redirect(`/${locale}/interview`)
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <VueQuiz />
    </>
  )
}
