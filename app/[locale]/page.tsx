import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { localizedPath } from "@/lib/i18nMeta";
import { buildJsonLd } from "@/lib/schema";
import AppHomeSearch from "@/components/home/AppHomeSearch";
import AppBentoGrid, { type BentoTranslations } from "@/components/home/AppBentoGrid";
import {
  ArrowRight,
  Code2,
  FileText,
  ImageIcon,
  Coins,
  ArrowLeftRight,
  Type,
  Kanban,
  GraduationCap,
  HeartPulse,
  Calculator,
  Wrench,
  Dices,
} from "lucide-react";

interface Props {
  params: Promise<{ locale: string }>;
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://toolnotch.com";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "site" });

  const title = t("title");
  const description = t("description");
  const canonicalUrl = locale === "en" ? BASE_URL : `${BASE_URL}/${locale}`;

  const keywordsByLocale: Record<string, string[]> = {
    pt: [
      "ferramentas online gratuitas",
      "ferramentas pdf",
      "juntar pdf",
      "comprimir pdf",
      "comprimir imagem",
      "converter webp",
      "utilitários para desenvolvedores",
      "formatador json",
      "gerador uuid",
      "simulador de empréstimo",
      "calculadora de financiamento",
      "preparação técnica ti",
      "quizzes online",
      "processamento no navegador",
      "privacidade",
    ],
    es: [
      "herramientas online gratuitas",
      "herramientas pdf",
      "unir pdf",
      "comprimir pdf",
      "comprimir imagenes",
      "convertir a webp",
      "utilidades para desarrolladores",
      "formateador json",
      "generador uuid",
      "simulador de préstamos",
      "calculadora de hipoteca",
      "entrevistas tecnicas it",
      "quizzes interactivos",
      "procesamiento en navegador",
      "privacidad",
    ],
    en: [
      "free online tools",
      "pdf tools",
      "merge pdf",
      "compress pdf",
      "image compressor",
      "convert webp",
      "developer utilities",
      "json formatter",
      "uuid generator",
      "loan calculator",
      "mortgage calculator",
      "tech interview prep",
      "interactive quizzes",
      "client side tools",
      "browser based tools",
      "privacy",
    ],
  };

