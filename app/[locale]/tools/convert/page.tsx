import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import {
  Scale,
  Coins,
  Percent,
  ArrowRight,
  CookingPot,
  Plane,
  Hammer,
  GraduationCap,
} from "lucide-react";
import { buildAlternatesForLocale, localizedPath } from "@/lib/i18nMeta";
import {
  buildJsonLd,
  breadcrumbSchema,
  faqSchema,
  buildLocalizedUrl,
} from "@/lib/schema";
import { CATEGORY_LABELS } from "@/data/units";
import { COMMON_PAIRS } from "@/data/conversionPairs";
import { getLocalizedPairTitle } from "@/lib/conversionPairHelper";
import { AppBreadcrumb, AppBadge, AppAccordion } from "@/components/ui";

const PATH = "/tools/convert";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "convert.hub" });
  const localizedUrl = buildLocalizedUrl(PATH, locale);
  const ogLocale =
    locale === "pt" ? "pt_BR" : locale === "es" ? "es_ES" : "en_US";

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: buildAlternatesForLocale(PATH, locale),
    openGraph: {
      title: t("title"),
      description: t("metaDescription"),
      url: localizedUrl,
      locale: ogLocale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("metaDescription"),
    },
  };
}

export default async function ConvertHubPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "convert.hub" });
  const tc = await getTranslations({ locale, namespace: "convert.categories" });

  const homeLabel =
    locale === "pt" ? "Início" : locale === "es" ? "Inicio" : "Home";
  const toolsLabel =
    locale === "pt" ? "Ferramentas" : locale === "es" ? "Herramientas" : "Tools";
  const prefix = locale === "en" ? "" : `/${locale}`;

  const featuredPairs = COMMON_PAIRS.slice(0, 12);
  const categories = Object.keys(CATEGORY_LABELS).concat(["currency"]);

  const faqs = [
    { question: t("faqs.0.question"), answer: t("faqs.0.answer") },
    { question: t("faqs.1.question"), answer: t("faqs.1.answer") },
    { question: t("faqs.2.question"), answer: t("faqs.2.answer") },
    { question: t("faqs.3.question"), answer: t("faqs.3.answer") },
  ];

  const jsonLd = buildJsonLd(
    breadcrumbSchema([
      { name: homeLabel, url: localizedPath("/", locale) },
      { name: toolsLabel, url: localizedPath("/tools", locale) },
      { name: t("breadcrumb"), url: buildLocalizedUrl(PATH, locale) },
    ]),
    faqSchema(faqs)
  );

  const coreTools = [
    {
      id: "unitConverter",
      title: t("tools.unitConverter.title"),
      desc: t("tools.unitConverter.desc"),
      badge: t("badgeUnits"),
      href: `${prefix}/tools/convert/unit-converter`,
      icon: <Scale className="w-5 h-5 text-primary" />,
    },
    {
      id: "currencyConverter",
      title: t("tools.currencyConverter.title"),
      desc: t("tools.currencyConverter.desc"),
      badge: t("badgeCurrencies"),
      href: `${prefix}/tools/convert/currency-converter`,
      icon: <Coins className="w-5 h-5 text-primary" />,
    },
    {
      id: "percentageCalculator",
      title: t("tools.percentageCalculator.title"),
      desc: t("tools.percentageCalculator.desc"),
      badge:
        locale === "pt" ? "3 Modos" : locale === "es" ? "3 Modos" : "3 Modes",
      href: `${prefix}/tools/convert/percentage-calculator`,
      icon: <Percent className="w-5 h-5 text-primary" />,
    },
  ];

  const useCases = [
    {
      title: t("useCases.0.title"),
      desc: t("useCases.0.desc"),
      icon: <CookingPot className="w-5 h-5 text-primary shrink-0" />,
    },
    {
      title: t("useCases.1.title"),
      desc: t("useCases.1.desc"),
      icon: <Plane className="w-5 h-5 text-primary shrink-0" />,
    },
    {
      title: t("useCases.2.title"),
      desc: t("useCases.2.desc"),
      icon: <Hammer className="w-5 h-5 text-primary shrink-0" />,
    },
    {
      title: t("useCases.3.title"),
      desc: t("useCases.3.desc"),
      icon: <GraduationCap className="w-5 h-5 text-primary shrink-0" />,
    },
  ];

  const currencyCategoryLabel =
    locale === "pt" ? "Moedas" : locale === "es" ? "Monedas" : "Currency";

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="container min-h-[calc(100vh-180px)] bg-background text-foreground py-3 sm:py-6 md:py-8">
        <div className="w-full">
          {/* Breadcrumb */}
          <div className="w-full pb-2 sm:pb-3">
            <AppBreadcrumb
              items={[
                { label: homeLabel, href: prefix || "/" },
                { label: toolsLabel, href: `${prefix}/tools` },
                { label: t("breadcrumb"), current: true },
              ]}
            />
          </div>

          {/* Header */}
          <header className="mb-6 sm:mb-8 pt-1 sm:pt-2 pb-4 sm:pb-6 border-b border-border/80">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-foreground font-mono">
              {t("title")}
            </h1>
            <p className="leading-relaxed text-label mt-1.5 sm:mt-2 max-w-3xl text-xs sm:text-sm">
              {t("description")}
            </p>

            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-3 sm:mt-4">
              <AppBadge bg="bg-tertiary" text="text-foreground">
                {t("badgeUnits")}
              </AppBadge>
              <AppBadge bg="bg-tertiary" text="text-foreground">
                {t("badgeCurrencies")}
              </AppBadge>
              <AppBadge bg="bg-tertiary" text="text-foreground">
                {t("badgeFree")}
              </AppBadge>
              <AppBadge bg="bg-tertiary" text="text-foreground">
                {t("badgePrivate")}
              </AppBadge>
            </div>
          </header>

          {/* 1. Core Tools Grid */}
          <section
            aria-labelledby="core-tools-heading"
            className="mb-8 sm:mb-10 md:mb-12"
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div>
                <h2
                  id="core-tools-heading"
                  className="text-sm sm:text-base md:text-lg font-mono font-bold uppercase text-foreground"
                >
                  {t("coreToolsTitle")}
                </h2>
                <p className="text-xs text-label font-mono mt-0.5">
                  {t("coreToolsSubtitle")}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
              {coreTools.map((tool) => (
                <Link
                  key={tool.id}
                  href={tool.href}
                  className="group block p-4 sm:p-5 bg-tertiary border border-border rounded-[2px] hover:border-primary transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 rounded-[2px] bg-background border border-border flex items-center justify-center">
                      {tool.icon}
                    </div>
                    <span className="text-[10px] font-mono font-medium px-2 py-0.5 bg-background border border-border rounded-[2px] text-label group-hover:text-primary group-hover:border-primary/40 transition-colors">
                      {tool.badge}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm sm:text-base text-foreground group-hover:text-primary transition-colors mb-1.5 flex items-center justify-between">
                    <span>{tool.title}</span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
                  </h3>

                  <p className="text-xs text-label leading-relaxed font-mono">
                    {tool.desc}
                  </p>
                </Link>
              ))}
            </div>
          </section>

          {/* 2. Browse by Measurement Category */}
          <section
            aria-labelledby="categories-heading"
            className="mb-8 sm:mb-10 md:mb-12"
          >
            <h2
              id="categories-heading"
              className="text-sm sm:text-base font-mono font-bold uppercase text-foreground mb-3 sm:mb-4"
            >
              {t("categoriesTitle")}
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-2.5">
              {categories.map((cat) => {
                const label =
                  cat === "currency" ? currencyCategoryLabel : tc(cat);
                const href =
                  cat === "currency"
                    ? `${prefix}/tools/convert/currency-converter`
                    : `${prefix}/tools/convert/unit-converter`;

                return (
                  <Link
                    key={cat}
                    href={href}
                    className="p-3 bg-tertiary border border-border rounded-[2px] text-center hover:border-primary/60 hover:text-primary transition-colors cursor-pointer group"
                  >
                    <span className="block text-xs font-mono font-medium text-foreground group-hover:text-primary transition-colors truncate">
                      {label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* 3. Popular Conversions Grid */}
          <section
            aria-labelledby="popular-heading"
            className="mb-8 sm:mb-10 md:mb-12"
          >
            <h2
              id="popular-heading"
              className="text-sm sm:text-base font-mono font-bold uppercase text-foreground mb-3 sm:mb-4"
            >
              {t("popularTitle")}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-2.5">
              {featuredPairs.map((pair) => (
                <Link
                  key={pair.slug}
                  href={`${prefix}/tools/convert/${pair.slug}`}
                  className="px-3.5 py-2.5 bg-tertiary border border-border rounded-[2px] flex items-center justify-between hover:border-primary transition-colors text-xs font-mono text-foreground hover:text-primary group cursor-pointer"
                >
                  <span className="font-medium truncate mr-2">
                    {getLocalizedPairTitle(pair, locale)}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-label/50 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
                </Link>
              ))}
            </div>
          </section>

          {/* 4. Educational Guide & Common Use Cases */}
          <section
            aria-labelledby="guide-heading"
            className="mb-8 sm:mb-10 md:mb-12"
          >
            <div className="p-4 sm:p-6 bg-tertiary border border-border rounded-[2px] space-y-4 text-xs sm:text-sm font-mono text-label leading-relaxed mb-6">
              <h2
                id="guide-heading"
                className="text-sm sm:text-base font-bold uppercase text-foreground font-mono"
              >
                {t("guideTitle")}
              </h2>
              <p>{t("guideP1")}</p>
              <p>{t("guideP2")}</p>
              <p>{t("guideP3")}</p>
            </div>

            {/* Use Cases Grid */}
            <div>
              <h3 className="text-xs sm:text-sm font-mono font-bold uppercase text-foreground mb-3">
                {t("whenToUseTitle")}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                {useCases.map((uc, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-tertiary border border-border rounded-[2px] flex items-start gap-3"
                  >
                    <div className="w-7 h-7 rounded-[2px] bg-background border border-border flex items-center justify-center shrink-0 mt-0.5">
                      {uc.icon}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-foreground mb-1">
                        {uc.title}
                      </h4>
                      <p className="text-[11px] sm:text-xs text-label font-mono leading-relaxed">
                        {uc.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 5. Frequently Asked Questions (Accordion) */}
          {faqs.length > 0 && (
            <section
              aria-labelledby="faqs-heading"
              className="mb-8 sm:mb-12 font-mono"
            >
              <h2
                id="faqs-heading"
                className="text-sm sm:text-base font-mono font-bold uppercase text-foreground mb-3 sm:mb-4"
              >
                {locale === "pt"
                  ? "Perguntas Frequentes"
                  : locale === "es"
                    ? "Preguntas Frecuentes"
                    : "Frequently Asked Questions"}
              </h2>

              <AppAccordion
                groups={faqs.map((faq, index) => ({
                  id: `convert-hub-faq-${index}`,
                  name: faq.question,
                  content: (
                    <p className="leading-relaxed text-label font-mono text-xs sm:text-sm">
                      {faq.answer}
                    </p>
                  ),
                }))}
              />
            </section>
          )}
        </div>
      </main>
    </>
  );
}

