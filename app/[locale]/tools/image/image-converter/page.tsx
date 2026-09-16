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
import ImageConverterTool from "./ImageConverterTool";

const PATH = "/tools/image/image-converter";

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
    namespace: "image.imageConverter",
  });
  const localizedUrl = buildLocalizedUrl(PATH, locale);
  const ogLocale =
    locale === "pt" ? "pt_BR" : locale === "es" ? "es_ES" : "en_US";

  const keywords =
    locale === "pt"
      ? [
          "conversor de imagens",
          "converter imagem online",
          "converter foto",
          "converter imagens em lote",
          "converter jpg para png",
          "converter png para jpg",
          "converter imagem para webp",
          "converter para avif",
          "mudar formato de imagem",
          "converter varias fotos",
        ]
      : locale === "es"
        ? [
          "conversor de imagenes",
          "convertir imagen online",
          "convertir foto",
          "convertir imagenes en lote",
          "convertir jpg a png",
          "convertir png a jpg",
          "convertir imagen a webp",
          "convertir a avif",
          "cambiar formato de imagen",
          "convertir varias fotos",
        ]
        : [
          "image converter",
          "convert image online",
          "convert photo format",
          "batch image converter",
          "jpg to png converter",
          "png to jpg converter",
          "image to webp converter",
          "convert to avif",
          "bulk image converter",
          "change image format",
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

export default async function ImageConverterPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "image.imageConverter",
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
      <ImageConverterTool
        title={t("title")}
        description={t("description")}
        faqs={faqs}
        richContent={richContent}
        locale={locale}
      />
    </>
  );
}
