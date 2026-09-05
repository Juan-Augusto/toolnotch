import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { buildAlternates } from "@/lib/i18nMeta";
import {
  buildJsonLd,
  webAppSchema,
  faqSchema,
  howToSchema,
  breadcrumbSchema,
} from "@/lib/schema";
import type { FaqItem } from "@/components/FaqSection";
import ToolWrapper from "@/components/ToolWrapper";
import InvoiceBuilder from "./InvoiceBuilder";

interface RichContent {
  whatIs: string;
  howToUse: string[];
  whyItMatters: string;
  proTip: string;
}

const PATH = "/tools/finance/invoice-generator";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "finance.invoiceGenerator",
  });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: buildAlternates(PATH),
  };
}

export default async function InvoiceGeneratorPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "finance.invoiceGenerator",
  });
  const faqs = t.raw("faqs") as FaqItem[];
  const richContent = t.raw("richContent") as RichContent;

  const jsonLd = buildJsonLd(
    webAppSchema(
      t("title"),
      PATH,
      t("metaDescription"),
      locale,
      "BusinessApplication",
    ),
    faqSchema(faqs),
    howToSchema("How to create a free invoice", [
      'Enter your business name and contact details in the "From" section.',
      'Fill in your client\'s name and address in the "Bill To" section.',
      "Add your line items with description, quantity, and rate. The amount calculates automatically.",
      "Set the tax rate, invoice date, and due date.",
      'Click "Download / Print PDF" and choose "Save as PDF" to download your invoice.',
    ]),
    breadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Finance Tools", url: "/tools/finance" },
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
        noCardWrapper
      >
        <InvoiceBuilder />
      </ToolWrapper>
    </>
  );
}
