import type { LucideIcon } from "lucide-react";
import {
  FileText,
  Image,
  ArrowLeftRight,
  AlignLeft,
  Landmark,
  Sparkles,
  Users,
  GraduationCap,
  Activity,
  Calculator,
  Wrench,
} from "lucide-react";

export type ToolCategoryKey =
  | "pdf"
  | "image"
  | "convert"
  | "text"
  | "finance"
  | "fun"
  | "agile"
  | "education"
  | "health"
  | "math"
  | "utilities";

export const DEFAULT_TOOL_CATEGORY_KEYS: ToolCategoryKey[] = [
  "pdf",
  "image",
  "convert",
  "text",
  "finance",
  "fun",
  "agile",
  "education",
  "health",
  "math",
  "utilities",
];

export interface ToolCardData {
  id: string;
  path: string;
  labelKey: string;
  title: string;
  description: string;
  category: ToolCategoryKey;
  featured?: boolean;
}

export interface ToolCategoryDisplayConfig {
  name: Record<string, string>;
  badgeColor: string;
  badgeBg: string;
  icon: LucideIcon;
}

export const TOOL_CATEGORY_CONFIG: Record<
  ToolCategoryKey,
  ToolCategoryDisplayConfig
> = {
  pdf: {
    name: {
      pt: "PDF",
      es: "PDF",
      en: "PDF",
    },
    badgeColor: "text-white dark:text-black",
    badgeBg: "bg-red-500",
    icon: FileText,
  },
  image: {
    name: {
      pt: "IMAGEM",
      es: "IMAGEN",
      en: "IMAGE",
    },
    badgeColor: "text-white dark:text-black",
    badgeBg: "bg-pink-500 dark:bg-pink-400",
    icon: Image,
  },
  convert: {
    name: {
      pt: "CONVERSORES",
      es: "CONVERSORES",
      en: "CONVERTERS",
    },
    badgeColor: "text-white dark:text-black",
    badgeBg: "bg-amber-500 dark:bg-amber-400",
    icon: ArrowLeftRight,
  },
  text: {
    name: {
      pt: "TEXTO",
      es: "TEXTO",
      en: "TEXT",
    },
    badgeColor: "text-white dark:text-black",
    badgeBg: "bg-blue-500 dark:bg-blue-400",
    icon: AlignLeft,
  },
  finance: {
    name: {
      pt: "FINANÇAS",
      es: "FINANZAS",
      en: "FINANCE",
    },
    badgeColor: "text-white dark:text-black",
    badgeBg: "bg-emerald-500 dark:bg-emerald-400",
    icon: Landmark,
  },
  fun: {
    name: {
      pt: "LAZER & JOGOS",
      es: "JUEGOS Y AZAR",
      en: "FUN & RANDOM",
    },
    badgeColor: "text-white dark:text-black",
    badgeBg: "bg-purple-500 dark:bg-purple-400",
    icon: Sparkles,
  },
  agile: {
    name: {
      pt: "ÁGIL & SCRUM",
      es: "ÁGIL Y SCRUM",
      en: "AGILE & SCRUM",
    },
    badgeColor: "text-white dark:text-black",
    badgeBg: "bg-cyan-500 dark:bg-cyan-400",
    icon: Users,
  },
  education: {
    name: {
      pt: "EDUCAÇÃO",
      es: "EDUCACIÓN",
      en: "EDUCATION",
    },
    badgeColor: "text-white dark:text-black",
    badgeBg: "bg-indigo-500 dark:bg-indigo-400",
    icon: GraduationCap,
  },
  health: {
    name: {
      pt: "SAÚDE",
      es: "SALUD",
      en: "HEALTH",
    },
    badgeColor: "text-white dark:text-black",
    badgeBg: "bg-rose-500 dark:bg-rose-400",
    icon: Activity,
  },
  math: {
    name: {
      pt: "MATEMÁTICA",
      es: "MATEMÁTICAS",
      en: "MATH",
    },
    badgeColor: "text-white dark:text-black",
    badgeBg: "bg-orange-500 dark:bg-orange-400",
    icon: Calculator,
  },
  utilities: {
    name: {
      pt: "UTILITÁRIOS",
      es: "UTILIDADES",
      en: "UTILITIES",
    },
    badgeColor: "text-white dark:text-black",
    badgeBg: "bg-teal-500 dark:bg-teal-400",
    icon: Wrench,
  },
};

export interface ToolsHubLabels {
  heading: string;
  subtitle: string;
  allCategories: string;
  searchPlaceholder: string;
  noResults: string;
  clearFilters: string;
  useTool: string;
  featured: string;
  toolsCount: string;
  viewCards: string;
  viewList: string;
}

export const TOOLS_I18N_LABELS: Record<string, ToolsHubLabels> = {
  pt: {
    heading: "TODAS AS FERRAMENTAS",
    subtitle:
      "Calculadoras, utilitários, conversores e processadores de arquivos 100% gratuitos e que rodam direto no navegador.",
    allCategories: "TODOS",
    searchPlaceholder: "pesquisar...",
    noResults: "Nenhuma ferramenta encontrada para sua busca.",
    clearFilters: "Limpar filtros",
    useTool: "USAR FERRAMENTA",
    featured: "EM DESTAQUE",
    toolsCount: "ferramentas",
    viewCards: "Cards",
    viewList: "Lista",
  },
  es: {
    heading: "TODAS LAS HERRAMIENTAS",
    subtitle:
      "Calculadoras, utilidades, conversores y procesadores de archivos 100% gratis que funcionan directo en tu navegador.",
    allCategories: "TODOS",
    searchPlaceholder: "buscar...",
    noResults: "No se encontraron herramientas para tu búsqueda.",
    clearFilters: "Limpar filtros",
    useTool: "USAR HERRAMIENTA",
    featured: "DESTACADO",
    toolsCount: "herramientas",
    viewCards: "Tarjetas",
    viewList: "Lista",
  },
  en: {
    heading: "ALL TOOLS",
    subtitle:
      "Calculators, utilities, converters, and file processors — 100% free and running entirely in your browser.",
    allCategories: "ALL",
    searchPlaceholder: "search...",
    noResults: "No tools found matching your search.",
    clearFilters: "Clear filters",
    useTool: "USE TOOL",
    featured: "FEATURED",
    toolsCount: "tools",
    viewCards: "Cards",
    viewList: "List",
  },
};

export function getToolsHubLabels(locale: string = "pt"): ToolsHubLabels {
  return TOOLS_I18N_LABELS[locale] || TOOLS_I18N_LABELS.pt;
}
