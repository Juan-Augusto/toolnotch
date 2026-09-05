import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ToolWrapper from "@/components/ToolWrapper";
import { buildAlternates } from "@/lib/i18nMeta";
import {
  buildJsonLd,
  webAppSchema,
  faqSchema,
  breadcrumbSchema,
} from "@/lib/schema";
import type { FaqItem } from "@/components/FaqSection";
import PercentageCalculatorClient from "./PercentageCalculatorClient";

interface RichContent {
  whatIs: string;
  howToUse: string[];
  whyItMatters: string;
  proTip: string;
}

const PATH = "/tools/convert/percentage-calculator";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "percentage" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: buildAlternates(PATH),
    openGraph: { title: t("metaTitle"), url: PATH },
  };
}

export default async function PercentageCalculatorPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "percentage" });
  const faqs = t.raw("faqs") as FaqItem[];
  const richContent = t.raw("richContent") as RichContent;

  const jsonLd = buildJsonLd(
    webAppSchema(t("title"), PATH, t("metaDescription"), locale),
    faqSchema(faqs),
    breadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Converter", url: "/tools/convert" },
      { name: t("title"), url: PATH },
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
        <PercentageCalculatorClient
          tabs={t.raw("tabs") as Record<string, string>}
          percentOf={t.raw("percentOf") as Record<string, string>}
          whatPercent={t.raw("whatPercent") as Record<string, string>}
          percentChange={t.raw("percentChange") as Record<string, string>}
          calculate={t("calculate")}
          clear={t("clear")}
        />
      </ToolWrapper>
    </>
  );
}
