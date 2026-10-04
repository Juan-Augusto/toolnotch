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
import UnitConverterClient from "./UnitConverterClient";

const PATH = "/tools/convert/unit-converter";

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
  const t = await getTranslations({ locale, namespace: "convert.unit" });
  const localizedUrl = buildLocalizedUrl(PATH, locale);
  const ogLocale =
    locale === "pt" ? "pt_BR" : locale === "es" ? "es_ES" : "en_US";

  const keywords =
    locale === "pt"
      ? [
          "conversor de unidades",
          "converter medidas",
          "converter metros em pes",
          "converter kg em libras",
          "converter celsius em fahrenheit",
          "conversor de comprimento",
          "conversor de peso",
          "conversor de temperatura",
          "tabela de conversao",
          "unidades de medida",
        ]
      : locale === "es"
        ? [
            "conversor de unidades",
            "convertir medidas",
            "convertir metros a pies",
            "convertir kg a libras",
            "convertir celsius a fahrenheit",
            "conversor de longitud",
            "conversor de peso",
            "conversor de temperatura",
            "unidades de medida",
          ]
        : [
            "unit converter",
            "convert units online",
            "convert meters to feet",
            "convert kg to lbs",
            "convert celsius to fahrenheit",
            "length converter",
            "weight converter",
            "temperature conversion",
            "metric to imperial converter",
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
    category: "utilities",
  };
}

export default async function UnitConverterPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "convert.unit" });
  const faqs = t.raw("faqs") as FaqItem[];
  const richContent = t.raw("richContent") as RichContent;

  const homeLabel =
    locale === "pt" ? "Início" : locale === "es" ? "Inicio" : "Home";
  const toolsLabel =
    locale === "pt" ? "Ferramentas" : locale === "es" ? "Herramientas" : "Tools";
  const convertLabel =
    locale === "pt" ? "Conversores" : locale === "es" ? "Conversores" : "Converters";
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
      { name: convertLabel, url: localizedPath("/tools/convert", locale) },
      { name: t("title"), url: localizedUrl },
    ]),
    webAppSchema(
      t("title"),
      PATH,
      t("metaDescription"),
      locale,
      "UtilitiesApplication",
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
      <UnitConverterClient
        title={t("title")}
        description={t("description")}
        faqs={faqs}
        richContent={richContent}
        locale={locale}
      />
    </>
  );
}
