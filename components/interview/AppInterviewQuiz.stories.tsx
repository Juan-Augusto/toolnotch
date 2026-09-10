import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import AppInterviewQuiz from './AppInterviewQuiz'
import { TYPESCRIPT_QUESTIONS } from '@/data/interview/typescript-questions'
import { DATABASE_DESIGN_QUESTIONS } from '@/data/interview/database-design-questions'
import { SYSTEM_ARCHITECTURE_QUESTIONS } from '@/data/interview/system-architecture-questions'

const meta: Meta<typeof AppInterviewQuiz> = {
  title: 'Interview/AppInterviewQuiz',
  component: AppInterviewQuiz,
  parameters: {
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj<typeof AppInterviewQuiz>

export const TypeScriptQuiz: Story = {
  args: {
    category: 'frontend',
    title: 'TypeScript Deep-Dive Quiz',
    subtitle: '30 questões cobrindo inferência, tipos condicionais, generics e padrões de compilação.',
    accentColor: '#3178c6',
    questions: TYPESCRIPT_QUESTIONS,
    secondaryTabTitle: 'JavaScript Compilado',
    levelCards: [
      {
        level: 'beginner',
        title: 'Iniciante',
        desc: '10 questões sobre fundamentos essenciais de tipagem.',
        topics: ['Type Inference', 'any vs unknown', 'interface vs type', 'Enums', 'Tuplas'],
      },
      {
        level: 'intermediate',
        title: 'Intermediário',
        desc: '10 questões sobre o sistema de tipos em profundidade.',
        topics: ['Generics', 'keyof + T[K]', 'Mapped Types', 'Type Predicates'],
      },
      {
        level: 'advanced',
        title: 'Avançado',
        desc: '10 questões sobre recursos de ponta do TypeScript.',
        topics: ['Tipos Condicionais', 'infer', 'satisfies', 'Variadic Tuples'],
      },
    ],
  },
}

export const DatabaseDesignQuiz: Story = {
  args: {
    category: 'backend',
    title: 'Database Design Interview Quiz',
    subtitle: '30 questões sobre modelagem relacional, ACID, CAP, sharding, CQRS e consistência distribuída.',
    accentColor: '#f59e0b',
    questions: DATABASE_DESIGN_QUESTIONS,
    secondaryTabTitle: 'Query Plan / DDL',
    levelCards: [
      {
        level: 'beginner',
        title: 'Iniciante',
        desc: '10 questões sobre fundamentos relacionais.',
        topics: ['Chaves Primárias', 'Normalização', 'ACID', 'Semântica NULL'],
      },
      {
        level: 'intermediate',
        title: 'Intermediário',
        desc: '10 questões sobre arquitetura de dados e concorrência.',
        topics: ['Teorema CAP', 'Níveis de Isolamento', 'Locking Otimista', 'Sharding'],
      },
      {
        level: 'advanced',
        title: 'Avançado',
        desc: '10 questões sobre sistemas distribuídos e alta escala.',
        topics: ['CQRS', 'Event Sourcing', 'Saga Pattern', 'Two-Phase Commit'],
      },
    ],
  },
}

export const SystemArchitectureQuiz: Story = {
  args: {
    category: 'distributed',
    title: 'System Architecture Interview Quiz',
    subtitle: '30 questões sobre microsserviços, resiliência, mensageria, observabilidade e nuvem.',
    accentColor: '#8b5cf6',
    questions: SYSTEM_ARCHITECTURE_QUESTIONS,
    secondaryTabTitle: 'Arquitetura e Fluxo',
    levelCards: [
      {
        level: 'beginner',
        title: 'Iniciante',
        desc: '10 questões sobre arquitetura de serviços e protocolos.',
        topics: ['REST vs gRPC', 'Load Balancers', 'Stateless vs Stateful', 'Caching'],
      },
      {
        level: 'intermediate',
        title: 'Intermediário',
        desc: '10 questões sobre resiliência e esteiras de dados.',
        topics: ['Circuit Breaker', 'Rate Limiting', 'Backpressure', 'Idempotência'],
      },
      {
        level: 'advanced',
        title: 'Avançado',
        desc: '10 questões sobre governança de larga escala e falhas distribuídas.',
        topics: ['Zero Trust', 'Service Mesh', 'Chaos Engineering', 'Observabilidade'],
      },
    ],
  },
}
