import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import ToolWrapper from "@/components/ToolWrapper";
import ConversionWidget from "@/components/converter/ConversionWidget";
import { COMMON_PAIRS } from "@/data/conversionPairs";
import { convert, formatResult } from "@/lib/units";
import { UNIT_LABELS } from "@/data/units";
import { buildAlternates } from "@/lib/i18nMeta";
import {
  buildJsonLd,
  webAppSchema,
  faqSchema,
  breadcrumbSchema,
} from "@/lib/schema";
import { locales } from "@/i18n";
import type { FaqItem } from "@/components/FaqSection";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    COMMON_PAIRS.map((p) => ({ locale, slug: p.slug })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const pair = COMMON_PAIRS.find((p) => p.slug === slug);
  if (!pair) return {};

  const t = await getTranslations({ locale, namespace: "convert.slugPages.pairs" });
  const title = t.has(`${slug}.title`) ? t(`${slug}.title`) : pair.title;
  const description = t.has(`${slug}.description`) ? t(`${slug}.description`) : pair.description;

  return {
    title: `${title} — Free Online Converter | ToolNotch`,
    description: description,
    alternates: buildAlternates(`/tools/convert/${slug}`),
    openGraph: {
      title: title,
      description: description,
      url: `/tools/convert/${slug}`,
    },
  };
}

export default async function ConversionSlugPage({ params }: Props) {
  const { locale, slug } = await params;
  const pair = COMMON_PAIRS.find((p) => p.slug === slug);
  if (!pair) notFound();

  const t = await getTranslations({ locale, namespace: "convert" });
  const tPairs = await getTranslations({ locale, namespace: "convert.slugPages.pairs" });
  const tu = await getTranslations({ locale, namespace: "convert.units" });

  const title = tPairs.has(`${slug}.title`) ? tPairs(`${slug}.title`) : pair.title;
  const description = tPairs.has(`${slug}.description`) ? tPairs(`${slug}.description`) : pair.description;

  const featuredValue = formatResult(
    convert(1, pair.from, pair.to, pair.category),
  );
  const fromLabel = tu.has(pair.from) ? tu(pair.from) : (UNIT_LABELS[pair.from] ?? pair.from);
  const toLabel = tu.has(pair.to) ? tu(pair.to) : (UNIT_LABELS[pair.to] ?? pair.to);

  const pageFaqs: FaqItem[] = [
    {
      question: t("slugPages.faqs.howMany", { from: fromLabel, to: toLabel }),
      answer: `1 ${fromLabel} = ${featuredValue} ${toLabel}. ${pair.description}`,
    },
    {
      question: t("slugPages.faqs.howTo", { from: fromLabel, to: toLabel }),
      answer: `Use the converter above. Enter any value in the ${fromLabel} field and the result in ${toLabel} appears instantly.`,
    },
    {
      question: t("slugPages.faqs.accurate"),
      answer: t("slugPages.faqs.accurateAnswer"),
    },
    {
      question: t("slugPages.faqs.offline"),
      answer: t("slugPages.faqs.offlineAnswer"),
    },
  ];

  const jsonLd = buildJsonLd(
    webAppSchema(
      title,
      `/tools/convert/${slug}`,
      description,
      locale,
    ),
    faqSchema(pageFaqs),
    breadcrumbSchema([
      { name: "Home", url: "/" },
      { name: "Converter", url: "/tools/convert" },
      { name: title, url: `/tools/convert/${slug}` },
    ]),
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ToolWrapper
        title={title}
        description={description}
        breadcrumbLabel={title}
        faqs={pageFaqs}
        adSlot="1234567890"
      >

        <ConversionWidget
          category={pair.category}
          defaultFrom={pair.from}
          defaultTo={pair.to}
        />
      </ToolWrapper>
    </>
  );
}
