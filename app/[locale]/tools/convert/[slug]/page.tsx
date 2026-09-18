import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { AppAccordion, AppTip } from "@/components/ui";
import ConvertToolHeader from "../components/ConvertToolHeader";
import AppConversionWidget from "@/components/converter/AppConversionWidget";
import AppConversionValuesTable from "@/components/converter/AppConversionValuesTable";
import AppRelatedConversions from "@/components/converter/AppRelatedConversions";
import AppAdUnit from "@/components/AppAdUnit";
import { COMMON_PAIRS } from "@/data/conversionPairs";
import {
  getPairContent,
  PRIORITY_PAIR_SLUGS,
} from "@/data/conversionPairContent";
import { convert, formatResult } from "@/lib/units";
import { UNIT_LABELS } from "@/data/units";
import { getLocalizedPairTitle } from "@/lib/conversionPairHelper";
import { buildAlternatesForLocale, localizedPath } from "@/lib/i18nMeta";
import { AD_SLOTS } from "@/lib/adSlots";
import {
  buildJsonLd,
  webAppSchema,
  faqSchema,
  breadcrumbSchema,
  buildLocalizedUrl,
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

  const localizedPairTitle = getLocalizedPairTitle(pair, locale);
  const title =
    content?.metaTitle ?? `${localizedPairTitle} — ToolNotch`;
  const description = content?.metaDescription ?? pair.description;
  const localizedUrl = buildLocalizedUrl(`/tools/convert/${slug}`, locale);
  const ogLocale =
    locale === "pt" ? "pt_BR" : locale === "es" ? "es_ES" : "en_US";

  const isPriority = (PRIORITY_PAIR_SLUGS as readonly string[]).includes(slug);

  return {
    title,
    description,
    ...(isPriority ? {} : { robots: { index: false, follow: true } }),
    alternates: buildAlternatesForLocale(`/tools/convert/${slug}`, locale),
    openGraph: {
      title: content?.h1 ?? localizedPairTitle,
      description,
      url: localizedUrl,
      siteName: "ToolNotch",
      locale: ogLocale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: content?.h1 ?? localizedPairTitle,
      description,
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
  const heading = content?.h1 ?? getLocalizedPairTitle(pair, locale);
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

  const homeLabel =
    locale === "pt" ? "Início" : locale === "es" ? "Inicio" : "Home";
  const toolsLabel =
    locale === "pt" ? "Ferramentas" : locale === "es" ? "Herramientas" : "Tools";
  const convertLabel =
    locale === "pt" ? "Conversores" : locale === "es" ? "Conversores" : "Converters";

  const jsonLd = buildJsonLd(
    webAppSchema(
      heading,
      `/tools/convert/${slug}`,
      content?.metaDescription ?? pair.description,
      locale,
    ),
    faqSchema(pageFaqs),
    breadcrumbSchema([
      { name: homeLabel, url: localizedPath("/", locale) },
      { name: toolsLabel, url: localizedPath("/tools", locale) },
      { name: convertLabel, url: localizedPath("/tools/convert", locale) },
      { name: heading, url: buildLocalizedUrl(`/tools/convert/${slug}`, locale) },
    ]),
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="container min-h-[calc(100vh-180px)] bg-background text-foreground py-3 sm:py-6 md:py-8">
        <div className="w-full">
          <ConvertToolHeader
            title={heading}
            description={intro}
            locale={locale}
            badges={[{ text: categoryName }]}
          />

          <section
            aria-label={heading}
            className="mb-10 sm:mb-14 w-full"
          >
            <AppConversionWidget
              category={pair.category}
              defaultFrom={pair.from}
              defaultTo={pair.to}
            />
          </section>

          <article className="space-y-6 sm:space-y-8 md:space-y-10 mb-6 sm:mb-8 md:mb-10 w-full font-mono">
            {content?.about && (
              <section aria-labelledby="about-heading">
                <h2
                  id="about-heading"
                  className="text-base sm:text-lg md:text-xl font-bold uppercase text-foreground mb-2 sm:mb-3"
                >
                  {t("slugPages.aboutHeading", {
                    from: fromLabel,
                    to: toLabel,
                  })}
                </h2>
                <p className="leading-relaxed text-label text-xs sm:text-sm">
                  {content.about}
                </p>
              </section>
            )}

            {content?.formula && (
              <section aria-labelledby="formula-heading">
                <h2
                  id="formula-heading"
                  className="text-base sm:text-lg md:text-xl font-bold uppercase text-foreground mb-2 sm:mb-3"
                >
                  {t("slugPages.formulaHeading")}
                </h2>
                <div className="p-3 sm:p-4 bg-tertiary border border-border rounded-[2px] text-center my-3">
                  <code className="text-sm sm:text-base font-bold text-foreground">
                    {content.formula}
                  </code>
                </div>
                {content.formulaNote && (
                  <p className="leading-relaxed text-label text-xs sm:text-sm">
                    {content.formulaNote}
                  </p>
                )}
              </section>
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

            {content?.scenarios && content.scenarios.length > 0 && (
              <section aria-labelledby="scenarios-heading">
                <h2
                  id="scenarios-heading"
                  className="text-base sm:text-lg md:text-xl font-bold uppercase text-foreground mb-3 sm:mb-4"
                >
                  {t("slugPages.scenariosHeading")}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3.5">
                  {content.scenarios.map((scenario) => (
                    <div
                      key={scenario.title}
                      className="p-3 sm:p-4 bg-tertiary border border-border rounded-[2px]"
                    >
                      <h3 className="text-xs sm:text-sm font-bold uppercase text-foreground mb-1.5">
                        {scenario.title}
                      </h3>
                      <p className="leading-relaxed text-label text-xs">
                        {scenario.text}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {content?.proTip && (
              <AppTip title={t("slugPages.proTipLabel")}>
                {content.proTip}
              </AppTip>
            )}

            {pageFaqs && pageFaqs.length > 0 && (
              <section
                aria-labelledby="faqs-heading"
                className="mb-6 sm:mb-8 md:mb-12"
              >
                <h2
                  id="faqs-heading"
                  className="text-base sm:text-lg md:text-xl font-bold uppercase text-foreground mb-3 sm:mb-4 md:mb-6"
                >
                  {locale === "pt"
                    ? "Perguntas Frequentes"
                    : locale === "es"
                      ? "Preguntas Frecuentes"
                      : "Frequently Asked Questions"}
                </h2>
                <AppAccordion
                  groups={pageFaqs.map((faq, index) => ({
                    id: `faq-${index}`,
                    name: faq.question,
                    content: (
                      <p className="leading-relaxed text-label text-xs sm:text-sm">
                        {faq.answer}
                      </p>
                    ),
                  }))}
                />
              </section>
            )}

            <div className="my-6">
              <AppAdUnit slot={AD_SLOTS.CONVERT_SLUG} />
            </div>

            <AppRelatedConversions
              currentSlug={slug}
              category={pair.category}
              locale={locale}
              heading={t("slugPages.relatedHeading", {
                category: categoryName,
              })}
            />
          </article>
        </div>
      </main>
    </>
  );
}
