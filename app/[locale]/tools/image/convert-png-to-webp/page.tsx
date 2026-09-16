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
import ConvertPngToWebpTool from "./ConvertPngToWebpTool";

const PATH = "/tools/image/convert-png-to-webp";

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
  const t = await getTranslations({
    locale,
    namespace: "image.convertPngToWebp",
  });
  const localizedUrl = buildLocalizedUrl(PATH, locale);
  const ogLocale =
    locale === "pt" ? "pt_BR" : locale === "es" ? "es_ES" : "en_US";

  const keywords =
    locale === "pt"
      ? [
          "converter png para webp",
          "png para webp",
          "transformar png em webp",
          "converter png para webp online",
          "png para webp gratis",
          "otimizar png para webp",
          "converter imagem em webp",
          "conversor de imagens",
          "reduzir tamanho png",
        ]
      : locale === "es"
        ? [
            "convertir png a webp",
            "png a webp",
            "transformar png en webp",
            "convertir png a webp online",
            "png a webp gratis",
            "optimizar imagenes webp",
            "convertir imagen en webp",
            "convertidor de imagenes",
            "reducir tamano png",
          ]
        : [
            "convert png to webp",
            "png to webp",
            "png to webp converter",
            "convert png to webp online free",
            "free webp converter",
            "optimize png to webp",
            "shrink png with webp",
            "image converter online",
            "transparent png to webp",
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

export default async function ConvertPngToWebpPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "image.convertPngToWebp",
  });
  const faqs = t.raw("faqs") as FaqItem[];
  const richContent = t.raw("richContent") as RichContent;

  const homeLabel =
    locale === "pt" ? "Início" : locale === "es" ? "Inicio" : "Home";
  const toolsLabel =
    locale === "pt" ? "Ferramentas" : locale === "es" ? "Herramientas" : "Tools";
  const localizedUrl = buildLocalizedUrl(PATH, locale);

  const howToSteps = Array.isArray(richContent?.howToUse)
    ? richContent.howToUse.filter(
        (s) => typeof s === "string" && s.trim().length > 0,
      )
    : [];

  const howToJsonLd =
    howToSteps.length >= 2 ? howToSchema(t("title"), howToSteps) : null;

  const jsonLd = buildJsonLd(
    breadcrumbSchema([
      { name: homeLabel, url: localizedPath("/", locale) },
      { name: toolsLabel, url: localizedPath("/tools", locale) },
      { name: t("title"), url: localizedUrl },
    ]),
    webAppSchema(t("title"), PATH, t("metaDescription"), locale),
    faqSchema(faqs),
    ...(howToJsonLd ? [howToJsonLd] : []),
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ConvertPngToWebpTool
        title={t("title")}
        description={t("description")}
        faqs={faqs}
        richContent={richContent}
        locale={locale}
      />
    </>
  );
}
