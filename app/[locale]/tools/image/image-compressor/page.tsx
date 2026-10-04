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
import ImageCompressorClient from "./ImageCompressorClient";

const PATH = "/tools/image/image-compressor";

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
  const t = await getTranslations({ locale, namespace: "image.compressor" });
  const localizedUrl = buildLocalizedUrl(PATH, locale);
  const ogLocale =
    locale === "pt" ? "pt_BR" : locale === "es" ? "es_ES" : "en_US";

  const keywords =
    locale === "pt"
      ? [
          "comprimir imagem",
          "comprimir foto",
          "reduzir tamanho de imagem",
          "comprimir imagem online",
          "otimizar imagem",
          "comprimir jpg",
          "comprimir png",
          "comprimir webp",
          "diminuir tamanho foto",
          "ferramenta comprimir fotos gratis",
        ]
      : locale === "es"
        ? [
            "comprimir imagen",
            "comprimir foto",
            "reducir tamano de imagen",
            "comprimir imagen online gratis",
            "optimizar imagen",
            "comprimir jpg",
            "comprimir png",
            "comprimir webp",
            "reducir peso de foto",
            "herramientas de imagen",
          ]
        : [
            "compress image",
            "compress photo",
            "image compressor online",
            "reduce image size",
            "shrink image file size",
            "compress jpg",
            "compress png",
            "compress webp",
            "free image optimizer",
            "photo compressor",
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
  };
}

export default async function ImageCompressorPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "image.compressor" });
  const faqs = t.raw("faqs") as FaqItem[];
  const richContent = t.raw("richContent") as RichContent;

  const breadcrumbs = [
    { name: "ToolNotch", url: buildLocalizedUrl("", locale) },
    {
      name: locale === "pt" ? "Ferramentas" : locale === "es" ? "Herramientas" : "Tools",
      url: buildLocalizedUrl("/tools", locale),
    },
    {
      name: locale === "pt" ? "Imagens" : locale === "es" ? "Imágenes" : "Images",
      url: buildLocalizedUrl("/tools/image", locale),
    },
    { name: t("title"), url: buildLocalizedUrl(PATH, locale) },
  ];

  const jsonLd = buildJsonLd(
    webAppSchema(
      t("title"),
      localizedPath(PATH, locale),
      t("metaDescription"),
      locale
    ),
    faqSchema(faqs),
    howToSchema(
      t("title"),
      richContent?.howToUse || []
    ),
    breadcrumbSchema(breadcrumbs)
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ImageCompressorClient
        title={t("title")}
        description={t("description")}
        faqs={faqs}
        richContent={richContent}
        locale={locale}
      />
    </>
  );
}
