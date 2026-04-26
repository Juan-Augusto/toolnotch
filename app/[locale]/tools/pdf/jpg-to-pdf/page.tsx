import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildAlternates } from "@/lib/i18nMeta";
import { webAppSchema, buildJsonLd } from "@/lib/schema";
import JpgToPdfTool from "./JpgToPdfTool";
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
  const t = await getTranslations({ locale, namespace: "pdf.jpgToPdf" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: buildAlternates("/tools/pdf/jpg-to-pdf"),
  };
}

export default async function JpgToPdfPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pdf.jpgToPdf" });
  const faqs = t.raw("faqs") as FaqItem[];
  const richContent = t.raw("richContent") as RichContent;
  const jsonLd = buildJsonLd(
    webAppSchema(t("title"), "/tools/pdf/jpg-to-pdf", t("metaDescription"), locale)
  );
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <JpgToPdfTool title={t("title")} description={t("description")} faqs={faqs} richContent={richContent} />
    </>
  );
}
