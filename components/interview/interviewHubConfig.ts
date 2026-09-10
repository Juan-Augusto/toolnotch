import type { LucideIcon } from 'lucide-react'
import { Code2, Database, Network } from 'lucide-react'

export type InterviewCategoryKey = 'frontend' | 'backend' | 'distributed'

export const DEFAULT_INTERVIEW_CATEGORY_KEYS: InterviewCategoryKey[] = [
  'frontend',
  'backend',
  'distributed',
]

export interface InterviewCardData {
  id: string
  slug: string
  title: string
  description: Record<string, string>
  category: InterviewCategoryKey
  questionCount: number
}

export interface CategoryDisplayConfig {
  name: Record<string, string>
  badgeColor: string
  badgeBg: string
  icon: LucideIcon
}

export const INTERVIEW_CATEGORY_CONFIG: Record<InterviewCategoryKey, CategoryDisplayConfig> = {
  frontend: {
    name: {
      pt: 'FRONTEND',
      es: 'FRONTEND',
      en: 'FRONTEND',
    },
    badgeColor: 'text-background',
    badgeBg: 'bg-blue-400',
    icon: Code2,
  },
  backend: {
    name: {
      pt: 'BACKEND & DADOS',
      es: 'BACKEND Y DATOS',
      en: 'BACKEND & DATA',
    },
    badgeColor: 'text-background',
    badgeBg: 'bg-emerald-400',
    icon: Database,
  },
  distributed: {
    name: {
      pt: 'SISTEMAS DISTRIBUÍDOS',
      es: 'SISTEMAS DISTRIBUIDOS',
      en: 'DISTRIBUTED SYSTEMS',
    },
    badgeColor: 'text-background',
    badgeBg: 'bg-purple-400',
    icon: Network,
  },
}

export const INTERVIEW_QUIZZES_DATA: InterviewCardData[] = [
  {
    id: 'typescript',
    slug: 'typescript',
    title: 'TypeScript',
    category: 'frontend',
    questionCount: 30,
    description: {
      pt: 'Pratique inferência de tipos, generics, tipos condicionais, mapped types e padrões avançados do compilador.',
      en: 'Practice type inference, generics, conditional types, mapped types, and advanced compiler patterns.',
      es: 'Practica inferencia de tipos, generics, tipos condicionales, mapped types y patrones avanzados del compilador.',
    },
  },
  {
    id: 'vue',
    slug: 'vue',
    title: 'Vue.js',
    category: 'frontend',
    questionCount: 30,
    description: {
      pt: 'Composition API, reatividade interna com Proxy, ciclo de vida de componentes e gerenciamento de estado.',
      en: 'Composition API, internal reactivity with Proxy, component lifecycle, and state management.',
      es: 'Composition API, reactividad interna con Proxy, ciclo de vida de componentes y gestión de estado.',
    },
  },
  {
    id: 'nodejs-fundamentals',
    slug: 'nodejs-fundamentals',
    title: 'Node.js Fundamentals',
    category: 'backend',
    questionCount: 30,
    description: {
      pt: 'Event Loop com libuv, fases de microtasks, streams assíncronas e alocação de memória no motor V8.',
      en: 'Event Loop with libuv, microtask phases, async streams, and memory allocation in the V8 engine.',
      es: 'Event Loop con libuv, fases de microtasks, streams asíncronos y gestión de memoria en V8.',
    },
  },
  {
    id: 'database-design',
    slug: 'database-design',
    title: 'Database Design',
    category: 'backend',
    questionCount: 30,
    description: {
      pt: 'Modelagem relacional, garantias ACID, normalização de 1NF a 3NF, particionamento e consistência.',
      en: 'Relational modeling, ACID guarantees, normalization from 1NF to 3NF, partitioning, and consistency.',
      es: 'Modelado relacional, garantías ACID, normalización de 1NF a 3NF, particionamiento y consistencia.',
    },
  },
  {
    id: 'database-indexing',
    slug: 'database-indexing',
    title: 'Database Indexing',
    category: 'backend',
    questionCount: 30,
    description: {
      pt: 'Estruturas de árvores B-Tree, índices compostos, covering indexes, partial indexes e análise de planos de consulta.',
      en: 'B-Tree structures, composite indexes, covering indexes, partial indexes, and query execution plan analysis.',
      es: 'Estructuras de árboles B-Tree, índices compuestos, covering indexes y análisis de planes de ejecución.',
    },
  },
  {
    id: 'messaging-sqs-kafka',
    slug: 'messaging-sqs-kafka',
    title: 'SQS & Kafka',
    category: 'distributed',
    questionCount: 30,
    description: {
      pt: 'Diferenças fundamentais entre mensageria em fila e log distribuído, offsets, particionamento e semânticas de entrega.',
      en: 'Core differences between queue messaging and distributed logs, offsets, partitioning, and delivery semantics.',
      es: 'Diferencias clave entre mensajería por colas y logs distribuidos, offsets, particionamiento y semánticas de entrega.',
    },
  },
  {
    id: 'rabbitmq-concepts',
    slug: 'rabbitmq-concepts',
    title: 'RabbitMQ Concepts',
    category: 'distributed',
    questionCount: 30,
    description: {
      pt: 'Modelos AMQP, tipos de exchanges (direct, topic, fanout), filas de quorum e políticas de confirmação.',
      en: 'AMQP models, exchange types (direct, topic, fanout), quorum queues, and acknowledgement policies.',
      es: 'Modelos AMQP, tipos de exchanges (direct, topic, fanout), colas de quorum y políticas de confirmación.',
    },
  },
  {
    id: 'system-architecture',
    slug: 'system-architecture',
    title: 'System Architecture',
    category: 'distributed',
    questionCount: 30,
    description: {
      pt: 'Padrões de microsserviços, resiliência com Circuit Breaker, orquestração de sagas, rate limiting e tolerância a falhas.',
      en: 'Microservice patterns, Circuit Breaker resilience, saga orchestration, rate limiting, and fault tolerance.',
      es: 'Patrones de microservicios, resiliencia con Circuit Breaker, orquestación de sagas y tolerancia a fallos.',
    },
  },
]

