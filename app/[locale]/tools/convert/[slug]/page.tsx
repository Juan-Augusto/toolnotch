import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import AppToolWrapper from "@/components/AppToolWrapper";
import AppConversionWidget from "@/components/converter/AppConversionWidget";
import AppConversionValuesTable from "@/components/converter/AppConversionValuesTable";
import AppRelatedConversions from "@/components/converter/AppRelatedConversions";
import { COMMON_PAIRS } from "@/data/conversionPairs";
import {
  getPairContent,
  PRIORITY_PAIR_SLUGS,
} from "@/data/conversionPairContent";
import { convert, formatResult } from "@/lib/units";
import { UNIT_LABELS } from "@/data/units";
import { buildAlternates } from "@/lib/i18nMeta";
import { AD_SLOTS } from "@/lib/adSlots";
import {
  buildJsonLd,
  webAppSchema,
  faqSchema,
  breadcrumbSchema,
} from "@/lib/schema";
import { locales } from "@/i18n";
import type { FaqItem } from "@/components/AppFaqSection";

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

  const content = getPairContent(slug, locale);

  const title = content?.metaTitle ?? `${pair.title} — Free Online Converter`;
  const description = content?.metaDescription ?? pair.description;

  const isPriority = (PRIORITY_PAIR_SLUGS as readonly string[]).includes(slug);

  return {
    title,
    description,
    ...(isPriority ? {} : { robots: { index: false, follow: true } }),
    alternates: buildAlternates(`/tools/convert/${slug}`),
    openGraph: {
      title: content?.h1 ?? pair.title,
      description,
      url: `/tools/convert/${slug}`,
    },
  };
}

export default async function ConversionSlugPage({ params }: Props) {
  const { locale, slug } = await params;
  const pair = COMMON_PAIRS.find((p) => p.slug === slug);
  if (!pair) notFound();

  const t = await getTranslations({ locale, namespace: "convert" });
  const tw = await getTranslations({ locale, namespace: "toolWrapper" });

  const content = getPairContent(slug, locale);

  const featuredValue = formatResult(
    convert(1, pair.from, pair.to, pair.category),
  );
  const fromLabel = content?.fromLabel ?? UNIT_LABELS[pair.from] ?? pair.from;
  const toLabel = content?.toLabel ?? UNIT_LABELS[pair.to] ?? pair.to;
  const heading = content?.h1 ?? pair.title;
  const intro = content?.intro ?? pair.description;
  const formula =
    content?.formula ?? `1 ${fromLabel} = ${featuredValue} ${toLabel}`;

  const categoryName = t(`slugPages.categories.${pair.category}`);

  const pageFaqs: FaqItem[] = [
    {
      question: t("slugPages.faqs.howMany", { from: fromLabel, to: toLabel }),
      answer: `${t("slugPages.faqs.howManyAnswer", {
        from: fromLabel,
        value: featuredValue,
        to: toLabel,
      })} ${intro}`,
    },
    {
      question: t("slugPages.faqs.howTo", { from: fromLabel, to: toLabel }),
      answer: t("slugPages.faqs.howToAnswer", {
        from: fromLabel,
        to: toLabel,
        formula,
      }),
    },
    ...(content
      ? [
          {
            question: t("slugPages.faqs.formulaQuestion", {
              from: fromLabel,
              to: toLabel,
            }),
            answer: `${content.formula}. ${content.formulaNote}`,
          },
        ]
      : []),
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
      heading,
      `/tools/convert/${slug}`,
      content?.metaDescription ?? pair.description,
      locale,
    ),
    faqSchema(pageFaqs),
    breadcrumbSchema([
      { name: tw("breadcrumb.home"), url: "/" },
      { name: t("slugPages.breadcrumbConverter"), url: "/tools/convert" },
      { name: heading, url: `/tools/convert/${slug}` },
    ]),
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AppToolWrapper
        title={heading}
        description={intro}
        breadcrumbLabel={heading}
        faqs={pageFaqs}
        adSlot={AD_SLOTS.CONVERT_SLUG}
        noCardWrapper
      >
        <div className=" mb-6 text-center">
          <p
            className="text-lg font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            1 {fromLabel} ={" "}
            <strong>
              {featuredValue} {toLabel}
            </strong>
          </p>
        </div>

        <div className=" p-6">
          <AppConversionWidget
            category={pair.category}
            defaultFrom={pair.from}
            defaultTo={pair.to}
          />
        </div>

        {content && (
          <>
            <section className="mt-12">
              <h2 className="text-xl font-bold mb-3 section-heading">
                {t("slugPages.aboutHeading", { from: fromLabel, to: toLabel })}
              </h2>
              <p
                className="leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                {content.about}
              </p>
            </section>

            <section className="mt-12">
              <h2 className="text-xl font-bold mb-3 section-heading">
                {t("slugPages.formulaHeading")}
              </h2>
              <p
                className=" p-4 my-4 text-center font-mono text-base"
                style={{ color: "var(--text-primary)" }}
              >
                {content.formula}
              </p>
              <p
                className="leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                {content.formulaNote}
              </p>
            </section>
          </>
        )}

        <AppConversionValuesTable
          fromUnit={pair.from}
          toUnit={pair.to}
          category={pair.category}
          fromLabel={fromLabel}
          toLabel={toLabel}
          heading={t("slugPages.tableHeading", {
            from: fromLabel,
            to: toLabel,
          })}
          caption={t("slugPages.tableCaption", {
            from: fromLabel,
            to: toLabel,
          })}
        />

        {content && (
          <>
            <section className="mt-12">
              <h2 className="text-xl font-bold mb-4 section-heading">
                {t("slugPages.scenariosHeading")}
              </h2>
              <div className="space-y-5">
                {content.scenarios.map((scenario) => (
                  <div key={scenario.title}>
                    <h3
                      className="font-semibold mb-1"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {scenario.title}
                    </h3>
                    <p
                      className="leading-relaxed"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {scenario.text}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <div className=" mt-8">
              <p
                className="text-xs font-bold mb-1.5 uppercase tracking-widest"
                style={{ color: "var(--neon)" }}
              >
                {t("slugPages.proTipLabel")}
              </p>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                {content.proTip}
              </p>
            </div>
          </>
        )}

        <AppRelatedConversions
          currentSlug={slug}
          category={pair.category}
          locale={locale}
          heading={t("slugPages.relatedHeading", { category: categoryName })}
        />
      </AppToolWrapper>
    </>
  );
}
