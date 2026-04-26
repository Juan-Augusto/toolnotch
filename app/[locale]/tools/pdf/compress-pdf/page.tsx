import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildAlternates } from "@/lib/i18nMeta";
import { buildJsonLd, webAppSchema, faqSchema } from "@/lib/schema";
import type { FaqItem } from "@/components/FaqSection";
import CompressTool from "./CompressTool";

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
  const t = await getTranslations({ locale, namespace: "pdf.compress" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: buildAlternates("/tools/pdf/compress-pdf"),
  };
}

export default async function CompressPDFPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pdf.compress" });
  const faqs = t.raw("faqs") as FaqItem[];
  const richContent = t.raw("richContent") as RichContent;

  const jsonLd = buildJsonLd(
    webAppSchema(t("title"), "/tools/pdf/compress-pdf", t("metaDescription"), locale),
    faqSchema(faqs),
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CompressTool
        title={t("title")}
        description={t("description")}
        faqs={faqs}
        richContent={richContent}
      />
    </>
  );
}
