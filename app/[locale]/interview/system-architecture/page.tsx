import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { buildAlternates } from '@/lib/i18nMeta'
import { buildJsonLd, faqSchema, breadcrumbSchema } from '@/lib/schema'
import { SystemArchitectureQuiz } from '@/components/interview/SystemArchitectureQuiz'
import { getFlag } from '@/lib/featureFlags'

const PATH = '/interview/system-architecture'
const TITLE = 'System Architecture Interview Quiz — Beginner to Advanced | ToolNotch'
const DESCRIPTION =
  'Test your system architecture knowledge with 30 in-depth interview questions across Beginner, Intermediate, and Advanced levels. Covers CI/CD, Docker, Kubernetes, circuit breakers, the Saga pattern, GitOps, chaos engineering, and multi-region deployments. Every answer explains why it is correct, shows the deployment configuration, and gives the industry best practice.'

const jsonLd = buildJsonLd(
  {
    '@type': 'Quiz',
    name: 'System Architecture Interview Quiz',
    description: DESCRIPTION,
    url: 'https://toolnotch.com/interview/system-architecture',
    educationalLevel: ['Beginner', 'Intermediate', 'Advanced'],
    about: {
      '@type': 'Thing',
      name: 'System Architecture',
      description: 'The discipline of designing distributed software systems for reliability, scalability, and maintainability.',
    },
    teaches: [
      'Monolith vs Microservices', 'Docker', 'CI/CD', 'Load Balancing',
      'Horizontal Scaling', 'Kubernetes', 'Blue/Green Deployment',
      'Circuit Breaker', 'Rate Limiting', 'Service Mesh', 'GitOps',
      'Chaos Engineering', 'Saga Pattern', 'Observability', 'FinOps',
    ],
  },
  faqSchema([
    {
      question: 'How many system architecture quiz questions are there?',
      answer: 'There are 30 questions in total — 10 Beginner, 10 Intermediate, and 10 Advanced. Each level is shuffled on every playthrough so you get a fresh experience each time.',
    },
    {
      question: 'What topics does the system architecture quiz cover?',
      answer: 'The quiz covers monolith vs microservices, Docker containerisation, CI/CD pipelines, load balancing, horizontal vs vertical scaling, reverse proxies, health checks, rollback strategies, the 12-factor app, blue/green deployments, Kubernetes, service discovery, API gateways, circuit breakers, rate limiting, immutable infrastructure, the Saga pattern, GitOps, chaos engineering, service mesh, multi-region active-active, and FinOps.',
    },
    {
      question: 'Does the quiz show Docker or Kubernetes configuration?',
      answer: 'Yes. Most questions include a "Deployment Effect" tab that shows the relevant Dockerfile, docker-compose, or Kubernetes YAML that demonstrates the concept in practice — so you can see exactly what the configuration looks like and what effect it has.',
    },
    {
      question: 'Is this quiz suitable for DevOps and backend interview preparation?',
      answer: 'Yes. The questions are drawn from the Kubernetes documentation, The DevOps Handbook, and common senior backend and platform engineer interview topics. Each answer includes a best-practice note explaining what engineering teams do in production.',
    },
    {
      question: 'Can I use keyboard shortcuts in the quiz?',
      answer: 'Yes. Press 1–4 to select an answer, Enter or → to advance to the next question, and Tab to cycle through the explanation tabs (Why This Answer / Deployment Effect / Best Practice).',
    },
    {
      question: 'Do I need to sign up to take the quiz?',
      answer: 'No. The system architecture quiz is completely free with no account, login, or download required. Everything runs client-side in your browser.',
    },
  ]),
  breadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Interview Prep', url: '/interview' },
    { name: 'System Architecture Quiz', url: PATH },
  ]),
)

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: buildAlternates(PATH),
  keywords: [
    'system architecture interview questions',
    'system design interview quiz',
    'Kubernetes interview prep',
    'microservices interview questions',
    'CI/CD interview questions',
    'circuit breaker pattern',
    'GitOps explained',
    'Saga pattern interview',
    'Docker interview questions',
    'backend engineer interview prep',
    'DevOps interview questions',
  ],
  openGraph: {
    title: 'System Architecture Interview Quiz | ToolNotch',
    description: '30 questions — Beginner to Advanced. See Kubernetes YAML and deployment configs on every answer.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'System Architecture Interview Quiz — 30 Questions | ToolNotch',
    description: 'Test your system design knowledge. Covers Docker, Kubernetes, CI/CD, GitOps, circuit breakers, and more.',
  },
}

interface Props {
  params: Promise<{ locale: string }>
}

export default async function SystemArchitectureQuizPage({ params }: Props) {
  const { locale } = await params
  if (!await getFlag('interview-system-architecture')) redirect(`/${locale}/interview`)
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SystemArchitectureQuiz />
    </>
  )
}