  return {
    title,
    description,
    keywords: keywordsByLocale[locale] ?? keywordsByLocale.en,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: BASE_URL,
        pt: `${BASE_URL}/pt`,
        es: `${BASE_URL}/es`,
        "x-default": BASE_URL,
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "ToolNotch",
      locale: locale === "pt" ? "pt_BR" : locale === "es" ? "es_ES" : "en_US",
      type: "website",
      images: [
        {
          url: `${BASE_URL}/opengraph-image.png`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${BASE_URL}/opengraph-image.png`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });
  const tSite = await getTranslations({ locale, namespace: "site" });

  const isPt = locale === "pt";
  const isEs = locale === "es";

  const bentoTranslations = t.raw("bento") as unknown as BentoTranslations;

  const categories = [
    {
      title: isEs ? "Desarrollo" : isPt ? "Desenvolvimento" : "Developer",
      href: "/tools/dev",
      count: 10,
      icon: Code2,
    },
    {
      title: "PDF",
      href: "/tools/pdf",
      count: 9,
      icon: FileText,
    },
    {
      title: isEs ? "Imágenes" : isPt ? "Imagens" : "Images",
      href: "/tools/image",
      count: 9,
      icon: ImageIcon,
    },
    {
      title: isEs ? "Finanzas" : isPt ? "Finanças" : "Finance",
      href: "/tools/finance",
      count: 14,
      icon: Coins,
    },
    {
      title: isEs ? "Conversores" : isPt ? "Conversores" : "Converters",
      href: "/tools/convert",
      count: 6,
      icon: ArrowLeftRight,
    },
    {
      title: isEs ? "Texto" : isPt ? "Texto" : "Text",
      href: "/tools/text",
      count: 5,
      icon: Type,
    },
    {
      title: isEs ? "Ágil & Scrum" : isPt ? "Ágil & Scrum" : "Agile",
      href: "/tools/agile",
      count: 5,
      icon: Kanban,
    },
    {
      title: isEs ? "Educación" : isPt ? "Educação" : "Education",
      href: "/tools/education",
      count: 4,
      icon: GraduationCap,
    },
    {
      title: isEs ? "Salud" : isPt ? "Saúde" : "Health",
      href: "/tools/health",
      count: 3,
      icon: HeartPulse,
    },
    {
      title: isEs ? "Matemática" : isPt ? "Matemática" : "Math",
      href: "/tools/math",
      count: 2,
      icon: Calculator,
    },
    {
      title: isEs ? "Utilitarios" : isPt ? "Utilitários" : "Utilities",
      href: "/tools/utilities",
      count: 3,
      icon: Wrench,
    },
    {
      title: isEs ? "Sorteos" : isPt ? "Sorteios" : "Random",
      href: "/tools/fun",
      count: 10,
      icon: Dices,
    },
  ];

  const canonicalUrl = locale === "en" ? BASE_URL : `${BASE_URL}/${locale}`;
  const siteTitle = tSite("title");
  const siteDescription = tSite("description");

  const webSiteSchema = {
    "@type": "WebSite",
    name: "ToolNotch",
    url: BASE_URL,
    description: siteDescription,
    inLanguage: locale === "pt" ? "pt-BR" : locale === "es" ? "es" : "en",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${BASE_URL}${localizedPath("/tools", locale)}?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  const organizationSchema = {
    "@type": "Organization",
    name: "ToolNotch",
    url: BASE_URL,
    logo: `${BASE_URL}/opengraph-image.png`,
    sameAs: ["https://github.com/Juan-Augusto/toolnotch"],
  };

  const collectionPageSchema = {
    "@type": "CollectionPage",
    name: siteTitle,
    description: siteDescription,
    url: canonicalUrl,
    inLanguage: locale === "pt" ? "pt-BR" : locale === "es" ? "es" : "en",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: categories.length,
      itemListElement: categories.map((cat, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        name: cat.title,
        url: `${BASE_URL}${localizedPath(cat.href, locale)}`,
      })),
    },
  };

  const jsonLd = buildJsonLd(webSiteSchema, organizationSchema, collectionPageSchema);

  return (
    <main className="container min-h-[calc(100vh-180px)] bg-background py-6 sm:py-8 space-y-6 sm:space-y-8">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. BENTO GRID with Integrated Search & Flagship Card */}
      <AppBentoGrid
        locale={locale}
        bento={bentoTranslations}
        searchSlot={
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
        }
      />

      {/* 2. CATEGORIES SECTION */}
      <section className="pt-2 space-y-3" aria-labelledby="categories-heading">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 text-sm font-mono text-muted-foreground border-b border-border">
          <h2
            id="categories-heading"
            className="uppercase font-semibold text-foreground tracking-wide text-sm font-mono"
          >
            {bentoTranslations.categorySection?.title ||
              (isEs ? "Categorías" : isPt ? "Categorias" : "Categories")}
          </h2>
          <Link
            href={localizedPath("/tools", locale)}
            className="text-primary hover:underline flex items-center gap-1.5 font-semibold text-sm"
          >
            <span>
              {bentoTranslations.categorySection?.viewAll ||
                (isEs ? "Ver catálogo completo" : isPt ? "Ver catálogo completo" : "All tools")}
            </span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.title}
                href={localizedPath(cat.href, locale)}
                className="p-3.5 bg-tertiary border border-border rounded-[2px] flex flex-col justify-between gap-3 group transition-colors hover:bg-background"
              >
                <div className="flex items-center justify-between">
                  <Icon className="w-5 h-5 text-primary shrink-0" />
                  <span className="text-xs font-mono text-muted-foreground group-hover:text-primary font-medium">
                    {cat.count}
                  </span>
                </div>

                <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors leading-snug">
                  {cat.title}
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
