import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildAlternates } from "@/lib/i18nMeta";
import { buildJsonLd, webAppSchema, faqSchema } from "@/lib/schema";
import type { FaqItem } from "@/components/FaqSection";
import PdfToJpgTool from "./PdfToJpgTool";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pdf.pdfToJpg" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: buildAlternates("/tools/pdf/pdf-to-jpg"),
  };
}

export default async function PdfToJpgPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pdf.pdfToJpg" });
  const faqs = t.raw("faqs") as FaqItem[];

  const jsonLd = buildJsonLd(
    webAppSchema(t("title"), "/tools/pdf/pdf-to-jpg", t("metaDescription"), locale),
    faqSchema(faqs),
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PdfToJpgTool
        title={t("title")}
        description={t("description")}
        faqs={faqs}
      />
    </>
  );
}
