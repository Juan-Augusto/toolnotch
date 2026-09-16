import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildAlternatesForLocale } from "@/lib/i18nMeta";
import {
  buildJsonLd,
  breadcrumbSchema,
  faqSchema,
  buildLocalizedUrl,
} from "@/lib/schema";
import { TOOL_CATALOG } from "@/lib/toolCatalog";
import AppBreadcrumb from "@/components/AppBreadcrumb";
import AppToolsHub from "@/components/tools/AppToolsHub";
import AppToolsDepth from "@/components/tools/AppToolsDepth";
import type {
  ToolCardData,
  ToolCategoryKey,
} from "@/components/tools/toolsHubConfig";

const PATH = "/tools";

const STUB_PATHS = new Set([
  "/tools/text/paraphraser",
  "/tools/text/summarizer",
  "/tools/text/plagiarism-checker",
  "/tools/finance/crypto-portfolio-tracker",
]);

interface Props {
  params: Promise<{ locale: string }>;
}

const META_TRANSLATIONS = {
  pt: {
    title: "Todas as Ferramentas Online Gratuitas | ToolNotch",
    description:
      "Catálogo completo de ferramentas online gratuitas: PDF, conversores de unidades e moedas, calculadoras financeiras, contadores de texto, sorteios e utilitários sem cadastro.",
    breadcrumb: "Ferramentas",
    keywords: [
      "ferramentas online",
      "ferramentas gratuitas",
      "calculadoras online",
      "mesclar pdf",
      "compressor de imagem",
      "conversor de moedas",
      "calculadora de financiamento",
      "contador de palavras",
      "ToolNotch",
    ],
    faqs: [
      {
        question: "As ferramentas do ToolNotch são gratuitas?",
        answer:
          "Sim! Todas as ferramentas são 100% gratuitas, ilimitadas e funcionam diretamente no navegador sem necessidade de cadastro.",
      },
      {
        question: "Meus arquivos são enviados para servidores?",
        answer:
          "Não. A compactação de imagens e o processamento de PDFs ocorrem diretamente no seu navegador, garantindo privacidade total.",
      },
      {
        question: "As calculadoras funcionam em smartphones?",
        answer:
          "Sim. Toda a plataforma é responsiva e adaptada para celulares, tablets e computadores.",
      },
    ],
  },
  es: {
    title: "Todas las Herramientas Online Gratis | ToolNotch",
    description:
      "Catálogo completo de herramientas online gratuitas: PDF, convertidores de unidades y monedas, calculadoras financieras, contadores de texto y utilidades sin registro.",
    breadcrumb: "Herramientas",
    keywords: [
      "herramientas online",
      "herramientas gratis",
      "calculadoras online",
      "unir pdf",
      "comprimir imagenes",
      "conversor de monedas",
      "calculadora de prestamos",
      "contador de palabras",
      "ToolNotch",
    ],
    faqs: [
      {
        question: "¿Las herramientas de ToolNotch son gratuitas?",
        answer:
          "Sí, todas las herramientas son 100% gratuitas, ilimitadas y funcionan directamente en el navegador sin registro.",
      },
      {
        question: "¿Mis archivos se suben a servidores?",
        answer:
          "No. El procesamiento de imágenes y documentos se realiza de forma local en tu navegador con total privacidad.",
      },
      {
        question: "¿Las calculadoras funcionan en celulares?",
        answer:
          "Sí, toda la interfaz está adaptada para teléfonos móviles, tablets y computadoras de escritorio.",
      },
    ],
  },
  en: {
    title: "All Free Online Tools & Calculators | ToolNotch",
    description:
      "Comprehensive directory of free online tools: PDF editors, unit and currency converters, loan calculators, text analytics, team generators, and browser utilities.",
    breadcrumb: "Tools",
    keywords: [
      "free online tools",
      "online calculators",
      "merge pdf online",
      "image compressor",
      "currency converter live",
      "mortgage calculator",
      "word counter",
      "browser based tools",
      "ToolNotch",
    ],
    faqs: [
      {
        question: "Are ToolNotch tools free to use?",
        answer:
          "Yes! All utilities are 100% free with no subscriptions, limits, or account registration required.",
      },
      {
        question: "Are my files uploaded to a remote server?",
        answer:
          "No. PDF and image processing occurs client-side in your web browser. Your files never leave your device.",
      },
      {
        question: "Do these tools work on mobile devices?",
        answer:
          "Yes. All tools are responsive and optimized for mobile phones, tablets, and desktop computers.",
      },
    ],
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const currentLocale = locale === "pt" || locale === "es" ? locale : "en";
  const meta = META_TRANSLATIONS[currentLocale];
  const localizedUrl = buildLocalizedUrl(PATH, locale);
  const ogLocale =
    locale === "pt" ? "pt_BR" : locale === "es" ? "es_ES" : "en_US";

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    alternates: buildAlternatesForLocale(PATH, locale),
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: localizedUrl,
      siteName: "ToolNotch",
      locale: ogLocale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
    },
  };
}

export default async function ToolsHubPage({ params }: Props) {
  const { locale } = await params;
  const currentLocale = locale === "pt" || locale === "es" ? locale : "en";
  const meta = META_TRANSLATIONS[currentLocale];
  const homeLabel =
    locale === "pt" ? "Início" : locale === "es" ? "Inicio" : "Home";
  const prefix = locale === "en" ? "" : `/${locale}`;
  const localizedUrl = buildLocalizedUrl(PATH, locale);

  const t = await getTranslations({ locale, namespace: "home" });

  const toolCards: ToolCardData[] = TOOL_CATALOG.filter(
    (item) =>
      item.kind === "tool" &&
      item.category !== "interview" &&
      !STUB_PATHS.has(item.path),
  ).map((item) => {
    const title = t.has(`tools.${item.labelKey}.label`)
      ? t(`tools.${item.labelKey}.label`)
      : item.labelKey;
    const description = t.has(`tools.${item.labelKey}.desc`)
      ? t(`tools.${item.labelKey}.desc`)
      : "";

    return {
      id: item.labelKey,
      path: item.path,
      labelKey: item.labelKey,
      title,
      description,
      category: item.category as ToolCategoryKey,
      featured: item.path === "/tools/image/image-compressor",
    };
  });

  const jsonLd = buildJsonLd(
    breadcrumbSchema([
      { name: homeLabel, url: prefix || "/" },
      { name: meta.breadcrumb, url: localizedUrl },
    ]),
    {
      "@type": "ItemList",
      name: meta.title,
      description: meta.description,
      url: localizedUrl,
      numberOfItems: toolCards.length,
      itemListElement: toolCards.map((tool, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        name: tool.title,
        url: buildLocalizedUrl(tool.path, locale),
      })),
    },
    faqSchema([...meta.faqs]),
  );

  return (
    <main className="container min-h-[calc(100vh-180px)] bg-background text-foreground py-3 sm:py-6 md:py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="w-full pb-2 sm:pb-3">
        <AppBreadcrumb
          items={[
            { label: homeLabel, href: prefix || "/" },
            { label: meta.breadcrumb, current: true },
          ]}
        />
      </div>

      <AppToolsHub tools={toolCards} locale={locale} />

      <AppToolsDepth locale={locale} />
    </main>
  );
}
