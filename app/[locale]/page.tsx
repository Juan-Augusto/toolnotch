import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { buildAlternates, localizedPath } from "@/lib/i18nMeta";
import AppCard from "@/components/AppCard";
import AppButton from "@/components/AppButton";
import AppHomeSearch from "@/components/home/AppHomeSearch";
import {
  Wrench,
  HelpCircle,
  BookOpen,
  Briefcase,
  Code2,
  Kanban,
  FileText,
  Sparkles,
  Coins,
  Calculator,
  FileCode,
  ArrowRight,
} from "lucide-react";

export interface ToolItem {
  href: string;
  label: string;
  desc: string;
}

export interface Tool {
  index: number;
  category: string;
  color: string;
  items: ToolItem[];
}

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "site" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: buildAlternates("/"),
  };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });

  const isPt = locale === "pt";
  const isEs = locale === "es";

  // The 4 Primary Pillars
  const cards = [
    {
      title: t("cards.tools.title"),
      desc: t("cards.tools.desc"),
      color: "primary" as const,
      icon: <Wrench className="w-5 h-5 text-primary" />,
      href: "/tools",
    },
    {
      title: t("cards.quizzes.title"),
      desc: t("cards.quizzes.desc"),
      color: "secondary" as const,
      icon: <HelpCircle className="w-5 h-5 text-secondary" />,
      href: "/quizzes",
    },
    {
      title: t("cards.blog.title"),
      desc: t("cards.blog.desc"),
      color: "primary" as const,
      icon: <BookOpen className="w-5 h-5 text-primary" />,
      href: "/blog",
    },
    {
      title: t("cards.interview.title"),
      desc: t("cards.interview.desc"),
      color: "secondary" as const,
      icon: <Briefcase className="w-5 h-5 text-secondary" />,
      href: "/interview",
    },
  ];

  // Minimal Category Links
  const categories = [
    {
      title: isEs ? "Desarrollo & APIs" : isPt ? "Desenvolvimento & APIs" : "Developer & APIs",
      icon: <Code2 className="w-5 h-5 text-primary shrink-0" />,
      href: "/tools/dev",
      count: 10,
    },
    {
      title: isEs ? "Metodologías Ágiles" : isPt ? "Metodologias Ágeis" : "Agile & Scrum",
      icon: <Kanban className="w-5 h-5 text-secondary shrink-0" />,
      href: "/tools/agile",
      count: 5,
    },
    {
      title: isEs ? "PDF & Documentos" : isPt ? "PDFs & Documentos" : "PDF & Documents",
      icon: <FileText className="w-5 h-5 text-primary shrink-0" />,
      href: "/tools/pdf",
      count: 9,
    },
    {
      title: isEs ? "Imágenes & Mídia" : isPt ? "Imagens & Mídia" : "Images & Graphics",
      icon: <Sparkles className="w-5 h-5 text-amber-500 shrink-0" />,
      href: "/tools/image",
      count: 9,
    },
    {
      title: isEs ? "Conversores & Moedas" : isPt ? "Conversores & Moedas" : "Converters & Currency",
      icon: <Coins className="w-5 h-5 text-emerald-500 shrink-0" />,
      href: "/tools/convert",
      count: 6,
    },
    {
      title: isEs ? "Finanzas & Préstamos" : isPt ? "Finanças & Empréstimos" : "Finance & Loans",
      icon: <Calculator className="w-5 h-5 text-sky-500 shrink-0" />,
      href: "/tools/finance",
      count: 14,
    },
    {
      title: isEs ? "Texto & Contadores" : isPt ? "Texto & Análise" : "Text & Analytics",
      icon: <FileCode className="w-5 h-5 text-purple-500 shrink-0" />,
      href: "/tools/text",
      count: 5,
    },
  ];

  return (
    <main className="container min-h-[calc(100vh-180px)] bg-background py-8 sm:py-14 space-y-12 sm:space-y-16">
      {/* 1. HERO SECTION */}
      <section className="space-y-4 sm:space-y-5 max-w-3xl">
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-foreground leading-[1.15]">
          {t.rich("heading", {
            highlight: (chunks) => (
              <span className="text-primary">{chunks}</span>
            ),
          })}
        </h1>

        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl">
          {t("subheading")}
        </p>

        {/* Search */}
        <div className="pt-2">
          <AppHomeSearch
            locale={locale}
            toolsTranslations={t.raw("tools") as Record<string, { label?: string; desc?: string }>}
            categoriesTranslations={t.raw("categories") as Record<string, string>}
            placeholder={
              isEs
                ? "Buscar herramientas, quizzes, artículos..."
                : isPt
                  ? "Pesquisar ferramentas, quizzes, artigos..."
                  : "Search tools, quizzes, articles..."
            }
          />
        </div>
      </section>

      {/* 2. CORE 4 HUBS */}
      <section className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((card) => (
            <AppCard
              key={card.title}
              border
              cornerAccents={false}
              className="flex flex-col justify-between p-5 sm:p-6 bg-tertiary hover:border-primary/60 transition-colors min-h-[260px] space-y-4"
            >
              <div className="space-y-3">
                <div className="w-9 h-9 rounded-[2px] bg-background border border-border flex items-center justify-center shrink-0">
                  {card.icon}
                </div>

                <h2 className="text-sm sm:text-base font-semibold text-foreground uppercase tracking-wide">
                  {card.title}
                </h2>

                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {card.desc}
                </p>
              </div>

              <div className="pt-2">
                <Link href={localizedPath(card.href, locale)} className="inline-block w-full">
                  <AppButton color={card.color} withArrow small className="w-full text-xs">
                    {t("cards.button")}
                  </AppButton>
                </Link>
              </div>
            </AppCard>
          ))}
        </div>
      </section>

      {/* 3. QUICK CATEGORY EXPLORER */}
      <section className="space-y-3">
        <div className="flex items-center justify-between pb-1 text-xs font-mono text-muted-foreground">
          <span className="uppercase font-semibold text-foreground">
            {isEs ? "Categorías de Herramientas" : isPt ? "Categorias de Ferramentas" : "Tool Categories"}
          </span>
          <Link
            href={localizedPath("/tools", locale)}
            className="text-primary hover:underline flex items-center gap-1 font-semibold"
          >
            <span>{isEs ? "Ver catálogo completo" : isPt ? "Ver catálogo completo" : "All tools"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.title}
              href={localizedPath(cat.href, locale)}
              className="p-3.5 bg-tertiary border border-border hover:border-primary/60 rounded-[2px] flex flex-col justify-between gap-3 transition-colors group"
            >
              <div className="flex items-center justify-between">
                {cat.icon}
                <span className="text-xs font-mono text-muted-foreground group-hover:text-primary font-medium">
                  {cat.count}
                </span>
              </div>

              <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors leading-snug">
                {cat.title}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
