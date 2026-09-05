import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ToolWrapper from "@/components/ToolWrapper";
import CurrencyConverterClient from "./CurrencyConverterClient";
import { buildAlternates } from "@/lib/i18nMeta";
import {
  buildJsonLd,
  webAppSchema,
  faqSchema,
  breadcrumbSchema,
} from "@/lib/schema";
import type { FaqItem } from "@/components/FaqSection";

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
  const t = await getTranslations({ locale, namespace: "convert.currency" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: buildAlternates("/tools/convert/currency-converter"),
    openGraph: {
      title: t("metaTitle"),
      url: "/tools/convert/currency-converter",
    },
  };
}

export default async function CurrencyConverterPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "convert.currency" });
  const faqs = t.raw("faqs") as FaqItem[];
  const richContent = t.raw("richContent") as RichContent;

  const jsonLd = buildJsonLd(
    webAppSchema(
      t("title"),
      "/tools/convert/currency-converter",
      t("metaDescription"),
      locale,
      "FinanceApplication",
    ),
    faqSchema(faqs),
    breadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Converter", url: "/tools/convert" },
      { name: t("title"), url: "/tools/convert/currency-converter" },
    ]),
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ToolWrapper
        title={t("title")}
        description={t("description")}
        breadcrumbLabel={t("title")}
        faqs={faqs}
        richContent={richContent}
      >
        <CurrencyConverterClient />
      </ToolWrapper>
    </>
  );
}
