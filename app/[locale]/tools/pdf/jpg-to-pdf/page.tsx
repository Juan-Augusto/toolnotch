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
import JpgToPdfTool from "./JpgToPdfTool";

const PATH = "/tools/pdf/jpg-to-pdf";

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
  const t = await getTranslations({ locale, namespace: "pdf.jpgToPdf" });
  const localizedUrl = buildLocalizedUrl(PATH, locale);
  const ogLocale =
    locale === "pt" ? "pt_BR" : locale === "es" ? "es_ES" : "en_US";

  const keywords =
    locale === "pt"
      ? [
          "converter jpg para pdf",
          "jpg para pdf",
          "transformar imagem em pdf",
          "converter png para pdf",
          "juntar imagens em pdf",
          "jpg para pdf online",
          "converter fotos em pdf",
          "ferramentas pdf",
        ]
      : locale === "es"
        ? [
            "convertir jpg a pdf",
            "jpg a pdf",
            "transformar imagenes en pdf",
            "convertir png a pdf",
            "unir imagenes en pdf",
            "jpg a pdf online",
            "fotos a pdf",
            "herramientas pdf",
          ]
        : [
            "jpg to pdf",
            "convert jpg to pdf",
            "image to pdf converter",
            "png to pdf",
            "combine images into pdf",
            "jpg to pdf online free",
            "photos to pdf",
            "pdf tools",
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

export default async function JpgToPdfPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pdf.jpgToPdf" });
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
    ? richContent.howToUse.filter((s) => typeof s === "string" && s.trim().length > 0)
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
    webAppSchema(
      t("title"),
      PATH,
      t("metaDescription"),
      locale,
    ),
    faqSchema(faqs),
    ...(howToJsonLd ? [howToJsonLd] : []),
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <JpgToPdfTool
        title={t("title")}
        description={t("description")}
        faqs={faqs}
        richContent={richContent}
        locale={locale}
      />
    </>
  );
}