export const INTERVIEW_I18N_LABELS = {
  pt: {
    heading: 'SIMULADOS PARA ENTREVISTAS TÉCNICAS',
    subtitle: 'Pratique questões de código, modelagem de dados e arquitetura de sistemas com explicações técnicas e armadilhas comuns.',
    allCategories: 'TODOS',
    searchPlaceholder: 'pesquisar...',
    playQuiz: 'PRATICAR',
    questionsLabel: 'PERGUNTAS',
    levelsLabel: 'NÍVEIS',
    quizzesCount: 'simulados',
    noResults: 'Nenhum simulado encontrado.',
    clearFilters: 'Limpar filtros',
  },
  es: {
    heading: 'SIMULADORES PARA ENTREVISTAS TÉCNICAS',
    subtitle: 'Preguntas prácticas de código, modelado de bases de datos y arquitectura de sistemas con explicaciones técnicas y casos límite.',
    allCategories: 'TODOS',
    searchPlaceholder: 'buscar...',
    playQuiz: 'PRACTICAR',
    questionsLabel: 'PREGUNTAS',
    levelsLabel: 'NIVELES',
    quizzesCount: 'simuladores',
    noResults: 'No se encontraron simuladores.',
    clearFilters: 'Limpiar filtros',
  },
  en: {
    heading: 'TECHNICAL INTERVIEW DRILLS',
    subtitle: 'Hands-on questions covering code, database modeling, and system architecture with technical explanations and edge cases.',
    allCategories: 'ALL',
    searchPlaceholder: 'search...',
    playQuiz: 'START DRILL',
    questionsLabel: 'QUESTIONS',
    levelsLabel: 'LEVELS',
    quizzesCount: 'drills',
    noResults: 'No drills found.',
    clearFilters: 'Clear filters',
  },
}
