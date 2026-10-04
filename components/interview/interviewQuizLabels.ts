import type { QuizLevel } from '@/lib/interviewTypes'

export interface EvaluationMessage {
  title: string
  desc: string
}

export interface InterviewQuizLabels {
  levelLabels: Record<'all' | QuizLevel, string>
  selectLevel: string
  startQuiz: string
  questionsSummary: (count: number, minutes: number) => string
  question: string
  questionOf: (current: number, total: number) => string
  questionNumTopic: (current: number, topic: string) => string
  completed: string
  explanation: string
  reference: string
  bestPractice: string
  defaultSecondaryTab: string
  previous: string
  next: string
  viewResults: string
  resultBadge: string
  scoreSummary: (scoreRatio: number, title: string) => string
  evaluations: {
    high: EvaluationMessage
    mid: EvaluationMessage
    low: EvaluationMessage
  }
  retake: string
  chooseLevel: string
  otherDrills: string
  reviewHeading: string
  correct: string
  incorrect: string
  yourAnswer: string
  correctAnswer: string
}

export const INTERVIEW_QUIZ_LABELS: Record<'pt' | 'en' | 'es', InterviewQuizLabels> = {
  pt: {
    levelLabels: {
      all: 'Todos os Níveis',
      beginner: 'Iniciante',
      intermediate: 'Intermediário',
      advanced: 'Avançado',
    },
    selectLevel: 'Selecione o nível:',
    startQuiz: 'Começar Simulado',
    questionsSummary: (count, minutes) => `${count} questões • 3 níveis • ~${minutes} min`,
    question: 'Questão',
    questionOf: (current, total) => `Questão ${String(current).padStart(2, '0')} / ${String(total).padStart(2, '0')}`,
    questionNumTopic: (current, topic) => `Questão ${current} • ${topic}`,
    completed: 'Concluído',
    explanation: 'Explicação',
    reference: 'Referência:',
    bestPractice: 'Dica Prática',
    defaultSecondaryTab: 'Código e Compilação',
    previous: 'Anterior',
    next: 'Próxima',
    viewResults: 'Ver Resultados',
    resultBadge: 'Resultado do Simulado',
    scoreSummary: (scoreRatio, title) => `${scoreRatio}% de aproveitamento • ${title}`,
    evaluations: {
      high: {
        title: 'Mandou Muito Bem!',
        desc: 'Excelente domínio dos fundamentos e decisões arquiteturais. Você demonstrou consistência na análise técnica de produção.',
      },
      mid: {
        title: 'Bom Desempenho',
        desc: 'Boa base teórica e prática. Focar nos cenários de concorrência e detalhes de baixo nível levará suas respostas ao patamar sênior.',
      },
      low: {
        title: 'Vale uma Revisão',
        desc: 'Alguns tópicos cruciais exigem atenção antes de entrevistas reais. Revise os pontos onde houve dúvida para consolidar os conceitos.',
      },
    },
    retake: 'Refazer Simulado',
    chooseLevel: 'Escolher Outro Nível',
    otherDrills: 'Outros Simulados',
    reviewHeading: 'Revisão Questão por Questão',
    correct: 'Correta',
    incorrect: 'Incorreta',
    yourAnswer: 'Sua resposta:',
    correctAnswer: 'Resposta correta:',
  },
  en: {
    levelLabels: {
      all: 'All Levels',
      beginner: 'Beginner',
      intermediate: 'Intermediate',
      advanced: 'Advanced',
    },
    selectLevel: 'Select level:',
    startQuiz: 'Start Drill',
    questionsSummary: (count, minutes) => `${count} questions • 3 levels • ~${minutes} min`,
    question: 'Question',
    questionOf: (current, total) => `Question ${String(current).padStart(2, '0')} / ${String(total).padStart(2, '0')}`,
    questionNumTopic: (current, topic) => `Question ${current} • ${topic}`,
    completed: 'Completed',
    explanation: 'Explanation',
    reference: 'Reference:',
    bestPractice: 'Best Practice',
    defaultSecondaryTab: 'Code & Compilation',
    previous: 'Previous',
    next: 'Next',
    viewResults: 'View Results',
    resultBadge: 'Drill Results',
    scoreSummary: (scoreRatio, title) => `${scoreRatio}% score • ${title}`,
    evaluations: {
      high: {
        title: 'Outstanding Performance!',
        desc: 'Excellent grasp of fundamentals and architectural decisions. You demonstrated strong consistency in production-level technical analysis.',
      },
      mid: {
        title: 'Solid Performance',
        desc: 'Good theoretical and practical foundation. Focusing on concurrency scenarios and lower-level internals will elevate your answers to a senior level.',
      },
      low: {
        title: 'Worth a Review',
        desc: 'Some crucial topics require attention before real interviews. Review the areas where you hesitated to consolidate the concepts.',
      },
    },
    retake: 'Retake Drill',
    chooseLevel: 'Choose Another Level',
    otherDrills: 'Other Drills',
    reviewHeading: 'Question-by-Question Review',
    correct: 'Correct',
    incorrect: 'Incorrect',
    yourAnswer: 'Your answer:',
    correctAnswer: 'Correct answer:',
  },
  es: {
    levelLabels: {
      all: 'Todos los Niveles',
      beginner: 'Principiante',
      intermediate: 'Intermedio',
      advanced: 'Avanzado',
    },
    selectLevel: 'Selecciona el nivel:',
    startQuiz: 'Comenzar Simulador',
    questionsSummary: (count, minutes) => `${count} preguntas • 3 niveles • ~${minutes} min`,
    question: 'Pregunta',
    questionOf: (current, total) => `Pregunta ${String(current).padStart(2, '0')} / ${String(total).padStart(2, '0')}`,
    questionNumTopic: (current, topic) => `Pregunta ${current} • ${topic}`,
    completed: 'Completado',
    explanation: 'Explicación',
    reference: 'Referencia:',
    bestPractice: 'Consejo Práctico',
    defaultSecondaryTab: 'Código y Compilación',
    previous: 'Anterior',
    next: 'Siguiente',
    viewResults: 'Ver Resultados',
    resultBadge: 'Resultado del Simulador',
    scoreSummary: (scoreRatio, title) => `${scoreRatio}% de aciertos • ${title}`,
    evaluations: {
      high: {
        title: '¡Excelente Desempeño!',
        desc: 'Excelente dominio de los fundamentos y decisiones arquitectónicas. Demostraste consistencia en el análisis técnico de producción.',
      },
      mid: {
        title: 'Buen Desempeño',
        desc: 'Buena base teórica e práctica. Enfocarte en escenarios de concurrencia y detalles de bajo nivel llevará tus respuestas al nivel sénior.',
      },
      low: {
        title: 'Vale una Revisión',
        desc: 'Algunos temas cruciales exigen atención antes de entrevistas reales. Revisa los puntos donde hubo dudas para consolidar los conceptos.',
      },
    },
    retake: 'Repetir Simulador',
    chooseLevel: 'Elegir Otro Nivel',
    otherDrills: 'Otros Simuladores',
    reviewHeading: 'Revisión Pregunta por Pregunta',
    correct: 'Correcta',
    incorrect: 'Incorrecta',
    yourAnswer: 'Tu respuesta:',
    correctAnswer: 'Respuesta correcta:',
  },
}

export function getInterviewQuizLabels(locale?: string): InterviewQuizLabels {
  const loc = locale === 'pt' || locale === 'es' ? locale : 'en'
  return INTERVIEW_QUIZ_LABELS[loc]
}
