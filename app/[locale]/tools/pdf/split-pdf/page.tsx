import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildAlternates } from "@/lib/i18nMeta";
import { buildJsonLd, webAppSchema, faqSchema } from "@/lib/schema";
import type { FaqItem } from "@/components/FaqSection";
import SplitTool from "./SplitTool";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pdf.split" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: buildAlternates("/tools/pdf/split-pdf"),
  };
}

export default async function SplitPDFPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pdf.split" });
  const faqs = t.raw("faqs") as FaqItem[];

  const jsonLd = buildJsonLd(
    webAppSchema(t("title"), "/tools/pdf/split-pdf", t("metaDescription"), locale),
    faqSchema(faqs),
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SplitTool
        title={t("title")}
        description={t("description")}
        faqs={faqs}
      />
    </>
  );
}
