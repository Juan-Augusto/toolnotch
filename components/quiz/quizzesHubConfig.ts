import type { LucideIcon } from "lucide-react";
import { Brain, Landmark, Settings, Volleyball } from "lucide-react";

export type QuizCategoryKey = "sports" | "personality" | "backend" | "civic";

export const DEFAULT_CATEGORY_KEYS: QuizCategoryKey[] = [
  "sports",
  "personality",
  "backend",
  "civic",
];

export interface QuizCardData {
  id: string;
  title: string;
  description: string;
  category: QuizCategoryKey;
  questionCount: number;
  type?: "personality" | "trivia";
}

export interface AppQuizzesHubProps {
  quizzes: QuizCardData[];
  locale?: string;
}

export interface CategoryDisplayConfig {
  name: Record<string, string>;
  badgeColor: string;
  badgeBg: string;
  icon: LucideIcon;
}

export const CATEGORY_CONFIG: Record<string, CategoryDisplayConfig> = {
  sports: {
    name: {
      pt: "ESPORTES",
      es: "DEPORTES",
      en: "SPORTS",
    },
    badgeColor: "text-background",
    badgeBg: "bg-green-400",
    icon: Volleyball,
  },
  personality: {
    name: {
      pt: "PERSONALIDADE",
      es: "PERSONALIDAD",
      en: "PERSONALITY",
    },
    badgeColor: "text-background",
    badgeBg: "bg-purple-400",
    icon: Brain,
  },
  backend: {
    name: {
      pt: "BACKEND",
      es: "BACKEND",
      en: "BACKEND",
    },
    badgeColor: "text-background",
    badgeBg: "bg-orange-400",
    icon: Settings,
  },
  civic: {
    name: {
      pt: "CÍVICO & MÍDIA",
      es: "CÍVICO Y MEDIOS",
      en: "CIVIC & MEDIA LITERACY",
    },
    badgeColor: "text-background",
    badgeBg: "bg-blue-400",
    icon: Landmark,
  },
};

export const I18N_LABELS = {
  pt: {
    heading: "TODOS OS QUIZZES",
    tag: "QUIZZES INTERATIVOS",
    subtitle:
      "Desafios rápidos, testes de personalidade e trivias interativas sem necessidade de cadastro.",
    allCategories: "TODOS",
    searchBtn: "BUSCAR",
    closeSearch: "FECHAR",
    searchPlaceholder: "pesquisar...",
    featured: "EM DESTAQUE",
    startQuiz: "COMEÇAR QUIZ",
    playQuiz: "JOGAR QUIZ",
    questionsLabel: "PERGUNTAS",
    minLabel: "MIN",
    quizzesCount: "quizzes",
    noResults: "Nenhum quiz encontrado.",
    clearFilters: "Limpar filtros",
    perks: ["100% GRATUITO", "SEM CADASTRO", "RESULTADO INSTANTÂNEO"],
  },
  es: {
    heading: "TODOS LOS QUIZZES",
    tag: "QUIZZES INTERACTIVOS",
    subtitle:
      "Desafíos rápidos, tests de personalidad e trivias interactivas sin registro necesario.",
    allCategories: "TODOS",
    searchBtn: "BUSCAR",
    closeSearch: "CERRAR",
    searchPlaceholder: "pesquisar...",
    featured: "DESTACADO",
    startQuiz: "COMENZAR QUIZ",
    playQuiz: "JUGAR QUIZ",
    questionsLabel: "PREGUNTAS",
    minLabel: "MIN",
    quizzesCount: "quizzes",
    noResults: "No se encontraron quizzes.",
    clearFilters: "Limpiar filtros",
    perks: ["100% GRATUITO", "SIN REGISTRO", "RESULTADO INSTANTÂNEO"],
  },
  en: {
    heading: "ALL QUIZZES",
    tag: "INTERACTIVE QUIZZES",
    subtitle:
      "Quick challenges, personality tests, and interactive trivia with no sign-up required.",
    allCategories: "ALL",
    searchBtn: "SEARCH",
    closeSearch: "CLOSE",
    searchPlaceholder: "search...",
    featured: "FEATURED",
    startQuiz: "START QUIZ",
    playQuiz: "PLAY QUIZ",
    questionsLabel: "QUESTIONS",
    minLabel: "MIN",
    quizzesCount: "quizzes",
    noResults: "No quizzes found.",
    clearFilters: "Clear filters",
    perks: ["100% FREE", "NO SIGN-UP", "INSTANT RESULTS"],
  },
};

export type QuizzesHubLabels = typeof I18N_LABELS.pt;
