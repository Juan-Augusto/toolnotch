import type { AppInterviewLevelCard } from '@/components/interview/AppInterviewQuiz'

export interface InterviewQuizMetaData {
  title: string
  subtitle: string
  secondaryTabTitle: string
  levelCards: AppInterviewLevelCard[]
}

export type SupportedLocale = 'pt' | 'en' | 'es'

const INTERVIEW_META_BY_SLUG: Record<string, Record<SupportedLocale, InterviewQuizMetaData>> = {
  typescript: {
    pt: {
      title: 'TypeScript Deep-Dive Quiz',
      subtitle: '30 questões abrangendo inferência de tipos, genéricos, tipos condicionais, mapped types e recursos modernos do TypeScript.',
      secondaryTabTitle: 'JavaScript Compilado',
      levelCards: [
        {
          level: 'beginner',
          title: 'Iniciante',
          desc: '10 questões sobre fundamentos essenciais de tipagem e inferência.',
          topics: ['Type Inference', 'any vs unknown', 'interface vs type', 'readonly', 'Enums', 'Tuplas', 'never'],
        },
        {
          level: 'intermediate',
          title: 'Intermediário',
          desc: '10 questões sobre o sistema de tipos em profundidade.',
          topics: ['Generics', 'keyof + T[K]', 'Mapped Types', 'Type Predicates', 'Template Literals'],
        },
        {
          level: 'advanced',
          title: 'Avançado',
          desc: '10 questões sobre recursos de ponta e metaprogramação de tipos.',
          topics: ['Tipos Condicionais', 'infer', 'satisfies', 'const params', 'Variadic Tuples', 'NoInfer'],
        },
      ],
    },
    en: {
      title: 'TypeScript Deep-Dive Quiz',
      subtitle: '30 questions covering type inference, generics, conditional types, mapped types, and modern TypeScript features.',
      secondaryTabTitle: 'Compiled JavaScript',
      levelCards: [
        {
          level: 'beginner',
          title: 'Beginner',
          desc: '10 questions on essential typing fundamentals and type inference.',
          topics: ['Type Inference', 'any vs unknown', 'interface vs type', 'readonly', 'Enums', 'Tuples', 'never'],
        },
        {
          level: 'intermediate',
          title: 'Intermediate',
          desc: '10 questions on in-depth type system mechanics and utility types.',
          topics: ['Generics', 'keyof + T[K]', 'Mapped Types', 'Type Predicates', 'Template Literals'],
        },
        {
          level: 'advanced',
          title: 'Advanced',
          desc: '10 questions on cutting-edge type-level metaprogramming.',
          topics: ['Conditional Types', 'infer', 'satisfies', 'const params', 'Variadic Tuples', 'NoInfer'],
        },
      ],
    },
    es: {
      title: 'TypeScript Deep-Dive Quiz',
      subtitle: '30 preguntas que abarcan inferencia de tipos, genéricos, tipos condicionales, mapped types y características modernas de TypeScript.',
      secondaryTabTitle: 'JavaScript Compilado',
      levelCards: [
        {
          level: 'beginner',
          title: 'Principiante',
          desc: '10 preguntas sobre fundamentos esenciales de tipado e inferencia.',
          topics: ['Type Inference', 'any vs unknown', 'interface vs type', 'readonly', 'Enums', 'Tuplas', 'never'],
        },
        {
          level: 'intermediate',
          title: 'Intermedio',
          desc: '10 preguntas sobre el sistema de tipos en profundidad.',
          topics: ['Generics', 'keyof + T[K]', 'Mapped Types', 'Type Predicates', 'Template Literals'],
        },
        {
          level: 'advanced',
          title: 'Avanzado',
          desc: '10 preguntas sobre características avanzadas y metaprogramación de tipos.',
          topics: ['Tipos Condicionales', 'infer', 'satisfies', 'const params', 'Variadic Tuples', 'NoInfer'],
        },
      ],
    },
  },
  vue: {
    pt: {
      title: 'Vue.js Interview Quiz',
      subtitle: '30 questões sobre Composition API, sistema de reatividade com Proxies, composables, gerenciamento de estado com Pinia e SSR com Nuxt.',
      secondaryTabTitle: 'Código Vue 3',
      levelCards: [
        {
          level: 'beginner',
          title: 'Iniciante',
          desc: '10 questões sobre reatividade fundamental e ciclo de vida do componente.',
          topics: ['ref vs reactive', 'v-model e two-way binding', 'Lifecycle Hooks', 'Computed vs Watch'],
        },
        {
          level: 'intermediate',
          title: 'Intermediário',
          desc: '10 questões sobre Composition API, composables e Pinia.',
          topics: ['Criação de Composables', 'watchEffect', 'Pinia Store Architecture', 'Scoped vs CSS Modules'],
        },
        {
          level: 'advanced',
          title: 'Avançado',
          desc: '10 questões sobre internals de reatividade com Proxy, SSR hydration e performance.',
          topics: ['Reactivity System Internals', 'Custom Directives', 'Hydration Mismatch', 'KeepAlive e Teleport'],
        },
      ],
    },
    en: {
      title: 'Vue.js Interview Quiz',
      subtitle: '30 questions on Composition API, Proxy-based reactivity, composables, Pinia state management, and SSR with Nuxt.',
      secondaryTabTitle: 'Vue 3 Code',
      levelCards: [
        {
          level: 'beginner',
          title: 'Beginner',
          desc: '10 questions on core reactivity fundamentals and component lifecycle.',
          topics: ['ref vs reactive', 'v-model two-way binding', 'Lifecycle Hooks', 'Computed vs Watch'],
        },
        {
          level: 'intermediate',
          title: 'Intermediate',
          desc: '10 questions on Composition API patterns, composables, and Pinia.',
          topics: ['Composable Design', 'watchEffect', 'Pinia Store Architecture', 'Scoped vs CSS Modules'],
        },
        {
          level: 'advanced',
          title: 'Advanced',
          desc: '10 questions on Proxy reactivity internals, SSR hydration, and optimization.',
          topics: ['Reactivity Internals', 'Custom Directives', 'Hydration Mismatch', 'KeepAlive & Teleport'],
        },
      ],
    },
    es: {
      title: 'Vue.js Interview Quiz',
      subtitle: '30 preguntas sobre Composition API, reactividad con Proxies, composables, gestión de estado con Pinia y SSR con Nuxt.',
      secondaryTabTitle: 'Código Vue 3',
      levelCards: [
        {
          level: 'beginner',
          title: 'Principiante',
          desc: '10 preguntas sobre reactividad fundamental y ciclo de vida del componente.',
          topics: ['ref vs reactive', 'v-model y two-way binding', 'Lifecycle Hooks', 'Computed vs Watch'],
        },
        {
          level: 'intermediate',
          title: 'Intermedio',
          desc: '10 preguntas sobre Composition API, composables y Pinia.',
          topics: ['Creación de Composables', 'watchEffect', 'Arquitectura Pinia Store', 'Scoped vs CSS Modules'],
        },
        {
          level: 'advanced',
          title: 'Avanzado',
          desc: '10 preguntas sobre internals de reactividad con Proxy, SSR hydration y rendimiento.',
          topics: ['Internals de Reactividad', 'Directivas Personalizadas', 'Hydration Mismatch', 'KeepAlive y Teleport'],
        },
      ],
    },
  },
  'nodejs-fundamentals': {
    pt: {
      title: 'Node.js Fundamentals Interview Quiz',
      subtitle: '30 questões sobre o Event Loop (libuv), fases de execução, streams, gerenciamento de memória no motor V8 e profiling de CPU.',
      secondaryTabTitle: 'Runtime / Execução',
      levelCards: [
        {
          level: 'beginner',
          title: 'Iniciante',
          desc: '10 questões sobre I/O assíncrono e arquitetura base do Node.js.',
          topics: ['Single-Threaded Model', 'Callbacks e Promises', 'Módulos CommonJS vs ESM', 'Buffer e Arquivos'],
        },
        {
          level: 'intermediate',
          title: 'Intermediário',
          desc: '10 questões sobre as fases do Event Loop e streaming de dados.',
          topics: ['Fases da Libuv', 'process.nextTick vs setImmediate', 'Pipeline de Streams', 'Backpressure'],
        },
        {
          level: 'advanced',
          title: 'Avançado',
          desc: '10 questões sobre internals do V8, Heap, Garbage Collection e Workers.',
          topics: ['Geração e Heap V8', 'Detecção de Memory Leaks', 'Worker Threads vs Clusters', 'CPU Profiling'],
        },
      ],
    },
    en: {
      title: 'Node.js Fundamentals Interview Quiz',
      subtitle: '30 questions on the Event Loop (libuv), execution phases, streams, V8 memory management, and CPU profiling.',
      secondaryTabTitle: 'Runtime / Execution',
      levelCards: [
        {
          level: 'beginner',
          title: 'Beginner',
          desc: '10 questions on async I/O and core Node.js architecture.',
          topics: ['Single-Threaded Model', 'Callbacks & Promises', 'CommonJS vs ESM', 'Buffer & File System'],
        },
        {
          level: 'intermediate',
          title: 'Intermediate',
          desc: '10 questions on Event Loop phases and data streaming.',
          topics: ['libuv Phases', 'process.nextTick vs setImmediate', 'Stream Pipelines', 'Backpressure'],
        },
        {
          level: 'advanced',
          title: 'Advanced',
          desc: '10 questions on V8 internals, heap memory, garbage collection, and workers.',
          topics: ['V8 Heap Generations', 'Memory Leak Detection', 'Worker Threads vs Clusters', 'CPU Profiling'],
        },
      ],
    },
    es: {
      title: 'Node.js Fundamentals Interview Quiz',
      subtitle: '30 preguntas sobre el Event Loop (libuv), fases de ejecución, streams, gestión de memoria en V8 y perfilado de CPU.',
      secondaryTabTitle: 'Runtime / Ejecución',
      levelCards: [
        {
          level: 'beginner',
          title: 'Principiante',
          desc: '10 preguntas sobre I/O asíncrono y arquitectura base de Node.js.',
          topics: ['Modelo Single-Threaded', 'Callbacks y Promesas', 'Módulos CommonJS vs ESM', 'Buffer y Archivos'],
        },
        {
          level: 'intermediate',
          title: 'Intermedio',
          desc: '10 preguntas sobre fases del Event Loop y streaming de datos.',
          topics: ['Fases de Libuv', 'process.nextTick vs setImmediate', 'Pipeline de Streams', 'Backpressure'],
        },
        {
          level: 'advanced',
          title: 'Avanzado',
          desc: '10 preguntas sobre internals de V8, Heap, Garbage Collection y Workers.',
          topics: ['Generaciones V8 Heap', 'Detección de Memory Leaks', 'Worker Threads vs Clusters', 'CPU Profiling'],
        },
      ],
    },
  },
  'database-design': {
    pt: {
      title: 'Database Design Interview Quiz',
      subtitle: '30 questões sobre modelagem relacional, ACID, teorema CAP, estratégias de sharding, CQRS, Event Sourcing e padrões distribuídos.',
      secondaryTabTitle: 'Query Plan / DDL',
      levelCards: [
        {
          level: 'beginner',
          title: 'Iniciante',
          desc: '10 questões sobre fundamentos relacionais e integridade.',
          topics: ['Chaves Primárias', 'Chaves Estrangeiras', 'Normalização (1NF a 3NF)', 'ACID', 'Semântica NULL'],
        },
        {
          level: 'intermediate',
          title: 'Intermediário',
          desc: '10 questões sobre escalabilidade, concorrência e particionamento.',
          topics: ['Teorema CAP', 'Níveis de Isolamento', 'Sharding', 'Replicação Síncrona vs Assíncrona'],
        },
        {
          level: 'advanced',
          title: 'Avançado',
          desc: '10 questões sobre sistemas distribuídos e transações complexas.',
          topics: ['Event Sourcing', 'CQRS', 'Saga Pattern', 'Optimistic vs Pessimistic Locking', 'Two-Phase Commit'],
        },
      ],
    },
    en: {
      title: 'Database Design Interview Quiz',
      subtitle: '30 questions on relational modeling, ACID guarantees, CAP theorem, sharding strategies, CQRS, Event Sourcing, and distributed patterns.',
      secondaryTabTitle: 'Query Plan / DDL',
      levelCards: [
        {
          level: 'beginner',
          title: 'Beginner',
          desc: '10 questions on relational fundamentals and integrity constraints.',
          topics: ['Primary Keys', 'Foreign Keys', 'Normalization (1NF-3NF)', 'ACID Guarantees', 'NULL Semantics'],
        },
        {
          level: 'intermediate',
          title: 'Intermediate',
          desc: '10 questions on scalability, concurrency, and partitioning.',
          topics: ['CAP Theorem', 'Isolation Levels', 'Sharding Strategies', 'Sync vs Async Replication'],
        },
        {
          level: 'advanced',
          title: 'Advanced',
          desc: '10 questions on distributed systems and complex transactional patterns.',
          topics: ['Event Sourcing', 'CQRS', 'Saga Pattern', 'Optimistic vs Pessimistic Locking', 'Two-Phase Commit'],
        },
      ],
    },
    es: {
      title: 'Database Design Interview Quiz',
      subtitle: '30 preguntas sobre modelado relacional, ACID, teorema CAP, estrategias de sharding, CQRS, Event Sourcing y patrones distribuidos.',
      secondaryTabTitle: 'Plan de Consulta / DDL',
      levelCards: [
        {
          level: 'beginner',
          title: 'Principiante',
          desc: '10 preguntas sobre fundamentos relacionales e integridad.',
          topics: ['Claves Primarias', 'Claves Foráneas', 'Normalización (1NF a 3NF)', 'ACID', 'Semántica NULL'],
        },
        {
          level: 'intermediate',
          title: 'Intermedio',
          desc: '10 preguntas sobre escalabilidad, concurrencia y particionamiento.',
          topics: ['Teorema CAP', 'Niveles de Aislamiento', 'Sharding', 'Replicación Síncrona vs Asíncrona'],
        },
        {
          level: 'advanced',
          title: 'Avanzado',
          desc: '10 preguntas sobre sistemas distribuidos y transacciones complejas.',
          topics: ['Event Sourcing', 'CQRS', 'Patrón Saga', 'Bloqueo Optimista vs Pesimista', 'Two-Phase Commit'],
        },
      ],
    },
  },
  'database-indexing': {
    pt: {
      title: 'Database Indexing Interview Quiz',
      subtitle: '30 questões técnicas sobre estruturas de índices B-Tree, índices compostos, covering indexes, scans e otimização no PostgreSQL e MySQL.',
      secondaryTabTitle: 'EXPLAIN / Query Plan',
      levelCards: [
        {
          level: 'beginner',
          title: 'Iniciante',
          desc: '10 questões sobre anatomia de índices e buscas básicas.',
          topics: ['Estrutura B-Tree', 'Sequential Scan vs Index Scan', 'Índices Únicos', 'Custo de Gravação'],
        },
        {
          level: 'intermediate',
          title: 'Intermediário',
          desc: '10 questões sobre índices compostos, ordenação e cardinalidade.',
          topics: ['Leftmost Prefix Rule', 'Covering Indexes', 'Índices Parciais', 'Índices de Expressão'],
        },
        {
          level: 'advanced',
          title: 'Avançado',
          desc: '10 questões sobre tipos especializados e planos de execução.',
          topics: ['GIN e GiST', 'BRIN para Séries Temporais', 'Bloat e VACUUM', 'Leituras Index-Only'],
        },
      ],
    },
    en: {
      title: 'Database Indexing Interview Quiz',
      subtitle: '30 technical questions on B-Tree index internals, composite indexes, covering indexes, scans, and optimization in PostgreSQL and MySQL.',
      secondaryTabTitle: 'EXPLAIN / Query Plan',
      levelCards: [
        {
          level: 'beginner',
          title: 'Beginner',
          desc: '10 questions on index anatomy and fundamental access paths.',
          topics: ['B-Tree Structure', 'Sequential Scan vs Index Scan', 'Unique Indexes', 'Write Overhead'],
        },
        {
          level: 'intermediate',
          title: 'Intermediate',
          desc: '10 questions on composite indexes, column ordering, and cardinality.',
          topics: ['Leftmost Prefix Rule', 'Covering Indexes', 'Partial Indexes', 'Expression Indexes'],
        },
        {
          level: 'advanced',
          title: 'Advanced',
          desc: '10 questions on specialized access methods and query execution plans.',
          topics: ['GIN & GiST', 'BRIN for Time Series', 'Table Bloat & VACUUM', 'Index-Only Scans'],
        },
      ],
    },
    es: {
      title: 'Database Indexing Interview Quiz',
      subtitle: '30 preguntas técnicas sobre estructuras de índices B-Tree, índices compuestos, covering indexes, scans y optimización en PostgreSQL y MySQL.',
      secondaryTabTitle: 'EXPLAIN / Plan de Ejecución',
      levelCards: [
        {
          level: 'beginner',
          title: 'Principiante',
          desc: '10 preguntas sobre anatomía de índices y búsquedas básicas.',
          topics: ['Estructura B-Tree', 'Sequential Scan vs Index Scan', 'Índices Únicos', 'Coste de Escritura'],
        },
        {
          level: 'intermediate',
          title: 'Intermedio',
          desc: '10 preguntas sobre índices compuestos, ordenación y cardinalidad.',
          topics: ['Regla del Prefijo Izquierdo', 'Covering Indexes', 'Índices Parciales', 'Índices de Expresión'],
        },
        {
          level: 'advanced',
          title: 'Avanzado',
          desc: '10 preguntas sobre tipos especializados y planes de ejecución.',
          topics: ['GIN y GiST', 'BRIN para Series Temporales', 'Bloat y VACUUM', 'Lecturas Index-Only'],
        },
      ],
    },
  },
  'messaging-sqs-kafka': {
    pt: {
      title: 'SQS & Kafka Interview Quiz',
      subtitle: '30 questões sobre particionamento, offsets, semânticas de entrega, rebalanceamento de consumidores e streaming distribuído de eventos.',
      secondaryTabTitle: 'Configuração e Código',
      levelCards: [
        {
          level: 'beginner',
          title: 'Iniciante',
          desc: '10 questões sobre conceitos fundamentais de filas e streaming.',
          topics: ['Fila vs Log de Eventos', 'Visibilidade SQS', 'Dead Letter Queues (DLQ)', 'Topicos e Mensagens'],
        },
        {
          level: 'intermediate',
          title: 'Intermediário',
          desc: '10 questões sobre semântica de entrega e grupos de consumidores.',
          topics: ['At-least-once vs Exactly-once', 'Consumer Groups e Partições', 'Compensação de Offsets', 'Idempotência'],
        },
        {
          level: 'advanced',
          title: 'Avançado',
          desc: '10 questões sobre tolerância a falhas, compactação e escala.',
          topics: ['Log Compaction', 'ISR e Fator de Replicação', 'Backpressure', 'Transações em Kafka Streams'],
        },
      ],
    },
    en: {
      title: 'SQS & Kafka Interview Quiz',
      subtitle: '30 questions on partitioning, offsets, delivery semantics, consumer rebalancing, and distributed event streaming.',
      secondaryTabTitle: 'Config & Code',
      levelCards: [
        {
          level: 'beginner',
          title: 'Beginner',
          desc: '10 questions on message queues vs distributed append-only logs.',
          topics: ['Queue vs Event Log', 'SQS Visibility Timeout', 'Dead Letter Queues (DLQ)', 'Topics & Partitions'],
        },
        {
          level: 'intermediate',
          title: 'Intermediate',
          desc: '10 questions on delivery semantics, partitions, and consumer groups.',
          topics: ['At-least-once vs Exactly-once', 'Consumer Groups & Partitions', 'Offset Commits', 'Idempotent Consumers'],
        },
        {
          level: 'advanced',
          title: 'Advanced',
          desc: '10 questions on fault tolerance, compaction, and high-scale streaming.',
          topics: ['Log Compaction', 'ISR & Replication Factor', 'Distributed Backpressure', 'Transactional Kafka Streams'],
        },
      ],
    },
    es: {
      title: 'SQS & Kafka Interview Quiz',
      subtitle: '30 preguntas sobre particionamiento, offsets, semánticas de entrega, rebalanceo de consumidores y streaming distribuido de eventos.',
      secondaryTabTitle: 'Configuración y Código',
      levelCards: [
        {
          level: 'beginner',
          title: 'Principiante',
          desc: '10 preguntas sobre conceptos fundamentales de colas y streaming.',
          topics: ['Cola vs Log de Eventos', 'Visibilidad SQS', 'Dead Letter Queues (DLQ)', 'Tópicos y Mensajes'],
        },
        {
          level: 'intermediate',
          title: 'Intermedio',
          desc: '10 preguntas sobre semántica de entrega y grupos de consumidores.',
          topics: ['At-least-once vs Exactly-once', 'Consumer Groups y Particiones', 'Compensación de Offsets', 'Idempotencia'],
        },
        {
          level: 'advanced',
          title: 'Avanzado',
          desc: '10 preguntas sobre tolerancia a fallos, compactación y escala.',
          topics: ['Log Compaction', 'ISR y Factor de Replicación', 'Backpressure', 'Transacciones en Kafka Streams'],
        },
      ],
    },
  },
  'rabbitmq-concepts': {
    pt: {
      title: 'RabbitMQ Concepts Interview Quiz',
      subtitle: '30 questões sobre tipos de exchange, chaves de roteamento e binding, filas Quorum, confirmações AMQP e topologias de mensageria.',
      secondaryTabTitle: 'Topologia e AMQP',
      levelCards: [
        {
          level: 'beginner',
          title: 'Iniciante',
          desc: '10 questões sobre o modelo AMQP 0-9-1 e conceitos básicos.',
          topics: ['Produtor, Broker e Consumidor', 'Filas e Bindings', 'Exchange Direct vs Fanout', 'Message ACKs'],
        },
        {
          level: 'intermediate',
          title: 'Intermediário',
          desc: '10 questões sobre roteamento por tópicos, cabeçalhos e controle de fluxo.',
          topics: ['Topic Exchanges e Wildcards', 'Prefetch Count / QoS', 'Dead Letter Exchanges (DLX)', 'TTL de Mensagens'],
        },
        {
          level: 'advanced',
          title: 'Avançado',
          desc: '10 questões sobre alta disponibilidade, Quorum Queues e clusterização.',
          topics: ['Algoritmo Raft em Quorum Queues', 'Publisher Confirms', 'Redelivery e Poison Messages', 'Streams no RabbitMQ'],
        },
      ],
    },
    en: {
      title: 'RabbitMQ Concepts Interview Quiz',
      subtitle: '30 questions on exchange types, routing and binding keys, Quorum queues, AMQP acknowledgements, and message topologies.',
      secondaryTabTitle: 'Topology & AMQP',
      levelCards: [
        {
          level: 'beginner',
          title: 'Beginner',
          desc: '10 questions on the AMQP 0-9-1 core model and fundamentals.',
          topics: ['Producer, Broker & Consumer', 'Queues & Bindings', 'Direct vs Fanout Exchange', 'Message ACKs'],
        },
        {
          level: 'intermediate',
          title: 'Intermediate',
          desc: '10 questions on topic routing, headers, and flow control.',
          topics: ['Topic Exchanges & Wildcards', 'Prefetch Count / QoS', 'Dead Letter Exchanges (DLX)', 'Message TTL'],
        },
        {
          level: 'advanced',
          title: 'Advanced',
          desc: '10 questions on high availability, Quorum queues, and clustering.',
          topics: ['Raft in Quorum Queues', 'Publisher Confirms', 'Redelivery & Poison Messages', 'RabbitMQ Streams'],
        },
      ],
    },
    es: {
      title: 'RabbitMQ Concepts Interview Quiz',
      subtitle: '30 preguntas sobre tipos de exchange, claves de enrutamiento y binding, colas Quorum, confirmaciones AMQP y topologías de mensajería.',
      secondaryTabTitle: 'Topología y AMQP',
      levelCards: [
        {
          level: 'beginner',
          title: 'Principiante',
          desc: '10 preguntas sobre el modelo AMQP 0-9-1 y conceptos básicos.',
          topics: ['Productor, Broker y Consumidor', 'Colas y Bindings', 'Exchange Direct vs Fanout', 'Message ACKs'],
        },
        {
          level: 'intermediate',
          title: 'Intermedio',
          desc: '10 preguntas sobre enrutamiento por tópicos, encabezados y control de flujo.',
          topics: ['Topic Exchanges y Wildcards', 'Prefetch Count / QoS', 'Dead Letter Exchanges (DLX)', 'TTL de Mensajes'],
        },
        {
          level: 'advanced',
          title: 'Avanzado',
          desc: '10 preguntas sobre alta disponibilidad, Quorum Queues y clústeres.',
          topics: ['Algoritmo Raft en Quorum Queues', 'Publisher Confirms', 'Redelivery y Poison Messages', 'Streams en RabbitMQ'],
        },
      ],
    },
  },
  'system-architecture': {
    pt: {
      title: 'System Architecture Interview Quiz',
      subtitle: '30 questões sobre microsserviços, padrões de resiliência, esteiras CI/CD, Kubernetes, Saga, Circuit Breaker e observabilidade distribuída.',
      secondaryTabTitle: 'Arquitetura e Fluxo',
      levelCards: [
        {
          level: 'beginner',
          title: 'Iniciante',
          desc: '10 questões sobre princípios fundamentais de arquitetura e infraestrutura.',
          topics: ['REST vs gRPC', 'Load Balancers (L4 vs L7)', 'Stateless vs Stateful', 'Estratégias de Cache'],
        },
        {
          level: 'intermediate',
          title: 'Intermediário',
          desc: '10 questões sobre resiliência, transações distribuídas e entrega contínua.',
          topics: ['Padrão Circuit Breaker', 'Rate Limiting e Leaky Bucket', 'Padrão Saga', 'Idempotência em APIs'],
        },
        {
          level: 'advanced',
          title: 'Avançado',
          desc: '10 questões sobre Kubernetes, Service Mesh, Chaos Engineering e escala global.',
          topics: ['Topologias de Service Mesh', 'Consistência Eventual e CRDTs', 'Chaos Engineering', 'Observabilidade (OpenTelemetry)'],
        },
      ],
    },
    en: {
      title: 'System Architecture Interview Quiz',
      subtitle: '30 questions on microservices, resilience patterns, CI/CD pipelines, Kubernetes, Saga, Circuit Breaker, and distributed observability.',
      secondaryTabTitle: 'Architecture & Flow',
      levelCards: [
        {
          level: 'beginner',
          title: 'Beginner',
          desc: '10 questions on fundamental architectural principles and infrastructure.',
          topics: ['REST vs gRPC', 'Load Balancers (L4 vs L7)', 'Stateless vs Stateful', 'Caching Strategies'],
        },
        {
          level: 'intermediate',
          title: 'Intermediate',
          desc: '10 questions on resilience, distributed transactions, and continuous delivery.',
          topics: ['Circuit Breaker Pattern', 'Rate Limiting & Leaky Bucket', 'Saga Pattern', 'API Idempotency'],
        },
        {
          level: 'advanced',
          title: 'Advanced',
          desc: '10 questions on Kubernetes, service meshes, chaos engineering, and global scale.',
          topics: ['Service Mesh Topologies', 'Eventual Consistency & CRDTs', 'Chaos Engineering', 'Observability (OpenTelemetry)'],
        },
      ],
    },
    es: {
      title: 'System Architecture Interview Quiz',
      subtitle: '30 preguntas sobre microservicios, patrones de resiliencia, pipelines CI/CD, Kubernetes, Saga, Circuit Breaker y observabilidad distribuida.',
      secondaryTabTitle: 'Arquitectura y Flujo',
      levelCards: [
        {
          level: 'beginner',
          title: 'Principiante',
          desc: '10 preguntas sobre principios fundamentales de arquitectura e infraestructura.',
          topics: ['REST vs gRPC', 'Balanceadores de Carga (L4 vs L7)', 'Stateless vs Stateful', 'Estrategias de Cache'],
        },
        {
          level: 'intermediate',
          title: 'Intermedio',
          desc: '10 preguntas sobre resiliencia, transacciones distribuidas y entrega continua.',
          topics: ['Patrón Circuit Breaker', 'Rate Limiting y Leaky Bucket', 'Patrón Saga', 'Idempotencia en APIs'],
        },
        {
          level: 'advanced',
          title: 'Avanzado',
          desc: '10 preguntas sobre Kubernetes, Service Mesh, Chaos Engineering y escala global.',
          topics: ['Topologías de Service Mesh', 'Consistencia Eventual y CRDTs', 'Chaos Engineering', 'Observabilidad (OpenTelemetry)'],
        },
      ],
    },
  },
}

export function getInterviewQuizMeta(slug: string, locale?: string): InterviewQuizMetaData {
  const loc: SupportedLocale = locale === 'pt' || locale === 'es' ? locale : 'en'
  const slugMeta = INTERVIEW_META_BY_SLUG[slug]
  if (slugMeta && slugMeta[loc]) {
    return slugMeta[loc]
  }
  if (slugMeta && slugMeta.en) {
    return slugMeta.en
  }
  return {
    title: 'Technical Interview Drill',
    subtitle: 'Practice technical interview questions with deep explanations and edge cases.',
    secondaryTabTitle: 'Code & Notes',
    levelCards: [],
  }
}
