import type { LucideIcon } from "lucide-react";
import {
  Landmark,
  Activity,
  FileText,
  GraduationCap,
  Clock,
  Code2,
  Sparkles,
} from "lucide-react";
import type { BlogPost } from "@/lib/blogTypes";

export type BlogCategoryKey = BlogPost["category"];

export const DEFAULT_BLOG_CATEGORY_KEYS: BlogCategoryKey[] = [
  "engineering",
  "finance",
  "health",
  "text",
  "education",
  "productivity",
  "fun",
];

export interface BlogCardData {
  slug: string;
  title: string;
  description: string;
  category: BlogCategoryKey;
  publishedAt: string;
  updatedAt?: string;
  readingTimeMinutes: number;
  tags?: string[];
  relatedToolPath?: string;
}

export interface BlogCategoryDisplayConfig {
  name: Record<string, string>;
  badgeColor: string;
  badgeBg: string;
  icon: LucideIcon;
}

export const BLOG_CATEGORY_CONFIG: Record<
  BlogCategoryKey,
  BlogCategoryDisplayConfig
> = {
  engineering: {
    name: {
      pt: "ENGENHARIA",
      es: "INGENIERÍA",
      en: "ENGINEERING",
    },
    badgeColor: "text-white dark:text-black",
    badgeBg: "bg-cyan-400",
    icon: Code2,
  },
  finance: {
    name: {
      pt: "FINANÇAS",
      es: "FINANZAS",
      en: "FINANCE",
    },
    badgeColor: "text-white dark:text-black",
    badgeBg: "bg-emerald-400",
    icon: Landmark,
  },
  health: {
    name: {
      pt: "SAÚDE",
      es: "SALUD",
      en: "HEALTH",
    },
    badgeColor: "text-white dark:text-black",
    badgeBg: "bg-rose-400",
    icon: Activity,
  },
  text: {
    name: {
      pt: "TEXTO",
      es: "TEXTO",
      en: "TEXT",
    },
    badgeColor: "text-white dark:text-black",
    badgeBg: "bg-purple-400",
    icon: FileText,
  },
  education: {
    name: {
      pt: "EDUCAÇÃO",
      es: "EDUCACIÓN",
      en: "EDUCATION",
    },
    badgeColor: "text-white dark:text-black",
    badgeBg: "bg-amber-500",
    icon: GraduationCap,
  },
  productivity: {
    name: {
      pt: "PRODUTIVIDADE",
      es: "PRODUCTIVIDAD",
      en: "PRODUCTIVITY",
    },
    badgeColor: "text-white dark:text-black",
    badgeBg: "bg-blue-400",
    icon: Clock,
  },
  fun: {
    name: {
      pt: "DIVERSÃO",
      es: "DIVERSIÓN",
      en: "FUN",
    },
    badgeColor: "text-white dark:text-black",
    badgeBg: "bg-pink-400",
    icon: Sparkles,
  },
};

export interface BlogHubLabels {
  heading: string;
  subtitle: string;
  allCategories: string;
  searchPlaceholder: string;
  noResults: string;
  clearFilters: string;
  readArticle: string;
  minRead: (n: number) => string;
  featured: string;
  articlesCount: string;
  allBadge: string;
}

export const BLOG_I18N_LABELS: Record<string, BlogHubLabels> = {
  pt: {
    heading: "Blog & Guias Práticos",
    subtitle:
      "Aprenda a fórmula por trás de cada ferramenta, entenda a matemática e confira dicas práticas sem enrolação.",
    allCategories: "Todos",
    searchPlaceholder: "pesquisar...",
    noResults: "Nenhum artigo encontrado para sua busca.",
    clearFilters: "Limpar filtros",
    readArticle: "Ler artigo",
    minRead: (n: number) => `${n} min de leitura`,
    featured: "Artigo em Destaque",
    articlesCount: "artigos",
    allBadge: "GUIAS & TUTORIAIS",
  },
  es: {
    heading: "Blog y Guías Prácticas",
    subtitle:
      "Aprende la fórmula detrás de cada herramienta, entiende las matemáticas y descubre consejos prácticos.",
    allCategories: "Todos",
    searchPlaceholder: "buscar...",
    noResults: "No se encontraron artículos para tu búsqueda.",
    clearFilters: "Limpiar filtros",
    readArticle: "Leer artículo",
    minRead: (n: number) => `${n} min de lectura`,
    featured: "Artículo Destacado",
    articlesCount: "artículos",
    allBadge: "GUÍAS Y TUTORIALES",
  },
  en: {
    heading: "Blog & Practical Guides",
    subtitle:
      "Learn the formulas behind each tool, understand the math, and explore practical tips with zero fluff.",
    allCategories: "All",
    searchPlaceholder: "search...",
    noResults: "No articles found matching your search.",
    clearFilters: "Clear filters",
    readArticle: "Read article",
    minRead: (n: number) => `${n} min read`,
    featured: "Featured Article",
    articlesCount: "articles",
    allBadge: "GUIDES & TUTORIALS",
  },
};
