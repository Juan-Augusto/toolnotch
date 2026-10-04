import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildAlternatesForLocale, localizedPath } from "@/lib/i18nMeta";
import {
  buildJsonLd,
  webAppSchema,
  faqSchema,
  howToSchema,
  breadcrumbSchema,
  buildLocalizedUrl,
} from "@/lib/schema";
import type { FaqItem } from "@/components/AppFaqSection";
import MergeTool from "./MergeTool";

const PATH = "/tools/pdf/merge-pdf";

interface RichContent {
  whatIs: string;
  howToUse: string[];
  whyItMatters: string;
  proTip: string;
}

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pdf.merge" });
  const localizedUrl = buildLocalizedUrl(PATH, locale);
  const ogLocale =
    locale === "pt" ? "pt_BR" : locale === "es" ? "es_ES" : "en_US";

  const keywords =
    locale === "pt"
      ? [
          "mesclar pdf",
          "combinar pdf",
          "juntar pdf",
          "mesclar pdf online gratis",
          "unir pdf",
          "combinador de pdf",
          "juntar documentos pdf",
          "ferramentas pdf",
        ]
      : locale === "es"
        ? [
            "unir pdf",
            "combinar pdf",
            "juntar pdf",
            "unir pdf online gratis",
            "fusionar pdf",
            "combinador de pdf",
            "herramientas pdf",
          ]
        : [
            "merge pdf",
            "combine pdf",
            "join pdf files",
            "free online pdf merger",
            "merge pdf documents",
            "combine pdf pages",
            "online pdf tools",
          ];

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    keywords,
    alternates: buildAlternatesForLocale(PATH, locale),
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
    openGraph: {
      title: `${t("title")} | ToolNotch`,
      description: t("metaDescription"),
      url: localizedUrl,
      siteName: "ToolNotch",
      locale: ogLocale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${t("title")} | ToolNotch`,
      description: t("metaDescription"),
    },
    category: "technology",
  };
}

export default async function MergePDFPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pdf.merge" });
  const faqs = t.raw("faqs") as FaqItem[];
  const richContent = t.raw("richContent") as RichContent;

  const homeLabel =
    locale === "pt" ? "Início" : locale === "es" ? "Inicio" : "Home";
  const toolsLabel =
    locale === "pt" ? "Ferramentas" : locale === "es" ? "Herramientas" : "Tools";
  const pdfToolsLabel =
    locale === "pt"
      ? "Ferramentas PDF"
      : locale === "es"
        ? "Herramientas PDF"
        : "PDF Tools";
  const localizedUrl = buildLocalizedUrl(PATH, locale);

  const howToSteps = Array.isArray(richContent?.howToUse)
    ? richContent.howToUse.filter(
        (s) => typeof s === "string" && s.trim().length > 0
      )
    : [];

  const howToJsonLd =
    howToSteps.length >= 2 ? howToSchema(t("title"), howToSteps) : null;

  const jsonLd = buildJsonLd(
    breadcrumbSchema([
      { name: homeLabel, url: localizedPath("/", locale) },
      { name: toolsLabel, url: localizedPath("/tools", locale) },
      { name: pdfToolsLabel, url: localizedPath("/tools/pdf", locale) },
      { name: t("title"), url: localizedUrl },
    ]),
    webAppSchema(t("title"), PATH, t("metaDescription"), locale),
    faqSchema(faqs),
    ...(howToJsonLd ? [howToJsonLd] : [])
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <MergeTool
        title={t("title")}
        description={t("description")}
        faqs={faqs}
        richContent={richContent}
        locale={locale}
      />
    </>
  );
}
